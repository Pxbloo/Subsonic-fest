import React from 'react';
import BaseCard from '@/components/ui/BaseCard.jsx';

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
    month: 'short',
    year: 'numeric',
  });
};

const BlogCard = ({ post, onClick }) => {
  const categoriaClass =
    CATEGORIA_COLORS[post.categoria] ||
    'bg-subsonic-accent/20 text-subsonic-accent border-subsonic-accent/30';

  return (
    <div
      className="group cursor-pointer h-full"
      onClick={() => onClick?.(post)}
    >
      <BaseCard className="relative items-stretch rounded-3xl bg-subsonic-surface/90 h-full  overflow-hidden ">
        <div className="w-full aspect-video overflow-hidden">
          <img
            src={post.imagen}
            alt={post.titulo}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            onError={(e) => {
              e.target.src = "";
            }}
          />
        </div>


        <div className="flex flex-col gap-3 p-5 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${categoriaClass}`}
            >
              {post.categoria}
            </span>
            <span className="text-[10px] text-subsonic-muted uppercase tracking-widest">
              {formatDate(post.fecha)}
            </span>
          </div>

          <h3 className="text-sm font-black uppercase tracking-tight text-subsonic-text leading-snug group-hover:text-subsonic-accent transition-colors line-clamp-3">
            {post.titulo}
          </h3>

          <p className="text-[11px] text-subsonic-muted leading-relaxed line-clamp-3 flex-1">
            {post.resumen}
          </p>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-subsonic-border">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] uppercase tracking-widest text-subsonic-muted bg-subsonic-bg/60 px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </BaseCard>
    </div>
  );
};

export default BlogCard;