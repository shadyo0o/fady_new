// 'use client'
// import { useState, useEffect } from "react";
// import { Plus, Bell, Activity, UserCog } from "lucide-react";
// import Link from "next/link";
// import MobileLayout from "@/components/layout/MobileLayout";
// import { BottomNav } from "@/components/layout/BottomNav";
// import { AnnouncementCard } from "@/components/cards/AnnouncementCard";
// import { NextVaccineCard } from "@/components/cards/NextVaccineCard";
// import { ChildCard } from "@/components/cards/ChildCard";
// import Button from "@/components/ui/Button";
// import api from "@/lib/api/client";
// import { useAuth } from "@/contexts/AuthContext";
// import OfficeSelector from "@/components/OfficeSelector";

// // --- استيراد المكون الجديد ---
// import NotificationButton from "@/components/NotificationButton";

// export default function HomePage() {
//   const { user } = useAuth();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showAnnouncement, setShowAnnouncement] = useState(true);
//   const [nextVaccineData, setNextVaccineData] = useState(null);
//   const [selectedOffice, setSelectedOffice] = useState(null);
//   const [loadingVaccine, setLoadingVaccine] = useState(false);

//   useEffect(() => {
//     // Load selected office from localStorage on mount
//     const savedOffice = localStorage.getItem('selectedOffice');
//     if (savedOffice) {
//       setSelectedOffice(savedOffice);
//     }
    
//     fetchDashboard();

//     // Refresh data when page becomes visible
//     const handleVisibilityChange = () => {
//       if (!document.hidden) {
//         fetchDashboard();
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
    
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, []);

//   // Helper function to parse Arabic date string
//   const parseArabicDate = (dateString) => {
//     if (!dateString) return null;
    
//     // If it's already a Date object
//     if (dateString instanceof Date && !isNaN(dateString.getTime())) {
//       return dateString;
//     }
    
//     // Try parsing as standard date first (ISO format, etc.)
//     const standardDate = new Date(dateString);
//     if (!isNaN(standardDate.getTime())) {
//       return standardDate;
//     }

//     // Arabic month names mapping (both full and abbreviated)
//     const arabicMonths = {
//       'يناير': 0, 'فبراير': 1, 'مارس': 2, 'أبريل': 3, 'مايو': 4, 'يونيو': 5,
//       'يوليو': 6, 'أغسطس': 7, 'سبتمبر': 8, 'أكتوبر': 9, 'نوفمبر': 10, 'ديسمبر': 11,
//       'كانون الثاني': 0, 'شباط': 1, 'آذار': 2, 'نيسان': 3, 'أيار': 4, 'حزيران': 5,
//       'تموز': 6, 'آب': 7, 'أيلول': 8, 'تشرين الأول': 9, 'تشرين الثاني': 10, 'كانون الأول': 11
//     };

//     // Try to parse Arabic date format (e.g., "15 يناير 2024" or "15/01/2024")
//     // First try common Arabic formats
//     for (const [monthName, monthIndex] of Object.entries(arabicMonths)) {
//       if (dateString.includes(monthName)) {
//         // Match patterns like "15 يناير 2024" or "15 من يناير 2024"
//         const parts = dateString.match(/(\d+)\s*(?:من\s*)?(\S+)\s+(\d+)/);
//         if (parts) {
//           const day = parseInt(parts[1]);
//           const year = parseInt(parts[3]);
//           const date = new Date(year, monthIndex, day);
//           if (!isNaN(date.getTime())) {
//             return date;
//           }
//         }
//       }
//     }

//     // Try DD/MM/YYYY or DD-MM-YYYY format
//     const slashMatch = dateString.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
//     if (slashMatch) {
//       const day = parseInt(slashMatch[1]);
//       const month = parseInt(slashMatch[2]) - 1; // Month is 0-indexed
//       const year = parseInt(slashMatch[3]);
//       const date = new Date(year, month, day);
//       if (!isNaN(date.getTime())) {
//         return date;
//       }
//     }

//     return null;
//   };

//   // Helper function to calculate days remaining
//   const calculateDaysRemaining = (dateString, isOverdue = false) => {
//     const vaccineDate = parseArabicDate(dateString);
//     if (!vaccineDate) return 0;

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     vaccineDate.setHours(0, 0, 0, 0);

//     const diffTime = vaccineDate - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     // If it's explicitly an overdue vaccine, the days should be negative or 0
//     return diffDays;
//   };

//   const fetchDashboard = async () => {
//     try {
//       setLoading(true); // Ensure loading state is true at start
//       const response = await api.get('/dashboard');
//       const dashboardData = response.data;
      
//       // Fetch vaccine data for each child to calculate progress AND determing next vaccine
//       const children = dashboardData?.children || [];
//       const allNextVaccines = [];

//       if (children.length > 0) {
//         // Get selected office from state or localStorage, or use first child's office
//         const savedOffice = localStorage.getItem('selectedOffice');
//         let officeToUse = selectedOffice || savedOffice || children[0]?.healthOffice || null;

//         // If explicitly selecting an office via UI, we might want to prioritize that
//         // But for initial load, the above logic holds.

//         const childrenWithProgress = await Promise.all(
//           children.map(async (child) => {
//             try {
//               const childId = child.id || child._id;
              
//               // We use getDueVaccines because it accurately calculates Overdue, Taken, Upcoming
//               // passing the office parameter if available to get office-specific rules
//               const vaccineUrl = officceToUse 
//                 ? `/childs/getDueVaccines/${childId}?office=${encodeURIComponent(officeToUse)}`
//                 : `/childs/getDueVaccines/${childId}`;

//               const vaccineResponse = await api.get(vaccineUrl);
//               const vaccineData = vaccineResponse.data;
              
//               // Extract data using the correct structure with results wrapper
//               const res = vaccineData?.results || {};
//               const takenCount = res.taken?.length || 0;
//               const overdueCount = res.overdue?.length || 0;
//               const upcomingCount = res.upcoming?.length || 0;
//               const nextCount = res.nextVaccine ? 1 : 0;
              
//               const totalVaccines = takenCount + overdueCount + upcomingCount + nextCount;
//               const completedVaccines = takenCount;

//               // Determine the "Priority Vaccine" for this child
//               // New Logic:
//               // 1. Primary Display: Next Future Vaccine (nextVaccine or first upcoming)
//               // 2. Overdue Warning: If overdue exists, flag it.
              
//               let priorityVaccine = null;
//               let hasOverdue = res.overdue && res.overdue.length > 0;
//               let concurrentVaccines = [];

//               // Determine the "Priority Vaccine" for this child
//               // Logic:
//               // 1. Check for nextVaccines array (preferred for grouping)
//               // 2. Fallback to nextVaccine + concurrent upcoming

//               if (vaccineData.nextVaccines && vaccineData.nextVaccines.length > 0) {
//                  concurrentVaccines = vaccineData.nextVaccines;
//               } else {
//                  // Fallback implementation using nextVaccine and upcoming
//                  const primaryFuture = res.nextVaccine || (res.upcoming && res.upcoming[0]);
//                  if (primaryFuture) {
//                     const targetDate = primaryFuture.expectedDate || primaryFuture.date;
                    
//                     if (res.nextVaccine) {
//                        const d = res.nextVaccine.expectedDate || res.nextVaccine.date;
//                        if (d === targetDate) concurrentVaccines.push(res.nextVaccine);
//                     }
                    
//                     if (res.upcoming && res.upcoming.length > 0) {
//                        res.upcoming.forEach(v => {
//                            const d = v.expectedDate || v.date;
//                            if (d === targetDate) {
//                                if (!concurrentVaccines.find(c => c._id === v._id || c.title === v.title)) {
//                                    concurrentVaccines.push(v);
//                                }
//                            }
//                        });
//                     }
//                  }
//               }

//               if (concurrentVaccines.length > 0) {
//                  const primary = concurrentVaccines[0];
//                  const combinedTitles = concurrentVaccines.map(v => v.title).join(" + ");
                 
//                  // Collect warnings only from unavailable vaccines
//                  const warnings = concurrentVaccines
//                     .filter(v => v.isAvailable === false)
//                     .map(v => v.warning)
//                     .filter(Boolean);
                 
//                  const uniqueWarnings = [...new Set(warnings)];
//                  const combinedWarning = uniqueWarnings.join(" | ");
                 
//                  priorityVaccine = {
//                      ...primary,
//                      title: combinedTitles,
//                      warning: combinedWarning,
//                      // Use specific date fields if they exist, or fallback to primary's date
//                      expectedDate: primary.expectedDate || primary.date
//                  };
//               } else if (hasOverdue) {
//                  priorityVaccine = res.overdue[0];
//               }

//               if (priorityVaccine) {
//                 const specificOverdueWarning = hasOverdue 
//                   ? "⚠️ يوجد تطعيمات فائتة لم يتم تسجيلها بعد، يرجى الذهاب الى ايكونه تسجيل تطعيم و الذهاب الى الاسفل و الضغط على تسجيل امام التطعيم المتاخر ."
//                   : null;

//                 allNextVaccines.push({
//                    vaccineName: priorityVaccine.title,
//                    childName: child.name || child.nameAr || "غير محدد",
//                    dueDate: priorityVaccine.expectedDate || priorityVaccine.date,
//                    day: priorityVaccine.dayName || priorityVaccine.day, 
//                    daysRemaining: calculateDaysRemaining(priorityVaccine.expectedDate || priorityVaccine.date),
//                    childId: childId,
//                    office: vaccineData.currentOffice || officeToUse,
//                    warning: priorityVaccine.advice || priorityVaccine.warning, // Existing medical advice/warnings
//                    overdueWarning: specificOverdueWarning // New specific overdue warning
//                 });
//               }

//               return {
//                 ...child,
//                 totalVaccines,
//                 completedVaccines
//               };
//             } catch (error) {
//               console.error(`Failed to fetch vaccines for child ${child.id || child._id}`, error);
//               return {
//                 ...child,
//                 totalVaccines: 0,
//                 completedVaccines: 0
//               };
//             }
//           })
//         );
        
//         dashboardData.children = childrenWithProgress;

//         // Set selected office if not already set
//         if (!selectedOffice && officeToUse) {
//           setSelectedOffice(officeToUse);
//           if (!savedOffice && officeToUse) {
//             localStorage.setItem('selectedOffice', officeToUse);
//           }
//         }
//       }

//       // Determine the global next vaccine from all children
//       if (allNextVaccines.length > 0) {
//           // Sort by days remaining (lowest/most negative first)
//           allNextVaccines.sort((a, b) => a.daysRemaining - b.daysRemaining);
//           setNextVaccineData(allNextVaccines[0]);
//       } else {
//           setNextVaccineData(null);
//       }
      
//       setData(dashboardData);
//     } catch (error) {
//       console.error("Home fetch error:", error);
//     } finally {
//       setLoading(false);
//       setLoadingVaccine(false);
//     }
//   };

//   const userName = user?.name || "سارة";
//   const firstChildName = data?.children?.[0]?.name || "طفلك";

//   // Handle office selection change
//   const handleOfficeSelect = async (office) => {
//     setSelectedOffice(office);
//     localStorage.setItem('selectedOffice', office);
    
//     // Refetch dashboard to update calculations based on new office rules
//     // We reuse fetchDashboard but we need to ensure it uses the new office.
//     // Since fetchDashboard reads state/localStorage, and state updates are async,
//     // it's safer to reload or reload data specifically.
//     // However, fetchDashboard relies on closure or state. 
//     // Best approach here: set loadingVaccine, then call fetchDashboard logic manually or rely on effect?
//     // Actually, simply calling fetchDashboard() again might pick up the old state if called immediately.
//     // But we just updated localStorage.
    
//     setLoadingVaccine(true);
//     // Slight delay to ensure state/storage propagation if needed, or just pass office explicitly to a new function?
//     // To avoid rewriting `fetchDashboard` signatures too much, we'll assume it picks up `selectedOffice` from state if we wait/pass it.
//     // But `selectedOffice` state update is async. 
//     // Let's modify fetchDashboard to accept an optional office override? 
//     // For now, simpler: Trigger a full refresh logic or reload page? No, that's bad UX.
    
//     // Let's rely on the fact that we updated localStorage which `fetchDashboard` reads?
//     // No, `fetchDashboard` reads `selectedOffice` state primarily in the loop logic I wrote above:
//     // `let officeToUse = selectedOffice || savedOffice ...`
//     // Since we updated state `setSelectedOffice(office)`, the next render `fetchDashboard` would see it.
//     // But we want to trigger it NOW.
    
//     // WORKAROUND: Force a specialized fetch for just the next vaccine? 
//     // OR: just call fetchDashboard. The only catch is `selectedOffice` state variable inside `fetchDashboard` scope 
//     // refers to the render-time value.
//     // We can pass `office` as an argument to `fetchDashboard`?
    
//     // Let's make it simpler: reload the dashboard data.
//     window.location.reload(); // Simplest way to ensure all calculations use the new office consistently across all components.
//     // OR:
//     // fetchDataWithOffice(office); 
//   };

//   if (loading) {
//     return (
//       <MobileLayout dir="rtl">
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#33AB98]/10 to-white">
//           <div className="flex flex-col items-center gap-4">
//             <div className="relative">
//               <div className="w-16 h-16 border-4 border-[#33AB98]/20 border-t-[#33AB98] rounded-full animate-spin"></div>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-8 h-8 bg-[#33AB98] rounded-full animate-pulse"></div>
//               </div>
//             </div>
//             <div className="text-center">
//               <p className="text-[#33AB98] font-semibold text-lg mb-1">جاري التحميل...</p>
//               <p className="text-gray-500 text-sm">نحضر معلومات التطعيمات</p>
//             </div>
//           </div>
//         </div>
//       </MobileLayout>
//     );
//   }

//   const children = data?.children || [];
//   const nextVaccine = nextVaccineData || data?.nextVaccine;
//   const stats = data?.stats || {};
//   const announcements = data?.announcements || [];

//   return (
//     <MobileLayout dir="rtl">
//       <div className="min-h-screen pb-24 bg-white">
//         {/* Header - Classic Medical Style */}
//         <div className="bg-[#33AB98] px-5 pt-12 pb-6">
//           <div className="flex items-center justify-between mb-5">
//             <div>
//               <p className="text-blue-100 text-sm font-medium leading-relaxed">
//                 أهلاً بك في عائلة فادى..  الآن يمكنك الاطمئنان، جدول تطعيمات <span className="font-bold text-white">{firstChildName}</span> في أيدٍ أمينة.
//               </p>
//             </div>
//             <button className="relative w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
//               <Bell className="w-5 h-5 text-white" />
//               {announcements.length > 0 && (
//                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#33AB98]">
//                   {announcements.length}
//                 </span>
//               )}
//             </button>
//           </div>

//           {/* ============================================================ */}
//           {/* بداية الجزء المضاف للتجربة (يمكنك حذفه لاحقاً) */}
//           <div className="mb-5">
//              <NotificationButton />
//           </div>
//           {/* نهاية الجزء المضاف للتجربة */}
//           {/* ============================================================ */}

//           {/* Quick Stats */}
//           <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 border border-white/20 backdrop-blur-sm">
//             <Activity className="w-5 h-5 text-white/80" />
//             <div>
//               <p className="text-white text-sm font-medium">
//                 {children.length} أطفال مسجلين
//               </p>
//               {nextVaccine && (
//                 <p className="text-blue-100 text-xs">
//                   التطيم القادم: {nextVaccine.vaccineName}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="px-4 pt-4">
//           {/* Next Vaccine Card */}
//           {loadingVaccine ? (
//             <div className="mb-4 -mt-8 relative z-10">
//               <div className="bg-[#33AB98] rounded-2xl p-5 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
//                 <div className="flex items-center justify-center py-8">
//                   <div className="flex flex-col items-center gap-3">
//                     <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
//                     <p className="text-sm text-blue-100">جاري تحديث الموعد...</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : nextVaccine ? (
//             <div className="mb-4 -mt-8 relative z-10">
//               <NextVaccineCard
//                 vaccineName={nextVaccine.vaccineName}
//                 childName={nextVaccine.childName}
//                 dueDate={nextVaccine.dueDate}
//                 day={nextVaccine.day}
//                 daysRemaining={nextVaccine.daysRemaining}
//                 childId={nextVaccine.childId}
//                 office={nextVaccine.office}
//                 warning={nextVaccine.warning}
//                 overdueWarning={nextVaccine.overdueWarning}
//               />
//             </div>
//           ) : null}

//           {/* Announcement Alert */}
//           {showAnnouncement && announcements.length > 0 && (
//             <div className="mb-4 animate-fade-in">
//               <AnnouncementCard
//                 title={announcements[0].title}
//                 message={announcements[0].content}
//                 type={announcements[0].type || "warning"}
//                 onDismiss={() => setShowAnnouncement(false)}
//               />
//             </div>
//           )}

//           {/* Children Section */}
//           <div className="mb-5">
//             <div className="flex items-center justify-between mb-3">
//               <h2 className="text-base font-bold text-gray-800">أطفالك</h2>
//               {children.length > 0 ? (
//                 <Link
//                   href={`/childs/edit/${children[0].id || children[0]._id}`}
//                   className="flex items-center gap-1 text-sm font-medium text-[#33AB98] hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
//                   style={{textDecoration: 'none'}}
//                 >
//                   <UserCog className="w-4 h-4" />
//                   تعديل
//                 </Link>
//               ) : (
//                 <Link
//                   href="/childs/add"
//                   className="flex items-center gap-1 text-sm font-medium text-[#33AB98] hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
//                   style={{textDecoration: 'none'}}
//                 >
//                   <Plus className="w-4 h-4" />
//                   إضافة
//                 </Link>
//               )}
//             </div>

//             {children.length > 0 ? (
//               <div className="space-y-3">
//                 {children.map((child) => (
//                   <ChildCard 
//                     key={child.id} 
//                     {...child}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="bg-white rounded-lg p-6 text-center border-2 border-dashed border-gray-200">
//                 <div className="w-14 h-14 bg-gray-50 rounded-full mx-auto flex items-center justify-center mb-3">
//                   <span className="text-2xl">👶</span>
//                 </div>
//                 <h3 className="font-semibold text-gray-800 mb-1 text-sm">لم تتم إضافة أطفال بعد</h3>
//                 <p className="text-xs text-gray-500 mb-4">أضف طفلك لبدء التتبع</p>
//                 <Link href="/childs/add">
//                   <Button className="bg-[#33AB98] hover:bg-blue-600 rounded-lg text-sm w-full">
//                     <Plus className="w-4 h-4 ml-1.5" />
//                     إضافة طفل
//                   </Button>
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Quick Actions */}
//           <div className="grid grid-cols-2 gap-3 mb-6">
//             <Link
//               href="/schedule"
//               className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
//             >
//               <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
//                 <span className="text-xl">📅</span>
//               </div>
//               <h3 className="font-bold text-gray-800 text-sm">الجدول الزمني</h3>
//               <p className="text-xs text-gray-500 mt-1">جدول التطعيمات</p>
//             </Link>

//             <Link
//               href={children.length > 0 ? `/childs/${children[0].id || children[0]._id}` : "/childs/add"}
//               className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
//             >
//               <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
//                 <span className="text-xl">💉</span>
//               </div>
//               <h3 className="font-bold text-gray-800 text-sm">تسجيل تطعيم</h3>
//               <p className="text-xs text-gray-500 mt-1">سجل تطعيم جديد لطفلك</p>
//             </Link>

//             <Link
//               href={children.length > 0 ? `/childs/${children[0].id || children[0]._id}/history` : "/childs/add"}
//               className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
//             >
//               <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
//                 <span className="text-xl">📘</span>
//               </div>
//               <h3 className="font-bold text-gray-800 text-sm">سجل التطعيمات التاريخي</h3>
//               <p className="text-xs text-gray-500 mt-1">عرض كل التطعيمات السابقة</p>
//             </Link>

//             <Link
//               href="/birth-certificate-steps"
//               className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
//             >
//               <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
//                 <span className="text-xl">📜</span>
//               </div>
//               <h3 className="font-bold text-gray-800 text-sm">خطوات شهادة الميلاد</h3>
//               <p className="text-xs text-gray-500 mt-1">الأوراق والمواعيد المطلوبة</p>
//             </Link>

//             <OfficeSelector 
//               selectedOffice={selectedOffice}
//               onSelectOffice={handleOfficeSelect}
//             />
//           </div>
//         </div>
//       </div>

//       <BottomNav />
//     </MobileLayout>
//   );
// }


'use client'
import { useState, useEffect, useCallback } from "react";
import { Plus, Bell, Activity, UserCog } from "lucide-react";
import Link from "next/link";
import MobileLayout from "@/components/layout/MobileLayout";
import { BottomNav } from "@/components/layout/BottomNav";
import { AnnouncementCard } from "@/components/cards/AnnouncementCard";
import { NextVaccineCard } from "@/components/cards/NextVaccineCard";
import { ChildCard } from "@/components/cards/ChildCard";
import Button from "@/components/ui/Button";
import api from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";
import OfficeSelector from "@/components/OfficeSelector";
import NotificationButton from "@/components/NotificationButton";

export default function HomePage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [nextVaccineData, setNextVaccineData] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [loadingVaccine, setLoadingVaccine] = useState(false);

  // Helper function to parse Arabic date string
  const parseArabicDate = (dateString) => {
    if (!dateString) return null;
    if (dateString instanceof Date && !isNaN(dateString.getTime())) return dateString;
    
    const standardDate = new Date(dateString);
    if (!isNaN(standardDate.getTime())) return standardDate;

    const arabicMonths = {
      'يناير': 0, 'فبراير': 1, 'مارس': 2, 'أبريل': 3, 'مايو': 4, 'يونيو': 5,
      'يوليو': 6, 'أغسطس': 7, 'سبتمبر': 8, 'أكتوبر': 9, 'نوفمبر': 10, 'ديسمبر': 11,
      'كانون الثاني': 0, 'شباط': 1, 'آذار': 2, 'نيسان': 3, 'أيار': 4, 'حزيران': 5,
      'تموز': 6, 'آب': 7, 'أيلول': 8, 'تشرين الأول': 9, 'تشرين الثاني': 10, 'كانون الأول': 11
    };

    for (const [monthName, monthIndex] of Object.entries(arabicMonths)) {
      if (dateString.includes(monthName)) {
        const parts = dateString.match(/(\d+)\s*(?:من\s*)?(\S+)\s+(\d+)/);
        if (parts) {
          const day = parseInt(parts[1]);
          const year = parseInt(parts[3]);
          const date = new Date(year, monthIndex, day);
          if (!isNaN(date.getTime())) return date;
        }
      }
    }

    const slashMatch = dateString.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (slashMatch) {
      const day = parseInt(slashMatch[1]);
      const month = parseInt(slashMatch[2]) - 1;
      const year = parseInt(slashMatch[3]);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) return date;
    }
    return null;
  };

  const calculateDaysRemaining = (dateString) => {
    const vaccineDate = parseArabicDate(dateString);
    if (!vaccineDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    vaccineDate.setHours(0, 0, 0, 0);
    const diffTime = vaccineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // محسنة: تقبل مكتب الصحة كمعامل لتجنب مشاكل حالة الـ State المتأخرة
  const fetchDashboard = useCallback(async (officeOverride = null) => {
    try {
      if (!officeOverride) setLoading(true);
      const response = await api.get('/dashboard');
      const dashboardData = response.data;
      
      const children = dashboardData?.children || [];
      const allNextVaccines = [];

      if (children.length > 0) {
        const savedOffice = localStorage.getItem('selectedOffice');
        // الأولوية للمكتب الممرر ثم المختار حالياً ثم المخزن ثم مكتب الطفل الأول
        let officeToUse = officeOverride || selectedOffice || savedOffice || children[0]?.healthOffice || null;

        const childrenWithProgress = await Promise.all(
          children.map(async (child) => {
            try {
              const childId = child.id || child._id;
              // We need data from both endpoints:
              // 1. getNextVaccine for accurate next vaccine info and grouping
              // 2. getDueVaccines for accurate total/completed progress stats and overdue warnings
              const nextVaccineUrl = officeToUse 
                ? `/childs/getNextVaccine/${childId}?office=${encodeURIComponent(officeToUse)}`
                : `/childs/getNextVaccine/${childId}`;
              
              const dueVaccinesUrl = officeToUse 
                ? `/childs/getDueVaccines/${childId}?office=${encodeURIComponent(officeToUse)}`
                : `/childs/getDueVaccines/${childId}`;

              const [nextRes, dueRes] = await Promise.all([
                api.get(nextVaccineUrl).catch(() => ({ data: {} })),
                api.get(dueVaccinesUrl).catch(() => ({ data: {} }))
              ]);

              const vaccineData = nextRes.data;
              const dueData = dueRes.data?.results || {};
              
              // getNextVaccine structure: { nextTask, nextVaccines, ... }
              const nextTask = vaccineData?.nextTask || vaccineData?.nextVaccine;
              const nextVaccines = vaccineData?.nextVaccines || (nextTask ? [nextTask] : []);
              
              // Progress stats from dueVaccines
              const takenCount = dueData.taken?.length || 0;
              const overdueCount = dueData.overdue?.length || 0;
              const upcomingCount = dueData.upcoming?.length || 0;
              const hasOverdue = overdueCount > 0;
              
              const totalVaccines = takenCount + overdueCount + upcomingCount + (dueData.nextVaccine ? 1 : 0);
              const completedVaccines = takenCount;

              let priorityVaccine = null;
              let concurrentVaccines = [];

              if (nextTask) {
                const targetDate = nextTask.date;
                concurrentVaccines = nextVaccines.filter(v => v.date === targetDate);
                
                const combinedTitle = concurrentVaccines.map(v => v.title).join(" + ");
                const combinedWarning = [...new Set(concurrentVaccines
                  .filter(v => v.isAvailable === false)
                  .map(v => `${v.title} ${v.warning || ''}`))
                ].filter(Boolean).join(" | ");
                
                priorityVaccine = {
                  ...nextTask,
                  title: combinedTitle,
                  warning: combinedWarning,
                  date: nextTask.date
                };
              }

              if (priorityVaccine) {
                const overdueMessage = hasOverdue 
                  ? "⚠️ يوجد تطعيمات فائتة لم يتم تسجيلها بعد، يرجى مراجعة سجل التطعيمات." 
                  : null;

                allNextVaccines.push({
                  vaccineName: priorityVaccine.title,
                  childName: child.name || child.nameAr || "غير محدد",
                  dueDate: priorityVaccine.date,
                  day: priorityVaccine.dayName || priorityVaccine.day, 
                  daysRemaining: calculateDaysRemaining(priorityVaccine.date),
                  childId: childId,
                  office: vaccineData.currentOffice || officeToUse,
                  warning: priorityVaccine.warning || priorityVaccine.advice,
                  overdueWarning: overdueMessage
                });
              }

              return { ...child, totalVaccines, completedVaccines };
            } catch (err) {
              return { ...child, totalVaccines: 0, completedVaccines: 0 };
            }
          })
        );
        
        dashboardData.children = childrenWithProgress;
        if (!selectedOffice && officeToUse) {
          setSelectedOffice(officeToUse);
        }
      }

      if (allNextVaccines.length > 0) {
        allNextVaccines.sort((a, b) => a.daysRemaining - b.daysRemaining);
        setNextVaccineData(allNextVaccines[0]);
      } else {
        setNextVaccineData(null);
      }
      
      setData(dashboardData);
    } catch (error) {
      console.error("Home fetch error:", error);
    } finally {
      setLoading(false);
      setLoadingVaccine(false);
    }
  }, [selectedOffice]);

  useEffect(() => {
    const savedOffice = localStorage.getItem('selectedOffice');
    if (savedOffice) setSelectedOffice(savedOffice);
    
    fetchDashboard();

    const handleVisibilityChange = () => {
      if (!document.hidden) fetchDashboard();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchDashboard]);

  const handleOfficeSelect = async (office) => {
    setLoadingVaccine(true);
    setSelectedOffice(office);
    localStorage.setItem('selectedOffice', office);
    
    // تحديث بيانات الأطفال في قاعدة البيانات لمزامنة المكتب المختار
    try {
      if (data?.children && data.children.length > 0) {
        await Promise.all(
          data.children.map(child => {
            const childId = child.id || child._id;
            // إرسال البيانات المطلوبة للتحديث مع مكتب الصحة الجديد
            return api.patch(`/childs/editChild/${childId}`, {
              name: child.name,
              birthDate: child.birthDate,
              gender: child.gender,
              healthOffice: office
            });
          })
        );
      }
    } catch (error) {
      console.error("Failed to sync office to DB:", error);
    }

    // تحديث البيانات مباشرة بدون إعادة تحميل الصفحة
    await fetchDashboard(office);
  };

  if (loading) {
    return (
      <MobileLayout dir="rtl">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#33AB98]/10 to-white">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#33AB98]/20 border-t-[#33AB98] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[#33AB98] rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-[#33AB98] font-semibold">جاري التحميل...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const children = data?.children || [];
  const nextVaccine = nextVaccineData || data?.nextVaccine;
  const announcements = data?.announcements || [];
  const firstChildName = children[0]?.name || "طفلك";

  return (
    <MobileLayout dir="rtl">
      <div className="min-h-screen pb-24 bg-white">
        {/* Header */}
        <div className="bg-[#33AB98] px-5 pt-12 pb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="max-w-[80%]">
              <p className="text-blue-100 text-sm font-medium leading-relaxed">
                أهلاً بك في عائلة فادى.. جدول تطعيمات <span className="font-bold text-white">{firstChildName}</span> في أيدٍ أمينة.
              </p>
            </div>
            <button className="relative w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
              <Bell className="w-5 h-5 text-white" />
              {announcements.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#33AB98]">
                  {announcements.length}
                </span>
              )}
            </button>
          </div>

          <div className="mb-5">
             <NotificationButton />
          </div>

          <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 border border-white/20 backdrop-blur-sm">
            <Activity className="w-5 h-5 text-white/80" />
            <div>
              <p className="text-white text-sm font-medium">{children.length} أطفال مسجلين</p>
              {nextVaccine && (
                <p className="text-blue-100 text-xs">التطعيم القادم: {nextVaccine.vaccineName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 pt-4">
          {loadingVaccine ? (
            <div className="mb-4 -mt-8 relative z-10">
              <div className="bg-[#33AB98] rounded-2xl p-8 text-white shadow-lg flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <p className="text-sm">جاري تحديث البيانات بناءً على مكتب الصحة...</p>
              </div>
            </div>
          ) : nextVaccine ? (
            <div className="mb-4 -mt-8 relative z-10">
              <NextVaccineCard {...nextVaccine} />
            </div>
          ) : null}

          {showAnnouncement && announcements.length > 0 && (
            <div className="mb-4">
              <AnnouncementCard
                title={announcements[0].title}
                message={announcements[0].content}
                type={announcements[0].type || "warning"}
                onDismiss={() => setShowAnnouncement(false)}
              />
            </div>
          )}

          {/* Children List */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-800">أطفالك</h2>
              <Link
                href={children.length > 0 ? `/childs/edit/${children[0].id || children[0]._id}` : "/childs/add"}
                className="flex items-center gap-1 text-sm font-medium text-[#33AB98]"
              >
                {children.length > 0 ? <><UserCog className="w-4 h-4" /> تعديل</> : <><Plus className="w-4 h-4" /> إضافة</>}
              </Link>
            </div>

            {children.length > 0 ? (
              <div className="space-y-3">
                {children.map((child) => (
                  <ChildCard key={child.id || child._id} {...child} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 text-center border-2 border-dashed border-gray-200">
                <p className="text-sm text-gray-500 mb-4">أضف طفلك لبدء التتبع</p>
                <Link href="/childs/add">
                  <Button className="bg-[#33AB98] w-full">إضافة طفل</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <ActionLink href="/schedule" emoji="📅" title="الجدول الزمني" desc="جدول التطعيمات" color="purple" />
            <ActionLink 
                href={children.length > 0 ? `/childs/${children[0].id || children[0]._id}` : "/childs/add"} 
                emoji="💉" title="تسجيل تطعيم" desc="سجل تطعيم جديد" color="green" 
            />
            <ActionLink 
                href={children.length > 0 ? `/childs/${children[0].id || children[0]._id}/history` : "/childs/add"} 
                emoji="📘" title="السجل التاريخي" desc="عرض كل السابق" color="blue" 
            />
            <ActionLink href="/birth-certificate-steps" emoji="📜" title="شهادة الميلاد" desc="الأوراق والمواعيد" color="orange" />
            
            <div className="col-span-2">
                <OfficeSelector 
                  selectedOffice={selectedOffice}
                  onSelectOffice={handleOfficeSelect}
                />
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </MobileLayout>
  );
}

// مكون فرعي بسيط للأزرار لتقليل تكرار الكود
function ActionLink({ href, emoji, title, desc, color }) {
  const colors = {
    purple: "bg-purple-100",
    green: "bg-green-100",
    blue: "bg-blue-100",
    orange: "bg-orange-100"
  };
  return (
    <Link href={href} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className={`w-10 h-10 ${colors[color]} rounded-xl flex items-center justify-center mb-3`}>
        <span className="text-xl">{emoji}</span>
      </div>
      <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </Link>
  );
}
