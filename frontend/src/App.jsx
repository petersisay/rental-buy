import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import PropertyCard from './components/PropertyCard';
import PropertyModal from './components/PropertyModal';
import FavoritesDrawer from './components/FavoritesDrawer';
import { translations } from './locales/translations';
import { RefreshCw, AlertCircle } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

export default function App() {
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

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [filters, setFilters] = useState({
    purpose: 'buy', // default to buy
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
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('kedami_shortlisted');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kedami_shortlisted', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const toggleFavorite = (property) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      } else {
        return [...prev, property];
      }
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  // Fetch properties from FastAPI backend
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.purpose) queryParams.append('purpose', filters.purpose);
    if (filters.property_type) queryParams.append('property_type', filters.property_type);
    if (filters.min_price !== null && filters.min_price !== undefined) queryParams.append('min_price', filters.min_price);
    if (filters.max_price !== null && filters.max_price !== undefined) queryParams.append('max_price', filters.max_price);
    if (filters.bhk !== null && filters.bhk !== undefined) queryParams.append('bhk', filters.bhk);
    if (filters.search) queryParams.append('search', filters.search);

    try {
      const res = await fetch(`${API_BASE}/api/properties?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch properties (${res.status} ${res.statusText})`);
      }
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      setError(err.message || 'Unable to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial fetch and fetch when filters change
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      purpose: 'buy',
      city: '',
      property_type: '',
      min_price: null,
      max_price: null,
      bhk: null,
      search: ''
    });
  };

  const getCityDisplayName = (cityName) => {
    if (!cityName) return t.allCities;
    if (cityName === 'Addis Ababa') return t.addisAbaba;
    if (cityName === 'Adama') return t.adama;
    return cityName;
  };

  return (
    <div className="app">
      <Navbar
        city={filters.city}
        onCityChange={(city) => updateFilters({ city })}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        lang={lang}
        onToggleLang={toggleLanguage}
        t={t}
      />

      <HeroSearch
        filters={filters}
        onFilterChange={updateFilters}
        onSearch={fetchProperties}
        onReset={resetFilters}
        lang={lang}
        t={t}
      />

      <main className="main-container">
        {/* Results Header */}
        <div className="results-header">
          <div>
            <h2 className="results-count">
              <span>{properties.length}</span> {filters.purpose === 'rent' ? t.resultsCountSuffixRent : t.resultsCountSuffixBuy} ({getCityDisplayName(filters.city)})
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              {t.resultsSubtitle}
            </p>
          </div>

          <div className="filter-tags">
            {filters.city && (
              <span className="filter-tag">
                {t.labelCity}: {getCityDisplayName(filters.city)}
                <button onClick={() => updateFilters({ city: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </span>
            )}
            {filters.property_type && (
              <span className="filter-tag">
                {t.labelType}: {filters.property_type === 'flat' ? t.typeFlat : t.typeHouse}
                <button onClick={() => updateFilters({ property_type: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </span>
            )}
            {filters.bhk && (
              <span className="filter-tag">
                {filters.bhk} {t.bedsCount}
                <button onClick={() => updateFilters({ bhk: null })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </span>
            )}
            {(filters.min_price || filters.max_price) && (
              <span className="filter-tag">
                {t.labelBudget}
                <button onClick={() => updateFilters({ min_price: null, max_price: null })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </span>
            )}
            {filters.search && (
              <span className="filter-tag">
                "{filters.search}"
                <button onClick={() => updateFilters({ search: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </span>
            )}

            {(filters.city || filters.property_type || filters.bhk || filters.min_price || filters.max_price || filters.search) && (
              <button className="btn-clear-filters" onClick={resetFilters}>
                {t.clearAllFilters}
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <RefreshCw size={36} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: 600 }}>
              {t.searching}
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '2rem', borderRadius: '12px', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
            <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ color: '#991b1b', fontWeight: 700 }}>Connection Notice</h3>
            <p style={{ color: '#7f1d1d', marginTop: '0.4rem', fontSize: '0.9rem' }}>{error}</p>
            <button
              onClick={fetchProperties}
              style={{ marginTop: '1rem', background: 'var(--primary)', color: 'white', border: 'none', padding: '0.55rem 1.25rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
            >
              Retry Search
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !error && properties.length > 0 && (
          <div className="properties-grid">
            {properties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                isFavorite={favorites.some((f) => f.id === prop.id)}
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

        {/* Empty State */}
        {!loading && !error && properties.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🏠</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>
              {t.noPropertiesFound}
            </h3>
            <p style={{ color: '#64748b', maxWidth: '480px', margin: '0.5rem auto 1.5rem', fontSize: '0.95rem' }}>
              {t.noPropertiesDesc}
            </p>
            <button className="btn-search-main" style={{ maxWidth: '240px', margin: '0 auto' }} onClick={resetFilters}>
              {t.btnResetFilters}
            </button>
          </div>
        )}
      </main>

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

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div className="logo-badge">ቀዳሚ</div>
              <h3 style={{ margin: 0 }}>{lang === 'am' ? 'ቀዳሚ' : 'kedami'}</h3>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
              {t.footerAbout}
            </p>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>
              {t.footerAddisTitle}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
              <li>{lang === 'am' ? 'በቦሌ የሚሸጡ አፓርታማዎች' : 'Flats for Sale in Bole'}</li>
              <li>{lang === 'am' ? 'በካዛንቺስ የሚከራዩ ቤቶች' : 'Apartments for Rent in Kazanchis'}</li>
              <li>{lang === 'am' ? 'በሲኤምሲ የሚሸጡ ቪላዎች' : 'Villas in CMC Tsehay'}</li>
              <li>{lang === 'am' ? 'በኦልድ ኤርፖርት የቅንጦት ቤቶች' : 'Luxury Homes in Old Airport'}</li>
              <li>{lang === 'am' ? 'በሳርቤት የተሟሉ አፓርታማዎች' : 'Furnished Flats in Sarbet'}</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>
              {t.footerAdamaTitle}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
              <li>{lang === 'am' ? 'በቦሌ ክ/ከተማ አዳማ የሚሸጡ ቪላዎች' : 'Villas for Sale in Bole, Adama'}</li>
              <li>{lang === 'am' ? 'በደምበላ የሚከራዩ አፓርታማዎች' : 'Flats for Rent in Dembela'}</li>
              <li>{lang === 'am' ? 'በፖስታ ቤት ሰፈር ቤቶች' : 'Homes near Posta Bet'}</li>
              <li>{lang === 'am' ? 'በወንጂ መንገድ ራሳቸውን የቻሉ ቤቶች' : 'Standalone Houses on Wonji Road'}</li>
              <li>{lang === 'am' ? 'በቦኩ ሰፈር ተመጣጣኝ ቤቶች' : 'Affordable Flats in Boku'}</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          {t.footerCopyright}
        </div>
      </footer>
    </div>
  );
}
