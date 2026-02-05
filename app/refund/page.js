'use client'

import MobileLayout from '@/components/layout/MobileLayout';
import { RefreshCcw, DollarSign, AlertCircle } from 'lucide-react';

export default function RefundPage() {
  return (
    <MobileLayout dir="rtl">
      <div className="min-h-screen bg-white pb-24">
        <div className="p-5 space-y-6">
          <div className="bg-[#33AB98] rounded-2xl p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <RefreshCcw className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold mb-2">سياسة الاسترجاع</h1>
            <p className="text-blue-100 text-sm">سياسة واضحة لضمان حقوق الجميع</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100 text-[#33AB98]">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2 font-bold">تكلفة الاشتراك</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  قيمة الاشتراك 50 جنيهاً مصرياً (عرض لفترة محدودة بدلاً من 80 جنيهاً) لمدة 18 شهرًا.
                </p>
                <p className="text-xs text-[#33AB98] font-bold mt-2">
                  • التكلفة: العرض الحالي يوفر الخدمة بتكلفة تبلغ أقل من 3 جنيهات شهرياً.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-orange-100 text-orange-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">شروط الاسترجاع</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  لا يمكن استرداد القيمة المدفوعة بمجرد تفعيل مميزات الحساب (متابعة التطعيمات الذكية، التنبيهات، سجل التطعيمات).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
