import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, ShieldCheck, User, LogOut, Menu, X, Car, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === '/';

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (!isHomePage) {
      navigate(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#0A1210]/90 backdrop-blur-md border-b border-[#1E2F2A] shadow-lg shadow-black/40'
          : 'bg-[#0A1210]/85 backdrop-blur-md border-b border-[#1E2F2A] text-[#E8F1EE]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="p-2 bg-[#22E58B] rounded-xl text-[#04130C] font-bold flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#E8F1EE]">
                Charge<span className="text-[#22E58B]">Nearby</span>
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#22E58B]/10 text-[#22E58B] border border-[#22E58B]/30">
                Pune Pilot
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {isHomePage && !isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-[#C5D5CF] hover:text-[#E8F1EE] transition-colors cursor-pointer py-1"
                >
                  How it works
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('for-hosts')}
                  className="text-[#C5D5CF] hover:text-[#E8F1EE] transition-colors cursor-pointer py-1"
                >
                  For hosts
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('safety')}
                  className="text-[#C5D5CF] hover:text-[#E8F1EE] transition-colors cursor-pointer py-1"
                >
                  Safety
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('faq')}
                  className="text-[#C5D5CF] hover:text-[#E8F1EE] transition-colors cursor-pointer py-1"
                >
                  FAQ
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/find"
                  className={`relative py-1 flex items-center space-x-1.5 transition-colors ${
                    isActive('/find') ? 'text-[#22E58B] font-semibold' : 'text-[#C5D5CF] hover:text-[#E8F1EE]'
                  }`}
                >
                  <Zap className="w-4 h-4 text-[#22E58B]" />
                  <span>Find Chargers</span>
                  {isActive('/find') && (
                    <motion.div
                      layoutId="navbar-active-underline"
                      className="absolute -bottom-1 inset-x-0 h-0.5 bg-[#22E58B] rounded-full"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                </Link>

                {isAuthenticated && (user?.role === 'HOST' || user?.role === 'BOTH' || user?.role === 'ADMIN') && (
                  <>
                    <Link
                      to="/host/dashboard"
                      className={`relative py-1 flex items-center space-x-1 transition-colors ${
                        isActive('/host/dashboard') ? 'text-[#22E58B] font-semibold' : 'text-[#C5D5CF] hover:text-[#E8F1EE]'
                      }`}
                    >
                      <Home className="w-4 h-4" />
                      <span>Host Dashboard</span>
                      {isActive('/host/dashboard') && (
                        <motion.div
                          layoutId="navbar-active-underline"
                          className="absolute -bottom-1 inset-x-0 h-0.5 bg-[#22E58B] rounded-full"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                    </Link>
                    <Link
                      to="/host/bookings"
                      className={`relative py-1 transition-colors ${
                        isActive('/host/bookings') ? 'text-[#22E58B] font-semibold' : 'text-[#C5D5CF] hover:text-[#E8F1EE]'
                      }`}
                    >
                      <span>Host Requests</span>
                      {isActive('/host/bookings') && (
                        <motion.div
                          layoutId="navbar-active-underline"
                          className="absolute -bottom-1 inset-x-0 h-0.5 bg-[#22E58B] rounded-full"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                    </Link>
                  </>
                )}

                {isAuthenticated && (
                  <Link
                    to="/driver/bookings"
                    className={`relative py-1 flex items-center space-x-1 transition-colors ${
                      isActive('/driver/bookings') ? 'text-[#22E58B] font-semibold' : 'text-[#C5D5CF] hover:text-[#E8F1EE]'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span>My Bookings</span>
                    {isActive('/driver/bookings') && (
                      <motion.div
                        layoutId="navbar-active-underline"
                        className="absolute -bottom-1 inset-x-0 h-0.5 bg-[#22E58B] rounded-full"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                  </Link>
                )}

                <Link
                  to="/help"
                  className={`relative py-1 transition-colors ${
                    isActive('/help') ? 'text-[#22E58B] font-semibold' : 'text-[#C5D5CF] hover:text-[#E8F1EE]'
                  }`}
                >
                  <span>Help & Safety</span>
                  {isActive('/help') && (
                    <motion.div
                      layoutId="navbar-active-underline"
                      className="absolute -bottom-1 inset-x-0 h-0.5 bg-[#22E58B] rounded-full"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                </Link>
              </>
            )}
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-sm text-[#E8F1EE] hover:text-[#22E58B] transition"
                >
                  <div className="w-8 h-8 rounded-full bg-[#16241F] border border-[#1E2F2A] flex items-center justify-center text-xs font-bold text-[#22E58B]">
                    {user.full_name.charAt(0)}
                  </div>
                  <span className="font-medium max-w-[120px] truncate">{user.full_name}</span>
                </Link>

                {user.role === 'ADMIN' && (
                  <a
                    href="http://127.0.0.1:8000/admin/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-2.5 py-1 bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 rounded flex items-center space-x-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </a>
                )}

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-[#8DA39B] hover:text-[#FF5A5F] transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#C5D5CF] hover:text-[#E8F1EE] transition px-3.5 py-2 rounded-xl hover:bg-[#16241F]"
                >
                  Log in
                </Link>
                <Link
                  to="/find"
                  className="text-sm font-bold bg-[#22E58B] hover:bg-[#1BC878] text-[#04130C] px-4 py-2 rounded-xl shadow-md transition flex items-center space-x-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Find a charger</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#C5D5CF] hover:text-[#E8F1EE] p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden md:hidden bg-[#0A1210] border-b border-[#1E2F2A] px-4 pt-3 pb-6 space-y-3"
          >
            {isHomePage && !isAuthenticated ? (
              <div className="space-y-2 pb-2">
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="block w-full text-left text-base text-[#C5D5CF] hover:text-[#22E58B] py-1"
                >
                  How it works
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('for-hosts')}
                  className="block w-full text-left text-base text-[#C5D5CF] hover:text-[#22E58B] py-1"
                >
                  For hosts
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('safety')}
                  className="block w-full text-left text-base text-[#C5D5CF] hover:text-[#22E58B] py-1"
                >
                  Safety
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('faq')}
                  className="block w-full text-left text-base text-[#C5D5CF] hover:text-[#22E58B] py-1"
                >
                  FAQ
                </button>
              </div>
            ) : null}

            <Link
              to="/find"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-[#22E58B] py-1"
            >
              Find Chargers
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/driver/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base text-[#C5D5CF] hover:text-[#E8F1EE] py-1"
                >
                  My Bookings
                </Link>
                {(user?.role === 'HOST' || user?.role === 'BOTH' || user?.role === 'ADMIN') && (
                  <>
                    <Link
                      to="/host/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-base text-[#C5D5CF] hover:text-[#E8F1EE] py-1"
                    >
                      Host Dashboard
                    </Link>
                    <Link
                      to="/host/bookings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-base text-[#C5D5CF] hover:text-[#E8F1EE] py-1"
                    >
                      Incoming Requests
                    </Link>
                  </>
                )}
                <Link
                  to="/help"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base text-[#C5D5CF] hover:text-[#E8F1EE] py-1"
                >
                  Help & Safety
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base text-[#C5D5CF] hover:text-[#E8F1EE] py-1"
                >
                  Profile & Vehicles
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block text-base text-[#FF5A5F] py-1"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <div className="pt-3 border-t border-[#1E2F2A] flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center text-sm font-medium text-[#C5D5CF] hover:text-[#E8F1EE] border border-[#1E2F2A] py-2 rounded-xl bg-[#111C19]"
                >
                  Log in
                </Link>
                <Link
                  to="/find"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center text-sm font-bold bg-[#22E58B] hover:bg-[#1BC878] text-[#04130C] py-2 rounded-xl"
                >
                  Find a charger
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
