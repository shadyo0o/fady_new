'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api/client';
import Link from 'next/link';
import { Baby, Plus, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ChildListPage() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const { data } = await api.get('/childs/getall');
      if (Array.isArray(data)) {
        setChildren(data);
      } else if (data && Array.isArray(data.childs)) {
         setChildren(data.childs);
      } else if (data && Array.isArray(data.data)) {
         setChildren(data.data);
      } else {
        setChildren([]);
      }
    } catch (error) {
      console.error("Failed to fetch children", error);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">جاري التحميل...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#2C3E50]">أطفالي</h1>
        <Link href="/childs/add">
            <Button size="sm" variant="primary">
                <Plus size={18} />
                <span>إضافة طفل</span>
            </Button>
        </Link>
      </div>

      {children.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[#4A90E2]">
                <Baby size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">لا يوجد أطفال مضافين بعد</h3>
            <p className="text-gray-500 mb-6">قم بإضافة طفلك الأول لمتابعة تطعيماته</p>
            <Link href="/childs/add">
                <Button>إضافة طفل الآن</Button>
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map(child => (
                <Link href={`/childs/${child.id}`} key={child.id} className="block group">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-[#4A90E2]">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${child.gender === 'female' ? 'bg-pink-400' : 'bg-blue-400'}`}>
                                <Baby size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#4A90E2] transition-colors">{child.name}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar size={12} />
                                    <span>{new Date(child.birthDate).toLocaleDateString('ar-EG')}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between text-sm">
                            <span className="text-gray-500">العمر:</span>
                            <span className="font-semibold text-gray-700">{child.ageInMonths || '?'} شهر</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      )}
    </div>
  );
}
