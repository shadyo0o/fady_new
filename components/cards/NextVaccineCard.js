'use client';

import { Calendar, ChevronLeft } from 'lucide-react';

export const NextVaccineCard = ({ vaccineName, childName, dueDate, daysRemaining }) => {
  return (
    <div className="bg-[#4A90E2] rounded-2xl p-5 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-medium mb-2 border border-white/10">
            الجرعة القادمة
          </span>
          <h3 className="text-lg font-bold mb-1">{vaccineName}</h3>
          <p className="text-blue-100 text-sm">للطفل: {childName}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
          <Calendar className="w-6 h-6" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{daysRemaining}</span>
            <span className="text-sm text-blue-100">أيام<br/>متبقية</span>
        </div>
        <div className="text-left">
            <p className="text-xs text-blue-100 mb-1">تاريخ الاستحقاق</p>
            <p className="font-semibold">{dueDate.toLocaleDateString('ar-EG')}</p>
        </div>
      </div>
    </div>
  );
};
