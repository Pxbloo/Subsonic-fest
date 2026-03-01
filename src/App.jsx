import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/Home'; // Importamos la nueva página

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-subsonic-bg flex flex-col">
        <Navbar />

        <main className="grow p-6 md:p-16">
          <Routes>
            {/* Definimos la ruta principal */}
            <Route path="/" element={<Home />} />
            {/* Aquí irán más rutas como /perfil o /tienda más adelante */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;