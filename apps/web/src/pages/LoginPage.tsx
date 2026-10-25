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
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Visual Storytelling & EV Infrastructure (55%) */}
        {/* ========================================================= */}
        <section
          aria-label="ChargeNearby EV Network Overview"
          className="relative w-full lg:w-[52%] xl:w-[55%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-slate-950 text-white"
        >
          {/* Ambient Lighting & Technical Grid Overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 25% 20%, rgba(16, 185, 129, 0.35), transparent 60%), radial-gradient(circle at 85% 75%, rgba(5, 150, 105, 0.2), transparent 50%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top Brand Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-105">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Charge<span className="text-emerald-400">Nearby</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 uppercase tracking-wider">
                  Pune Pilot
                </span>
              </div>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>
          </div>

          {/* Center Storytelling & EV Infrastructure Graphic */}
          <div className="relative z-10 my-8 lg:my-auto space-y-6 max-w-xl">
            {/* Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Community EV Emergency Discovery</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Your next charge is{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                closer than you think.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Join Pune's neighborhood network connecting stranded EV drivers with private home wallboxes,
              verified society visitor bays, and rapid public DC hubs.
            </p>

            {/* Bespoke EV Infrastructure Live Simulation Card */}
            <div className="rounded-3xl bg-slate-900/85 border border-slate-800/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              {/* Card Header with Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                    Live Session Simulation
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  7.4 kW Type 2
                </span>
              </div>

              {/* Connected Vehicle & Wallbox Graphic (SVG) */}
              <div className="py-5 relative">
                <div className="flex items-center justify-between px-2">
                  {/* Vehicle Node */}
                  <div className="space-y-1.5 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shadow-md">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Tata Nexon EV</span>
                      <span className="text-[11px] font-mono text-emerald-400">Battery: 18% → 80%</span>
                    </div>
                  </div>

                  {/* Animated Energy Conduit (Pulsing Energy Stream) */}
                  <div className="flex-1 px-4 relative flex flex-col items-center justify-center">
                    <div className="w-full h-1 bg-slate-800 rounded-full relative overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-400"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                        style={{ width: '50%' }}
                      />
                    </div>
                    <div className="mt-2 text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-800/80">
                      ⚡ Flow: 7.4 kW (32A)
                    </div>
                  </div>

                  {/* Wallbox Node */}
                  <div className="space-y-1.5 text-right">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shadow-md ml-auto">
                      <BatteryCharging className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Koregaon Wallbox</span>
                      <span className="text-[11px] font-mono text-slate-400">1.2 km away</span>
                    </div>
                  </div>
                </div>

                {/* Status Telemetry Pill Row */}
                <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/80 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Reachability</span>
                    <span className="font-extrabold text-emerald-400">REACHABLE</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Charging Speed</span>
                    <span className="font-extrabold text-white">+48 km/hr</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Host Pricing</span>
                    <span className="font-extrabold text-white">₹14 / kWh</span>
                  </div>
                </div>
              </div>

              {/* Floating Pune Hotspots */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] font-mono text-slate-400">
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-800/70 border border-slate-700">
                  <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Koregaon Park (Online)</span>
                </span>
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-800/70 border border-slate-700">
                  <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Baner High St (22 kW)</span>
                </span>
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-800/70 border border-slate-700">
                  <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Viman Nagar (DC Hub)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Row */}
          <div className="relative z-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>48+ Verified Hosts</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Address Gated</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>No Hidden Fees</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Pune EV Community Pilot</span>
          </div>
        </section>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Premium Authentication Experience (48%)      */}
        {/* ========================================================= */}
        <section
          aria-label="Account Login"
          className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-slate-900/95 lg:bg-slate-900 text-slate-100 min-h-screen overflow-y-auto"
        >
          {/* Top Bar on Right Side */}
          <div className="flex items-center justify-between pb-6">
            <div className="lg:hidden flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Charge<span className="text-emerald-400">Nearby</span>
              </span>
            </div>

            <div className="ml-auto text-xs text-slate-400">
              New to ChargeNearby?{' '}
              <Link
                to="/register"
                className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition"
              >
                Create an account →
              </Link>
            </div>
          </div>

          {/* Main Auth Form Container */}
          <div className="w-full max-w-md mx-auto my-auto py-6 space-y-7">
            {/* Header */}
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Sign in to continue your charging journey across Pune.
              </p>
            </div>

            {/* Redesigned Demo Role Cards (Section 4) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Quick Demo Access (Pune Pilot)</span>
                </span>
                {selectedRole && (
                  <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
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
                          ? 'border-emerald-500 bg-emerald-950/50 text-white shadow-sm shadow-emerald-500/20'
                          : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/70 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-emerald-400'
                            }`}
                          >
                            {acc.icon}
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <span className="font-extrabold text-xs text-white block">{acc.label}</span>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                          {acc.description}
                        </p>
                      </div>

                      <div className="mt-2.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>{acc.badge}</span>
                        <span className="group-hover:text-emerald-400 transition-colors">Fill ↵</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clean Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800" />
              <span className="flex-shrink mx-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                or sign in with credentials
              </span>
              <div className="flex-grow border-t border-slate-800" />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-rose-950/60 border border-rose-800/80 p-3.5 rounded-2xl flex items-start space-x-2.5 text-rose-200 text-xs shadow-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold block">Authentication issue</span>
                    <span className="text-[11px] text-rose-300 mt-0.5 block">{error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="text-rose-400 hover:text-rose-200 transition"
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
                <label htmlFor="email" className="block font-semibold text-slate-200 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                    className="w-full pl-10 pr-3.5 py-3 border border-slate-700 bg-slate-950/80 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block font-semibold text-slate-200">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                    className="w-full pl-10 pr-10 py-3 border border-slate-700 bg-slate-950/80 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:opacity-70 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 text-sm cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
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
          <div className="pt-6 border-t border-slate-800/80 text-center space-y-2">
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>256-bit encrypted authentication • Protected by ChargeNearby Trust Guard</span>
            </div>
            <div className="lg:hidden text-xs text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-emerald-400 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </section>

        {/* Forgot Password Modal Helper */}
        <AnimatePresence>
          {showForgotModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-extrabold text-sm text-white">Password Recovery</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  During the Pune Pilot, password resets are processed manually by our operations desk to protect
                  verified residential wallbox accounts.
                </p>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="text-slate-400 text-[11px]">Email Support:</div>
                  <a
                    href="mailto:support@chargenearby.in?subject=Password%20Reset%20Request"
                    className="font-bold text-emerald-400 hover:underline block"
                  >
                    support@chargenearby.in
                  </a>
                  <div className="text-slate-400 text-[11px] pt-1">Emergency Helpline:</div>
                  <span className="font-mono text-slate-200">1800-209-7979 (Toll-Free)</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
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
