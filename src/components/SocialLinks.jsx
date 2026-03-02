import React from 'react';
import SocialIcon from './SocialIcon';

const SocialLinks = ({ variant = 'vertical' }) => {
  const platforms = ['instagram', 'x', 'youtube', 'linkedin', 'soundcloud'];
  
  return (
    <div className={variant === 'vertical' ? 'flex flex-col space-y-4' : 'flex flex-row space-x-6'}>
      {platforms.map((p) => (
        <SocialIcon 
          key={p} 
          platform={p} 
          showText={variant === 'vertical'} 
        />
      ))}
    </div>
  );
};

export default SocialLinks;