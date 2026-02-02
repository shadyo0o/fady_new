'use client';

import { Calendar, ChevronLeft, Info } from 'lucide-react';
import Link from 'next/link';

export const NextVaccineCard = ({ vaccineName, childName, dueDate, day, daysRemaining, childId, office, warning, overdueWarning }) => {
  // Helper function to format date display
  const formatDateDisplay = (dateValue) => {
    if (!dateValue) return "غير محدد";
    
    // If it's already a Date object
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      return dateValue.toLocaleDateString('ar-EG');
    }
    
    // If it's a string, try to parse it
    if (typeof dateValue === 'string') {
      // Try parsing as standard date
      const parsedDate = new Date(dateValue);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString('ar-EG');
      }
      
      // If parsing fails, it might be a formatted Arabic date string - display as-is
      return dateValue;
    }
    
    return "غير محدد";
  };
  
  const CardContent = () => (
    <div className="bg-[#33AB98] rounded-2xl p-5 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-medium mb-2 border border-white/10">
            الجرعة القادمة
          </span>
          <h3 className="text-lg font-bold mb-1">{vaccineName || "تطعيم"}</h3>
          <p className="text-blue-100 text-sm">للطفل: {childName || "غير محدد"}</p>
          {office && (
            <p className="text-blue-100 text-xs mt-1">📍 {office}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
          <Calendar className="w-6 h-6" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{daysRemaining ?? 0}</span>
            <span className="text-sm text-blue-100">أيام<br/>متبقية</span>
        </div>
        <div className="text-left">
            <p className="text-xs text-blue-100 mb-1">تاريخ الاستحقاق</p>
            <p className="font-semibold">
              {formatDateDisplay(dueDate)}
            </p>
            {day && (
              <p className="text-xs text-blue-100 mt-1">({day})</p>
            )}
        </div>
      </div>

      {/* Warning message from data - High Priority */}
      {warning && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <p className="text-xs font-medium text-red-50 leading-relaxed">{warning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Warning */}
      {overdueWarning && (
        <div className="mt-4 pt-4 border-t border-white/10 animate-pulse">
          <div className="bg-yellow-500/30 border border-yellow-200/50 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-yellow-100 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-bold text-yellow-50 leading-relaxed">
                {overdueWarning}
              </p>
            </div>
          </div>
        </div>
      )}

      {childId && (
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-sm font-medium">
          <span>عرض التفاصيل الكاملة</span>
          <ChevronLeft className="w-4 h-4" />
        </div>
      )}
    </div>
  );

  if (childId) {
    return (
      <Link href={`/next-vaccine?childId=${childId}`} className="block hover:opacity-90 transition-opacity">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};


