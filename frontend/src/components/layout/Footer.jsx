import React from 'react';
import { Link } from 'react-router-dom'; 
import SubsonicLogo from "@/assets/logo/Subsonic.webp";
import SocialLinks from '@/components/ui/SocialLinks'; // Importación del componente de redes sociales

const Footer = () => {
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
              <li><Link to="/" className="hover:text-subsonic-accent transition-colors">Experiencias</Link></li>
              <li><Link to="/" className="hover:text-subsonic-accent transition-colors">Paquetes</Link></li>
              <li><Link to="/" className="hover:text-subsonic-accent transition-colors">Entradas</Link></li>
            </ul>
          </div>

          {/* Columna 3: Tienda */}
          <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl mb-6 uppercase">
              Tienda
            </h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              <li><Link to="/" className="hover:text-subsonic-accent transition-colors">Ropa</Link></li>
              <li><Link to="/" className="hover:text-subsonic-accent transition-colors">Accesorios</Link></li>
              <li><Link to="/" className="hover:text-subsonic-accent transition-colors">Otros</Link></li>
            </ul>
          </div>

          {/* Columna 4: Blog */}
          <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl mb-6 uppercase">
              Blog
            </h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              <li><Link to="/" className="hover:text-subsonic-accent transition-colors">Noticias y <br />novedades</Link></li>
              <li><Link to="/" className="hover:text-subsonic-accent transition-colors">Artículos de <br/>artistas</Link></li>
            </ul>
          </div>

          {/* Columna 5: Contacto */}
          <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl mb-6 uppercase">
              Contacto
            </h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              <li><Link to="/" className="hover:text-subsonic-accent transition-colors">FAQ</Link></li>
              <li><Link to="/" className="hover:text-subsonic-accent transition-colors">Soporte</Link></li>
              <li><Link to="/" className="hover:text-subsonic-accent transition-colors">Trabaja con <br/>nosotros</Link></li>
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