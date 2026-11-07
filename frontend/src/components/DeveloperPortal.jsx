import React, { useState, useEffect } from 'react';
import { Building, PlusCircle, CheckCircle2, MapPin, Calendar, Layers, Phone } from 'lucide-react';

export default function DeveloperPortal({ lang, t, apiBase }) {
  const isAmharic = lang === 'am';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    developerName: 'Ayat Real Estate',
    developerName_am: 'አያት ሪል እስቴት',
    projectName: '',
    projectName_am: '',
    city: 'Addis Ababa',
    locality: 'Ayat',
    locality_am: 'አያት',
    totalUnits: 250,
    availableUnits: 40,
    priceRange: '12,000,000 - 45,000,000 ETB',
    priceRange_am: '12M - 45M ብር',
    handoverYear: '2027',
    description: '',
    description_am: '',
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    contactPhone: '+251 911 445566'
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/developer-projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [apiBase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${apiBase}/api/developer-projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to register development project.');

      setSuccessMsg(
        isAmharic
          ? 'አዲሱ የመኖሪያ መንደር ፕሮጀክት በተሳካ ሁኔታ ተመዝግቧል!'
          : 'New residential project development registered successfully!'
      );

      setFormData(prev => ({
        ...prev,
        projectName: '',
        projectName_am: '',
        description: '',
        description_am: ''
      }));

      fetchProjects();
    } catch (err) {
      setErrorMsg(err.message || 'Error saving project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-container">
      <div className="portal-header">
        <div className="portal-icon-wrapper" style={{ background: '#fef3c7', color: '#b45309' }}>
          <Building size={28} />
        </div>
        <div>
          <h1 className="portal-title">{t.developersTitle}</h1>
          <p className="portal-subtitle">{t.developersSubtitle}</p>
        </div>
      </div>

      <div className="portal-grid">
        {/* Project Registration Form */}
        <div className="portal-card">
          <div className="portal-card-header">
            <PlusCircle size={20} color="#b45309" />
            <h2>{t.developersFormHeading}</h2>
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
                <label className="field-label">{isAmharic ? 'የሪል እስቴት አልሚው ድርጅት ስም' : 'Developer Company Name'} *</label>
                <select
                  className="field-select"
                  value={formData.developerName}
                  onChange={e => {
                    const dev = e.target.value;
                    let am = 'አያት ሪል እስቴት';
                    if (dev === 'Tsehay Real Estate') am = 'ፀሐይ ሪል እስቴት';
                    if (dev === 'Noah Real Estate') am = 'ኖህ ሪል እስቴት';
                    if (dev === 'Flintstone Homes') am = 'ፍሊንትስቶን ሆምስ';
                    setFormData({ ...formData, developerName: dev, developerName_am: am });
                  }}
                >
                  <option value="Ayat Real Estate">Ayat Real Estate (አያት ሪል እስቴት)</option>
                  <option value="Tsehay Real Estate">Tsehay Real Estate (ፀሐይ ሪል እስቴት)</option>
                  <option value="Noah Real Estate">Noah Real Estate (ኖህ ሪል እስቴት)</option>
                  <option value="Flintstone Homes">Flintstone Homes (ፍሊንትስቶን ሆምስ)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የፕሮጀክቱ ስም (English)' : 'Project Name (English)'} *</label>
                <input
                  type="text"
                  required
                  className="field-input"
                  placeholder="e.g. Ayat Green Valley Towers"
                  value={formData.projectName}
                  onChange={e => setFormData({ ...formData, projectName: e.target.value })}
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
                  placeholder="e.g. CMC, Bole, Ayat, Dembela"
                  value={formData.locality}
                  onChange={e => setFormData({ ...formData, locality: e.target.value, locality_am: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="field-label">{isAmharic ? 'ጠቅላላ ቤቶች ብዛት (Total Units)' : 'Total Units'} *</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="field-input"
                  value={formData.totalUnits}
                  onChange={e => setFormData({ ...formData, totalUnits: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የሚረከብበት ዓመት (Handover Year)' : 'Handover Year'} *</label>
                <input
                  type="text"
                  required
                  className="field-input"
                  placeholder="e.g. 2026 / 2027"
                  value={formData.handoverYear}
                  onChange={e => setFormData({ ...formData, handoverYear: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የዋጋ ክልል (Price Range in ETB)' : 'Price Range'} *</label>
                <input
                  type="text"
                  required
                  className="field-input"
                  placeholder="e.g. 9.8M - 45M ETB"
                  value={formData.priceRange}
                  onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="field-label">{isAmharic ? 'የሽያጭ ክፍል ስልክ' : 'Sales Phone'} *</label>
                <input
                  type="tel"
                  required
                  className="field-input"
                  placeholder="e.g. +251 911 445566"
                  value={formData.contactPhone}
                  onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="field-label">{isAmharic ? 'የፕሮጀክት ምስል ሊንክ' : 'Project Cover Image URL'}</label>
              <input
                type="url"
                className="field-input"
                value={formData.image_url}
                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-search-main" style={{ background: '#b45309' }} disabled={submitting}>
              {submitting ? (isAmharic ? 'በመመዝገብ ላይ...' : 'Registering...') : (isAmharic ? 'አዲስ ፕሮጀክት መዝግብ' : 'Register Development Project')}
            </button>
          </form>
        </div>

        {/* Featured Projects Showcase */}
        <div className="portal-card">
          <div className="portal-card-header">
            <Layers size={20} color="#b45309" />
            <h2>{t.developersProjectsHeading} ({projects.length})</h2>
          </div>

          <div className="portal-items-list">
            {loading ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading developer projects...</p>
            ) : (
              projects.map((proj, idx) => (
                <div key={idx} className="developer-project-card">
                  <img src={proj.image_url} alt={proj.projectName} className="dev-proj-img" />
                  <div className="dev-proj-info">
                    <span className="dev-tag">{isAmharic && proj.developerName_am ? proj.developerName_am : proj.developerName}</span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0.2rem 0' }}>
                      {isAmharic && proj.projectName_am ? proj.projectName_am : proj.projectName}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={12} /> {proj.locality}, {proj.city}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{proj.priceRange}</span>
                      <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Calendar size={12} /> {proj.handoverYear}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
