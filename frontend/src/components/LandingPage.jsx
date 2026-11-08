import React, { useState, useEffect } from 'react';
import { 
  Building2, Home, Key, ShieldCheck, MapPin, 
  Search, ArrowRight, CheckCircle2, Users, Sparkles,
  ChevronRight, Award, Compass, TrendingUp
} from 'lucide-react';

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
    caption: "Addis Ababa Modern Skyline & Bole Residences"
  },
  {
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    caption: "Luxury Diplomatic Villas in Old Airport & CMC"
  },
  {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    caption: "Suburban Green Communities in Adama & Oromia"
  },
  {
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    caption: "Contemporary High-Rise Living in Kazanchis"
  }
];

export default function LandingPage({ 
  t, 
  lang, 
  onNavigate, 
  onSearchSubmit, 
  currentUser 
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quickCity, setQuickCity] = useState('');
  const [quickPurpose, setQuickPurpose] = useState('buy');
  const [quickType, setQuickType] = useState('');
  const [quickQuery, setQuickQuery] = useState('');

  // Cycle animated background images every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex(prev => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit({
        city: quickCity,
        purpose: quickPurpose,
        property_type: quickType,
        search: quickQuery
      });
    }
    onNavigate('search');
  };

  return (
    <div className="landing-page-wrapper">
      {/* ==================================================== */}
      {/* ANIMATED HERO SECTION WITH BACKGROUND IMAGE CAROUSEL */}
      {/* ==================================================== */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-gray-900 text-white">
        {/* Animated Background Layers */}
        {HERO_IMAGES.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform scale-105 ${
              idx === activeImageIndex 
                ? 'opacity-70 scale-100' 
                : 'opacity-0 pointer-events-none'
            }`}
            style={{
              backgroundImage: `url('${img.url}')`,
              filter: 'brightness(0.7) contrast(1.1)'
            }}
          />
        ))}

        {/* Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-gray-950/80" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          {/* Ethiopian Flag Ribbon Accent */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 mb-6 animate-pulse">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-emerald-300">
              {lang === 'am' ? 'የኢትዮጵያ ቁጥር 1 ዘመናዊ የቤት መድረክ • አዲስ አበባ እና አዳማ' : "ETHIOPIA'S PREMIER REAL ESTATE PORTAL • ADDIS ABABA & ADAMA"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-md">
            {t.landingHeroTitle}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed font-normal drop-shadow">
            {t.landingHeroSub}
          </p>

          {/* Quick Search Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 max-w-4xl mx-auto text-gray-800 border border-white/40">
            <div className="flex border-b border-gray-200 pb-3 mb-4 gap-4">
              <button
                type="button"
                onClick={() => setQuickPurpose('buy')}
                className={`text-sm sm:text-base font-bold pb-2 transition-colors border-b-2 flex items-center gap-2 ${
                  quickPurpose === 'buy'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Key className="w-4 h-4" />
                {t.tabBuy}
              </button>
              <button
                type="button"
                onClick={() => setQuickPurpose('rent')}
                className={`text-sm sm:text-base font-bold pb-2 transition-colors border-b-2 flex items-center gap-2 ${
                  quickPurpose === 'rent'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                {t.tabRent}
              </button>
            </div>

            <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 text-left mb-1">
                  {t.labelCity}
                </label>
                <select
                  value={quickCity}
                  onChange={(e) => setQuickCity(e.target.value)}
                  className="w-full text-sm rounded-lg border border-gray-300 p-2.5 bg-gray-50 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">{t.allCities}</option>
                  <option value="Addis Ababa">{t.addisAbaba}</option>
                  <option value="Adama">{t.adama}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 text-left mb-1">
                  {t.labelType}
                </label>
                <select
                  value={quickType}
                  onChange={(e) => setQuickType(e.target.value)}
                  className="w-full text-sm rounded-lg border border-gray-300 p-2.5 bg-gray-50 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">{t.allTypes}</option>
                  <option value="flat">{t.typeFlat}</option>
                  <option value="house">{t.typeHouse}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 text-left mb-1">
                  {t.labelLocality}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'am' ? 'ቦሌ፣ ሲኤምሲ፣ ወንጂ...' : 'Bole, CMC, Wonji...'}
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  className="w-full text-sm rounded-lg border border-gray-300 p-2.5 bg-gray-50 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{t.btnSearch}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Stats Pill Strip */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <div className="text-2xl font-extrabold text-emerald-400">20+</div>
              <div className="text-xs text-gray-300 font-medium">{t.landingStatsProps}</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <div className="text-2xl font-extrabold text-amber-400">2</div>
              <div className="text-xs text-gray-300 font-medium">{t.landingStatsCities} (Addis & Adama)</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <div className="text-2xl font-extrabold text-sky-400">4</div>
              <div className="text-xs text-gray-300 font-medium">{t.landingStatsDevelopers}</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <div className="text-2xl font-extrabold text-rose-400">100%</div>
              <div className="text-xs text-gray-300 font-medium">Admin Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4 DEDICATED ROLE PORTALS INTRO SECTION               */}
      {/* ==================================================== */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              {lang === 'am' ? 'ለእያንዳንዱ ተጠቃሚ የተዘጋጀ ልዩ መድረክ' : 'Dedicated Portals for Every Real Estate Role'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              {lang === 'am' 
                ? 'የቤት ባለቤት፣ ደላላ፣ የሪል እስቴት አልሚ ወይም ገዢ ከሆኑ የራስዎን የተሟላ ገጽ ያግኙ።'
                : 'Whether you are a direct owner, licensed broker, property developer, or platform administrator, Kedami provides tailored tools.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Role 1: Property Owners */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t.ownersTitle}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {lang === 'am' 
                    ? 'አፓርታማዎን ወይም ቪላዎን ያለምንም ደላላ ኮሚሽን በቀጥታ ለገዢዎች ወይም ለተከራዮች ያስተዋውቁ።'
                    : 'List your flat or house directly. Zero broker fee, instant review queue routing, and direct buyer inquiries.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('owners')}
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 pt-3 border-t border-gray-100"
              >
                <span>{lang === 'am' ? 'ወደ ባለቤቶች ገጽ ሂድ' : 'Open Owners Portal'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Role 2: Real Estate Agents */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t.agentsTitle}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {lang === 'am'
                    ? 'የደንበኞችዎን ቤቶች ያስተዳድሩ፣ የደላላ ባጅ ያግኙ እና የሚመጡትን የገዢ ጥያቄዎች በሙሉ ይቆጣጠሩ።'
                    : 'Manage client listings with certified broker badges and access client lead inquiries in a dedicated dashboard.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('agents')}
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 pt-3 border-t border-gray-100"
              >
                <span>{lang === 'am' ? 'ወደ ደላላዎች ገጽ ሂድ' : 'Open Agents Portal'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Role 3: Builders & Developers */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t.developersTitle}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {lang === 'am'
                    ? 'ግዙፍ የመኖሪያ መንደሮችን፣ የህንፃ ፎቆችንና የቪላ ፕሮጀክቶችን (አያት፣ ፀሐይ፣ ኖህ፣ ፍሊንትስቶን) ያስተዋውቁ።'
                    : 'Showcase mega residential developments with delivery timelines, unit counts, and starting prices in ETB.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('developers')}
                className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 pt-3 border-t border-gray-100"
              >
                <span>{lang === 'am' ? 'ወደ አልሚዎች ገጽ ሂድ' : 'Open Developers Portal'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Role 4: Platform Administrator */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t.adminTitle}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {lang === 'am'
                    ? 'አዳዲስ ተጠቃሚዎችን እና ቤቶችን ያጽድቁ፣ የሲስተም አሃዞችን ይቆጣጠሩ እና የጥራት ደረጃን ይጠብቁ።'
                    : 'Review and approve new user sign-ins, verify property listings with images, and govern platform security.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 pt-3 border-t border-gray-100"
              >
                <span>{lang === 'am' ? 'ወደ አስተዳዳሪ ገጽ ሂድ' : 'Open Admin Portal'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* FEATURED ETHIOPIAN DEVELOPERS SHOWCASE               */}
      {/* ==================================================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 block">
                {lang === 'am' ? 'የታመኑ አልሚዎች' : 'PREMIER BUILDERS'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {t.landingSectionDevs}
              </h2>
              <p className="text-sm text-gray-600 mt-2 max-w-2xl">
                {t.landingSectionDevsSub}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('developers')}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700"
            >
              <span>{lang === 'am' ? 'ሁሉንም ፕሮጀክቶች እይ' : 'View All Projects'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Ayat */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80')` }} />
              <div className="p-4">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Ayat Real Estate</span>
                <h4 className="font-bold text-gray-900 text-base mt-2">Ayat Hilltop G+2 Luxury Villas</h4>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>CMC / Ayat, Addis Ababa</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-600">From 28,000,000 ETB</span>
                  <span className="text-gray-500">2026 Q3</span>
                </div>
              </div>
            </div>

            {/* Tsehay */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80')` }} />
              <div className="p-4">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Tsehay Real Estate</span>
                <h4 className="font-bold text-gray-900 text-base mt-2">Tsehay Polyclinic Towers</h4>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>CMC Michael, Addis Ababa</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-600">From 18,500,000 ETB</span>
                  <span className="text-emerald-600 font-semibold">Ready to Handover</span>
                </div>
              </div>
            </div>

            {/* Noah */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80')` }} />
              <div className="p-4">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">Noah Real Estate</span>
                <h4 className="font-bold text-gray-900 text-base mt-2">Noah Atlas Luxury Residences</h4>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>Bole Atlas, Addis Ababa</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-600">From 22,000,000 ETB</span>
                  <span className="text-gray-500">2026 Q4</span>
                </div>
              </div>
            </div>

            {/* Flintstone */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80')` }} />
              <div className="p-4">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Flintstone Homes</span>
                <h4 className="font-bold text-gray-900 text-base mt-2">Flintstone Adama Green Valley</h4>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>Bole Sub-City, Adama</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-600">From 12,500,000 ETB</span>
                  <span className="text-gray-500">2027</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* WHY CHOOSE KEDAMI STRIP                              */}
      {/* ==================================================== */}
      <section className="py-16 bg-gradient-to-br from-emerald-900 to-teal-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              {t.landingWhyChoose}
            </h2>
            <p className="text-emerald-200 text-sm sm:text-base max-w-xl mx-auto">
              {lang === 'am' 
                ? 'በኢትዮጵያ ውስጥ አስተማማኝና ዘመናዊ የሪል እስቴት አገልግሎት እንዲያገኙ የሚያስችሉ ምክንያቶች' 
                : 'Built to bring institutional transparency, zero scam listings, and verified properties to Ethiopia.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t.landingWhy1Title}</h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                {t.landingWhy1Desc}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t.landingWhy2Title}</h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                {t.landingWhy2Desc}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t.landingWhy3Title}</h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                {t.landingWhy3Desc}
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-14 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('search')}
                className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span>{t.landingBtnExplore}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate(currentUser ? 'owners' : 'login')}
                className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-3.5 rounded-xl border border-white/30 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <span>{currentUser ? t.landingBtnPost : t.landingBtnLogin}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
