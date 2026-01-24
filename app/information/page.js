'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api/client';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import Input from '@/components/ui/Input';

export default function InformationPage() {
  const [adviceList, setAdviceList] = useState([]);
  const [ageFilter, setAgeFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdvice();
  }, [ageFilter]);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const params = {};
      if (ageFilter) params.ageInMonths = ageFilter;
      
      const { data } = await api.get('/information/', { params });
      setAdviceList(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-[#33AB98] mb-1">المعلومات الطبية</h1>
                <p className="text-gray-500">نصائح وإرشادات موثوقة لصحة طفلك</p>
            </div>
            
            <div className="w-full md:w-64">
                <Input 
                   type="number" 
                   placeholder="فلتر بالعمر (شهور)..." 
                   value={ageFilter}
                   onChange={(e) => setAgeFilter(e.target.value)}
                />
            </div>
        </div>

        {loading ? (
             <div className="text-center py-10">جاري التحميل...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adviceList && adviceList.length > 0 ? adviceList.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-50 p-3 rounded-lg text-[#33AB98]">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                                <div className="mt-3 flex gap-2">
                                    <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-500">
                                        لعمر: {item.targetAge ? `${item.targetAge} شهر` : 'عام'}
                                    </span>
                                    <span className="text-xs font-semibold bg-green-50 px-2 py-1 rounded text-green-600">
                                        {item.category || 'نصيحة عامة'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-2xl border border-dashed">
                        لا توجد نصائح متاحة لهذا العمر حالياً
                    </div>
                )}
            </div>
        )}
    </div>
  );
}
