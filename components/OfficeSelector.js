'use client';

import { useState } from 'react';
import { MapPin, X, Check, Info } from 'lucide-react';
import { HEALTH_OFFICES } from '@/lib/constants';

export default function OfficeSelector({ selectedOffice, onSelectOffice }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (office) => {
    onSelectOffice(office.value);
    setIsOpen(false);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#2C3E50]">اختر مكتب الصحة</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-2">
              {HEALTH_OFFICES.map((office) => {
                const isShubra = office.value === 'رعاية_طفل_شبرا_ميدان_الساعة';
                return (
                  <div key={office.value} className="space-y-2">
                    <button
                      onClick={() => handleSelect(office)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-right ${
                        selectedOffice === office.value
                          ? 'border-[#33AB98] bg-[#33AB98]/5'
                          : 'border-gray-200 hover:border-[#33AB98]/50 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedOffice === office.value
                              ? 'bg-[#33AB98] text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <MapPin className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-gray-800">{office.label}</span>
                        </div>
                        {selectedOffice === office.value && (
                          <Check className="w-5 h-5 text-[#33AB98]" />
                        )}
                      </div>
                    </button>
                    {isShubra && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-right">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-blue-800">
                            <p className="font-semibold mb-1">قواعد خاصة:</p>
                            <ul className="list-disc list-inside space-y-1 pr-2">
                              <li>جميع التطعيمات متوفرة فقط يوم السبت والثلاثاء</li>
                              <li>تطعيم الدرن غير متوفر</li>
                              <li>تطعيم الكبدي متوفر طوال أيام الأسبوع</li>
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
        </div>
      )}
    </>
  );
}
