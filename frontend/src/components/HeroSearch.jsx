import React from 'react';
import { Search, Home, Key } from 'lucide-react';

export default function HeroSearch({ filters, onFilterChange, onSearch, onReset, lang, t }) {
  // Ethiopian Birr (ETB) Budget Options tailored for Buy vs. Rent
  const buyBudgetOptions = lang === 'am' ? [
    { label: 'ማንኛውም ዋጋ', value: '' },
    { label: 'ከ 10,000,000 ብር በታች', max: 10000000 },
    { label: '10,000,000 - 25,000,000 ብር', min: 10000000, max: 25000000 },
    { label: '25,000,000 - 50,000,000 ብር', min: 25000000, max: 50000000 },
    { label: '50,000,000 - 80,000,000 ብር', min: 50000000, max: 80000000 },
    { label: 'ከ 80,000,000 ብር በላይ', min: 80000000 }
  ] : [
    { label: 'Any Budget', value: '' },
    { label: 'Under 10M ETB', max: 10000000 },
    { label: '10M - 25M ETB', min: 10000000, max: 25000000 },
    { label: '25M - 50M ETB', min: 25000000, max: 50000000 },
    { label: '50M - 80M ETB', min: 50000000, max: 80000000 },
    { label: 'Above 80M ETB', min: 80000000 }
  ];

  const rentBudgetOptions = lang === 'am' ? [
    { label: 'ማንኛውም ዋጋ', value: '' },
    { label: 'ከ 25,000 ብር በታች / ወር', max: 25000 },
    { label: '25,000 - 50,000 ብር / ወር', min: 25000, max: 50000 },
    { label: '50,000 - 100,000 ብር / ወር', min: 50000, max: 100000 },
    { label: '100,000 - 180,000 ብር / ወር', min: 100000, max: 180000 },
    { label: 'ከ 180,000 ብር በላይ / ወር', min: 180000 }
  ] : [
    { label: 'Any Budget', value: '' },
    { label: 'Under 25,000 ETB / month', max: 25000 },
    { label: '25,000 - 50,000 ETB / month', min: 25000, max: 50000 },
    { label: '50,000 - 100,000 ETB / month', min: 50000, max: 100000 },
    { label: '100,000 - 180,000 ETB / month', min: 100000, max: 180000 },
    { label: 'Above 180,000 ETB / month', min: 180000 }
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
          {t.heroTitlePrefix}<span>{t.heroTitleHighlight}</span>
        </h1>
        <p className="hero-subtitle">
          {t.heroSubtitle}
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
              <span>{t.tabBuy}</span>
            </button>
            <button
              className={`tab-btn ${filters.purpose === 'rent' ? 'active' : ''}`}
              onClick={() => onFilterChange({ purpose: 'rent', min_price: null, max_price: null })}
              type="button"
            >
              <Key size={18} />
              <span>{t.tabRent}</span>
            </button>
          </div>

          {/* Search Inputs Grid */}
          <div className="search-fields-grid">
            {/* City */}
            <div className="field-group">
              <label className="field-label">{t.labelCity}</label>
              <select
                className="field-select"
                value={filters.city}
                onChange={(e) => onFilterChange({ city: e.target.value })}
              >
                <option value="">{t.allCities}</option>
                <option value="Addis Ababa">{t.addisAbaba}</option>
                <option value="Adama">{t.adama}</option>
              </select>
            </div>

            {/* Property Type (flat or house/hause) */}
            <div className="field-group">
              <label className="field-label">{t.labelType}</label>
              <select
                className="field-select"
                value={filters.property_type}
                onChange={(e) => onFilterChange({ property_type: e.target.value })}
              >
                <option value="">{t.allTypes}</option>
                <option value="flat">{t.typeFlat}</option>
                <option value="house">{t.typeHouse}</option>
              </select>
            </div>

            {/* Budget in ETB */}
            <div className="field-group">
              <label className="field-label">{t.labelBudget}</label>
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

            {/* BHK / Bedroom Selection */}
            <div className="field-group">
              <label className="field-label">{t.labelBeds}</label>
              <select
                className="field-select"
                value={filters.bhk || ''}
                onChange={(e) => onFilterChange({ bhk: e.target.value ? parseInt(e.target.value, 10) : null })}
              >
                <option value="">{t.anyBeds}</option>
                <option value="1">1 {t.bedCount}</option>
                <option value="2">2 {t.bedsCount}</option>
                <option value="3">3 {t.bedsCount}</option>
                <option value="4">4+ {t.bedsCount}</option>
              </select>
            </div>

            {/* Locality / Keyword */}
            <div className="field-group" style={{ gridColumn: 'span 2' }}>
              <label className="field-label">{t.labelLocality}</label>
              <input
                type="text"
                className="field-input"
                placeholder={t.placeholderLocality}
                value={filters.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              />
            </div>

            {/* Search Button */}
            <div className="field-group">
              <button className="btn-search-main" onClick={onSearch} type="button">
                <Search size={18} />
                <span>{t.btnSearch}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
