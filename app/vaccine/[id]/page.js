'use client'
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, FileText, Check, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import MobileLayout from "@/components/layout/MobileLayout";
import api from "@/lib/api/client";

const VaccineRecord = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id; // This is the scheduleId
  const childId = searchParams.get('childId');
  const [isLoading, setIsLoading] = useState(false);
  const [vaccineInfo, setVaccineInfo] = useState(null);
  const [formData, setFormData] = useState({
    actualDate: "",
    notes: "",
    sideEffects: [],
  });

  const commonSideEffects = [
    "حمى",
    "احمرار مكان الحقن",
    "تورم",
    "بكاء مستمر",
    "نعاس",
    "فقدان الشهية",
  ];

  const toggleSideEffect = (effect) => {
    setFormData((prev) => ({
      ...prev,
      sideEffects: prev.sideEffects.includes(effect)
        ? prev.sideEffects.filter((e) => e !== effect)
        : [...prev.sideEffects, effect],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!childId) {
        alert("Child ID missing");
        return;
    }
    setIsLoading(true);
    try {
        await api.post('/childs/recordVaccine', {
            childId,
            scheduleId: id,
            actualDate: formData.actualDate,
            notes: formData.notes,
            sideEffects: formData.sideEffects,
            office: "Default Office" // Or from child info/state
        });
        router.push("/timeline");
    } catch (error) {
        console.error("Save vaccine error", error);
        alert("فشل حفظ البيانات");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <MobileLayout dir="rtl">
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
            <p className="text-sm text-gray-500">شلل الأطفال (OPV) - الجرعة 2</p>
          </div>
        </div>

        {/* Vaccine Info Card */}
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <span className="text-2xl">💉</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-800">شلل الأطفال (OPV)</h2>
                <p className="text-sm text-blue-600/80">
                  الجرعة 2 من 4 • مجدول عند 4 أشهر
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Actual Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#4A90E2]" />
                تاريخ التطعيم الفعلي
              </label>
              <Input
                type="date"
                className="h-14 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-[#4A90E2]"
                value={formData.actualDate}
                onChange={(e) =>
                  setFormData({ ...formData, actualDate: e.target.value })
                }
                required
              />
            </div>

            {/* Side Effects */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                الأعراض الجانبية (إن وجدت)
              </label>
              <div className="flex flex-wrap gap-2">
                {commonSideEffects.map((effect) => (
                  <button
                    key={effect}
                    type="button"
                    onClick={() => toggleSideEffect(effect)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                      formData.sideEffects.includes(effect)
                        ? "bg-orange-50 text-orange-600 border-2 border-orange-200"
                        : "bg-gray-50 text-gray-500 border-2 border-transparent hover:bg-gray-100"
                    }`}
                  >
                    {formData.sideEffects.includes(effect) && (
                      <Check className="w-3 h-3" />
                    )}
                    {effect}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#4A90E2]" />
                ملاحظات إضافية
              </label>
              <Textarea
                placeholder="أضف أي ملاحظات حول التطعيم (مثل: ملاحظات الطبيب، ردة فعل الطفل...)"
                className="min-h-[120px] rounded-xl bg-gray-50 border-0 resize-none focus:ring-2 focus:ring-[#4A90E2]"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-xl text-base font-semibold bg-[#4A90E2] hover:bg-[#357ABD] shadow-lg shadow-blue-200 flex items-center justify-center"
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

export default VaccineRecord;
