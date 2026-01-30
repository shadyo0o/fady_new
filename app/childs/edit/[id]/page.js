'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Baby, Calendar, MapPin, ArrowRight, Save, UserCog } from 'lucide-react';
import Button from '@/components/ui/Button';
import MobileLayout from '@/components/layout/MobileLayout';
import api from '@/lib/api/client';
import { HEALTH_OFFICES } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useChild } from '@/contexts/ChildContext';

const EditChild = () => {
  const router = useRouter();
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { setTempGender } = useChild();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    const fetchChildData = async () => {
      if (!id) return;
      setFetching(true);
      try {
        let childData = null;
        // Try multiple ways to get child data (mirroring logic in detail page)
        try {
          const cRes = await api.get(`/childs/getChild/${id}`);
          childData = cRes.data.child || cRes.data.data || (cRes.data?._id ? cRes.data : null);
        } catch (e) {
          try {
            const cRes = await api.get(`/childs/${id}`);
            childData = cRes.data.child || cRes.data.data || (cRes.data?._id ? cRes.data : null);
          } catch (e2) {
            console.error("Child fetch failed", e2);
          }
        }

        if (childData) {
          // Format birthDate to YYYY-MM-DD for input[type="date"]
          const date = new Date(childData.birthDate);
          const formattedDate = date.toISOString().split('T')[0];
          
          setFormData({
            name: childData.name || "",
            birthDate: formattedDate,
            gender: childData.gender || "",
            healthOffice: childData.healthOffice || "",
          });
          setTempGender(childData.gender);
        } else {
          setError('لم يتم العثور على بيانات الطفل');
        }
      } catch (err) {
        console.error(err);
        setError('فشل في تحميل بيانات الطفل');
      } finally {
        setFetching(false);
      }
    };

    if (user && !authLoading) {
      fetchChildData();
    }
  }, [id, user, authLoading, router, setTempGender]);

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
        // Using the correct endpoint for updating child (PATCH as per backend)
        await api.patch(`/childs/editChild/${id}`, formData);
        
        // Refresh the router cache to ensure all pages (Home, ChildDetails, etc.) 
        // fetch fresh data next time they are rendered.
        router.refresh(); 
        
        router.push('/home'); 
    } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'فشل تحديث بيانات الطفل');
    } finally {
        setLoading(false);
    }
  };

  if (authLoading || fetching) {
    return (
      <MobileLayout dir="rtl" hideBottomNav>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#33AB98]"></div>
        </div>
      </MobileLayout>
    );
  }

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
          <h1 className="text-base font-semibold text-gray-800">تعديل بيانات الطفل</h1>
        </div>

        {/* Form */}
        <div className="p-4">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#33AB98]/10 rounded-xl mx-auto flex items-center justify-center mb-3 border border-[#33AB98]/20">
              <UserCog className="w-8 h-8 text-[#33AB98]" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              تعديل بيانات {formData.name}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              قم بتحديث المعلومات الصحيحة لطفلك
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
                className="w-full h-12 rounded-lg bg-gray-50 border border-gray-200 px-3 focus:outline-none focus:border-[#33AB98] transition-colors font-medium text-gray-800"
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
                  className="w-full h-12 rounded-lg bg-gray-50 border border-gray-200 pr-10 pl-3 focus:outline-none focus:border-[#33AB98] transition-colors font-medium text-gray-800"
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
                    className="w-full h-12 rounded-lg bg-gray-50 border border-gray-200 pr-10 pl-3 appearance-none focus:outline-none focus:border-[#33AB98] transition-colors text-gray-700 font-medium"
                    value={formData.healthOffice}
                    onChange={(e) =>
                      setFormData({ ...formData, healthOffice: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>اختر مكتب الصحة</option>
                    {HEALTH_OFFICES.map((office) => (
                      <option key={office.value} value={office.value}>
                        {office.label}
                      </option>
                    ))}
                  </select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-lg text-sm font-semibold bg-[#33AB98] hover:bg-[#2b8f7f] mt-6 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </MobileLayout>
  );
};

export default EditChild;
