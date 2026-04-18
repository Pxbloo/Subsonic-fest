import { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import API_BASE_URL from '@/config/api';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Home from '@/pages/Home';
import AuthModal from '@/components/ui/AuthModal';
import UserProfile from "@/pages/UserProfile.jsx";
import CheckoutPage from '@/pages/CheckoutPage';
import FestivalInstance from '@/pages/FestivalInstance';
import ArtistProfile from '@/pages/ArtistProfile';
import History from '@/pages/History';
import GroundsManagement from '@/pages/GroundsManagement.jsx';
import Merch from '@/pages/Merch';
import SalesDashboard from '@/pages/SalesDashboard.jsx';
import FestivalsManagement from '@/pages/FestivalsManagement';
import Blog from '@/pages/Blog.jsx';
import UsersDashboard from "@/pages/UsersDashboard.jsx";
import ContactUs from "@/pages/ContactUs.jsx";
import TicketsManagement from "@/pages/TicketsManagement.jsx";
import GroundsProvider from "@/pages/GroundsProvider.jsx";
import ArtistMan from "@/pages/ArtistManagement.jsx";
import ProductMan from "@/pages/ProductsManagement.jsx";

import { setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { auth } from './config/firebase';
import ProtectedRoute from "@/components/layout/ProtectedRoute.jsx";

await setPersistence(auth, browserLocalPersistence);

function App() {

  const [isModalOpen, setIsModalOpen] = useState(null); // null, 'login' o 'register'
  const [user, setUser] = useState(null); // null o objeto de usuario
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const token = await user.getIdToken();

          const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            console.log("User data received from backend server:", userData);
            setUser(userData);
          }
          else {
            setUser(null);
          }
        }
        else {
          setUser(null);
        }
        setAuthReady(true);
      }
      catch (error) {
        console.error("Error checking authentication status:", error);
        setUser(null);
        setAuthReady(true);
      }

    });

    return () => unsubscribe();
  }, []);

  const openLoginModal = () => setIsModalOpen('login');
  const openRegisterModal = () => setIsModalOpen('register');
  const closeModal = () => setIsModalOpen(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    closeModal();
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("User signed out successfully");
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-subsonic-bg flex flex-col">
        <Navbar
            user={user}
            onOpenLogin={openLoginModal}
            onOpenRegister={openRegisterModal}
            onLogout={handleLogout}
        />
        
        <AuthModal 
          isOpen={isModalOpen !== null} 
          initialType={isModalOpen} 
          onClose={closeModal}
          onLoginSuccess={handleLoginSuccess}
        />

        <main className="grow p-6 md:p-16">
          <Routes>
            {/* Rutas COMUNES */}
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/user-profile" element={<ProtectedRoute user={user} authReady={authReady} allowedRoles={['admin', 'provider', 'user']}><UserProfile user={user} /> </ProtectedRoute>} />
            <Route path="/festival/:id" element={<FestivalInstance />} />
            <Route path="/artist/:id" element={<ArtistProfile />} />

            {/* Rutas de CLIENTE */}
            <Route path="/tienda" element={<Merch />} />
            <Route path="/history" element={<ProtectedRoute user={user} authReady={authReady} allowedRoles={['admin', 'provider', 'user']}> <History /> </ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute user={user} authReady={authReady}  allowedRoles={['admin', 'provider', 'user']}> <CheckoutPage /> </ProtectedRoute>} />
            <Route path="/blog" element={<Blog />} />

            {/* Rutas de PROVEEDOR */}
            <Route path="/sales-dashboard" element={<ProtectedRoute user={user} authReady={authReady} allowedRoles={['admin', 'provider']}> <SalesDashboard /> </ProtectedRoute>} />
            <Route path="/grounds" element={<ProtectedRoute user={user} authReady={authReady} allowedRoles={['admin', 'provider']}> <GroundsProvider user={user} /> </ProtectedRoute>} />
            {/* --------------- Gestión de recintos de PROVEEDOR conectado a "/grounds" de ADMIN --------------- */}

            {/* Rutas de ADMINISTRADOR */}
            <Route path="/dashboard-grounds" element={<ProtectedRoute user={user} authReady={authReady} allowedRoles={['admin']}> <GroundsManagement /> </ProtectedRoute>} />
            <Route path="/dashboard-festivales" element={<ProtectedRoute user={user} authReady={authReady} allowedRoles={['admin']}> <FestivalsManagement /> </ProtectedRoute>} />
            <Route path="/dashboard-usuarios" element={<ProtectedRoute user={user} authReady={authReady} allowedRoles={['admin']}> <UsersDashboard /> </ProtectedRoute>} />
            <Route path="/dashboard-entradas" element={<ProtectedRoute user={user} authReady={authReady} allowedRoles={['admin']}> <TicketsManagement /> </ProtectedRoute>} />
            <Route path="/dashboard-artistas" element={<ProtectedRoute user={user} authReady={authReady} allowedRoles={['admin']}> <ArtistMan /> </ProtectedRoute>} />
            <Route path="/dashboard-productos" element={<ProtectedRoute user={user} authReady={authReady} allowedRoles={['admin']}> <ProductMan /> </ProtectedRoute>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;