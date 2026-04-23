import React, { useEffect, useState } from 'react';
import Hero from '../components/ui/Hero'; 
import FestivalGrid from '../components/ui/FestivalGrid';
import SearchBar from '../components/ui/SearchBar';
import API_BASE_URL from '@/config/api';

const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const extractFestivalGenres = (festival) => {
  if (!Array.isArray(festival.lineup)) return [];

  return festival.lineup
    .map((artist) => artist.genre)
    .filter(Boolean)
    .map((genre) => genre.trim());
};

const Home = () => {
  const [festivals, setFestivals] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/festivals`);
        if (!response.ok) throw new Error('Error al cargar festivales');
        const data = await response.json();
        setFestivals(data || []);
      } catch (error) {
        console.error('Error fetching festivals:', error);
        setError(error.message);
        setFestivals([]);
      }
    };

    fetchFestivals();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingFestivals = festivals.filter((fest) => {
    const referenceDateString = fest.startDate || fest.date;

    if (!referenceDateString) return false;

    const festivalDate = new Date(referenceDateString);

    if (Number.isNaN(festivalDate.getTime())) return false;

    return festivalDate >= today;
  });

  const genreOptions = [
    'Todos',
    ...new Set(upcomingFestivals.flatMap((festival) => extractFestivalGenres(festival))),
  ];

  const filteredFestivals = upcomingFestivals.filter((festival) => {
    const term = normalizeText(searchTerm);
    const festivalGenres = extractFestivalGenres(festival);

    if (selectedGenre !== 'all' && !festivalGenres.includes(selectedGenre)) {
      return false;
    }

    if (!term) return true;

    const searchableText = [
      festival.title,
      festival.location,
      festival.description,
      ...festivalGenres,
      Array.isArray(festival.lineup) ? festival.lineup.map((artist) => artist.name).join(' ') : '',
    ]
      .filter(Boolean)
      .join(' ');

    return normalizeText(searchableText).includes(term);
  });

  const isEmpty = filteredFestivals.length === 0;

  return (
    <main className="min-h-screen bg-subsonic-bg px-6 py-10 text-subsonic-text">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        <Hero />

        {error && (
          <div className="mb-8 w-full rounded-xl border border-red-500 bg-red-500/10 p-4 text-red-500">
            Error de conexión: {error}. Revisa si json-server está corriendo en el puerto 3000.
          </div>
        )}

        <section className="mb-10 w-full rounded-3xl border border-subsonic-border bg-subsonic-navfooter/70 p-4 backdrop-blur-sm md:p-6">
          <div className="flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-widest text-subsonic-muted">
            <div className="flex items-center gap-4">
              <span>{filteredFestivals.length} resultados</span>
              <button
                type="button"
                onClick={() => setFiltersOpen((current) => !current)}
                className="text-subsonic-accent transition hover:underline"
              >
                {filtersOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
              </button>
            </div>
          </div>

          {filtersOpen && (
            <>
              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,1fr)] lg:items-end">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-subsonic-muted">
                    Búsqueda
                  </span>
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar por nombre, artista, recinto o descripción..."
                    showButton={false}
                    className="w-full"
                    inputClassName="w-full rounded-full border border-subsonic-border bg-subsonic-surface/80 px-4 py-3 text-sm text-subsonic-text placeholder:text-subsonic-muted outline-none transition focus:border-subsonic-accent focus:ring-2 focus:ring-subsonic-accent/25"
                  />
                </div>

                <label className="flex flex-col gap-2 text-[10px] font-black uppercase tracking-widest text-subsonic-muted">
                  Estilo musical
                  <select
                    value={selectedGenre}
                    onChange={(event) => setSelectedGenre(event.target.value)}
                    className="rounded-full border border-subsonic-border bg-subsonic-surface/80 px-4 py-3 text-sm text-subsonic-text outline-none transition focus:border-subsonic-accent focus:ring-2 focus:ring-subsonic-accent/25"
                  >
                    {genreOptions.map((genre) => (
                      <option key={genre} value={genre === 'Todos' ? 'all' : genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 flex items-center justify-end gap-4 text-[10px] font-black uppercase tracking-widest text-subsonic-muted">
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedGenre('all');
                  }}
                  className="text-subsonic-accent transition hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            </>
          )}
        </section>

        {isEmpty ? (
          <div className="w-full rounded-3xl border border-subsonic-border bg-subsonic-navfooter/40 px-6 py-16 text-center">
            <p className="text-subsonic-muted text-sm uppercase tracking-widest">
              No se encontraron festivales con ese filtro.
            </p>
          </div>
        ) : (
          <FestivalGrid festivals={filteredFestivals} />
        )}
      </div>
    </main>
  );
};

export default Home;