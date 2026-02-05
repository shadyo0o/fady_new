'use client'

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-4 py-4 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-x-6 gap-y-3">
        <Link href="/about" className="text-sm text-gray-500 hover:text-[#33AB98] transition-colors">من نحن</Link>
        <Link href="/contact" className="text-sm text-gray-500 hover:text-[#33AB98] transition-colors">اتصل بنا</Link>
        <Link href="/privacy" className="text-sm text-gray-500 hover:text-[#33AB98] transition-colors">سياسة الخصوصية</Link>
        <Link href="/refund" className="text-sm text-gray-500 hover:text-[#33AB98] transition-colors">سياسة الاسترجاع</Link>
        <Link href="/shipping" className="text-sm text-gray-500 hover:text-[#33AB98] transition-colors">سياسة الشحن</Link>
      </div>
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Fady's Vaccines. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}
