import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Trash2, MapPin, Building, Activity, FileText } from 'lucide-react';

export default function AdminPortal({ properties, onUpdateStatus, onDeleteProperty, lang, t, apiBase }) {
  const isAmharic = lang === 'am';

  const [stats, setStats] = useState({
    total: properties.length,
    approved: properties.filter(p => p.status === 'approved').length,
    pending: properties.filter(p => p.status === 'pending').length,
    inquiries: 0,
    addisCount: properties.filter(p => p.city === 'Addis Ababa').length,
    adamaCount: properties.filter(p => p.city === 'Adama').length
  });

  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${apiBase}/api/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    }
    fetchStats();
  }, [properties, apiBase]);

  const pendingProperties = properties.filter(p => p.status === 'pending');
  const filteredProperties = properties.filter(p => filterRole === 'all' || p.role === filterRole);

  return (
    <div className="portal-container">
      <div className="portal-header">
        <div className="portal-icon-wrapper" style={{ background: '#fdf2f8', color: '#be185d' }}>
          <ShieldCheck size={28} />
        </div>
        <div>
          <h1 className="portal-title">{t.adminTitle}</h1>
          <p className="portal-subtitle">{t.adminSubtitle}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <span className="stat-label">{isAmharic ? 'ጠቅላላ ቤቶች' : 'Total Properties'}</span>
          <span className="stat-value">{stats.total || properties.length}</span>
        </div>
        <div className="stat-card" style={{ borderColor: 'var(--primary)' }}>
          <span className="stat-label" style={{ color: 'var(--primary)' }}>{isAmharic ? 'የፀደቁ ቤቶች' : 'Approved Active'}</span>
          <span className="stat-value" style={{ color: 'var(--primary)' }}>{stats.approved || properties.filter(p => p.status === 'approved').length}</span>
        </div>
        <div className="stat-card" style={{ borderColor: '#f59e0b' }}>
          <span className="stat-label" style={{ color: '#d97706' }}>{isAmharic ? 'በግምገማ ላይ ያሉ' : 'Pending Review'}</span>
          <span className="stat-value" style={{ color: '#d97706' }}>{stats.pending !== undefined ? stats.pending : pendingProperties.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">{isAmharic ? 'የደንበኞች ጥያቄዎች' : 'Total Inquiries'}</span>
          <span className="stat-value">{stats.inquiries || 0}</span>
        </div>
      </div>

      {/* Pending Approval Review Queue */}
      <div className="portal-card" style={{ marginBottom: '2rem' }}>
        <div className="portal-card-header">
          <Activity size={20} color="#d97706" />
          <h2>{t.adminQueueHeading} ({pendingProperties.length})</h2>
        </div>

        {pendingProperties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            <CheckCircle2 size={36} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontWeight: 700 }}>{isAmharic ? 'ምንም ያልተገመገመ ቤት የለም። ሁሉም ፀድቋል!' : 'Verification queue is clean! All properties reviewed.'}</p>
          </div>
        ) : (
          <div className="admin-queue-list">
            {pendingProperties.map(prop => (
              <div key={prop.id || prop._id} className="admin-queue-item">
                <img src={prop.image_url} alt={prop.title} className="queue-img" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span className="role-tag role-{prop.role}">{prop.role ? prop.role.toUpperCase() : 'OWNER'}</span>
                    <span className="badge-purpose buy" style={{ position: 'static', padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}>
                      {prop.purpose === 'buy' ? t.forBuyBadge : t.forRentBadge}
                    </span>
                  </div>
                  <h4>{isAmharic && prop.title_am ? prop.title_am : prop.title}</h4>
                  <p className="price-tag">{isAmharic && prop.price_formatted_am ? prop.price_formatted_am : prop.price_formatted}</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: '2px' }} />
                    {prop.locality}, {prop.city} • {prop.bhk} {isAmharic ? 'መኝታ' : 'BHK'} • {prop.area} m²
                  </p>
                  {prop.postedBy?.name && (
                    <p style={{ fontSize: '0.8rem', color: '#334155', marginTop: '0.25rem' }}>
                      <strong>{isAmharic ? 'አስመዝጋቢ' : 'Posted By'}:</strong> {prop.postedBy.name} ({prop.postedBy.phone})
                    </p>
                  )}
                </div>

                <div className="admin-actions">
                  <button
                    onClick={() => onUpdateStatus(prop.id || prop._id, 'approved')}
                    className="btn-approve"
                    title="Approve Listing"
                  >
                    <CheckCircle2 size={16} />
                    <span>{isAmharic ? 'አጽድቅ' : 'Approve'}</span>
                  </button>
                  <button
                    onClick={() => onUpdateStatus(prop.id || prop._id, 'rejected')}
                    className="btn-reject"
                    title="Reject Listing"
                  >
                    <XCircle size={16} />
                    <span>{isAmharic ? 'ውድቅ አድርግ' : 'Reject'}</span>
                  </button>
                  <button
                    onClick={() => onDeleteProperty(prop.id || prop._id)}
                    className="btn-delete-item"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Properties Management Table */}
      <div className="portal-card">
        <div className="portal-card-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="#be185d" />
            <h2>{t.adminApprovedHeading} ({filteredProperties.length})</h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{isAmharic ? 'በሚና አጣራ' : 'Filter by Role'}:</span>
            <select
              className="field-select"
              style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
            >
              <option value="all">{isAmharic ? 'ሁሉም ሚናዎች (All)' : 'All Roles'}</option>
              <option value="owner">{t.navOwners}</option>
              <option value="agent">{t.navAgents}</option>
              <option value="developer">{t.navDevelopers}</option>
            </select>
          </div>
        </div>

        <div className="portal-items-list">
          {filteredProperties.map(prop => (
            <div key={prop.id || prop._id} className="portal-item">
              <img src={prop.image_url} alt={prop.title} className="portal-item-img" />
              <div className="portal-item-content">
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <span className={`status-badge status-${prop.status}`}>
                    {prop.status}
                  </span>
                  <span className="role-tag">{prop.role || 'OWNER'}</span>
                </div>
                <h4>{isAmharic && prop.title_am ? prop.title_am : prop.title}</h4>
                <p className="price-tag">{isAmharic && prop.price_formatted_am ? prop.price_formatted_am : prop.price_formatted}</p>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {prop.locality}, {prop.city} • {prop.bhk} {isAmharic ? 'መኝታ' : 'BHK'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {prop.status !== 'approved' && (
                  <button
                    onClick={() => onUpdateStatus(prop.id || prop._id, 'approved')}
                    className="btn-approve"
                    style={{ padding: '0.4rem 0.8rem' }}
                  >
                    {isAmharic ? 'አጽድቅ' : 'Approve'}
                  </button>
                )}
                <button
                  onClick={() => onDeleteProperty(prop.id || prop._id)}
                  className="btn-delete-item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
