import React from 'react';

/**
 * KedamiLogo: Premium Royal Crowned Ethiopian Logo
 * Combines the stylized word "ቀዳሚ" with the Royal Golden Crown on "ቀ",
 * the 4-point shining star, and the dynamic golden/silver swoosh.
 *
 * Props:
 * - variant: 'image' | 'svg' | 'badge' (defaults to 'image' using user's royal reference artwork)
 * - size: 'sm' (h-8) | 'md' (h-10) | 'lg' (h-14) | 'xl' (h-20)
 * - showSubtitle: boolean (renders 'የኢትዮጵያ ቁጥር 1 የቤት መድረክ' / 'Ethiopia's #1 Property Portal')
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
    sm: 'h-8',
    md: 'h-10 sm:h-11',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24'
  };

  const badgeSizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-2xl',
    xl: 'w-20 h-20 text-3xl'
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 1. Main Logo Graphic */}
      {variant === 'image' ? (
        <div className="relative group flex items-center">
          <div className="relative overflow-hidden rounded-xl bg-slate-950 p-1 shadow-md shadow-amber-900/10 border border-amber-500/20 transition-transform duration-300 group-hover:scale-105">
            <img
              src="/assets/kedami-logo.jpg"
              alt="ቀዳሚ (Kedami) Logo"
              className={`${heightClasses[size]} w-auto object-contain rounded-lg`}
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
            className={`${heightClasses[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
          />
        </div>
      ) : (
        /* Crowned Badge Variant */
        <div className={`relative ${badgeSizeClasses[size]} rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-white font-black shadow-lg shadow-amber-500/25 border border-yellow-200/50`}>
          {/* Mini Crown */}
          <span className="absolute -top-2 text-xs filter drop-shadow">👑</span>
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
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 uppercase tracking-wider shadow-xs font-mono">
              ET
            </span>
          </div>
          <span
            className={`text-[11px] font-medium tracking-tight mt-1 truncate ${
              isDark ? 'text-amber-200/80' : 'text-gray-500'
            }`}
          >
            {isAmharic ? 'የኢትዮጵያ ቁጥር 1 የቤት መድረክ' : "Ethiopia's #1 Real Estate"}
          </span>
        </div>
      )}
    </div>
  );
}
