import React from 'react';
import { 
  Sparkles, Search, Home, Briefcase, Building, 
  ShieldCheck, User, Key
} from 'lucide-react';

export default function RoleNavigation({ 
  activeTab, 
  onSelectTab, 
  currentUser, 
  pendingCount = 0, 
  lang, 
  t 
}) {
  // If no user is logged in, hide role navigation bar completely!
  if (!currentUser) return null;

  // Build authorized tabs based on the logged-in user's role
  const getAuthorizedTabs = () => {
    const role = currentUser.role || 'seeker';

    if (role === 'admin') {
      return [
        { id: 'admin', label: t.navAdminConsole || t.navAdmin, icon: ShieldCheck, badge: pendingCount },
        { id: 'search', label: t.navHome, icon: Search },
        { id: 'owners', label: t.navOwners, icon: Home },
        { id: 'agents', label: t.navAgents, icon: Briefcase },
        { id: 'developers', label: t.navDevelopers, icon: Building },
        { id: 'profile', label: t.navProfile, icon: User }
      ];
    }

    if (role === 'owner') {
      return [
        { id: 'owners', label: t.navMyProperties || t.navOwners, icon: Home },
        { id: 'search', label: t.navHome, icon: Search },
        { id: 'landing', label: t.navLanding, icon: Sparkles },
        { id: 'profile', label: t.navProfile, icon: User }
      ];
    }

    if (role === 'agent') {
      return [
        { id: 'agents', label: t.navClientLeads || t.navAgents, icon: Briefcase },
        { id: 'search', label: t.navHome, icon: Search },
        { id: 'landing', label: t.navLanding, icon: Sparkles },
        { id: 'profile', label: t.navProfile, icon: User }
      ];
    }

    if (role === 'developer') {
      return [
        { id: 'developers', label: t.navDevProjects || t.navDevelopers, icon: Building },
        { id: 'search', label: t.navHome, icon: Search },
        { id: 'landing', label: t.navLanding, icon: Sparkles },
        { id: 'profile', label: t.navProfile, icon: User }
      ];
    }

    // Default: customer / renter / buyer
    return [
      { id: 'customer', label: t.navCustomer || 'የደንበኞች ፖርታል (ኪራይ / ግዢ)', icon: Key },
      { id: 'search', label: t.navHome, icon: Search },
      { id: 'landing', label: t.navLanding, icon: Sparkles },
      { id: 'profile', label: t.navProfile, icon: User }
    ];
  };

  const tabs = getAuthorizedTabs();

  const handleTabClick = (tabId) => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    onSelectTab(tabId);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm overflow-x-auto">
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
              onClick={() => handleTabClick(tab.id)}
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
