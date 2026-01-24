'use client'

import MobileLayout from '@/components/layout/MobileLayout';
import { Shield, Lock, Key, EyeOff, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <MobileLayout dir="rtl">
      <div className="min-h-screen bg-white pb-24">
        <div className="p-5 space-y-6">
          <div className="bg-[#33AB98] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold">الخصوصية والأمان</h1>
                <p className="text-blue-100 text-sm">حماية بياناتك مسؤوليتنا الأولى</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
                <Lock className="w-5 h-5 text-[#33AB98]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-sm">كلمة المرور</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  كلمة المرور مشفّرة ولا يمكن لأي أحد الاطلاع عليها، بما في ذلك فريق العمل.
                  يجب الاحتفاظ بها لأننا لا نستطيع رؤيتها أو إرسالها لك نصيًا.
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-50" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <EyeOff className="w-4 h-4 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-800">تشفير كامل</p>
                </div>
                <p className="text-sm text-gray-600">
                  البيانات الحساسة تُخزن بشكل مشفّر وفق أفضل المعايير الأمنية.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-800">جلسات آمنة</p>
                </div>
                <p className="text-sm text-gray-600">
                  صلاحيات الوصول تعتمد على التوكن المشفّر وتُجدد تلقائيًا عند الحاجة.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-800">حماية الحساب</p>
                </div>
                <p className="text-sm text-gray-600">
                  مراقبة محاولات الدخول وإجراءات فورية عند الاشتباه بنشاط غير معتاد.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-800">خصوصيتك أولاً</p>
                </div>
                <p className="text-sm text-gray-600">
                  نستخدم أقل قدر ممكن من البيانات لتقديم الخدمة، ولا نشاركها مع أي جهة.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[12px] text-amber-900 leading-relaxed font-medium">
                ⚠️ تنويه هام: المعلومات والمواعيد الواردة في التطبيق هي للأغراض الاسترشادية فقط. يجب دائماً استشارة الطبيب المختص أو وزارة الصحة للتأكد من المواعيد والجرعات الصحيحة.
                كما يرجى العلم أن المستخدم هو المسؤول الوحيد عن دقة البيانات المدخلة، وأن التطبيق غير مسؤول عن أي حسابات خاطئة ناتجة عن إدخال تواريخ غير صحيحة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
