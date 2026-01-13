'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/client';
import StatsCards from '@/components/dashboard/StatsCards';
import NextVaccineCard from '@/components/dashboard/NextVaccineCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    } else if (user) {
        fetchDashboardData();
    }
  }, [user, loading, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/');
      setData(response.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setFetchError("تعذر تحميل البيانات. حاول مرة أخرى.");
    }
  };

  if (loading || (!data && !fetchError)) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A90E2]"></div>
        </div>
    );
  }

  return (
    <div className="animate-fade-in"> 
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
                <NextVaccineCard vaccine={data.nextVaccine} />
                <ActivityFeed activities={data.recentActivity} />
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
