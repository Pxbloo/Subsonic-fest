import React, { useEffect, useState } from 'react';
import BaseCard from '@/components/ui/BaseCard.jsx';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PageHeader from '@/components/ui/PageHeader';
import groundImage from '@/assets/images/Ground.jpg';
import SearchIcon from '@/assets/icons/search.svg';
import API_BASE_URL from '@/config/api';

const GroundsManagement = () => {
  const [grounds, setGrounds] = useState([]);

  const [newName, setNewName] = useState('');
  const [newArea, setNewArea] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedGroundId, setSelectedGroundId] = useState(null);
  const [canSubmit, setCanSubmit] = useState(true);

  useEffect(() => {
    const fetchGrounds = async () => {
      if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem('grounds');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setGrounds(parsed);
              return;
            }
          } catch {
            // ignore JSON errors and fall back to server
          }
        }
      }

      try {
        const response = await fetch(`${API_BASE_URL}/grounds`);
        if (!response.ok) throw new Error('Error al cargar recintos');
        const data = await response.json();
        setGrounds(data || []);
      } catch (error) {
        console.error('Error fetching grounds:', error);
        setGrounds([]);
      }
    };

    fetchGrounds();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('grounds', JSON.stringify(grounds));
    }
  }, [grounds]);

  const totalCapacity = grounds.reduce((sum, g) => sum + g.capacity, 0);
  const inSetupCount = grounds.filter((g) => g.status === 'En montaje').length;
  const restrictedCount = grounds.filter((g) => g.status === 'Solo staff').length;

  const handleAddGround = (event) => {
    event.preventDefault();
    if (!canSubmit) {
      alert('Por favor, espera antes de hacer más peticiones.');
      return;
    }
    setCanSubmit(false);
    const trimmedName = newName.trim();
    const trimmedArea = newArea.trim();

    if (!trimmedName) return;

    const nextId = grounds.length > 0
      ? Math.max(...grounds.map((g) => Number(g.id) || 0)) + 1
      : 1;

    const nextGround = {
      id: nextId,
      name: trimmedName,
      area: trimmedArea || 'Zona sin asignar',
      status: 'Operativo',
      capacity: 0,
    };

    setGrounds((prev) => [...prev, nextGround]);
    setNewName('');
    setNewArea('');
    setCanSubmit(true);
  };

  const handleDeleteGround = (id) => {
    if (!canSubmit) {
      alert('Por favor, espera antes de hacer más peticiones.');
      return;
    }
    setCanSubmit(false);
    const ground = grounds.find((g) => g.id === id);
    const name = ground?.name || 'este recinto';

    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        `¿Seguro que quieres eliminar el recinto "${name}"?`
      );
      if (!confirmed) return;
    }

    setGrounds((prev) => prev.filter((g) => g.id !== id));
    setSelectedGroundId((current) => (current === id ? null : current));
    setCanSubmit(true);
  };

  const handleCycleStatus = (id) => {
    const order = ['Operativo', 'En montaje', 'Solo staff'];

    setGrounds((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const currentIndex = order.indexOf(g.status);
        const nextStatus = order[(currentIndex + 1 + order.length) % order.length];
        return { ...g, status: nextStatus };
      })
    );
  };

  const selectedGround =
    selectedGroundId != null
      ? grounds.find((g) => g.id === selectedGroundId)
      : null;

  return (
    <main className="min-h-screen bg-subsonic-bg pt-24 pb-12 px-6 text-subsonic-text">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <PageHeader title="Gestión de recintos" />

        <div className="flex flex-col lg:flex-row gap-10">
          <section className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-subsonic-accent uppercase tracking-tight">
                  Recintos y espacios
                </h2>
              </div>

              <div className="flex items-center gap-2 w-full md:w-64">
                <Input
                  placeholder="Búsqueda"
                  className="w-full"
                />
                <img
                  src={SearchIcon}
                  alt="Buscar"
                  className="w-4 h-4 opacity-70"
                  aria-hidden="true"
                />
              </div>
            </div>

            <form
              onSubmit={handleAddGround}
              className="mt-4 flex flex-col md:flex-row gap-3 items-stretch md:items-end"
            >
              <div className="flex-1">
                <Input
                  label="Nuevo recinto"
                  placeholder="Nombre del recinto"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Zona"
                  placeholder="Ej: Zona norte"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                />
              </div>
              <div className="flex gap-3 mt-2 md:mt-0">
                <Button
                  type="submit"
                  variant="primarySmall"
                  className="px-6 text-xs uppercase tracking-widest"
                >
                  Añadir recinto
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`px-4 text-[11px] uppercase tracking-widest border border-red-500 text-red-300 transition-colors rounded-full ${
                    deleteMode ? 'bg-red-500/30' : 'bg-red-500/10'
                  }`}
                  onClick={() => setDeleteMode((prev) => !prev)}
                >
                  {deleteMode ? 'Salir modo borrar' : 'Modo borrar recintos'}
                </Button>
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {grounds.map((ground) => (
                <div
                  key={ground.id}
                  className="block h-full group text-left cursor-pointer"
                  onClick={() => {
                    if (deleteMode) {
                      handleDeleteGround(ground.id);
                    } else {
                      setSelectedGroundId(ground.id);
                    }
                  }}
                >
                  <BaseCard className="relative items-stretch rounded-3xl bg-subsonic-navfooter/90">
                    <div className="bg-subsonic-bg/80 rounded-2xl mb-4 w-full overflow-hidden aspect-4/3">
                      <img
                        src={groundImage}
                        alt={ground.name}
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>

                    <div className="mb-3 text-left space-y-1">
                      <p className="text-sm font-black uppercase tracking-tight text-subsonic-text">
                        {ground.name}
                      </p>
                      <p className="text-[11px] text-subsonic-muted uppercase tracking-widest">
                        {ground.area} · Aforo aprox. {ground.capacity.toLocaleString('es-ES')} personas
                      </p>
                    </div>

                    <div className="mt-auto flex justify-center">
                      <span className="inline-flex items-center justify-center px-6 py-1 rounded-full bg-subsonic-accent text-black text-xs font-black uppercase tracking-widest">
                        {ground.status}
                      </span>
                    </div>
                  </BaseCard>
                </div>
              ))}
            </div>
          </section>

          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
            <div className="h-full">
              <BaseCard className="h-full items-stretch rounded-3xl">
                <h3 className="text-xl font-black text-subsonic-text mb-4 uppercase tracking-tight">
                  Información
                </h3>
                <div className="flex-1 space-y-3 text-xs text-subsonic-muted leading-snug">
                  <p className="uppercase tracking-widest font-black text-[10px] text-subsonic-accent">
                    Resumen operativo
                  </p>
                  <p>
                    Recintos totales configurados:{' '}
                    <span className="font-bold text-subsonic-text">{grounds.length}</span>
                  </p>
                  <p>
                    Capacidad agregada estimada:{' '}
                    <span className="font-bold text-subsonic-text">
                      {totalCapacity.toLocaleString('es-ES')} personas
                    </span>
                  </p>
                  <p>
                    Última actualización del plano: <span className="font-semibold">hoy, 10:32h</span>
                  </p>
                  <p>
                    Recintos en montaje:{' '}
                    <span className="font-semibold">{inSetupCount}</span> · Zonas restringidas:{' '}
                    <span className="font-semibold">{restrictedCount}</span>
                  </p>
                  <p>
                    Usa esta vista para validar aforos, accesos y posibles cuellos de botella
                    antes de abrir puertas.
                  </p>
                </div>
              </BaseCard>
            </div>

            <div className="flex justify-center">
              <Button
                variant="primary"
                className="px-8 py-3 text-xs uppercase tracking-widest rounded-full"
              >
                Acceder a ventas
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {selectedGround && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-40"
          onClick={() => setSelectedGroundId(null)}
        >
          <div
            className="w-full max-w-xl max-h-[80vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <BaseCard className="bg-subsonic-navfooter/90 rounded-3xl overflow-hidden p-0 flex flex-col">
              <div className="w-full h-40 md:h-56 overflow-hidden">
                <img
                  src={groundImage}
                  alt={selectedGround.name}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <p className="text-subsonic-accent text-xs font-bold uppercase tracking-widest mb-1">
                    {selectedGround.area}
                  </p>
                  <h1 className="text-2xl font-black uppercase tracking-tight mb-1">
                    {selectedGround.name}
                  </h1>
                  <p className="text-xs text-subsonic-muted uppercase tracking-widest">
                    Aforo estimado {selectedGround.capacity.toLocaleString('es-ES')} personas
                  </p>
                </div>

                <div className="text-sm text-subsonic-text/80 space-y-1">
                  <p>
                    Estado actual:{' '}
                    <span className="font-black text-subsonic-accent uppercase">
                      {selectedGround.status}
                    </span>
                  </p>
                  <p>
                    Usa esta ficha para revisar y actualizar rápidamente la información de este
                    recinto antes y durante el festival.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-subsonic-border flex flex-wrap gap-3 justify-between">
                  <Button
                    type="button"
                    variant="primarySmall"
                    className="text-xs"
                    onClick={() => handleCycleStatus(selectedGround.id)}
                  >
                    Cambiar estado ({selectedGround.status})
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setSelectedGroundId(null)}
                    >
                      Cerrar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-xs border border-red-500 bg-red-500 text-white hover:bg-red-600 rounded-full px-4 py-2"
                      onClick={() => handleDeleteGround(selectedGround.id)}
                    >
                      Eliminar recinto
                    </Button>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      )}
    </main>
  );
};

export default GroundsManagement;
