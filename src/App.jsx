import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-subsonic-bg flex flex-col">
        <Navbar />

        <main className="grow p-6 md:p-16">
          <Routes>

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;