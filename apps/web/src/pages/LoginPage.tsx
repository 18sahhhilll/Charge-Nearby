import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Zap,
  Car,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  RotateCw,
  MapPin,
  BatteryCharging,
  Info,
  X,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/motion';

type DemoRole = 'DRIVER' | 'HOST' | 'ADMIN';

interface DemoAccount {
  role: DemoRole;
  label: string;
  name: string;
  badge: string;
  description: string;
  email: string;
  pass: string;
  icon: React.ReactNode;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'DRIVER',
    label: 'Driver',
    name: 'Rahul Patil',
    badge: 'Nexon EV',
    description: 'Discover & request emergency chargers',
    email: 'pune.driver@chargenearby.in',
    pass: 'DriverPass123!',
    icon: <Car className="w-4 h-4 text-emerald-400" />,
  },
  {
    role: 'HOST',
    label: 'Host',
    name: 'Arjun Deshmukh',
    badge: '7.4 kW Wallbox',
    description: 'Share your private wallbox & earn income',
    email: 'koregaon.host@chargenearby.in',
    pass: 'HostPass123!',
    icon: <Zap className="w-4 h-4 text-emerald-400" />,
  },
  {
    role: 'ADMIN',
    label: 'Admin',
    name: 'ChargeNearby Ops',
    badge: 'Operations',
    description: 'Verify listings & oversee pilot network',
    email: 'admin@chargenearby.in',
    pass: 'AdminPass123!',
    icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
  },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<DemoRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  useEffect(() => {
    document.title = 'Sign In | ChargeNearby - EV Emergency Charging Marketplace';
  }, []);

  const handleSelectDemo = (account: DemoAccount) => {
    setSelectedRole(account.role);
    setEmail(account.email);
    setPassword(account.pass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both your registered email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      // If user had specific redirect, honor it; otherwise navigate based on role or to /find
      const destination = redirectParam || (email.includes('host') ? '/host/dashboard' : '/find');
      navigate(destination);
    } catch (err: any) {
      setError(
        err.message ||
          'Unable to sign in. Please check your email and password, or verify your internet connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0A1210] font-sans selection:bg-[#22E58B]/20 selection:text-[#22E58B]">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Visual Storytelling & EV Infrastructure (55%) */}
        {/* ========================================================= */}
        <section
          aria-label="ChargeNearby EV Network Overview"
          className="relative w-full lg:w-[52%] xl:w-[55%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1E2F2A] bg-[#0A1210] text-[#E8F1EE]"
        >
          {/* Ambient Lighting & Technical Grid Overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 25% 20%, rgba(34, 229, 139, 0.25), transparent 60%), radial-gradient(circle at 85% 75%, rgba(34, 229, 139, 0.12), transparent 50%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(#22E58B 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top Brand Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#22E58B] text-[#04130C] font-black flex items-center justify-center shadow-lg shadow-[#22E58B]/20 transition-transform group-hover:scale-105">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-[#E8F1EE]">
                  Charge<span className="text-[#22E58B]">Nearby</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#22E58B]/10 text-[#22E58B] border border-[#22E58B]/30 uppercase tracking-wider">
                  Pune Pilot
                </span>
              </div>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#8DA39B] hover:text-[#E8F1EE] px-3.5 py-1.5 rounded-full bg-[#111C19] hover:bg-[#16241F] border border-[#1E2F2A] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>
          </div>

          {/* Center Storytelling & EV Infrastructure Graphic */}
          <div className="relative z-10 my-8 lg:my-auto space-y-6 max-w-xl">
            {/* Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#22E58B]/10 border border-[#22E58B]/30 text-[#22E58B] text-xs font-medium backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22E58B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22E58B]" />
              </span>
              <span>Community EV Emergency Discovery</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-[#E8F1EE] tracking-tight leading-[1.15]">
              Your next charge is{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22E58B] via-emerald-300 to-[#38BDF8]">
                closer than you think.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#C5D5CF] leading-relaxed font-normal">
              Join Pune's neighborhood network connecting stranded EV drivers with private home wallboxes,
              verified society visitor bays, and rapid public DC hubs.
            </p>

            {/* Bespoke EV Infrastructure Live Simulation Card */}
            <div className="rounded-3xl bg-[#111C19] border border-[#1E2F2A] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
              {/* Card Header with Status */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1E2F2A]">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22E58B] animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#22E58B]">
                    Live Session Simulation
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#16241F] text-[#8DA39B] border border-[#1E2F2A]">
                  7.4 kW Type 2
                </span>
              </div>

              {/* Connected Vehicle & Wallbox Graphic */}
              <div className="py-5 relative">
                <div className="flex items-center justify-between px-2">
                  {/* Vehicle Node */}
                  <div className="space-y-1.5 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-[#22E58B]/10 border border-[#22E58B]/30 flex items-center justify-center text-[#22E58B] shadow-md">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#E8F1EE] block">Tata Nexon EV</span>
                      <span className="text-[11px] font-mono text-[#22E58B]">Battery: 18% → 80%</span>
                    </div>
                  </div>

                  {/* Animated Energy Conduit */}
                  <div className="flex-1 px-4 relative flex flex-col items-center justify-center">
                    <div className="w-full h-1 bg-[#1E2F2A] rounded-full relative overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#22E58B] via-emerald-300 to-[#22E58B]"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                        style={{ width: '50%' }}
                      />
                    </div>
                    <div className="mt-2 text-[10px] font-mono font-bold text-[#22E58B] bg-[#22E58B]/10 px-2.5 py-0.5 rounded-full border border-[#22E58B]/30">
                      ⚡ Flow: 7.4 kW (32A)
                    </div>
                  </div>

                  {/* Wallbox Node */}
                  <div className="space-y-1.5 text-right">
                    <div className="w-12 h-12 rounded-2xl bg-[#16241F] border border-[#1E2F2A] flex items-center justify-center text-[#22E58B] shadow-md ml-auto">
                      <BatteryCharging className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#E8F1EE] block">Koregaon Wallbox</span>
                      <span className="text-[11px] font-mono text-[#8DA39B]">1.2 km away</span>
                    </div>
                  </div>
                </div>

                {/* Status Telemetry Pill Row */}
                <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-[#1E2F2A] text-[11px]">
                  <div className="p-2.5 rounded-xl bg-[#16241F] border border-[#1E2F2A]">
                    <span className="text-[#8DA39B] block text-[10px]">Reachability</span>
                    <span className="font-extrabold text-[#22E58B]">REACHABLE</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#16241F] border border-[#1E2F2A]">
                    <span className="text-[#8DA39B] block text-[10px]">Charging Speed</span>
                    <span className="font-extrabold text-[#E8F1EE]">+48 km/hr</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#16241F] border border-[#1E2F2A]">
                    <span className="text-[#8DA39B] block text-[10px]">Host Pricing</span>
                    <span className="font-extrabold text-[#FFD60A]">₹14 / kWh</span>
                  </div>
                </div>
              </div>

              {/* Floating Pune Hotspots */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] font-mono text-[#8DA39B]">
                <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#16241F] border border-[#1E2F2A]">
                  <MapPin className="w-2.5 h-2.5 text-[#22E58B]" />
                  <span>Koregaon Park (Online)</span>
                </span>
                <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#16241F] border border-[#1E2F2A]">
                  <MapPin className="w-2.5 h-2.5 text-[#22E58B]" />
                  <span>Baner High St (22 kW)</span>
                </span>
                <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#16241F] border border-[#1E2F2A]">
                  <MapPin className="w-2.5 h-2.5 text-[#22E58B]" />
                  <span>Viman Nagar (DC Hub)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Row */}
          <div className="relative z-10 pt-6 border-t border-[#1E2F2A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#8DA39B]">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#22E58B]" />
                <span className="text-[#C5D5CF]">48+ Verified Hosts</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                <span className="text-[#C5D5CF]">Address Gated</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-[#FFD60A]" />
                <span className="text-[#C5D5CF]">No Hidden Fees</span>
              </span>
            </div>
            <span className="text-[11px] text-[#8DA39B]">Pune EV Community Pilot</span>
          </div>
        </section>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Premium Authentication Experience (48%)      */}
        {/* ========================================================= */}
        <section
          aria-label="Account Login"
          className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[#0A1210] text-[#E8F1EE] min-h-screen overflow-y-auto"
        >
          {/* Top Bar on Right Side */}
          <div className="flex items-center justify-between pb-6">
            <div className="lg:hidden flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#22E58B] text-[#04130C] font-black flex items-center justify-center">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-extrabold text-lg text-[#E8F1EE]">
                Charge<span className="text-[#22E58B]">Nearby</span>
              </span>
            </div>

            <div className="ml-auto text-xs text-[#8DA39B]">
              New to ChargeNearby?{' '}
              <Link
                to="/register"
                className="font-bold text-[#22E58B] hover:text-[#1BC878] hover:underline transition"
              >
                Create an account →
              </Link>
            </div>
          </div>

          {/* Main Auth Form Container */}
          <div className="w-full max-w-md mx-auto my-auto py-6 space-y-7">
            {/* Header */}
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E8F1EE] tracking-tight">
                Welcome back.
              </h2>
              <p className="text-xs sm:text-sm text-[#8DA39B]">
                Sign in to continue your charging journey across Pune.
              </p>
            </div>

            {/* Redesigned Demo Role Cards (Section 4) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8DA39B] flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#22E58B]" />
                  <span>Quick Demo Access (Pune Pilot)</span>
                </span>
                {selectedRole && (
                  <span className="text-[10px] font-mono font-semibold text-[#22E58B] bg-[#22E58B]/10 border border-[#22E58B]/30 px-2 py-0.5 rounded-full">
                    Selected: {selectedRole}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isSelected = selectedRole === acc.role;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleSelectDemo(acc)}
                      className={`text-left p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'border-[#22E58B] bg-[#22E58B]/10 text-[#E8F1EE] shadow-sm shadow-[#22E58B]/10'
                          : 'border-[#1E2F2A] bg-[#111C19] hover:bg-[#16241F] hover:border-[#22E58B]/40 text-[#C5D5CF]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-[#22E58B] text-[#04130C] font-bold' : 'bg-[#16241F] text-[#22E58B]'
                            }`}
                          >
                            {acc.icon}
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#22E58B]" />}
                        </div>
                        <span className="font-extrabold text-xs text-[#E8F1EE] block">{acc.label}</span>
                        <p className="text-[10px] text-[#8DA39B] line-clamp-2 mt-0.5 leading-tight">
                          {acc.description}
                        </p>
                      </div>

                      <div className="mt-2.5 pt-1.5 border-t border-[#1E2F2A] flex items-center justify-between text-[9px] font-mono text-[#8DA39B]">
                        <span>{acc.badge}</span>
                        <span className="group-hover:text-[#22E58B] transition-colors">Fill ↵</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clean Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#1E2F2A]" />
              <span className="flex-shrink mx-3 text-[11px] font-medium text-[#8DA39B] uppercase tracking-wider">
                or sign in with credentials
              </span>
              <div className="flex-grow border-t border-[#1E2F2A]" />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-[#FF5A5F]/15 border border-[#FF5A5F]/40 p-3.5 rounded-2xl flex items-start space-x-2.5 text-[#FF5A5F] text-xs shadow-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#FF5A5F] mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold block text-[#E8F1EE]">Authentication issue</span>
                    <span className="text-[11px] text-[#FF5A5F] mt-0.5 block">{error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="text-[#FF5A5F] hover:text-[#E8F1EE] transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block font-semibold text-[#C5D5CF] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8DA39B]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSelectedRole(null);
                    }}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-3.5 py-3 border border-[#1E2F2A] bg-[#16241F] rounded-xl text-[#E8F1EE] text-sm placeholder:text-[#8DA39B] focus:outline-none focus:ring-1 focus:ring-[#22E58B] focus:border-[#22E58B] transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block font-semibold text-[#C5D5CF]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-semibold text-[#22E58B] hover:text-[#1BC878] hover:underline transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8DA39B]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setSelectedRole(null);
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-[#1E2F2A] bg-[#16241F] rounded-xl text-[#E8F1EE] text-sm placeholder:text-[#8DA39B] focus:outline-none focus:ring-1 focus:ring-[#22E58B] focus:border-[#22E58B] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8DA39B] hover:text-[#E8F1EE] transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#22E58B] hover:bg-[#1BC878] disabled:bg-[#16241F] disabled:text-[#8DA39B] text-[#04130C] font-extrabold rounded-xl shadow-lg shadow-[#22E58B]/20 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 text-sm cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-[#04130C]" />
                    <span>Authenticating session...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to ChargeNearby</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Security Note */}
          <div className="pt-6 border-t border-[#1E2F2A] text-center space-y-2">
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#8DA39B]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22E58B] shrink-0" />
              <span>
                Encrypted authentication •{' '}
                <Link to="/privacy" className="text-[#C5D5CF] hover:text-[#22E58B] underline">
                  Privacy Policy
                </Link>{' '}
                •{' '}
                <Link to="/terms" className="text-[#C5D5CF] hover:text-[#22E58B] underline">
                  Terms of Service
                </Link>
              </span>
            </div>
            <div className="lg:hidden text-xs text-[#8DA39B]">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-[#22E58B] hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </section>

        {/* Forgot Password Modal Helper */}
        <AnimatePresence>
          {showForgotModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm rounded-3xl bg-[#111C19] border border-[#1E2F2A] p-6 text-[#E8F1EE] shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#1E2F2A] pb-3">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-[#22E58B]" />
                    <h3 className="font-extrabold text-sm text-[#E8F1EE]">Password Recovery</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="text-[#8DA39B] hover:text-[#E8F1EE]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#C5D5CF] leading-relaxed">
                  During the Pune Pilot, password resets are processed manually by our operations desk to protect
                  verified residential wallbox accounts.
                </p>

                <div className="p-3 bg-[#16241F] rounded-xl border border-[#1E2F2A] text-xs space-y-1">
                  <div className="text-[#8DA39B] text-[11px]">Email Support:</div>
                  <a
                    href="mailto:support@chargenearby.in?subject=Password%20Reset%20Request"
                    className="font-bold text-[#22E58B] hover:underline block"
                  >
                    support@chargenearby.in
                  </a>
                  <div className="text-[#8DA39B] text-[11px] pt-1">Emergency Helpline:</div>
                  <span className="font-mono text-[#E8F1EE]">1800-209-7979 (Toll-Free)</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2.5 rounded-xl bg-[#1E2F2A] hover:bg-[#22E58B]/20 hover:text-[#22E58B] text-[#E8F1EE] font-bold text-xs transition"
                >
                  Got it
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};
