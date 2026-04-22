import React, { useMemo, useState } from "react";
import ProductModal from './ProductModal';
import FavoriteButton from './FavoriteButton';

const ShopCard = ({ id, name, category, price, description, image, stock, purchaseOptions, onAddToCart}) => {

    const [open, setOpen] = useState(false);

    const product = useMemo(
        () => ({ name, category, price, description, image, stock, purchaseOptions }),
        [name, category, price, description, image, stock, purchaseOptions]
    );

    return (
        <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl p-6 flex flex-col items-center text-center hover:border-subsonic-accent transition-colors group relative">
            <div className="absolute right-4 top-4 z-10 rounded-full bg-subsonic-bg/80 p-2 backdrop-blur-sm">
                <FavoriteButton id={id} type="product" className="block" />
            </div>
            <div className="w-full aspect-video bg-subsonic-border rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <span className="text-subsonic-muted group-hover:scale-110 transition-transform">Imagen Producto</span>
            </div>
            <h3 className="text-2xl font-black text-subsonic-text mb-2 uppercase tracking-tighter">{name}</h3>
            <p className="text-subsonic-muted text-sm mb-2 font-bold">{category}</p>
            <p className="text-subsonic-text text-sm mb-10 leading-relaxed opacity-80">
                {description}
            </p>
            <div className="flex justify-between items-center w-full mt-auto">
                <span className="text-subsonic-accent font-black text-xl">{price}€</span>
                <button
                    onClick={() => setOpen(true)}
                    className="bg-subsonic-accent text-subsonic-bg px-4 py-2 rounded-full font-black text-xs uppercase hover:bg-subsonic-text transition-colors"
                >
                    Añadir al carrito
                </button>
                <ProductModal
                    open={open}
                    product={product}
                    onClose={() => setOpen(false)}
                    onAddToCart={onAddToCart}
                />
            </div>
        </div>
    );
};

export default ShopCard;
