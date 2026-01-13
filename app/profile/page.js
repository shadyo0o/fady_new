'use client';

import { useState } from "react";
import { ArrowRight, User, Bell, Shield, LogOut, ChevronLeft, Stethoscope, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MobileLayout from "@/components/layout/MobileLayout";
import { BottomNav } from "@/components/layout/BottomNav";
import { Switch } from "@/components/ui/Switch";
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    push: true,
    sms: false,
    email: true,
  });

  const menuItems = [
    {
      icon: User,
      title: "تعديل الملف الشخصي",
      subtitle: "المعلومات الشخصية",
      path: "/edit-profile",
    },
    {
      icon: Shield,
      title: "الخصوصية والأمان",
      subtitle: "أمان الحساب",
      path: "/privacy",
    },
  ];

  return (
    <MobileLayout dir="rtl">
      <div className="min-h-screen pb-24 bg-white">
        {/* Header - Classic Medical */}
        <div className="bg-[#4A90E2] pt-12 pb-16 px-5 relative overflow-hidden">
            {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-xl" />

          <div className="flex items-center justify-between mb-8 relative z-10">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">
              الملف الشخصي
            </h1>
            <div className="w-9" />
          </div>

          {/* Profile Info */}
          <div className="flex flex-col items-center relative z-10 text-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-xl border-4 border-white/20">
              <User className="w-10 h-10 text-[#4A90E2]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              {user?.name || "سارة أحمد"}
            </h2>
            <div className="flex items-center gap-1 text-blue-100 text-sm opacity-90">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email || "sarah.ahmed@email.com"}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 -mt-8 relative z-10">
          {/* Subscription Card */}
          <Link href="/subscription" className="block mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-lg shadow-blue-50 border border-blue-50 flex items-center justify-between group active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    عضو مميز
                  </h3>
                  <p className="text-xs text-orange-600 font-medium">
                    صالح حتى ديسمبر 2025
                  </p>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </Link>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                <Bell className="w-4 h-4 text-[#4A90E2]" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">إعدادات التنبيهات</h3>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    تنبيهات التطبيق
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    تذكيرات التطعيمات المجدولة
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, push: checked }))
                  }
                />
              </div>

              <div className="h-px bg-gray-50" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800 text-sm">رسائل القصيرة (SMS)</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    تحديثات فورية عبر الهاتف
                  </p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, sms: checked }))
                  }
                />
              </div>

              <div className="h-px bg-gray-50" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    رسائل البريد الإلكتروني
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    تقارير دورية ونصائح صحية
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, email: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.path}
                   className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-50 group"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <button
            onClick={() => logout()}
             className="w-full flex items-center justify-center gap-2 h-14 bg-red-50 text-red-600 font-bold text-sm rounded-2xl border border-red-100 hover:bg-red-100 active:scale-[0.98] transition-all mb-4"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </div>

      <BottomNav />
    </MobileLayout>
  );
};

export default ProfilePage;
