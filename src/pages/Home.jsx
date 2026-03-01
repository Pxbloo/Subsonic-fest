import React from 'react';

const festivals = [
  { id: 1, title: 'Summer Subsonic', date: '15-17 Jul 2025', price: '89€' },
  { id: 2, title: 'Electronic Night', date: '22 Ago 2025', price: '45€' },
  { id: 3, title: 'Techno Experience', date: '05 Sep 2025', price: '60€' },
  { id: 4, title: 'Bass Festival', date: '12 Oct 2025', price: '75€' },
  { id: 5, title: 'Neon Party', date: '30 Oct 2025', price: '40€' },
  { id: 6, title: 'Winter Subsonic', date: '20 Dic 2025', price: '95€' },
];

const Home = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black text-subsonic-accent mb-4 tracking-tighter uppercase">
          SUBSONIC FESTIVAL
        </h1>
        <p className="text-xl md:text-2xl text-subsonic-text font-bold mb-8">
          EVENTOS, EXPERIENCIAS Y MÁS
        </p>
        <button className="border-2 border-subsonic-accent text-subsonic-accent px-8 py-3 rounded-full font-bold hover:bg-subsonic-accent hover:text-subsonic-bg transition-all uppercase text-sm">
          Siente la Vibración
        </button>
      </section>

      {/* Grid de Festivales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {festivals.map((fest) => (
          <div key={fest.id} className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-full aspect-video bg-subsonic-border rounded-lg mb-6 flex items-center justify-center">
              {/* Espacio para la imagen del festival */}
              <span className="text-subsonic-muted">Imagen Festival</span>
            </div>
            <h3 className="text-2xl font-black text-subsonic-text mb-2 uppercase">{fest.title}</h3>
            <p className="text-subsonic-muted text-sm mb-2">{fest.date}</p>
            <p className="text-subsonic-text text-sm mb-6 leading-relaxed">
              Descripción del festival con los detalles más importantes para los asistentes.
            </p>
            <div className="flex justify-between items-center w-full mt-auto">
              <span className="text-subsonic-accent font-bold text-xl">{fest.price}</span>
              <button className="bg-subsonic-accent text-subsonic-bg px-4 py-2 rounded-full font-bold text-xs uppercase hover:opacity-80 transition-opacity">
                Más información
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;