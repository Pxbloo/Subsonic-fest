import React from 'react';
import FestivalGrid from '@/components/ui/FestivalGrid';
import PageHeader from '@/components/ui/PageHeader';
import BaseCard from '@/components/ui/BaseCard.jsx';
import { useHistory } from '@/hooks/useHistory'; 

const History = () => {
  const { data, loading } = useHistory();

  if (loading) {
    return (
      <div className="min-h-screen bg-subsonic-bg flex items-center justify-center">
        <p className="text-subsonic-accent animate-pulse font-black uppercase tracking-widest">
          Cargando tus recuerdos...
        </p>
      </div>
    );
  }

  const pastFestivals = data?.pastFestivals || [];
  const merchHistory = data?.merchandising || [];

  return (
    <main className="min-h-screen bg-subsonic-bg pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <PageHeader title="Histórico" />

        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-4xl font-black text-subsonic-accent uppercase italic">
              Remember
            </h2>
            <p className="text-subsonic-muted font-bold">
              Mis festivales pasados
            </p>
          </div>

          {pastFestivals.length > 0 ? (
            <FestivalGrid festivals={pastFestivals} />
          ) : (
            <BaseCard className="border-dashed p-12 text-center bg-transparent">
              <p className="text-subsonic-muted">Aún no tienes festivales en tu historial.</p>
            </BaseCard>
          )}
        </section>

        <section>
          <div className="mb-8">
            <h2 className="text-4xl font-black text-subsonic-accent uppercase italic">
              Merch
            </h2>
            <p className="text-subsonic-muted font-bold">
              Todo el merchandising que has comprado en tus festivales
            </p>
          </div>

          {merchHistory.length > 0 ? (
            <BaseCard className="p-8 bg-subsonic-navfooter/40">
              <ul className="space-y-4">
                {merchHistory.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-4 border-b border-subsonic-border/60 pb-4 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-subsonic-text truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-subsonic-muted mt-1">
                        {item.date} · {item.status}
                      </p>
                    </div>
                    <div className="text-sm font-black text-subsonic-accent whitespace-nowrap">
                      {Number(item.amount).toFixed(2)}€
                    </div>
                  </li>
                ))}
              </ul>
            </BaseCard>
          ) : (
            <BaseCard className="border-dashed p-12 text-center bg-transparent">
              <p className="text-subsonic-muted">Aún no has comprado merchandising.</p>
            </BaseCard>
          )}
        </section>

      </div>
    </main>
  );
};

export default History;