import React, { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SearchBar from '@/components/ui/SearchBar.jsx';
import API_BASE_URL from '@/config/api';
import { getAuth } from 'firebase/auth';
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx';

const DEFAULT_FESTIVAL_IMAGE = 'https://www.boombasticfestival.com/images/passes/abono-vip-pass.jpg';

const emptyFestival = {
  id: '',
  title: '',
  date: '',
  startDate: '',
  location: '',
  image: '',
  description: '',
  tickets: [],
  lineup: [],
  grounds: []
};

const normalizeFestivalId = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const normalizeFestivalGrounds = (festival, availableGrounds = []) => {
  if (Array.isArray(festival?.grounds) && festival.grounds.length > 0) {
    return festival.grounds
      .map((ground) => ({
        id: String(ground.id ?? ''),
        name: String(ground.name ?? '').trim(),
        area: ground.area ?? '',
        capacity: Number(ground.capacity ?? 0),
        status: ground.status ?? ''
      }))
      .filter((ground) => ground.id || ground.name);
  }

  const locationNames = String(festival?.location || '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  return locationNames.map((name) => {
    const existingGround = availableGrounds.find((ground) => String(ground.name) === String(name));

    if (existingGround) {
      return {
        id: String(existingGround.id),
        name: existingGround.name,
        area: existingGround.area ?? '',
        capacity: Number(existingGround.capacity ?? 0),
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

const GeneralInfoForm = ({ data, onChange }) => (
  <section className="rounded-xl border border-subsonic-border bg-subsonic-surface/40 p-5 space-y-4">
    <h3 className="text-sm font-black uppercase tracking-wide text-subsonic-accent">Información General</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Título"
        value={data.title}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
        placeholder="Boombastic Asturias"
        required
      />
      <Input
        label="ID"
        value={data.id}
        onChange={(e) => onChange({ ...data, id: e.target.value })}
        placeholder="boombastic-asturias"
      />
      <Input
        label="Fecha visible"
        value={data.date}
        onChange={(e) => onChange({ ...data, date: e.target.value })}
        placeholder="15-17 Jul 2026"
        required
      />
      <Input
        label="Fecha técnica"
        type="date"
        value={data.startDate}
        onChange={(e) => onChange({ ...data, startDate: e.target.value })}
        required
      />
      <Input
        label="Foto (URL)"
        type="url"
        value={data.image || ''}
        onChange={(e) => onChange({ ...data, image: e.target.value })}
        placeholder="https://..."
      />
    </div>

    <div className="space-y-2">
      <label className="block text-xs font-montserrat text-subsonic-muted uppercase tracking-widest ml-1">
        Descripción
      </label>
      <textarea
        className="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text placeholder:text-subsonic-muted outline-none focus:ring-2 focus:ring-subsonic-accent/30"
        rows="4"
        value={data.description || ''}
        onChange={(e) => onChange({ ...data, description: e.target.value })}
        placeholder="Describe la propuesta del festival..."
      />
    </div>

    <div className="rounded-lg border border-subsonic-border bg-subsonic-navfooter p-3">
      <p className="text-xs uppercase tracking-wider text-subsonic-muted mb-2">Vista previa de foto</p>
      <div className="h-36 w-full overflow-hidden rounded-md border border-subsonic-border bg-subsonic-border">
        <img
          src={data.image || DEFAULT_FESTIVAL_IMAGE}
          alt={data.title || 'Festival'}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_FESTIVAL_IMAGE;
          }}
        />
      </div>
    </div>
  </section>
);

const GroundManager = ({ grounds, selectedGrounds, onAddGround, onRemoveGround }) => (
  <section className="rounded-xl border border-subsonic-border bg-subsonic-surface/40 p-5 space-y-4">
    <h3 className="text-sm font-black uppercase tracking-wide text-subsonic-accent">Recintos</h3>

    <select
      className="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text outline-none focus:ring-2 focus:ring-subsonic-accent/30 disabled:opacity-60"
      onChange={(e) => onAddGround(e.target.value)}
      value=""
      disabled={grounds.length === 0}
    >
      <option value="" disabled>
        {grounds.length > 0 ? 'Añadir recinto desde la base de datos...' : 'No hay recintos disponibles'}
      </option>
      {grounds.map((ground) => (
        <option key={ground.id} value={ground.id}>
          {ground.name}{ground.area ? ` - ${ground.area}` : ''}
        </option>
      ))}
    </select>

    {selectedGrounds.length === 0 ? (
      <p className="text-sm text-subsonic-muted">No has añadido recintos.</p>
    ) : (
      <div className="space-y-2">
        {selectedGrounds.map((ground, index) => (
          <div
            key={`${ground.id}-${index}`}
            className="flex items-center justify-between rounded-md border border-subsonic-border bg-subsonic-navfooter px-3 py-2"
          >
            <div className="min-w-0 pr-3">
              <p className="truncate text-sm font-semibold text-subsonic-text">{ground.name}</p>
              <p className="truncate text-xs text-subsonic-muted">
                {`${ground.area || 'Área sin definir'} · Capacidad: ${ground.capacity || 0} · Estado: ${ground.status || 'n/d'}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemoveGround(ground.id)}
              className="text-subsonic-muted hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    )}
  </section>
);

const LineupManager = ({ lineup, artists, onAdd, onRemove }) => (
  <section className="rounded-xl border border-subsonic-border bg-subsonic-surface/40 p-5 space-y-4">
    <h3 className="text-sm font-black uppercase tracking-wide text-subsonic-accent">Cartelera</h3>

    <select
      className="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text outline-none focus:ring-2 focus:ring-subsonic-accent/30"
      onChange={(e) => onAdd(e.target.value)}
      value=""
    >
      <option value="" disabled>Añadir artista desde la base de datos...</option>
      {artists.map((artist) => (
        <option key={artist.id} value={artist.id}>
          {artist.name} ({artist.genre})
        </option>
      ))}
    </select>

    {lineup.length === 0 ? (
      <p className="text-sm text-subsonic-muted">No has añadido artistas.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {lineup.map((artist, index) => (
          <div
            key={`${artist.id || artist.name}-${index}`}
            className="flex items-center justify-between rounded-md border border-subsonic-border bg-subsonic-navfooter px-3 py-2"
          >
            <div className="min-w-0 pr-3">
              <p className="truncate text-sm font-semibold text-subsonic-text">{artist.name}</p>
              <p className="truncate text-xs text-subsonic-muted">{artist.genre || 'Sin género'}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-subsonic-muted hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    )}
  </section>
);

const TicketManager = ({ tickets, templates, onAddTemplate, onRemove }) => (
  <section className="rounded-xl border border-subsonic-border bg-subsonic-surface/40 p-5 space-y-4">
    <h3 className="text-sm font-black uppercase tracking-wide text-subsonic-accent">Entradas y precios</h3>

    <select
      className="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text outline-none focus:ring-2 focus:ring-subsonic-accent/30"
      onChange={(e) => onAddTemplate(e.target.value)}
      value=""
    >
      <option value="" disabled>Añadir entrada desde la base de datos...</option>
      {templates.map((template) => (
        <option key={template.id} value={template.id}>
          {template.name} ({template.price}€)
        </option>
      ))}
    </select>

    {tickets.length === 0 ? (
      <p className="text-sm text-subsonic-muted">No has añadido entradas.</p>
    ) : (
      <div className="space-y-2">
        {tickets.map((ticket, index) => (
          <div
            key={`${ticket.name}-${index}`}
            className="relative rounded-md border border-subsonic-border bg-subsonic-navfooter px-3 py-2"
          >
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute right-2 top-2 text-subsonic-muted hover:text-red-500"
            >
              ✕
            </button>
            <p className="pr-6 text-sm font-semibold text-subsonic-text">{ticket.name} · {ticket.price}€</p>
            <p className="pr-6 text-xs text-subsonic-muted">
              {Array.isArray(ticket.features) ? ticket.features.join(', ') : String(ticket.features || '')}
            </p>
          </div>
        ))}
      </div>
    )}
  </section>
);

const FestivalFormModal = ({
  isOpen,
  onClose,
  onSave,
  data,
  onChange,
  isEditing,
  artists,
  grounds,
  templates,
  onAddGround,
  onRemoveGround,
  onAddArtist,
  onRemoveArtist,
  onAddTemplate,
  onRemoveTemplate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-subsonic-border bg-subsonic-navfooter shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-subsonic-border px-6 py-4">
          <h2 className="text-xl font-black uppercase tracking-tight text-subsonic-accent">
            {isEditing ? 'Editar festival' : 'Nuevo festival'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-lg text-subsonic-muted hover:text-subsonic-text"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSave} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <GeneralInfoForm data={data} onChange={onChange} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <GroundManager
              grounds={grounds}
              selectedGrounds={data.grounds || []}
              onAddGround={onAddGround}
              onRemoveGround={onRemoveGround}
            />
            <LineupManager
              lineup={data.lineup || []}
              artists={artists}
              onAdd={onAddArtist}
              onRemove={onRemoveArtist}
            />
          </div>

          <TicketManager
            tickets={data.tickets || []}
            templates={templates}
            onAddTemplate={onAddTemplate}
            onRemove={onRemoveTemplate}
          />

          <div className="flex justify-end gap-3 border-t border-subsonic-border pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="bg-subsonic-accent px-5 py-2 text-subsonic-bg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-subsonic-accent px-5 py-2 text-subsonic-bg"
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FestivalsManagement = () => {
  const [festivals, setFestivals] = useState([]);
  const [availableArtists, setAvailableArtists] = useState([]);
  const [availableGrounds, setAvailableGrounds] = useState([]);
  const [ticketTemplates, setTicketTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [festivalToDelete, setFestivalToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFestival, setCurrentFestival] = useState(emptyFestival);
  const [canSubmit, setCanSubmit] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fRes, aRes, gRes, tRes] = await Promise.all([
        fetch(`${API_BASE_URL}/festivals`),
        fetch(`${API_BASE_URL}/artists`),
        fetch(`${API_BASE_URL}/grounds`),
        fetch(`${API_BASE_URL}/ticketTemplates`)
      ]);

      if (fRes.ok) setFestivals(await fRes.json());
      if (aRes.ok) setAvailableArtists(await aRes.json());
      if (gRes.ok) setAvailableGrounds(await gRes.json());
      if (tRes.ok) setTicketTemplates(await tRes.json());
    } catch (err) {
      console.error('Error cargando datos de la API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredFestivals = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return festivals;

    return festivals.filter((festival) =>
      [
        festival.id,
        festival.title,
        festival.date,
        festival.startDate,
        festival.location,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [searchTerm, festivals]);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFestival(null);
    setCurrentFestival(emptyFestival);
  };

  const handleNewFestival = () => {
    setSelectedFestival(null);
    setCurrentFestival(emptyFestival);
    setModalOpen(true);
  };

  const handleEditFestival = (festival) => {
    setSelectedFestival(festival);
    setCurrentFestival({
      ...emptyFestival,
      ...festival,
      image: festival?.image || festival?.photo || '',
      lineup: Array.isArray(festival?.lineup) ? festival.lineup : [],
      tickets: Array.isArray(festival?.tickets) ? festival.tickets : [],
      grounds: normalizeFestivalGrounds(festival, availableGrounds)
    });
    setModalOpen(true);
  };

  const handleAddGround = (groundId) => {
    const ground = availableGrounds.find((item) => String(item.id) === String(groundId));
    if (!ground) return;

    const alreadyAdded = (currentFestival.grounds || []).some((item) => String(item.id) === String(ground.id));
    if (alreadyAdded) {
      alert('Este recinto ya ha sido añadido.');
      return;
    }

    setCurrentFestival((prev) => ({
      ...prev,
      grounds: [
        ...(prev.grounds || []),
        {
          id: String(ground.id),
          name: ground.name,
          area: ground.area || '',
          capacity: Number(ground.capacity || 0),
          status: ground.status || ''
        }
      ]
    }));
  };

  const handleRemoveGround = (groundId) => {
    setCurrentFestival((prev) => ({
      ...prev,
      grounds: (prev.grounds || []).filter((item) => String(item.id) !== String(groundId))
    }));
  };

  const handleAddArtist = (artistId) => {
    const artist = availableArtists.find((item) => String(item.id) === String(artistId));
    if (!artist) return;

    const alreadyAdded = (currentFestival.lineup || []).some((item) => String(item.id) === String(artist.id));
    if (alreadyAdded) {
      alert('Este artista ya ha sido añadido.');
      return;
    }

    setCurrentFestival((prev) => ({
      ...prev,
      lineup: [
        ...(prev.lineup || []),
        {
          id: String(artist.id),
          name: String(artist.name || ''),
          genre: String(artist.genre || '')
        }
      ]
    }));
  };

  const handleRemoveArtist = (index) => {
    setCurrentFestival((prev) => ({
      ...prev,
      lineup: (prev.lineup || []).filter((_, currentIndex) => currentIndex !== index)
    }));
  };

  const handleAddTemplate = (templateId) => {
    const template = ticketTemplates.find((item) => String(item.id) === String(templateId));
    if (!template) return;

    const isDuplicate = (currentFestival.tickets || []).some(
      (ticket) => ticket.name === template.name && Number(ticket.price) === Number(template.price)
    );

    if (isDuplicate) {
      alert('Esta entrada ya ha sido añadida.');
      return;
    }

    setCurrentFestival((prev) => ({
      ...prev,
      tickets: [
        ...(prev.tickets || []),
        {
          name: String(template.name || ''),
          price: Number(template.price || 0),
          features: Array.isArray(template.features) ? template.features : []
        }
      ]
    }));
  };

  const handleRemoveTemplate = (index) => {
    setCurrentFestival((prev) => ({
      ...prev,
      tickets: (prev.tickets || []).filter((_, currentIndex) => currentIndex !== index)
    }));
  };

  const handleSaveFestival = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      alert('Por favor, espera antes de hacer más peticiones.');
      return;
    }

    setCanSubmit(false);

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('No user is currently logged in or user is not authenticated.');
      }

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
          name: String(ground.name || ''),
          area: String(ground.area || ''),
          capacity: Number(ground.capacity || 0),
          status: String(ground.status || '')
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

      const isNew = !selectedFestival?.id;
      const festivalId = isNew
        ? normalizeFestivalId(currentFestival.title)
        : String(selectedFestival.id || currentFestival.id || '');

      if (!festivalId) {
        alert('Debes indicar un título válido para generar el ID del festival.');
        return;
      }

      const festivalToSave = {
        ...currentFestival,
        id: festivalId,
        title: String(currentFestival.title || '').trim(),
        date: String(currentFestival.date || '').trim(),
        startDate: String(currentFestival.startDate || '').trim(),
        image: String(currentFestival.image || '').trim(),
        description: String(currentFestival.description || '').trim(),
        lineup: normalizedLineup,
        tickets: normalizedTickets,
        grounds: normalizedGrounds,
        location: formatFestivalLocation(normalizedGrounds)
      };

      const method = isNew ? 'POST' : 'PUT';
      const url = isNew
        ? `${API_BASE_URL}/festivals`
        : `${API_BASE_URL}/festivals/${festivalId}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(festivalToSave)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} ${errorText}`);
      }

      closeModal();
      await fetchData();
    } catch (err) {
      console.error('Error al guardar festival:', err);
    } finally {
      setCanSubmit(true);
    }
  };

  const handleDeleteFestival = async (festival) => {
    if (!canSubmit) {
      alert('Por favor, espera antes de hacer más peticiones.');
      return;
    }

    if (!festival?.id) return;

    setCanSubmit(false);

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('No user is currently logged in or user is not authenticated.');
      }

      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/festivals/${festival.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to delete festival:', response.statusText);
      }

      setFestivalToDelete(null);
      await fetchData();
    } catch (err) {
      console.error('Error al eliminar festival:', err);
    } finally {
      setCanSubmit(true);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Cargando festivales...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-subsonic-accent uppercase tracking-tight">
          Gestión de Festivales
        </h1>
        <Button
          onClick={handleNewFestival}
          className="border border-subsonic-border text-subsonic-bg font-black px-5 py-2 rounded-full uppercase text-sm hover:border-subsonic-bg transition"
        >
          + Nuevo Festival
        </Button>
      </div>

      <div className="mb-6 max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por título, id, fecha o ubicación..."
          showButton={false}
          className="w-full"
          inputClassName="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text placeholder:text-subsonic-muted outline-none focus:ring-2 focus:ring-subsonic-accent/30"
        />
      </div>

      <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-225 w-full divide-y divide-subsonic-border">
            <thead className="bg-subsonic-surface/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Artistas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Entradas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Foto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subsonic-border">
              {filteredFestivals.length > 0 ? (
                filteredFestivals.map((festival) => (
                  <tr key={festival.id} className="hover:bg-subsonic-surface/20 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{festival.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{festival.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{festival.date}</td>
                    <td className="px-6 py-4 text-sm text-subsonic-text max-w-xs truncate" title={festival.location || ''}>
                      {festival.location || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">
                      {Array.isArray(festival.lineup) ? festival.lineup.length : 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">
                      {Array.isArray(festival.tickets) ? festival.tickets.length : 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${festival.image ? 'bg-green-500/20 text-green-300' : 'bg-subsonic-border text-subsonic-muted'}`}>
                        {festival.image ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Button
                        onClick={() => handleEditFestival(festival)}
                        className="bg-subsonic-border text-subsonic-accent hover:text-opacity-80 hover:bg-subsonic-accent hover:text-subsonic-bg px-6 py-2"
                        variant=""
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => setFestivalToDelete(festival)}
                        className="bg-subsonic-border text-red-400 hover:bg-red-500 hover:text-subsonic-bg px-6 py-2"
                        variant=""
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-sm text-subsonic-muted">
                    No se encontraron festivales con ese filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FestivalFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSaveFestival}
        data={currentFestival}
        onChange={setCurrentFestival}
        isEditing={!!selectedFestival}
        artists={availableArtists}
        grounds={availableGrounds}
        templates={ticketTemplates}
        onAddGround={handleAddGround}
        onRemoveGround={handleRemoveGround}
        onAddArtist={handleAddArtist}
        onRemoveArtist={handleRemoveArtist}
        onAddTemplate={handleAddTemplate}
        onRemoveTemplate={handleRemoveTemplate}
      />

      <ConfirmDialog
        isOpen={!!festivalToDelete}
        onClose={() => setFestivalToDelete(null)}
        onConfirm={handleDeleteFestival}
        title="Eliminar festival"
        message={`¿Estás seguro de que deseas eliminar "${festivalToDelete?.title}"? Esta acción no se puede deshacer.`}
        user={festivalToDelete}
      />
    </div>
  );
};

export default FestivalsManagement;
