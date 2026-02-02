'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api/client';
import Link from 'next/link';
import { 
  Baby, 
  Calendar, 
  Clock, 
  ArrowRight, 
  FileText, 
  Lightbulb, 
  UserCog,
  Save,
  Check, 
  X 
} from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { cn } from '@/lib/utils';

export default function ChildDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [child, setChild] = useState(null);
  const [schedule, setSchedule] = useState({ taken: [], overdue: [], nextVaccine: null, upcoming: [] });
  const [loading, setLoading] = useState(true);
  const [vaccineData, setVaccineData] = useState(null);

  useEffect(() => {
    if (id) {
      fetchData();
    }

    // Refresh data when page becomes visible (e.g., after recording a vaccine)
    const handleVisibilityChange = () => {
      if (!document.hidden && id) {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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

      // Robust Schedule Fetch
      const sRes = await api.get(`/childs/getDueVaccines/${id}`);
      const scheduleData = sRes.data;
      
      // Fetch Next Vaccine Data (for grouping support and better future data)
      let nextVaccinesList = [];
      try {
        const nRes = await api.get(`/childs/getNextVaccine/${id}`);
        nextVaccinesList = nRes.data.nextVaccines || 
                          (nRes.data.nextVaccine ? [nRes.data.nextVaccine] : []) || [];
      } catch (err) {
        console.warn("Failed to fetch next vaccines", err);
      }

      setSchedule(scheduleData);
      
      // Store the results separately but override upcoming/next with our grouped list
      if (scheduleData.results) {
        const results = { ...scheduleData.results };
        
        if (nextVaccinesList.length > 0) {
            // Grouping Logic
            const groups = {};
            nextVaccinesList.forEach(v => {
                const d = v.date; // "YYYY-MM-DD"
                if (!groups[d]) groups[d] = [];
                groups[d].push(v);
            });

            // Convert groups to array and sort by date
            const sortedGroups = Object.keys(groups).sort().map(date => {
                const group = groups[date];
                const first = group[0];
                if (group.length === 1) return first;
                
                return {
                    ...first,
                    title: group.map(g => g.title).join(' + '),
                    vaccineName: group.map(g => g.title).join(' + '),
                    // Merge other IDs if needed for linking? 
                    // Ideally we pick the "primary" ID for link, or maybe disable link if complex?
                    // For now, let's keep the first ID so the button works for at least one.
                    _id: first._id
                };
            });

            // The first group is "Next", rest are "Upcoming"
            results.nextVaccine = sortedGroups[0];
            results.upcoming = sortedGroups.slice(1);
        }

        setVaccineData(results);
      } else {
        setVaccineData({});
      }
    } catch (error) {
      console.error("Error fetching child details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout hideBottomNav>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#33AB98]"></div>
        </div>
      </MobileLayout>
    );
  }

  if (!child) {
    return (
      <MobileLayout hideBottomNav>
        <div className="p-4 text-center">
          <p className="text-gray-500">لم يتم العثور على الطفل</p>
          <button onClick={() => router.back()} className="mt-4 text-[#33AB98] font-bold">عودة</button>
        </div>
      </MobileLayout>
    );
  }

  const calculateAge = (birthDateStr) => {
    if (!birthDateStr) return "-";
    const birthDate = new Date(birthDateStr);
    const now = new Date();
    const months = Math.floor(
      (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    );
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0) {
      return `${years} سنة و ${remainingMonths} شهر`;
    }
    return `${months} شهر`;
  };

  const res = vaccineData || {};
  const taken = res.taken || [];
  const overdue = res.overdue || [];
  const upcoming = res.upcoming || [];
  const nextVaccine = res.nextVaccine || null;
  
  const takenCount = taken.length;
  const overdueCount = overdue.length;
  const upcomingCount = upcoming.length;
  const nextCount = nextVaccine ? 1 : 0;
  
  const totalVaccines = takenCount + overdueCount + upcomingCount + nextCount;
  const progress = totalVaccines > 0 ? Math.round((takenCount / totalVaccines) * 100) : 0;

  // Prepare flat list for display
  const allVaccines = [
    ...(res.overdue || []).map(v => ({ ...v, status: 'overdue' })),
    ...(res.nextVaccine ? [{ ...res.nextVaccine, status: 'next' }] : []),
    ...(res.upcoming || []).map(v => ({ ...v, status: 'upcoming' })),
    ...(res.taken || []).map(v => ({ ...v, status: 'taken' }))
  ];

  return (
    <MobileLayout hideBottomNav>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-l from-[#33AB98] to-[#33AB98]/90 text-white p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold">معلومات الطفل</h1>
            </div>
            <Link 
              href={`/childs/edit/${id}`}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <UserCog className="w-5 h-5" />
            </Link>
          </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Child Info Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                child.gender === "male"
                  ? "bg-[#33AB98]/10 text-[#33AB98]"
                  : "bg-pink-100 text-pink-500"
              )}
            >
              <Baby className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{child.name}</h2>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(child.birthDate).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{calculateAge(child.birthDate)}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">تقدم التطعيمات</span>
              <span className="text-sm font-bold text-[#33AB98]">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#33AB98] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {takenCount} من {totalVaccines} تطعيم مكتمل
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={`/childs/${id}/history`}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">السجل</h3>
              <p className="text-xs text-gray-400">التطعيمات المكتملة</p>
            </div>
          </Link>

          <Link
            href={`/childs/${id}/tips`}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">نصائح</h3>
              <p className="text-xs text-gray-400">نصائح طبية</p>
            </div>
          </Link>
        </div>

        {/* Vaccination Status Cards */}
        <div className="grid grid-cols-1 gap-4">
          {/* Overdue Vaccines */}
          {overdue.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-red-800">تطعيمات متأخرة ({overdue.length})</h3>
              </div>
              <div className="space-y-2">
                {overdue.map((vaccine, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 border border-red-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">{vaccine.title || vaccine.vaccineName || vaccine.name}</p>
                        <p className="text-sm text-gray-500">العمر: {vaccine.dueInMonths ?? (vaccine.ageInMonths || vaccine.ageMonths)} شهر</p>
                        {vaccine.date && (
                          <p className="text-xs text-red-600">كان مستحق في: {new Date(vaccine.date).toLocaleDateString('ar-EG')}</p>
                        )}
                      </div>
                      <Link 
                        href={`/vaccine/${vaccine._id}?childId=${id}&name=${encodeURIComponent(vaccine.title || vaccine.vaccineName || vaccine.name)}`}
                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full hover:bg-red-600 transition-colors"
                      >
                        تسجيل الآن
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Vaccine */}
          {nextVaccine && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-orange-800">التطعيم القادم</h3>
              </div>
              <div className="bg-white rounded-lg p-3 border border-orange-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{nextVaccine.title || nextVaccine.vaccineName || nextVaccine.name}</p>
                    <p className="text-sm text-gray-500">العمر: {nextVaccine.dueInMonths ?? (nextVaccine.ageInMonths || nextVaccine.ageMonths)} شهر</p>
                    {nextVaccine.date && (
                      <p className="text-xs text-orange-600">تاريخ الاستحقاق: {new Date(nextVaccine.date).toLocaleDateString('ar-EG')}</p>
                    )}
                  </div>
                  <Link 
                    href={`/vaccine/${nextVaccine._id}?childId=${id}&name=${encodeURIComponent(nextVaccine.title || nextVaccine.vaccineName || nextVaccine.name)}`}
                    className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full hover:bg-orange-600 transition-colors"
                  >
                    تسجيل
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Vaccines */}
          {upcoming.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-blue-800">التطعيمات القادمة ({upcoming.length})</h3>
              </div>
              <div className="space-y-2">
                {upcoming.map((vaccine, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">{vaccine.title || vaccine.vaccineName || vaccine.name}</p>
                        <p className="text-sm text-gray-500">العمر: {vaccine.dueInMonths ?? (vaccine.ageInMonths || vaccine.ageMonths)} شهر</p>
                        {vaccine.date && (
                          <p className="text-xs text-blue-600">تاريخ الاستحقاق: {new Date(vaccine.date).toLocaleDateString('ar-EG')}</p>
                        )}
                      </div>
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                        قادم
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vaccine Schedule Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-right" dir="rtl">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-800">جدول التطعيمات الكامل</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-4 text-sm font-semibold text-gray-600 text-right">التطعيم</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-center">العمر</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allVaccines.map((vaccine, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-800 text-sm">
                      {vaccine.title || vaccine.vaccineName || vaccine.name}
                    </td>
                    <td className="p-4 text-center text-gray-500 text-sm">
                      {vaccine.dueInMonths ?? (vaccine.ageInMonths || vaccine.ageMonths)} شهر
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {vaccine.status === 'taken' ? (
                          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-bold ring-1 ring-green-100">
                            <Check className="w-3.5 h-3.5" />
                            <span>مكتمل</span>
                          </div>
                        ) : (
                          <>
                            <div className={cn(
                              "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ring-1",
                              vaccine.status === 'overdue' ? "bg-red-50 text-red-600 ring-red-100" : 
                              vaccine.status === 'next' ? "bg-orange-50 text-orange-600 ring-orange-100" :
                              "bg-gray-50 text-gray-400 ring-gray-100"
                            )}>
                              {vaccine.status === 'overdue' ? <X className="w-3.5 h-3.5" /> : 
                               vaccine.status === 'next' ? <Clock className="w-3.5 h-3.5" /> :
                               <Clock className="w-3.5 h-3.5" />}
                              <span>{
                                vaccine.status === 'overdue' ? 'متأخر' : 
                                vaccine.status === 'next' ? 'قادم' :
                                'قادم'
                              }</span>
                            </div>
                            <Link 
                               href={`/vaccine/${vaccine._id}?childId=${id}&name=${encodeURIComponent(vaccine.title || vaccine.vaccineName || vaccine.name)}`}
                               className="text-[10px] text-[#33AB98] font-bold hover:underline"
                            >
                              تسجيل
                            </Link>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
