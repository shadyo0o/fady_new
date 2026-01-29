'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api/client';
import Link from 'next/link';
import { Baby, Plus, UserCog } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useChild } from '@/contexts/ChildContext';
import { ChildCard } from '@/components/cards/ChildCard';

export default function ChildListPage() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedChild, selectChild } = useChild();

  useEffect(() => {
    fetchChildren();

    // Refresh data when page becomes visible (e.g., after navigating back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchChildren();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchChildren = async () => {
    try {
      console.log('Fetching children from /childs/getall...');
      const response = await api.get('/childs/getall');
      const data = response.data;
      
      console.log('Raw API Response:', data);
      
      // Handle the structure from API response: { message: "Success", child: [...] }
      let childrenList = [];
      if (data && Array.isArray(data.child)) {
         childrenList = data.child;
         console.log('Found children in data.child:', childrenList.length);
      } else if (data && Array.isArray(data.childs)) {
         childrenList = data.childs;
         console.log('Found children in data.childs:', childrenList.length);
      } else if (Array.isArray(data)) {
        childrenList = data;
        console.log('Found children directly in data:', childrenList.length);
      } else if (data && Array.isArray(data.data)) {
         childrenList = data.data;
         console.log('Found children in data.data:', childrenList.length);
      } else {
         console.log('No children found. Available keys:', Object.keys(data || {}));
      }

      console.log('Final children list:', childrenList);

      // Fetch vaccine data for each child to calculate progress
      const childrenWithProgress = await Promise.all(
        childrenList.map(async (child) => {
          try {
            const childId = child.id || child._id;
            console.log('Processing child:', childId, child.name);
            // Use the same endpoint format as the detail page
            const vaccineResponse = await api.get(`/childs/getDueVaccines/${childId}`);
            const vaccineData = vaccineResponse.data;
            
            // Extract data using the correct structure with results wrapper
            const res = vaccineData?.results || {};
            const takenCount = res.taken?.length || 0;
            const overdueCount = res.overdue?.length || 0;
            const upcomingCount = res.upcoming?.length || 0;
            const nextCount = res.nextVaccine ? 1 : 0;
            
            const totalVaccines = takenCount + overdueCount + upcomingCount + nextCount;
            const completedVaccines = takenCount;

            return {
              ...child,
              totalVaccines,
              completedVaccines
            };
          } catch (error) {
            console.error(`Failed to fetch vaccines for child ${child.id || child._id}:`, error);
            return {
              ...child,
              totalVaccines: 0,
              completedVaccines: 0
            };
          }
        })
      );

      console.log('Setting children with progress:', childrenWithProgress);
      setChildren(childrenWithProgress);
    } catch (error) {
      console.error("Failed to fetch children:", error);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#33AB98]/20 border-t-[#33AB98] rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">جاري جلب أطفالك...</p>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 py-6">
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#2C3E50]">
            أطفالك
          </h2>
          {children.length > 0 ? (
            <Link
              href={`/childs/edit/${children[0].id || children[0]._id}`}
              className="flex items-center gap-1 text-sm font-medium text-[#33AB98]"
            >
              <UserCog className="w-4 h-4" />
              تعديل
            </Link>
          ) : (
            <Link
              href="/childs/add"
              className="flex items-center gap-1 text-sm font-medium text-[#33AB98]"
            >
              <Plus className="w-4 h-4" />
              إضافة
            </Link>
          )}
        </div>

        {children.length > 0 ? (
          <div className="space-y-3">
            {children.map((child) => (
              <ChildCard 
                key={child.id || child._id} 
                id={child.id || child._id}
                {...child} 
                isSelected={selectedChild?.id === (child.id || child._id)}
                onSelect={selectChild}
              />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-white p-8 text-center border border-[#33AB98]/10 shadow-sm">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#33AB98]/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-14 -right-16 w-52 h-52 bg-[#33AB98]/5 rounded-full blur-2xl" />
            <div className="w-16 h-16 bg-[#33AB98]/10 rounded-2xl mx-auto flex items-center justify-center mb-4 text-[#33AB98] border border-[#33AB98]/20 relative z-10">
              <Baby className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-[#2C3E50] mb-1 text-base relative z-10">
              لم تتم إضافة أطفال بعد
            </h3>
            <p className="text-sm text-gray-600 mb-6 relative z-10">
              أضف طفلك لبدء التتبع الذكي لمواعيد التطعيم
            </p>
            <Link href="/childs/add" className="relative z-10 inline-block">
              <Button className="gradient-primary rounded-xl px-8 shadow-lg shadow-[#33AB98]/20 flex items-center gap-2">
                <Plus className="w-4 h-4 ml-1" />
                إضافة طفل
              </Button>
            </Link>
          </div>
        )}
      </div>

      {children.length > 0 && (
        <div className="mt-8 p-4 bg-[#33AB98]/5 rounded-2xl border border-[#33AB98]/10 flex gap-3 text-sm text-[#33AB98]">
          <div className="flex-shrink-0 mt-0.5">💡</div>
          <p>يمكنك اختيار طفل محدد كـ "طفل أساسي" لتطبيق ألوانه المفضلة في التطبيق.</p>
        </div>
      )}
    </div>
  );
}
