import { useState, useEffect } from 'react';
import API_BASE_URL from '@/config/api';

const normalizePost = (post) => ({
  id: post.id,
  titulo: post.titulo ?? post.title ?? '',
  resumen: post.resumen ?? post.summary ?? '',
  contenido: post.contenido ?? post.content ?? '',
  categoria: post.categoria ?? post.category ?? 'General',
  tags: Array.isArray(post.tags) ? post.tags : [],
  fecha: post.fecha ?? post.date ?? '',
  autor: post.autor ?? post.author ?? '',
  imagen: post.imagen ?? post.image ?? '',
  url: post.url ?? '',
});

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
        setPosts(Array.isArray(data) ? data.map(normalizePost) : []);
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
    const titulo = String(post.titulo ?? '').toLowerCase();
    const resumen = String(post.resumen ?? '').toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      titulo.includes(term) ||
      resumen.includes(term) ||
      post.tags.some((tag) => String(tag).toLowerCase().includes(term));

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