import React from 'react';
import { useParams, Link } from 'react-router-dom';
import festivalsData from '../data/festivals.json'; 
import Button from '../components/ui/Button'; 
import SocialLinks from '../components/ui/SocialLinks'; 
import BaseCard from '../components/ui/BaseCard.jsx';

const FestivalInstance = () => {
  const { id } = useParams();

  const festival = festivalsData.find(f => f.id === parseInt(id));

  if (!festival) {
    return (
      <div className="min-h-screen bg-subsonic-bg text-subsonic-text flex flex-col items-center justify-center">
        <h2 className="text-3xl font-black mb-4">Festival no encontrado</h2>
        <Link to="/"><Button variant="outline">Volver al inicio</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-subsonic-bg text-subsonic-text font-inter">
      {}
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
        <div className="lg:col-span-2 space-y-12">
          {}
          <section>
            <h2 className="text-3xl font-black text-subsonic-accent uppercase mb-6 font-montserrat tracking-tight">Sobre el evento</h2>
            <p className="text-lg leading-relaxed opacity-80">{festival.description}</p>
          </section>

          {}
          <section>
            <h2 className="text-3xl font-black text-subsonic-accent uppercase mb-6 font-montserrat tracking-tight">Cartelera (Lineup)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {festival.lineup && festival.lineup.map((artist, index) => (
                
                <Link 
                  key={index} 
                  to={`/artist/${artist.id || artist.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block"
                >
                  <BaseCard className="cursor-pointer h-full">
                    <h3 className="text-xl font-black uppercase tracking-tighter group-hover:text-subsonic-accent transition-colors">
                      {artist.name}
                    </h3>
                    <p className="text-xs text-subsonic-muted font-bold uppercase">{artist.genre}</p>
                  </BaseCard>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {}
        <aside>
          <BaseCard className="border-2 border-subsonic-accent p-8 rounded-3xl sticky top-24 shadow-[0_0_30px_rgba(0,245,255,0.1)]">
            <h2 className="text-2xl font-black text-subsonic-text uppercase mb-6 font-montserrat">Entradas</h2>
            
            {}
            <div className="space-y-4 mb-8">
              {festival.tickets && festival.tickets.map((ticket, index) => (
                <div key={index} className="flex justify-between items-center border-b border-subsonic-border pb-4 hover:border-subsonic-accent transition-colors group">
                  <span className="text-sm font-bold uppercase group-hover:text-subsonic-text">{ticket.name}</span>
                  <span className="text-xl font-black text-subsonic-accent">{ticket.price}</span>
                </div>
              ))}
            </div>

            <Link to="/checkout" className="block w-full">
              <Button variant="primary" className="w-full py-4 text-base">Comprar Tickets</Button>
            </Link>

            {}
            <div className="mt-8 pt-8 border-t border-subsonic-border text-center">
              <p className="text-[10px] text-subsonic-muted uppercase font-bold mb-4 tracking-widest">Compartir evento</p>
              <div className="flex justify-center">
                <SocialLinks variant="minimal" />
              </div>
            </div>
          </BaseCard>
        </aside>
      </div>
    </div>
  );
};

export default FestivalInstance;