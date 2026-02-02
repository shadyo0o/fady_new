'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Baby, Calendar, MapPin, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import MobileLayout from '@/components/layout/MobileLayout';
import api from '@/lib/api/client';
import { HEALTH_OFFICES } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useChild } from '@/contexts/ChildContext';

const AddChild = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { setTempGender } = useChild();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "",
    healthOffice: "",
  });

  useEffect(() => {
    // Clear temp gender when leaving the page
    return () => setTempGender(null);
  }, [setTempGender]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Basic validation
    if (!formData.name || !formData.birthDate || !formData.gender || !formData.healthOffice) {
        setError('يرجى ملء جميع الحقول');
        setLoading(false);
        return;
    }

    try {
        await api.post('/childs/addChild', formData);
        router.push('/home'); // User requested navigate("/home")
    } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'فشل إضافة الطفل');
    } finally {
        setLoading(false);
    }
  };

  return (
    <MobileLayout dir="rtl">
      <div className="min-h-screen bg-white">
        {/* Header - Classic Medical */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="w-4 h-4 text-gray-700" />
          </button>
          <h1 className="text-base font-semibold text-gray-800">إضافة طفل</h1>
        </div>

        {/* Form */}
        <div className="p-4">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-xl mx-auto flex items-center justify-center mb-3 border border-blue-100">
              <Baby className="w-8 h-8 text-[#33AB98]" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              أضف طفلك
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              ابدأ في متابعة تطعيماته
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                اسم الطفل
              </label>
              <input
                type="text"
                placeholder="أدخل الاسم"
                className="w-full h-12 rounded-lg bg-gray-50 border border-gray-200 px-3 focus:outline-none focus:border-[#33AB98] transition-colors"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Birth Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                تاريخ الميلاد
              </label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  className="w-full h-12 rounded-lg bg-gray-50 border border-gray-200 pr-10 pl-3 focus:outline-none focus:border-[#33AB98] transition-colors"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                الجنس
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, gender: "male" });
                    setTempGender("male");
                  }}
                  className={`h-12 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                    formData.gender === "male"
                      ? "border-[#33AB98] bg-blue-50 text-[#33AB98]"
                      : "border-gray-200 bg-gray-50 text-gray-500"
                  }`}
                >
                  <span className="text-lg">👦</span>
                  <span className="font-medium text-sm">ذكر</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, gender: "female" });
                    setTempGender("female");
                  }}
                  className={`h-12 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                    formData.gender === "female"
                      ? "border-pink-500 bg-pink-50 text-pink-500"
                      : "border-gray-200 bg-gray-50 text-gray-500"
                  }`}
                >
                  <span className="text-lg">👧</span>
                  <span className="font-medium text-sm">أنثى</span>
                </button>
              </div>
            </div>

            {/* Health Office */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                مكتب الصحة
              </label>
              <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    className="w-full h-12 rounded-lg bg-gray-50 border border-gray-200 pr-10 pl-3 appearance-none focus:outline-none focus:border-[#33AB98] transition-colors text-gray-700"
                    value={formData.healthOffice}
                    onChange={(e) =>
                      setFormData({ ...formData, healthOffice: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>اختار اقرب مكتب صحة ليك</option>
                    {HEALTH_OFFICES.map((office) => (
                      <option key={office.value} value={office.value}>
                        {office.label}
                      </option>
                    ))}
                  </select>
              </div>
              {formData.healthOffice === 'مكتب_صحة_طبي_سعد' && (
                <p className="text-[10px] text-red-500 mt-1 mr-1">
                  ⚠️ تنبيه: تطعيم الدرن غير متوفر في هذا المكتب
                </p>
              )}
              {formData.healthOffice === 'رعاية_طفل_شبرا_ميدان_الساعة' && (
                <p className="text-[10px] text-red-500 mt-1 mr-1">
                  ⚠️ تنبيه: تطعيم الدرن غير متوفر في هذا المكتب
                </p>
              )}
              {(formData.healthOffice === 'مكتب_صحة_طبي_سعد' || formData.healthOffice === 'رعاية_طفل_شبرا_ميدان_الساعة') && (
                <p className="text-[10px] text-blue-600 mt-0.5 mr-1">
                  💡 المواعيد المتاحة: السبت والثلاثاء فقط لجميع التطعيمات (عدا الكبدي طوال الأسبوع)
                </p>
              )}
              {formData.healthOffice === 'مكتب_طبي_ناصر_المركز_الطبي' && (
                <p className="text-[10px] text-blue-600 mt-1 mr-1">
                  💡 المواعيد: السبت، الثلاثاء، الخميس (للشلل والدورية)، السبت والثلاثاء (للدرن والغدة)
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-lg text-sm font-semibold bg-[#33AB98] hover:bg-[#357ABD] mt-6 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? "جاري الإضافة..." : "إضافة الطفل"}
            </Button>
          </form>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AddChild;
