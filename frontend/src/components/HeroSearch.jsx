import React from 'react';
import { Search, Home, Key, IndianRupee, MapPin, Building } from 'lucide-react';

export default function HeroSearch({ filters, onFilterChange, onSearch, onReset }) {
  // Budget options tailored based on whether user selects Buy or Rent
  const buyBudgetOptions = [
    { label: 'Any Budget', value: '' },
    { label: 'Under ₹50 Lakh', max: 5000000 },
    { label: '₹50 Lakh - ₹1 Crore', min: 5000000, max: 10000000 },
    { label: '₹1 Crore - ₹2 Crore', min: 10000000, max: 20000000 },
    { label: '₹2 Crore - ₹5 Crore', min: 20000000, max: 50000000 },
    { label: 'Above ₹5 Crore', min: 50000000 }
  ];

  const rentBudgetOptions = [
    { label: 'Any Budget', value: '' },
    { label: 'Under ₹30,000 / month', max: 30000 },
    { label: '₹30,000 - ₹50,000 / month', min: 30000, max: 50000 },
    { label: '₹50,000 - ₹1 Lakh / month', min: 50000, max: 100000 },
    { label: '₹1 Lakh - ₹2 Lakh / month', min: 100000, max: 200000 },
    { label: 'Above ₹2 Lakh / month', min: 200000 }
  ];

  const budgetOptions = filters.purpose === 'rent' ? rentBudgetOptions : buyBudgetOptions;

  const handleBudgetChange = (e) => {
    const selectedIdx = e.target.value;
    if (selectedIdx === '') {
      onFilterChange({ min_price: null, max_price: null });
    } else {
      const opt = budgetOptions[parseInt(selectedIdx, 10)];
      onFilterChange({
        min_price: opt.min || null,
        max_price: opt.max || null
      });
    }
  };

  const getSelectedBudgetIndex = () => {
    const idx = budgetOptions.findIndex(
      (opt) => (opt.min || null) === filters.min_price && (opt.max || null) === filters.max_price
    );
    return idx >= 0 ? idx : '';
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Find Your Dream Property in <span>Bangalore & Mumbai</span>
        </h1>
        <p className="hero-subtitle">
          Over 20 hand-picked verified flats and independent houses available to Buy or Rent
        </p>

        <div className="search-card">
          {/* Buy vs Rent Tabs */}
          <div className="search-tabs">
            <button
              className={`tab-btn ${filters.purpose === 'buy' ? 'active' : ''}`}
              onClick={() => onFilterChange({ purpose: 'buy', min_price: null, max_price: null })}
              type="button"
            >
              <Home size={18} />
              <span>Buy Properties</span>
            </button>
            <button
              className={`tab-btn ${filters.purpose === 'rent' ? 'active' : ''}`}
              onClick={() => onFilterChange({ purpose: 'rent', min_price: null, max_price: null })}
              type="button"
            >
              <Key size={18} />
              <span>Rent Properties</span>
            </button>
          </div>

          {/* Search Inputs Grid */}
          <div className="search-fields-grid">
            {/* City */}
            <div className="field-group">
              <label className="field-label">City</label>
              <select
                className="field-select"
                value={filters.city}
                onChange={(e) => onFilterChange({ city: e.target.value })}
              >
                <option value="">Bangalore & Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>

            {/* Property Type (flat or house/hause) */}
            <div className="field-group">
              <label className="field-label">Property Type</label>
              <select
                className="field-select"
                value={filters.property_type}
                onChange={(e) => onFilterChange({ property_type: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="flat">Flat / Apartment</option>
                <option value="house">House / Villa</option>
              </select>
            </div>

            {/* Budget */}
            <div className="field-group">
              <label className="field-label">Budget</label>
              <select
                className="field-select"
                value={getSelectedBudgetIndex()}
                onChange={handleBudgetChange}
              >
                {budgetOptions.map((opt, idx) => (
                  <option key={idx} value={opt.value !== undefined ? '' : idx}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* BHK Selection */}
            <div className="field-group">
              <label className="field-label">Bedrooms (BHK)</label>
              <select
                className="field-select"
                value={filters.bhk || ''}
                onChange={(e) => onFilterChange({ bhk: e.target.value ? parseInt(e.target.value, 10) : null })}
              >
                <option value="">Any BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>

            {/* Locality / Keyword */}
            <div className="field-group" style={{ gridColumn: 'span 2' }}>
              <label className="field-label">Locality or Keyword</label>
              <input
                type="text"
                className="field-input"
                placeholder="e.g. Indiranagar, Whitefield, Bandra, Powai..."
                value={filters.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              />
            </div>

            {/* Search Button */}
            <div className="field-group">
              <button className="btn-search-main" onClick={onSearch} type="button">
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
