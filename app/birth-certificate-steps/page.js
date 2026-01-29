'use client';

import { ChevronRight, FileText, Calendar, Users, Info, Copy, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import MobileLayout from '@/components/layout/MobileLayout';
import { BottomNav } from '@/components/layout/BottomNav';

export default function BirthCertificateStepsPage() {
  const documents = [
    { title: 'بطاقة الزوج (الأصل + صورتين) يجب ان تكون سارية', icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { title: 'بطاقة الزوجة (الأصل + صورتين) يجب ان تكون سارية', icon: <FileText className="w-5 h-5 text-pink-500" /> },
    { title: 'قسيمة الزواج الأصلية (الأصل + صورتين)', icon: <FileText className="w-5 h-5 text-purple-500" /> },
    { title: 'إخطار الولادة من المستشفى (الأصل + صورتين)', icon: <FileText className="w-5 h-5 text-green-500" /> },
  ];

  return (
    <MobileLayout dir="rtl">
      <div className="min-h-screen pb-24 bg-gray-50">
        {/* Header */}
        <div className="bg-[#33AB98] px-5 pt-12 pb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <Link href="/home" className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 text-white">
              <ChevronRight className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold text-white">خطوات استخراج شهادة الميلاد</h1>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 flex items-start gap-3 relative z-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Calendar className="w-6 h-6 text-[#33AB98]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">التوقيت المسموح به</p>
              <p className="text-blue-50 text-xs mt-1 leading-relaxed">
                مسموح باستخراج شهادة الميلاد خلال <span className="text-white font-bold underline">14 يوم</span> من تاريخ الولادة.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 -mt-10 relative z-20">
          {/* Documents Section */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Copy className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="font-bold text-gray-800">الأوراق المطلوبة</h2>
            </div>
            
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  {doc.icon}
                  <span className="text-sm font-medium text-gray-700">{doc.title}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed font-medium">
                تأكد من إحضار <span className="font-bold text-blue-900">نسختين ضوئيتين (تصوير)</span> من كل ورقة من الأوراق المذكورة أعلاه.
              </p>

            </div>
            <div className="flex items-start gap-2 pt-2 border-t border-blue-200">
    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
    <p className="text-xs text-red-800 leading-relaxed">
      <span className="font-bold">تنبيه هام:</span> في حال كانت البطاقة الشخصية <span className="underline">غير سارية</span>، يرجى إحضار شهادة الميلاد الأصلية (كمبيوتر من السجل المدني فى ش السجن) لصاحب البطاقة لإتمام التسجيل.
    </p>
  </div>
          </div>
          {/* Important Presence Section */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <h2 className="font-bold text-gray-800">حضور الأب أو الأقارب</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <p className="text-sm font-bold text-amber-900">الخيار الأول: حضور الأب</p>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  حضور الأب <span className="font-bold underline">ضروري جداً</span> كإجراء طبيعي لتسجيل المولود.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <p className="text-sm font-bold text-gray-900">الخيار الثاني: في حالة غياب الأب</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  يجب حضور أحد أفراد عائلة الأب (العصب) حصراً، وهم:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {['الجد للأب', 'الجدة للأب', 'العم', 'العمة'].map((relative, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      <span className="text-lg">👤</span>
                      <span className="text-xs font-bold text-gray-800">{relative}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-gray-500 leading-relaxed italic">
                    يجب جلب كل الأوراق المذكورة أعلاه بالإضافة إلى <span className="font-bold text-gray-700">صورتين من بطاقة الشخص المُبلّغ</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pb-6">
            <p className="text-xl text-red-800">
              يرجى التوجه لمكتب الصحة التابع له مكان الولادة.
            </p>
            <p className="text-xl text-green-800">
              لمعرفة مكتب الصحة التابع لك راسلنا عبر الواتساب (فريق فادى).
            </p>
          </div>
        </div>
      </div>
      <BottomNav />
    </MobileLayout>
  );
}
