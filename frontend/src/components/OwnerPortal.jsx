import React, { useState } from 'react';
import { Home, PlusCircle, CheckCircle2, Trash2, MapPin, Tag } from 'lucide-react';

export default function OwnerPortal({ properties, onAddProperty, onDeleteProperty, lang, t, apiBase }) {
  const isAmharic = lang === 'am';

  const [formData, setFormData] = useState({
    title: '',
    title_am: '',
    city: 'Addis Ababa',
    locality: '',
    locality_am: '',
    purpose: 'rent',
    property_type: 'flat',
    price: '',
    bhk: 2,
    bathrooms: 2,
    area: '',
    furnishing: 'Fully Furnished',
    furnishing_am: 'ሙሉ እቃ ያለው',
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    amenities: 'Backup Generator, Water Tank, 24/7 Security',
    amenities_am: 'ተጠባባቂ ጄኔሬተር, የውሃ ታንከር, 24/7 ጥበቃ',
    ownerName: '',
    ownerPhone: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const ownerProperties = properties.filter(p => p.role === 'owner');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        title: formData.title,
        title_am: formData.title_am || formData.title,
        city: formData.city,
        city_am: formData.city === 'Addis Ababa' ? 'አዲስ አበባ' : 'አዳማ',
        locality: formData.locality,
        locality_am: formData.locality_am || formData.locality,
        purpose: formData.purpose,
        property_type: formData.property_type,
        price: Number(formData.price),
        bhk: Number(formData.bhk),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        furnishing: formData.furnishing,
        furnishing_am: formData.furnishing_am,
        image_url: formData.image_url,
        amenities: formData.amenities,
        amenities_am: formData.amenities_am,
        role: 'owner',
        postedBy: {
          name: formData.ownerName || 'Direct Owner',
          phone: formData.ownerPhone || '+251 911 000000'
        }
      };

      await onAddProperty(payload);

      setSuccessMsg(
        isAmharic
          ? 'ንብረትዎ በተሳካ ሁኔታ ተመዝግቧል! በአስተዳዳሪው ተገምግሞ በቅርቡ በቀጥታ ይለጠፋል።'
          : 'Your property has been submitted successfully and submitted for admin review!'
      );

      // Reset form fields
      setFormData(prev => ({
        ...prev,
        title: '',
        title_am: '',
        locality: '',
        locality_am: '',
        price: '',
        area: '',
        ownerName: '',
        ownerPhone: ''
      }));
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit property.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-container">
      <div className="portal-header">
        <div className="portal-icon-wrapper" style={{ background: '#ecfdf5', color: 'var(--primary)' }}>
          <Home size={28} />
        </div>
        <div>
          <h1 className="portal-title">{t.ownersTitle}</h1>
          <p className="portal-subtitle">{t.ownersSubtitle}</p>
        </div>
      </div>

      <div className="portal-grid">
        {/* Post Form */}
        <div className="portal-card">
          <div className="portal-card-header">
            <PlusCircle size={20} color="var(--primary)" />
            <h2>{t.ownersFormHeading}</h2>
          </div>

          {successMsg && (
            <div className="alert-success">
              <CheckCircle2 size={20} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && <div className="alert-error">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="portal-form">
            <div className="form-row">
              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የንብረቱ ርዕስ (English)' : 'Property Title (English)'} *</label>
                <input
                  type="text"
                  required
                  className="field-input"
                  placeholder="e.g. 3 BHK Luxury Apartment in Bole"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የንብረቱ ርዕስ (አማርኛ)' : 'Property Title (Amharic)'}</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="ለምሳሌ ባለ 3 መኝታ ቅንጦት አፓርታማ በቦሌ"
                  value={formData.title_am}
                  onChange={e => setFormData({ ...formData, title_am: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="field-label">{t.labelCity} *</label>
                <select
                  className="field-select"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                >
                  <option value="Addis Ababa">{t.addisAbaba}</option>
                  <option value="Adama">{t.adama}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">{isAmharic ? 'ሰፈር (Locality)' : 'Locality / Sub-city'} *</label>
                <input
                  type="text"
                  required
                  className="field-input"
                  placeholder="e.g. Bole, CMC, Kazanchis, Dembela"
                  value={formData.locality}
                  onChange={e => setFormData({ ...formData, locality: e.target.value, locality_am: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="field-label">{isAmharic ? 'አላማ (Purpose)' : 'Purpose'} *</label>
                <select
                  className="field-select"
                  value={formData.purpose}
                  onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                >
                  <option value="rent">{t.tabRent}</option>
                  <option value="buy">{t.tabBuy}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">{t.labelType} *</label>
                <select
                  className="field-select"
                  value={formData.property_type}
                  onChange={e => setFormData({ ...formData, property_type: e.target.value })}
                >
                  <option value="flat">{t.typeFlat}</option>
                  <option value="house">{t.typeHouse}</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="field-label">{isAmharic ? 'ዋጋ በብር (Price in ETB)' : 'Price (in ETB)'} *</label>
                <input
                  type="number"
                  required
                  min="1000"
                  className="field-input"
                  placeholder="e.g. 45000 (Rent) or 15000000 (Buy)"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="field-label">{t.areaLabel} (m²) *</label>
                <input
                  type="number"
                  required
                  min="20"
                  className="field-input"
                  placeholder="e.g. 140"
                  value={formData.area}
                  onChange={e => setFormData({ ...formData, area: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="field-label">{t.labelBeds} (BHK) *</label>
                <select
                  className="field-select"
                  value={formData.bhk}
                  onChange={e => setFormData({ ...formData, bhk: Number(e.target.value) })}
                >
                  <option value="1">1 {t.bedCount}</option>
                  <option value="2">2 {t.bedsCount}</option>
                  <option value="3">3 {t.bedsCount}</option>
                  <option value="4">4+ {t.bedsCount}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">{t.bathsLabel} *</label>
                <select
                  className="field-select"
                  value={formData.bathrooms}
                  onChange={e => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የእቃ ሁኔታ (Furnishing)' : 'Furnishing'} *</label>
                <select
                  className="field-select"
                  value={formData.furnishing}
                  onChange={e => {
                    const f = e.target.value;
                    let fAm = 'ያልተሟላ እቃ';
                    if (f === 'Fully Furnished') fAm = 'ሙሉ እቃ ያለው';
                    if (f === 'Semi-Furnished') fAm = 'ከፊል እቃ ያለው';
                    setFormData({ ...formData, furnishing: f, furnishing_am: fAm });
                  }}
                >
                  <option value="Fully Furnished">{isAmharic ? 'ሙሉ እቃ ያለው (Fully Furnished)' : 'Fully Furnished'}</option>
                  <option value="Semi-Furnished">{isAmharic ? 'ከፊል እቃ ያለው (Semi-Furnished)' : 'Semi-Furnished'}</option>
                  <option value="Unfurnished">{isAmharic ? 'ያልተሟላ እቃ (Unfurnished)' : 'Unfurnished'}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የምስል ሊንክ (Photo URL)' : 'Photo URL'}</label>
                <input
                  type="url"
                  className="field-input"
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የባለቤቱ ስም' : 'Owner Full Name'} *</label>
                <input
                  type="text"
                  required
                  className="field-input"
                  placeholder="e.g. Almaz Kebede"
                  value={formData.ownerName}
                  onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የባለቤቱ ስልክ ቁጥር' : 'Owner Mobile Number'} *</label>
                <input
                  type="tel"
                  required
                  className="field-input"
                  placeholder="e.g. +251 911 234567"
                  value={formData.ownerPhone}
                  onChange={e => setFormData({ ...formData, ownerPhone: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn-search-main" disabled={submitting}>
              {submitting ? (isAmharic ? 'በመመዝገብ ላይ...' : 'Submitting...') : (isAmharic ? 'ንብረቱን በነፃ ይለጥፉ' : 'Post Property Free')}
            </button>
          </form>
        </div>

        {/* Listings List */}
        <div className="portal-card">
          <div className="portal-card-header">
            <Tag size={20} color="var(--primary)" />
            <h2>{t.ownersListHeading} ({ownerProperties.length})</h2>
          </div>

          <div className="portal-items-list">
            {ownerProperties.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>
                {isAmharic ? 'እስካሁን የተለጠፈ ንብረት የለም።' : 'No properties posted yet.'}
              </p>
            ) : (
              ownerProperties.map(prop => (
                <div key={prop.id || prop._id} className="portal-item">
                  <img src={prop.image_url} alt={prop.title} className="portal-item-img" />
                  <div className="portal-item-content">
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <span className={`status-badge status-${prop.status}`}>
                        {prop.status === 'approved' ? (isAmharic ? 'የፀደቀ' : 'Approved') : (isAmharic ? 'በግምገማ ላይ' : 'Pending Review')}
                      </span>
                      <span className="badge-purpose buy" style={{ position: 'static', padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}>
                        {prop.purpose === 'buy' ? t.forBuyBadge : t.forRentBadge}
                      </span>
                    </div>
                    <h4>{isAmharic && prop.title_am ? prop.title_am : prop.title}</h4>
                    <p className="price-tag">{isAmharic && prop.price_formatted_am ? prop.price_formatted_am : prop.price_formatted}</p>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      <MapPin size={12} style={{ display: 'inline', marginRight: '2px' }} />
                      {prop.locality}, {prop.city} • {prop.bhk} {isAmharic ? 'መኝታ' : 'BHK'}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteProperty(prop.id || prop._id)}
                    className="btn-delete-item"
                    title="Delete property"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
