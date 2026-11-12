import React, { useState, useEffect } from 'react';
import { 
  Building2, Home, Heart, Search, Calendar, 
  Phone, Mail, MapPin, CheckCircle2, Clock, Send, 
  Sparkles, Filter, Eye, ArrowRight, UserCheck, 
  ShieldCheck, AlertCircle, Building, Key, X
} from 'lucide-react';
import PropertyCard from './PropertyCard';

export default function CustomerPortal({
  properties = [],
  favorites = [],
  onToggleFavorite,
  onOpenDetails,
  currentUser,
  onNavigate,
  lang = 'am',
  t,
  apiBase = 'http://127.0.0.1:8000'
}) {
  const isAmharic = lang === 'am';

  // Active Sub-tab in Customer Portal: 'browse', 'favorites', 'inquiries', 'developers'
  const [activeTab, setActiveTab] = useState('browse');

  // Scroll to header / top whenever sub-tab changes
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [activeTab]);

  // Filter States for Customer Browsing
  const [filterPurpose, setFilterPurpose] = useState('all'); // 'all', 'Rent', 'Sale'
  const [filterCity, setFilterCity] = useState('all'); // 'all', 'Addis Ababa', 'Adama'
  const [filterType, setFilterType] = useState('all'); // 'all', 'Flat', 'House'
  const [searchQuery, setSearchQuery] = useState('');

  // Customer Inquiries state
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  // Quick Rent/Buy/Tour Modal State
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [inquiryType, setInquiryType] = useState('rent'); // 'rent', 'buy', 'tour'
  const [tourDate, setTourDate] = useState('');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerMessage, setCustomerMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccessMsg, setInquirySuccessMsg] = useState('');
  const [inquiryErrorMsg, setInquiryErrorMsg] = useState('');

  // Developer projects state
  const [developerProjects, setDeveloperProjects] = useState([]);

  // Fetch developer projects & inquiries for current customer
  useEffect(() => {
    fetchDeveloperProjects();
    if (currentUser?.email) {
      fetchCustomerInquiries();
    }
  }, [currentUser?.email]);

  const fetchDeveloperProjects = async () => {
    try {
      const res = await fetch(`${apiBase}/api/developer-projects`);
      if (res.ok) {
        const data = await res.json();
        setDeveloperProjects(data);
      }
    } catch (e) {
      console.error('Failed to fetch developer projects:', e);
    }
  };

  const fetchCustomerInquiries = async () => {
    if (!currentUser?.email) return;
    setInquiriesLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/contact?email=${encodeURIComponent(currentUser.email)}`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (e) {
      console.error('Failed to fetch inquiries:', e);
    } finally {
      setInquiriesLoading(false);
    }
  };

  // Open Inquiry / Tour Modal
  const handleOpenInquiryModal = (property, type = 'rent') => {
    setSelectedProperty(property);
    setInquiryType(type);
    setTourDate('');
    setCustomerMessage(
      type === 'rent'
        ? (isAmharic ? `ሰላም፣ ይህንን ቤት (${property.title_am || property.title}) በኪራይ ለመውሰድ እፈልጋለሁ። ተጨማሪ መረጃ ያካፍሉኝ።` : `Hello, I am interested in renting this property (${property.title}). Please share lease terms.`)
        : type === 'buy'
        ? (isAmharic ? `ሰላም፣ ይህንን ቤት (${property.title_am || property.title}) ለመግዛት ፍላጎት አለኝ። የዋጋና የክፍያ ሁኔታዎችን ያብራሩልኝ።` : `Hello, I am interested in purchasing this property (${property.title}). Please provide purchase details.`)
        : (isAmharic ? `ሰላም፣ ይህንን ቤት በአካል ጎብኝቼ ማየት እፈልጋለሁ። ምቹ ቀንና ሰዓት ያስይዙልኝ።` : `Hello, I would like to schedule an in-person viewing tour for this property.`)
    );
    setInquirySuccessMsg('');
    setInquiryErrorMsg('');
  };

  // Submit Inquiry / Tour Request
  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!selectedProperty) return;

    setSubmittingInquiry(true);
    setInquiryErrorMsg('');
    setInquirySuccessMsg('');

    try {
      const propId = selectedProperty._id || selectedProperty.id;
      const res = await fetch(`${apiBase}/api/properties/${propId}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentUser?.name || 'Customer',
          email: currentUser?.email,
          phone: customerPhone || currentUser?.phone || '+251 911 000000',
          inquiryType,
          propertyTitle: isAmharic ? (selectedProperty.title_am || selectedProperty.title) : selectedProperty.title,
          city: selectedProperty.city,
          price: selectedProperty.price,
          message: `${customerMessage} ${tourDate ? `(የተመረጠ ቀን / Preferred Date: ${tourDate})` : ''}`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry');

      setInquirySuccessMsg(
        isAmharic 
          ? 'ጥያቄዎ በተሳካ ሁኔታ ተልኳል! የቤቱ ባለቤት ወይም ወኪል በቅርቡ ያነጋግርዎታል።' 
          : 'Your inquiry has been submitted! The property lister will contact you shortly.'
      );

      // Refresh inquiries list
      fetchCustomerInquiries();

      setTimeout(() => {
        setSelectedProperty(null);
      }, 2000);
    } catch (err) {
      setInquiryErrorMsg(err.message || 'Error submitting request');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  // Filter properties
  const filteredProperties = properties.filter((p) => {
    if (filterPurpose !== 'all') {
      const pPurpose = p.purpose || (p.badge === 'RENT' ? 'Rent' : 'Sale');
      if (filterPurpose === 'Rent' && pPurpose !== 'Rent') return false;
      if (filterPurpose === 'Sale' && pPurpose !== 'Sale') return false;
    }
    if (filterCity !== 'all' && p.city !== filterCity) return false;
    if (filterType !== 'all') {
      if (filterType === 'Flat' && p.type !== 'Flat') return false;
      if (filterType === 'House' && p.type !== 'House') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchLoc = p.locality?.toLowerCase().includes(q);
      const matchCity = p.city?.toLowerCase().includes(q);
      const matchTitle = (p.title || '').toLowerCase().includes(q) || (p.title_am || '').toLowerCase().includes(q);
      if (!matchLoc && !matchCity && !matchTitle) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ========================================================= */}
        {/* 1. CUSTOMER WELCOME BANNER & STATS                       */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 shadow-xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 mb-3">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isAmharic ? 'ቀዳሚ የተረጋገጠ ደንበኛ' : 'Kedami Verified Customer'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {isAmharic ? `እንኳን ደህና መጡ፣ ${currentUser?.name || 'ውድ ደንበኛ'}!` : `Welcome, ${currentUser?.name || 'Customer'}!`}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                {t.customerWelcomeSub || 'በአዲስ አበባ እና በአዳማ ውስጥ የተረጋገጡ ቤቶችን ይፈልጉ፣ ይከራዩ ወይም ይግዙ።'}
              </p>
            </div>

            {/* Quick Action Profile Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2 shadow-sm"
              >
                <span>{isAmharic ? 'የእኔ የግል ገጽ' : 'My Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">
                {isAmharic ? 'የሚከራዩ/የሚሸጡ ቤቶች' : 'Available Properties'}
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {properties.length}+
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">
                {isAmharic ? 'የተመረጡ ቤቶች' : 'Saved Favorites'}
              </span>
              <span className="text-2xl font-black text-amber-300 mt-1 block">
                {favorites.length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">
                {isAmharic ? 'የተላኩ ጥያቄዎች' : 'My Requests Sent'}
              </span>
              <span className="text-2xl font-black text-teal-300 mt-1 block">
                {inquiries.length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">
                {isAmharic ? 'ዋና ዋና ከተሞች' : 'Active Cities'}
              </span>
              <span className="text-2xl font-black text-emerald-300 mt-1 block">
                2 (Addis & Adama)
              </span>
            </div>
          </div>

          {/* Customer Role Constraint Notice */}
          <div className="mt-4 p-3 rounded-xl bg-teal-950/60 border border-teal-500/30 text-xs text-teal-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <span>
              {t.customerNoPostNotice || 'እንደ ደንበኛ (ተከራይ/ገዢ) ቤቶችን መፈለግ፣ መምረጥ እና የኪራይ/የግዢ ጥያቄዎችን በቀጥታ መላክ ይችላሉ። አዳዲስ ቤቶችን መለጠፍ የተፈቀደው ለተረጋገጡ የቤት ባለቤቶች፣ ደላላዎች እና አልሚዎች ብቻ ነው።'}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. CUSTOMER PORTAL TAB SWITCHER                          */}
        {/* ========================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'browse'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{t.customerTabBrowse || 'ቤቶችን ይከራዩ / ይግዙ'}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/20 text-[11px]">
                {filteredProperties.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'favorites'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>{t.customerTabFavorites || 'የተመረጡ ቤቶች'}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                {favorites.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'inquiries'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Clock className="w-4 h-4 text-teal-600" />
              <span>{t.customerTabInquiries || 'የእኔ ጥያቄዎች'}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">
                {inquiries.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('developers')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'developers'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Building className="w-4 h-4 text-purple-600" />
              <span>{t.customerTabDevelopers || 'የሪል እስቴት ፕሮጀክቶች'}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
                {developerProjects.length}
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. TAB CONTENT: 1. BROWSE RENT & BUY PROPERTIES           */}
        {/* ========================================================= */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Quick Customer Filter Bar */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Rent / Buy Toggle */}
              <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFilterPurpose('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterPurpose === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {isAmharic ? 'ሁሉም' : 'All'}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterPurpose('Rent')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterPurpose === 'Rent' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {isAmharic ? 'ኪራይ (Rent)' : 'Rent'}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterPurpose('Sale')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterPurpose === 'Sale' ? 'bg-amber-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {isAmharic ? 'ሽያጭ (Buy)' : 'Buy'}
                </button>
              </div>

              {/* City Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="all">{isAmharic ? 'ሁሉም ከተሞች' : 'All Cities'}</option>
                  <option value="Addis Ababa">{isAmharic ? 'አዲስ አበባ' : 'Addis Ababa'}</option>
                  <option value="Adama">{isAmharic ? 'አዳማ' : 'Adama'}</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="all">{isAmharic ? 'ሁሉም ዓይነት' : 'All Types'}</option>
                  <option value="Flat">{isAmharic ? 'አፓርታማ' : 'Apartment/Flat'}</option>
                  <option value="House">{isAmharic ? 'ቪላ / ቤት' : 'Villa / House'}</option>
                </select>
              </div>

              {/* Keyword Search */}
              <div className="flex-1 max-w-xs relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={isAmharic ? 'ቦሌ፣ ሲኤምሲ፣ ደንበላ...' : 'Bole, CMC, Dembela...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Properties Grid with Rent / Buy / Tour Action Buttons */}
            {filteredProperties.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-gray-200">
                <Home className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-900">
                  {t.noPropertiesFound || 'ምንም የተገኘ ቤት የለም'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isAmharic ? 'እባክዎ የማጣሪያ ምርጫዎችዎን ያስተካክሉ።' : 'Please adjust your filter criteria.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <div key={property._id || property.id} className="relative group bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                    <PropertyCard
                      property={property}
                      onSelect={onOpenDetails}
                      onCardClick={onOpenDetails}
                      onContact={() => handleOpenInquiryModal(property, property.purpose === 'Rent' ? 'rent' : 'buy')}
                      onToggleFavorite={onToggleFavorite}
                      isFavorite={favorites.some((f) => f.id === property.id || f.id === property._id)}
                      lang={lang}
                      t={t}
                    />

                    {/* Customer Action Bar */}
                    <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenInquiryModal(property, property.purpose === 'Rent' ? 'rent' : 'buy')}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 text-white ${
                          property.purpose === 'Rent' 
                            ? 'bg-emerald-600 hover:bg-emerald-700' 
                            : 'bg-amber-600 hover:bg-amber-700'
                        }`}
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>
                          {property.purpose === 'Rent' 
                            ? (isAmharic ? 'ይከራዩ' : 'Rent Now') 
                            : (isAmharic ? 'ይግዙ' : 'Buy Now')}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenInquiryModal(property, 'tour')}
                        className="py-2 px-3 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition-all flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>{isAmharic ? 'ጉብኝት' : 'Tour'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. TAB CONTENT: 2. SAVED FAVORITES                       */}
        {/* ========================================================= */}
        {activeTab === 'favorites' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-black text-gray-950">
                {isAmharic ? `የተመረጡ ቤቶች (${favorites.length})` : `Saved Properties (${favorites.length})`}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {isAmharic ? 'ያስቀመጧቸውን ቤቶች እዚህ ጋር ይመልከቱና በቀጥታ የኪራይ ወይም የግዢ ጥያቄ ይላኩ።' : 'Review your shortlisted homes and initiate rent or buy requests.'}
              </p>
            </div>

            {favorites.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-gray-200">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-900">
                  {isAmharic ? 'እስካሁን ምንም ቤት አልመረጡም' : 'No Favorite Properties Saved Yet'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  {isAmharic ? 'ቤቶችን በሚያስሱበት ጊዜ የልብ ቅርጽ ምልክቱን በመንካት እዚህ ማከማቸት ይችላሉ።' : 'Browse properties and tap the heart icon to save them here for quick access.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold"
                >
                  {isAmharic ? 'ቤቶችን ያስሱ' : 'Browse Properties'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((property) => (
                  <div key={property._id || property.id} className="relative group bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <PropertyCard
                      property={property}
                      onSelect={onOpenDetails}
                      onCardClick={onOpenDetails}
                      onContact={() => handleOpenInquiryModal(property, property.purpose === 'Rent' ? 'rent' : 'buy')}
                      onToggleFavorite={onToggleFavorite}
                      isFavorite={true}
                      lang={lang}
                      t={t}
                    />
                    <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenInquiryModal(property, property.purpose === 'Rent' ? 'rent' : 'buy')}
                        className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>
                          {property.purpose === 'Rent' 
                            ? (isAmharic ? 'ለመከራየት ጥያቄ ላክ' : 'Request to Rent') 
                            : (isAmharic ? 'ለመግዛት ጥያቄ ላክ' : 'Inquire to Buy')}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. TAB CONTENT: 3. MY INQUIRIES & BOOKINGS               */}
        {/* ========================================================= */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-950">
                  {isAmharic ? `የተላኩ ጥያቄዎች (${inquiries.length})` : `My Inquiries (${inquiries.length})`}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {isAmharic ? 'ለቤት ባለቤቶች፣ ደላላዎች እና አልሚዎች የላኳቸው የኪራይ፣ የግዢ እና የጉብኝት ጥያቄዎች ዝርዝር።' : 'Track your submitted rent, purchase, and property tour requests.'}
                </p>
              </div>
              <button
                type="button"
                onClick={fetchCustomerInquiries}
                className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                {isAmharic ? 'አድስ (Refresh)' : 'Refresh'}
              </button>
            </div>

            {inquiriesLoading ? (
              <div className="py-12 text-center text-xs text-gray-500">
                {isAmharic ? 'ጥያቄዎች በመጫን ላይ ናቸው...' : 'Loading inquiries...'}
              </div>
            ) : inquiries.length === 0 ? (
              <div className="p-12 text-center bg-gray-50 rounded-2xl border border-gray-200">
                <Clock className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-gray-800">
                  {t.customerInquiriesEmpty || 'እስካሁን ምንም አይነት የኪራይ ወይም የግዢ ጥያቄ አልላኩም።'}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {isAmharic ? 'የሚፈልጉትን ቤት መርጠው "ይከራዩ" ወይም "ይግዙ" የሚለውን በመጫን ጥያቄዎን በቀጥታ ያስተላልፉ።' : 'Find a home you love and click Rent or Buy to contact the lister directly.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
                >
                  {isAmharic ? 'ቤቶችን ይፈልጉ' : 'Search Homes'}
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {inquiries.map((inq, idx) => (
                  <div key={inq.id || inq._id || idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          inq.inquiryType === 'rent' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : inq.inquiryType === 'buy'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {inq.inquiryType === 'rent' ? 'ኪራይ (Rent)' : inq.inquiryType === 'buy' ? 'ግዢ (Buy)' : 'ጉብኝት (Tour)'}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900">
                          {inq.propertyTitle || 'የቀዳሚ ቤት (Residential Property)'}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 italic">
                        "{inq.message}"
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2">
                        <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{inq.phone}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {isAmharic ? 'ተልኳል (Delivered to Lister)' : 'Delivered to Lister'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. TAB CONTENT: 4. REAL ESTATE DEVELOPERS                 */}
        {/* ========================================================= */}
        {activeTab === 'developers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-950">
                {isAmharic ? 'የኢትዮጵያ ታላላቅ ሪል እስቴት አልሚዎች' : 'Ethiopia Top Real Estate Developers'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {isAmharic ? 'እንደ አያት፣ ፀሐይ፣ ኖህ እና ፍሊንትስቶን ያሉ ታዋቂ አልሚዎች የሚያቀርቧቸውን ሜጋ የመኖሪያ ፕሮጀክቶች በቀጥታ ይመርምሩ።' : 'Explore major residential mega projects by Ayat, Tsehay, Noah, and Flintstone Homes.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {developerProjects.map((dev) => (
                <div key={dev.id || dev._id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img 
                      src={dev.image} 
                      alt={dev.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-purple-600/90 text-white text-[11px] font-black uppercase">
                      {dev.developer}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-950">
                        {isAmharic ? dev.name_am || dev.name : dev.name}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{dev.location}</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-3 line-clamp-2">
                        {isAmharic ? dev.desc_am || dev.description : dev.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block">{isAmharic ? 'አጠቃላይ ቤቶች' : 'Total Units'}</span>
                        <span className="font-bold text-gray-900">{dev.totalUnits} Units</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block">{isAmharic ? 'ርክክብ' : 'Handover'}</span>
                        <span className="font-bold text-purple-700">{dev.handoverYear}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 7. QUICK INQUIRY / TOUR MODAL DIALOG                      */}
        {/* ========================================================= */}
        {selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setSelectedProperty(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  inquiryType === 'rent'
                    ? 'bg-emerald-100 text-emerald-800'
                    : inquiryType === 'buy'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-teal-100 text-teal-800'
                }`}>
                  {inquiryType === 'rent' ? 'የኪራይ ጥያቄ (Rent Request)' : inquiryType === 'buy' ? 'የግዢ ጥያቄ (Buy Request)' : 'የጉብኝት ቀጠሮ (Tour Schedule)'}
                </span>
                <h3 className="text-xl font-extrabold text-gray-950 mt-2">
                  {isAmharic ? selectedProperty.title_am || selectedProperty.title : selectedProperty.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{selectedProperty.locality}, {selectedProperty.city}</span>
                  <span>•</span>
                  <span className="font-bold text-gray-900">{selectedProperty.price}</span>
                </p>
              </div>

              {inquirySuccessMsg && (
                <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <span>{inquirySuccessMsg}</span>
                </div>
              )}

              {inquiryErrorMsg && (
                <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                  <span>{inquiryErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                {/* Request Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isAmharic ? 'የጥያቄ ዓይነት' : 'Request Type'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setInquiryType('rent')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        inquiryType === 'rent' 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-black' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {isAmharic ? 'ኪራይ (Rent)' : 'Rent'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryType('buy')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        inquiryType === 'buy' 
                          ? 'bg-amber-50 border-amber-500 text-amber-800 font-black' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {isAmharic ? 'ግዢ (Buy)' : 'Buy'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryType('tour')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        inquiryType === 'tour' 
                          ? 'bg-teal-50 border-teal-500 text-teal-800 font-black' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {isAmharic ? 'ጉብኝት (Tour)' : 'Tour'}
                    </button>
                  </div>
                </div>

                {/* Tour Date (if tour selected) */}
                {inquiryType === 'tour' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isAmharic ? 'ለመጎብኘት የሚመርጡት ቀን' : 'Preferred Visit Date'}
                    </label>
                    <input
                      type="date"
                      value={tourDate}
                      onChange={(e) => setTourDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                )}

                {/* Contact Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isAmharic ? 'ስልክ ቁጥርዎ' : 'Your Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+251 911 000000"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isAmharic ? 'መልእክት ወይም ጥያቄ' : 'Message or Special Requests'}
                  </label>
                  <textarea
                    rows={3}
                    value={customerMessage}
                    onChange={(e) => setCustomerMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProperty(null)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    {isAmharic ? 'ሰርዝ' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {submittingInquiry 
                        ? (isAmharic ? 'በመላክ ላይ...' : 'Sending...') 
                        : (isAmharic ? 'ጥያቄዬን ላክ' : 'Send Request')}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
