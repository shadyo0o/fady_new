'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { HEALTH_OFFICES } from '@/lib/constants';
import api from '@/lib/api/client';
import { X } from 'lucide-react';
import { showToast } from '@/lib/toast';

export default function RecordVaccineModal({ isOpen, onClose, childId, scheduleId, vaccineName, onSuccess }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [office, setOffice] = useState(HEALTH_OFFICES[0].value);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !scheduleId) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!childId) {
      showToast.error('معرف الطفل مفقود');
      return;
    }
    
    if (!scheduleId) {
      showToast.error('معرف التطعيم المجدول مفقود');
      return;
    }

    setLoading(true);
    try {
      await api.post('/childs/recordVaccine', {
        childId,
        scheduleId, // ID of the vaccine schedule item - ONLY this vaccine
        actualDate: date,
        office
      });
      
      showToast.success('تم تسجيل التطعيم بنجاح ✅');
      
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'فشل تسجيل التطعيم';
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#2C3E50]">تسجيل تطعيم</h3>
            <button onClick={onClose}><X size={20} className="text-gray-400"/></button>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
            أنت تقوم بتسجيل: <span className="font-bold text-[#33AB98]">{vaccineName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
                label="تاريخ التطعيم الفعلي"
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
            
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">تم في مكتب:</label>
                <select 
                   className="p-3 border-2 border-gray-200 rounded-lg bg-white outline-none focus:border-[#33AB98]"
                   value={office}
                   onChange={(e) => setOffice(e.target.value)}
                >
                    {HEALTH_OFFICES.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>

            <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">إلغاء</Button>
                <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'جاري الحفظ...' : 'تأكيد'}
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
}
