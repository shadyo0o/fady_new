'use client';

import { Calendar, ChevronLeft, Info, AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/**
 * SmartVisitPackageCard
 * Displays a grouped visit package with all vaccines scheduled for the same date
 * Includes special warnings for unavailable vaccines (e.g., BCG)
 */
export const SmartVisitPackageCard = ({ visitPackage, onVaccineClick }) => {
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  if (!visitPackage) {
    return (
      <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
        <p className="text-gray-500">لا توجد تطعيمات قادمة</p>
      </div>
    );
  }

  const { 
    date, 
    day, 
    vaccineTitles, 
    vaccineCount, 
    advice, 
    bcgWarning, 
    unavailableVaccines,
    allVaccines,
    office,
    childId,
    childName,
    daysRemaining,
    warning
  } = visitPackage;

  const handleVaccineClick = (vaccine) => {
    setSelectedVaccine(vaccine);
    setShowDetails(true);
    if (onVaccineClick) {
      onVaccineClick(vaccine);
    }
  };

  const CardContent = () => (
    <div className="bg-[#33AB98] rounded-2xl p-5 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex-1">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-medium mb-2 border border-white/10">
            حزمة الزيارة القادمة
          </span>
          <h3 className="text-lg font-bold mb-1">
            {vaccineCount > 1 ? `${vaccineCount} تطعيمات معاً` : 'تطعيم قادم'}
          </h3>
          <p className="text-blue-100 text-sm">للطفل: {childName || 'غير محدد'}</p>
          {office && (
            <p className="text-blue-100 text-xs mt-1">📍 {office}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
          <Package className="w-6 h-6" />
        </div>
      </div>

      {/* Date and Day Prominently Displayed */}
      <div className="pt-4 pb-4 border-t border-white/10 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-white/70" />
            <span className="text-sm text-blue-100">الموعد المحدد</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{date}</p>
            {day && <p className="text-xs text-blue-100 mt-0.5">({day})</p>}
          </div>
        </div>
      </div>

      {/* Days Remaining */}
      <div className="flex items-center justify-between pt-4 pb-4 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold">{daysRemaining ?? 0}</span>
          <span className="text-sm text-blue-100">أيام<br/>متبقية</span>
        </div>
      </div>

      {/* Advice Section */}
      {advice && (
        <div className="mt-3 pt-3 border-t border-white/10 relative z-10">
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-300/30">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-100 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-medium text-blue-50 leading-relaxed">{advice}</p>
            </div>
          </div>
        </div>
      )}

      {/* Critical BCG Warning - Red Alert */}
      {bcgWarning && (
        <div className="mt-3 pt-3 border-t border-white/10 relative z-10 animate-pulse">
          <div className="bg-red-600/30 backdrop-blur-sm rounded-lg p-3 border border-red-300/50">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-100 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-bold text-red-50 leading-relaxed">
                ⚠️ تحذير: {bcgWarning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grouped Vaccines List */}
      <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
        <p className="text-xs text-blue-100 mb-2 font-medium">التطعيمات المجدولة:</p>
        <div className="space-y-2">
          {vaccineTitles.map((title, idx) => {
            const vaccine = allVaccines[idx];
            const isUnavailable = vaccine?.isAvailable === false;
            
            return (
              <button
                key={idx}
                onClick={() => handleVaccineClick(vaccine)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  isUnavailable
                    ? 'bg-red-500/20 border border-red-300/30 hover:bg-red-500/30'
                    : 'bg-white/10 border border-white/20 hover:bg-white/15'
                }`}
              >
                <p className="text-sm font-medium text-white truncate">
                  {isUnavailable && '❌ '}{title}
                </p>
                {isUnavailable && vaccine?.warning && (
                  <p className="text-xs text-red-100 mt-1">{vaccine.warning}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {childId && (
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-sm font-medium relative z-10">
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
