import SocialIcon from './SocialIcon';

const SocialLinks = ({ variant = 'full' }) => {
  const platforms = ['x', 'instagram', 'youtube', 'linkedin', 'soundcloud'];

  return (
    <div className={variant === 'minimal' ? 'flex gap-6' : 'flex flex-col gap-4'}>
      {platforms.map(p => (
        <SocialIcon 
          key={p} 
          platform={p} 
          showText={variant === 'full'} 
        />
      ))}
    </div>
  );
};

export default SocialLinks;