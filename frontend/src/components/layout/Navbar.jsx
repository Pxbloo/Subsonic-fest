import React from "react";
import logo from "@/assets/logo/Subsonic-long.webp";
import Button from "@/components/ui/Button";
import AppLink from "@/components/ui/AppLink";

const menuItems = {
    client: [
        {href: "/", label: "Inicio"},
        {href: "/tienda", label: "Tienda"},
        {href: "/blog", label: "Blog"},
        {href: "/contact", label: "Contacto"},
    ],
    provider: [
        {href: "/", label: "Inicio"},
        {href: "/grounds", label: "Mis recintos"},
        {href: "/sales-dashboard", label: "Mis ventas"},
        {href: "/contact", label: "Contacto"},
    ],
    admin: [
        {href: "/dashboard-festivales", label: "Festivales"},
        {href: "/dashboard-grounds", label: "Recintos"},
        {href: "/dashboard-usuarios", label: "Usuarios"},
        {href: "/dashboard-entradas", label: "Entradas"},
        {href: "/dashboard-artistas", label: "Artistas"},
        {href: "/dashboard-productos", label: "Productos"},
    ]
};

const Navbar = ({ user, onOpenLogin, onOpenRegister, onLogout }) => {

    const getMenuItems = () => {
        if (!user) return menuItems.client;

        switch (user.role) {
            case 'provider':
                return menuItems.provider;
            case 'admin':
                return menuItems.admin;
            case 'client':
            default:
                return menuItems.client;
        }
    };

    const currentMenuItems = getMenuItems();

  return (
    <nav className='bg-subsonic-navfooter border-b border-subsonic-border px-6 py-4 flex items-center justify-between font-inter'>
        <AppLink href="/">
            <img
                src={logo}
                alt="Logo"
                className="w-40 h-auto object-contain hover:opacity-50 transition-opacity cursor-pointer"
            />
        </AppLink>
        <div className="flex gap-20 text-subsonic-text font-bold">
            {currentMenuItems.map((item) => (
                <AppLink key={item.href} href={item.href}>
                    {item.label}
                </AppLink>
            ))}
        </div>
      <div className="flex gap-6 items-center">
        {user ? (
          <div className="flex items-center gap-3">
              <AppLink href="/user-profile"
                  className="flex items-center gap-3 hover:opacity-90 transition-opacity"
              >
                  <span className="text-subsonic-text"> Hola, {user.name}</span>
                  {user.avatar ? (
                      <img
                          src={user.avatar}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover border border-subsonic-border"
                      />
                  ) : (
                      <div className="w-10 h-10 rounded-full bg-subsonic-accent"></div>
                  )}
              </AppLink>

              <span className="text-subsonic-muted select-none" aria-hidden="true">|</span>
              <Button variant="ghost" onClick={onLogout}>   {/* Cambiar para que no esté en mayusculas? */}
                  Log out
              </Button>
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