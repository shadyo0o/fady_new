'use client';

import { ArrowRight, Check, Shield, Bell, Heart, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import MobileLayout from "@/components/layout/MobileLayout";

const features = [
  {
    icon: Shield,
    title: "متابعة ذكية للتطعيمات",
    description: "لا تفوت أي جرعة مع الجدولة الذكية",
  },
  {
    icon: Bell,
    title: "تذكيرات في الوقت المناسب",
    description: "احصل على إشعارات قبل كل تطعيم",
  },
  {
    icon: Heart,
    title: "ادعم قضية نبيلة",
    description: "ساعد في تطعيم الأطفال المحتاجين",
  },
];

const SubscriptionPage = () => {
  const router = useRouter();

  return (
    <MobileLayout dir="rtl">
      <div className="min-h-screen bg-white">
        {/* Header - Classic Medical */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-10">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="w-4 h-4 text-gray-700" />
          </button>
          <h1 className="text-base font-semibold text-gray-800">الاشتراك</h1>
        </div>

        <div className="p-4">
          {/* Plan Card */}
          <div className="relative overflow-hidden rounded-2xl bg-[#33AB98] p-6 mb-6 shadow-lg shadow-blue-100">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/90 font-bold text-sm">
                  الباقة المميزة
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">
                    60
                  </span>
                  <span className="text-xl text-white/80">جنيه</span>
                </div>
                <p className="text-white/70 text-sm mt-1">
                  رحلة كاملة لمدة 18 شهر
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 inline-block border border-white/20">
                <p className="text-white text-xs font-semibold">
                   أقل من 4 جنيه في الشهر
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4 px-1 uppercase tracking-wider">
              ما يتضمنه الاشتراك
            </h2>

            <div className="space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                      <Icon className="w-5 h-5 text-[#33AB98]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benefits List */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-800 mb-4 px-1 uppercase tracking-wider">
              جميع المميزات
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {[
                "تتبع عدة أطفال",
                "جدول تطعيمات مخصص",
                "تذكيرات Push و SMS",
                "سجل التطعيمات الذكي",
                "تتبع الأعراض الجانبية",
                "توصيات مكاتب الصحة",
                "دعم فني مخصص",
                "المساهمة في دعم الأطفال المحتاجين",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-lg border border-gray-100/50">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Button className="w-full h-14 rounded-2xl text-base font-bold bg-[#33AB98] hover:bg-blue-600 shadow-lg shadow-blue-100 transition-all active:scale-[0.98] mb-4">
            اشترك الآن - 60 جنيه
          </Button>

          <p className="text-center text-xs text-gray-400 font-medium">
            دفعة واحدة • لا توجد رسوم خفية • اشتراك مدى الحياة للطفل
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SubscriptionPage;
