import React from 'react';

const BaseCard = ({ children, className = "", onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`bg-subsonic-navfooter border border-subsonic-border rounded-2xl p-6 flex flex-col transition-colors hover:border-subsonic-accent group ${className}`}
    >
      {children}
    </div>
  );
};

export default BaseCard;