import React from 'react';
import { Building2, Heart, MapPin } from 'lucide-react';

export default function Navbar({ city, onCityChange, favoritesCount, onOpenFavorites }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo-group" onClick={() => onCityChange('')}>
          <div className="logo-badge">mb</div>
          <div>
            <div className="logo-text">magicbricks</div>
            <span className="logo-tagline">INDIA'S NO. 1 PROPERTY PORTAL</span>
          </div>
        </div>

        <div className="nav-actions">
          <div className="city-select-pill">
            <MapPin size={16} color="#d9222a" />
            <span>City:</span>
            <select 
              value={city} 
              onChange={(e) => onCityChange(e.target.value)}
              aria-label="Select City"
            >
              <option value="">All Cities (Bangalore & Mumbai)</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </div>

          <button 
            className="btn-favorites" 
            onClick={onOpenFavorites}
            title="View Shortlisted Properties"
          >
            <Heart size={18} color="#d9222a" fill={favoritesCount > 0 ? "#d9222a" : "none"} />
            <span>Shortlisted</span>
            {favoritesCount > 0 && <span className="badge-count">{favoritesCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}
