'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Correct hook for App Router params
import api from '@/lib/api/client';
import Button from '@/components/ui/Button';
import { CheckCircle, Clock, XCircle, Syringe } from 'lucide-react';

import { useRef } from 'react';
import RecordVaccineModal from '@/components/child/RecordVaccineModal';

export default function ChildDetailPage() {
  const { id } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  useEffect(() => {
    if(id) fetchSchedule();
  }, [id]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/childs/getDueVaccines/${id}`);
      setSchedule(data); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenRecord = (item) => {
      setSelectedVaccine(item);
      setModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center">جاري تحميل الجدول...</div>;

  return (
    <div className="animate-fade-in relative">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h1 className="text-2xl font-bold text-[#4A90E2] mb-1">جدول التطعيمات</h1>
            <p className="text-gray-500">متابعة دقيقة لكل الجرعات المستحقة والمكتملة</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 p-4 font-semibold text-gray-600 text-sm border-b">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-4">التطعيم</div>
                <div className="col-span-3">الموعد المتوقع</div>
                <div className="col-span-2">الحالة</div>
                <div className="col-span-2 text-center">إجراء</div>
            </div>

            <div className="divide-y divide-gray-100">
                {Array.isArray(schedule) && schedule.length > 0 ? schedule.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 p-4 items-center hover:bg-blue-50/30 transition-colors">
                        <div className="col-span-1 text-center font-bold text-gray-400">{idx + 1}</div>
                        <div className="col-span-4">
                            <h4 className="font-bold text-gray-800">{item.vaccineName}</h4>
                            <p className="text-xs text-gray-500">{item.notes}</p>
                        </div>
                        <div className="col-span-3 text-sm font-medium text-gray-600">
                            {item.expectedDate ? new Date(item.expectedDate).toLocaleDateString('ar-EG') : '-'}
                        </div>
                        <div className="col-span-2">
                            <StatusBadge status={item.status} />
                        </div>
                        <div className="col-span-2 flex justify-center">
                            {item.status !== 'completed' && (
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="!px-3 !py-1 text-xs"
                                    onClick={() => handleOpenRecord(item)}
                                >
                                    تسجيل
                                </Button>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="p-8 text-center text-gray-500">لا توجد تطعيمات مسجلة</div>
                )}
            </div>
        </div>

        {selectedVaccine && (
            <RecordVaccineModal 
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                childId={id}
                scheduleId={selectedVaccine.scheduleId || selectedVaccine.id} // Adjust key based on API
                vaccineName={selectedVaccine.vaccineName}
                onSuccess={fetchSchedule}
            />
        )}
    </div>
  );
}

function StatusBadge({ status }) {
    if (status === 'completed') {
        return <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle size={14}/> تم الأخذ</span>;
    } else if (status === 'overdue') {
        return <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-bold"><XCircle size={14}/> متأخر</span>;
    } else {
        return <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-bold"><Clock size={14}/> قادم</span>;
    }
}
