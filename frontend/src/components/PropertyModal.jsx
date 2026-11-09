import React, { useState } from 'react';
import { X, MapPin, CheckCircle2, Mail, Send } from 'lucide-react';

export default function PropertyModal({ property, onClose, initialContactMode = false, lang, t }) {
  const isAmharic = lang === 'am';

  const allImages = (property?.images && property.images.length > 0)
    ? property.images
    : [property?.image_url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"];

  const [activeImage, setActiveImage] = useState(allImages[0]);

  const displayTitle = (isAmharic && property.title_am) ? property.title_am : property.title;
  const displayPrice = (isAmharic && property.price_formatted_am) ? property.price_formatted_am : property.price_formatted;
  const displayLocality = (isAmharic && property.locality_am) ? property.locality_am : property.locality;
  const displayCity = (isAmharic && property.city_am) ? property.city_am : property.city;
  const displayDescription = (isAmharic && property.description_am) ? property.description_am : property.description;
  const displayFurnishing = (isAmharic && property.furnishing_am) ? property.furnishing_am : property.furnishing;

  const amenitiesStr = (isAmharic && property.amenities_am) ? property.amenities_am : property.amenities;
  const amenitiesList = amenitiesStr ? amenitiesStr.split(',').map(s => s.trim()) : [];

  const defaultMessage = isAmharic
    ? `ሰላም፣ በ${displayCity}፣ ${displayLocality} ስለሚገኘው "${displayTitle}" ተጨማሪ መረጃ ማግኘት እፈልጋለሁ።`
    : `Hi, I am interested in "${displayTitle}" in ${displayLocality}, ${displayCity}. Please share more details.`;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: defaultMessage
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const propId = property?.id || property?._id;
      const res = await fetch(`${apiBase}/api/properties/${propId}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error(isAmharic ? 'የጥያቄ መልእክት መላክ አልተሳካም። እባክዎ በድጋሚ ይሞክሩ።' : 'Failed to submit contact enquiry. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-gallery-wrap">
          <img 
            src={activeImage} 
            alt={displayTitle} 
            className="modal-hero-img"
          />
          {allImages.length > 1 && (
            <div className="modal-thumbnails" style={{ display: 'flex', gap: '0.5rem', padding: '0.65rem 1.25rem', overflowX: 'auto', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  style={{
                    border: activeImage === img ? '2px solid var(--primary)' : '2px solid transparent',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} style={{ width: '60px', height: '42px', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="modal-body">
          <div className="modal-header-section">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
              <span className={`badge-purpose ${property.purpose}`} style={{ position: 'static' }}>
                {property.purpose === 'buy' ? t.forBuyBadge : t.forRentBadge}
              </span>
              <span className="badge-type" style={{ position: 'static', border: '1px solid #cbd5e1' }}>
                {property.property_type === 'flat' ? t.typeFlat : t.typeHouse}
              </span>
              <span className="badge-type" style={{ position: 'static', border: '1px solid #cbd5e1', background: '#f1f5f9' }}>
                {displayFurnishing}
              </span>
            </div>

            <h2 className="modal-title">{displayTitle}</h2>
            <div className="modal-price">{displayPrice}</div>

            <div className="card-location" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
              <MapPin size={18} color="var(--primary)" />
              <span>{displayLocality}, {displayCity}</span>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="card-features" style={{ padding: '1rem', margin: '1.25rem 0' }}>
            <div className="feature-item">
              <span className="feature-label">{t.labelBeds}</span>
              <span className="feature-val" style={{ fontSize: '1.1rem' }}>{property.bhk} {isAmharic ? 'ክፍል' : 'BHK'}</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">{t.bathsLabel}</span>
              <span className="feature-val" style={{ fontSize: '1.1rem' }}>{property.bathrooms} {t.bathsLabel}</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">{t.areaLabel}</span>
              <span className="feature-val" style={{ fontSize: '1.1rem' }}>{property.area} m²</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">{isAmharic ? 'የእቃ ሁኔታ' : 'Furnishing'}</span>
              <span className="feature-val" style={{ fontSize: '1rem' }}>{displayFurnishing}</span>
            </div>
          </div>

          {/* Description */}
          <h4 className="modal-section-title">{t.modalOverview}</h4>
          <p className="modal-desc">{displayDescription}</p>

          {/* Amenities */}
          {amenitiesList.length > 0 && (
            <>
              <h4 className="modal-section-title">{t.modalAmenities}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem', margin: '0.75rem 0 1.5rem' }}>
                {amenitiesList.map((amenity, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontSize: '0.9rem' }}>
                    <CheckCircle2 size={16} color="var(--primary)" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Contact Agent Section */}
          <div className="contact-agent-box" id="contact-agent-form">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={20} color="var(--primary)" />
              {t.modalContactTitle}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.25rem' }}>
              {t.modalContactSubtitle}
            </p>

            {submitted ? (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '1.25rem', borderRadius: '8px', marginTop: '1rem', textAlign: 'center' }}>
                <CheckCircle2 size={36} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
                <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{t.modalSuccessTitle}</h4>
                <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  {t.modalSuccessDesc} <strong>{formData.phone}</strong>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form-grid">
                <div>
                  <label className="field-label">{t.modalName}</label>
                  <input
                    type="text"
                    required
                    className="field-input"
                    placeholder={t.modalNamePlaceholder}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="field-label">{t.modalPhone}</label>
                  <input
                    type="tel"
                    required
                    className="field-input"
                    placeholder={t.modalPhonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-full">
                  <label className="field-label">{t.modalEmail}</label>
                  <input
                    type="email"
                    required
                    className="field-input"
                    placeholder={t.modalEmailPlaceholder}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-full">
                  <label className="field-label">{t.modalMessage}</label>
                  <textarea
                    rows={3}
                    className="field-input"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {errorMsg && (
                  <div className="form-full" style={{ color: '#dc2626', fontSize: '0.85rem' }}>
                    {errorMsg}
                  </div>
                )}

                <div className="form-full">
                  <button 
                    type="submit" 
                    className="btn-search-main" 
                    disabled={submitting}
                  >
                    <Send size={18} />
                    <span>{submitting ? t.modalBtnSubmitting : t.modalBtnSubmit}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
