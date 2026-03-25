import React from 'react';

const PageHeader = ({ title, className = '' }) => {
  return (
    <header className={`mb-12 ${className}`}>
      <h1 className="text-6xl font-black text-white uppercase tracking-tighter mb-2">
        {title}
      </h1>
      <div className="h-1 w-24 bg-subsonic-accent"></div>
    </header>
  );
};

export default PageHeader;
