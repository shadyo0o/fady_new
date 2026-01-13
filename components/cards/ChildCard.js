'use client';

import { CheckCircle2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const ChildCard = ({ id, name, birthDate, gender, completedVaccines, totalVaccines }) => {
  const progress = (completedVaccines / totalVaccines) * 100;

  return (
    <Link href={`/childs/${id}`}>
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
            gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
          }`}>
            {name[0]}
          </div>
          
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
              {name}
              <ChevronLeft className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0" />
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span>{birthDate.toLocaleDateString('ar-EG')}</span>
              <span>•</span>
              <span>{totalVaccines} تطعيم</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    progress === 100 ? 'bg-green-500' : 'bg-[#4A90E2]'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-[#4A90E2]">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
