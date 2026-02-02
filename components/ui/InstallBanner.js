'use client';

import { useState } from 'react';
import { Smartphone, X, Share, MoreVertical, PlusSquare, Download } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this utility exists, otherwise standard class strings work

export default function InstallBanner() {
  const [isOpen, setIsOpen] = useState(false);
  
  // You might want to persist closing state in localStorage if the user dismisses it permanently,
  // but requirements didn't specify that so we keep it simple.

  return (
    <>
      {/* Banner */}
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-blue-50 border-b border-blue-100 p-3 cursor-pointer relative z-50 flex items-center justify-between gap-3 shadow-sm hover:bg-blue-100 transition-colors"
        dir="rtl"
      >
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                  <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                  <p className="text-sm font-bold text-blue-900 mb-0.5">
                    📱 اجعلي التطبيق دائماً أمام عينيكِ
                  </p>
                  <p className="text-xs text-blue-700">
                    ثبّتيه على شاشتك الرئيسية للوصول السريع
                  </p>
              </div>
          </div>
          {/* Arrow indicating action */}
          <div className="bg-white/50 p-1.5 rounded-lg">
             <Download className="w-4 h-4 text-blue-600" />
          </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#33AB98]" />
                خطوات التثبيت
              </h3>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 max-h-[80vh] overflow-y-auto">
              
              {/* iPhone Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 text-black">
                   <span className="text-xl">🍎</span>
                   <h4 className="font-bold">لمستخدمي آيفون (iPhone)</h4>
                </div>
                <ul className="space-y-3 mr-2 border-r-2 border-gray-100 pr-4">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="font-bold text-[#33AB98] ml-1">1.</span>
                    من متصفح Safari، اضغطي على أيقونة "المشاركة" <Share className="w-4 h-4 inline-block mx-1 text-blue-500" /> في الأسفل.
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="font-bold text-[#33AB98] ml-1">2.</span>
                    مرري للأعلى واختاري "إضافة إلى الشاشة الرئيسية" (Add to Home Screen) <PlusSquare className="w-4 h-4 inline-block mx-1" />.
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="font-bold text-[#33AB98] ml-1">3.</span>
                    اضغطي على "إضافة" (Add) في الأعلى.. ومبروك! 🎉
                  </li>
                </ul>
              </div>

              {/* Android Section */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3 text-black">
                   <span className="text-xl">🤖</span>
                   <h4 className="font-bold">لمستخدمي أندرويد (Android)</h4>
                </div>
                <ul className="space-y-3 mr-2 border-r-2 border-gray-100 pr-4">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="font-bold text-[#33AB98] ml-1">1.</span>
                    من متصفح Chrome، اضغطي على الثلاث نقاط <MoreVertical className="w-4 h-4 inline-block mx-1 text-gray-500" /> في أعلى اليسار.
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="font-bold text-[#33AB98] ml-1">2.</span>
                    اختاري "تثبيت التطبيق" (Install App) أو "إضافة إلى الشاشة الرئيسية".
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="font-bold text-[#33AB98] ml-1">3.</span>
                    اضغطي "تثبيت"، وسيظهر لكِ التطبيق فوراً. 🚀
                  </li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 text-center">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#33AB98] text-white font-bold py-3 rounded-xl hover:bg-[#2A9A84] transition-colors"
              >
                حسنًا، فهمت
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
