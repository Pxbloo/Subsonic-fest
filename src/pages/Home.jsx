import React from 'react';
import Hero from '../components/ui/Hero'; 
import FestivalGrid from '../components/ui/FestivalGrid';
import festivalsData from '../data/festivals.json'; 

const Home = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingFestivals = festivalsData.filter((fest) => {
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