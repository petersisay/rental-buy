import React, { useState } from 'react';
import { 
  Building2, Heart, MapPin, Globe, User, 
  LogOut, LogIn, Menu, X, ShieldCheck, Home, 
  Briefcase, Building, Search
} from 'lucide-react';

export default function Navbar({ 
  city, 
  onCityChange, 
  favoritesCount, 
  onOpenFavorites, 
  lang, 
  onToggleLang, 
  t, 
  currentUser, 
  onLogout, 
  onNavigate 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return lang === 'am' ? 'አስተዳዳሪ' : 'Admin';
      case 'owner': return lang === 'am' ? 'ባለቤት' : 'Owner';
      case 'agent': return lang === 'am' ? 'ደላላ/ወኪል' : 'Agent';
      case 'developer': return lang === 'am' ? 'አልሚ' : 'Developer';
      default: return lang === 'am' ? 'ተጠቃሚ' : 'User';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'owner': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'agent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'developer': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Group */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => onNavigate('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-emerald-600/20">
              ቀ
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-gray-950 flex items-center gap-1.5">
                <span>{lang === 'am' ? 'ቀዳሚ' : 'Kedami'}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  ET
                </span>
              </div>
              <span className="text-[10px] font-semibold text-gray-400 block -mt-1 tracking-wider uppercase">
                {t.brandTagline}
              </span>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={onToggleLang}
              title={lang === 'am' ? "Switch to English" : "ወደ አማርኛ ቀይር"}
            >
              <Globe size={15} className="text-emerald-600" />
              <span>{lang === 'am' ? 'English' : 'አማርኛ'}</span>
            </button>

            {/* City Selection Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700">
              <MapPin size={15} className="text-emerald-600" />
              <span>{t.selectCity}</span>
              <select
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-900 border-none focus:outline-none cursor-pointer"
                aria-label="Select City"
              >
                <option value="">{t.allCities}</option>
                <option value="Addis Ababa">{t.addisAbaba}</option>
                <option value="Adama">{t.adama}</option>
              </select>
            </div>

            {/* Shortlisted Favorites Button */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors relative"
              onClick={onOpenFavorites}
              title={t.shortlisted}
            >
              <Heart size={16} className={favoritesCount > 0 ? "text-rose-500 fill-rose-500" : "text-gray-400"} />
              <span>{t.shortlisted}</span>
              {favoritesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth State */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <img
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=10b981&color=fff`}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded border ${getRoleBadgeClass(currentUser.role)}`}>
                    {getRoleLabel(currentUser.role)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title={t.navLogout}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20"
              >
                <LogIn size={15} />
                <span>{t.navLogin}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          {/* User state banner in mobile */}
          {currentUser ? (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=10b981&color=fff`}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-bold text-gray-900">{currentUser.name}</div>
                  <div className="text-xs text-gray-500">{currentUser.email}</div>
                  <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded border ${getRoleBadgeClass(currentUser.role)}`}>
                    {getRoleLabel(currentUser.role)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-rose-600 px-3 py-1.5 bg-rose-50 rounded-lg"
              >
                {t.navLogout}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                onNavigate('login');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-sm"
            >
              <LogIn size={16} />
              <span>{t.navLogin}</span>
            </button>
          )}

          {/* Quick Nav Links */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-800 text-left"
            >
              {t.navLanding || 'Home'}
            </button>
            <button
              type="button"
              onClick={() => { onNavigate('search'); setMobileMenuOpen(false); }}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-800 text-left"
            >
              {t.navHome}
            </button>
            <button
              type="button"
              onClick={() => { onNavigate('owners'); setMobileMenuOpen(false); }}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-800 text-left"
            >
              {t.navOwners}
            </button>
            <button
              type="button"
              onClick={() => { onNavigate('agents'); setMobileMenuOpen(false); }}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-800 text-left"
            >
              {t.navAgents}
            </button>
            <button
              type="button"
              onClick={() => { onNavigate('developers'); setMobileMenuOpen(false); }}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-800 text-left"
            >
              {t.navDevelopers}
            </button>
            <button
              type="button"
              onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-800 text-left"
            >
              {t.navAdmin}
            </button>
          </div>

          {/* Mobile Preferences (City & Language) */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onToggleLang}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700"
            >
              <Globe size={15} />
              <span>{lang === 'am' ? 'English' : 'አማርኛ'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenFavorites();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700"
            >
              <Heart size={15} className="text-rose-500" />
              <span>{t.shortlisted} ({favoritesCount})</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
