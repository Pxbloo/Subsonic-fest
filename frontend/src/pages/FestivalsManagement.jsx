import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import BaseCard from '@/components/ui/BaseCard';
import API_BASE_URL from '@/config/api';
import {getAuth} from "firebase/auth";
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx';

// --- 1. MÓDULO: INFORMACIÓN GENERAL ---
const GeneralInfoForm = ({ data, onChange }) => (
  <BaseCard className="border-l-4 border-l-emerald-500 animate-in fade-in duration-500">
    <h2 className="text-xl font-black text-subsonic-accent uppercase mb-6">Información General</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Input label="Título" value={data.title} onChange={e => onChange({...data, title: e.target.value})} required />
      <Input label="Fecha Visible" placeholder="Ej: 15-17 Jul" value={data.date} onChange={e => onChange({...data, date: e.target.value})} required />
      <Input label="Fecha Técnica" type="date" value={data.startDate} onChange={e => onChange({...data, startDate: e.target.value})} required />
    </div>
    <div className="mt-6">
      <label className="block text-xs font-montserrat text-subsonic-muted uppercase tracking-widest mb-2 ml-1">Descripción</label>
      <textarea 
        className="w-full bg-subsonic-bg border border-subsonic-border p-4 rounded-xl text-subsonic-text text-sm focus:border-subsonic-accent outline-none min-h-[100px]"
        value={data.description || ''}
        onChange={e => onChange({...data, description: e.target.value})}
      />
    </div>
  </BaseCard>
);

const normalizeFestivalGrounds = (festival, availableGrounds = []) => {
  if (Array.isArray(festival?.grounds) && festival.grounds.length > 0) {
    return festival.grounds
      .map((ground) => ({
        id: String(ground.id ?? ''),
        name: String(ground.name ?? '').trim(),
        area: ground.area ?? '',
        capacity: ground.capacity ?? 0,
        status: ground.status ?? ''
      }))
      .filter((ground) => ground.id || ground.name);
  }

  const locationNames = String(festival?.location || '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  return locationNames.map((name) => {
    const existingGround = availableGrounds.find((ground) => ground.name === name);
    if (existingGround) {
      return {
        id: String(existingGround.id),
        name: existingGround.name,
        area: existingGround.area ?? '',
        capacity: existingGround.capacity ?? 0,
        status: existingGround.status ?? ''
      };
    }

    return {
      id: `legacy-${name}`,
      name,
      area: '',
      capacity: 0,
      status: ''
    };
  });
};

const formatFestivalLocation = (grounds = []) => grounds.map((ground) => ground.name).join(', ');

// --- 2. MÓDULO: GESTIÓN DE RECINTO (GROUND) ---
const GroundManager = ({ grounds, selectedGrounds, onAddGround, onRemoveGround }) => (
  <BaseCard className="border-l-4 border-l-cyan-500 animate-in fade-in duration-500 delay-150">
    <h2 className="text-xl font-black text-white uppercase mb-6">Recintos (Grounds)</h2>
    <select
      className="w-full bg-subsonic-bg border border-subsonic-border p-3 rounded-xl text-subsonic-text text-sm outline-none focus:border-subsonic-accent mb-6 disabled:opacity-60"
      onChange={(e) => onAddGround(e.target.value)}
      value=""
      disabled={grounds.length === 0}
    >
      <option value="" disabled>
        {grounds.length > 0 ? 'Añadir recinto desde la base de datos...' : 'No hay recintos disponibles en la base de datos'}
      </option>
      {grounds.map((ground) => (
        <option key={ground.id} value={ground.id}>
          {ground.name}{ground.area ? ` - ${ground.area}` : ''}
        </option>
      ))}
    </select>

    {selectedGrounds.length === 0 ? (
      <div className="py-6 text-center border-2 border-dashed border-subsonic-border rounded-2xl">
        <p className="text-subsonic-muted text-[10px] font-bold uppercase tracking-widest">Debes seleccionar al menos 1 recinto</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {selectedGrounds.map((ground, index) => (
          <div key={`${ground.id}-${index}`} className="flex justify-between items-center bg-subsonic-navfooter border border-subsonic-border p-3 rounded-xl group hover:border-subsonic-accent transition-all">
            <div className="overflow-hidden pr-4">
              <p className="text-[10px] font-black text-white uppercase truncate">{ground.name}</p>
              <p className="text-[10px] text-subsonic-muted uppercase tracking-wider mt-1 truncate">
                {`${ground.area || 'Área no definida'} • Capacidad: ${ground.capacity || 0} • Estado: ${ground.status || 'n/d'}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemoveGround(ground.id)}
              className="text-subsonic-muted hover:text-red-500 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    )}
  </BaseCard>
);

// --- 3. MÓDULO: GESTIÓN DE CARTELERA (LINEUP) ---
const LineupManager = ({ lineup, artists, onAdd, onRemove }) => (
  <BaseCard className="border-l-4 border-l-purple-500 animate-in fade-in duration-500 delay-300">
    <h2 className="text-xl font-black text-white uppercase mb-6">Cartelera (Lineup)</h2>
    <select 
      className="w-full bg-subsonic-bg border border-subsonic-border p-3 rounded-xl text-subsonic-text text-sm outline-none focus:border-subsonic-accent mb-6"
      onChange={(e) => onAdd(e.target.value)}
      value=""
    >
      <option value="" disabled>Añadir artista desde la base de datos...</option>
      {artists.map(art => <option key={art.id} value={art.id}>{art.name} ({art.genre})</option>)}
    </select>
    {lineup && lineup.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {lineup.map((artist, index) => (
          <div key={index} className="flex justify-between items-center bg-subsonic-navfooter border border-subsonic-border p-3 rounded-xl group hover:border-subsonic-accent transition-all">
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white uppercase truncate">{artist.name}</p>
            </div>
            <button type="button" onClick={() => onRemove(index)} className="text-subsonic-muted hover:text-red-500 transition-colors">✕</button>
          </div>
        ))}
      </div>
    ) : (
      <div className="py-6 text-center border-2 border-dashed border-subsonic-border rounded-2xl">
        <p className="text-subsonic-muted text-[10px] font-bold uppercase tracking-widest">Debes seleccionar al menos 1 artista en la cartelera</p>
      </div>
    )}
  </BaseCard>
);

// --- 4. MÓDULO: GESTIÓN DE TICKETS ---
const TicketManager = ({ tickets, templates, onAddTemplate, onRemove }) => (
  <BaseCard className="border-l-4 border-l-subsonic-accent animate-in fade-in duration-500 delay-500">
    <h2 className="text-xl font-black text-white uppercase mb-6">Entradas y Precios</h2>
    <select 
      className="w-full bg-subsonic-bg border border-subsonic-border p-3 rounded-xl text-subsonic-text text-sm outline-none focus:border-subsonic-accent mb-6"
      onChange={(e) => onAddTemplate(e.target.value)}
      value=""
    >
      <option value="" disabled>Añadir entrada desde la base de datos...</option>
      {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.price}€)</option>)}
    </select>
    
    {tickets && tickets.length > 0 ? (
      <div className="space-y-4">
        {tickets.map((ticket, index) => (
          <div key={index} className="p-4 bg-subsonic-bg/50 border border-subsonic-border rounded-xl relative group">
            <button type="button" onClick={() => onRemove(index)} className="absolute top-2 right-2 text-subsonic-muted hover:text-red-500 transition-colors">✕</button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Tipo" value={ticket.name} readOnly />
              <Input label="Precio" value={`${ticket.price}€`} readOnly />
              <Input
                label="Beneficios"
                value={Array.isArray(ticket.features) ? ticket.features.join(', ') : ticket.features || ''}
                readOnly
              />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="py-6 text-center border-2 border-dashed border-subsonic-border rounded-2xl">
        <p className="text-subsonic-muted text-[10px] font-bold uppercase tracking-widest">Debes seleccionar al menos 1 entrada</p>
      </div>
    )}
  </BaseCard>
);

// --- COMPONENTE PRINCIPAL ---
const FestivalsManagement = () => {
  const [festivals, setFestivals] = useState([]);
  const [availableArtists, setAvailableArtists] = useState([]);
  const [availableGrounds, setAvailableGrounds] = useState([]);
  const [ticketTemplates, setTicketTemplates] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [festivalToDelete, setFestivalToDelete] = useState(null);
  const [currentFestival, setCurrentFestival] = useState({
    title: '', date: '', startDate: '', location: '', description: '', tickets: [], lineup: [], grounds: []
  });
  const [canSubmit, setCanSubmit] = useState(true);

  const API_URL = API_BASE_URL;

  const fetchData = async () => {
    try {
      const [fRes, aRes, gRes, tRes] = await Promise.all([
        fetch(`${API_URL}/festivals`),
        fetch(`${API_URL}/artists`),
        fetch(`${API_URL}/grounds`),
        fetch(`${API_URL}/ticketTemplates`)
      ]);
      
      if (fRes.ok) setFestivals(await fRes.json());
      if (aRes.ok) setAvailableArtists(await aRes.json());
      if (gRes && gRes.ok) setAvailableGrounds(await gRes.json());
      if (tRes && tRes.ok) setTicketTemplates(await tRes.json());
    } catch (err) {
      console.error("Error cargando datos de la API:", err);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e) => {
        e.preventDefault();
    
        if (!canSubmit) {
          alert('Por favor, espera antes de hacer más peticiones.');
          return;
        }
        setCanSubmit(false);

        const auth = getAuth();
        const currentUser = auth.currentUser;

        const token = await currentUser.getIdToken();

        const normalizedLineup = (currentFestival.lineup || [])
            .filter((artist) => artist?.id || artist?.name)
            .map((artist) => ({
                id: String(artist.id || ''),
                name: String(artist.name || ''),
                genre: String(artist.genre || '')
            }));

        const normalizedTickets = (currentFestival.tickets || [])
            .filter((ticket) => ticket?.name)
            .map((ticket) => ({
                name: String(ticket.name || ''),
                price: Number(ticket.price || 0),
                features: Array.isArray(ticket.features) ? ticket.features : []
            }));

        const normalizedGrounds = (currentFestival.grounds || [])
            .filter((ground) => ground?.name)
            .map((ground) => ({
                id: String(ground.id || ''),
                name: String(ground.name),
                area: ground.area || '',
                capacity: Number(ground.capacity || 0),
                status: ground.status || ''
            }));

        if (normalizedGrounds.length < 1) {
            alert('Debes seleccionar al menos 1 recinto para el festival.');
            return;
        }

        if (normalizedLineup.length < 1) {
            alert('Debes seleccionar al menos 1 artista en la cartelera.');
            return;
        }

        if (normalizedTickets.length < 1) {
            alert('Debes seleccionar al menos 1 entrada para el festival.');
            return;
        }

        const isNew = !currentFestival.id;
        const festivalToSave = {
            ...currentFestival,
            id: isNew
                ? currentFestival.title.trim().toLowerCase().replace(/\s+/g, '-')
                : currentFestival.id,
            lineup: normalizedLineup,
            tickets: normalizedTickets,
            grounds: normalizedGrounds,
            location: formatFestivalLocation(normalizedGrounds)
        };

        const method = isNew ? 'POST' : 'PUT';
        const url = isNew ? `${API_BASE_URL}/festivals` : `${API_BASE_URL}/festivals/${currentFestival.id}`;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(festivalToSave)
            });

            if (response.ok) {
                setIsEditing(false);
                fetchData();
            } else {
                const errorText = await response.text();
                console.error('Error al guardar festival:', response.status, errorText);
            }
        } catch (err) {
            console.error("Error al guardar festival:", err);
        }
        setCanSubmit(true);
  };

  const handleDelete = async (festival) => {
      if (!canSubmit) {
          alert('Por favor, espera antes de hacer más peticiones.');
          return;
      }
      setCanSubmit(false);
      if (!festivals) return; 

      try {
          const auth = getAuth();
          const currentUser = auth.currentUser;

          const token = await currentUser.getIdToken();
          const response = await fetch(`${API_BASE_URL}/festivals/${festival.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
          });
          if (!response.ok){
              console.error('Failed to delete artist:', response.statusText);
          }
          fetchData();
      } catch (err) {
        console.error("Error al eliminar festival:", err);
      }
      setCanSubmit(true);

  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6">
      <header className="flex justify-between items-center border-b border-subsonic-border pb-6">
        <div>
          <h1 className="text-4xl font-black text-subsonic-text uppercase tracking-tighter">Gestión de Festivales</h1>
          <p className="text-subsonic-muted text-[10px] uppercase tracking-widest mt-1">Conectado a Base de Datos Local</p>
        </div>
        {!isEditing && (
          <Button 
            variant="primarySmall" 
            onClick={() => {
              setIsEditing(true); 
              setCurrentFestival({ title: '', date: '', startDate: '', location: '', description: '', tickets: [], lineup: [], grounds: [] });
            }}
          >
            Nuevo Festival
          </Button>
        )}
      </header>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <GeneralInfoForm data={currentFestival} onChange={setCurrentFestival} />

          <GroundManager
            grounds={availableGrounds}
            selectedGrounds={currentFestival.grounds || []}
            onAddGround={(groundId) => {
              const ground = availableGrounds.find((item) => String(item.id) === String(groundId));
              if (!ground) return;

              const alreadyAdded = (currentFestival.grounds || []).some((item) => String(item.id) === String(ground.id));
              if (alreadyAdded) {
                alert('Este recinto ya ha sido añadido.');
                return;
              }

              setCurrentFestival({
                ...currentFestival,
                grounds: [
                  ...(currentFestival.grounds || []),
                  {
                    id: String(ground.id),
                    name: ground.name,
                    area: ground.area || '',
                    capacity: ground.capacity || 0,
                    status: ground.status || ''
                  }
                ]
              });
            }}
            onRemoveGround={(groundId) => setCurrentFestival({
              ...currentFestival,
              grounds: (currentFestival.grounds || []).filter((item) => String(item.id) !== String(groundId))
            })}
          />

          <LineupManager 
            lineup={currentFestival.lineup} 
            artists={availableArtists} 
            onAdd={(id) => {
              const art = availableArtists.find(a => a.id === id);
              if (art && !currentFestival.lineup.some(a => a.name === art.name)) {
                setCurrentFestival({...currentFestival, lineup: [...currentFestival.lineup, { id: art.id, name: art.name, genre: art.genre }]});
              }
            }} 
            onRemove={(idx) => setCurrentFestival({...currentFestival, lineup: currentFestival.lineup.filter((_, i) => i !== idx)})}
          />
          
          <TicketManager 
            tickets={currentFestival.tickets} 
            templates={ticketTemplates}
            onAddTemplate={(tid) => {
              const t = ticketTemplates.find(tem => String(tem.id) === String(tid));
              if (t) {
                const isDuplicate = currentFestival.tickets.some(tic => tic.name === t.name && tic.price === t.price);
                
                if (isDuplicate) {
                  alert("Esta entrada ya ha sido añadida.");
                  return;
                }

                setCurrentFestival({
                  ...currentFestival, 
                  tickets: [...currentFestival.tickets, { 
                    name: t.name, 
                    price: t.price, 
                    features: t.features 
                  }]
                });
              }
            }}
            onRemove={(idx) => setCurrentFestival({...currentFestival, tickets: currentFestival.tickets.filter((_, i) => i !== idx)})}
          />

          <div className="flex gap-4 sticky bottom-4 bg-subsonic-bg/80 backdrop-blur-md p-4 rounded-2xl border border-subsonic-border shadow-2xl z-10">
            <Button type="submit" variant="primary" className="flex-1">Guardar Festival</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>Cancelar</Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {festivals.map(fest => (
            <div key={fest.id} className="bg-subsonic-navfooter border border-subsonic-border p-6 rounded-2xl flex justify-between items-center group hover:border-subsonic-accent transition-all">
              <div>
                <h3 className="text-xl font-black text-subsonic-text uppercase">{fest.title}</h3>
                <p className="text-xs text-subsonic-muted font-bold uppercase tracking-widest">{fest.date} • {fest.location}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCurrentFestival({
                      ...fest,
                      grounds: normalizeFestivalGrounds(fest, availableGrounds)
                    });
                    setIsEditing(true);
                  }}
                >
                  Editar
                </Button>
                <Button 
                  variant="danger" 
                  className="text-xs px-4" 
                  onClick={() => setFestivalToDelete(fest)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
            <ConfirmDialog
                isOpen={!!festivalToDelete}
                onClose={() => setFestivalToDelete(null)}
                onConfirm={handleDelete}
                title="Eliminar festival"
                message={`¿Estás seguro de que deseas eliminar a "${festivalToDelete?.title}"? Esta acción no se puede deshacer.`}
                user={festivalToDelete}
            />
        </div>
      )}
    </div>
  );
};

export default FestivalsManagement;