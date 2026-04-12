import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import BaseCard from '@/components/ui/BaseCard.jsx';
import API_BASE_URL from '@/config/api';
import { signInWithPopup } from "firebase/auth"; 

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

  // --- LÓGICA DE GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    setErrorMessage('');
    try {
      // 1. Abrir popup de Google
      const result = await signInWithPopup(auth, googleProvider);
      // 2. Obtener el token (JWT)
      const token = await result.user.getIdToken();
      
      // 3. Verificar contra tu backend
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Usuario verificado en el backend:", userData);
        onLoginSuccess(userData);
        onClose();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || "Error al verificar con el servidor.");
      }
    } catch (error) {
      console.error("Error en el login de Google:", error);
      setErrorMessage("No se pudo completar el inicio de sesión con Google.");
    }
  };

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

        const response = await fetch(`${API_BASE_URL}/users`);
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
      const usersResponse = await fetch(`${API_BASE_URL}/users`);
      const users = await usersResponse.json();
      const existingUser = users.find(u => u.email === registerForm.email);

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

      const response = await fetch(`${API_BASE_URL}/users`, {
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

        {activeTab === 'login' ? (
          <div className="space-y-6 max-w-sm mx-auto">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <Input label="Email o teléfono" type="email" placeholder="tu@email.com" required onChange={(e) => setLoginEmail(e.target.value)} />
              <div className="relative">
                <Input label="Contraseña" type="password" placeholder="••••••••" required onChange={(e) => setLoginPassword(e.target.value)} />
              </div>
              <Button type="submit" variant="primary" className="w-full py-4 text-base">Entrar</Button>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-subsonic-border"></div>
              <span className="flex-shrink mx-4 text-[10px] text-subsonic-muted uppercase tracking-widest">O continúa con</span>
              <div className="flex-grow border-t border-subsonic-border"></div>
            </div>

            <Button 
              type="button" 
              onClick={handleGoogleLogin} 
              variant="outline" 
              className="w-full py-3 flex items-center justify-center gap-3 border-subsonic-border hover:bg-subsonic-navfooter"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
          </div>
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