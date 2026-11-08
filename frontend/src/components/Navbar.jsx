import React, { useState } from 'react';
import { 
  Building2, Heart, MapPin, Globe, User, 
  LogOut, LogIn, Menu, X, ShieldCheck, Home, 
  Briefcase, Building, Search, UserCheck
} from 'lucide-react';
import KedamiLogo from './KedamiLogo';

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
  const isAmharic = lang === 'am';

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return isAmharic ? 'አስተዳዳሪ' : 'Admin';
      case 'owner': return isAmharic ? 'ባለቤት' : 'Owner';
      case 'agent': return isAmharic ? 'ደላላ/ወኪል' : 'Agent';
      case 'developer': return isAmharic ? 'አልሚ' : 'Developer';
      default: return isAmharic ? 'ተጠቃሚ' : 'Seeker';
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
            className="flex items-center cursor-pointer select-none group"
            onClick={() => onNavigate(currentUser ? (currentUser.role === 'admin' ? 'admin' : 'landing') : 'landing')}
          >
            <KedamiLogo 
              variant="image" 
              size="md" 
              showSubtitle={true} 
              lang={lang} 
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={onToggleLang}
              title={isAmharic ? "Switch to English" : "ወደ አማርኛ ቀይር"}
            >
              <Globe size={15} className="text-emerald-600" />
              <span>{isAmharic ? 'English' : 'አማርኛ'}</span>
            </button>

            {/* City Selection Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700">
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

            {/* Shortlisted Favorites Button (Only when user or browsing) */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors relative"
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
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <button
                  type="button"
                  onClick={() => onNavigate('profile')}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 transition-colors text-left group"
                  title={t.navProfile}
                >
                  <img
                    src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=10b981&color=fff`}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover border border-gray-300 group-hover:border-emerald-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[110px] group-hover:text-emerald-700">
                      {currentUser.name}
                    </div>
                    <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded border ${getRoleBadgeClass(currentUser.role)}`}>
                      {getRoleLabel(currentUser.role)}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                  title={t.navLogout}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('login', { mode: 'login' })}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-md shadow-emerald-600/20"
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
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=10b981&color=fff`}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-gray-900">{currentUser.name}</div>
                    <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded border ${getRoleBadgeClass(currentUser.role)}`}>
                      {getRoleLabel(currentUser.role)}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">{t.navProfile} →</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center text-xs font-bold text-rose-600 py-1.5 bg-rose-50 rounded-lg"
              >
                {t.navLogout}
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onNavigate('login', { mode: 'login' });
                  setMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                <LogIn size={15} />
                <span>{isAmharic ? 'ግባ (Log In)' : 'Log In'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('login', { mode: 'register' });
                  setMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-800 rounded-xl text-xs font-bold border border-gray-200"
              >
                <span>{isAmharic ? 'ተመዝገብ (Sign Up)' : 'Sign Up'}</span>
              </button>
            </div>
          )}

          {/* Quick Nav Links (Only visible if logged in) */}
          {currentUser && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
                className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-800 text-left"
              >
                {t.navLanding}
              </button>
              <button
                type="button"
                onClick={() => { onNavigate('search'); setMobileMenuOpen(false); }}
                className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-800 text-left"
              >
                {t.navHome}
              </button>
              {currentUser.role === 'owner' && (
                <button
                  type="button"
                  onClick={() => { onNavigate('owners'); setMobileMenuOpen(false); }}
                  className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-left"
                >
                  {t.navMyProperties}
                </button>
              )}
              {currentUser.role === 'agent' && (
                <button
                  type="button"
                  onClick={() => { onNavigate('agents'); setMobileMenuOpen(false); }}
                  className="p-2.5 bg-blue-50 text-blue-800 rounded-xl text-xs font-bold text-left"
                >
                  {t.navClientLeads}
                </button>
              )}
              {currentUser.role === 'developer' && (
                <button
                  type="button"
                  onClick={() => { onNavigate('developers'); setMobileMenuOpen(false); }}
                  className="p-2.5 bg-purple-50 text-purple-800 rounded-xl text-xs font-bold text-left"
                >
                  {t.navDevProjects}
                </button>
              )}
              {currentUser.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                  className="p-2.5 bg-rose-50 text-rose-800 rounded-xl text-xs font-bold text-left"
                >
                  {t.navAdminConsole}
                </button>
              )}
              <button
                type="button"
                onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }}
                className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-800 text-left"
              >
                {t.navProfile}
              </button>
            </div>
          )}

          {/* Mobile Preferences (City & Language) */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onToggleLang}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
            >
              <Globe size={15} />
              <span>{isAmharic ? 'English' : 'አማርኛ'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenFavorites();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
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
