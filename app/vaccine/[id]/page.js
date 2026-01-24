'use client'
import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, FileText, Check, ArrowRight, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import MobileLayout from "@/components/layout/MobileLayout";
import api from "@/lib/api/client";
import { showToast } from "@/lib/toast";

const VaccineRecordContent = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id; // This is the scheduleId
  const childId = searchParams.get('childId');
  const vaccineName = searchParams.get('name') || "التطعيم";
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    actualDate: new Date().toISOString().split('T')[0],
    notes: "",
    sideEffects: [],
  });

  const commonSideEffects = [
    "ارتفاع في درجة الحرارة",
    "احمرار مكان الحقن",
    "تورم",
    "بكاء مستمر",
    "النعاس",
    "طفح جلدي خفيف",
    "خراج",
    "التهاب الغدد الليمفاوية",
    "لا يوجد"
  ];

  const toggleSideEffect = (effect) => {
    setFormData((prev) => {
      // If selecting "لا يوجد", clear all other selections
      if (effect === "لا يوجد") {
        return {
          ...prev,
          sideEffects: prev.sideEffects.includes("لا يوجد") ? [] : ["لا يوجد"]
        };
      }
      
      // If selecting any other effect, remove "لا يوجد" if it exists
      const newSideEffects = prev.sideEffects.includes("لا يوجد")
        ? prev.sideEffects.filter((e) => e !== "لا يوجد")
        : prev.sideEffects;
      
      return {
        ...prev,
        sideEffects: newSideEffects.includes(effect)
          ? newSideEffects.filter((e) => e !== effect)
          : [...newSideEffects, effect],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate side effects selection
    if (formData.sideEffects.length === 0) {
      showToast.warning("يجب اختيار حالة الآثار الجانبية. إذا لم تكن هناك آثار جانبية، يرجى اختيار 'لا يوجد'");
      return;
    }
    
    if (!childId) {
        showToast.error("معرف الطفل مفقود");
        return;
    }
    
    setIsLoading(true);
    try {
        // Combine notes and side effects
        let combinedNotes = formData.notes;
        if (formData.sideEffects.length > 0) {
            const sideEffectsText = `\nالآثار الجانبية: ${formData.sideEffects.join(', ')}`;
            combinedNotes = combinedNotes ? `${combinedNotes}${sideEffectsText}` : sideEffectsText.trim();
        }

        await api.post('/childs/recordVaccine', {
            childId,
            scheduleId: id,
            actualDate: formData.actualDate,
            notes: combinedNotes
            // office field is optional - backend will use child's healthOffice if not provided
        });
        
        showToast.success("تم تسجيل التطعيم بنجاح ✅");
        setTimeout(() => {
          router.push(`/childs/${childId}`);
        }, 1500);
    } catch (error) {
        console.error("Save vaccine error", error);
        const errorMessage = error.response?.data?.message || "فشل حفظ البيانات";
        showToast.error(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <MobileLayout dir="rtl" hideBottomNav>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
          <button
            onClick={() => router.back()}
             className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">تسجيل التطعيم</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{vaccineName}</p>
          </div>
        </div>

        {/* Vaccine Info Card */}
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
              <span className="text-2xl">💉</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm">{vaccineName}</h2>
              <p className="text-[10px] text-gray-400 font-bold mt-1">تأكيد الموعد وتسجيل البيانات</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Actual Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#33AB98]" />
                تاريخ التطعيم الفعلي
              </label>
              <Input
                type="date"
                className="h-14 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-[#33AB98]"
                value={formData.actualDate}
                onChange={(e) =>
                  setFormData({ ...formData, actualDate: e.target.value })
                }
                required
              />
            </div>

            {/* Side Effects */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                الآثار الجانبية <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                يرجى اختيار حالة الآثار الجانبية. إذا لم تكن هناك آثار جانبية، اختر "لا يوجد"
              </p>
              <div className="flex flex-wrap gap-2">
                {commonSideEffects.map((effect) => {
                  const isSelected = formData.sideEffects.includes(effect);
                  const isNoEffect = effect === "لا يوجد";
                  
                  return (
                    <button
                      key={effect}
                      type="button"
                      onClick={() => toggleSideEffect(effect)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-sm ${
                        isSelected
                          ? isNoEffect
                            ? "bg-green-50 text-green-700 border-2 border-green-300 shadow-md"
                            : "bg-orange-50 text-orange-700 border-2 border-orange-300 shadow-md"
                          : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <Check className={`w-4 h-4 ${isNoEffect ? 'text-green-600' : 'text-orange-600'}`} />
                      )}
                      {effect}
                    </button>
                  );
                })}
              </div>
              {formData.sideEffects.length === 0 && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-2">
                  <AlertTriangle className="w-3 h-3" />
                  يجب اختيار حالة الآثار الجانبية
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#33AB98]" />
                ملاحظات إضافية
              </label>
              <Textarea
                placeholder="أضف أي ملاحظات حول التطعيم (مثل: ملاحظات الطبيب، ردة فعل الطفل...)"
                className="min-h-[120px] rounded-xl bg-gray-50 border-0 resize-none focus:ring-2 focus:ring-[#33AB98]"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-xl text-base font-semibold bg-[#33AB98] hover:bg-[#357ABD] shadow-lg shadow-blue-200 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                "جاري الحفظ..."
              ) : (
                <>
                  <Check className="w-5 h-5 ml-2" />
                  تسجيل كمكتمل
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </MobileLayout>
  );
};

const VaccineRecord = () => {
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
            <VaccineRecordContent />
        </Suspense>
    );
};

export default VaccineRecord;
