import React from 'react';

/**
 * KedamiLogo: Modern Ethiopian Real Estate Monogram Logo
 * Combines the iconic orange "ቀ" + "R" ligature emblem on a dark backdrop
 * with crisp typography for "ቀዳሚ (Kedami)" and the "ET" badge.
 *
 * Props:
 * - variant: 'image' | 'svg' | 'badge' (defaults to 'image' using the user's high-res monogram asset)
 * - size: 'sm' (h-8) | 'md' (h-10) | 'lg' (h-14) | 'xl' (h-20)
 * - showSubtitle: boolean (renders 'የኢትዮጵያ ቁጥር 1 የቤት መድረክ' / 'Ethiopia's #1 Real Estate')
 * - isDark: boolean (adapts typography contrast)
 * - lang: 'am' | 'en'
 */
export default function KedamiLogo({
  variant = 'image',
  size = 'md',
  showSubtitle = true,
  isDark = false,
  lang = 'am',
  className = ''
}) {
  const isAmharic = lang === 'am';

  // Size styling maps
  const heightClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10 sm:h-11 sm:w-11',
    lg: 'h-14 w-14 sm:h-16 sm:w-16',
    xl: 'h-20 w-20 sm:h-24 sm:w-24'
  };

  const badgeSizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-2xl',
    xl: 'w-20 h-20 text-3xl'
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 1. Main Monogram Graphic */}
      {variant === 'image' ? (
        <div className="relative group flex items-center">
          <div className="relative overflow-hidden rounded-2xl bg-[#12151c] p-0.5 shadow-md shadow-orange-950/20 border border-orange-500/30 transition-transform duration-300 group-hover:scale-105">
            <img
              src="/assets/kedami-logo.jpg"
              alt="ቀዳሚ (Kedami) Logo"
              className={`${heightClasses[size]} object-contain rounded-xl`}
              onError={(e) => {
                // Fallback to SVG if image fails
                e.currentTarget.src = '/kedami-logo.svg';
              }}
            />
          </div>
        </div>
      ) : variant === 'svg' ? (
        <div className="relative group flex items-center">
          <img
            src="/kedami-logo.svg"
            alt="ቀዳሚ Logo"
            className={`${heightClasses[size]} object-contain rounded-xl transition-transform duration-300 group-hover:scale-105`}
          />
        </div>
      ) : (
        /* Monogram Badge Variant */
        <div className={`relative ${badgeSizeClasses[size]} rounded-2xl bg-[#12151c] border border-orange-500/50 flex items-center justify-center text-orange-400 font-black shadow-lg shadow-orange-900/20`}>
          <span className="tracking-tighter">ቀ</span>
        </div>
      )}

      {/* 2. Text Brand & Subtitle (Optional) */}
      {showSubtitle && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`text-xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-gray-950'
              }`}
            >
              {isAmharic ? 'ቀዳሚ' : 'Kedami'}
            </span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 uppercase tracking-wider shadow-xs font-mono">
              ET
            </span>
          </div>
          <span
            className={`text-[11px] font-medium tracking-tight mt-1 truncate ${
              isDark ? 'text-orange-200/80' : 'text-gray-500'
            }`}
          >
            {isAmharic ? 'የኢትዮጵያ ቁጥር 1 የቤት መድረክ' : "Ethiopia's #1 Real Estate"}
          </span>
        </div>
      )}
    </div>
  );
}
