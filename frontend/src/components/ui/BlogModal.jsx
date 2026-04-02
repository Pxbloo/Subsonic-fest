import React from 'react';
import Button from '@/components/ui/Button';

const CATEGORIA_COLORS = {
  Internacional: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Latin: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Festivales: 'bg-subsonic-accent/20 text-subsonic-accent border-subsonic-accent/30',
  Conciertos: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const formatDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const BlogModal = ({ post, onClose }) => {
  if (!post) return null;

  const categoriaClass =
    CATEGORIA_COLORS[post.categoria] ||
    'bg-subsonic-accent/20 text-subsonic-accent border-subsonic-accent/30';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={post.titulo}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-subsonic-border bg-subsonic-navfooter text-subsonic-text shadow-2xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest text-subsonic-muted hover:bg-white/10 hover:text-subsonic-text transition"
          onClick={onClose}
          aria-label="Cerrar detalle del artículo"
        >
          ✕
        </button>

        <div className="w-full h-52 md:h-64 overflow-hidden border-b border-subsonic-border bg-subsonic-bg/60">
          <img
            src={post.imagen}
            alt={post.titulo}
            className="w-full h-full object-cover opacity-85"
            onError={(e) => {
              e.target.src = "";
            }}
          />
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-4">
          <div className="flex items-center flex-wrap gap-2">
            <span
              className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${categoriaClass}`}
            >
              {post.categoria}
            </span>
            <span className="text-[10px] text-subsonic-muted uppercase tracking-widest">
              {formatDate(post.fecha)}
            </span>
            <span className="text-[10px] text-subsonic-muted uppercase tracking-widest">
              · {post.autor}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-subsonic-text leading-snug">
            {post.titulo}
          </h2>

          <p className="text-sm text-subsonic-text/80 leading-relaxed">
            {post.contenido}
          </p>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t border-subsonic-border">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] uppercase tracking-widest text-subsonic-muted bg-subsonic-bg/60 px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-3 justify-between pt-2 mt-2 border-t border-subsonic-border">
            {post.url && (
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="primarySmall" className="text-xs">
                  Leer artículo completo
                </Button>
              </a>
            )}
            <Button variant="outline" className="text-xs" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
