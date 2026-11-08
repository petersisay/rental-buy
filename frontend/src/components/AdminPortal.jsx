import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, Trash2, MapPin, 
  Building, Activity, FileText, Users, Mail, Phone, 
  Clock, AlertTriangle, Layers, Filter, Eye, Check
} from 'lucide-react';

export default function AdminPortal({ 
  properties, 
  onUpdateStatus, 
  onDeleteProperty, 
  lang, 
  t, 
  apiBase 
}) {
  const isAmharic = lang === 'am';

  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'users' | 'inquiries' | 'stats'
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  const [stats, setStats] = useState({
    total: properties.length,
    approved: properties.filter(p => p.status === 'approved').length,
    pending: properties.filter(p => p.status === 'pending').length,
    rejected: properties.filter(p => p.status === 'rejected').length,
    totalUsers: 0,
    pendingUsers: 0,
    approvedUsers: 0,
    inquiries: 0,
    developerProjects: 0,
    addisCount: properties.filter(p => p.city === 'Addis Ababa').length,
    adamaCount: properties.filter(p => p.city === 'Adama').length
  });

  const [filterRole, setFilterRole] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [actionNotice, setActionNotice] = useState('');

  // Fetch Platform Stats
  const fetchStats = async () => {
    try {
      const res = await fetch(`${apiBase}/api/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await fetch(`${apiBase}/api/auth/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch Inquiries
  const fetchInquiries = async () => {
    try {
      setInquiriesLoading(true);
      const res = await fetch(`${apiBase}/api/contact`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchInquiries();
  }, [properties, apiBase]);

  // Handle User Approval
  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      const res = await fetch(`${apiBase}/api/auth/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update user status');

      setActionNotice(t.adminActionSuccessUser);
      setTimeout(() => setActionNotice(''), 4000);

      // Refresh users and stats
      fetchUsers();
      fetchStats();
    } catch (err) {
      alert(err.message || 'Error updating user status');
    }
  };

  // Filtered lists
  const pendingProperties = properties.filter(p => p.status === 'pending');
  const approvedProperties = properties.filter(p => p.status === 'approved');
  const filteredProperties = properties.filter(p => filterRole === 'all' || p.role === filterRole);

  const pendingUsers = users.filter(u => u.status === 'pending');
  const filteredUsers = users.filter(u => userStatusFilter === 'all' || u.status === userStatusFilter);

  return (
    <div className="portal-container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="portal-header flex items-center gap-4 mb-6">
        <div className="portal-icon-wrapper w-14 h-14 rounded-2xl flex items-center justify-center bg-rose-50 text-rose-600 shadow-sm border border-rose-100">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h1 className="portal-title text-2xl sm:text-3xl font-extrabold text-gray-900">{t.adminTitle}</h1>
          <p className="portal-subtitle text-sm text-gray-600">{t.adminSubtitle}</p>
        </div>
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
            {isAmharic ? 'ያልፀደቁ ቤቶች' : 'Pending Properties'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">
              {stats.pending !== undefined ? stats.pending : pendingProperties.length}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              Review Queue
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
            {isAmharic ? 'የተጠቃሚ ማጽደቂያዎች' : 'Pending Users'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">
              {stats.pendingUsers !== undefined ? stats.pendingUsers : pendingUsers.length}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
              Sign-Ins
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
            {isAmharic ? 'የፀደቁ ቤቶች' : 'Live Properties'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {stats.approved || approvedProperties.length}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Active
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
            {isAmharic ? 'የደንበኞች ጥያቄዎች' : 'Client Inquiries'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-600">
              {stats.inquiries || inquiries.length}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
              Leads
            </span>
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex border-b border-gray-200 mb-6 gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'properties'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Activity size={16} />
          <span>{t.adminTabProperties}</span>
          {pendingProperties.length > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold">
              {pendingProperties.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Users size={16} />
          <span>{t.adminTabUsers}</span>
          {pendingUsers.length > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-extrabold">
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'inquiries'
              ? 'border-purple-600 text-purple-700 bg-purple-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Mail size={16} />
          <span>{t.adminTabInquiries}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'stats'
              ? 'border-gray-800 text-gray-900 bg-gray-100'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Layers size={16} />
          <span>{t.adminTabStats}</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: PROPERTY APPROVALS QUEUE                      */}
      {/* ==================================================== */}
      {activeTab === 'properties' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Activity size={22} className="text-amber-500" />
                <h2 className="text-lg font-bold text-gray-900">
                  {t.adminQueueHeading} ({pendingProperties.length})
                </h2>
              </div>
            </div>

            {pendingProperties.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-base text-gray-700">
                  {isAmharic ? 'ምንም ያልተገመገመ ቤት የለም። ሁሉም ቤቶች ፀድቀዋል!' : 'All property listings are reviewed and approved!'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProperties.map(prop => (
                  <div key={prop.id || prop._id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white transition-all flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex gap-4 items-center min-w-0">
                      <img
                        src={prop.image_url || (prop.images && prop.images[0])}
                        alt={prop.title}
                        className="w-24 h-24 rounded-xl object-cover flex-shrink-0 border border-gray-200 shadow-sm"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-purple-100 text-purple-800">
                            {prop.role || 'OWNER'}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-100 text-emerald-800">
                            {prop.purpose === 'buy' ? t.forBuyBadge : t.forRentBadge}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-blue-100 text-blue-800">
                            {prop.property_type === 'flat' ? t.flatBadge : t.houseBadge}
                          </span>
                          {prop.images?.length > 1 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                              📷 {prop.images.length} photos
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-gray-900 truncate">
                          {isAmharic ? (prop.title_am || prop.title) : prop.title}
                        </h4>
                        <p className="text-sm font-extrabold text-emerald-600 mt-0.5">
                          {isAmharic ? (prop.price_formatted_am || `${prop.price?.toLocaleString()} ብር`) : (prop.price_formatted || `${prop.price?.toLocaleString()} ETB`)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin size={12} />
                          <span>{prop.locality}, {prop.city} • {prop.bhk} BHK • {prop.area} m²</span>
                        </p>
                        {prop.postedBy?.name && (
                          <p className="text-xs text-gray-600 mt-1">
                            <strong>{isAmharic ? 'አስመዝጋቢ' : 'Contact'}:</strong> {prop.postedBy.name} ({prop.postedBy.phone})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-200">
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(prop.id || prop._id, 'approved')}
                        className="flex-1 md:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={15} />
                        <span>{t.adminBtnApprove}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(prop.id || prop._id, 'rejected')}
                        className="flex-1 md:flex-initial px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <XCircle size={15} />
                        <span>{t.adminBtnReject}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: USER SIGN-IN & REGISTRATION APPROVALS QUEUE   */}
      {/* ==================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
              <div className="flex items-center gap-2">
                <Users size={22} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  {t.adminUsersPendingHeading} ({pendingUsers.length})
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-gray-500">Filter Status:</span>
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 py-1.5 px-2.5 text-xs bg-white"
                >
                  <option value="all">All Users ({users.length})</option>
                  <option value="pending">Pending Approval ({pendingUsers.length})</option>
                  <option value="approved">Approved & Active ({users.filter(u => u.status === 'approved').length})</option>
                  <option value="rejected">Rejected ({users.filter(u => u.status === 'rejected').length})</option>
                </select>
              </div>
            </div>

            {usersLoading ? (
              <p className="text-sm text-gray-500 italic py-6 text-center">{t.searching}</p>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-2" />
                <p className="font-bold">{isAmharic ? 'ምንም ማጽደቂያ የሚጠብቅ ተጠቃሚ የለም።' : 'No users matching this filter.'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map(user => (
                  <div key={user.id || user._id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-300"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-bold text-gray-900 truncate">{user.name}</span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            user.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : user.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {user.status === 'approved' ? t.adminStatusApproved : user.status === 'pending' ? t.adminStatusPending : t.adminStatusRejected}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="flex items-center gap-1">
                            <Mail size={12} className="text-gray-400" />
                            <span>{user.email}</span>
                          </span>
                          {user.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={12} className="text-gray-400" />
                              <span>{user.phone}</span>
                            </span>
                          )}
                          <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                            {user.role ? user.role.toUpperCase() : 'SEEKER'}
                          </span>
                          {user.company && (
                            <span className="text-gray-500">🏢 {user.company}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-200">
                      {user.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateUserStatus(user.id || user._id, 'approved')}
                          className="flex-1 md:flex-initial px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                        >
                          <Check size={14} />
                          <span>{t.adminBtnApprove}</span>
                        </button>
                      )}
                      {user.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateUserStatus(user.id || user._id, 'rejected')}
                          className="flex-1 md:flex-initial px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <XCircle size={14} />
                          <span>{t.adminBtnReject}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: CLIENT INQUIRIES LEADS                        */}
      {/* ==================================================== */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-4 border-b border-gray-100">
            <Mail size={20} className="text-purple-600" />
            <span>{t.adminTabInquiries} ({inquiries.length})</span>
          </h2>

          {inquiriesLoading ? (
            <p className="text-sm text-gray-500 italic py-6 text-center">{t.searching}</p>
          ) : inquiries.length === 0 ? (
            <p className="text-sm text-gray-500 italic py-6 text-center">No inquiry leads received yet.</p>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq, idx) => (
                <div key={inq.id || idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-gray-900">{inq.name}</span>
                    <span className="text-xs text-gray-400">
                      {inq.createdAt ? new Date(inq.createdAt).toLocaleString() : 'Recent'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 flex gap-4 mb-2">
                    <span><strong>Phone:</strong> {inq.phone}</span>
                    <span><strong>Email:</strong> {inq.email}</span>
                  </div>
                  {inq.message && (
                    <p className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200 italic">
                      "{inq.message}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: PLATFORM ANALYTICS & KPIS                     */}
      {/* ==================================================== */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-base text-gray-900 mb-4 pb-2 border-b border-gray-100">
              {isAmharic ? 'የከተሞችና የቤቶች ስርጭት' : 'Geographic Distribution'}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                <span className="text-gray-600">{t.addisAbaba}</span>
                <span className="font-bold text-gray-900">{stats.addisCount || 0} listings</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                <span className="text-gray-600">{t.adama}</span>
                <span className="font-bold text-gray-900">{stats.adamaCount || 0} listings</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                <span className="text-gray-600">Developer Projects</span>
                <span className="font-bold text-purple-700">{stats.developerProjects || 4} projects</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-base text-gray-900 mb-4 pb-2 border-b border-gray-100">
              {isAmharic ? 'የተጠቃሚዎች ሁኔታ' : 'User Accounts Governance'}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                <span className="text-gray-600">Total Registered Users</span>
                <span className="font-bold text-gray-900">{users.length}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                <span className="text-amber-600 font-semibold">Pending Approvals</span>
                <span className="font-bold text-amber-600">{pendingUsers.length}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                <span className="text-emerald-600 font-semibold">Approved Active Users</span>
                <span className="font-bold text-emerald-600">{users.filter(u => u.status === 'approved').length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
