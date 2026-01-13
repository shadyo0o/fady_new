'use client'
import { useState, useEffect } from "react";
import { Plus, Bell, Activity } from "lucide-react";
import Link from "next/link";
import MobileLayout from "@/components/layout/MobileLayout";
import { BottomNav } from "@/components/layout/BottomNav";
import { AnnouncementCard } from "@/components/cards/AnnouncementCard";
import { NextVaccineCard } from "@/components/cards/NextVaccineCard";
import { ChildCard } from "@/components/cards/ChildCard";
import Button from "@/components/ui/Button";
import api from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";

// Data fetching will replace mock data

export default function HomePage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard/');
      setData(response.data);
    } catch (error) {
      console.error("Home fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.name || "سارة";

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  const children = data?.children || [];
  const nextVaccine = data?.nextVaccine;
  const stats = data?.stats || {};
  const announcements = data?.announcements || [];

  return (
    <MobileLayout dir="rtl">
      <div className="min-h-screen pb-24 bg-white">
        {/* Header - Classic Medical Style */}
        <div className="bg-[#4A90E2] px-5 pt-12 pb-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-blue-100 text-xs font-medium uppercase tracking-wide">مرحباً بعودتك،</p>
              <h1 className="text-xl font-semibold text-white mt-0.5">
                {userName}
              </h1>
            </div>
            <button className="relative w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
              <Bell className="w-5 h-5 text-white" />
              {announcements.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#4A90E2]">
                  {announcements.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 border border-white/20 backdrop-blur-sm">
            <Activity className="w-5 h-5 text-white/80" />
            <div>
              <p className="text-white text-sm font-medium">
                {children.length} أطفال مسجلين
              </p>
              {nextVaccine && (
                <p className="text-blue-100 text-xs">
                  التطعيم القادم: {nextVaccine.vaccineName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-4">
          {/* Next Vaccine Card */}
          {nextVaccine && (
            <div className="mb-4 -mt-8 relative z-10">
              <NextVaccineCard
                vaccineName={nextVaccine.vaccineName}
                childName={nextVaccine.childName}
                dueDate={new Date(nextVaccine.dueDate)}
                daysRemaining={nextVaccine.daysRemaining}
              />
            </div>
          )}

          {/* Announcement Alert (Showing first one) */}
          {showAnnouncement && announcements.length > 0 && (
            <div className="mb-4 animate-fade-in">
              <AnnouncementCard
                title={announcements[0].title}
                message={announcements[0].content}
                type={announcements[0].type || "warning"}
                onDismiss={() => setShowAnnouncement(false)}
              />
            </div>
          )}

          {/* Children Section */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-800">
                أطفالك
              </h2>
              <Link
                href="/childs/add"
                className="flex items-center gap-1 text-sm font-medium text-[#4A90E2] hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                style={{textDecoration: 'none'}}
              >
                <Plus className="w-4 h-4" />
                إضافة
              </Link>
            </div>

            {children.length > 0 ? (
              <div className="space-y-3">
                {children.map((child) => (
                  <ChildCard 
                    key={child.id} 
                    {...child} 
                    birthDate={new Date(child.birthDate)} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 text-center border-2 border-dashed border-gray-200">
                <div className="w-14 h-14 bg-gray-50 rounded-full mx-auto flex items-center justify-center mb-3">
                  <span className="text-2xl">👶</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                  لم تتم إضافة أطفال بعد
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  أضف طفلك لبدء التتبع
                </p>
                <Link href="/add-child">
                  <Button className="bg-[#4A90E2] hover:bg-blue-600 rounded-lg text-sm w-full">
                    <Plus className="w-4 h-4 ml-1.5" />
                    إضافة طفل
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Link
              href="/timeline"
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-xl">📅</span>
              </div>
              <h3 className="font-bold text-gray-800 text-sm">
                الجدول الزمني
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                جدول التطعيمات
              </p>
            </Link>

            <Link
              href="/subscription"
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-xl">⭐</span>
              </div>
              <h3 className="font-bold text-gray-800 text-sm">
                الباقة المميزة
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                60 جنيه / 18 شهر
              </p>
            </Link>
          </div>
        </div>
      </div>

      <BottomNav />
    </MobileLayout>
  );
}
