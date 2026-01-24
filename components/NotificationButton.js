'use client';

import { useFCM } from '@/hooks/useFCM'; 
import { Bell, BellOff, BellRing, Loader2 } from 'lucide-react'; // أيقونات اختيارية

export default function NotificationButton() {
  const { permission, requestPermission } = useFCM();

  // 1. حالة الإذن مقبول (التنبيهات تعمل)
  if (permission === 'granted') {
    return (
      <div className="flex items-center gap-2 text-green-600 font-medium p-3 border border-green-200 rounded-xl bg-green-50 shadow-sm">
        <BellRing size={20} className="animate-pulse" />
        <span>تنبيهات المواعيد مفعلة</span>
      </div>
    );
  }

  // 2. حالة الإذن مرفوض (المستخدم حظرها من المتصفح)
  if (permission === 'denied') {
    return (
      <div className="flex items-center gap-2 text-red-600 font-medium p-3 border border-red-200 rounded-xl bg-red-50">
        <BellOff size={20} />
        <span>الإشعارات محظورة من إعدادات المتصفح</span>
      </div>
    );
  }

  // 3. الحالة الافتراضية (طلب التفعيل)
  return (
    <button
      onClick={requestPermission}
      className="flex items-center gap-2 bg-[#33AB98] hover:bg-[#357ABD] text-white px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 font-bold"
    >
      <Bell size={20} />
      <span>تفعيل تنبيهات التطعيمات</span>
    </button>
  );
}