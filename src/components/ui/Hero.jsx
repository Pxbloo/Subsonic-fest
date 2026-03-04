import React from 'react';

const Hero = () => {
  return (
    <section className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {}
      <h1 className="text-5xl md:text-7xl font-black text-subsonic-accent mb-4 tracking-tighter uppercase">
        SUBSONIC FESTIVAL
      </h1>
      
      {}
      <p className="text-xl md:text-2xl text-subsonic-text font-bold mb-8 uppercase">
        EVENTOS, EXPERIENCIAS Y MÁS
      </p>
      
      {}
      <button className="border-2 border-subsonic-accent text-subsonic-accent px-8 py-3 rounded-full font-bold hover:bg-subsonic-accent hover:text-subsonic-bg transition-all uppercase text-sm">
        Siente la Vibración
      </button>
    </section>
  );
};

export default Hero;