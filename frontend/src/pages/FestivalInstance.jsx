import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import SocialLinks from '../components/ui/SocialLinks';
import TicketModal from '../components/ui/TicketModal';
import BaseCard from '../components/ui/BaseCard.jsx';
import FavoriteButton from '../components/ui/FavoriteButton.jsx';
import API_BASE_URL from '@/config/api';
import groundImage from '@/assets/images/Ground.jpg';

// --- COMPONENTES INTERNOS ---

const FestivalAbout = ({ description }) => (
  <section>
    <h2 className="text-3xl font-black text-subsonic-accent uppercase mb-6 font-montserrat tracking-tight">
      Sobre el evento
    </h2>
    <p className="text-lg leading-relaxed opacity-80">{description}</p>
  </section>
);

const FestivalLineup = ({ lineup }) => (
  <section>
    <h2 className="text-3xl font-black text-subsonic-accent uppercase mb-6 font-montserrat tracking-tight">
      Cartelera (Lineup)
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {lineup && lineup.map((artist, index) => (
        <BaseCard key={index} className="relative h-full">
          {artist.id && (
            <div className="absolute right-4 top-4 z-10 rounded-full bg-subsonic-bg/80 p-2 backdrop-blur-sm">
              <FavoriteButton id={artist.id} type="artist" className="block" />
            </div>
          )}
          <Link
            to={`/artist/${artist.id || artist.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="block pr-14"
          >
            <h3 className="text-xl font-black uppercase tracking-tighter group-hover:text-subsonic-accent transition-colors">
              {artist.name}
            </h3>
            <p className="text-xs text-subsonic-muted font-bold uppercase">{artist.genre}</p>
          </Link>
        </BaseCard>
      ))}
    </div>
  </section>
);

const FestivalGrounds = ({ grounds = [] }) => {
  const safeGrounds = Array.isArray(grounds) ? grounds : [];

  return (
    <section>
      <h2 className="text-3xl font-black text-subsonic-accent uppercase mb-6 font-montserrat tracking-tight">
        Recintos
      </h2>

      {safeGrounds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeGrounds.map((ground, index) => (
            <BaseCard key={ground.id || `${ground.name}-${index}`} className="h-full overflow-hidden border border-subsonic-border/70 p-0">
              <div className="h-full">
                <div className="aspect-video overflow-hidden bg-subsonic-navfooter">
                  <img
                    src={ground.image || groundImage}
                    alt={ground.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="space-y-2 p-5">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-white">
                    {ground.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-subsonic-muted">
                    {ground.description || ground.area || 'Recinto del festival'}
                  </p>
                  {ground.capacity ? (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-subsonic-accent">
                      Aforo aprox. {Number(ground.capacity).toLocaleString('es-ES')} personas
                    </p>
                  ) : null}
                </div>
              </div>
            </BaseCard>
          ))}
        </div>
      ) : (
        <BaseCard className="border border-subsonic-border/70">
          <p className="text-lg leading-relaxed opacity-80">No hay recintos disponibles para este festival.</p>
        </BaseCard>
      )}
    </section>
  );
};

const FestivalTicketComparison = ({ tickets }) => (
  <section className="animate-in fade-in duration-700">
    <h2 className="text-3xl font-black text-subsonic-accent uppercase mb-8 font-montserrat tracking-tight">
      Comparativa de Entradas
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tickets && tickets.map((ticket, index) => (
        <div key={index} className="bg-subsonic-navfooter/50 border border-subsonic-border rounded-3xl p-6 flex flex-col h-full">
          <div className="mb-6">
            <h4 className="text-xl font-black text-white uppercase tracking-tighter">{ticket.name}</h4>
            <p className="text-subsonic-accent font-black text-2xl">{ticket.price}€</p>
          </div>
          <ul className="space-y-3 mb-8 grow">
            {ticket.features && ticket.features.map((feature, fIndex) => (
              <li key={fIndex} className="text-xs font-bold uppercase flex items-center gap-2 text-subsonic-text opacity-80">
                <span className="text-subsonic-accent">✓</span> {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

// --- COMPONENTE PRINCIPAL ---
const FestivalInstance = () => {
  const { id } = useParams();
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [festival, setFestival] = useState(null);

  useEffect(() => {
    const fetchFestival = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/festivals/${id}`);
        if (!response.ok) {
          setFestival(null);
          return;
        }
        const data = await response.json();
        setFestival(data);
      } catch (error) {
        console.error('Error fetching festival:', error);
        setFestival(null);
      }
    };

    fetchFestival();
  }, [id]);

  if (!festival) {
    return (
      <div className="min-h-screen bg-subsonic-bg text-subsonic-text flex flex-col items-center justify-center">
        <h2 className="text-3xl font-black mb-4 uppercase">Festival no encontrado</h2>
        <Link to="/"><Button variant="outline">Volver al inicio</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-subsonic-bg text-subsonic-text font-inter">
      <header className="relative h-[50vh] flex items-end p-10 bg-subsonic-navfooter border-b border-subsonic-border">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-6xl md:text-8xl font-black text-subsonic-accent uppercase tracking-tighter mb-4 font-montserrat">
            {festival.title}
          </h1>
          <p className="text-xl font-bold uppercase tracking-widest text-subsonic-muted">
            {festival.date} • {festival.location || "Ubicación por confirmar"}
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          <FestivalAbout description={festival.description} />
          <FestivalLineup lineup={festival.lineup} />
          <FestivalGrounds grounds={festival.grounds} />
          <FestivalTicketComparison 
            tickets={festival.tickets} 
            onSelect={() => setIsTicketModalOpen(true)} 
          />
        </div>

        <aside>
          <BaseCard className="border-2 border-subsonic-accent p-8 rounded-3xl sticky top-24 shadow-[0_0_30px_rgba(0,245,255,0.1)]">
            <h2 className="text-2xl font-black text-subsonic-text uppercase mb-6 font-montserrat">Entradas</h2>
            <div className="space-y-4 mb-8">
              {festival.tickets && festival.tickets.map((ticket, index) => (
                <div key={index} className="flex justify-between items-center border-b border-subsonic-border pb-4 hover:border-subsonic-accent transition-colors group">
                  <span className="text-sm font-bold uppercase group-hover:text-subsonic-text">{ticket.name}</span>
                  <span className="text-xl font-black text-subsonic-accent">{ticket.price}€</span>
                </div>
              ))}
            </div>
            <Button 
              variant="primary" 
              className="w-full py-4 text-base" 
              onClick={() => setIsTicketModalOpen(true)}
            >
              Comprar Tickets
            </Button>
            <div className="mt-8 pt-8 border-t border-subsonic-border text-center">
              <p className="text-[10px] text-subsonic-muted uppercase font-bold mb-4 tracking-widest">Compartir evento</p>
              <div className="flex justify-center">
                <SocialLinks variant="minimal" />
              </div>
            </div>
          </BaseCard>
        </aside>
      </div>

      <TicketModal 
        isOpen={isTicketModalOpen} 
        onClose={() => setIsTicketModalOpen(false)} 
        festival={festival} 
      />
    </div>
  );
};

export default FestivalInstance;
