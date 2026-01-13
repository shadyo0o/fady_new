import { CheckCircle2 } from 'lucide-react';

export default function ActivityFeed({ activities }) {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-lg mb-4 text-[#2C3E50]">آخر النشاطات</h3>
      <div className="flex flex-col gap-4">
        {activities.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="mt-1">
                <CheckCircle2 size={18} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {item.childName}: {item.vaccine}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span>{item.date}</span>
                <span>•</span>
                <span>{item.office}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
