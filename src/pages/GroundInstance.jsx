import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BaseCard from '@/components/ui/BaseCard.jsx';
import Button from '@/components/ui/Button';
import groundImage from '@/assets/images/Ground.jpg';
import API_BASE_URL from '@/config/api';

const GroundInstance = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grounds, setGrounds] = useState([]);

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

  const numericId = Number(id);
  const ground = grounds.find((g) => Number(g.id) === numericId);

  if (!ground) {
    return (
      <main className="min-h-screen bg-subsonic-bg pt-24 pb-12 px-6 flex items-center justify-center text-subsonic-text">
        <BaseCard className="max-w-md w-full text-center bg-subsonic-navfooter/">
          <h2 className="text-2xl font-black mb-3 uppercase tracking-tight">
            Recinto no encontrado
          </h2>
          <p className="text-subsonic-muted text-sm mb-6">
            No hemos podido localizar este recinto en la configuración actual.
          </p>
          <Button variant="primarySmall" onClick={() => navigate('/grounds')}>
            Volver a gestión de recintos
          </Button>
        </BaseCard>
      </main>
    );
  }

  const handleCycleStatus = () => {
    const order = ['Operativo', 'En montaje', 'Solo staff'];
    const currentIndex = order.indexOf(ground.status);
    const nextStatus = order[(currentIndex + 1 + order.length) % order.length];

    setGrounds((prev) =>
      prev.map((g) =>
        Number(g.id) === numericId
          ? { ...g, status: nextStatus }
          : g
      )
    );
  };

  const handleDelete = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('¿Seguro que quieres eliminar este recinto?');
      if (!confirmed) return;
    }

    setGrounds((prev) => prev.filter((g) => Number(g.id) !== numericId));
    navigate('/grounds');
  };

  return (
    <main className="min-h-screen bg-subsonic-bg pt-24 pb-12 px-6 flex items-center justify-center text-subsonic-text">
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-40">
        <div className="w-full max-w-xl">
          <BaseCard className="bg-subsonic-navfooter/90 rounded-3xl overflow-hidden p-0">
            <div className="w-full aspect-4/3 overflow-hidden">
              <img
                src={groundImage}
                alt={ground.name}
                className="w-full h-full object-cover opacity-80"
              />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-subsonic-accent text-xs font-bold uppercase tracking-widest mb-1">
                  {ground.area}
                </p>
                <h1 className="text-2xl font-black uppercase tracking-tight mb-1">
                  {ground.name}
                </h1>
                <p className="text-xs text-subsonic-muted uppercase tracking-widest">
                  Aforo estimado {ground.capacity.toLocaleString('es-ES')} personas
                </p>
              </div>

              <div className="text-sm text-subsonic-text/80 space-y-1">
                <p>
                  Estado actual:{' '}
                  <span className="font-black text-subsonic-accent uppercase">
                    {ground.status}
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
                  onClick={handleCycleStatus}
                >
                  Cambiar estado ({ground.status})
                </Button>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs"
                    onClick={() => navigate('/grounds')}
                  >
                    Cerrar
                  </Button>
                  <Button
                    type="button"
                    className="text-xs bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleDelete}
                  >
                    Eliminar recinto
                  </Button>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </main>
  );
};

export default GroundInstance;