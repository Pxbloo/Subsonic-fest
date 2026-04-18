import { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import API_BASE_URL from '@/config/api';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Home from '@/pages/Home';
import AuthModal from '@/components/ui/AuthModal';
import UserProfile from "@/pages/UserProfile.jsx";
import CheckoutPage from '@/pages/CheckoutPage';
import CheckoutSuccess from '@/pages/CheckoutSuccess';
import CheckoutCancel from '@/pages/CheckoutCancel';
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

function App() {

  const [isModalOpen, setIsModalOpen] = useState(null); // null, 'login' o 'register'
  const [user, setUser] = useState(null); // null o objeto de usuario

  const checkUserExists = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      return response.ok;
    }
    catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  };

  useEffect(() => {
    const validateUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        await checkUserExists(userData.id).then(exists => {
          if (exists) {
            setUser(userData);
          } else {
            localStorage.removeItem('user');
            console.log("User data found but user does not exist. Removing from local storage.");
          }
        });
      } catch (error) {
        console.error("Error parsing user data from local storage:", error);
        localStorage.removeItem('user');
      }
    };

    validateUser();
  }, []);

  const openLoginModal = () => setIsModalOpen('login');
  const openRegisterModal = () => setIsModalOpen('register');
  const closeModal = () => setIsModalOpen(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    closeModal();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
            <Route path="/user-profile" element={<UserProfile user={user} />} />
            <Route path="/festival/:id" element={<FestivalInstance />} />
            <Route path="/artist/:id" element={<ArtistProfile />} />

            {/* Rutas de CLIENTE */}
            <Route path="/tienda" element={<Merch />} />
            <Route path="/history" element={<History />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
            <Route path="/blog" element={<Blog />} />

            {/* Rutas de PROVEEDOR */}
            <Route path="/sales-dashboard" element={<SalesDashboard />} />
            <Route path="/grounds" element={<GroundsProvider user={user} />} />
            {/* --------------- Gestión de recintos de PROVEEDOR conectado a "/grounds" de ADMIN --------------- */}

            {/* Rutas de ADMINISTRADOR */}
            <Route path="/dashboard-grounds" element={<GroundsManagement />} />
            <Route path="/dashboard-festivales" element={<FestivalsManagement />} />
            <Route path="/dashboard-usuarios" element={<UsersDashboard />} />
            <Route path="/dashboard-entradas" element={<TicketsManagement />} />
            <Route path="/dashboard-artistas" element={<ArtistMan />} />
            <Route path="/dashboard-productos" element={<ProductMan />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;