import React, { useState, useEffect } from 'react';
import { Building, PlusCircle, CheckCircle2, MapPin, Calendar, Layers, Phone, AlertTriangle, Clock } from 'lucide-react';
import ImageUploader from './ImageUploader';

export default function DeveloperPortal({ 
  lang, 
  t, 
  apiBase, 
  currentUser 
}) {
  const isAmharic = lang === 'am';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    developerName: currentUser?.company || 'Ayat Real Estate',
    developerName_am: currentUser?.company || 'አያት ሪል እስቴት',
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
    contactPhone: currentUser?.phone || '+251 911 445566'
  });

  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
  ]);

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
      const selectedImages = images.length > 0 ? images : [formData.image_url];

      const res = await fetch(`${apiBase}/api/developer-projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image_url: selectedImages[0],
          images: selectedImages,
          city_am: formData.city === 'Addis Ababa' ? 'አዲስ አበባ' : 'አዳማ'
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit developer project.');
      }

      setSuccessMsg(
        isAmharic
          ? 'የሪል እስቴት ፕሮጀክቱ በተሳካ ሁኔታ ተመዝግቧል!'
          : 'Developer project registered successfully!'
      );

      // Refresh list
      fetchProjects();

      // Reset
      setFormData(prev => ({
        ...prev,
        projectName: '',
        projectName_am: '',
        description: '',
        description_am: ''
      }));
    } catch (err) {
      setErrorMsg(err.message || 'Error creating project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="portal-header flex items-center gap-4 mb-6">
        <div className="portal-icon-wrapper w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-50 text-purple-600 shadow-sm border border-purple-100">
          <Building size={30} />
        </div>
        <div>
          <h1 className="portal-title text-2xl sm:text-3xl font-extrabold text-gray-900">{t.developersTitle}</h1>
          <p className="portal-subtitle text-sm text-gray-600">{t.developersSubtitle}</p>
        </div>
      </div>

      <div className="portal-grid grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <PlusCircle size={22} className="text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">{t.developersFormHeading}</h2>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {isAmharic ? 'የአልሚው ስም' : 'Developer Name'} *
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-purple-500"
                  value={formData.developerName}
                  onChange={e => setFormData({ ...formData, developerName: e.target.value })}
                >
                  <option value="Ayat Real Estate">Ayat Real Estate (አያት)</option>
                  <option value="Tsehay Real Estate">Tsehay Real Estate (ፀሐይ)</option>
                  <option value="Noah Real Estate">Noah Real Estate (ኖህ)</option>
                  <option value="Flintstone Homes">Flintstone Homes (ፍሊንትስቶን)</option>
                  <option value="Gift Real Estate">Gift Real Estate (ጊፍት)</option>
                  <option value="Metropolitan Real Estate">Metropolitan Real Estate (ሜትሮፖሊታን)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {isAmharic ? 'የከተማ ስም' : 'City'} *
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-purple-500"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                >
                  <option value="Addis Ababa">{t.addisAbaba}</option>
                  <option value="Adama">{t.adama}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {isAmharic ? 'የፕሮጀክቱ ስም በእንግሊዝኛ' : 'Project Name (English)'} *
              </label>
              <input
                type="text"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. Ayat Hilltop Luxury G+2 Villas"
                value={formData.projectName}
                onChange={e => setFormData({ ...formData, projectName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {t.labelLocality} *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. CMC, Bole Atlas, Wonji..."
                  value={formData.locality}
                  onChange={e => setFormData({ ...formData, locality: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {isAmharic ? 'የዋጋ ክልል በብር' : 'Price Range (ETB)'} *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. 18,000,000 - 45,000,000 ETB"
                  value={formData.priceRange}
                  onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {isAmharic ? 'ጠቅላላ ቤቶች' : 'Total Units'}
                </label>
                <input
                  type="number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500"
                  value={formData.totalUnits}
                  onChange={e => setFormData({ ...formData, totalUnits: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {isAmharic ? 'ያልተሸጡ ቤቶች' : 'Available Units'}
                </label>
                <input
                  type="number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500"
                  value={formData.availableUnits}
                  onChange={e => setFormData({ ...formData, availableUnits: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {isAmharic ? 'የማስረከቢያ ዓመት' : 'Handover Year'}
                </label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500"
                  placeholder="2026 Q4"
                  value={formData.handoverYear}
                  onChange={e => setFormData({ ...formData, handoverYear: e.target.value })}
                />
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

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {isAmharic ? 'የሽያጭ ክፍል ስልክ' : 'Sales Phone'}
              </label>
              <input
                type="tel"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500"
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{submitting ? (isAmharic ? 'በመመዝገብ ላይ...' : 'Submitting...') : (isAmharic ? 'ፕሮጀክቱን ያስመዝግቡ' : 'Register Project')}</span>
            </button>
          </form>
        </div>

        {/* Existing Projects Showcase */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
              <span>{t.developersProjectsHeading}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold">
                {projects.length} {isAmharic ? 'ፕሮጀክቶች' : 'Projects'}
              </span>
            </h2>

            {loading ? (
              <p className="text-sm text-gray-500 italic py-6 text-center">{t.searching}</p>
            ) : projects.length === 0 ? (
              <p className="text-sm text-gray-500 italic py-6 text-center">
                {isAmharic ? 'ምንም ፕሮጀክት አልተገኘም።' : 'No developer projects registered yet.'}
              </p>
            ) : (
              <div className="space-y-4 max-h-[650px] overflow-y-auto pr-1">
                {projects.map(proj => (
                  <div key={proj.id || proj._id} className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50 hover:bg-white hover:border-purple-200 transition-all shadow-sm">
                    <img
                      src={proj.image_url || (proj.images && proj.images[0])}
                      alt={proj.projectName}
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-purple-700 px-2 py-0.5 rounded bg-purple-50 border border-purple-200">
                          {proj.developerName}
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{proj.handoverYear}</span>
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mt-1">
                        {isAmharic ? (proj.projectName_am || proj.projectName) : proj.projectName}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        <span>{proj.locality}, {proj.city}</span>
                      </p>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-700">
                          {isAmharic ? (proj.priceRange_am || proj.priceRange) : proj.priceRange}
                        </span>
                        <span className="text-gray-500">
                          {proj.availableUnits} / {proj.totalUnits} {isAmharic ? 'ክፍት ቤቶች' : 'available'}
                        </span>
                      </div>
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
