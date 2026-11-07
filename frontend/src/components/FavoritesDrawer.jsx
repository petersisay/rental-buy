import React from 'react';
import { X, Trash2, ExternalLink, Heart } from 'lucide-react';

export default function FavoritesDrawer({ isOpen, onClose, favorites, onRemoveFavorite, onSelectProperty, lang, t }) {
  if (!isOpen) return null;

  const isAmharic = lang === 'am';

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={20} color="var(--accent-red)" fill="var(--accent-red)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
              {t.favDrawerTitle} ({favorites.length})
            </h3>
          </div>
          <button className="modal-close-btn" style={{ position: 'static', background: '#f1f5f9', color: '#334155' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {favorites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              <Heart size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontWeight: 700, fontSize: '1rem', color: '#334155' }}>{t.favDrawerEmpty}</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.35rem' }}>
                {t.favDrawerEmptySub}
              </p>
            </div>
          ) : (
            favorites.map((prop) => {
              const displayTitle = (isAmharic && prop.title_am) ? prop.title_am : prop.title;
              const displayPrice = (isAmharic && prop.price_formatted_am) ? prop.price_formatted_am : prop.price_formatted;
              const displayLocality = (isAmharic && prop.locality_am) ? prop.locality_am : prop.locality;
              const displayCity = (isAmharic && prop.city_am) ? prop.city_am : prop.city;

              return (
                <div key={prop.id} className="fav-item">
                  <img src={prop.image_url} alt={displayTitle} className="fav-item-img" />
                  <div className="fav-item-info">
                    <div className="fav-item-title">{displayTitle}</div>
                    <div className="fav-item-price">{displayPrice}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {displayLocality}, {displayCity} • {prop.bhk} {isAmharic ? 'መኝታ' : 'BHK'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <button
                      onClick={() => {
                        onSelectProperty(prop);
                        onClose();
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                      title={t.btnViewDetails}
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(prop.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)' }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
