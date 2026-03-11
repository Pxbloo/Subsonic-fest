import react from 'react';
import { Link } from 'react-router-dom';
import BaseCard from './BaseCard';

const GroundsCard = ({ id, name, description, image }) => {
    const imageUrl = image || "https://www.boombasticfestival.com/images/passes/abono-vip-pass.jpg";

    return (
        <Link to={`/grounds/${id}`} className="block h-full">
            <BaseCard className="items-center text-center h-full">
                <div className="w-full aspect-video bg-subsonic-border rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                    <img 
                        src={imageUrl} 
                        alt={name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    />
                </div>
            </BaseCard>
        </Link>
    );
};

export default GroundsCard;