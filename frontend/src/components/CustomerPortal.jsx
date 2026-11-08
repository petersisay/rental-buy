import React, { useState, useEffect } from 'react';
import { 
  Home, Key, Heart, Search, CheckCircle2, 
  MapPin, Clock, Calendar, Mail, Phone, User, 
  AlertCircle, Building, Building2, Send, Filter,
  ExternalLink, Sparkles, ShieldCheck, ChevronRight
} from 'lucide-react';
import PropertyCard from './PropertyCard';

export default function CustomerPortal({
  currentUser,
  properties,
  favorites,
  onToggleFavorite,
  onViewProperty,
  lang,
  t,
  apiBase
}) {
  const isAmharic = lang === 'am';
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'applications' | 'favorites' | 'projects'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [listingType, setListingType] = useState('all'); // 'all' | 'rent' | 'buy'
  const [propertyType, setPropertyType] = useState('all'); // 'all' | 'flat' | 'house'

  // Application / Booking Modal State
  const [bookingProperty, setBookingProperty] = useState(null);
  const [bookingType, setBookingType] = useState('rent'); // 'rent' | 'buy'
  const [bookingDate, setBookingDate] = useState('');
  const [bookingPhone, setBookingPhone] = useState(currentUser?.phone || '+251 9');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Customer Inquiries state
  const [myInquiries, setMyInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Developer projects
  const [developerProjects, setDeveloperProjects] = useState([]);

  // Fetch inquiries for this customer
  const fetchMyInquiries = async () => {
    if (!currentUser?.email) return;
    setLoadingInquiries(true);
    try {
      const res = await fetch(`${apiBase}/api/contact?email=${encodeURIComponent(currentUser.email)}`);
      if (res.ok) {
        const data = await res.json();
        setMyInquiries(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to fetch customer inquiries:', e);
    } finally {
      setLoadingInquiries(false);
    }
  };

  // Fetch developer projects
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${apiBase}/api/developer-projects`);
      if (res.ok) {
        const data = await res.json();
        setDeveloperProjects(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to fetch developer projects:', e);
    }
  };

  useEffect(() => {
    fetchMyInquiries();
    fetchProjects();
  }, [currentUser]);

  // Handle direct Rent/Buy click from cards
  const handleOpenBooking = (property, type = 'rent') => {
    setBookingProperty(property);
    setBookingType(type);
    setBookingSuccess(false);
    setBookingMessage(
      isAmharic 
        ? `ሰላም፣ ይህንን ${property.title_am || property.title} ${type === 'rent' ? 'መከራየት' : 'መግዛት'} እፈልጋለሁ። እባክዎ ተጨማሪ መረጃና የጉብኝት ሰዓት ይንገሩኝ።`
        : `Hello, I am interested in ${type === 'rent' ? 'renting' : 'purchasing'} this property: ${property.title}. Please provide viewing availability.`
    );
  };

  // Submit Rent / Buy Application
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!bookingProperty || !currentUser) return;
    setBookingSubmitting(true);

    try {
      const targetId = bookingProperty.id || bookingProperty._id;
      const res = await fetch(`${apiBase}/api/properties/${targetId}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentUser.name || 'Customer',
          email: currentUser.email,
          phone: bookingPhone,
          type: bookingType,
          property_title: isAmharic ? (bookingProperty.title_am || bookingProperty.title) : bookingProperty.title,
          city: bookingProperty.city,
          price: bookingProperty.price,
          message: `${bookingMessage} [የታሰበበት ቀን: ${bookingDate || 'አስቸኳይ'}]`
        })
      });

      if (res.ok) {
        setBookingSuccess(true);
        fetchMyInquiries();
        setTimeout(() => {
          setBookingProperty(null);
          setBookingSuccess(false);
        }, 2200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Filter Properties
  const filteredProperties = properties.filter((p) => {
    // Only approved properties for customer
    if (p.status && p.status !== 'approved') return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (p.title || '').toLowerCase().includes(q) || (p.title_am || '').toLowerCase().includes(q);
      const matchLoc = (p.locality || '').toLowerCase().includes(q) || (p.locality_am || '').toLowerCase().includes(q);
      if (!matchTitle && !matchLoc) return false;
    }

    // City
    if (selectedCity !== 'all' && p.city !== selectedCity) return false;

    // Listing Type (rent vs buy)
    if (listingType !== 'all' && p.listing_type !== listingType) return false;

    // Property Type (flat vs house)
    if (propertyType !== 'all' && p.property_type !== propertyType) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* ========================================================= */}
      {/* 1. CUSTOMER WELCOME BANNER                                */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>{isAmharic ? 'የተረጋገጠ ደንበኛ (Verified Customer)' : 'Verified Customer Profile'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{isAmharic ? `እንኳን ደህና መጡ፣ ${currentUser?.name || 'ደንበኛ'}!` : `Welcome, ${currentUser?.name || 'Customer'}!`}</span>
                <span className="text-amber-400">👋</span>
              </h1>
              <p className="mt-1 text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
                {t.customerSubtitle}
              </p>
            </div>

            {/* Quick Metrics Header */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-center min-w-[100px]">
                <span className="block text-2xl font-black text-amber-400">{filteredProperties.length}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">
                  {isAmharic ? 'የሚገኙ ቤቶች' : 'Live Homes'}
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-center min-w-[100px]">
                <span className="block text-2xl font-black text-emerald-300">{myInquiries.length}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">
                  {isAmharic ? 'ማመልከቻዎች' : 'Inquiries'}
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-center min-w-[100px]">
                <span className="block text-2xl font-black text-rose-300">{favorites.length}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">
                  {isAmharic ? 'የተመረጡ' : 'Favorites'}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Privilege Note: Cannot post properties, but has direct buy/rent power */}
          <div className="mt-6 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-200">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              {t.customerNoAddNotice}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. TAB NAVIGATION                                         */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-1.5 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('browse')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'browse'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{t.customerTabBrowse}</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
              {filteredProperties.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'applications'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{t.customerTabInquiries}</span>
            {myInquiries.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-gray-950 font-black">
                {myInquiries.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'favorites'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>{t.customerTabFavorites}</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
              {favorites.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'projects'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-500" />
            <span>{t.customerTabProjects}</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
              {developerProjects.length || 4}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. TAB 1: BROWSE & DIRECT RENT / BUY                      */}
      {/* ========================================================= */}
      {activeTab === 'browse' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Quick Filter Strip */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Keyword Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={isAmharic ? 'ቦታ፣ ሰፈር፣ ወይም የቤት ስም...' : 'Search locality, building...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Listing Type: All, Rent, Buy */}
              <div className="flex rounded-xl bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setListingType('all')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    listingType === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
                  }`}
                >
                  {isAmharic ? 'ሁሉንም' : 'All'}
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('rent')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    listingType === 'rent' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-500'
                  }`}
                >
                  {isAmharic ? 'የሚከራዩ' : 'To Rent'}
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('buy')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    listingType === 'buy' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-500'
                  }`}
                >
                  {isAmharic ? 'የሚሸጡ' : 'To Buy'}
                </button>
              </div>

              {/* City Filter */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full py-2 px-3 text-xs font-bold rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">{isAmharic ? 'ሁሉም ከተሞች (Addis & Adama)' : 'All Cities'}</option>
                <option value="Addis Ababa">{isAmharic ? 'አዲስ አበባ (Addis Ababa)' : 'Addis Ababa'}</option>
                <option value="Adama">{isAmharic ? 'አዳማ (Adama)' : 'Adama'}</option>
              </select>

              {/* Property Type Filter */}
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full py-2 px-3 text-xs font-bold rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">{isAmharic ? 'ሁሉም የቤት አይነቶች' : 'All Property Types'}</option>
                <option value="flat">{isAmharic ? 'አፓርታማ / ፎቅ' : 'Flat / Apartment'}</option>
                <option value="house">{isAmharic ? 'ቪላ / መኖሪያ ቤት' : 'Villa / House'}</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
              <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900">{t.noPropertiesFound}</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">{t.noPropertiesDesc}</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCity('all'); setListingType('all'); setPropertyType('all'); }}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                {t.btnResetFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => {
                const propId = property.id || property._id;
                const isFavorite = favorites.some((f) => f.id === propId || f._id === propId);
                const isRent = property.listing_type === 'rent';

                return (
                  <div key={propId} className="relative group bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col">
                    {/* Render existing PropertyCard header & gallery */}
                    <PropertyCard
                      property={property}
                      lang={lang}
                      t={t}
                      isFavorite={isFavorite}
                      onToggleFavorite={onToggleFavorite}
                      onViewDetails={onViewProperty}
                      onContactAgent={onViewProperty}
                    />

                    {/* Customer Action Bar: Direct Rent or Buy Buttons */}
                    <div className="p-4 bg-slate-50 border-t border-gray-100 flex items-center gap-2 mt-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(property, isRent ? 'rent' : 'buy')}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                          isRent 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                        }`}
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>{isRent ? (isAmharic ? 'አሁን ይከራዩ' : 'Rent Now') : (isAmharic ? 'አሁን ይግዙ' : 'Buy Now')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewProperty(property)}
                        className="py-2.5 px-3.5 rounded-xl font-bold text-xs bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors"
                      >
                        {t.btnViewDetails}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. TAB 2: MY RENT & BUY APPLICATIONS                      */}
      {/* ========================================================= */}
      {activeTab === 'applications' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-600" />
                  <span>{t.customerTabInquiries}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {isAmharic 
                    ? 'ለባለቤቶች እና ለወኪሎች ያስገቧቸው የኪራይና የግዢ ማመልከቻዎች ዝርዝር።' 
                    : 'Track your submitted property applications, viewings, and rental inquiries.'}
                </p>
              </div>
              <button
                type="button"
                onClick={fetchMyInquiries}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                {isAmharic ? 'አድስ (Refresh)' : 'Refresh'}
              </button>
            </div>

            {loadingInquiries ? (
              <div className="py-12 text-center text-xs text-gray-500">
                {isAmharic ? 'ማመልከቻዎች በመጫን ላይ...' : 'Loading your inquiries...'}
              </div>
            ) : myInquiries.length === 0 ? (
              <div className="py-12 text-center">
                <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-900">
                  {isAmharic ? 'እስካሁን ምንም ማመልከቻ አላስገቡም' : 'No applications submitted yet'}
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  {isAmharic 
                    ? 'የሚፈልጉትን ቤት ከዝርዝሩ ውስጥ መርጠው "አሁን ይከራዩ" ወይም "አሁን ይግዙ" የሚለውን በመጫን ማመልከት ይችላሉ።' 
                    : 'Explore the property catalog and tap "Rent Now" or "Buy Now" to contact landlords directly.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className="mt-4 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                >
                  {isAmharic ? 'ቤቶችን ያስሱ' : 'Browse Properties'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myInquiries.map((inq, idx) => (
                  <div key={inq.id || inq._id || idx} className="p-4 rounded-2xl bg-slate-50 border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          inq.type === 'buy' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {inq.type === 'buy' ? (isAmharic ? 'የግዢ ጥያቄ' : 'Buy Inquiry') : (isAmharic ? 'የኪራይ ጥያቄ' : 'Rent Application')}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(inq.createdAt).toLocaleDateString(isAmharic ? 'am-ET' : 'en-US')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">
                        {inq.property_title || 'Residential Property'}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 max-w-xl">
                        {inq.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{isAmharic ? 'በሂደት ላይ (Sent)' : 'Sent / In Review'}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. TAB 3: SAVED FAVORITES                                 */}
      {/* ========================================================= */}
      {activeTab === 'favorites' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {favorites.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900">
                {isAmharic ? 'ምንም የተመረጡ ቤቶች የሉም' : 'No saved properties yet'}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                {isAmharic 
                  ? 'ቤቶችን በሚያሱሱበት ወቅት የልብ ቅርጽ ምልክቷን በመጫን ወደዚህ ማስቀመጥ ይችላሉ።' 
                  : 'Bookmark apartments and villas while browsing to easily compare and contact owners.'}
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className="mt-4 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                {isAmharic ? 'ቤቶችን ያስሱ' : 'Browse Properties'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((property) => {
                const propId = property.id || property._id;
                const isRent = property.listing_type === 'rent';

                return (
                  <div key={propId} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs flex flex-col">
                    <PropertyCard
                      property={property}
                      lang={lang}
                      t={t}
                      isFavorite={true}
                      onToggleFavorite={onToggleFavorite}
                      onViewDetails={onViewProperty}
                      onContactAgent={onViewProperty}
                    />
                    <div className="p-4 bg-slate-50 border-t border-gray-100 flex items-center gap-2 mt-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(property, isRent ? 'rent' : 'buy')}
                        className="flex-1 py-2.5 px-3 rounded-xl font-black text-xs bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>{isRent ? (isAmharic ? 'አሁን ይከራዩ' : 'Rent Now') : (isAmharic ? 'አሁን ይግዙ' : 'Buy Now')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. TAB 4: DEVELOPER MEGA PROJECTS (AYAT, NOAH, TSEHAY)     */}
      {/* ========================================================= */}
      {activeTab === 'projects' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(developerProjects.length > 0 ? developerProjects : [
              {
                id: 'p-1',
                name: 'Ayat Residential Village 4 (አያት የመኖሪያ መንደር)',
                developer: 'Ayat Real Estate (አያት ሪል እስቴት)',
                locality: 'Ayat Zone 5, Addis Ababa',
                units: 420,
                handover: '2026',
                priceRange: '6,500,000 - 18,000,000 ETB',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
                desc: 'Luxury apartments and townhouses with dedicated commercial centers, schools, and green parks.'
              },
              {
                id: 'p-2',
                name: 'Tsehay Real Estate Towers (የፀሐይ ሪል እስቴት ታወርስ)',
                developer: 'Tsehay Real Estate',
                locality: 'CMC Road, Addis Ababa',
                units: 640,
                handover: '2025/2026',
                priceRange: '8,200,000 - 24,000,000 ETB',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
                desc: 'Modern high-rise residential complex with subterranean parking, gym, and 24/7 power backup.'
              },
              {
                id: 'p-3',
                name: 'Noah Garden Residences (ኖህ ጋርደን ሬሲደንሲስ)',
                developer: 'Noah Real Estate',
                locality: 'Bole Atlas, Addis Ababa',
                units: 280,
                handover: '2026',
                priceRange: '11,000,000 - 32,000,000 ETB',
                image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
                desc: 'Prime diplomat apartments with panoramic balcony views, European finishes, and gated security.'
              },
              {
                id: 'p-4',
                name: 'Flintstone Adama Green City (ፍሊንትስቶን አዳማ ግሪን ሲቲ)',
                developer: 'Flintstone Homes',
                locality: 'Wonji Road, Adama',
                units: 350,
                handover: '2026',
                priceRange: '4,800,000 - 12,500,000 ETB',
                image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
                desc: 'Affordable modern family residences in Adama with solar lighting and ample garden courts.'
              }
            ]).map((proj) => (
              <div key={proj.id || proj._id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={proj.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-black">
                    {proj.developer}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-black text-gray-900 mb-1">{proj.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{proj.locality}</span>
                  </div>

                  <p className="text-xs text-gray-600 mb-4 leading-relaxed line-clamp-2">
                    {proj.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">{isAmharic ? 'የቤቶች ብዛት' : 'Total Units'}</span>
                      <span className="font-extrabold text-gray-900">{proj.units || '300+'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">{isAmharic ? 'ርክክብ' : 'Handover'}</span>
                      <span className="font-extrabold text-emerald-700">{proj.handover || '2026'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setBookingProperty({
                        id: proj.id || 'dev-proj',
                        title: proj.name,
                        city: proj.locality.includes('Adama') ? 'Adama' : 'Addis Ababa',
                        price: proj.priceRange || '6,500,000 ETB'
                      });
                      setBookingType('buy');
                      setBookingMessage(
                        isAmharic 
                          ? `ሰላም፣ የ ${proj.name} ፕሮጀክት ዝርዝር መረጃና ዋጋዎችን ማወቅ እፈልጋለሁ።` 
                          : `Hello, I am interested in off-plan units for ${proj.name}. Please contact me.`
                      );
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>{isAmharic ? 'የፕሮጀክት መረጃ ይጠይቁ' : 'Inquire for Developer Units'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. DIRECT RENT / BUY APPLICATION MODAL                    */}
      {/* ========================================================= */}
      {bookingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            {bookingSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  {isAmharic ? 'ማመልከቻዎ ደርሷል!' : 'Application Submitted!'}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {t.customerApplySuccess}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {bookingType === 'rent' ? (isAmharic ? 'የኪራይ ማመልከቻ' : 'Rent Application') : (isAmharic ? 'የግዢ ማመልከቻ' : 'Purchase Offer')}
                    </span>
                    <h3 className="text-lg font-black text-gray-900 mt-1">
                      {bookingProperty.title_am || bookingProperty.title}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{bookingProperty.city}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBookingProperty(null)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      {isAmharic ? 'የእርስዎ ስልክ ቁጥር:' : 'Contact Phone Number:'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      {bookingType === 'rent' 
                        ? (isAmharic ? 'የመግቢያ የታሰበበት ቀን:' : 'Target Move-in Date:') 
                        : (isAmharic ? 'የግዢ ፍላጎት ሁኔታ:' : 'Purchase Timeline:')}
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      {isAmharic ? 'ለባለቤቱ ወይም ለወኪሉ ተጨማሪ መልእክት:' : 'Note for Property Owner / Agent:'}
                    </label>
                    <textarea
                      rows={3}
                      value={bookingMessage}
                      onChange={(e) => setBookingMessage(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingProperty(null)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    {isAmharic ? 'ይቅር' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{bookingSubmitting ? (isAmharic ? 'በመላክ ላይ...' : 'Submitting...') : (isAmharic ? 'ማመልከቻውን ላክ' : 'Submit Application')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
