import React from 'react';
import Hero from '../components/ui/Hero';
import FestivalGrid from '../components/ui/FestivalGrid';

const Home = () => {
  // Datos de los festivales que alimentan la cuadrícula
  const festivalsData = [
    { id: 1, title: 'Summer Subsonic', date: '15-17 Jul 2025', price: '89€', description: 'El evento principal del verano con los mejores DJs internacionales.' },
    { id: 2, title: 'Electronic Night', date: '22 Ago 2025', price: '45€', description: 'Una noche dedicada al techno más puro en un entorno industrial.' },
    { id: 3, title: 'Techno Experience', date: '05 Sep 2025', price: '60€', description: 'Experiencia inmersiva con visuales de última generación.' },
    { id: 4, title: 'Bass Festival', date: '12 Oct 2025', price: '75€', description: 'Siente las frecuencias más bajas en el festival de Bass definitivo.' },
    { id: 5, title: 'Neon Party', date: '30 Oct 2025', price: '40€', description: 'Luces, colores y el mejor house para cerrar el mes.' },
    { id: 6, title: 'Winter Subsonic', date: '20 Dic 2025', price: '95€', description: 'Despide el año con el festival indoor más grande de la región.' },
  ];

  return (
    <div className="flex flex-col items-center py-10">
      {/* Sección principal de bienvenida */}
      <Hero />
      {/* Cuadrícula que renderiza las tarjetas de festivales */}
      <FestivalGrid festivals={festivalsData} />
    </div>
  );
};

export default Home;