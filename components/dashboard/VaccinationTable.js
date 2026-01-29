'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api/client';
import { 
  Baby, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  AlertCircle,
  ChevronLeft 
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function VaccinationTable({ children: propChildren }) {
  const [childrenData, setChildrenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVaccinationData();
  }, [propChildren]);

  const fetchVaccinationData = async () => {
    try {
      setLoading(true);
      let children = propChildren;
      
      if (!children) {
        const dashboardResponse = await api.get('/dashboard');
        children = dashboardResponse.data?.children || [];
      }
      
      if (children.length === 0) {
        setChildrenData([]);
        setLoading(false);
        return;
      }

      const childrenVaccinationData = await Promise.all(
        children.map(async (child) => {
          try {
            const childId = child.id || child._id;
            const vaccineResponse = await api.get(`/childs/getDueVaccines/${childId}`);
            const vaccineData = vaccineResponse.data;
            const res = vaccineData?.results || {};
            
            return {
              id: childId,
              name: child.name || child.nameAr || 'غير محدد',
              birthDate: child.birthDate,
              taken: res.taken || [],
              overdue: res.overdue || [],
              upcoming: res.upcoming || [],
              nextVaccine: res.nextVaccine || null
            };
          } catch (err) {
            console.error(`Error fetching vaccine data for child ${child.id}:`, err);
            return {
              id: child.id || child._id,
              name: child.name || child.nameAr || 'غير محدد',
              birthDate: child.birthDate,
              taken: [],
              overdue: [],
              upcoming: [],
              nextVaccine: null,
              error: true
            };
          }
        })
      );

      setChildrenData(childrenVaccinationData);
    } catch (err) {
      console.error('Error fetching vaccination data:', err);
      setError('تعذر تحميل بيانات التطعيمات');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDateStr) => {
    if (!birthDateStr) return "-";
    const birthDate = new Date(birthDateStr);
    const now = new Date();
    const months = Math.floor(
      (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    );
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0) {
      return `${years} سنة و ${remainingMonths} شهر`;
    }
    return `${months} شهر`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'taken':
        return (
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold">
            <Check className="w-3 h-3" />
            <span>مكتمل</span>
          </div>
        );
      case 'overdue':
        return (
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold">
            <X className="w-3 h-3" />
            <span>متأخر</span>
          </div>
        );
      case 'next':
        return (
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold">
            <Clock className="w-3 h-3" />
            <span>القادم</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 text-gray-400 text-xs font-bold">
            <Clock className="w-3 h-3" />
            <span>قادم</span>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#33AB98]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-red-600">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (childrenData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-gray-500">
          <Baby className="w-8 h-8 mx-auto mb-2" />
          <p>لا يوجد أطفال مسجلين</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">جدول التطعيمات لجميع الأطفال</h3>
          <div className="text-sm text-gray-500">
            {childrenData.reduce((sum, child) => sum + child.overdue.length, 0)} متأخر • 
            {childrenData.reduce((sum, child) => sum + (child.nextVaccine ? 1 : 0), 0)} قادم
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="p-4 text-sm font-semibold text-gray-600 text-right">الطفل</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-center">العمر</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-center">التطعيمات المتأخرة</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-center">التطعيم القادم</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-center">التقدم</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {childrenData.map((child) => {
              const totalVaccines = child.taken.length + child.overdue.length + child.upcoming.length + (child.nextVaccine ? 1 : 0);
              const progress = totalVaccines > 0 ? Math.round((child.taken.length / totalVaccines) * 100) : 0;
              
              return (
                <tr key={child.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#33AB98]/10 rounded-full flex items-center justify-center">
                        <Baby className="w-5 h-5 text-[#33AB98]" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{child.name}</p>
                        {child.birthDate && (
                          <p className="text-xs text-gray-500">
                            {new Date(child.birthDate).toLocaleDateString('ar-EG')}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4 text-center">
                    <span className="text-sm text-gray-600">{calculateAge(child.birthDate)}</span>
                  </td>
                  
                  <td className="p-4 text-center">
                    {child.overdue.length > 0 ? (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold">
                          <AlertCircle className="w-3 h-3" />
                          <span>{child.overdue.length} متأخر</span>
                        </span>
                        <div className="text-xs text-gray-500 max-w-[150px] truncate">
                          {child.overdue[0]?.title || child.overdue[0]?.vaccineName || child.overdue[0]?.name}
                          {child.overdue.length > 1 && ` +${child.overdue.length - 1}`}
                        </div>
                      </div>
                    ) : (
                      <span className="text-green-600 text-sm font-medium">لا يوجد</span>
                    )}
                  </td>
                  
                  <td className="p-4 text-center">
                    {child.nextVaccine ? (
                      <div className="space-y-1">
                        {getStatusBadge('next')}
                        <div className="text-xs text-gray-500 max-w-[150px] truncate">
                          {child.nextVaccine.title || child.nextVaccine.vaccineName || child.nextVaccine.name}
                        </div>
                        {child.nextVaccine.date && (
                          <div className="text-xs text-orange-600">
                            {new Date(child.nextVaccine.date).toLocaleDateString('ar-EG')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">لا يوجد</span>
                    )}
                  </td>
                  
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#33AB98] rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-[#33AB98]">{progress}%</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {child.taken.length}/{totalVaccines}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-4 text-center">
                    <Link 
                      href={`/childs/${child.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#33AB98] text-white text-xs font-bold rounded-full hover:bg-[#2A9A84] transition-colors"
                    >
                      <span>التفاصيل</span>
                      <ChevronLeft className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
