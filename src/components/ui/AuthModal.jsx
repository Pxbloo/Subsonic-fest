import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import BaseCard from '@/components/ui/BaseCard.jsx';
import userData from "@/data/users.json";

const AuthModal = ({ isOpen, initialType, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState(initialType);
  const [userType, setUserType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerForm, setRegisterForm] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveTab(initialType);
    setErrorMessage('');
    if (initialType === 'login') {
      setUserType('');
    }
  }, [initialType]);

  function validateResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Network response was not ok.");
    }
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      setErrorMessage('Por favor, completa todos los campos obligatorios marcados con *.');
      form.reportValidity();
      return;
    }

    event.preventDefault();
    setErrorMessage('');

    if (activeTab === 'login') {
      try {
        console.log("Attempting login with:", { loginEmail, loginPassword });

        const response = await fetch('http://localhost:3001/users');
        const users = await response.json();

        const user = users.find(
            u => u.email === loginEmail || u.phone === loginEmail
        );

        if (user && user.password === loginPassword) {
          console.log("Login successful:", user);

          const savedUser = { ...user};
          delete savedUser.password;

          onLoginSuccess(user); // Cuando se pase a fetch -> modificar para no enviar contraseña de usuario al estado global
          onClose();
        }
        else {
          console.log("Login failed");
          setErrorMessage("Credenciales incorrectas.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrorMessage("Error al tomar usuarios de la base de datos.");
      }
    }
    else {
      await handleRegister();
    }
  };

  const handleRegister = async () => {
    try {
      const fullName = `${registerForm.name} ${registerForm.surname}`.trim();
      const existingUser = userData.users.find(u => u.email === registerForm.email);

      if (existingUser) {
        setErrorMessage("Ya existe un usuario registrado con ese correo.");
        return;
      }

      const newUser = {
        name: fullName,
        email: registerForm.email,
        password: registerForm.password,
        phone: registerForm.phone || '',
        avatar: '',
        address: {
          country: '',
          city: '',
          street: '',
          postalCode: '',
        },
        role: userType === 'provider' ? 'provider' : 'user',
      }

      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const createdUser = await validateResponse(response);
      const savedUser = { ...createdUser };
      delete savedUser.password;

      onLoginSuccess(savedUser);
      onClose();
    }
    catch (error) {
      console.error("Error registering user:", error);
      setErrorMessage("Error al registrar el usuario.");
      return;
    }
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-subsonic-surface border border-subsonic-border p-8 rounded-lg w-full max-w-xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >

        {errorMessage && (
          <div className="mb-6 rounded-md border border-red-500/60 bg-red-500/10 px-4 py-3 text-xs font-montserrat uppercase tracking-[0.2em] text-red-300">
            {errorMessage}
          </div>
        )}
        
        {}
        <div className="flex gap-10 mb-10 justify-center">
          {['login', 'register'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'login') {
                  setUserType('');
                }
              }}
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

        {}
        {activeTab === 'login' ? (
          <form className="space-y-5 max-w-sm mx-auto" onSubmit={handleSubmit} noValidate>
            <Input label="Email o teléfono" type="email" placeholder="tu@email.com" required onChange={(e) => setLoginEmail(e.target.value)}/>
            <div className="relative">
              <Input label="Contraseña" type="password" placeholder="••••••••" required onChange={(e) => setLoginPassword(e.target.value)}/>
              <button type="button" className="absolute right-3 top-9 text-subsonic-muted hover:text-subsonic-text transition-colors">Mostrar</button>
            </div>
            <Button type="submit" variant="primary" className="w-full py-4 text-base">Iniciar Sesión</Button>
          </form>
        ) : (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit} noValidate>
            <Input
                label="Nombre *"
                placeholder="Ex: John"
                required value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
            />
            <Input
                label="Apellidos *"
                placeholder="Ex: Doe"
                required
                value={registerForm.surname}
                onChange={(e) => setRegisterForm({ ...registerForm, surname: e.target.value })}
            />
            <Input
                label="Email *"
                type="email"
                placeholder="Ex: correo@ejemplo.com"
                className="md:col-span-2"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            />
            <Input
                label="Contraseña *"
                type="password"
                placeholder="••••••••"
                className="md:col-span-2"
                required
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            />
            <Input
                label="Teléfono"
                type="tel"
                placeholder="+34 ..."
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
            />
            
            <div className="space-y-1">
               <label className="block text-xs font-montserrat text-subsonic-muted uppercase tracking-widest ml-1">Tipo de usuario *</label>
               <select
                 className="w-full bg-subsonic-surface border border-subsonic-border p-3 rounded-md text-sm text-subsonic-text focus:border-subsonic-accent outline-none"
                 value={userType}
                 onChange={(e) => setUserType(e.target.value)}
                 required
               >
                 <option value="" disabled>Selecciona...</option>
                 <option value="provider">Proveedor</option>
                 <option value="user">Usuario</option>
               </select>
            </div>

            {}
            {userType === 'provider' && (
              <BaseCard className="md:col-span-2 border-2 border-dashed rounded-lg p-6 text-center text-subsonic-muted cursor-pointer bg-subsonic-navfooter/70">
                <p className="text-xs uppercase tracking-widest italic">Arrastra archivos aquí (DNI / Portfolio)</p>
              </BaseCard>
            )}
            
            <Button type="submit" variant="primary" className="md:col-span-2 py-4 text-base mt-2">Registrarse</Button>
          </form>
        )}
        
        {}
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