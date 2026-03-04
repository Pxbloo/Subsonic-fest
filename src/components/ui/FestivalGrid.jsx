import React from 'react';
import FestivalCard from './FestivalCard'; 

const FestivalGrid = ({ festivals }) => {
  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
      {festivals.map((fest) => (
        <FestivalCard 
          key={fest.id} 
          {...fest} 
        />
      ))}
    </div>
  );
};

export default FestivalGrid;