import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navbarClasses = `fixed w-full z-50 transition-all duration-300 ${
    scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-blue-400 font-bold text-xl">ANIME</span>
              <span className="text-white font-bold text-xl">FINDER</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-gray-300 hover:text-blue-400 transition px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className={`text-gray-300 hover:text-blue-400 transition px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/browse' ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Browse
            </Link>
            <Link 
              to="/library" 
              className={`text-gray-300 hover:text-blue-400 transition px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/library' ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              My Library
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/95 backdrop-blur-md">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            to="/browse"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/browse' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Browse
          </Link>
          <Link
            to="/library"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/library' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            My Library
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 