import React from 'react';
import SubsonicLogo from "@/assets/logo/Subsonic.webp";
import AppLink from "../ui/AppLink";
import SocialLinks from "../ui/SocialLinks";

const Footer = () => {
  return (
    <footer className="bg-subsonic-navfooter border-t border-subsonic-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-15">
          
          <div className="col-span-1 md:col-span-1">
            <img 
              src={SubsonicLogo} 
              alt="Subsonic Logo" 
              className="w-40 h-auto mb-6 hover:opacity-50 transition-opacity cursor-pointer" 
            />
          </div>

          <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl mb-6 uppercase">Inicio</h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              <li><AppLink href="/experiencias">Experiencias</AppLink></li>
              <li><AppLink href="/paquetes">Paquetes</AppLink></li>
              <li><AppLink href="/entradas">Entradas</AppLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl mb-6 uppercase">Tienda</h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              <li><AppLink href="/ropa">Ropa</AppLink></li>
              <li><AppLink href="/accesorios">Accesorios</AppLink></li>
              <li><AppLink href="/otros">Otros</AppLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl mb-6 uppercase">Blog</h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              <li><AppLink href="/noticias">Noticias y <br />novedades</AppLink></li>
              <li><AppLink href="/artistas">Artículos de <br/>artistas</AppLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl mb-6 uppercase">Contacto</h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              <li><AppLink href="/faq">FAQ</AppLink></li>
              <li><AppLink href="/soporte">Soporte</AppLink></li>
              <li><AppLink href="/trabaja-con-nosotros">Trabaja con <br/>nosotros</AppLink></li>
            </ul>
          </div>

          {/* Columna de Redes Sociales Actualizada */}
          <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl mb-6 uppercase">Síguenos</h4>
            <SocialLinks variant="vertical" />
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;