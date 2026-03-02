import React from "react";
import logo from "@/assets/logo/Subsonic-long.webp";
import Button from "@/components/ui/Button";
import AppLink from "@/components/ui/AppLink";

const Navbar = ({ onOpenLogin, onOpenRegister }) => {
  const isLoggedIn = false;   // Cambiar cuando tengamos back
  const username = "Usuario"; // Cambiar cuando tengamos back

  return (
    <nav className='bg-subsonic-navfooter border-b border-subsonic-border px-6 py-4 flex items-center justify-between font-inter'>
      <img src={logo} alt="Logo" className="w-40 h-auto object-contain hover:opacity-50 transition-opacity cursor-pointer" />
      <div className="flex gap-24 text-subsonic-text font-bold">
        <AppLink href="/">Inicio</AppLink>
        <AppLink href="/tienda">Tienda</AppLink>
        <AppLink href="/blog">Blog</AppLink>
        <AppLink href="/contacto">Contacto</AppLink>
      </div>
      <div className="flex gap-6 items-center">
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <span className="text-subsonic-text"> Hola, {username}</span>
            <div className="w-10 h-10 rounded-full bg-subsonic-accent"></div> {/* Avatar */}
          </div>
        ) : (
          <>
            <Button variant="ghost" onClick={onOpenLogin}>Log In</Button>
            <Button variant="primarySmall" onClick={onOpenRegister}>Registro</Button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;