import React from 'react';
import { Heart, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';

export default function PropertyCard({ 
  property, 
  isFavorite, 
  onToggleFavorite, 
  onSelect, 
  onCardClick, 
  onContact, 
  lang, 
  t 
}) {
  const isAmharic = lang === 'am';
  
  const handleSelect = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const selectFn = onSelect || onCardClick;
    if (selectFn) {
      selectFn(property);
    }
  };
  
  const displayTitle = (isAmharic && property.title_am) ? property.title_am : property.title;
  const displayPrice = (isAmharic && property.price_formatted_am) ? property.price_formatted_am : property.price_formatted;
  const displayLocality = (isAmharic && property.locality_am) ? property.locality_am : property.locality;
  const displayCity = (isAmharic && property.city_am) ? property.city_am : property.city;
  
  const amenitiesStr = (isAmharic && property.amenities_am) ? property.amenities_am : property.amenities;
  const amenitiesList = amenitiesStr ? amenitiesStr.split(',').map(s => s.trim()) : [];

  const perSqMValue = Math.round(property.price / (property.area || 1)).toLocaleString('en-US');

  return (
    <article className="property-card">
      <div className="card-image-wrap cursor-pointer" onClick={handleSelect}>
        <img 
          src={property.image_url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"} 
          alt={displayTitle} 
          className="card-img"
          loading="lazy"
        />
        <span className={`badge-purpose ${property.purpose}`}>
          {property.purpose === 'buy' ? t.forBuyBadge : t.forRentBadge}
        </span>
        <span className="badge-type">
          {property.property_type === 'flat' ? t.flatBadge : t.houseBadge}
        </span>
        {property.images && property.images.length > 1 && (
          <span className="badge-photos" style={{ position: 'absolute', bottom: '0.6rem', left: '0.6rem', background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
            📷 {property.images.length}
          </span>
        )}
        <button 
          className={`btn-favorite-card ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property);
          }}
          title={isFavorite ? t.shortlisted : "Save"}
          aria-label="Toggle shortlist"
        >
          <Heart size={18} fill={isFavorite ? "var(--accent-red)" : "none"} color={isFavorite ? "var(--accent-red)" : "currentColor"} />
        </button>
      </div>

      <div className="card-body">
        <div className="card-price-row">
          <span className="card-price">{displayPrice}</span>
          <span className="card-rate">
            ~{perSqMValue} {t.perSqM}
          </span>
        </div>

        <h3 className="card-title cursor-pointer hover:text-emerald-700 transition-colors" title={displayTitle} onClick={handleSelect}>
          {displayTitle}
        </h3>

        <div className="card-location">
          <MapPin size={15} color="var(--primary)" />
          <span>{displayLocality}, <strong>{displayCity}</strong></span>
        </div>

        <div className="card-features">
          <div className="feature-item">
            <span className="feature-label">{t.labelBeds}</span>
            <span className="feature-val">{property.bhk} {isAmharic ? 'መኝታ' : 'BHK'}</span>
          </div>
          <div className="feature-item">
            <span className="feature-label">{t.bathsLabel}</span>
            <span className="feature-val">{property.bathrooms} {isAmharic ? 'መታጠቢያ' : 'Baths'}</span>
          </div>
          <div className="feature-item">
            <span className="feature-label">{t.areaLabel}</span>
            <span className="feature-val">{property.area} m²</span>
          </div>
        </div>

        {amenitiesList.length > 0 && (
          <div className="card-amenities">
            {amenitiesList.slice(0, 3).map((amenity, i) => (
              <span key={i} className="amenity-pill">{amenity}</span>
            ))}
            {amenitiesList.length > 3 && (
              <span className="amenity-pill">+{amenitiesList.length - 3} {isAmharic ? 'ተጨማሪ' : 'more'}</span>
            )}
          </div>
        )}

        <div className="card-footer">
          <button 
            className="btn-card-details cursor-pointer" 
            onClick={handleSelect}
            type="button"
          >
            {t.btnViewDetails}
          </button>
          <button 
            className="btn-card-contact cursor-pointer" 
            onClick={(e) => {
              e.stopPropagation();
              if (onContact) onContact(property);
            }}
            type="button"
          >
            {t.btnContactAgent}
          </button>
        </div>
      </div>
    </article>
  );
}
