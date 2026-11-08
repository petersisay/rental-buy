import React from 'react';
import { Sparkles, Search, Home, Briefcase, Building, ShieldCheck } from 'lucide-react';

export default function RoleNavigation({ 
  activeTab, 
  onSelectTab, 
  pendingCount = 0, 
  lang, 
  t 
}) {
  const tabs = [
    { id: 'landing', label: t.navLanding || 'Home', icon: Sparkles },
    { id: 'search', label: t.navHome, icon: Search },
    { id: 'owners', label: t.navOwners, icon: Home },
    { id: 'agents', label: t.navAgents, icon: Briefcase },
    { id: 'developers', label: t.navDevelopers, icon: Building },
    { id: 'admin', label: t.navAdmin, icon: ShieldCheck, badge: pendingCount }
  ];

  return (
    <div className="role-nav-bar bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 flex gap-1 sm:gap-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => onSelectTab(tab.id)}
              type="button"
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-amber-400 text-gray-950' : 'bg-amber-500 text-white'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
