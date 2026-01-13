import { Users, AlertCircle, Calendar } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      label: 'الأطفال',
      value: stats.childrenCount,
      icon: Users,
      color: 'bg-blue-500',
      bg: 'bg-blue-50'
    },
    {
      label: 'تطعيمات قادمة',
      value: stats.upcomingCount,
      icon: Calendar,
      color: 'bg-green-500',
      bg: 'bg-green-50'
    },
    {
      label: 'فائتة/متأخرة',
      value: stats.overdueCount,
      icon: AlertCircle,
      color: 'bg-red-500',
      bg: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className={`${card.bg} p-6 rounded-2xl border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]`}>
            <div className={`p-3 rounded-xl ${card.color} text-white shadow-lg shadow-opacity-20`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{card.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
