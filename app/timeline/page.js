'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Clock, CheckCircle } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';

const timelineData = [
  { id: 1, age: 'عند الولادة', vaccines: ['التهاب الكبد ب (الجرعة الأولى)', 'الدرن (BCG)', 'شلل الأطفال (الجرعة الصفرية)'] },
  { id: 2, age: 'شهرين', vaccines: ['شلل الأطفال (الجرعة الأولى)', 'الخماسي (الجرعة الأولى)', 'الالتهاب الرئوي (الجرعة الأولى)'] },
  { id: 3, age: '4 شهور', vaccines: ['شلل الأطفال (الجرعة الثانية)', 'الخماسي (الجرعة الثانية)', 'الالتهاب الرئوي (الجرعة الثانية)'] },
  { id: 4, age: '6 شهور', vaccines: ['شلل الأطفال (الجرعة الثالثة)', 'الخماسي (الجرعة الثالثة)', 'الالتهاب الرئوي (الجرعة الثالثة)'] },
  { id: 5, age: '9 شهور', vaccines: ['شلل الأطفال (الجرعة الرابعة)', 'فيتامين أ'] },
  { id: 6, age: '12 شهر (سنة)', vaccines: ['شلل الأطفال (الجرعة الخامسة)', 'الحصبة والنكاف والحصبة الألماني (MMR)'] },
  { id: 7, age: '18 شهر (سنة ونصف)', vaccines: ['شلل الأطفال (الجرعة المنشطة)', 'الثلاثي البكتيري (DPT)', 'الحصبة والنكاف والحصبة الألماني (الجرعة الثانية)', 'فيتامين أ'] },
];

const TimelinePage = () => {
  const router = useRouter();

  return (
    <MobileLayout dir="rtl">
      <div className="min-h-screen bg-white pb-6">
        {/* Header - Classic Medical */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-10">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="w-4 h-4 text-gray-700" />
          </button>
          <h1 className="text-base font-semibold text-gray-800">الجدول الزمني</h1>
        </div>

        {/* Timeline Content */}
        <div className="p-4">
             <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                <h2 className="text-[#4A90E2] font-bold mb-1">جدول التطعيمات الإجباري</h2>
                <p className="text-xs text-gray-600">وفقاً لوزارة الصحة والسكان المصرية</p>
             </div>

             <div className="relative border-r-2 border-dashed border-gray-200 mr-4 space-y-8">
                {timelineData.map((item, index) => (
                    <div key={item.id} className="relative pr-8">
                        {/* Dot */}
                        <div className="absolute -right-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-[#4A90E2]" />
                        
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-4 h-4 text-[#4A90E2]" />
                                <h3 className="font-bold text-gray-800">{item.age}</h3>
                            </div>
                            
                            <div className="space-y-2">
                                {item.vaccines.map((vaccine, vIndex) => (
                                    <div key={vIndex} className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                        <span>{vaccine}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default TimelinePage;
