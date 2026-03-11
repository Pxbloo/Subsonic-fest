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

function App() {

  const [isModalOpen, setIsModalOpen] = useState(null); // null, 'login' o 'register'
  const [user, setUser] = useState(null); // null o objeto de usuario

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(storedUser));
    }
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
            <Route path="/user-profile" element={<UserProfile user={user} />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/festival/:id" element={<FestivalInstance />} />
            <Route path="/artist/:id" element={<ArtistProfile />} />
            <Route path="/history" element={<History />} />
            <Route path="/grounds" element={<GroundsManagement />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;