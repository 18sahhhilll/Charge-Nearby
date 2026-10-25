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
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg'
          : 'bg-slate-900 border-b border-slate-800 text-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-emerald-500 rounded-xl text-slate-950 font-bold flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Charge<span className="text-emerald-400">Nearby</span>
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
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
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer py-1"
                >
                  How it works
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('for-hosts')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer py-1"
                >
                  For hosts
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('safety')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer py-1"
                >
                  Safety
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('faq')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer py-1"
                >
                  FAQ
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/find"
                  className={`relative py-1 flex items-center space-x-1.5 transition-colors ${
                    isActive('/find') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Find Chargers</span>
                  {isActive('/find') && (
                    <motion.div
                      layoutId="navbar-active-underline"
                      className="absolute -bottom-1 inset-x-0 h-0.5 bg-emerald-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                </Link>

                {isAuthenticated && (user?.role === 'HOST' || user?.role === 'BOTH' || user?.role === 'ADMIN') && (
                  <>
                    <Link
                      to="/host/dashboard"
                      className={`relative py-1 flex items-center space-x-1 transition-colors ${
                        isActive('/host/dashboard') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Home className="w-4 h-4" />
                      <span>Host Dashboard</span>
                      {isActive('/host/dashboard') && (
                        <motion.div
                          layoutId="navbar-active-underline"
                          className="absolute -bottom-1 inset-x-0 h-0.5 bg-emerald-400 rounded-full"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                    </Link>
                    <Link
                      to="/host/bookings"
                      className={`relative py-1 transition-colors ${
                        isActive('/host/bookings') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>Host Requests</span>
                      {isActive('/host/bookings') && (
                        <motion.div
                          layoutId="navbar-active-underline"
                          className="absolute -bottom-1 inset-x-0 h-0.5 bg-emerald-400 rounded-full"
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
                      isActive('/driver/bookings') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span>My Bookings</span>
                    {isActive('/driver/bookings') && (
                      <motion.div
                        layoutId="navbar-active-underline"
                        className="absolute -bottom-1 inset-x-0 h-0.5 bg-emerald-400 rounded-full"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                  </Link>
                )}

                <Link
                  to="/help"
                  className={`relative py-1 transition-colors ${
                    isActive('/help') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>Help & Safety</span>
                  {isActive('/help') && (
                    <motion.div
                      layoutId="navbar-active-underline"
                      className="absolute -bottom-1 inset-x-0 h-0.5 bg-emerald-400 rounded-full"
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
                  className="flex items-center space-x-2 text-sm text-slate-200 hover:text-emerald-400 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
                    {user.full_name.charAt(0)}
                  </div>
                  <span className="font-medium max-w-[120px] truncate">{user.full_name}</span>
                </Link>

                {user.role === 'ADMIN' && (
                  <a
                    href="http://127.0.0.1:8000/admin/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-600/40 rounded flex items-center space-x-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </a>
                )}

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-white transition px-3.5 py-2 rounded-xl hover:bg-slate-800/60"
                >
                  Log in
                </Link>
                <Link
                  to="/find"
                  className="text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl shadow-md transition flex items-center space-x-1.5"
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
              className="text-slate-300 hover:text-white p-2"
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
            className="overflow-hidden md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3"
          >
            {isHomePage && !isAuthenticated ? (
              <div className="space-y-2 pb-2">
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="block w-full text-left text-base text-slate-200 hover:text-emerald-400 py-1"
                >
                  How it works
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('for-hosts')}
                  className="block w-full text-left text-base text-slate-200 hover:text-emerald-400 py-1"
                >
                  For hosts
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('safety')}
                  className="block w-full text-left text-base text-slate-200 hover:text-emerald-400 py-1"
                >
                  Safety
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('faq')}
                  className="block w-full text-left text-base text-slate-200 hover:text-emerald-400 py-1"
                >
                  FAQ
                </button>
              </div>
            ) : null}

            <Link
              to="/find"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-emerald-400 py-1"
            >
              Find Chargers
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/driver/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base text-slate-300 hover:text-white py-1"
                >
                  My Bookings
                </Link>
                {(user?.role === 'HOST' || user?.role === 'BOTH' || user?.role === 'ADMIN') && (
                  <>
                    <Link
                      to="/host/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-base text-slate-300 hover:text-white py-1"
                    >
                      Host Dashboard
                    </Link>
                    <Link
                      to="/host/bookings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-base text-slate-300 hover:text-white py-1"
                    >
                      Incoming Requests
                    </Link>
                  </>
                )}
                <Link
                  to="/help"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base text-slate-300 hover:text-white py-1"
                >
                  Help & Safety
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base text-slate-300 hover:text-white py-1"
                >
                  Profile & Vehicles
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block text-base text-rose-400 py-1"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center text-sm font-medium text-slate-200 border border-slate-700 py-2 rounded-xl"
                >
                  Log in
                </Link>
                <Link
                  to="/find"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center text-sm font-bold bg-emerald-500 text-slate-950 py-2 rounded-xl"
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
