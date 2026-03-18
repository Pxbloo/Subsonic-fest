import React, { useEffect, useState } from 'react';
import Hero from '../components/ui/Hero'; 
import FestivalGrid from '../components/ui/FestivalGrid';

const Home = () => {
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await fetch('http://localhost:3000/festivals');
        if (!response.ok) throw new Error('Error al cargar festivales');
        const data = await response.json();
        setFestivals(data || []);
      } catch (error) {
        console.error('Error fetching festivals:', error);
        setFestivals([]);
      }
    };

    fetchFestivals();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingFestivals = festivals.filter((fest) => {
    const referenceDateString = fest.startDate || fest.date;
    const festivalDate = new Date(referenceDateString);
    return festivalDate >= today;
  });

  return (
    <div className="flex flex-col items-center py-10">
      <Hero />
      {}
      <FestivalGrid festivals={upcomingFestivals} />
    </div>
  );
};

export default Home;