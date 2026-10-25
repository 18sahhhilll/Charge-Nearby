import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  User,
  Phone,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/motion';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'DRIVER' | 'HOST' | 'BOTH'>('DRIVER');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Create Account | ChargeNearby - EV Emergency Charging Marketplace';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        phone_number: phone.trim() || undefined,
        role,
        password,
        password_confirm: passwordConfirm,
      });

      if (role === 'DRIVER') {
        navigate('/onboarding/vehicle');
      } else {
        navigate('/host/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check form inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleCards: {
    id: 'DRIVER' | 'HOST' | 'BOTH';
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge: string;
  }[] = [
    {
      id: 'DRIVER',
      label: 'EV Driver',
      sublabel: 'Find & request emergency charging',
      icon: <Car className="w-4 h-4 text-emerald-400" />,
      badge: 'Find Chargers',
    },
    {
      id: 'HOST',
      label: 'Charger Host',
      sublabel: 'Share wallbox & earn per session',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      badge: 'Monetize Power',
    },
    {
      id: 'BOTH',
      label: 'Driver & Host',
      sublabel: 'Drive and share private equipment',
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      badge: 'Full Access',
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Brand Storytelling & Platform Value (52%)     */}
        {/* ========================================================= */}
        <section
          aria-label="Platform Benefits"
          className="relative w-full lg:w-[50%] xl:w-[52%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-slate-950 text-white"
        >
          {/* Ambient Lighting & Technical Grid Overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 25%, rgba(16, 185, 129, 0.35), transparent 60%), radial-gradient(circle at 80% 80%, rgba(5, 150, 105, 0.2), transparent 50%)',
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

          {/* Storytelling Content */}
          <div className="relative z-10 my-8 lg:my-auto space-y-6 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Join the Pune EV Community</span>
            </div>

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Powering confident travel across{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                every corner of Pune.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Whether you need guaranteed emergency access during critical battery dips or want to turn an idle
              home wallbox into passive revenue, registration takes less than two minutes.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                  <Car className="w-4 h-4" />
                  <span>For EV Drivers</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Honest reachability algorithm with 1.35x Pune detour physics so you never get lured to a broken charger.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                  <Zap className="w-4 h-4" />
                  <span>For Charger Hosts</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Total gate privacy. Your exact bungalow number is revealed only after you manually review and accept a request.
                </p>
              </div>
            </div>

            {/* Live Stats Pill Row */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Verified Network</span>
                <span className="font-extrabold text-white text-base">48+ Hosts</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px]">Avg Host Acceptance</span>
                <span className="font-extrabold text-emerald-400 text-base">&lt; 4 mins</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px]">Pilot Status</span>
                <span className="font-extrabold text-white text-base">Active</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="relative z-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Subscription Fees</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>MCB Verified Hardware</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Pune Pilot 2026</span>
          </div>
        </section>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Streamlined Registration Experience (48%)   */}
        {/* ========================================================= */}
        <section
          aria-label="Registration Form"
          className="w-full lg:w-[50%] xl:w-[48%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-slate-900/95 lg:bg-slate-900 text-slate-100 min-h-screen overflow-y-auto"
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
              Already registered?{' '}
              <Link
                to="/login"
                className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition"
              >
                Sign in to your account →
              </Link>
            </div>
          </div>

          {/* Main Registration Form Container */}
          <div className="w-full max-w-md mx-auto my-auto py-4 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create an account
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Join the verified EV charging platform for Pune.
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Select your primary account purpose:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roleCards.map((rc) => {
                  const isSelected = role === rc.id;
                  return (
                    <button
                      key={rc.id}
                      type="button"
                      onClick={() => setRole(rc.id)}
                      className={`text-left p-3 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/60 text-white shadow-sm shadow-emerald-500/20'
                          : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {rc.icon}
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <span className="font-extrabold text-xs text-white block">{rc.label}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{rc.badge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Banner */}
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
                    <span className="font-semibold block">Registration error</span>
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Full Name */}
              <div>
                <label htmlFor="fullname" className="block font-semibold text-slate-200 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Anand Kulkarni"
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 border border-slate-700 bg-slate-950/80 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block font-semibold text-slate-200 mb-1">
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="anand@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 border border-slate-700 bg-slate-950/80 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label htmlFor="phone" className="block font-semibold text-slate-200 mb-1">
                  Mobile Number <span className="text-slate-500 font-normal">(Optional for emergency SMS)</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="absolute left-9 text-xs text-slate-400 font-mono">+91</span>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98220 00000"
                    className="w-full pl-18 pr-3.5 py-2.5 sm:py-3 border border-slate-700 bg-slate-950/80 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition font-mono"
                  />
                </div>
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block font-semibold text-slate-200 mb-1">
                    Password (8+ chars)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2.5 border border-slate-700 bg-slate-950/80 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="passwordConfirm" className="block font-semibold text-slate-200 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="passwordConfirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-9 py-2.5 border rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 transition ${
                        passwordConfirm && password !== passwordConfirm
                          ? 'border-rose-500 bg-rose-950/20 focus:ring-rose-500/30'
                          : 'border-slate-700 bg-slate-950/80 focus:ring-emerald-500/40 focus:border-emerald-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {password && passwordConfirm && password !== passwordConfirm && (
                <p className="text-[11px] text-rose-400 font-medium">Passwords do not match.</p>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:opacity-70 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 text-sm cursor-pointer mt-3"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Security Note */}
          <div className="pt-6 border-t border-slate-800/80 text-center space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mr-0.5" />
              <span>By registering, you agree to the</span>
              <Link to="/terms" className="text-emerald-400 font-bold hover:underline">
                Terms of Service
              </Link>
              <span>and</span>
              <Link to="/privacy" className="text-emerald-400 font-bold hover:underline">
                Privacy Policy
              </Link>
            </div>
            <div className="lg:hidden text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-emerald-400 hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};
