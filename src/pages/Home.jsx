import React from 'react';
import Hero from '../components/ui/Hero'; 
import FestivalGrid from '../components/ui/FestivalGrid';
import festivalsData from '../data/festivals.json'; 

const Home = () => {
  return (
    <div className="flex flex-col items-center py-10">
      <Hero />
      {}
      <FestivalGrid festivals={festivalsData} />
    </div>
  );
};

export default Home;