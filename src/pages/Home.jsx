import React, { useEffect, useState } from 'react';
import Hero from '../components/ui/Hero'; 
import FestivalGrid from '../components/ui/FestivalGrid';
import API_BASE_URL from '@/config/api';

const Home = () => {
  const [festivals, setFestivals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/festivals`);
        if (!response.ok) throw new Error('Error al cargar festivales');
        const data = await response.json();
        console.log("Festivales recibidos de la DB:", data); 
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

    if (!referenceDateString) return true;

    const festivalDate = new Date(referenceDateString);

    if (isNaN(festivalDate.getTime())) return true;

    return festivalDate >= today;
  });

  return (
    <div className="flex flex-col items-center py-10">
      <Hero />
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-8">
          Error de conexión: {error}. Revisa si json-server está corriendo en el puerto 3000.
        </div>
      )}

      <FestivalGrid festivals={upcomingFestivals} />
    </div>
  );
};

export default Home;