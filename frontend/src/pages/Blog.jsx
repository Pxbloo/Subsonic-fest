import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import SearchBar from '@/components/ui/SearchBar';
import BlogCard from '@/components/ui/BlogCard';
import BlogModal from '@/components/ui/BlogModal';
import useBlog from '@/hooks/useBlog';
import SearchIcon from '@/assets/icons/search.svg';

const Blog = () => {
  const {
    filteredPosts,
    loading,
    error,
    searchTerm,
    handleSearchChange,
    categorias,
    categoriaActiva,
    setCategoriaActiva,
  } = useBlog();

  const [selectedPost, setSelectedPost] = useState(null);

  if (loading) {
    return (
      <main className="min-h-screen bg-subsonic-bg pt-24 pb-12 px-6 text-subsonic-text">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <PageHeader title="Blog" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-3xl bg-subsonic-navfooter/40 animate-pulse aspect-[4/5]"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-subsonic-bg pt-24 pb-12 px-6 text-subsonic-text">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <PageHeader title="Blog" />
          <p className="text-subsonic-muted text-sm">
            Error al cargar el blog: {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-subsonic-bg pt-24 pb-12 px-6 text-subsonic-text">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <PageHeader title="Blog" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-200 ${
                  categoriaActiva === cat
                    ? 'bg-subsonic-accent text-black border-subsonic-accent'
                    : 'border-subsonic-border text-subsonic-muted hover:border-subsonic-accent hover:text-subsonic-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            onSearch={handleSearchChange}
            placeholder="Buscar noticias..."
            className="w-full md:w-72 flex items-center bg-subsonic-navfooter border border-subsonic-border rounded-full px-4 py-2 gap-2"
            inputClassName="bg-transparent outline-none text-subsonic-text placeholder:text-subsonic-muted flex-1 text-sm"
            showButton={true}
            buttonLabel={
              <img
                src={SearchIcon}
                alt="Buscar"
                className="w-4 h-4 opacity-70"
              />
            }
            buttonClassName="text-subsonic-muted hover:text-subsonic-accent text-lg flex items-center justify-center"
          />
        </div>

        {filteredPosts.length > 0 && categoriaActiva === 'Todas' && !searchTerm && (
          <div
            className="group cursor-pointer w-full"
            onClick={() => setSelectedPost(filteredPosts[0])}
          >
            <div className="relative w-full rounded-3xl overflow-hidden aspect-[21/8] bg-subsonic-navfooter/90">
              <img
                src={filteredPosts[0].imagen}
                alt={filteredPosts[0].titulo}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
                onError={(e) => {
                  e.target.src = "";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-subsonic-accent mb-2">
                  {filteredPosts[0].categoria} · {filteredPosts[0].autor}
                </span>
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white leading-snug max-w-3xl group-hover:text-subsonic-accent transition-colors">
                  {filteredPosts[0].titulo}
                </h2>
                <p className="text-xs text-white/70 mt-2 max-w-2xl hidden md:block leading-relaxed">
                  {filteredPosts[0].resumen}
                </p>
              </div>
            </div>
          </div>
        )}

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(categoriaActiva === 'Todas' && !searchTerm
              ? filteredPosts.slice(1)
              : filteredPosts
            ).map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                onClick={setSelectedPost}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-subsonic-muted text-sm uppercase tracking-widest">
              No se encontraron resultados
            </p>
            <button
              onClick={() => {
                setCategoriaActiva('Todas');
                handleSearchChange('');
              }}
              className="text-[10px] uppercase tracking-widest text-subsonic-accent hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
      <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </main>
  );
};

export default Blog;