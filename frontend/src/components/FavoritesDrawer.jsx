import React from 'react';
import { X, Trash2, ExternalLink, Heart } from 'lucide-react';

export default function FavoritesDrawer({ isOpen, onClose, favorites, onRemoveFavorite, onSelectProperty }) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={20} color="#d9222a" fill="#d9222a" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Shortlisted Properties ({favorites.length})</h3>
          </div>
          <button className="modal-close-btn" style={{ position: 'static', background: '#f1f5f9', color: '#334155' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {favorites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              <Heart size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontWeight: 600 }}>No shortlisted properties yet.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Click the heart icon on any property to save it here for quick access.
              </p>
            </div>
          ) : (
            favorites.map((prop) => (
              <div key={prop.id} className="fav-item">
                <img src={prop.image_url} alt={prop.title} className="fav-item-img" />
                <div className="fav-item-info">
                  <div className="fav-item-title">{prop.title}</div>
                  <div className="fav-item-price">{prop.price_formatted}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {prop.locality}, {prop.city} • {prop.bhk} BHK
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <button
                    onClick={() => {
                      onSelectProperty(prop);
                      onClose();
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }}
                    title="View details"
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(prop.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    title="Remove from favorites"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
