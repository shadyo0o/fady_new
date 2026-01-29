'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/client';
import StatsCards from '@/components/dashboard/StatsCards';
import { NextVaccineCard } from '@/components/cards/NextVaccineCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import VaccinationTable from '@/components/dashboard/VaccinationTable';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const subEnd = user?.subscriptionEndDate ? new Date(user.subscriptionEndDate) : null;
  const isSubscribed = (user?.isSubscribed === true) || (subEnd && subEnd.getTime() > Date.now());

  const [nextVaccineData, setNextVaccineData] = useState(null);
  const [loadingVaccine, setLoadingVaccine] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    } else if (user && isSubscribed) {
      fetchDashboardData();
    } else if (user && !isSubscribed) {
      setData(null);
      setFetchError(null);
    }
  }, [user, loading, router]);

  // Helper function to parse Arabic date string
  const parseArabicDate = (dateString) => {
    if (!dateString) return null;
    if (dateString instanceof Date && !isNaN(dateString.getTime())) return dateString;
    const standardDate = new Date(dateString);
    if (!isNaN(standardDate.getTime())) return standardDate;

    const arabicMonths = {
      'يناير': 0, 'فبراير': 1, 'مارس': 2, 'أبريل': 3, 'مايو': 4, 'يونيو': 5,
      'يوليو': 6, 'أغسطس': 7, 'سبتمبر': 8, 'أكتوبر': 9, 'نوفمبر': 10, 'ديسمبر': 11,
      'كانون الثاني': 0, 'شباط': 1, 'آذار': 2, 'نيسان': 3, 'أيار': 4, 'حزيران': 5,
      'تموز': 6, 'آب': 7, 'أيلول': 8, 'تشرين الأول': 9, 'تشرين الثاني': 10, 'كانون الأول': 11
    };

    for (const [monthName, monthIndex] of Object.entries(arabicMonths)) {
      if (dateString.includes(monthName)) {
        const parts = dateString.match(/(\d+)\s*(?:من\s*)?(\S+)\s+(\d+)/);
        if (parts) {
          const day = parseInt(parts[1]);
          const year = parseInt(parts[3]);
          const date = new Date(year, monthIndex, day);
          if (!isNaN(date.getTime())) return date;
        }
      }
    }

    const slashMatch = dateString.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (slashMatch) {
      const day = parseInt(slashMatch[1]);
      const month = parseInt(slashMatch[2]) - 1;
      const year = parseInt(slashMatch[3]);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) return date;
    }
    return null;
  };

  const calculateDaysRemaining = (dateString) => {
    const vaccineDate = parseArabicDate(dateString);
    if (!vaccineDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    vaccineDate.setHours(0, 0, 0, 0);
    const diffTime = vaccineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };

  const fetchNextVaccine = async (children, office = null) => {
    if (!children || children.length === 0) return null;

    try {
      const nextVaccinePromises = children.map(async (child) => {
        try {
          const childId = child.id || child._id;
          const url = office 
            ? `/childs/getNextVaccine/${childId}?office=${encodeURIComponent(office)}`
            : `/childs/getNextVaccine/${childId}`;
          const response = await api.get(url);
          const vaccineData = response.data;
          const vaccineInfo = vaccineData?.nextVaccine || vaccineData?.nextTask;
          if (!vaccineInfo) return null;

          return {
            ...vaccineInfo,
            childId: childId,
            childName: child.name || child.nameAr || "غير محدد"
          };
        } catch (error) {
          return null;
        }
      });

      const results = await Promise.all(nextVaccinePromises);
      const validResults = results.filter(r => r !== null);
      if (validResults.length === 0) return null;

      validResults.sort((a, b) => {
        const dateA = parseArabicDate(a.date);
        const dateB = parseArabicDate(b.date);
        if (!dateA || !dateB) return 0;
        return dateA - dateB;
      });

      const earliest = validResults[0];
      return {
        vaccineName: earliest.title,
        childName: earliest.childName,
        dueDate: earliest.date,
        day: earliest.day,
        daysRemaining: calculateDaysRemaining(earliest.date),
        childId: earliest.childId,
        office: earliest.office,
        warning: earliest.warning
      };
    } catch (error) {
      return null;
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoadingVaccine(true);
      const response = await api.get('/dashboard');
      const dashboardData = response.data;
      
      const children = dashboardData?.children || [];
      if (children.length > 0) {
        const counts = await Promise.all(
          children.map(async (child) => {
            try {
              const childId = child.id || child._id;
              const vaccineResponse = await api.get(`/childs/getDueVaccines/${childId}`);
              const res = vaccineResponse.data?.results || {};
              const upcoming = (res.upcoming?.length || 0) + (res.nextVaccine ? 1 : 0);
              const overdue = res.overdue?.length || 0;
              return { upcoming, overdue };
            } catch (err) {
              return { upcoming: 0, overdue: 0 };
            }
          })
        );
        
        const upcomingTotal = counts.reduce((sum, c) => sum + c.upcoming, 0);
        const overdueTotal = counts.reduce((sum, c) => sum + c.overdue, 0);
        
        dashboardData.stats = {
          ...(dashboardData.stats || {}),
          childrenCount: children.length,
          upcomingCount: upcomingTotal,
          overdueCount: overdueTotal,
        };

        const savedOffice = localStorage.getItem('selectedOffice');
        const officeToUse = savedOffice || children[0]?.healthOffice || null;
        const nextVaccine = await fetchNextVaccine(children, officeToUse);
        setNextVaccineData(nextVaccine);
      }
      
      setData(dashboardData);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setFetchError("تعذر تحميل البيانات. حاول مرة أخرى.");
    } finally {
      setLoadingVaccine(false);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#33AB98]"></div>
        </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="animate-fade-in">
        {/* يعتمد إظهار رسالة الاشتراك على الـ Layout، لذا لا نعرض رسالة خطأ هنا */}
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20"> 
       <header className="mb-6">
          <h1 className="text-2xl font-bold text-[#2C3E50]">لوحة التحكم</h1>
          <p className="text-gray-500">نظرة عامة على صحة أطفالك</p>
       </header>

       {fetchError && (
         <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{fetchError}</div>
       )}

       {data && (
           <>
             <StatsCards stats={data.stats} />
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loadingVaccine ? (
                   <div className="bg-[#33AB98] rounded-2xl p-5 text-white shadow-lg shadow-blue-200 relative overflow-hidden flex items-center justify-center min-h-[200px]">
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                   </div>
                ) : nextVaccineData ? (
                   <NextVaccineCard
                      vaccineName={nextVaccineData.vaccineName}
                      childName={nextVaccineData.childName}
                      dueDate={nextVaccineData.dueDate}
                      day={nextVaccineData.day}
                      daysRemaining={nextVaccineData.daysRemaining}
                      childId={nextVaccineData.childId}
                      office={nextVaccineData.office}
                      warning={nextVaccineData.warning}
                   />
                ) : (
                   <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                     <p className="text-gray-500">لا توجد تطعيمات قادمة</p>
                   </div>
                )}
                <ActivityFeed activities={data.recentActivity} />
             </div>
             
             {/* Vaccination Table */}
             <div className="mt-8">
               <VaccinationTable children={data.children} />
             </div>
             
             {/* Announcements can go here */}
             {data.announcements && data.announcements.length > 0 && (
                <div className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                    <h3 className="font-bold text-yellow-800 mb-2">تنبيهات هامة</h3>
                    {/* Render announcements */}
                </div>
             )}
           </>
       )}
    </div>
  );
}
