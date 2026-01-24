'use client';

import Link from 'next/link';
import { Home, LayoutDashboard, BookOpen, Baby, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'الرئيسية', path: '/home' },
    { icon: BookOpen, label: 'قصة فادي', path: '/story' },
    { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/dashboard', highlight: true },
    { icon: Baby, label: 'أطفالي', path: '/childs' },
    { icon: User, label: 'حسابي', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-md bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-6 py-2 pointer-events-auto">
        <div className="flex items-center justify-between">
          {navItems.map((item) => {
             const isActive = pathname === item.path;
             return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                  isActive ? 'text-[#33AB98]' : 'text-gray-400 hover:text-gray-600'
                } ${item.highlight ? '-mt-8' : ''}`}
              >
                {item.highlight ? (
                  <div className="w-14 h-14 bg-[#33AB98] rounded-full flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-[#357ABD] transition-colors text-white">
                    <item.icon size={24} />
                  </div>
                ) : (
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                )}
                {!item.highlight && (
                    <span className="text-[10px] font-medium">{item.label}</span>
                )}
              </Link>
             );
          })}
        </div>
      </div>
    </div>
  );
};
