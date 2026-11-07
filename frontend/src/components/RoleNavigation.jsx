import React from 'react';
import { Search, Home, Briefcase, Building, ShieldCheck } from 'lucide-react';

export default function RoleNavigation({ activeTab, onSelectTab, pendingCount = 0, lang, t }) {
  const tabs = [
    { id: 'search', label: t.navHome, icon: Search },
    { id: 'owners', label: t.navOwners, icon: Home },
    { id: 'agents', label: t.navAgents, icon: Briefcase },
    { id: 'developers', label: t.navDevelopers, icon: Building },
    { id: 'admin', label: t.navAdmin, icon: ShieldCheck, badge: pendingCount }
  ];

  return (
    <div className="role-nav-bar">
      <div className="role-nav-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`role-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(tab.id)}
              type="button"
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge > 0 && <span className="role-badge">{tab.badge}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
