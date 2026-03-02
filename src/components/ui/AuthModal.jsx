import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const AuthModal = ({ isOpen, initialType, onClose }) => {
  const [activeTab, setActiveTab] = useState(initialType);

  useEffect(() => {
    setActiveTab(initialType);
  }, [initialType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-subsonic-surface border border-subsonic-border p-8 rounded-lg w-full max-w-xl shadow-2xl relative">
        
        {/* Pestañas */}
        <div className="flex gap-10 mb-10 justify-center">
          {['login', 'register'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`text-xl font-montserrat font-black uppercase tracking-tighter transition-all relative pb-2 ${
                activeTab === tab ? 'text-subsonic-accent' : 'text-subsonic-muted hover:text-subsonic-text'
              }`}
            >
              {tab === 'login' ? 'Iniciar Sesión' : 'Registro'}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-subsonic-accent "></span>
              )}
            </button>
          ))}
        </div>

        {/* Formulario dinámico */}
        {activeTab === 'login' ? (
          <form className="space-y-5 max-w-sm mx-auto">
            <Input label="Email o teléfono" type="email" placeholder="tu@email.com" />
            <div className="relative">
              <Input label="Contraseña" type="password" placeholder="••••••••" />
              <button type="button" className="absolute right-3 top-9 text-subsonic-muted hover:text-subsonic-text transition-colors">Mostrar</button>
            </div>
            <Button variant="primary" className="w-full py-4 text-base">Iniciar Sesión</Button>
          </form>
        ) : (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nombre *" placeholder="Tu nombre" />
            <Input label="Apellidos *" placeholder="Tus apellidos" />
            <Input label="Email *" type="email" placeholder="correo@ejemplo.com" className="md:col-span-2" />
            <Input label="Teléfono" type="tel" placeholder="+34 ..." />
            
            <div className="space-y-1">
               <label className="block text-xs font-montserrat text-subsonic-muted uppercase tracking-widest ml-1">Tipo de usuario *</label>
               <select className="w-full bg-subsonic-surface border border-subsonic-border p-3 rounded-md text-sm text-subsonic-text focus:border-subsonic-accent outline-none" defaultValue="">
                 <option value="" disabled>Selecciona...</option>
                 <option value="fan">Fan</option>
                 <option value="artist">Artista</option>
               </select>
            </div>

            <div className="md:col-span-2 border-2 border-dashed border-subsonic-border rounded-lg p-6 text-center text-subsonic-muted hover:border-subsonic-accent transition-colors cursor-pointer bg-subsonic-navfooter/70">
              <p className="text-xs uppercase tracking-widest italic">Arrastra archivos aquí (DNI / Portfolio)</p>
            </div>
            
            <Button variant="primary" className="md:col-span-2 py-4 text-base mt-2">Registrarse</Button>
          </form>
        )}
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose} 
          className="mt-8 block mx-auto text-[10px] uppercase tracking-[0.3em] text-subsonic-muted hover:text-subsonic-text transition-colors"
        >
          Cerrar ventana
        </button>
      </div>
    </div>
  );
};

export default AuthModal;