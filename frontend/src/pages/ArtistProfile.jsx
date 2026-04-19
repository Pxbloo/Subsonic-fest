import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "@/components/ui/Button"; 
import SocialLinks from "@/components/ui/SocialLinks"; 
import BaseCard from "@/components/ui/BaseCard.jsx";
import API_BASE_URL from '@/config/api';

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const isArtistInFestival = (festival, artist) => {
  if (!festival?.lineup || !artist) return false;

  const artistId = normalizeText(artist.id);
  const artistName = normalizeText(artist.name);

  return festival.lineup.some((lineupArtist) => {
    const lineupId = normalizeText(lineupArtist?.id);
    const lineupName = normalizeText(lineupArtist?.name);

    return (
      (artistId && lineupId && artistId === lineupId) ||
      (artistName && lineupName && artistName === lineupName)
    );
  });
};

const ArtistProfile = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [relatedFestivals, setRelatedFestivals] = useState([]);

  useEffect(() => {
    const fetchArtistAndFestivals = async () => {
      try {
        const [artistResponse, festivalsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/artists/${id}`),
          fetch(`${API_BASE_URL}/festivals`),
        ]);

        if (!artistResponse.ok) {
          setArtist(null);
          setRelatedFestivals([]);
          return;
        }

        const artistData = await artistResponse.json();
        setArtist(artistData);

        if (!festivalsResponse.ok) {
          setRelatedFestivals([]);
          return;
        }

        const festivalsData = await festivalsResponse.json();
        const festivals = Array.isArray(festivalsData) ? festivalsData : [];

        const filteredFestivals = festivals.filter((festival) =>
          isArtistInFestival(festival, artistData)
        );

        setRelatedFestivals(filteredFestivals);
      } catch (error) {
        console.error('Error fetching artist:', error);
        setArtist(null);
        setRelatedFestivals([]);
      }
    };

    fetchArtistAndFestivals();
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

          <section>
            <h3 className="text-lg font-black text-subsonic-accent uppercase mb-4 tracking-tight">
              Más festivales donde actúa
            </h3>

            {relatedFestivals.length === 0 ? (
              <p className="text-sm opacity-70">
                Todavía no hay más festivales registrados para este artista.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                {relatedFestivals.map((festival) => (
                  <Link key={festival.id} to={`/festival/${festival.id}`} className="block">
                    <BaseCard className="h-full hover:border-subsonic-accent/70 transition-colors">
                      <p className="text-xs font-black text-subsonic-muted uppercase tracking-widest mb-2">
                        {festival.date}
                      </p>
                      <h4 className="text-lg font-black uppercase tracking-tight mb-2">
                        {festival.title}
                      </h4>
                      <p className="text-sm opacity-75">{festival.location}</p>
                    </BaseCard>
                  </Link>
                ))}
              </div>
            )}
          </section>
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
          </BaseCard>
        </aside>
      </div>
    </div>
  );
};

export default ArtistProfile;
