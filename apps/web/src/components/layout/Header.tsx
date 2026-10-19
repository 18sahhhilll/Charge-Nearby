import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, ShieldCheck, User, LogOut, Menu, X, Car, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500 rounded-lg text-slate-950 font-bold flex items-center justify-center">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Charge<span className="text-emerald-400">Nearby</span>
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Pune Pilot
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/find"
              className={`flex items-center space-x-1.5 transition-colors ${
                isActive('/find') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Find Chargers</span>
            </Link>

            {isAuthenticated && (user?.role === 'HOST' || user?.role === 'BOTH' || user?.role === 'ADMIN') && (
              <>
                <Link
                  to="/host/dashboard"
                  className={`flex items-center space-x-1 transition-colors ${
                    isActive('/host/dashboard') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Host Dashboard</span>
                </Link>
                <Link
                  to="/host/bookings"
                  className={`transition-colors ${
                    isActive('/host/bookings') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>Host Requests</span>
                </Link>
              </>
            )}

            {isAuthenticated && (
              <Link
                to="/driver/bookings"
                className={`flex items-center space-x-1 transition-colors ${
                  isActive('/driver/bookings') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>My Bookings</span>
              </Link>
            )}

            <Link
              to="/help"
              className={`transition-colors ${
                isActive('/help') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Help & Safety
            </Link>
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
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
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition px-3 py-1.5"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-lg shadow-sm transition"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
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
                className="block text-center text-sm font-medium text-slate-200 border border-slate-700 py-2 rounded-lg"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-sm font-semibold bg-emerald-500 text-slate-950 py-2 rounded-lg"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
