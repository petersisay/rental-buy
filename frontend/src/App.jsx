import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import PropertyCard from './components/PropertyCard';
import PropertyModal from './components/PropertyModal';
import FavoritesDrawer from './components/FavoritesDrawer';
import { Home, Filter, RefreshCw, AlertCircle, Building, CheckCircle } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

export default function App() {
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
      const saved = localStorage.getItem('mb_shortlisted');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mb_shortlisted', JSON.stringify(favorites));
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

  return (
    <div className="app">
      <Navbar
        city={filters.city}
        onCityChange={(city) => updateFilters({ city })}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      <HeroSearch
        filters={filters}
        onFilterChange={updateFilters}
        onSearch={fetchProperties}
        onReset={resetFilters}
      />

      <main className="main-container">
        {/* Results Header */}
        <div className="results-header">
          <div>
            <h2 className="results-count">
              <span>{properties.length}</span> Properties Available to {filters.purpose === 'rent' ? 'Rent' : 'Buy'}
              {filters.city ? ` in ${filters.city}` : ' in Bangalore & Mumbai'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Showing verified residential apartments & villas with exact pricing
            </p>
          </div>

          <div className="filter-tags">
            {filters.city && (
              <span className="filter-tag">
                City: {filters.city}
                <button onClick={() => updateFilters({ city: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </span>
            )}
            {filters.property_type && (
              <span className="filter-tag">
                Type: {filters.property_type === 'flat' ? 'Flat' : 'House'}
                <button onClick={() => updateFilters({ property_type: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </span>
            )}
            {filters.bhk && (
              <span className="filter-tag">
                {filters.bhk} BHK
                <button onClick={() => updateFilters({ bhk: null })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </span>
            )}
            {(filters.min_price || filters.max_price) && (
              <span className="filter-tag">
                Budget Filter Active
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
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <RefreshCw size={36} color="#d9222a" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: 600 }}>
              Searching verified properties in {filters.city || 'Bangalore & Mumbai'}...
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
              style={{ marginTop: '1rem', background: '#dc2626', color: 'white', border: 'none', padding: '0.55rem 1.25rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
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
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && properties.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🏠</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>
              No Properties Found Matching Your Criteria
            </h3>
            <p style={{ color: '#64748b', maxWidth: '480px', margin: '0.5rem auto 1.5rem', fontSize: '0.95rem' }}>
              We couldn't find any properties matching your current budget or filters in {filters.city || 'Bangalore / Mumbai'}. Try expanding your budget range or clearing some filters.
            </p>
            <button className="btn-search-main" style={{ maxWidth: '220px', margin: '0 auto' }} onClick={resetFilters}>
              Reset All Filters
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
        />
      )}

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={removeFavorite}
        onSelectProperty={(p) => setSelectedProperty(p)}
      />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div className="logo-badge">mb</div>
              <h3 style={{ margin: 0 }}>magicbricks</h3>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
              India's premier real estate platform connecting buyers, tenants, and property owners across Bangalore and Mumbai with verified listings and transparent pricing.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>
              Bangalore Properties
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
              <li>Flats for Sale in Whitefield</li>
              <li>Apartments in Indiranagar</li>
              <li>Flats for Rent in HSR Layout</li>
              <li>Independent Houses in Koramangala</li>
              <li>Penthouses in Hebbal</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>
              Mumbai Properties
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
              <li>Sea-Facing Flats in Bandra West</li>
              <li>Luxury Condos in Worli</li>
              <li>Bungalows for Sale in Juhu</li>
              <li>Flats for Rent in Powai</li>
              <li>Apartments in Andheri West</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 MagicBricks Clone Demo • Built with FastAPI, SQLite & React.
        </div>
      </footer>
    </div>
  );
}
