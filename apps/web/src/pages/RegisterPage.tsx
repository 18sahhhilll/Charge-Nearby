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
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0A1210] font-sans selection:bg-[#22E58B]/20 selection:text-[#22E58B]">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Brand Storytelling & Platform Value (52%)     */}
        {/* ========================================================= */}
        <section
          aria-label="Platform Benefits"
          className="relative w-full lg:w-[50%] xl:w-[52%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1E2F2A] bg-[#0A1210] text-[#E8F1EE]"
        >
          {/* Ambient Lighting & Technical Grid Overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 25%, rgba(34, 229, 139, 0.25), transparent 60%), radial-gradient(circle at 80% 80%, rgba(34, 229, 139, 0.12), transparent 50%)',
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

          {/* Storytelling Content */}
          <div className="relative z-10 my-8 lg:my-auto space-y-6 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#22E58B]/10 border border-[#22E58B]/30 text-[#22E58B] text-xs font-medium backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#22E58B]" />
              <span>Join the Pune EV Community</span>
            </div>

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-[#E8F1EE] tracking-tight leading-[1.15]">
              Powering confident travel across{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22E58B] via-emerald-300 to-[#38BDF8]">
                every corner of Pune.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#C5D5CF] leading-relaxed font-normal">
              Whether you need guaranteed emergency access during critical battery dips or want to turn an idle
              home wallbox into passive revenue, registration takes less than two minutes.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-[#111C19] border border-[#1E2F2A] space-y-1.5">
                <div className="flex items-center space-x-2 text-[#22E58B] text-xs font-bold">
                  <Car className="w-4 h-4" />
                  <span>For EV Drivers</span>
                </div>
                <p className="text-xs text-[#8DA39B] leading-relaxed">
                  Honest reachability algorithm with 1.35x Pune detour physics so you never get lured to a broken charger.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#111C19] border border-[#1E2F2A] space-y-1.5">
                <div className="flex items-center space-x-2 text-[#22E58B] text-xs font-bold">
                  <Zap className="w-4 h-4" />
                  <span>For Charger Hosts</span>
                </div>
                <p className="text-xs text-[#8DA39B] leading-relaxed">
                  Total gate privacy. Your exact bungalow number is revealed only after you manually review and accept a request.
                </p>
              </div>
            </div>

            {/* Live Stats Pill Row */}
            <div className="p-4 rounded-2xl bg-[#111C19] border border-[#1E2F2A] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#8DA39B] block text-[10px]">Verified Network</span>
                <span className="font-extrabold text-[#E8F1EE] text-base">48+ Hosts</span>
              </div>
              <div className="h-8 w-px bg-[#1E2F2A]" />
              <div>
                <span className="text-[#8DA39B] block text-[10px]">Avg Host Acceptance</span>
                <span className="font-extrabold text-[#22E58B] text-base">&lt; 4 mins</span>
              </div>
              <div className="h-8 w-px bg-[#1E2F2A]" />
              <div>
                <span className="text-[#8DA39B] block text-[10px]">Pilot Status</span>
                <span className="font-extrabold text-[#FFD60A] text-base">Active</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="relative z-10 pt-6 border-t border-[#1E2F2A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#8DA39B]">
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22E58B]" />
                <span className="text-[#C5D5CF]">Zero Subscription Fees</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="text-[#C5D5CF]">MCB Verified Hardware</span>
              </span>
            </div>
            <span className="text-[11px] text-[#8DA39B] font-mono">Pune Pilot 2026</span>
          </div>
        </section>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Streamlined Registration Experience (48%)   */}
        {/* ========================================================= */}
        <section
          aria-label="Registration Form"
          className="w-full lg:w-[50%] xl:w-[48%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[#0A1210] text-[#E8F1EE] min-h-screen overflow-y-auto"
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
              Already registered?{' '}
              <Link
                to="/login"
                className="font-bold text-[#22E58B] hover:text-[#1BC878] hover:underline transition"
              >
                Sign in to your account →
              </Link>
            </div>
          </div>

          {/* Main Registration Form Container */}
          <div className="w-full max-w-md mx-auto my-auto py-4 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E8F1EE] tracking-tight">
                Create an account
              </h2>
              <p className="text-xs sm:text-sm text-[#8DA39B]">
                Join the verified EV charging platform for Pune.
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#C5D5CF]">
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
                          ? 'border-[#22E58B] bg-[#22E58B]/10 text-[#E8F1EE] shadow-sm shadow-[#22E58B]/10'
                          : 'border-[#1E2F2A] bg-[#111C19] hover:bg-[#16241F] hover:border-[#22E58B]/40 text-[#8DA39B]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-[#22E58B] text-[#04130C] font-bold' : 'bg-[#16241F] text-[#22E58B]'
                          }`}
                        >
                          {rc.icon}
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#22E58B]" />}
                      </div>
                      <span className="font-extrabold text-xs text-[#E8F1EE] block">{rc.label}</span>
                      <span className="text-[10px] text-[#8DA39B] block mt-0.5">{rc.badge}</span>
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
                  className="bg-[#FF5A5F]/15 border border-[#FF5A5F]/40 p-3.5 rounded-2xl flex items-start space-x-2.5 text-[#FF5A5F] text-xs shadow-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#FF5A5F] mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold block text-[#E8F1EE]">Registration error</span>
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Full Name */}
              <div>
                <label htmlFor="fullname" className="block font-semibold text-[#C5D5CF] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8DA39B]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Anand Kulkarni"
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 border border-[#1E2F2A] bg-[#16241F] rounded-xl text-[#E8F1EE] text-sm placeholder:text-[#8DA39B] focus:outline-none focus:ring-1 focus:ring-[#22E58B] focus:border-[#22E58B] transition"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block font-semibold text-[#C5D5CF] mb-1">
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="anand@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 border border-[#1E2F2A] bg-[#16241F] rounded-xl text-[#E8F1EE] text-sm placeholder:text-[#8DA39B] focus:outline-none focus:ring-1 focus:ring-[#22E58B] focus:border-[#22E58B] transition"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label htmlFor="phone" className="block font-semibold text-[#C5D5CF] mb-1">
                  Mobile Number <span className="text-[#8DA39B] font-normal">(Optional for emergency SMS)</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8DA39B]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="absolute left-9 text-xs text-[#8DA39B] font-mono">+91</span>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98220 00000"
                    className="w-full pl-18 pr-3.5 py-2.5 sm:py-3 border border-[#1E2F2A] bg-[#16241F] rounded-xl text-[#E8F1EE] text-sm placeholder:text-[#8DA39B] focus:outline-none focus:ring-1 focus:ring-[#22E58B] focus:border-[#22E58B] transition font-mono"
                  />
                </div>
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block font-semibold text-[#C5D5CF] mb-1">
                    Password (8+ chars)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8DA39B]">
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
                      className="w-full pl-9 pr-9 py-2.5 border border-[#1E2F2A] bg-[#16241F] rounded-xl text-[#E8F1EE] text-sm placeholder:text-[#8DA39B] focus:outline-none focus:ring-1 focus:ring-[#22E58B] focus:border-[#22E58B] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8DA39B] hover:text-[#E8F1EE] transition"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="passwordConfirm" className="block font-semibold text-[#C5D5CF] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8DA39B]">
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
                      className={`w-full pl-9 pr-9 py-2.5 border rounded-xl text-[#E8F1EE] text-sm placeholder:text-[#8DA39B] focus:outline-none focus:ring-1 transition ${
                        passwordConfirm && password !== passwordConfirm
                          ? 'border-[#FF5A5F] bg-[#FF5A5F]/10 focus:ring-[#FF5A5F]/30'
                          : 'border-[#1E2F2A] bg-[#16241F] focus:ring-[#22E58B] focus:border-[#22E58B]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8DA39B] hover:text-[#E8F1EE] transition"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {password && passwordConfirm && password !== passwordConfirm && (
                <p className="text-[11px] text-[#FF5A5F] font-medium">Passwords do not match.</p>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#22E58B] hover:bg-[#1BC878] disabled:bg-[#16241F] disabled:text-[#8DA39B] text-[#04130C] font-extrabold rounded-xl shadow-lg shadow-[#22E58B]/20 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 text-sm cursor-pointer mt-3"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-[#04130C]" />
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
          <div className="pt-6 border-t border-[#1E2F2A] text-center space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-1 text-[11px] text-[#8DA39B]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22E58B] shrink-0 mr-0.5" />
              <span>By registering, you agree to the</span>
              <Link to="/terms" className="text-[#22E58B] font-bold hover:underline">
                Terms of Service
              </Link>
              <span>and</span>
              <Link to="/privacy" className="text-[#22E58B] font-bold hover:underline">
                Privacy Policy
              </Link>
            </div>
            <div className="lg:hidden text-xs text-[#8DA39B]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#22E58B] hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};
