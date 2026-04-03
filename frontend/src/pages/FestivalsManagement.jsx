import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import BaseCard from '@/components/ui/BaseCard';
import API_BASE_URL from '@/config/api';

// --- 1. MÓDULO: INFORMACIÓN GENERAL ---
const GeneralInfoForm = ({ data, onChange }) => (
  <BaseCard className="border-l-4 border-l-emerald-500 animate-in fade-in duration-500">
    <h2 className="text-xl font-black text-subsonic-accent uppercase mb-6">Información General</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input label="Título" value={data.title} onChange={e => onChange({...data, title: e.target.value})} required />
      <Input label="Ubicación" value={data.location} onChange={e => onChange({...data, location: e.target.value})} required />
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

// --- 2. MÓDULO: GESTIÓN DE CARTELERA (LINEUP) ---
const LineupManager = ({ lineup, artists, onAdd, onRemove }) => (
  <BaseCard className="border-l-4 border-l-purple-500 animate-in fade-in duration-500 delay-150">
    <h2 className="text-xl font-black text-white uppercase mb-6">Cartelera (Lineup)</h2>
    <select 
      className="w-full bg-subsonic-bg border border-subsonic-border p-3 rounded-xl text-subsonic-text text-sm outline-none focus:border-subsonic-accent mb-6"
      onChange={(e) => onAdd(e.target.value)}
      value=""
    >
      <option value="" disabled>Añadir artista desde la base de datos...</option>
      {artists.map(art => <option key={art.id} value={art.id}>{art.name} ({art.genre})</option>)}
    </select>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {lineup && lineup.map((artist, index) => (
        <div key={index} className="flex justify-between items-center bg-subsonic-navfooter border border-subsonic-border p-3 rounded-xl group hover:border-subsonic-accent transition-all">
          <div className="overflow-hidden">
            <p className="text-[10px] font-black text-white uppercase truncate">{artist.name}</p>
          </div>
          <button type="button" onClick={() => onRemove(index)} className="text-subsonic-muted hover:text-red-500 transition-colors">✕</button>
        </div>
      ))}
    </div>
  </BaseCard>
);

// --- 3. MÓDULO: GESTIÓN DE TICKETS ---
const TicketManager = ({ tickets, templates, onAddTemplate, onRemove }) => (
  <BaseCard className="border-l-4 border-l-subsonic-accent animate-in fade-in duration-500 delay-300">
    <h2 className="text-xl font-black text-white uppercase mb-6">Entradas y Precios</h2>
    <select 
      className="w-full bg-subsonic-bg border border-subsonic-border p-3 rounded-xl text-subsonic-text text-sm outline-none focus:border-subsonic-accent mb-6"
      onChange={(e) => onAddTemplate(e.target.value)}
      value=""
    >
      <option value="" disabled>Añadir entrada desde plantillas guardadas...</option>
      {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.price}€)</option>)}
    </select>
    
    <div className="space-y-4">
      {tickets && tickets.map((ticket, index) => (
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
  </BaseCard>
);

// --- COMPONENTE PRINCIPAL ---
const FestivalsManagement = () => {
  const [festivals, setFestivals] = useState([]);
  const [availableArtists, setAvailableArtists] = useState([]);
  const [ticketTemplates, setTicketTemplates] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFestival, setCurrentFestival] = useState({
    title: '', date: '', startDate: '', location: '', description: '', tickets: [], lineup: []
  });

  const API_URL = API_BASE_URL;

  const fetchData = async () => {
    try {
      const [fRes, aRes, tRes] = await Promise.all([
        fetch(`${API_URL}/festivals`),
        fetch(`${API_URL}/artists`),
        fetch(`${API_URL}/ticketTemplates`)
      ]);
      
      if (fRes.ok) setFestivals(await fRes.json());
      if (aRes.ok) setAvailableArtists(await aRes.json());
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
    const isNew = !currentFestival.id;
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? `${API_URL}/festivals` : `${API_URL}/festivals/${currentFestival.id}`;
    
    try {
      await fetch(url, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(currentFestival)
      });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error("Error al guardar festival:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este festival?")) {
      try {
        await fetch(`${API_URL}/festivals/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error("Error al eliminar festival:", err);
      }
    }
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
              setCurrentFestival({ title: '', date: '', startDate: '', location: '', description: '', tickets: [], lineup: [] });
            }}
          >
            Nuevo Festival
          </Button>
        )}
      </header>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <GeneralInfoForm data={currentFestival} onChange={setCurrentFestival} />
          
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
                <Button variant="ghost" onClick={() => { setCurrentFestival(fest); setIsEditing(true); }}>Editar</Button>
                <Button 
                  variant="danger" 
                  className="text-xs px-4" 
                  onClick={() => handleDelete(fest.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FestivalsManagement;