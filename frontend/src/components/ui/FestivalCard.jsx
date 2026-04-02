import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button'; 
import BaseCard from './BaseCard';

const FestivalCard = ({ id, title, date, startDate, price, description, image }) => {
  const referenceDateString = startDate || date;
  const festivalDate = new Date(referenceDateString);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPast = festivalDate < today;

  const imageUrl = image || "https://www.boombasticfestival.com/images/passes/abono-vip-pass.jpg";

  const handleViewPostsClick = (event) => {
    event.preventDefault(); 
    event.stopPropagation(); 
    window.open('https://www.instagram.com/boombastic_festival/', '_blank');
  };

  return (
    <Link to={`/festival/${id}`} className="block h-full">
      <BaseCard className="items-center text-center h-full">
        <div className="w-full aspect-video bg-subsonic-border rounded-lg mb-6 flex items-center justify-center overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
          />
        </div>

        <h3 className="text-2xl font-black text-subsonic-text mb-2 uppercase tracking-tighter">
          {title}
        </h3>
        <p className="text-subsonic-muted text-sm mb-2 font-bold italic">
          {date}
        </p>

        <p className="text-subsonic-text text-sm mb-6 leading-relaxed opacity-80">
          {description}
        </p>

        <div className="flex justify-between items-center w-full mt-auto">
          {isPast ? (
            <Button 
              onClick={handleViewPostsClick}
              className="bg-subsonic-accent text-black font-black py-2 rounded-lg text-xs uppercase tracking-widest"
            >
              Ver publicaciones
            </Button>
          ) : (
            <>
              <span className="text-subsonic-accent font-black text-xl">
                {price}
              </span>
              <Button variant="primarySmall">
                Más información
              </Button>
            </>
          )}
        </div>
      </BaseCard>
    </Link>
  );
};

export default FestivalCard;