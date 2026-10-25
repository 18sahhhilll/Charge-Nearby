import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Zap,
  Home,
  Clock,
  Car,
  Plus,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Phone,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Search,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHost = user?.role === 'HOST' || user?.role === 'BOTH' || user?.role === 'ADMIN';
  const isDriver = user?.role === 'DRIVER' || user?.role === 'BOTH' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/host/dashboard') return location.pathname === '/host/dashboard';
    if (path === '/host/bookings') return location.pathname === '/host/bookings';
    if (path === '/driver/bookings') return location.pathname.startsWith('/driver/bookings');
    return location.pathname === path;
  };

  const navItems = [
    // Host Items
    ...(isHost
      ? [
          {
            label: 'Host Dashboard',
            to: '/host/dashboard',
            icon: <Home className="w-4 h-4" />,
            badge: 'Host',
          },
          {
            label: 'Incoming Requests',
            to: '/host/bookings',
            icon: <Clock className="w-4 h-4" />,
            badge: null,
          },
          {
            label: 'Add Charger',
            to: '/host/chargers/new',
            icon: <Plus className="w-4 h-4" />,
            badge: null,
          },
        ]
      : []),
    // Driver Items
    ...(isDriver
      ? [
          {
            label: 'Find Chargers',
            to: '/find',
            icon: <Search className="w-4 h-4" />,
            badge: 'Live',
          },
          {
            label: 'My Bookings',
            to: '/driver/bookings',
            icon: <Clock className="w-4 h-4" />,
            badge: null,
          },
          {
            label: 'My Vehicles',
            to: '/onboarding/vehicle',
            icon: <Car className="w-4 h-4" />,
            badge: null,
          },
        ]
      : []),
    // Shared Items
    {
      label: 'Profile & Settings',
      to: '/profile',
      icon: <User className="w-4 h-4" />,
      badge: null,
    },
    {
      label: 'Safety & Help',
      to: '/help',
      icon: <HelpCircle className="w-4 h-4" />,
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      {/* ---------------------------------------------------- */}
      {/* DESKTOP SIDEBAR (Persistent, 260px)                 */}
      {/* ---------------------------------------------------- */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-r border-slate-800/80 bg-slate-950/95 sticky top-0 h-screen p-5 justify-between select-none">
        <div className="space-y-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 px-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-105">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block">
                Charge<span className="text-emerald-400">Nearby</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80 block">Pune Community Pilot</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Workspace
            </div>

            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={active ? 'text-emerald-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {isAdmin && (
              <a
                href="http://127.0.0.1:8000/admin/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-amber-300 hover:bg-amber-950/40 border border-amber-800/40 transition mt-2"
              >
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Django Admin</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>
            )}
          </nav>
        </div>

        {/* Bottom Helper & User Card */}
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          {/* Emergency Helpline Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center space-x-1">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>24/7 Roadside Assistance</span>
              </span>
              <span className="text-emerald-400 font-bold">Pune</span>
            </div>
            <a
              href="tel:18002097979"
              className="font-mono font-bold text-xs text-white hover:text-emerald-400 transition block"
            >
              1800-209-7979 (Toll-Free)
            </a>
          </div>

          {/* User Profile Bar */}
          {user && (
            <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <Link to="/profile" className="flex items-center space-x-2.5 truncate group">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/30 shrink-0">
                  {user.full_name.charAt(0)}
                </div>
                <div className="truncate text-left">
                  <span className="text-xs font-bold text-white block truncate group-hover:text-emerald-300 transition">
                    {user.full_name}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">{user.role.toLowerCase()}</span>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 text-slate-400 hover:text-rose-400 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* MAIN VIEWPORT & MOBILE HEADER                       */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-300 hover:text-white"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
              <span className="text-white font-bold capitalize">
                {user?.role ? `${user.role.toLowerCase()} Workspace` : 'ChargeNearby'}
              </span>
              <span>/</span>
              <span className="text-emerald-400 font-medium">Pune Emergency Pilot</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="emerald" size="sm" dot pulse>
              Live Pilot
            </Badge>

            {isHost && (
              <Link
                to="/host/chargers/new"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Charger</span>
              </Link>
            )}

            <Link
              to="/find"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>Find</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MOBILE DRAWER MODAL                                  */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-72 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between z-10"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                    <span className="font-extrabold text-base text-white">ChargeNearby</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-emerald-400">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
