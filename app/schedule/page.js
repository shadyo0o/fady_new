'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api/client';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function SchedulePage() {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    // Ideally fetch from an API, using mock data for now based on typical schedule
    const mockSchedule = [
      { id: 1, age: 'عند الولادة', vaccines: ['التهاب الكبد ب (الجرعة الأولى)', 'الدرن (BCG)', 'شلل الأطفال (الجرعة الصفرية)'] },
      { id: 2, age: 'شهرين', vaccines: ['شلل الأطفال (الجرعة الأولى)', 'الخماسي (الجرعة الأولى)', 'الالتهاب الرئوي (الجرعة الأولى)'] },
      { id: 3, age: '4 شهور', vaccines: ['شلل الأطفال (الجرعة الثانية)', 'الخماسي (الجرعة الثانية)', 'الالتهاب الرئوي (الجرعة الثانية)'] },
      { id: 4, age: '6 شهور', vaccines: ['شلل الأطفال (الجرعة الثالثة)', 'الخماسي (الجرعة الثالثة)', 'الالتهاب الرئوي (الجرعة الثالثة)'] },
      { id: 5, age: '9 شهور', vaccines: ['شلل الأطفال (الجرعة الرابعة)', 'فيتامين أ'] },
      { id: 6, age: '12 شهر (سنة)', vaccines: ['شلل الأطفال (الجرعة الخامسة)', 'الحصبة والنكاف والحصبة الألماني (MMR)'] },
      { id: 7, age: '18 شهر (سنة ونصف)', vaccines: ['شلل الأطفال (الجرعة المنشطة)', 'الثلاثي البكتيري (DPT)', 'الحصبة والنكاف والحصبة الألماني (الجرعة الثانية)', 'فيتامين أ'] },
    ];
    
    setSchedule(mockSchedule);
    setLoading(false);
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">جاري التحميل...</div>;

  return (
    <div className="animate-fade-in">
       <header className="mb-6">
          <h1 className="text-2xl font-bold text-[#2C3E50]">جدول التطعيمات</h1>
          <p className="text-gray-500">الدليل الكامل لتطعيمات طفلك الأساسية</p>
       </header>

       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {schedule.map((item, index) => (
            <div key={item.id} className={`p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-4 justify-between items-start md:items-center ${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                <div className="flex items-center gap-3 md:w-1/4">
                    <div className="w-10 h-10 rounded-full bg-[#E3F2FD] flex items-center justify-center text-[#4A90E2]">
                        <Clock size={20} />
                    </div>
                    <div>
                        <span className="block text-sm text-gray-400">العمر</span>
                        <span className="font-bold text-gray-800">{item.age}</span>
                    </div>
                </div>
                
                <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                        {item.vaccines.map((vaccine, vIndex) => (
                            <span key={vIndex} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600">
                                <CheckCircle size={14} className="text-green-500" />
                                {vaccine}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
          ))}
       </div>
    </div>
  );
}
