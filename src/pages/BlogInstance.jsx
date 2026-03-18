import React from 'react';
import BaseCard from '@/components/ui/BaseCard.jsx';
import Button from '@/components/ui/Button';

const CATEGORIA_COLORS = {
  Internacional: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Latin: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Festivales: 'bg-subsonic-accent/20 text-subsonic-accent border-subsonic-accent/30',
  Conciertos: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const formatDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
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
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <BaseCard className="bg-subsonic-navfooter/95 rounded-3xl overflow-hidden p-0 flex flex-col">
          {/* Imagen cabecera */}
          <div className="w-full h-52 md:h-64 overflow-hidden shrink-0">
            <img
              src={post.imagen}
              alt={post.titulo}
              className="w-full h-full object-cover opacity-85"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80';
              }}
            />
          </div>

          {/* Contenido scrollable */}
          <div className="p-6 md:p-8 flex flex-col gap-4 overflow-y-auto">
            {/* Categoría + fecha + autor */}
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

            {/* Título */}
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-subsonic-text leading-snug">
              {post.titulo}
            </h2>

            {/* Contenido */}
            <p className="text-sm text-subsonic-text/80 leading-relaxed">
              {post.contenido}
            </p>

            {/* Tags */}
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

            {/* Acciones */}
            <div className="flex gap-3 justify-between pt-2 mt-2 border-t border-subsonic-border">
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
              <Button variant="outline" className="text-xs" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
};

export default BlogModal;