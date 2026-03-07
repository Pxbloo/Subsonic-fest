import React from 'react';
import XIcon from '@/assets/icons/icon-twitterx.svg';
import InstagramIcon from '@/assets/icons/icon-instagram.svg';
import YoutubeIcon from '@/assets/icons/icon-youtube.svg';
import LinkedInIcon from '@/assets/icons/icon-linkedin.svg';
import SoundCloudIcon from '@/assets/icons/icon-soundcloud.svg'; 

const SocialIcon = ({ platform, url = "#", showText = false }) => {

  const platformData = {
    x: { icon: XIcon, name: 'Twitter', color: 'group-hover:text-white' },
    instagram: { icon: InstagramIcon, name: 'Instagram', color: 'group-hover:text-[#E1306C]' },
    youtube: { icon: YoutubeIcon, name: 'YouTube', color: 'group-hover:text-[#FF0000]' },
    linkedin: { icon: LinkedInIcon, name: 'LinkedIn', color: 'group-hover:text-[#0A66C2]' },
    soundcloud: { icon: SoundCloudIcon, name: 'SoundCloud', color: 'group-hover:text-[#FF5500]' }
  };

  const data = platformData[platform.toLowerCase()];
  if (!data) return null; 

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"

      className={`flex items-center gap-2 text-subsonic-muted transition-all duration-300 ${data.color} group`}
    >
      {data.icon ? (
        <img 
          src={data.icon} 
          alt={data.name} 

          className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity object-contain" 
        />
      ) : (
        <span className="text-[10px] font-bold uppercase border border-current px-1 rounded">{data.name}</span>
      )}
      
      {showText && (
        <span className="text-sm font-thin transition-colors duration-300">
          {data.name}
        </span>
      )}
    </a>
  );
};

export default SocialIcon;