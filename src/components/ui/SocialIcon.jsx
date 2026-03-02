import React from 'react';
import InstagramIcon from "@/assets/icons/Instagram_icon.webp";
import LinkedInIcon from "@/assets/icons/LinkedIn.webp";
import XIcon from "@/assets/icons/X.webp";
import YoutubeIcon from "@/assets/icons/Youtube.webp";

const SocialIcon = ({ platform, href = "#", showText = true }) => {
  const platforms = {
    instagram: { name: 'Instagram', icon: InstagramIcon, hoverColor: 'group-hover:text-[#E1306C]' },
    x: { name: 'X (Twitter)', icon: XIcon, hoverColor: 'group-hover:text-[#1DA1F2]' },
    youtube: { name: 'YouTube', icon: YoutubeIcon, hoverColor: 'group-hover:text-[#FF0000]' },
    linkedin: { name: 'LinkedIn', icon: LinkedInIcon, hoverColor: 'group-hover:text-[#0A66C2]' },
    soundcloud: { name: 'SoundCloud', icon: null, hoverColor: 'group-hover:text-[#FF5500]' }
  };

  const data = platforms[platform.toLowerCase()];
  if (!data) return null;

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`flex items-center gap-3 transition-colors duration-300 group text-subsonic-text ${data.hoverColor}`}
    >
      {data.icon ? (
        <img 
          src={data.icon} 
          alt={data.name} 

          className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity object-contain" 
        />
      ) : (
        <div className="w-5 h-5 flex items-center justify-center text-[10px] font-bold border border-current rounded-sm">SC</div>
      )}
      {showText && <span className="text-sm font-extralight">{data.name}</span>}
    </a>
  );
};

export default SocialIcon;