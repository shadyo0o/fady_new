'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Users, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import MobileLayout from '@/components/layout/MobileLayout';
import { BottomNav } from '@/components/layout/BottomNav';

const FadyStory = () => {
  return (
    <MobileLayout dir="rtl">
      <div className="min-h-screen flex flex-col">
        {/* Hero Image Area - Custom Gradient matches design */}
        <div className="gradient-warm text-white p-6 pb-16 rounded-b-[3rem] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 blur-xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-xl" />
          
          <Link href="/home" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 relative z-10 transition-colors">
            <ArrowLeft className="w-5 h-5 rotate-180" />
            <span>العودة</span>
          </Link>

          <div className="text-center relative z-10">
            <div className="w-48 h-48 rounded-full bg-white/20 mx-auto mb-6 flex items-center justify-center shadow-lg overflow-hidden border-4 border-white/30">
              <img 
                src="/logo.png" 
                alt="Fady" 
                className='w-full h-full object-cover' 
              />
            </div>
            <h1 className="text-4xl font-bold mb-2">قصة فادي</h1>
            <p className="text-white/90 text-lg">من القلب... للقلب</p>
          </div>
        </div>

        <div className="mt-8 pb-6 px-6">
          {/* Story Card */}
          <div className="bg-white rounded-3xl p-6 shadow-elevated mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-destructive" />
              <h2 className="text-xl font-bold text-gray-800">لماذا "فادي"؟</h2>
            </div>
            
            <div className="space-y-4 text-gray-600 leading-relaxed text-right">
              <p>
                <span className="text-gray-900 font-bold">فادي</span> ليس مجرد اسم لتطبيق...
                <br />
                خلف كل كود برمجي.. قصة طفل بطل.
              </p>
              
              <p>
                "بدأ كل شيء بلقاء لم يكن في الحسبان. التقينا بـ 'فادي' بابتسامة غلبت قسوة الأقدار. فادي ليس مجرد طفل 'معثور عليه' بلا عائلة، بل هو الروح التي علمتنا أن القوة تولد من قلب الضعف، وأن البراءة تستحق وطناً يحميها."
              </p>
              
              <p>
                "أثناء رحلتنا معه لضمان حصوله على تطعيماته ورعايته الصحية، لمسنا حجم المسؤولية، وأدركنا أن 'النسيان' في عالم الصحة قد يكلف الكثير. ومن هنا وُلد تطبيق (Fady's Vaccines )."
              </p>
              
              <p>
                "لم يكن الاسم مجرد اختيار عشوائي، بل هو 'عهد'. عهد بأن نكون العائلة الكبيرة لكل طفل، وأن نحول التكنولوجيا إلى درع واقٍ. ولأن فادي هو الملهم، قررنا أن يكون شريكاً في النجاح؛ فجزء من كل إيراد يحققه التطبيق يذهب مباشرة لدعم رحلة فادي الصحية والأطفال الذين يشاركونه نفس الظروف."
              </p>
              
              <p>
                "باستخدامك لهذا التطبيق، أنت لا تنظم مواعيد طفلك فحسب.. أنت تمد يد الحب لترسم ابتسامة على وجه طفلٍ ينتظرنا جميعاً."
              </p>
              
              <p className="font-semibold text-primary">
                فادي: رحلة حب بدأت بلقاء، وتستمر بكل تطعيم.
              </p>

              <p className="font-semibold text-primary">
                احمِ طفلك.. وكن جزءاً من عائلة فادي الكبيرة.
              </p>
            </div>
          </div>

          {/* Charity Info */}
          <div className="bg-green-50 border-2 border-green-100 rounded-3xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">رعاية تمتد.. وأثرٌ يبقى</h3>
                <p className="text-sm text-gray-500">جزء من اشتراكك يذهب للخير</p>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-4">
              من كل اشتراك بقيمة <span className="font-bold text-green-600">60 جنيه</span>، 
              يتم التبرع بجزء منه لدعم:
            </p>
            
            <ul className="space-y-3">
              {[
                'دعم الاطفال المعثور عليهم',
                'توعية الأمهات بأهمية التطعيمات',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Quote */}
          <div className="text-center p-8 rounded-3xl bg-gray-50 border border-gray-100 italic">
            <p className="text-lg text-gray-800 mb-2">
              " شاركنا رعاية أبطالنا الصغار "
            </p>
            <p className="text-sm text-gray-500">- فريق فادي</p>
          </div>

          {/* CTA */}
          <Link href="/subscription" className="block mt-8">
            <Button className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-blue-200">
              اشترك الآن وساهم معنا
            </Button>
          </Link>
        </div>
      </div>

      <BottomNav />
    </MobileLayout>
  );
};

export default FadyStory;
