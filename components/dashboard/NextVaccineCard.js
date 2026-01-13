import styles from './Dashboard.module.css';
import { CalendarClock, MapPin } from 'lucide-react';

export default function NextVaccineCard({ vaccine }) {
  if (!vaccine) return (
     <div className={styles.emptyCard}>
        <p>لا توجد تطعيمات قادمة قريباً</p>
     </div>
  );

  return (
    <div className={styles.vaccineCard}>
      <div className={styles.vaccineHeader}>
        <div className="flex items-center gap-2">
            <span className={styles.pulseDot}></span>
            <h3 className="font-bold text-lg text-[#2C3E50]">التطعيم القادم</h3>
        </div>
        <span className={styles.badge}>{vaccine.childName}</span>
      </div>

      <div className="mt-4">
        <h4 className="text-xl font-bold text-[#4A90E2] mb-1">{vaccine.title || vaccine.doseTitle}</h4>
        <p className="text-sm text-gray-500 mb-4">{vaccine.advice}</p>

        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-600 bg-white/50 p-2 rounded-lg">
                <CalendarClock size={18} className="text-[#4A90E2]" />
                <span className="font-medium">{vaccine.expectedDate}</span>
                <span className="text-xs text-gray-400">({vaccine.dayName})</span>
            </div>
            {/* If office info is available, show it. The API example didn't strictly show office in nextVaccine object but useful if added later */}
        </div>
      </div>
    </div>
  );
}
