import { useState, useEffect } from "react"
import MainContent from "../components/MainContent"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Favourites from "../components/Favourites"
import { ToastProvider } from "../components/ToastContainer"

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Simple routing based on hash
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the #
      if (hash === 'favourites') {
        setCurrentPage('favourites');
      } else {
        setCurrentPage('home');
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <ToastProvider>
      {currentPage === 'favourites' ? (
        <Favourites />
      ) : (
        <>
          <Navbar/>
          <MainContent/>
          <Footer/>
        </>
      )}
    </ToastProvider>
  )
}

export default App
