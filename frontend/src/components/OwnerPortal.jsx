import React, { useState } from 'react';
import { Home, PlusCircle, CheckCircle2, Trash2, MapPin, Tag, Clock, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';

export default function OwnerPortal({ 
  properties, 
  onAddProperty, 
  onDeleteProperty, 
  lang, 
  t, 
  currentUser 
}) {
  const isAmharic = lang === 'am';

  const [formData, setFormData] = useState({
    title: '',
    title_am: '',
    city: 'Addis Ababa',
    locality: '',
    locality_am: '',
    purpose: 'rent',
    property_type: 'flat',
    price: '',
    bhk: 2,
    bathrooms: 2,
    area: '',
    furnishing: 'Fully Furnished',
    furnishing_am: 'ሙሉ እቃ ያለው',
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    amenities: 'Backup Generator, Water Tank, 24/7 Security',
    amenities_am: 'ተጠባባቂ ጄኔሬተር, የውሃ ታንከር, 24/7 ጥበቃ',
    ownerName: currentUser?.name || '',
    ownerPhone: currentUser?.phone || ''
  });

  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const ownerProperties = properties.filter(p => p.role === 'owner');

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
        role: 'owner',
        postedBy: {
          name: formData.ownerName || currentUser?.name || 'Direct Owner',
          phone: formData.ownerPhone || currentUser?.phone || '+251 911 000000',
          email: currentUser?.email || ''
        }
      };

      await onAddProperty(payload);

      setSuccessMsg(
        isAmharic
          ? 'ንብረትዎ በተሳካ ሁኔታ ተመዝግቧል! በአስተዳዳሪው ተገምግሞ ሲጸድቅ በቀጥታ ይለጠፋል።'
          : 'Your property and photos have been submitted successfully for Administrator verification!'
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
        ownerName: currentUser?.name || '',
        ownerPhone: currentUser?.phone || ''
      }));
      setImages(['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80']);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit property.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="portal-header flex items-center gap-4 mb-6">
        <div className="portal-icon-wrapper w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100">
          <Home size={30} />
        </div>
        <div>
          <h1 className="portal-title text-2xl sm:text-3xl font-extrabold text-gray-900">{t.ownersTitle}</h1>
          <p className="portal-subtitle text-sm text-gray-600">{t.ownersSubtitle}</p>
        </div>
      </div>

      {/* Account Verification Notice if User is Pending */}
      {currentUser?.status === 'pending' && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs sm:text-sm">
            <strong>{t.authPendingNoticeTitle}:</strong> {t.ownersPendingWarning}
          </div>
        </div>
      )}

      <div className="portal-grid grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Post Form */}
        <div className="lg:col-span-7 portal-card bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-7">
          <div className="portal-card-header flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <PlusCircle size={22} className="text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">{t.ownersFormHeading}</h2>
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
                {isAmharic ? 'የቤቱ መጠሪያ በእንግሊዝኛ (Title in English)' : 'Property Title (English)'} *
              </label>
              <input
                type="text"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Spacious 3 BHK Luxury Flat in Bole Medhanialem"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {isAmharic ? 'የቤቱ መጠሪያ በአማርኛ (Title in Amharic)' : 'Property Title (Amharic)'}
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                placeholder="ለምሳሌ በቦሌ መድኃኔዓለም የሚገኝ ባለ 3 መኝታ ቅንጦት አፓርታማ"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Bole, CMC, Sarbet, Wonji..."
                  value={formData.locality}
                  onChange={e => setFormData({ ...formData, locality: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {isAmharic ? 'የማስመዝገቢያ አይነት (Purpose)' : 'Listing Purpose'} *
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500"
                  value={formData.purpose}
                  onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                >
                  <option value="rent">{t.tabRent}</option>
                  <option value="buy">{t.tabBuy}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {t.labelType} (Flat / House) *
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500"
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
                  {isAmharic ? 'ዋጋ በብር (Price in ETB)' : 'Price (in ETB)'} *
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. 45000 (Rent) or 15000000 (Buy)"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. 140"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500"
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

            {/* Image Uploader Component */}
            <div className="pt-2">
              <ImageUploader
                images={images}
                onChange={setImages}
                t={t}
                lang={lang}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {isAmharic ? 'የባለቤቱ ስም' : 'Owner Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Almaz Kebede"
                  value={formData.ownerName}
                  onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {isAmharic ? 'የባለቤቱ ስልክ ቁጥር' : 'Owner Mobile Number'} *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. +251 911 234567"
                  value={formData.ownerPhone}
                  onChange={e => setFormData({ ...formData, ownerPhone: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{submitting ? (isAmharic ? 'በመመዝገብ ላይ...' : 'Submitting...') : (isAmharic ? 'ንብረቱን በነፃ ይለጥፉ' : 'Post Property Free')}</span>
            </button>
          </form>
        </div>

        {/* Listings List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
              <span>{t.ownersListHeading}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                {ownerProperties.length} {t.resultsCountSuffixBuy.split(' ')[0]}
              </span>
            </h2>

            {ownerProperties.length === 0 ? (
              <p className="text-sm text-gray-500 italic py-6 text-center">
                {isAmharic ? 'እስካሁን ያስመዘገቡት ንብረት የለም።' : 'No properties posted yet.'}
              </p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {ownerProperties.map(prop => (
                  <div key={prop.id || prop._id} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-emerald-200 transition-all flex gap-3 group">
                    <img
                      src={prop.image_url || (prop.images && prop.images[0])}
                      alt={prop.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          prop.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {prop.status === 'approved' ? (isAmharic ? 'የፀደቀ' : 'Live') : (isAmharic ? 'በግምገማ ላይ' : 'Pending')}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-500 uppercase">
                          {prop.property_type === 'flat' ? t.flatBadge : t.houseBadge}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {isAmharic ? (prop.title_am || prop.title) : prop.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin size={12} />
                        <span>{prop.locality}, {prop.city}</span>
                      </p>
                      <p className="text-xs font-bold text-emerald-600 mt-1">
                        {isAmharic ? (prop.price_formatted_am || `${prop.price?.toLocaleString()} ብር`) : (prop.price_formatted || `${prop.price?.toLocaleString()} ETB`)}
                      </p>
                    </div>
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
