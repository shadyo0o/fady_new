'use client';

import { ArrowLeft, Shield, Bell, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import InstallBanner from '@/components/ui/InstallBanner';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" dir="rtl">
      <InstallBanner />
      {/* Hero Section */}
      <div className="gradient-hero flex-1 flex flex-col items-center justify-center px-6 py-12 text-center relative overflow-hidden">


<div className="text-center relative z-10">
            <div className="w-48 h-48 rounded-full bg-white/20 mx-auto mb-6 flex items-center justify-center shadow-lg overflow-hidden border-4 border-white/30">
              <img 
                src="/logo.png" 
                alt="Fady" 
                className='w-full h-full object-cover' 
              />
            </div>
            <h1 className="text-4xl font-bold mb-2"> Fady's Vaccines</h1>
            <p className="text-white/90 text-lg">رفيقك من لحظة الولادة.  </p>
            <p className="text-white/90 text-lg"> تنبيهات ذكية: مفيش تطعيم هيفوتك أبداً. </p>
            <p className="text-white/90 text-lg"> توفير وقت: بنحددلك أيام عمل مكتب الصحة الخاص بيك عشان مشوارك يبقى أكيد. </p>
            <p className="text-white/90 text-lg"> دعم كامل: الأوراق المطلوبة لشهادة الميلاد حسب مستشفى ولادتك.. خطوة بخطوة. </p>
          </div>

          {/* Home Icon */}
          <div className="absolute top-6 left-6 z-20">
            <Link href="/home" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
            </Link>
          </div>
        
        {/* <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
          فادي
        </h1>
        <p className="text-blue-50 text-xl mb-10 font-medium">
          مسار التطعيم والولادة المثالي
        </p> */}

        <div className="space-y-4 mt-4 mb-12 w-full max-w-xs">
          {[
            { icon: Shield, text: "تابع تطعيمات طفلك بدقة" },
            { icon: Bell, text: "تنبيهات قبل كل جرعة" },
            { icon: Heart, text: "رعاية صحية متكاملة" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/20">
              <item.icon className="w-6 h-6 text-white" />
              <span className="text-white font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section - Overlapping styles */}
      <div className="bg-white rounded-t-[2.5rem] -mt-8 px-8 py-10 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <Link href="/auth/signup" className="block w-full">
          <Button className="w-full h-14 rounded-2xl text-lg font-bold gradient-primary shadow-lg shadow-blue-200 mb-6 flex items-center justify-center gap-2">
            ابدأ رحلتك الآن
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        
        <p className="text-center text-gray-500 font-medium">
          لديك حساب بالفعل؟{" "}
          <Link href="/auth/signin" className="text-[#33AB98] font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </p>
        <p className="mt-8 text-[11px] text-gray-400 text-center leading-relaxed">
          المعلومات والمواعيد الواردة في التطبيق هي للأغراض الاسترشادية فقط. يجب دائماً استشارة الطبيب المختص أو وزارة الصحة للتأكد من المواعيد والجرعات الصحيحة. 
          <br />
          المستخدم هو المسؤول الوحيد عن دقة البيانات المدخلة، والتطبيق غير مسؤول عن أي حسابات خاطئة ناتجة عن إدخال تواريخ غير صحيحة.
        </p>
      </div>
    </div>
  );
}
