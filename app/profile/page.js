'use client';

import { useState, useEffect } from "react";
import { ArrowRight, User, Bell, Shield, LogOut, ChevronLeft, Stethoscope, Mail, Phone, CreditCard, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MobileLayout from "@/components/layout/MobileLayout";
import { BottomNav } from "@/components/layout/BottomNav";
import { Switch } from "@/components/ui/Switch";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api/client";

const ProfilePage = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [notifications, setNotifications] = useState({
    push: true,
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const r1 = await api.get('/users/profile');
        setProfile(r1.data?.user || r1.data?.data || r1.data || null);
      } catch (e1) {
        try {
          const r2 = await api.get('/profile');
          setProfile(r2.data?.user || r2.data?.data || r2.data || null);
        } catch (e2) {
          setProfile(null);
        }
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

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
      onClick: () => setShowPrivacyModal(true),
    },
  ];

  return (
    <MobileLayout dir="rtl">
      <div className="min-h-screen pb-24 bg-white">
        {/* Header - Classic Medical */}
        <div className="bg-[#33AB98] pt-12 pb-16 px-5 relative overflow-hidden">
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
            <div 
              onClick={() => router.push('/edit-profile')}
              className="relative group cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-xl border-4 border-white/20 group-hover:shadow-[#33AB98]/20 transition-all">
                <User className="w-10 h-10 text-[#33AB98]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center border border-gray-100 group-hover:bg-[#33AB98] group-hover:text-white transition-all">
                <Edit2 className="w-4 h-4 text-[#33AB98] group-hover:text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              {profile?.name || user?.name || "سارة أحمد"}
            </h2>
            <div className="flex items-center gap-1 text-blue-100 text-sm opacity-90">
                <Mail className="w-3.5 h-3.5" />
                <span>{profile?.email || user?.email || "sarah.ahmed@email.com"}</span>
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
                    {profile?.isSubscribed ? "عضو مميز" : "الخطة المجانية"}
                  </h3>
                  <p className="text-xs text-orange-600 font-medium">
                    {profile?.subscriptionEndDate ? new Date(profile.subscriptionEndDate).toLocaleDateString('ar-EG') : "اشترك لتحصل على المزايا"}
                  </p>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </Link>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
                <User className="w-4 h-4 text-[#33AB98]" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">بيانات الحساب</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">الاسم</span>
                <span className="text-sm font-medium text-gray-800">{profile?.name || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">البريد</span>
                <span className="text-sm font-medium text-gray-800">{profile?.email || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">الهاتف</span>
                <span className="text-sm font-medium text-gray-800">{profile?.phone || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">النوع</span>
                <span className="text-sm font-medium text-gray-800">{profile?.gender === 'male' ? 'ذكر' : profile?.gender === 'female' ? 'أنثى' : '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">مزود الدخول</span>
                <span className="text-sm font-medium text-gray-800">{profile?.provider === 'google' ? 'Google' : 'النظام'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">حالة التفعيل</span>
                <span className={`text-sm font-medium ${profile?.isSubscribed || (user?.isSubscribed === true) || (profile?.subscriptionEndDate && new Date(profile.subscriptionEndDate).getTime() > Date.now()) ? 'text-green-600' : 'text-orange-600'}`}>
                  {profile?.isSubscribed || (user?.isSubscribed === true) || (profile?.subscriptionEndDate && new Date(profile.subscriptionEndDate).getTime() > Date.now()) ? 'مفعل (مشترك)' : 'غير مفعل'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">آخر رقم معاملة</span>
                <span className="text-sm font-medium text-gray-800">{profile?.lastTransactionId || '-'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                <Bell className="w-4 h-4 text-[#33AB98]" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">إعدادات التنبيهات</h3>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800 text-sm">تنبيهات التطبيق</p>
                  <p className="text-xs text-gray-500 mt-0.5">تذكيرات التطعيمات المجدولة</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, push: checked }))
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
                <div
                  key={index}
                  onClick={() => {
                    if (item.path) {
                      router.push(item.path);
                    } else if (item.onClick) {
                      item.onClick();
                    }
                  }}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-50 group cursor-pointer"
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
                </div>
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

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[80vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">الخصوصية والأمان</h3>
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#33AB98]">
                  <Shield className="w-5 h-5" />
                  <h4 className="font-bold text-sm">سياسة الخصوصية</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  نلتزم بحماية خصوصية بيانات الأطفال (الاسم وتاريخ الميلاد) واستخدامها فقط لتنظيم جدول التطعيمات.
                  لا نقوم بتخزين بيانات البطاقات البنكية؛ حيث تتم معالجة جميع المدفوعات بشكل مشفر عبر بوابة Paymob.
                </p>
              </div>

              <div className="h-px bg-gray-50" />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#33AB98]">
                  <CreditCard className="w-5 h-5" />
                  <h4 className="font-bold text-sm">سياسة الاسترجاع</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  قيمة الاشتراك 50 جنيهاً مصرياً لمدة 18 شهرًا.
                  يرجى العلم أن هذا المبلغ غير مسترد بمجرد تفعيل مميزات الحساب (متابعة التطعيمات، التنبيهات، السجل التاريخي).
                </p>
              </div>

              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="w-full h-12 bg-[#33AB98] text-white font-bold rounded-xl mt-4"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />

    </MobileLayout>
  );
};

export default ProfilePage;
