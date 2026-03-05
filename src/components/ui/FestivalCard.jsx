import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button'; 

const FestivalCard = ({ id, title, date, price, description }) => {
  return (
    <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl p-6 flex flex-col items-center text-center hover:border-subsonic-accent transition-colors group">
      {}
      <div className="w-full aspect-video bg-subsonic-border rounded-lg mb-6 flex items-center justify-center overflow-hidden">
        <span className="text-subsonic-muted group-hover:scale-110 transition-transform font-bold uppercase text-[10px]">
          Imagen Festival
        </span>
      </div>

      <h3 className="text-2xl font-black text-subsonic-text mb-2 uppercase tracking-tighter">
        {title}
      </h3>
      <p className="text-subsonic-muted text-sm mb-2 font-bold">
        {date}
      </p>
      <p className="text-subsonic-text text-sm mb-6 leading-relaxed opacity-80">
        {description}
      </p>

      <div className="flex justify-between items-center w-full mt-auto">
        <span className="text-subsonic-accent font-black text-xl">
          {price}
        </span>
        
        {}
        <Link to={`/festival/${id}`}>
          <Button variant="primarySmall">
            Más información
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FestivalCard;