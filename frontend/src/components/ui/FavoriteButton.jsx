import React, { useState } from 'react';
import { useFavorites } from '../../hooks/useFavorites';

export default function FavoriteButton({ id, type, className = '', onToggle }) {
  const { isAuthenticated, isFavorite, toggleFavorite } = useFavorites();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Por favor, inicia sesión para agregar favoritos');
      return;
    }

    if (!id || !type) {
      console.error('FavoriteButton: id y type son requeridos');
      return;
    }

    setIsToggling(true);
    try {
      const success = await toggleFavorite(id, type);
      if (success && onToggle) {
        onToggle(id, type);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Error al cambiar favorito. Intenta de nuevo.');
    } finally {
      setIsToggling(false);
    }
  };

  const isFav = isFavorite(id, type);

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isToggling || !isAuthenticated}
      className={`
        transition-all duration-200 
        ${isFav 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded
        ${className}
      `}
      title={isFav ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
      aria-label={isFav ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
      aria-pressed={isFav}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFav ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-6 h-6 transition-transform ${isToggling ? 'scale-95' : 'scale-100'}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
