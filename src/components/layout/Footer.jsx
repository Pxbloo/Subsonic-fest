import React from 'react';
import { Link } from 'react-router-dom';   // Cuando tengamos backend podemos detectar la pagina en la que estamos
import SubsonicLogo from "@/assets/logo/Subsonic.webp";
import AppLink from '@/components/ui/AppLink';

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
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl  mb-6">
              Inicio
            </h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              <li><AppLink href="/experiencias">Experiencias</AppLink></li>
              <li><AppLink href="/paquetes">Paquetes</AppLink></li>
              <li><AppLink href="/entradas">Entradas</AppLink></li>
            </ul>
          </div>

        <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl  mb-6">
              Tienda
            </h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              <li><AppLink href="/ropa">Ropa</AppLink></li>
              <li><AppLink href="/accesorios">Accesorios</AppLink></li>
              <li><AppLink href="/otros">Otros</AppLink></li>
            </ul>
          </div>

        <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl  mb-6">
              Blog
            </h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              <li><AppLink href="/noticias">Noticias y <br />novedades</AppLink></li>
              <li><AppLink href="/artistas">Articulos de <br/>artistas</AppLink ></li>
            </ul>
          </div>

        <div>
            <h4 className="font-montserrat font-bold text-subsonic-muted text-xl  mb-6">
              Contacto
            </h4>
            <ul className="space-y-4 text-sm font-extralight text-subsonic-text">
              <li><AppLink href="/faq">FAQ</AppLink></li>
              <li><AppLink href="/soporte">Soporte</AppLink></li>
              <li><AppLink href="/trabaja-con-nosotros">Trabaja con <br/>nosotros</AppLink></li>
            </ul>
          </div>
        <div>
            <ul className="space-y-4 text-sm font-thin text-subsonic-text">
              <li><a href="#" className="transition-colors hover:text-[#E1306C]">Instagram</a></li>
              <li><a href="#" className="transition-colors hover:text-[#1DA1F2]">X (Twitter)</a></li>
              <li><a href="#" className="transition-colors hover:text-[#FF0000]">YouTube</a></li>
              <li><a href="#" className="transition-colors hover:text-[#0A66C2]">LinkedIn</a></li>
              <li><a href="#" className="transition-colors hover:text-[#FF5500]">SoundCloud</a></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;