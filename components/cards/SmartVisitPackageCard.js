'use client';

import { Calendar, ChevronLeft, Info, AlertCircle, Package, Check, Clock } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api/client';
import { showToast } from '@/lib/toast';
import RecordVaccineModal from '@/components/child/RecordVaccineModal';

/**
 * SmartVisitPackageCard
 * Displays a grouped visit package with independent recording buttons for each vaccine.
 * Each vaccine can be recorded separately as it's administered.
 */
export const SmartVisitPackageCard = ({ visitPackage, onVaccineClick, onRecordSuccess }) => {
  const [recordedVaccines, setRecordedVaccines] = useState({});
  const [recordingVaccineId, setRecordingVaccineId] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedVaccineForRecord, setSelectedVaccineForRecord] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  /**
   * Handle opening record modal for a specific vaccine
   */
  const handleOpenRecordModal = (vaccine) => {
    if (vaccine.isAvailable === false) {
      showToast.warning(`${vaccine.title} غير متوفر في الوقت الحالي`);
      return;
    }
    
    if (recordedVaccines[vaccine.scheduleId]) {
      showToast.info(`تم تسجيل ${vaccine.title} مسبقاً`);
      return;
    }

    setSelectedVaccineForRecord(vaccine);
    setShowRecordModal(true);
  };

  /**
   * Handle successful vaccine recording
   */
  const handleRecordSuccess = () => {
    if (selectedVaccineForRecord) {
      setRecordedVaccines(prev => ({
        ...prev,
        [selectedVaccineForRecord.scheduleId]: true
      }));
      showToast.success(`تم تسجيل ${selectedVaccineForRecord.title} بنجاح ✅`);
      setShowRecordModal(false);
      setSelectedVaccineForRecord(null);
      
      // Call parent callback if provided
      if (onRecordSuccess) {
        onRecordSuccess(selectedVaccineForRecord);
      }
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

      {/* Independent Vaccine Recording Checklist */}
      <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
        <p className="text-xs text-blue-100 mb-3 font-medium">تسجيل التطعيمات:</p>
        <div className="space-y-2">
          {allVaccines.map((vaccine, idx) => {
            const isRecorded = recordedVaccines[vaccine.scheduleId];
            const isUnavailable = vaccine.isAvailable === false;
            const isButtonDisabled = isUnavailable || isRecorded;
            
            return (
              <div
                key={idx}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                  isRecorded
                    ? 'bg-green-500/20 border-green-300/30'
                    : isUnavailable
                    ? 'bg-red-500/20 border-red-300/30'
                    : 'bg-white/10 border-white/20'
                }`}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {isRecorded && '✓ '}{isUnavailable && '❌ '}{vaccine.title}
                  </p>
                  {isUnavailable && vaccine.warning && (
                    <p className="text-xs text-red-100 mt-1">{vaccine.warning}</p>
                  )}
                </div>
                
                <button
                  onClick={() => handleOpenRecordModal(vaccine)}
                  disabled={isButtonDisabled}
                  className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    isRecorded
                      ? 'bg-green-500/40 text-green-50 border border-green-300/50 cursor-default'
                      : isUnavailable
                      ? 'bg-red-500/30 text-red-50 border border-red-300/50 cursor-not-allowed opacity-60'
                      : 'bg-white/20 text-white border border-white/30 hover:bg-white/30 active:bg-white/40'
                  }`}
                >
                  {isRecorded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      تم التسجيل
                    </>
                  ) : isUnavailable ? (
                    <>
                      <AlertCircle className="w-3.5 h-3.5" />
                      غير متاح
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      تم
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <CardContent />
      
      {/* Record Vaccine Modal - Inline */}
      <RecordVaccineModal
        isOpen={showRecordModal}
        onClose={() => {
          setShowRecordModal(false);
          setSelectedVaccineForRecord(null);
        }}
        childId={childId}
        scheduleId={selectedVaccineForRecord?.scheduleId}
        vaccineName={selectedVaccineForRecord?.title}
        onSuccess={handleRecordSuccess}
      />
    </>
  );
};
