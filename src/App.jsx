import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Home from '@/pages/Home';
import AuthModal from '@/components/ui/AuthModal';
import UserProfile from "@/pages/UserProfile.jsx";
import CheckoutPage from '@/pages/CheckoutPage';
import FestivalInstance from '@/pages/FestivalInstance';

function App() {

  const [isModalOpen, setIsModalOpen] = useState(null); // null, 'login' o 'register'

  const openLoginModal = () => setIsModalOpen('login');
  const openRegisterModal = () => setIsModalOpen('register');
  const closeModal = () => setIsModalOpen(null);

  return (
    <Router>
      <div className="min-h-screen bg-subsonic-bg flex flex-col">
        <Navbar onOpenLogin={openLoginModal} onOpenRegister={openRegisterModal} />
        
        <AuthModal 
          isOpen={isModalOpen !== null} 
          initialType={isModalOpen} 
          onClose={closeModal}
        />

        <main className="grow p-6 md:p-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user-profile" element={<UserProfile />} />            
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/festival/:id" element={<FestivalInstance />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;