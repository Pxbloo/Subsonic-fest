import { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
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

function App() {

  const [isModalOpen, setIsModalOpen] = useState(null); // null, 'login' o 'register'
  const [user, setUser] = useState(null); // null o objeto de usuario

  const checkUserExists = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`);
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
            <Route path="/" element={<Home />} />
            <Route path="/tienda" element={<Merch />} />
            <Route path="/history" element={<History />} />
            <Route path="/user-profile" element={<UserProfile user={user} />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/festival/:id" element={<FestivalInstance />} />
            <Route path="/artist/:id" element={<ArtistProfile />} />
            <Route path="/history" element={<History />} />
            <Route path="/grounds" element={<GroundsManagement />} />
            <Route path="/sales-dashboard" element={<SalesDashboard />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;