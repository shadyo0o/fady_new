'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api/client';
import { 
  ArrowRight, 
  Lightbulb, 
  Stethoscope, 
  Baby, 
  Utensils, 
  ShieldCheck,
  FileText,
  AlertCircle,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { cn } from '@/lib/utils';

export default function ChildTipsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [child, setChild] = useState(null);
  const [vaccineTips, setVaccineTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

  // Calculate child age in months
  const calculateAgeInMonths = (birthDate) => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    return months >= 0 ? months : 0;
  };

  const toggleCard = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Robust Child Fetch
      let childData = null;
      try {
        const cRes = await api.get(`/childs/getChild/${id}`);
        childData = cRes.data.child || cRes.data.data || (cRes.data?._id ? cRes.data : null);
      } catch (e) {
        try {
          const cRes = await api.get(`/childs/${id}`);
          childData = cRes.data.child || cRes.data.data || (cRes.data?._id ? cRes.data : null);
        } catch (e2) {
          try {
            const allRes = await api.get('/childs/getall');
            const list = allRes.data.child || allRes.data.childs || [];
            childData = list.find(c => (c.id || c._id) === id);
          } catch (e3) {
            console.error("All child fetch attempts failed");
          }
        }
      }
      setChild(childData);

      // Robust Schedule/Tips Fetch
      // Switched to getNextVaccine as it contains rich tips data including medicalTips
      const sRes = await api.get(`/childs/getNextVaccine/${id}`);
      const data = sRes.data || {};
      
      const nextVaccines = data.nextVaccines || [];
      const nextVaccine = data.nextVaccine || null;
      
      // Merge nextVaccine if not in the list or if list is empty?
      // Based on user example, nextVaccines seems comprehensive. 
      // We will use nextVaccines as primary source.
      
      const allItems = nextVaccines.filter(item => 
        item && (item.advice || item.nutrition || item.tips || item.documents || item.important || (item.medicalTips && item.medicalTips.length > 0))
      );

      setVaccineTips(allItems);
    } catch (error) {
      console.error("Error fetching tips:", error);
    } finally {
      setLoading(false);
    }
  };

  const childAgeMonths = child ? calculateAgeInMonths(child.birthDate) : 0;
  const childAgeDisplay = childAgeMonths < 1 
    ? 'أقل من شهر' 
    : childAgeMonths === 1 
    ? 'شهر واحد' 
    : `${childAgeMonths} شهر`;

  if (loading) {
    return (
      <MobileLayout hideBottomNav>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-yellow-500 animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-yellow-600 font-semibold text-lg mb-1">جاري تحميل النصائح...</p>
              <p className="text-gray-500 text-sm">نحضر المعلومات المخصصة لطفلك</p>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!child && !loading) {
    return (
      <MobileLayout hideBottomNav>
        <div className="p-4 text-center">
          <p className="text-gray-500">لم يتم العثور على الطفل</p>
          <button onClick={() => router.back()} className="mt-4 text-[#33AB98] font-bold">عودة</button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hideBottomNav>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-l from-yellow-500 via-yellow-500 to-yellow-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">نصائح وإرشادات طبية</h1>
            <p className="text-xs text-yellow-100">معلومات مخصصة حسب عمر طفلك</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-6">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-yellow-50 via-yellow-50/50 to-orange-50 rounded-3xl p-6 border-2 border-yellow-200 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/30 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200/30 rounded-full -ml-12 -mb-12 blur-xl"></div>
          
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
              <Baby className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-1">نصائح مخصصة لـ {child?.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span>العمر: {childAgeDisplay}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                إرشادات طبية وتوعوية مخصصة لمرحلة طفلك الحالية لضمان نمو صحي وآمن
              </p>
            </div>
          </div>
        </div>

        {/* Tips List */}
        <div className="space-y-4">
          {vaccineTips.length > 0 ? vaccineTips.map((item, index) => {
            const isExpanded = expandedCards[index];
            const hasMultipleSections = [
              item.advice,
              item.nutrition,
              item.tips,
              item.documents,
              item.important,
              (item.medicalTips && item.medicalTips.length > 0)
            ].filter(Boolean).length > 1;

            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Header */}
                <button
                  onClick={() => hasMultipleSections && toggleCard(index)}
                  className={cn(
                    "w-full p-5 bg-gradient-to-r from-[#33AB98]/5 to-blue-50/50 border-b border-gray-100 flex items-center justify-between transition-colors",
                    hasMultipleSections && "hover:from-[#33AB98]/10 hover:to-blue-50"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 text-right">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#33AB98] to-[#33AB98]/80 flex items-center justify-center shadow-md">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-base mb-1">
                        {item.title || item.vaccine?.name || `نصائح ${index + 1}`}
                      </h3>
                      {(item.vaccine?.description || item.dueInMonths !== undefined) && (
                        <p className="text-xs text-gray-500">
                          {item.vaccine?.description || `عند ${item.dueInMonths} شهر`}
                        </p>
                      )}
                    </div>
                  </div>
                  {hasMultipleSections && (
                    <ArrowRight 
                      className={cn(
                        "w-5 h-5 text-gray-400 transition-transform",
                        isExpanded && "rotate-90"
                      )} 
                    />
                  )}
                </button>

                {/* Card Content */}
                <div className={cn(
                  "transition-all duration-300 overflow-hidden",
                  hasMultipleSections && expandedCards[index] === false ? "max-h-0" : "max-h-[5000px]"
                )}>
                  <div className="p-5 space-y-4">
                    {/* Advice Section */}
                    {item.advice && (
                      <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 animate-in fade-in slide-in-from-right">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Info className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                              <span>💡</span> تعليمات طبية
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">{item.advice}</p>
                            <p className="text-[10px] text-gray-500 mt-2">هذه المعلومات للإرشاد فقط، في حال استمرار الأعراض يرجى مراجعة الطبيب فوراً</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Nutrition Section */}
                    {item.nutrition && (
                      <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 animate-in fade-in slide-in-from-right">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Utensils className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                              <span>🍼</span> التغذية والرضاعة
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">{item.nutrition}</p>
                            <p className="text-[10px] text-gray-500 mt-2">هذه المعلومات للإرشاد فقط، في حال استمرار الأعراض يرجى مراجعة الطبيب فوراً</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Medical Tips Section (New from Backend) */}
                    {item.medicalTips && item.medicalTips.length > 0 && (
                      <div className="bg-pink-50/50 rounded-xl p-4 border border-pink-100 animate-in fade-in slide-in-from-right">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Lightbulb className="w-5 h-5 text-pink-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                              <span>⚕️</span> نصائح طبية هامة
                            </h4>
                            <div className="space-y-3">
                              {item.medicalTips.filter(t => t && (t.isActive === undefined || t.isActive)).map((tip, tIdx) => (
                                <div key={tIdx} className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="font-bold text-gray-800 text-sm">{tip.title}</p>
                                    {tip.category && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 font-medium">
                                        {tip.category.replace(/_/g, ' ')}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 leading-relaxed mt-1">{tip.content}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* General Tips Section */}
                    {item.tips && (
                      <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 animate-in fade-in slide-in-from-right">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Stethoscope className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                              <span>🧠</span> تنمية المهارات
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">{item.tips}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Documents Section */}
                    {item.documents && (
                      <div className="bg-green-50/50 rounded-xl p-4 border border-green-100 animate-in fade-in slide-in-from-right">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <FileText className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                              <span>📄</span> المستندات المطلوبة
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">{item.documents}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Important Section */}
                    {item.important && (
                      <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200 animate-in fade-in slide-in-from-right shadow-sm">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
                              <span>⚠️</span> تنبيه مهم جداً
                            </h4>
                            <p className="text-sm text-red-700 leading-relaxed font-medium">{item.important}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium mb-2">لا توجد نصائح متاحة حالياً</p>
              <p className="text-sm text-gray-400">سيتم إضافة النصائح قريباً</p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-gray-700 mb-2">تنبيه مهم</h4>
              <p className="text-xs text-gray-600 leading-relaxed text-right">
                هذه النصائح تم تجميعها من وزارة الصحة المصرية والمصادر الطبية الرسمية. 
                يرجى مراجعة الطبيب المختص لأي استفسار طبي أو في حالة وجود أي أعراض غير طبيعية.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
