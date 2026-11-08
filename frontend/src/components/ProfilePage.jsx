import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Building, ShieldCheck, 
  Clock, CheckCircle2, Save, LogOut, ArrowRight, Home, 
  Briefcase, AlertCircle
} from 'lucide-react';

export default function ProfilePage({ 
  currentUser, 
  onUpdateUser, 
  onLogout, 
  onNavigate, 
  properties = [], 
  favorites = [], 
  lang, 
  t, 
  apiBase 
}) {
  const isAmharic = lang === 'am';

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.city || 'Addis Ababa');
  const [company, setCompany] = useState(currentUser?.company || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!currentUser) return null;

  // Number of properties posted by this user
  const userListings = properties.filter(p => 
    p.role === currentUser.role || 
    (p.postedBy && p.postedBy.email === currentUser.email)
  );

  const getRoleTitle = (role) => {
    switch (role) {
      case 'owner': return isAmharic ? 'የቤት ባለቤት (Property Owner)' : 'Property Owner';
      case 'agent': return isAmharic ? 'ደላላ / ወኪል (Real Estate Broker)' : 'Licensed Broker / Agent';
      case 'developer': return isAmharic ? 'የሪል እስቴት አልሚ (Developer)' : 'Real Estate Developer';
      case 'admin': return isAmharic ? 'የሲስተም አስተዳዳሪ (Platform Admin)' : 'Platform Administrator';
      case 'customer':
      case 'seeker': return isAmharic ? 'ቀዳሚ ደንበኛ (ተከራይ / ገዢ)' : 'Kedami Customer (Renter / Buyer)';
      default: return isAmharic ? 'ቀዳሚ ደንበኛ (ተከራይ / ገዢ)' : 'Kedami Customer (Renter / Buyer)';
    }
  };

  const getRoleDashboardId = (role) => {
    switch (role) {
      case 'owner': return 'owners';
      case 'agent': return 'agents';
      case 'developer': return 'developers';
      case 'admin': return 'admin';
      case 'customer':
      case 'seeker': return 'customer';
      default: return 'customer';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`${apiBase}/api/auth/users/${currentUser.id || currentUser._id}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, city, company })
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await res.json();
      onUpdateUser(updatedUser);
      setSuccessMsg(t.profileSavedSuccess);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm mb-8">
        <div className="h-32 bg-gradient-to-r from-emerald-700 via-teal-800 to-gray-900" />
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-12 gap-4 pb-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img
                src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=10b981&color=fff`}
                alt={currentUser.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
              />
              <div>
                <h1 className="text-2xl font-black text-gray-900">{currentUser.name}</h1>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {getRoleTitle(currentUser.role)}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    currentUser.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {currentUser.status === 'approved' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                    <span>{currentUser.status === 'approved' ? t.authApprovedBadge : t.authPendingBadge}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onNavigate(getRoleDashboardId(currentUser.role))}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span>{isAmharic ? 'ወደ እኔ መድረክ ሂድ' : 'Open My Dashboard'}</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-2 bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-600 font-bold rounded-xl text-xs border border-gray-200 transition-colors"
                title={t.navLogout}
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-4 pt-4 text-center">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-lg font-black text-emerald-600">{userListings.length}</span>
              <span className="block text-[11px] text-gray-500 font-semibold">{t.profileListingsCount}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-lg font-black text-rose-500">{favorites.length}</span>
              <span className="block text-[11px] text-gray-500 font-semibold">{t.profileFavoritesCount}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-sm font-black text-gray-800">
                {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Active'}
              </span>
              <span className="block text-[11px] text-gray-500 font-semibold">{t.profileMemberSince}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">{t.profileTitle}</h2>
        <p className="text-xs text-gray-500 mb-6">{t.profileSubtitle}</p>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t.authNameLabel} *
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t.authEmailLabel}
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t.authPhoneLabel}
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 911 ..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t.authCityLabel || 'City'}
              </label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Addis Ababa">{t.addisAbaba}</option>
                  <option value="Adama">{t.adama}</option>
                </select>
              </div>
            </div>
          </div>

          {(currentUser.role === 'agent' || currentUser.role === 'developer') && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t.authCompanyLabel}
              </label>
              <div className="relative">
                <Building size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Addis Premier Realty"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="pt-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save size={15} />
              <span>{saving ? (isAmharic ? 'በማስቀመጥ ላይ...' : 'Saving...') : t.profileSaveBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
