import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "@/components/ui/Button"; 
import SocialLinks from "@/components/ui/SocialLinks"; 
import BaseCard from "@/components/ui/BaseCard.jsx";

const ArtistProfile = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(`http://localhost:3000/artists/${id}`);
        if (!response.ok) {
          setArtist(null);
          return;
        }
        const data = await response.json();
        setArtist(data);
      } catch (error) {
        console.error('Error fetching artist:', error);
        setArtist(null);
      }
    };

    fetchArtist();
  }, [id]);

  if (!artist) {
    return (
      <div className="min-h-screen bg-subsonic-bg text-subsonic-text flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-black mb-4">Artista no encontrado</h2>
        <Link to="/">
          <Button variant="outline">Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-subsonic-bg text-subsonic-text font-inter">
      {}
      <header className="h-[35vh] bg-subsonic-navfooter flex items-end p-8 border-b border-subsonic-border">
        <div className="max-w-7xl mx-auto w-full">
          <p className="text-subsonic-accent font-bold uppercase tracking-widest text-xs mb-2">
            {artist.genre}
          </p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-montserrat">
            {artist.name}
          </h1>
        </div>
      </header>

      {}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {}
        <div className="lg:col-span-3 space-y-10">
          <section>
            <h2 className="text-xl font-black text-subsonic-accent uppercase mb-4 tracking-tight">
              Biografía
            </h2>
            <p className="text-base leading-relaxed opacity-75 max-w-3xl">
              {artist.description}
            </p>
          </section>

          {}
          {artist.spotifyId && (
            <div className="rounded-2xl border border-subsonic-border overflow-hidden bg-black/20">
              <iframe
                src={`https://open.spotify.com/embed/artist/${artist.spotifyId}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`Spotify player for ${artist.name}`}
              ></iframe>
            </div>
          )}
        </div>

        {}
        <aside className="space-y-6">
          <BaseCard className="sticky top-24">
            <p className="text-[10px] font-black text-subsonic-muted uppercase mb-4 tracking-widest">
              Redes Sociales
            </p>
            {}
            <div className="mb-8">
              <SocialLinks variant="minimal" />
            </div>

            <Button variant="primary" className="w-full mb-3 text-xs">
              Ver Gira 2026
            </Button>
            <Button variant="outline" className="w-full text-xs">
              Añadir a Favoritos
            </Button>
          </BaseCard>
        </aside>
      </div>
    </div>
  );
};

export default ArtistProfile;
