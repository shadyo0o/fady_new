'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api/client';
import { 
  ArrowRight, 
  FileText, 
  Check, 
  Calendar,
  Baby
} from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { cn } from '@/lib/utils';

export default function ChildHistoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [child, setChild] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

      // Robust Due Vaccines fetch and extract 'taken'
      const sRes = await api.get(`/childs/getDueVaccines/${id}`);
      const data = sRes.data || {};
      const res = data.results || data.data || data || {};
      setHistory(res.taken || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout hideBottomNav>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hideBottomNav>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-l from-green-500 to-green-600 text-white p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">سجل التطعيمات</h1>
        </div>
      </div>

      <div className="p-4">
        {/* Summary Card */}
        <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">
              تطعيمات {child?.name || "طفلك"} المكتملة
            </h2>
            <p className="text-sm text-gray-500">
              {history.length} تطعيمات تم تسجيل أخذها بنجاح
            </p>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {history.length > 0 ? history.map((vaccine, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative overflow-hidden">
               {/* Watermark/Icon */}
               <Check className="absolute -right-2 -bottom-2 w-16 h-16 text-green-50 opacity-10 rotate-12" />
               
               <div className="relative z-10">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-gray-800">{vaccine.title || vaccine.vaccineName || vaccine.name}</h3>
                   <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full uppercase">
                     مكتمل
                   </span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 mt-3">
                   <div className="flex items-center gap-2 text-xs text-gray-500">
                     <Calendar className="w-3.5 h-3.5 text-gray-400" />
                     <span>{vaccine.expectedDate ? new Date(vaccine.expectedDate).toLocaleDateString('ar-EG') : 'تم الأخذ'}</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-gray-500">
                     <Baby className="w-3.5 h-3.5 text-gray-400" />
                     <span>في عمر: {vaccine.dueInMonths ?? (vaccine.ageInMonths || vaccine.ageMonths)} شهر</span>
                   </div>
                 </div>
               </div>
            </div>
          )) : (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <FileText className="w-8 h-8" />
              </div>
              <p className="text-gray-500">لا توجد تطعيمات مكتملة مسجلة بعد</p>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
