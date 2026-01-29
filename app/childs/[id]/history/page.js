'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api/client';
import { 
  ArrowRight, 
  FileText, 
  Check, 
  Calendar,
  Baby,
  AlertCircle,
  Stethoscope
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

      // Fetch History with notes
      const hRes = await api.get(`/childs/getVaccineHistory/${id}`);
      const historyData = hRes.data?.history || [];
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAgeAtVaccine = (birthDateStr, vaccineDateStr) => {
    if (!birthDateStr || !vaccineDateStr) return "-";
    const birthDate = new Date(birthDateStr);
    const vaccineDate = new Date(vaccineDateStr);
    
    // Parse partial dates if needed (backend sometimes sends manually formatted strings)
    // Assuming backend sends valid ISO or parseable strings here based on previous files.
    // If vaccineDateStr is "YYYY-MM-DD", new Date() handles it.
    
    const diffTime = vaccineDate.getTime() - birthDate.getTime();
    const months = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    
    if (months < 1) return "أقل من شهر";
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0) {
      return `${years} سنة${remainingMonths > 0 ? ` و ${remainingMonths} شهر` : ''}`;
    }
    return `${months} شهر`;
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
        <div className="space-y-4">
          {history.length > 0 ? history.map((vaccine, index) => {
              // Handle diverse date formats from backend
              // Ideally backend sends ISO, but helper parse functions exist. 
              // Using standard Date parsing for now as verified in plan.
              const vacDate = vaccine.administeredDate || vaccine.date;
              
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative overflow-hidden group hover:shadow-md transition-all">
                   {/* Watermark/Icon */}
                   <Check className="absolute -right-2 -bottom-2 w-16 h-16 text-green-50 opacity-10 rotate-12" />
                   
                   <div className="relative z-10">
                     <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-gray-800 text-lg">{vaccine.title || vaccine.vaccineName || vaccine.name}</h3>
                       <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full uppercase border border-green-100">
                         مكتمل
                       </span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-3 mb-3">
                       <div className="flex items-center gap-2 text-sm text-gray-600">
                         <Calendar className="w-4 h-4 text-[#33AB98]" />
                         <span>{vacDate ? new Date(vacDate).toLocaleDateString('ar-EG') : 'تم الأخذ'}</span>
                       </div>
                       <div className="flex items-center gap-2 text-sm text-gray-600">
                         <Baby className="w-4 h-4 text-[#33AB98]" />
                         <span>عمر: {calculateAgeAtVaccine(child?.birthDate, vacDate)}</span>
                       </div>
                       {vaccine.office && (
                         <div className="col-span-2 flex items-center gap-2 text-sm text-gray-500 border-t border-gray-50 pt-2 mt-1">
                             <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <Stethoscope className="w-3 h-3 text-gray-500" />
                             </div>
                             <span>{vaccine.office}</span>
                         </div>
                       )}
                     </div>

                     {/* Side Effects / Notes */}
                     {vaccine.notes && vaccine.notes.trim().length > 0 && (
                        <div className="mt-3 bg-orange-50 rounded-lg p-3 border border-orange-100 text-sm">
                            <div className="flex items-center gap-2 mb-1 text-orange-700 font-semibold">
                                <AlertCircle className="w-4 h-4" />
                                <span>أعراض جانبية / ملاحظات</span>
                            </div>
                            <p className="text-gray-700 leading-relaxed pr-6 text-xs">
                                {vaccine.notes}
                            </p>
                        </div>
                     )}
                   </div>
                </div>
              );
          }) : (
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
