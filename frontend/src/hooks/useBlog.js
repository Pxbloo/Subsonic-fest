import { useState, useEffect } from 'react';
import API_BASE_URL from '@/config/api';

const useBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/blogPosts`);
        if (!response.ok) throw new Error('Error al cargar el blog');
        const data = await response.json();
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const categorias = ['Todas', ...new Set(posts.map((p) => p.categoria))];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.resumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategoria =
      categoriaActiva === 'Todas' || post.categoria === categoriaActiva;

    return matchesSearch && matchesCategoria;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(typeof e === 'string' ? e : e.target.value);
  };

  return {
    posts,
    filteredPosts,
    loading,
    error,
    searchTerm,
    handleSearchChange,
    categorias,
    categoriaActiva,
    setCategoriaActiva,
  };
};

export default useBlog;