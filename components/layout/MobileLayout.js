'use client';

export default function MobileLayout({ children, dir = 'rtl' }) {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl relative" dir={dir}>
        {children}
      </div>
    </div>
  );
}
