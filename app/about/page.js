'use client'

import MobileLayout from '@/components/layout/MobileLayout';
import { Info, ShieldCheck, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <MobileLayout dir="rtl">
      <div className="min-h-screen bg-white pb-24">
        <div className="p-5 space-y-6">
          <div className="bg-[#33AB98] rounded-2xl p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold mb-2">من نحن</h1>
            <p className="text-blue-100 text-sm">تعرف على تطبيق فادي لتطعيمات الأطفال</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-green-100 text-[#33AB98]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">رؤيتنا</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  تطبيق Fady's Vaccines هو منصة لتنظيم وتتبع تطعيمات الأطفال وتوفير جدول زمني دقيق لكل طفل. نحن نعمل باستمرار على تطوير المنصة، ونخطط لإضافة خدمات جديدة ومميزة في المستقبل القريب لتشمل جوانب أشمل لرعاية الطفل والأم.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100 text-[#33AB98]">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">مهمتنا</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  نهدف إلى مساعدة الآباء في الحفاظ على صحة أطفالهم من خلال تذكيرات دقيقة بمواعيد التطعيمات، وتوفير معلومات شاملة حول كل تطعيم، مما يضمن عدم فوات أي جرعة ضرورية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
