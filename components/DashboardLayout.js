'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthProvider } from '../contexts/AuthContext';
import NotificationManager from './NotificationManager';

import { useChild } from '../contexts/ChildContext';
import { Shield, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function SubscriptionBanner({ pathname }) {
  const { user } = useAuth();
  const allowedPaths = ['/home', '/profile', '/edit-profile', '/subscription', '/auth/signin', '/auth/signup'];
  const isAllowedPage = allowedPaths.some(p => pathname.startsWith(p));
  const end = user?.subscriptionEndDate ? new Date(user.subscriptionEndDate) : null;
  const isActive = (user?.isSubscribed === true) || (end && end.getTime() > Date.now());
  if (isActive || isAllowedPage) return null;
  return (
    <div className="mb-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#33AB98] to-[#2b9a88] text-white shadow-xl border border-white/10">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="p-5 flex items-start gap-4 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base mb-1">يجب دفع الاشتراك أولاً</h3>
            <p className="text-sm text-blue-50">للوصول إلى هذه الخدمة، يرجى الاشتراك لتفعيل حسابك والاستفادة من جميع المزايا.</p>
          </div>
          <a href="/subscription" className="flex-shrink-0">
            <button className="flex items-center gap-2 bg-white text-[#33AB98] hover:bg-blue-50 font-bold text-sm px-4 py-2 rounded-xl shadow-lg">
              <Crown className="w-4 h-4" />
              اشترك الآن
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { activeGender } = useChild();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // Safe pathname check
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : 'https://wa.me';
  
  const isAuthPage = pathname.includes('/auth/');

  const themeClass = activeGender === 'female' ? 'theme-female' : activeGender === 'male' ? 'theme-male' : 'theme-default';

  if (isAuthPage) {
      return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      {/* تأكيد تحديث حالة الاشتراك عند دخول أي صفحة */}
      {typeof window !== 'undefined' && <Updater />}
      <NotificationManager />
      <div className={`min-h-screen transition-colors duration-300 ${themeClass}`}>
        <div className="bg-[var(--bg-page)] min-h-screen">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <main className="p-4 md:p-6 max-w-7xl mx-auto">
            <SubscriptionBanner pathname={pathname} />
            {children}
          </main>
          {/* WhatsApp Floating Button */}
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="fixed z-50 bottom-24 right-6 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
            title="تواصل معنا عبر واتساب"
          >
            <div className="absolute -top-16 right-0 bg-white text-gray-800 text-[10px] sm:text-xs font-bold px-3 py-2 rounded-xl shadow-xl transition-all whitespace-nowrap border-2 border-[#33AB98]/20 flex items-center gap-2 animate-bounce-subtle">
              <span className="flex-shrink-0">محتاج مساعدة؟ فريق فادي معاك للاستفسار🛡️</span>
              <div className="absolute -bottom-2 right-5 w-4 h-4 bg-white border-r-2 border-b-2 border-[#33AB98]/20 rotate-45 transform translate-y-[-2px]"></div>
            </div>
            <svg 
              viewBox="0 0 24 24" 
              className="w-8 h-8 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.445L.057 24l6.187-1.622c1.446.788 3.06 1.205 4.704 1.206h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </a>
        </div>
      </div>
    </AuthProvider>
  );
}

function Updater() {
  const { refreshUser } = useAuth();
  useEffect(() => {
    refreshUser?.();
  }, []);
  return null;
}
