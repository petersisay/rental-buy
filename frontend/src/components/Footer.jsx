import React, { useState } from 'react';
import { 
  Building2, Home, MapPin, Phone, Mail, Globe, 
  ShieldCheck, Send, CheckCircle2, AlertCircle, 
  ArrowUpRight, ExternalLink, HelpCircle, FileText, 
  Lock, X, Sparkles, Key, Briefcase, Building
} from 'lucide-react';
import KedamiLogo from './KedamiLogo';

export default function Footer({
  lang = 'am',
  t,
  onNavigate,
  onFilterLocality
}) {
  const isAmharic = lang === 'am';

  // Helper to immediately scroll to header/top on footer clicks
  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  const handleFooterNavigate = (portal, options) => {
    scrollToTop();
    if (onNavigate) onNavigate(portal, options);
  };

  const handleFooterFilter = (city, locality) => {
    scrollToTop();
    if (onFilterLocality) onFilterLocality(city, locality);
  };

  // State for Information Modals (Terms, Privacy, Safety, FAQ)
  const [activeModal, setActiveModal] = useState(null); // 'terms', 'privacy', 'safety', 'faq'

  // Modal content dictionary
  const legalDocs = {
    terms: {
      title: isAmharic ? 'የቀዳሚ የአገልግሎት ውል (Terms of Service)' : 'Kedami Terms of Service',
      content: isAmharic ? [
        '1. ቀዳሚ (Kedami) በኢትዮጵያ ውስጥ የተረጋገጡ የመኖሪያ ቤቶችን፣ አፓርታማዎችንና ቪላዎችን ለመግዛት ወይም ለመከራየት የቀረበ ህጋዊ የቴክኖሎጂ መድረክ ነው።',
        '2. የቤት ባለቤቶች፣ ደላላዎች እና አልሚዎች የሚለጥፏቸው መረጃዎች ትክክለኛና ህጋዊ የይዞታ ማረጋገጫ ያላቸው መሆን አለባቸው።',
        '3. ማንኛውም ተጠቃሚ መለያ ሲፈጥር እውነተኛ መረጃ የመስጠት ግዴታ አለበት። አሳሳች መረጃ የያዙ መለያዎች በሲስተም አስተዳዳሪው ወዲያውኑ ይሰረዛሉ።',
        '4. የገንዘብ ክፍያዎችና የውል ስምምነቶች በሻጭና በገዢ ወይም በአከራይና በተከራይ መካከል በህጋዊ የውል ሰነድ አማካኝነት የሚፈጸሙ ናቸው።'
      ] : [
        '1. Kedami is Ethiopia\'s premier real estate technology marketplace connecting verified property seekers, owners, brokers, and developers across Addis Ababa and Adama.',
        '2. All listed properties must possess verifiable legal ownership documents or licensed agency brokerage mandates.',
        '3. Users must provide truthful profile credentials. Deceptive or fraudulent accounts are terminated upon administrative audit.',
        '4. Lease and purchase financial transactions occur through official Ethiopian banking channels and notarized agreements.'
      ]
    },
    privacy: {
      title: isAmharic ? 'የግላዊነት ፖሊሲ (Privacy Policy)' : 'Kedami Privacy Policy',
      content: isAmharic ? [
        '1. የተጠቃሚዎች የግል መረጃ (ስም፣ ስልክ ቁጥር፣ ኢሜይል) ጥብቅ በሆነ የደህንነት ስርዓት የተጠበቀ ነው።',
        '2. መረጃዎ ለሶስተኛ ወገን ለማስታወቂያ ወይም ለንግድ አላማ ተላልፎ አይሰጥም።',
        '3. የደንበኞች የጉብኝትና የኪራይ/ግዢ ጥያቄዎች የሚደርሱት ለተመረጠው የቤቱ ባለቤት ወይም ለተረጋገጠው ደላላ ብቻ ነው።',
        '4. ተጠቃሚዎች በማንኛውም ጊዜ የግል መረጃቸውን የማረም ወይም መለያቸውን የመዝጋት ሙሉ መብት አላቸው።'
      ] : [
        '1. User personal credentials (names, contact numbers, email addresses) are encrypted and strictly protected.',
        '2. We do not sell, rent, or lease personal customer data to external advertising third parties.',
        '3. Inspection inquiries and tour bookings are securely transmitted solely to the respective verified property lister.',
        '4. Users retain full rights to inspect, update, or purge their profile records at any time.'
      ]
    },
    safety: {
      title: isAmharic ? 'የደህንነት እና ማረጋገጫ መመሪያ (Safety & Verification Guidelines)' : 'Safety & Verification Guidelines',
      content: isAmharic ? [
        '1. ቤት በአካል ሳያዩ ወይም ህጋዊ የይዞታ ሰነድ ሳያረጋግጡ ማንኛውንም የቅድመ ክፍያ ገንዘብ አይላኩ።',
        '2. በሲስተሙ የተረጋገጠ ባጅ (Admin Verified) ያላቸውን ቤቶችና ፈቃድ ያላቸውን ደላላዎች ይምረጡ።',
        '3. ማንኛውም አጠራጣሪ እንቅስቃሴ ሲያጋጥምዎት ወዲያውኑ ለቀዳሚ ሲስተም አስተዳዳሪ ጥቆማ ይስጡ።',
        '4. የኪራይና የግዢ ውሎችን በህጋዊ የሰነዶች ማረጋገጫና ምዝገባ ኤጀንሲ (Vital Events / Notary) በኩል ያጽድቁ።'
      ] : [
        '1. Never transfer advance funds or reservation deposits before in-person inspection and physical title-deed verification.',
        '2. Look for the "Admin Verified" badge on listings and licensed broker accreditations.',
        '3. Report suspicious listings or unauthorized broker solicitations directly to Kedami administrators.',
        '4. Finalize all lease or sale contracts through accredited Ethiopian public notary and vital registry offices.'
      ]
    },
    faq: {
      title: isAmharic ? 'ተደጋጋሚ ጥያቄዎች (Frequently Asked Questions)' : 'Frequently Asked Questions (FAQ)',
      content: isAmharic ? [
        'ጥ፦ በደንበኝነት ለመጠቀም ክፍያ ይጠየቃል? መልስ፦ በፍጹም! ለተከራዮችና ለገዢዎች ቤቶችን መፈለግ፣ መምረጥና ጥያቄ መላክ 100% ነፃ ነው።',
        'ጥ፦ በ Google አካውንቴ እንዴት መግባት እችላለሁ? መልስ፦ በመነሻ ገጹ ወይም በመግቢያው ላይ "በ Google ይግቡ" የሚለውን በመጫን ያለ አስተዳዳሪ ማረጋገጫ በቀጥታ መግባት ይችላሉ።',
        'ጥ፦ ቤት ለመለጠፍ ምን ያስፈልጋል? መልስ፦ የቤት ባለቤት፣ ፈቃድ ያለው ደላላ ወይም የሪል እስቴት አልሚ ሆነው በመመዝገብ በአስተዳዳሪው ሲጸድቅ በነጻ መለጠፍ ይችላሉ።',
        'ጥ፦ በየትኞቹ ከተሞች ነው አገልግሎት የምትሰጡት? መልስ፦ በአሁኑ ወቅት በአዲስ አበባ እና በአዳማ ውስጥ ያሉ ምርጥ የመኖሪያ ቤቶችን በስፋት እናቀርባለን።'
      ] : [
        'Q: Is using Kedami free for customers? A: Yes! Searching, scheduling tours, and submitting rent or buy inquiries is 100% free.',
        'Q: How does direct Google login work? A: Simply click "Continue with Google" on the login page to access your customer dashboard instantly without admin review.',
        'Q: How can I post a property? A: Register as a Property Owner, Broker, or Developer. Once verified by our admin, you can post properties with multiple photos.',
        'Q: Which cities are covered? A: We currently feature premium verified properties across Addis Ababa and Adama.'
      ]
    }
  };

  return (
    <footer className="footer bg-slate-950 text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* ========================================================= */}
        {/* TOP ROW: BRAND & INTERACTIVE CONTACT POINTS              */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => handleFooterNavigate('landing')} 
              className="cursor-pointer inline-block group"
              title={isAmharic ? 'ወደ መነሻ ገጽ ተመለስ' : 'Return to Home'}
            >
              <KedamiLogo 
                variant="image" 
                size="md" 
                showSubtitle={true} 
                isDark={true}
                lang={lang} 
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              {t.footerAbout || 'ቀዳሚ (Kedami) በኢትዮጵያ ውስጥ ገዢዎችን፣ ተከራዮችን እና የሪል እስቴት አልሚዎችን የሚያገናኝ ቀዳሚው ዘመናዊ የቤት መፈለጊያ ቴክኖሎጂ ነው።'}
            </p>

            {/* Direct Contact Links */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 text-xs">
              <a
                href="tel:+251911001122"
                className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold transition-colors"
                title="Call Kedami Support"
              >
                <Phone className="w-4 h-4 text-teal-400" />
                <span>+251 911 001122</span>
              </a>

              <a
                href="mailto:support@kedami.et"
                className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold transition-colors"
                title="Email Kedami Help Desk"
              >
                <Mail className="w-4 h-4 text-teal-400" />
                <span>support@kedami.et</span>
              </a>

              <a
                href="https://t.me/kedami_et"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 font-semibold transition-colors"
                title="Telegram Channel"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span>@kedami_et</span>
              </a>
            </div>
          </div>

          {/* Column 2: Addis Ababa Properties Links */}
          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.footerAddisTitle || 'የአዲስ አበባ ቤቶች'}</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterFilter('Addis Ababa', 'Bole')}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-emerald-400 transition-colors"></span>
                  <span>{isAmharic ? 'በቦሌ የሚሸጡ አፓርታማዎች' : 'Flats for Sale in Bole'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterFilter('Addis Ababa', 'Kazanchis')}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-emerald-400 transition-colors"></span>
                  <span>{isAmharic ? 'በካዛንቺስ የሚከራዩ ቤቶች' : 'Apartments in Kazanchis'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterFilter('Addis Ababa', 'CMC')}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-emerald-400 transition-colors"></span>
                  <span>{isAmharic ? 'በሲኤምሲ ፀሐይ ቪላዎች' : 'Villas in CMC Tsehay'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterFilter('Addis Ababa', 'Old Airport')}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-emerald-400 transition-colors"></span>
                  <span>{isAmharic ? 'በኦልድ ኤርፖርት የቅንጦት ቤቶች' : 'Luxury Homes in Old Airport'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterFilter('Addis Ababa', 'Sarbet')}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-emerald-400 transition-colors"></span>
                  <span>{isAmharic ? 'በሳርቤት የተሟሉ አፓርታማዎች' : 'Furnished Flats in Sarbet'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterFilter('Addis Ababa', 'Ayat')}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-emerald-400 transition-colors"></span>
                  <span>{isAmharic ? 'በአያትና ሰሚት ዘመናዊ ቤቶች' : 'Modern Homes in Ayat'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Adama Properties Links */}
          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.footerAdamaTitle || 'የአዳማ ቤቶች'}</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterFilter('Adama', 'Bole')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-amber-400 transition-colors"></span>
                  <span>{isAmharic ? 'በቦሌ ክ/ከተማ አዳማ ቪላዎች' : 'Villas in Bole, Adama'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterFilter('Adama', 'Dembela')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-amber-400 transition-colors"></span>
                  <span>{isAmharic ? 'በደምበላ የሚከራዩ ቤቶች' : 'Flats for Rent in Dembela'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterFilter('Adama', 'Posta Bet')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-amber-400 transition-colors"></span>
                  <span>{isAmharic ? 'በፖስታ ቤት ሰፈር ቤቶች' : 'Homes near Posta Bet'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterFilter('Adama', 'Wonji Road')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-amber-400 transition-colors"></span>
                  <span>{isAmharic ? 'በወንጂ መንገድ ቤቶች' : 'Houses on Wonji Road'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterFilter('Adama', 'Boku')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-amber-400 transition-colors"></span>
                  <span>{isAmharic ? 'በቦኩ ሰፈር ተመጣጣኝ ቤቶች' : 'Affordable Homes in Boku'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterFilter('Adama', 'Geda')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-amber-400 transition-colors"></span>
                  <span>{isAmharic ? 'በጌዳ ሰፈር አዳዲስ ቤቶች' : 'New Homes in Geda'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Role Portals & Quick Navigation Links */}
          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.footerPortalsTitle || 'የፖርታሎች አገናኞች'}</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterNavigate('customer')}
                  className="hover:text-teal-400 transition-colors text-left flex items-center gap-1.5 group text-teal-300 font-bold"
                >
                  <Key className="w-3.5 h-3.5 text-teal-400" />
                  <span>{t.footerCustomerPortal || 'የደንበኞች ፖርታል (ኪራይና ግዢ)'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterNavigate('search')}
                  className="hover:text-teal-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <Home className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400" />
                  <span>{t.footerAllProperties || 'ሁሉንም 20+ ቤቶች ያስሱ'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterNavigate('owners')}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                  <span>{t.footerOwnerPortal || 'የቤት ባለቤቶች (0% ኮሚሽን)'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterNavigate('agents')}
                  className="hover:text-blue-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <Briefcase className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
                  <span>{t.footerAgentPortal || 'ደላላዎችና ወኪሎች'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterNavigate('developers')}
                  className="hover:text-purple-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <Building className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
                  <span>{t.footerDeveloperPortal || 'የሪል እስቴት አልሚዎች'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleFooterNavigate('admin')}
                  className="hover:text-rose-400 transition-colors text-left flex items-center gap-1.5 group"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400" />
                  <span>{t.footerAdminPortal || 'የሲስተም አስተዳዳሪ'}</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* ========================================================= */}
        {/* BOTTOM ROW: TRUST, LEGAL LINKS & COPYRIGHT                */}
        {/* ========================================================= */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          {/* Copyright */}
          <div>
            <span>{t.footerCopyright || '© 2026 ቀዳሚ (Kedami) • በMERN Stack የተሰራ።'}</span>
          </div>

          {/* Legal Links (Clickable Modals) */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-medium">
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="hover:text-slate-300 transition-colors underline decoration-slate-700 underline-offset-4"
            >
              {t.footerTerms || 'የአገልግሎት ውል'}
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="hover:text-slate-300 transition-colors underline decoration-slate-700 underline-offset-4"
            >
              {t.footerPrivacy || 'የግላዊነት ፖሊሲ'}
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('safety')}
              className="hover:text-slate-300 transition-colors underline decoration-slate-700 underline-offset-4"
            >
              {t.footerSecurity || 'የደህንነት መመሪያ'}
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('faq')}
              className="hover:text-slate-300 transition-colors underline decoration-slate-700 underline-offset-4"
            >
              {t.footerFaq || 'ተደጋጋሚ ጥያቄዎች (FAQ)'}
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE LEGAL & TRUST MODAL DIALOG                    */}
      {/* ========================================================= */}
      {activeModal && legalDocs[activeModal] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in text-gray-900">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-gray-950">
                {legalDocs[activeModal].title}
              </h3>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-gray-600 leading-relaxed py-2 border-y border-gray-100">
              {legalDocs[activeModal].content.map((paragraph, idx) => (
                <p key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100/80">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-colors"
              >
                {isAmharic ? 'ተረዳሁ (Close)' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
