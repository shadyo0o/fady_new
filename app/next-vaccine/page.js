'use client'

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Calendar, MapPin, FileText, Lightbulb, AlertCircle, CheckCircle, Baby, AlertTriangle } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import api from "@/lib/api/client";
import { createVisitPackage } from "@/lib/utils/vaccineGrouping";

const NextVaccinePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get('childId');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (childId) {
      fetchNextVaccine();
    }
  }, [childId]);

  const fetchNextVaccine = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/childs/getNextVaccine/${childId}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching next vaccine:", error);
      setError(error.response?.data?.message || "حدث خطأ في جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout hideBottomNav>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#33AB98]/20 border-t-[#33AB98] rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">جاري التحميل...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout hideBottomNav>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{error}</h3>
            <button
              onClick={() => router.back()}
              className="mt-4 text-[#33AB98] font-bold hover:underline"
            >
              عودة
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Use smart grouping to process concurrent vaccines on same date
  const nextTask = data?.nextTask || data?.nextVaccine;
  const nextVaccines = data?.nextVaccines || (nextTask ? [nextTask] : []);
  
  let vaccineInfo = null;
  let visitPackage = null;
  
  if (nextTask) {
    // Import normalizeDateForComparison here
    visitPackage = createVisitPackage(nextVaccines, nextTask);
    
    // Ensure consistent date formatting
    if (visitPackage) {
      // Keep date in YYYY-MM-DD format for consistency
      visitPackage.date = visitPackage.date || nextTask.date;
    }
    
    if (visitPackage && visitPackage.allVaccines && visitPackage.allVaccines.length > 1) {
      // Multiple vaccines on the same date - merge their data intelligently
      const concurrent = visitPackage.allVaccines;
      const combinedTitle = concurrent.map(v => v.title).join(' + ');
      
      // Merge textual fields - combine unique values
      const mergeField = (field) => [...new Set(concurrent.map(v => v[field]).filter(Boolean))].join('\n\n');
      
      // Merge arrays (medicalTips) and deduplicate
      const allMedicalTips = concurrent.flatMap(v => v.medicalTips || []);
      const uniqueMedicalTips = [];
      const tipMap = new Map();
      for (const item of allMedicalTips) {
        if (!tipMap.has(item.title)) {
          tipMap.set(item.title, true);
          uniqueMedicalTips.push(item);
        }
      }

      vaccineInfo = {
        ...nextTask,
        title: combinedTitle,
        advice: mergeField('advice'),
        nutrition: mergeField('nutrition'),
        tips: mergeField('tips'),
        documents: mergeField('documents'),
        important: mergeField('important'),
        warning: mergeField('warning'),
        medicalTips: uniqueMedicalTips,
        groupedVaccines: concurrent,
        isGrouped: true
      };
    } else {
      vaccineInfo = nextTask;
    }
  }

  const isTask = !!data?.nextTask;
  // Check if any of the concurrent vaccines involve newborn screening
  const isNewbornScreening = vaccineInfo?.title && (vaccineInfo.title.includes('الغدة') || vaccineInfo.title.includes('الدرن'));

  if (!vaccineInfo) {
    return (
      <MobileLayout hideBottomNav>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد تطعيمات قادمة</h3>
            <p className="text-gray-500 text-sm">تم إكمال جميع التطعيمات المقررة</p>
            <button
              onClick={() => router.back()}
              className="mt-6 px-6 py-2 bg-[#33AB98] text-white rounded-xl font-bold hover:bg-[#33AB98]/90"
            >
              عودة
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout dir="rtl" hideBottomNav>
      <div className="min-h-screen bg-gradient-to-b from-[#33AB98]/5 to-white">
        {/* Header */}
        <div className="bg-[#33AB98] px-4 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-md">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">
              {isTask ? "المهمة القادمة" : "التطعيم القادم"}
            </h1>
            <p className="text-xs text-blue-100 font-medium">{vaccineInfo.title}</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Title Section */}
            <div className="bg-gradient-to-l from-[#33AB98] to-[#33AB98]/90 p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{vaccineInfo.title}</h2>
                </div>
              </div>
              
              {/* Unified Warnings Section - Only for unavailable vaccines */}
              {vaccineInfo.groupedVaccines && vaccineInfo.groupedVaccines.some(v => v.isAvailable === false) && (
                <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-3 mt-3 backdrop-blur-sm animate-pulse">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-100 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      {vaccineInfo.groupedVaccines
                        .filter(v => v.isAvailable === false)
                        .map((vaccine, idx) => (
                          <p key={idx} className="text-sm font-medium text-red-50">
                            {vaccine.warning || `❌ ${vaccine.title} غير متوفر`}
                          </p>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Date & Day */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#33AB98]/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-[#33AB98]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">الموعد المحدد</p>
                  <p className="text-lg font-bold text-gray-800">{vaccineInfo.date}</p>
                  <p className="text-sm text-[#33AB98] font-medium">{vaccineInfo.day}</p>
                </div>
              </div>
            </div>

            {/* Grouped Vaccines Display - Show all vaccines in this visit package */}
            {vaccineInfo.isGrouped && vaccineInfo.groupedVaccines && vaccineInfo.groupedVaccines.length > 1 && (
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-3">حزمة الزيارة الموحدة</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      في هذا الموعد، سيتم إعطاء عدة تطعيمات معاً:
                    </p>
                    <div className="space-y-2">
                      {vaccineInfo.groupedVaccines.map((vaccine, idx) => (
                        <div 
                          key={idx} 
                          className={`p-3 rounded-lg border ${
                            vaccine.isAvailable === false 
                              ? 'bg-red-50 border-red-200' 
                              : 'bg-green-50 border-green-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-800">
                                {vaccine.isAvailable === false && '❌ '}{vaccine.title}
                              </p>
                              {vaccine.isAvailable === false && vaccine.warning && (
                                <p className="text-xs text-red-600 mt-1">{vaccine.warning}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advice Section */}
            {(vaccineInfo.advice || isNewbornScreening) && (
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">نصائح طبية</h3>
                    {vaccineInfo.advice && (
                      <p className="text-sm text-gray-600 leading-relaxed">{vaccineInfo.advice}</p>
                    )}
                    {isNewbornScreening && (
                      <p className="text-sm text-gray-600 leading-relaxed mt-3">
                        في هذا الموعد يتم أيضاً إعطاء تطعيم الدرن (BCG) والجرعة الصفرية من شلل الأطفال،
                        حيث تُعطى هذه التطعيمات خلال أول 72 ساعة بعد الولادة مع تحليل الغدة والسمع.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Nutrition */}
            {vaccineInfo.nutrition && (
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Baby className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">التغذية</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{vaccineInfo.nutrition}</p>
                  </div>
                </div>
              </div>
            )}

            {Array.isArray(vaccineInfo.medicalTips) && vaccineInfo.medicalTips.length > 0 && (
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">نصائح طبية</h3>
                    <div className="space-y-3">
                      {vaccineInfo.medicalTips.filter(t => t && (t.isActive === undefined || t.isActive)).map((tip, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-100 p-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-800 text-sm">{tip.title}</p>
                            {tip.category && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{tip.category}</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{tip.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            {vaccineInfo.tips && (
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">نصائح عامة</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{vaccineInfo.tips}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Documents */}
            {vaccineInfo.documents && (
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">المستندات المطلوبة</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{vaccineInfo.documents}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Important */}
            {vaccineInfo.important && (
              <div className="p-6 bg-orange-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-orange-900 mb-2">ملاحظات هامة</h3>
                    <p className="text-sm text-orange-800 leading-relaxed">{vaccineInfo.important}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={() => router.back()}
            className="w-full py-4 bg-[#33AB98] text-white rounded-xl font-bold text-base shadow-lg hover:bg-[#33AB98]/90 transition-colors"
          >
            عودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

const NextVaccinePage = () => {
  return (
    <Suspense fallback={
      <MobileLayout hideBottomNav>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#33AB98]/20 border-t-[#33AB98] rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">جاري التحميل...</p>
          </div>
        </div>
      </MobileLayout>
    }>
      <NextVaccinePageContent />
    </Suspense>
  );
};

export default NextVaccinePage;
