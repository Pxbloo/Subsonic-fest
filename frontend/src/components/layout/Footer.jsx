import React from 'react';
import { Link } from 'react-router-dom'; 
import SubsonicLogo from "@/assets/logo/Subsonic.webp";
import SocialLinks from '@/components/ui/SocialLinks'; // Importación del componente de redes sociales

const Footer = () => {
  const homeLinks = [
    { to: '/', label: 'Experiencias' },
  ];

  const shopLinks = [
    { to: '/tienda?categoria=ropa', label: 'Ropa' },
    { to: '/tienda?categoria=accesorios', label: 'Accesorios' },
  ];

  const blogLinks = [
    { to: '/blog', label: 'Noticias y novedades' },
  ];

  const contactLinks = [
    { to: '/contact', label: 'Contacto' },
  ];

  const renderLink = ({ to, label }) => (
    <li key={label}>
      <Link
        to={to}
        className="transition-colors hover:text-subsonic-accent"
      >
        {label}
      </Link>
    </li>
  );

  return (
    <footer className="bg-subsonic-navfooter border-t border-subsonic-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-15">
          
          {/* Columna 1: Logo con enlace a Home */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/">
              <img 
                src={SubsonicLogo} 
                alt="Subsonic Logo" 
                className="w-40 h-auto mb-6 hover:opacity-50 transition-opacity cursor-pointer" 
              />
            </Link>
          </div>

          {/* Columna 2: Inicio */}
          <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl mb-6 uppercase">
              Inicio
            </h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              {homeLinks.map(renderLink)}
            </ul>
          </div>

          {/* Columna 3: Tienda */}
          <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl mb-6 uppercase">
              Tienda
            </h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              {shopLinks.map(renderLink)}
            </ul>
          </div>

          {/* Columna 4: Blog */}
          <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl mb-6 uppercase">
              Blog
            </h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              {blogLinks.map(renderLink)}
            </ul>
          </div>

          {/* Columna 5: Contacto */}
          <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl mb-6 uppercase">
              Contacto
            </h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              {contactLinks.map(renderLink)}
            </ul>
          </div>

          {/* Columna 6: Redes Sociales (Componetizada) */}
          <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl mb-6 uppercase">
              Síguenos
            </h4>
            {/* Usamos la variante 'full' para mostrar iconos y nombres */}
            <SocialLinks variant="full" />
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
