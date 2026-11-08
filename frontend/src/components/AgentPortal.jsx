import React, { useState, useEffect } from 'react';
import { Briefcase, PlusCircle, CheckCircle2, Trash2, MapPin, Mail, Phone, Users, Clock, AlertTriangle } from 'lucide-react';
import ImageUploader from './ImageUploader';

export default function AgentPortal({ 
  properties, 
  onAddProperty, 
  onDeleteProperty, 
  lang, 
  t, 
  apiBase, 
  currentUser 
}) {
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
    agentName: currentUser?.name || '',
    agencyName: currentUser?.company || 'Addis Premier Realty',
    agentPhone: currentUser?.phone || ''
  });

  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
  ]);

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
      const selectedImages = images.length > 0 ? images : [formData.image_url];

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
        image_url: selectedImages[0],
        images: selectedImages,
        amenities: formData.amenities,
        amenities_am: formData.amenities_am,
        role: 'agent',
        postedBy: {
          name: formData.agentName || currentUser?.name || 'Verified Broker',
          agencyName: formData.agencyName || currentUser?.company || 'Addis Premier Realty',
          phone: formData.agentPhone || currentUser?.phone || '+251 911 000000',
          email: currentUser?.email || ''
        }
      };

      await onAddProperty(payload);

      setSuccessMsg(
        isAmharic
          ? 'የደንበኛ ቤት መረጃና ፎቶዎች በተሳካ ሁኔታ ተመዝግበዋል! በአስተዳዳሪው ተገምግሞ ሲጸድቅ በቀጥታ ይለጠፋል።'
          : 'Agent listing and property photos submitted successfully for Administrator verification!'
      );

      // Reset
      setFormData(prev => ({
        ...prev,
        title: '',
        title_am: '',
        locality: '',
        locality_am: '',
        price: '',
        area: ''
      }));
      setImages(['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80']);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit agent listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="portal-header flex items-center gap-4 mb-6">
        <div className="portal-icon-wrapper w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
          <Briefcase size={30} />
        </div>
        <div>
          <h1 className="portal-title text-2xl sm:text-3xl font-extrabold text-gray-900">{t.agentsTitle}</h1>
          <p className="portal-subtitle text-sm text-gray-600">{t.agentsSubtitle}</p>
        </div>
      </div>

      {currentUser?.status === 'pending' && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs sm:text-sm">
            <strong>{t.authPendingNoticeTitle}:</strong> {t.ownersPendingWarning}
          </div>
        </div>
      )}

      <div className="portal-grid grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Agent Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <PlusCircle size={22} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">{t.agentsFormHeading}</h2>
          </div>

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
              <AlertTriangle size={18} className="text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {isAmharic ? 'የቤቱ መጠሪያ በእንግሊዝኛ' : 'Property Title (English)'} *
              </label>
              <input
                type="text"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 4 BHK Modern Villa in CMC Michael"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {isAmharic ? 'የቤቱ መጠሪያ በአማርኛ' : 'Property Title (Amharic)'}
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="ለምሳሌ በሲኤምሲ ሚካኤል የሚገኝ ባለ 4 መኝታ ዘመናዊ ቪላ"
                value={formData.title_am}
                onChange={e => setFormData({ ...formData, title_am: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {t.labelCity} *
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                >
                  <option value="Addis Ababa">{t.addisAbaba}</option>
                  <option value="Adama">{t.adama}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {t.labelLocality} *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Kazanchis, Old Airport, Geda..."
                  value={formData.locality}
                  onChange={e => setFormData({ ...formData, locality: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {isAmharic ? 'የማስመዝገቢያ አይነት' : 'Listing Purpose'} *
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  value={formData.purpose}
                  onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                >
                  <option value="buy">{t.tabBuy}</option>
                  <option value="rent">{t.tabRent}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {t.labelType} (Flat / House) *
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  value={formData.property_type}
                  onChange={e => setFormData({ ...formData, property_type: e.target.value })}
                >
                  <option value="flat">{t.typeFlat}</option>
                  <option value="house">{t.typeHouse}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {isAmharic ? 'ዋጋ በብር' : 'Price (in ETB)'} *
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 25000000"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {t.areaLabel} (m²) *
                </label>
                <input
                  type="number"
                  required
                  min="20"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 180"
                  value={formData.area}
                  onChange={e => setFormData({ ...formData, area: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {t.labelBeds} (BHK) *
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {t.bathsLabel} *
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-blue-500"
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

            {/* Photo Uploader Component */}
            <div className="pt-2">
              <ImageUploader
                images={images}
                onChange={setImages}
                t={t}
                lang={lang}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {isAmharic ? 'የደላላው ስም' : 'Broker Name'} *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
                  value={formData.agentName}
                  onChange={e => setFormData({ ...formData, agentName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {isAmharic ? 'የኤጀንሲ ስም' : 'Agency Name'} *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
                  value={formData.agencyName}
                  onChange={e => setFormData({ ...formData, agencyName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {isAmharic ? 'ስልክ ቁጥር' : 'Phone'} *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
                  value={formData.agentPhone}
                  onChange={e => setFormData({ ...formData, agentPhone: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{submitting ? (isAmharic ? 'በመመዝገብ ላይ...' : 'Submitting...') : (isAmharic ? 'የደንበኛ ቤት መረጃ ይለጥፉ' : 'Post Broker Listing')}</span>
            </button>
          </form>
        </div>

        {/* Client Leads Inbox */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users size={18} className="text-blue-600" />
                <span>{t.agentsLeadsHeading}</span>
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
                {leads.length} {isAmharic ? 'ጥያቄዎች' : 'Leads'}
              </span>
            </h2>

            {leadsLoading ? (
              <p className="text-sm text-gray-500 italic py-6 text-center">{t.searching}</p>
            ) : leads.length === 0 ? (
              <p className="text-sm text-gray-500 italic py-6 text-center">
                {isAmharic ? 'እስካሁን ምንም የደንበኛ ጥያቄ አልመጣም።' : 'No client inquiry leads received yet.'}
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {leads.map((lead, idx) => (
                  <div key={lead.id || idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-blue-200 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900 text-sm">{lead.name}</span>
                      <span className="text-[11px] text-gray-400">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} className="text-blue-500" />
                        <a href={`tel:${lead.phone}`} className="font-semibold text-blue-600 hover:underline">
                          {lead.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} className="text-gray-400" />
                        <span>{lead.email}</span>
                      </div>
                    </div>
                    {lead.message && (
                      <p className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-100 italic">
                        "{lead.message}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
