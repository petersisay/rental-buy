import React, { useState, useEffect } from 'react';
import { Briefcase, PlusCircle, CheckCircle2, Trash2, MapPin, Mail, Phone, Users } from 'lucide-react';

export default function AgentPortal({ properties, onAddProperty, onDeleteProperty, lang, t, apiBase }) {
  const isAmharic = lang === 'am';

  const [formData, setFormData] = useState({
    title: '',
    title_am: '',
    city: 'Addis Ababa',
    locality: '',
    locality_am: '',
    purpose: 'buy',
    property_type: 'flat',
    price: '',
    bhk: 3,
    bathrooms: 2,
    area: '',
    furnishing: 'Semi-Furnished',
    furnishing_am: 'ከፊል እቃ ያለው',
    image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    amenities: 'Automatic Elevator, Standby Generator, Underground Parking, 24/7 Security',
    amenities_am: 'ዘመናዊ ሊፍት, ተጠባባቂ ጄኔሬተር, የምድር ውስጥ ማቆሚያ, 24/7 ጥበቃ',
    agentName: '',
    agencyName: '',
    agentPhone: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Fetch client inquiry leads
  useEffect(() => {
    async function fetchLeads() {
      try {
        setLeadsLoading(true);
        const res = await fetch(`${apiBase}/api/contact`);
        if (res.ok) {
          const data = await res.json();
          setLeads(data);
        }
      } catch (err) {
        console.error('Failed to fetch leads:', err);
      } finally {
        setLeadsLoading(false);
      }
    }
    fetchLeads();
  }, [apiBase]);

  const agentProperties = properties.filter(p => p.role === 'agent');

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
        role: 'agent',
        postedBy: {
          name: formData.agentName || 'Licensed Agent',
          agencyName: formData.agencyName || 'Ethio Brokerage',
          phone: formData.agentPhone || '+251 911 000000'
        }
      };

      await onAddProperty(payload);

      setSuccessMsg(
        isAmharic
          ? 'የደንበኛዎ ንብረት በተሳካ ሁኔታ ተመዝግቧል! በአስተዳዳሪው ተረጋግጦ ይለጠፋል።'
          : 'Client property listed successfully and submitted for admin review!'
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
        agentName: '',
        agencyName: '',
        agentPhone: ''
      }));
    } catch (err) {
      setErrorMsg(err.message || 'Failed to list property.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-container">
      <div className="portal-header">
        <div className="portal-icon-wrapper" style={{ background: '#eff6ff', color: '#2563eb' }}>
          <Briefcase size={28} />
        </div>
        <div>
          <h1 className="portal-title">{t.agentsTitle}</h1>
          <p className="portal-subtitle">{t.agentsSubtitle}</p>
        </div>
      </div>

      <div className="portal-grid">
        {/* Post Client Listing */}
        <div className="portal-card">
          <div className="portal-card-header">
            <PlusCircle size={20} color="#2563eb" />
            <h2>{t.agentsFormHeading}</h2>
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
                <label className="field-label">{isAmharic ? 'የንብረቱ ስም (English)' : 'Property Title (English)'} *</label>
                <input
                  type="text"
                  required
                  className="field-input"
                  placeholder="e.g. 3 BHK Luxury Apartment in Bole Medhanialem"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የንብረቱ ስም (አማርኛ)' : 'Property Title (Amharic)'}</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="ለምሳሌ ባለ 3 መኝታ ቅንጦት አፓርታማ በቦሌ መድኃኔዓለም"
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
                <label className="field-label">{isAmharic ? 'ሰፈር (Locality)' : 'Locality'} *</label>
                <input
                  type="text"
                  required
                  className="field-input"
                  placeholder="e.g. Bole, Kazanchis, Dembela"
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
                  <option value="buy">{t.tabBuy}</option>
                  <option value="rent">{t.tabRent}</option>
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
                  placeholder="e.g. 32000000"
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
                  placeholder="e.g. 190"
                  value={formData.area}
                  onChange={e => setFormData({ ...formData, area: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የደላላው / ወኪሉ ስም' : 'Agent Name'} *</label>
                <input
                  type="text"
                  required
                  className="field-input"
                  placeholder="e.g. Bekele Desta"
                  value={formData.agentName}
                  onChange={e => setFormData({ ...formData, agentName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የድርጅቱ ስም' : 'Brokerage / Agency Name'} *</label>
                <input
                  type="text"
                  required
                  className="field-input"
                  placeholder="e.g. Premier Addis Realty"
                  value={formData.agencyName}
                  onChange={e => setFormData({ ...formData, agencyName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የስልክ ቁጥር' : 'Agent Contact Phone'} *</label>
                <input
                  type="tel"
                  required
                  className="field-input"
                  placeholder="e.g. +251 912 345678"
                  value={formData.agentPhone}
                  onChange={e => setFormData({ ...formData, agentPhone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የምስል ሊንክ' : 'Property Image URL'}</label>
                <input
                  type="url"
                  className="field-input"
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn-search-main" style={{ background: '#2563eb' }} disabled={submitting}>
              {submitting ? (isAmharic ? 'በመመዝገብ ላይ...' : 'Submitting...') : (isAmharic ? 'የደንበኛውን ንብረት መዝግብ' : 'Publish Broker Listing')}
            </button>
          </form>
        </div>

        {/* Agency Listings & Client Leads */}
        <div className="portal-card">
          <div className="portal-card-header">
            <Users size={20} color="#2563eb" />
            <h2>{t.agentsLeadsHeading} ({leads.length})</h2>
          </div>

          <div className="portal-items-list" style={{ maxHeight: '380px' }}>
            {leadsLoading ? (
              <p style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>Loading client leads...</p>
            ) : leads.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>
                {isAmharic ? 'እስካሁን የመጣ የደንበኛ ጥያቄ የለም።' : 'No client inquiries received yet.'}
              </p>
            ) : (
              leads.map((lead, idx) => (
                <div key={idx} className="lead-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h4 style={{ fontWeight: 800, color: 'var(--secondary)' }}>{lead.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', margin: '0.35rem 0', fontSize: '0.85rem', color: '#475569' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Phone size={14} color="#2563eb" /> {lead.phone}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Mail size={14} color="#2563eb" /> {lead.email}
                    </span>
                  </div>
                  {lead.message && (
                    <p style={{ fontSize: '0.85rem', color: '#334155', background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', fontStyle: 'italic' }}>
                      "{lead.message}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="portal-card-header" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h2>{isAmharic ? 'የወኪሉ ንቁ ቤቶች' : 'Agency Active Listings'} ({agentProperties.length})</h2>
          </div>

          <div className="portal-items-list">
            {agentProperties.map(prop => (
              <div key={prop.id || prop._id} className="portal-item">
                <img src={prop.image_url} alt={prop.title} className="portal-item-img" />
                <div className="portal-item-content">
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span className="badge-purpose buy" style={{ position: 'static', padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}>
                      {prop.purpose === 'buy' ? t.forBuyBadge : t.forRentBadge}
                    </span>
                  </div>
                  <h4>{isAmharic && prop.title_am ? prop.title_am : prop.title}</h4>
                  <p className="price-tag">{isAmharic && prop.price_formatted_am ? prop.price_formatted_am : prop.price_formatted}</p>
                </div>
                <button onClick={() => onDeleteProperty(prop.id || prop._id)} className="btn-delete-item">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
