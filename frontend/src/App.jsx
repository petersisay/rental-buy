import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import RoleNavigation from './components/RoleNavigation';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import HeroSearch from './components/HeroSearch';
import PropertyCard from './components/PropertyCard';
import PropertyModal from './components/PropertyModal';
import FavoritesDrawer from './components/FavoritesDrawer';
import OwnerPortal from './components/OwnerPortal';
import AgentPortal from './components/AgentPortal';
import DeveloperPortal from './components/DeveloperPortal';
import AdminPortal from './components/AdminPortal';
import CustomerPortal from './components/CustomerPortal';
import Footer from './components/Footer';
import { translations } from './locales/translations';
import { RefreshCw, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function App() {
  // Logged-in User State (Persisted in localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kedami_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Active Portal/Page State: default is 'landing' (First Landing Page view)
  const [activePortal, setActivePortal] = useState('landing');
  const [loginOptions, setLoginOptions] = useState({ role: 'seeker', mode: 'login' });

  // Language State: Amharic ('am') or English ('en')
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('kedami_lang') || 'am';
    } catch {
      return 'am';
    }
  });

  const t = translations[lang] || translations.am;

  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === 'am' ? 'en' : 'am';
      try {
        localStorage.setItem('kedami_lang', next);
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Safe Navigation Handler that enforces login for role-protected pages
  const handleNavigate = (portal, options = {}) => {
    if (portal === 'login') {
      setLoginOptions({
        role: options.role || 'seeker',
        mode: options.mode || 'login'
      });
      setActivePortal('login');
      return;
    }

    // Role-protected pages require authentication
    const protectedPortals = ['owners', 'agents', 'developers', 'admin', 'profile', 'customer'];
    if (!currentUser && protectedPortals.includes(portal)) {
      // Map portal to requested role
      let targetRole = 'customer';
      if (portal === 'owners') targetRole = 'owner';
      if (portal === 'agents') targetRole = 'agent';
      if (portal === 'developers') targetRole = 'developer';
      if (portal === 'admin') targetRole = 'admin';
      if (portal === 'customer') targetRole = 'customer';

      setLoginOptions({ role: targetRole, mode: 'login' });
      setActivePortal('login');
      return;
    }

    setActivePortal(portal);
  };

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('kedami_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }

    // Role-based render after login:
    // Render the user's role page immediately
    if (user.role === 'admin') {
      setActivePortal('admin');
    } else if (user.role === 'owner') {
      setActivePortal('owners');
    } else if (user.role === 'agent') {
      setActivePortal('agents');
    } else if (user.role === 'developer') {
      setActivePortal('developers');
    } else {
      setActivePortal('customer');
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('kedami_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('kedami_user');
    } catch (e) {
      console.error(e);
    }
    setActivePortal('landing');
  };

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [filters, setFilters] = useState({
    purpose: 'buy',
    city: '',
    property_type: '',
    min_price: null,
    max_price: null,
    bhk: null,
    search: ''
  });

  // Modal & Drawer State
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [initialContactMode, setInitialContactMode] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Favorites (Bookmarks) State
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('kedami_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kedami_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  // Fetch properties from Express MERN API
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      if (filters.city) params.append('city', filters.city);
      if (filters.purpose) params.append('purpose', filters.purpose);
      if (filters.property_type) params.append('property_type', filters.property_type);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);
      if (filters.bhk) params.append('bhk', filters.bhk);
      if (filters.search) params.append('search', filters.search);

      // When viewing Admin Portal, request all properties including pending/rejected
      if (activePortal === 'admin') {
        params.append('status', 'all');
      }

      const res = await fetch(`${API_BASE}/api/properties?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(
        lang === 'am'
          ? 'የቤቶች መረጃን ከመረጃ ቋት (Backend) ማምጣት አልተቻለም። እባክዎ ሰርቨሩ በፖርት 8000 እየሰራ መሆኑን ያረጋግጡ።'
          : 'Unable to connect to the backend server. Please make sure the Express API is running on port 8000.'
      );
    } finally {
      setLoading(false);
    }
  }, [filters, activePortal, lang]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Handler: Add property
  const handleAddProperty = async (propertyData) => {
    const res = await fetch(`${API_BASE}/api/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to submit property');
    }

    // Refresh property list
    fetchProperties();
  };

  // Handler: Update property verification status (Approve / Reject)
  const handleUpdateStatus = async (propertyId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/properties/${propertyId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      fetchProperties();
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  // Handler: Delete property
  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm(lang === 'am' ? 'ይህን ቤት መሰረዝ ይፈልጋሉ?' : 'Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/properties/${propertyId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Failed to delete property');
      }

      fetchProperties();
    } catch (err) {
      alert(err.message || 'Error deleting property');
    }
  };

  // Toggle favorite bookmark
  const toggleFavorite = (property) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === property.id || p.id === property._id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id && p.id !== property._id);
      } else {
        return [...prev, property];
      }
    });
  };

  const removeFavorite = (propertyId) => {
    setFavorites((prev) => prev.filter((p) => p.id !== propertyId && p._id !== propertyId));
  };

  const handleCityChange = (newCity) => {
    setFilters((prev) => ({ ...prev, city: newCity }));
  };

  const handleFilterChange = (partial) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleQuickSearchSubmit = (quickParams) => {
    setFilters((prev) => ({
      ...prev,
      city: quickParams.city !== undefined ? quickParams.city : prev.city,
      purpose: quickParams.purpose !== undefined ? quickParams.purpose : prev.purpose,
      property_type: quickParams.property_type !== undefined ? quickParams.property_type : prev.property_type,
      search: quickParams.search !== undefined ? quickParams.search : prev.search
    }));
  };

  const handleFilterLocality = (targetCity, targetLocality) => {
    setFilters((prev) => ({
      ...prev,
      city: targetCity,
      search: targetLocality
    }));
    setActivePortal('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pendingCount = properties.filter((p) => p.status === 'pending').length;

  return (
    <div className="app-container min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Primary Navigation Bar */}
      <Navbar
        city={filters.city}
        onCityChange={handleCityChange}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        lang={lang}
        onToggleLang={toggleLanguage}
        t={t}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />

      {/* Role Navigation Switcher:
          ONLY RENDERED AFTER USER LOGS IN!
          Completely hidden when visitor is on the Landing Page or guest! */}
      {currentUser && (
        <RoleNavigation
          activeTab={activePortal}
          onSelectTab={handleNavigate}
          currentUser={currentUser}
          pendingCount={pendingCount}
          lang={lang}
          t={t}
        />
      )}

      {/* ========================================================= */}
      {/* CONDITIONAL PORTAL VIEWS                                 */}
      {/* ========================================================= */}

      {/* 1. Landing Page (First View for Guests) */}
      {activePortal === 'landing' && (
        <LandingPage
          t={t}
          lang={lang}
          onNavigate={handleNavigate}
          onSearchSubmit={handleQuickSearchSubmit}
          currentUser={currentUser}
        />
      )}

      {/* 2. Login & Sign Up Page */}
      {activePortal === 'login' && (
        <LoginPage
          t={t}
          lang={lang}
          onLoginSuccess={handleLoginSuccess}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          initialRole={loginOptions.role}
          initialMode={loginOptions.mode}
        />
      )}

      {/* 3. User Profile Page */}
      {activePortal === 'profile' && currentUser && (
        <ProfilePage
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          properties={properties}
          favorites={favorites}
          lang={lang}
          t={t}
          apiBase={API_BASE}
        />
      )}

      {/* 4. Dedicated Customer Portal (Rent & Buy, Tour Booking, Inquiries, Favorites) */}
      {activePortal === 'customer' && (
        <CustomerPortal
          properties={properties}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onOpenDetails={setSelectedProperty}
          currentUser={currentUser}
          onNavigate={handleNavigate}
          lang={lang}
          t={t}
          apiBase={API_BASE}
        />
      )}

      {/* 5. Main Search & Property Browsing View */}
      {activePortal === 'search' && (
        <>
          <HeroSearch
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={fetchProperties}
            totalResults={properties.length}
            lang={lang}
            t={t}
          />

          <main className="main-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
            <div className="results-header flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-200 gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  {properties.length}{' '}
                  {filters.purpose === 'buy' ? t.resultsCountSuffixBuy : t.resultsCountSuffixRent}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  {t.resultsSubtitle}
                </p>
              </div>

              {(filters.city || filters.property_type || filters.bhk || filters.min_price || filters.max_price || filters.search) && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors w-fit"
                  onClick={() =>
                    setFilters({
                      purpose: filters.purpose,
                      city: '',
                      property_type: '',
                      min_price: null,
                      max_price: null,
                      bhk: null,
                      search: ''
                    })
                  }
                >
                  <RefreshCw size={13} />
                  <span>{t.clearAllFilters}</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                <RefreshCw size={36} className="animate-spin text-emerald-600 mb-3" />
                <p className="font-semibold text-sm">{t.searching}</p>
              </div>
            ) : error ? (
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-center max-w-lg mx-auto">
                <AlertCircle size={36} className="mx-auto mb-2 text-rose-600" />
                <p className="font-bold text-sm">{error}</p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-sm"
                  onClick={fetchProperties}
                >
                  Retry Connection
                </button>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-lg mx-auto">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t.noPropertiesFound}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">{t.noPropertiesDesc}</p>
                <button
                  type="button"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  onClick={() =>
                    setFilters({
                      purpose: 'buy',
                      city: '',
                      property_type: '',
                      min_price: null,
                      max_price: null,
                      bhk: null,
                      search: ''
                    })
                  }
                >
                  {t.btnResetFilters}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((prop) => (
                  <PropertyCard
                    key={prop.id || prop._id}
                    property={prop}
                    isFavorite={favorites.some((f) => f.id === prop.id || f.id === prop._id)}
                    onToggleFavorite={toggleFavorite}
                    onSelect={(p) => {
                      setSelectedProperty(p);
                      setInitialContactMode(false);
                    }}
                    onContact={(p) => {
                      setSelectedProperty(p);
                      setInitialContactMode(true);
                    }}
                    lang={lang}
                    t={t}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {/* 5. Property Owners Portal View */}
      {activePortal === 'owners' && (
        <OwnerPortal
          properties={properties}
          onAddProperty={handleAddProperty}
          onDeleteProperty={handleDeleteProperty}
          lang={lang}
          t={t}
          currentUser={currentUser}
        />
      )}

      {/* 6. Agents & Brokers Portal View */}
      {activePortal === 'agents' && (
        <AgentPortal
          properties={properties}
          onAddProperty={handleAddProperty}
          onDeleteProperty={handleDeleteProperty}
          lang={lang}
          t={t}
          apiBase={API_BASE}
          currentUser={currentUser}
        />
      )}

      {/* 7. Builders & Developers Portal View */}
      {activePortal === 'developers' && (
        <DeveloperPortal
          lang={lang}
          t={t}
          apiBase={API_BASE}
          currentUser={currentUser}
        />
      )}

      {/* 8. Platform Administrators Portal View */}
      {activePortal === 'admin' && (
        <AdminPortal
          properties={properties}
          onUpdateStatus={handleUpdateStatus}
          onDeleteProperty={handleDeleteProperty}
          lang={lang}
          t={t}
          apiBase={API_BASE}
        />
      )}

      {/* Property Details & Contact Modal */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          initialContactMode={initialContactMode}
          lang={lang}
          t={t}
        />
      )}

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={removeFavorite}
        onSelectProperty={(p) => setSelectedProperty(p)}
        lang={lang}
        t={t}
      />

      {/* Interactive Responsive Footer (Every Item is an Actionable Link) */}
      <Footer
        lang={lang}
        t={t}
        onNavigate={handleNavigate}
        onFilterLocality={handleFilterLocality}
      />
    </div>
  );
}
