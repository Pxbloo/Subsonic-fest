import React from 'react';
import Button from './Button'; 

const Hero = () => {
  return (
    <section className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-5xl md:text-7xl font-black text-subsonic-accent mb-4 tracking-tighter uppercase">
        SUBSONIC FESTIVAL
      </h1>
      <p className="text-xl md:text-2xl text-subsonic-text font-bold mb-8 uppercase">
        EVENTOS, EXPERIENCIAS Y MÁS
      </p>
      
      {}
      <Button variant="outline">
        Siente la Vibración
      </Button>
    </section>
  );
};

export default Hero;