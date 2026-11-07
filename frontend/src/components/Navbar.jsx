import React from 'react';
import { Building2, Heart, MapPin, Globe } from 'lucide-react';

export default function Navbar({ city, onCityChange, favoritesCount, onOpenFavorites, lang, onToggleLang, t }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo-group" onClick={() => onCityChange('')}>
          <div className="logo-badge">ቀዳሚ</div>
          <div>
            <div className="logo-text">{lang === 'am' ? 'ቀዳሚ' : 'kedami'}</div>
            <span className="logo-tagline">{t.brandTagline}</span>
          </div>
        </div>

        <div className="nav-actions">
          {/* Language Switcher */}
          <button 
            className="btn-lang-toggle"
            onClick={onToggleLang}
            title={lang === 'am' ? "Switch to English" : "ወደ አማርኛ ቀይር"}
          >
            <Globe size={16} />
            <span>{lang === 'am' ? 'English' : 'አማርኛ'}</span>
          </button>

          {/* City Selection Pill */}
          <div className="city-select-pill">
            <MapPin size={16} color="var(--primary)" />
            <span>{t.selectCity}</span>
            <select 
              value={city} 
              onChange={(e) => onCityChange(e.target.value)}
              aria-label="Select City"
            >
              <option value="">{t.allCities}</option>
              <option value="Addis Ababa">{t.addisAbaba}</option>
              <option value="Adama">{t.adama}</option>
            </select>
          </div>

          {/* Shortlisted Properties */}
          <button 
            className="btn-favorites" 
            onClick={onOpenFavorites}
            title={t.shortlisted}
          >
            <Heart size={18} color="var(--accent-red)" fill={favoritesCount > 0 ? "var(--accent-red)" : "none"} />
            <span>{t.shortlisted}</span>
            {favoritesCount > 0 && <span className="badge-count">{favoritesCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}
