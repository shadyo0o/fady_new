'use client';

import { useState } from 'react';
import { MapPin, X, Check, Info } from 'lucide-react';
import { HEALTH_OFFICES } from '@/lib/constants';

export default function OfficeSelector({ selectedOffice, onSelectOffice }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleSelect = (office) => {
    onSelectOffice(office.value);
    setIsOpen(false);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(isNaN(progress) ? 0 : Math.min(progress, 100));
  };

  const selectedOfficeLabel = HEALTH_OFFICES.find(o => o.value === selectedOffice)?.label || 'اختر المكتب';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group w-full text-right"
      >
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform mx-auto">
          <MapPin className="w-5 h-5 text-[#33AB98]" />
        </div>
        <h3 className="font-bold text-gray-800 text-sm">اختيار المكتب</h3>
        <p className="text-xs text-gray-500 mt-1">{selectedOfficeLabel}</p>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-white h-screen w-full max-w-md flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 ease-out"
          >
            {/* Sticky Header with Scroll Progress */}
            <div className="relative bg-white">
              <div className="p-5 flex justify-between items-center border-b border-gray-100">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#2C3E50]">قائمة المكاتب الصحية</h3>
                  <p className="text-xs text-gray-500 mt-1">اختر مكتب الصحة المتابع معه</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Scroll Progress Bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full">
                <div 
                  className="h-full bg-gradient-to-r from-[#33AB98] to-blue-500 transition-all duration-150 ease-out rounded-full"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div 
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-5 bg-gray-50/50"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="space-y-4 pb-6">
              {HEALTH_OFFICES.map((office, index) => {
                const isShubra = office.value === 'رعاية_طفل_شبرا_ميدان_الساعة';
                const isNasser = office.value === 'مكتب_طبي_ناصر_المركز_الطبي';
                const isSaad = office.value === 'مكتب_صحة_طبي_سعد';
                const isSelected = selectedOffice === office.value;

                return (
                  <div 
                    key={office.value} 
                    className="space-y-3 animate-in slide-in-from-right-5 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Office Button */}
                    <button
                      onClick={() => handleSelect(office)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-right group relative overflow-hidden ${
                        isSelected
                          ? 'border-[#33AB98] bg-gradient-to-l from-[#33AB98]/10 to-white shadow-md shadow-[#33AB98]/20'
                          : 'border-gray-200 bg-white hover:border-[#33AB98]/40 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3 text-right">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#33AB98] text-white shadow-lg shadow-[#33AB98]/30'
                              : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-[#33AB98]'
                          }`}>
                            <MapPin className="w-5 h-5" />
                          </div>
                          <span className={`font-bold text-sm transition-colors ${
                            isSelected ? 'text-[#33AB98]' : 'text-gray-700 group-hover:text-[#2C3E50]'
                          }`}>
                            {office.label}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="bg-[#33AB98] rounded-full p-1.5">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Special Rules Info Cards */}
                    {(isShubra || isNasser || isSaad) && (
                      <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-4 mr-2 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Info className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="text-right flex-1">
                            <p className="text-xs font-bold text-blue-900 mb-2.5">مواعيد العمل والقواعد الخاصة:</p>
                            <ul className="space-y-2">
                              {isShubra && (
                                <>
                                  <li className="text-[11px] text-gray-700 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                                    <span className="flex-1">جميع التطعيمات متوفرة يومي <strong>السبت والثلاثاء</strong> فقط</span>
                                  </li>
                                  <li className="text-[11px] text-red-600 font-medium flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                                    <span className="flex-1">⚠️ تطعيم الدرن (BCG) <strong>غير متوفر</strong> في هذا المكتب</span>
                                  </li>
                                  <li className="text-[11px] text-gray-700 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                                    <span className="flex-1">تطعيم الكبدي ب متوفر <strong>طوال أيام الأسبوع</strong></span>
                                  </li>
                                </>
                              )}
                              {isNasser && (
                                <>
                                  <li className="text-[11px] text-gray-700 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                                    <span className="flex-1">تطعيمات الشلل والجرعات الدورية: <strong>السبت، الثلاثاء، الخميس</strong></span>
                                  </li>
                                  <li className="text-[11px] text-gray-700 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                                    <span className="flex-1">تطعيم الدرن (BCG): <strong>السبت والثلاثاء</strong> فقط</span>
                                  </li>
                                  <li className="text-[11px] text-gray-700 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                                    <span className="flex-1">الكبدي ب: متوفر <strong>طوال أيام الأسبوع</strong></span>
                                  </li>
                                  <li className="text-[11px] text-gray-700 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                                    <span className="flex-1">تحليل الغدة وفحص السمع: <strong>السبت والثلاثاء</strong></span>
                                  </li>
                                </>
                              )}
                              {isSaad && (
                                <>
                                  <li className="text-[11px] text-gray-700 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                                    <span className="flex-1">جميع التطعيمات متاحة يومي <strong>السبت والثلاثاء</strong></span>
                                  </li>
                                  <li className="text-[11px] text-red-600 font-medium flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                                    <span className="flex-1">⚠️ تطعيم الدرن (BCG) <strong>غير متوفر</strong> في هذا المكتب</span>
                                  </li>
                                  <li className="text-[11px] text-gray-700 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                                    <span className="flex-1">الكبدي ب: متاح <strong>طوال أيام الأسبوع</strong></span>
                                  </li>
                                  <li className="text-[11px] text-gray-700 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                                    <span className="flex-1">تحليل الغدة وفحص السمع: <strong>السبت والثلاثاء</strong></span>
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            </div>

            {/* Scroll Indicator Footer */}
            <div className="p-4 bg-white border-t border-gray-200 shadow-lg">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${scrollProgress > 75 ? 'bg-[#33AB98] scale-125 shadow-lg shadow-[#33AB98]/50' : 'bg-gray-200'}`} />
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${scrollProgress > 25 && scrollProgress <= 75 ? 'bg-[#33AB98] scale-125 shadow-lg shadow-[#33AB98]/50' : 'bg-gray-200'}`} />
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${scrollProgress <= 25 ? 'bg-[#33AB98] scale-125 shadow-lg shadow-[#33AB98]/50' : 'bg-gray-200'}`} />
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium">
                    {scrollProgress > 95 ? 'نهاية القائمة' : 'اسحب لعرض المزيد'}
                  </p>
                  <p className="text-[11px] font-bold text-[#33AB98]">
                    {HEALTH_OFFICES.length} مكاتب
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
