'use client';

import { CheckCircle2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const ChildCard = ({ id, name, birthDate, gender, completedVaccines, totalVaccines, isSelected, onSelect }) => {
  const progress = totalVaccines > 0 ? (completedVaccines / totalVaccines) * 100 : 0;
  
  // Handle both Date objects and strings with validation
  let formattedDate = "غير محدد";
  try {
    const dateObj = birthDate instanceof Date ? birthDate : new Date(birthDate);
    if (!isNaN(dateObj.getTime())) {
      formattedDate = dateObj.toLocaleDateString('ar-EG');
    }
  } catch (error) {
    console.error("Invalid birthDate:", birthDate);
  }

  return (
    <div className="relative group">
      <Link href={`/childs/${id}`} className="block">
        <div className={`bg-white p-4 rounded-xl border transition-all hover:shadow-md ${
          isSelected ? 'border-[#33AB98] ring-2 ring-blue-100' : 'border-gray-100 hover:border-[#33AB98]'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
              gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
            }`}>
              {name ? name[0] : '👶'}
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                {name || "طفل"}
                <ChevronLeft className="w-4 h-4 text-gray-300 group-hover:text-[#33AB98] transition-colors opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0" />
              </h4>
              <p className="text-xs text-gray-500 mb-2">
                {completedVaccines !== undefined && totalVaccines !== undefined
                  ? `${completedVaccines} من ${totalVaccines} تطعيم مكتمل`
                  : "غير محدد"}
              </p>
              
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      progress === 100 ? 'bg-green-500' : 'bg-[#33AB98]'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-[#33AB98]">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {onSelect && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            onSelect({ id, name, gender, birthDate });
          }}
          className={`absolute top-2 left-2 p-1.5 rounded-full shadow-sm transition-all z-20 ${
            isSelected 
            ? 'bg-[#33AB98] text-white' 
            : 'bg-white text-gray-400 border border-gray-100 hover:text-[#33AB98]'
          }`}
          title="اختيار هذا الطفل كطفل أساسي"
        >
          <CheckCircle2 size={14} />
        </button>
      )}
    </div>
  );
};

