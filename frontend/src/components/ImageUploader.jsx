import React, { useState } from 'react';
import { Upload, Image as ImageIcon, X, Plus, Sparkles, Check } from 'lucide-react';

const SAMPLE_ETHIOPIAN_PHOTOS = [
  {
    name_en: "Bole Modern Flat",
    name_am: "የቦሌ ዘመናዊ አፓርታማ",
    url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
  },
  {
    name_en: "Old Airport Luxury Villa",
    name_am: "ኦልድ ኤርፖርት ቪላ",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    name_en: "Adama Green Residence",
    name_am: "የአዳማ መኖሪያ ቤት",
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
  },
  {
    name_en: "Spacious Living Room",
    name_am: "ሰፊ ሳሎን",
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
  },
  {
    name_en: "European Modular Kitchen",
    name_am: "ዘመናዊ አውሮፓውያን ኩሽና",
    url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
  }
];

export default function ImageUploader({ 
  images = [], 
  onChange, 
  t, 
  lang 
}) {
  const [urlInput, setUrlInput] = useState('');

  // Handle local file selection and convert to Base64
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      // Check file size (limit to ~4MB per image)
      if (file.size > 4 * 1024 * 1024) {
        alert(lang === 'am' ? 'የፎቶው መጠን ከ4 ሜጋባይት ማነስ አለበት' : 'Image size must be under 4MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onChange([...images, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = ''; // Reset input
  };

  // Add custom URL
  const handleAddUrl = () => {
    if (urlInput && urlInput.trim()) {
      onChange([...images, urlInput.trim()]);
      setUrlInput('');
    }
  };

  // Remove photo
  const handleRemove = (index) => {
    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  // Add sample photo
  const handleAddSample = (sampleUrl) => {
    if (!images.includes(sampleUrl)) {
      onChange([...images, sampleUrl]);
    }
  };

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          {t?.imgUploadTitle || 'Property Photos & Images (የቤት ፎቶዎች)'}
        </label>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          {images.length} {t?.imgSelectedCount || 'photos'}
        </span>
      </div>

      <p className="text-xs text-gray-500">
        {t?.imgUploadDesc || 'Upload images directly from your device or add image URLs:'}
      </p>

      {/* File Upload Button + URL Input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 border-dashed cursor-pointer transition-colors shadow-sm">
          <Upload className="w-4 h-4 text-emerald-600" />
          <span>{t?.imgUploadBtn || 'Upload from Device'}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <div className="flex gap-2">
          <input
            type="url"
            placeholder={t?.imgUrlPlaceholder || 'https://images.unsplash.com/...'}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t?.imgAddUrlBtn || 'Add'}</span>
          </button>
        </div>
      </div>

      {/* Curated Sample Photos Chips */}
      <div>
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{t?.imgSamplesTitle || 'Quick Tap Sample Photos:'}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_ETHIOPIAN_PHOTOS.map((sample, idx) => {
            const isAdded = images.includes(sample.url);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddSample(sample.url)}
                disabled={isAdded}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                  isAdded
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 opacity-60'
                    : 'bg-white hover:bg-emerald-50 text-gray-700 border-gray-300 hover:border-emerald-300'
                }`}
              >
                {isAdded ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-gray-400" />}
                <span>{lang === 'am' ? sample.name_am : sample.name_en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Image Gallery Preview Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-300 bg-gray-100 aspect-video">
              <img
                src={img}
                alt={`Uploaded photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {idx === 0 && (
                <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-full opacity-80 group-hover:opacity-100 transition-colors shadow"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
