import React, { useState } from 'react';
import { 
  Building2, Home, Key, ShieldCheck, Mail, User, 
  Phone, ArrowRight, CheckCircle2, Clock, AlertCircle, 
  Sparkles, Lock, ArrowLeft, MapPin, Building
} from 'lucide-react';
import KedamiLogo from './KedamiLogo';

const DEMO_USERS = [
  {
    role: 'admin',
    title: 'Platform Admin',
    title_am: 'የሲስተም አስተዳዳሪ',
    email: 'admin@kedami.et',
    name: 'Kedami System Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    color: 'amber',
    desc: 'Approves new users & listings, reviews platform KPIs'
  },
  {
    role: 'owner',
    title: 'Property Owner',
    title_am: 'የቤት ባለቤት',
    email: 'owner.demo@kedami.et',
    name: 'Dawit Haile',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    color: 'emerald',
    desc: 'Lists flats & houses directly with 0% brokerage'
  },
  {
    role: 'agent',
    title: 'Real Estate Broker',
    title_am: 'ደላላ / ወኪል',
    email: 'agent.demo@kedami.et',
    name: 'Almaz Bekele',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    color: 'blue',
    desc: 'Multi-listing management & client lead inquiries inbox'
  },
  {
    role: 'developer',
    title: 'Developer Rep',
    title_am: 'የሪል እስቴት አልሚ',
    email: 'developer.demo@kedami.et',
    name: 'Ayat Real Estate Rep',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    color: 'purple',
    desc: 'Showcases mega developments (Ayat, Tsehay, Noah)'
  },
  {
    role: 'seeker',
    title: 'Renter / Buyer',
    title_am: 'ተከራይ / ገዢ',
    email: 'seeker.demo@kedami.et',
    name: 'Hirut Tadesse',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    color: 'teal',
    desc: 'Searches, shortlists, and contacts property listers'
  }
];

export default function LoginPage({ 
  t, 
  lang, 
  onLoginSuccess, 
  onNavigate, 
  currentUser,
  initialRole = 'seeker',
  initialMode = 'login'
}) {
  const isAmharic = lang === 'am';

  const [authMode, setAuthMode] = useState(initialMode); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(initialRole);
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('Addis Ababa');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingUserNotice, setPendingUserNotice] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Instant 1-Click Demo Login
  const handleDemoLogin = async (demoRole) => {
    setLoading(true);
    setError('');
    setPendingUserNotice(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: demoRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Demo login failed');

      onLoginSuccess(data.user);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to sign in to demo account');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Simulation
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    setPendingUserNotice(null);

    const googleEmail = prompt(
      isAmharic 
        ? 'የGoogle አካውንት ኢሜይልዎን ያስገቡ:' 
        : 'Enter your Google Account email address:',
      'user@gmail.com'
    );

    if (!googleEmail || !googleEmail.includes('@')) {
      setGoogleLoading(false);
      return;
    }

    try {
      const gName = googleEmail.split('@')[0].replace('.', ' ');
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleEmail,
          name: gName.charAt(0).toUpperCase() + gName.slice(1),
          googleId: `google-${Date.now()}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(gName)}&background=4285F4&color=fff`,
          role: authMode === 'register' ? role : 'seeker'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed');

      if (data.user.status === 'pending') {
        setPendingUserNotice(data.user);
      } else {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Email Submit for Login or Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(isAmharic ? 'እባክዎ ኢሜይልዎን ያስገቡ' : 'Please provide your email');
      return;
    }

    setLoading(true);
    setError('');
    setPendingUserNotice(null);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || email.split('@')[0],
          phone,
          role: authMode === 'register' ? role : undefined,
          company,
          city
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      if (data.user.status === 'pending') {
        setPendingUserNotice(data.user);
      } else {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isAmharic ? 'ወደ መነሻ ገጽ ተመለስ' : 'Back to Home'}</span>
        </button>

        {/* Brand Logo & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-4">
            <KedamiLogo 
              variant="image" 
              size="lg" 
              showSubtitle={false} 
              lang={lang} 
            />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {t.authPageTitle}
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-lg mx-auto">
            {t.authPageSub}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Pending Approval Notice */}
        {pendingUserNotice && (
          <div className="mb-8 p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-sm animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-900">
                  {t.authPendingNoticeTitle}
                </h3>
                <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                  {t.authPendingNoticeDesc}
                </p>
                <div className="mt-4 p-3 bg-white/80 rounded-lg text-xs flex flex-wrap gap-4 border border-amber-200">
                  <span><strong>{t.authEmailLabel}:</strong> {pendingUserNotice.email}</span>
                  <span><strong>{t.authRoleBadgeLabel}:</strong> {pendingUserNotice.role}</span>
                  <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    {t.authPendingBadge}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid: Left Auth Form, Right 1-Click Demo Accounts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Mode Switcher Tabs (Log In vs Sign Up) */}
            <div className="flex border-b border-gray-200 mb-6 gap-2">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(''); }}
                className={`flex-1 pb-3 font-bold text-sm text-center border-b-2 transition-colors ${
                  authMode === 'login'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {t.authTabLogin || 'Log In'}
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setError(''); }}
                className={`flex-1 pb-3 font-bold text-sm text-center border-b-2 transition-colors ${
                  authMode === 'register'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {t.authTabRegister || 'Sign Up / Register'}
              </button>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm shadow-sm transition-all hover:shadow"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? (isAmharic ? 'በመግባት ላይ...' : 'Connecting...') : t.authGoogleBtn}</span>
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500 font-semibold tracking-wider">
                  {t.authOrDivider}
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {t.authEmailLabel} *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Register-only Fields */}
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      {t.authNameLabel} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder={isAmharic ? 'ሙሉ ስምዎን ያስገቡ' : 'Your full name'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        {t.authRoleLabel} *
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
                      >
                        <option value="owner">{t.authRoleOwner}</option>
                        <option value="agent">{t.authRoleAgent}</option>
                        <option value="developer">{t.authRoleDeveloper}</option>
                        <option value="seeker">{t.authRoleSeeker}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        {t.authCityLabel || 'City'} *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
                      >
                        <option value="Addis Ababa">{t.addisAbaba}</option>
                        <option value="Adama">{t.adama}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      {t.authPhoneLabel}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        placeholder="+251 911 ..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {(role === 'agent' || role === 'developer') && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        {t.authCompanyLabel}
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          placeholder={isAmharic ? 'የድርጅት ወይም የኤጀንሲ ስም' : 'Agency or firm name'}
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>
                  {loading 
                    ? (isAmharic ? 'በማረጋገጥ ላይ...' : 'Verifying...') 
                    : (authMode === 'register' ? t.authSubmitRegister : t.authSubmitLogin)}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: 1-Click Demo Profiles */}
          <div className="lg:col-span-5 bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl p-6 sm:p-7 text-white border border-gray-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>{t.authDemoTitle}</span>
              </div>
              <p className="text-xs text-gray-300 mb-6 leading-relaxed">
                {t.authDemoSub}
              </p>

              <div className="space-y-3">
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => handleDemoLogin(demo.role)}
                    disabled={loading}
                    className="w-full text-left p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/25 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={demo.avatar}
                        alt={demo.name}
                        className="w-10 h-10 rounded-xl object-cover border border-white/20"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {isAmharic ? demo.title_am : demo.title}
                          </span>
                          <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Approved
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {demo.email}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
              <span>Security: Admin verification enforced</span>
              <span className="font-semibold text-emerald-400">100% MERN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
