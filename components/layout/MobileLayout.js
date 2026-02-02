 'use client';
 
import { useChild } from '@/contexts/ChildContext';
import { BottomNav } from './BottomNav';
import { cn } from '@/lib/utils';

export default function MobileLayout({ children, dir = 'rtl', hideBottomNav = false }) {
  const { activeGender } = useChild();
  const themeClass = activeGender === 'female' ? 'theme-female' : activeGender === 'male' ? 'theme-male' : 'theme-default';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClass}`}>
      <div className="bg-[var(--bg-page)] min-h-screen flex justify-center ">
        <div className={cn("w-full max-w-md bg-white min-h-screen shadow-xl relative", !hideBottomNav && "pb-24")} dir={dir}>
          {children}
          {!hideBottomNav && <BottomNav />}
        </div>
      </div>
    </div>
  );
}

