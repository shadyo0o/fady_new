'use client';

import { Check, AlertTriangle, Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const TimelineItem = ({
  id,
  childId,
  vaccineName,
  doseNumber,
  scheduledDate,
  actualDate,
  status,
  ageInMonths,
}) => {
  const statusConfig = {
    taken: {
      icon: Check,
      bg: "bg-success",
      border: "border-success",
      text: "text-success",
      label: "مكتمل",
    },
    overdue: {
      icon: AlertTriangle,
      bg: "bg-[#E57373]", // Using var(--danger) or soft red
      border: "border-[#E57373]",
      text: "text-[#E57373]",
      label: "متأخر",
    },
    upcoming: {
      icon: Clock,
      bg: "bg-gray-100",
      border: "border-gray-300",
      text: "text-gray-400",
      label: "قادم",
    },
  };

  const config = statusConfig[status] || statusConfig.upcoming;
  const Icon = config.icon;

  const formattedScheduledDate = scheduledDate ? new Date(scheduledDate).toLocaleDateString("ar-EG") : '';
  const formattedActualDate = actualDate ? new Date(actualDate).toLocaleDateString("ar-EG") : '';

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 bg-white shadow-sm transition-all duration-300",
            config.border,
            status === "taken" && "bg-success border-success"
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              status === "taken" ? "text-white" : config.text
            )}
          />
        </div>
        <div className="w-0.5 flex-1 bg-gray-100 -mt-1" />
      </div>

      {/* Content */}
      <Link href={`/vaccine/${id}?childId=${childId}&name=${encodeURIComponent(vaccineName)}`} className="flex-1 pb-8">
        <div
          className={cn(
            "bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group",
            status === "overdue" && "border-red-100 bg-red-50/30"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-gray-800 group-hover:text-[#33AB98] transition-colors">{vaccineName}</h3>
                {doseNumber && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-bold uppercase">
                      الجرعة {doseNumber}
                    </span>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-1 font-medium">
                {ageInMonths === 0 ? 'عند الولادة' : `عند ${ageInMonths} شهر`}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span
                  className={cn(
                    "text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider",
                    status === "taken" && "bg-green-50 text-green-600",
                    status === "overdue" && "bg-red-50 text-red-600",
                    status === "upcoming" && "bg-gray-50 text-gray-400"
                  )}
                >
                  {config.label}
                </span>

                <span className="text-[10px] text-gray-400 font-medium">
                  {status === "taken" && actualDate
                    ? `تم في: ${formattedActualDate}`
                    : `مجدول: ${formattedScheduledDate}`}
                </span>
              </div>
            </div>

            <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-[#33AB98] transform group-hover:-translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </div>
  );
};
