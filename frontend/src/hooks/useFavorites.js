import { useState, useEffect, useRef } from 'react';
import API_BASE_URL from '../config/api';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useFavorites = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [favorites, setFavorites] = useState({
    favorite_artists: [],
    favorite_festivals: [],
    favorite_products: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();

    unsubscribeRef.current = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userToken = await currentUser.getIdToken();
          const storedUser = JSON.parse(localStorage.getItem('user'));

          if (storedUser && userToken) {
            setUser(storedUser);
            setToken(userToken);
            await loadFavoritesInternal(userToken);
          }
        } catch (err) {
          console.error('Error setting up auth:', err);
          setError('Error al configurar la autenticación');
        }
      } else {
        setUser(null);
        setToken(null);
        setFavorites({
          favorite_artists: [],
          favorite_festivals: [],
          favorite_products: []
        });
      }
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const loadFavoritesInternal = async (authToken) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Sesión expirada. Por favor, inicia sesión de nuevo.');
        } else {
          throw new Error('Error al cargar favoritos');
        }
        return;
      }

      const data = await response.json();
      setFavorites({
        favorite_artists: data.favorite_artists || [],
        favorite_festivals: data.favorite_festivals || [],
        favorite_products: data.favorite_products || []
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user || !token) return;
    await loadFavoritesInternal(token);
  };

  const addFavoriteArtist = async (artistId) => {
    if (!user || !token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/artists/${artistId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al agregar artista a favoritos');

      setFavorites(prev => ({
        ...prev,
        favorite_artists: [...prev.favorite_artists, artistId]
      }));
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error adding favorite artist:', err);
      return false;
    }
  };

  const removeFavoriteArtist = async (artistId) => {
    if (!user || !token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/artists/${artistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al eliminar artista de favoritos');

      setFavorites(prev => ({
        ...prev,
        favorite_artists: prev.favorite_artists.filter(id => id !== artistId)
      }));
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error removing favorite artist:', err);
      return false;
    }
  };

  const addFavoriteFestival = async (festivalId) => {
    if (!user || !token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/festivals/${festivalId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al agregar festival a favoritos');

      setFavorites(prev => ({
        ...prev,
        favorite_festivals: [...prev.favorite_festivals, festivalId]
      }));
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error adding favorite festival:', err);
      return false;
    }
  };

  const removeFavoriteFestival = async (festivalId) => {
    if (!user || !token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/festivals/${festivalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al eliminar festival de favoritos');

      setFavorites(prev => ({
        ...prev,
        favorite_festivals: prev.favorite_festivals.filter(id => id !== festivalId)
      }));
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error removing favorite festival:', err);
      return false;
    }
  };

  const addFavoriteProduct = async (productId) => {
    if (!user || !token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/products/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al agregar producto a favoritos');

      setFavorites(prev => ({
        ...prev,
        favorite_products: [...prev.favorite_products, productId]
      }));
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error adding favorite product:', err);
      return false;
    }
  };

  const removeFavoriteProduct = async (productId) => {
    if (!user || !token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al eliminar producto de favoritos');

      setFavorites(prev => ({
        ...prev,
        favorite_products: prev.favorite_products.filter(id => id !== productId)
      }));
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error removing favorite product:', err);
      return false;
    }
  };

  const isFavorite = (id, type) => {
    switch (type) {
      case 'artist':
        return favorites.favorite_artists.includes(id);
      case 'festival':
        return favorites.favorite_festivals.includes(id);
      case 'product':
        return favorites.favorite_products.includes(id);
      default:
        return false;
    }
  };

  const toggleFavorite = async (id, type) => {
    if (isFavorite(id, type)) {
      switch (type) {
        case 'artist':
          return await removeFavoriteArtist(id);
        case 'festival':
          return await removeFavoriteFestival(id);
        case 'product':
          return await removeFavoriteProduct(id);
        default:
          return false;
      }
    } else {
      switch (type) {
        case 'artist':
          return await addFavoriteArtist(id);
        case 'festival':
          return await addFavoriteFestival(id);
        case 'product':
          return await addFavoriteProduct(id);
        default:
          return false;
      }
    }
  };

  return {
    user,
    token,
    favorites,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    loadFavorites,
    addFavoriteArtist,
    removeFavoriteArtist,
    addFavoriteFestival,
    removeFavoriteFestival,
    addFavoriteProduct,
    removeFavoriteProduct,
    isFavorite,
    toggleFavorite
  };
};
