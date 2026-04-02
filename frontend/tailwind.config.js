/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'subsonic-bg': '#0B0E14',       // Fondo Principal
        'subsonic-surface': '#1E242C',  // Header y Tarjetas
        'subsonic-navfooter': '#161B22', // Navbar y Footer
        'subsonic-border': '#30363D',   // Borde de modales
        'subsonic-accent': '#00F5FF',   // Títulos (H1) y Acento
        'subsonic-text': '#F0F6FC',     // Texto Principal
        'subsonic-muted': '#8B949E',    // Texto Secundario
        'subsonic-btn': '#0E969C',      // Botones y Enlaces
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'], //titulos
        inter: ['Inter', 'sans-serif'],          //texto normal
      },
    },
  },
  plugins: [],
}