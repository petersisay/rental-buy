import React from 'react';
import { Heart, MapPin, Bed, Bath, Maximize2, ShieldCheck } from 'lucide-react';

export default function PropertyCard({ property, isFavorite, onToggleFavorite, onSelect, onContact }) {
  const amenitiesList = property.amenities ? property.amenities.split(',').map(s => s.trim()) : [];

  return (
    <article className="property-card">
      <div className="card-image-wrap">
        <img 
          src={property.image_url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"} 
          alt={property.title} 
          className="card-img"
          loading="lazy"
        />
        <span className={`badge-purpose ${property.purpose}`}>
          For {property.purpose}
        </span>
        <span className="badge-type">
          {property.property_type === 'flat' ? 'Flat' : 'House'}
        </span>
        <button 
          className={`btn-favorite-card ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property);
          }}
          title={isFavorite ? "Remove from shortlisted" : "Save property"}
          aria-label="Toggle shortlist"
        >
          <Heart size={18} fill={isFavorite ? "#d9222a" : "none"} color={isFavorite ? "#d9222a" : "currentColor"} />
        </button>
      </div>

      <div className="card-body">
        <div className="card-price-row">
          <span className="card-price">{property.price_formatted}</span>
          <span className="card-rate">
            ₹{Math.round(property.price / property.area).toLocaleString('en-IN')} / sq ft
          </span>
        </div>

        <h3 className="card-title" title={property.title}>
          {property.title}
        </h3>

        <div className="card-location">
          <MapPin size={15} color="#d9222a" />
          <span>{property.locality}, <strong>{property.city}</strong></span>
        </div>

        <div className="card-features">
          <div className="feature-item">
            <span className="feature-label">Beds</span>
            <span className="feature-val">{property.bhk} BHK</span>
          </div>
          <div className="feature-item">
            <span className="feature-label">Baths</span>
            <span className="feature-val">{property.bathrooms} Baths</span>
          </div>
          <div className="feature-item">
            <span className="feature-label">Super Area</span>
            <span className="feature-val">{property.area} sqft</span>
          </div>
        </div>

        {amenitiesList.length > 0 && (
          <div className="card-amenities">
            {amenitiesList.slice(0, 3).map((amenity, i) => (
              <span key={i} className="amenity-pill">{amenity}</span>
            ))}
            {amenitiesList.length > 3 && (
              <span className="amenity-pill">+{amenitiesList.length - 3} more</span>
            )}
          </div>
        )}

        <div className="card-footer">
          <button 
            className="btn-card-details" 
            onClick={() => onSelect(property)}
            type="button"
          >
            View Details
          </button>
          <button 
            className="btn-card-contact" 
            onClick={() => onContact(property)}
            type="button"
          >
            Contact Agent
          </button>
        </div>
      </div>
    </article>
  );
}
