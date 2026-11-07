import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Maximize2, CheckCircle2, Phone, Mail, User, Send, Building } from 'lucide-react';

export default function PropertyModal({ property, onClose, initialContactMode = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I am interested in "${property.title}" in ${property.locality}, ${property.city}. Please share more details.`
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!property) return null;

  const amenitiesList = property.amenities ? property.amenities.split(',').map(s => s.trim()) : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/properties/${property.id}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Failed to submit contact enquiry. Please try again.');
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

        <img 
          src={property.image_url} 
          alt={property.title} 
          className="modal-hero-img"
        />

        <div className="modal-body">
          <div className="modal-header-section">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <span className={`badge-purpose ${property.purpose}`} style={{ position: 'static' }}>
                For {property.purpose}
              </span>
              <span className="badge-type" style={{ position: 'static', border: '1px solid #cbd5e1' }}>
                {property.property_type === 'flat' ? 'Flat / Apartment' : 'Independent House'}
              </span>
              <span className="badge-type" style={{ position: 'static', border: '1px solid #cbd5e1', background: '#f1f5f9' }}>
                {property.furnishing}
              </span>
            </div>

            <h2 className="modal-title">{property.title}</h2>
            <div className="modal-price">{property.price_formatted}</div>

            <div className="card-location" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
              <MapPin size={18} color="#d9222a" />
              <span>{property.locality}, {property.city}</span>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="card-features" style={{ padding: '1rem', margin: '1.25rem 0' }}>
            <div className="feature-item">
              <span className="feature-label">Configuration</span>
              <span className="feature-val" style={{ fontSize: '1.1rem' }}>{property.bhk} BHK</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Bathrooms</span>
              <span className="feature-val" style={{ fontSize: '1.1rem' }}>{property.bathrooms} Baths</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Super Built-up Area</span>
              <span className="feature-val" style={{ fontSize: '1.1rem' }}>{property.area} sqft</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Furnishing</span>
              <span className="feature-val" style={{ fontSize: '1.1rem' }}>{property.furnishing}</span>
            </div>
          </div>

          {/* Description */}
          <h4 className="modal-section-title">Property Overview</h4>
          <p className="modal-desc">{property.description}</p>

          {/* Amenities */}
          {amenitiesList.length > 0 && (
            <>
              <h4 className="modal-section-title">Amenities & Facilities</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem', margin: '0.75rem 0 1.5rem' }}>
                {amenitiesList.map((amenity, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontSize: '0.9rem' }}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Contact Agent Section */}
          <div className="contact-agent-box" id="contact-agent-form">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={20} color="#d9222a" />
              Contact Verified Agent / Owner
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.25rem' }}>
              Fill in your details below and our city property manager will connect with you via Call / WhatsApp.
            </p>

            {submitted ? (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '1.25rem', borderRadius: '8px', marginTop: '1rem', textAlign: 'center' }}>
                <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Enquiry Sent Successfully!</h4>
                <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Our property expert for {property.city} will contact you at <strong>{formData.phone}</strong> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form-grid">
                <div>
                  <label className="field-label">Your Full Name</label>
                  <input
                    type="text"
                    required
                    className="field-input"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="field-label">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    className="field-input"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-full">
                  <label className="field-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="field-input"
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-full">
                  <label className="field-label">Message / Query</label>
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
                    <span>{submitting ? 'Submitting...' : 'Send Enquiry & Get Callback'}</span>
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
