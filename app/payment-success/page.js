// 'use client';

// import { useEffect, useState } from "react";
// import { CheckCircle2, ArrowRight, Home, Sparkles } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Button from "@/components/ui/Button";
// import MobileLayout from "@/components/layout/MobileLayout";
// import { useAuth } from "@/contexts/AuthContext";

// export default function PaymentSuccessPage() {
//   const router = useRouter();
//   const { refreshUser, user } = useAuth();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const verifySubscription = async () => {
//       // Refresh user data to get updated isSubscribed status
//       await refreshUser();
//       setLoading(false);
//     };

//     verifySubscription();
//   }, [refreshUser]);

//   if (loading) {
//     return (
//       <MobileLayout hideBottomNav>
//         <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
//           <div className="w-16 h-16 border-4 border-[#33AB98]/20 border-t-[#33AB98] rounded-full animate-spin mb-4" />
//           <p className="text-gray-500 font-medium">جاري تأكيد الاشتراك...</p>
//         </div>
//       </MobileLayout>
//     );
//   }

//   return (
//     <MobileLayout hideBottomNav>
//       <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
//         <div className="relative mb-8">
//             <div className="absolute inset-0 bg-[#33AB98]/20 rounded-full blur-2xl scale-150 animate-pulse" />
//             <div className="relative w-24 h-24 bg-[#33AB98] rounded-full flex items-center justify-center shadow-xl shadow-blue-100">
//                 <CheckCircle2 className="w-12 h-12 text-white" />
//             </div>
//             <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white animate-bounce">
//                 <Sparkles className="w-4 h-4 text-white" />
//             </div>
//         </div>

//         <h1 className="text-2xl font-bold text-gray-800 mb-3">
//             تم تفعيل اشتراكك بنجاح!
//         </h1>
        
//         <p className="text-gray-600 mb-8 leading-relaxed max-w-xs mx-auto">
//             مبروك! تم تفعيل اشتراك <span className="text-[#33AB98] font-bold">Fady's Vaccines</span> لمدة 18 شهر. يمكنك الآن الاستمتاع بجميع المميزات الذكية.
//         </p>

//         <div className="w-full space-y-3">
//             <Button 
//                 onClick={() => router.push('/home')}
//                 className="w-full h-14 rounded-2xl bg-[#33AB98] hover:bg-blue-600 shadow-lg shadow-blue-100 flex items-center justify-center gap-2 font-bold"
//             >
//                 <Home className="w-5 h-5" />
//                 الذهاب للرئيسية
//             </Button>
            
//             <Button 
//                 variant="outline"
//                 onClick={() => router.push('/profile')}
//                 className="w-full h-14 rounded-2xl border-2 border-gray-100 text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 font-bold"
//             >
//                 عرض حالة الحساب
//                 <ArrowRight className="w-5 h-5 rotate-180" />
//             </Button>
//         </div>

//         <p className="mt-8 text-xs text-gray-400 font-medium">
//              شكراً لثقتكم في فادى رفيق طفلك
//         </p>
//       </div>
//     </MobileLayout>
//   );
// }




// 'use client';

// import { useEffect, useState } from "react";
// import { CheckCircle2, XCircle, ArrowRight, Home, Sparkles, AlertCircle } from "lucide-react"; // ضفنا أيقونات للفشل
// import { useRouter, useSearchParams } from "next/navigation"; // ضفنا useSearchParams
// import Button from "@/components/ui/Button";
// import MobileLayout from "@/components/layout/MobileLayout";
// import { useAuth } from "@/contexts/AuthContext";

// export default function PaymentSuccessPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams(); // عشان نقرأ البيانات من الرابط
//   const { refreshUser, user } = useAuth();
//   const [loading, setLoading] = useState(true);

//   // قرأة حالة العملية من الرابط (Paymob بيبعت success=true أو false)
//   const isSuccess = searchParams.get('success') === 'true';
//   const errorMessage = searchParams.get('message'); // لو فيه رسالة خطأ جاية من باي موب

//   useEffect(() => {
//     const verifySubscription = async () => {
//       if (isSuccess) {
//         // لو العملية نجحت، نحدث بيانات المستخدم من السيرفر
//         await refreshUser();
//       }
//       setLoading(false);
//     };

//     verifySubscription();
//   }, [refreshUser, isSuccess]);

//   if (loading) {
//     return (
//       <MobileLayout hideBottomNav>
//         <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
//           <div className="w-16 h-16 border-4 border-[#33AB98]/20 border-t-[#33AB98] rounded-full animate-spin mb-4" />
//           <p className="text-gray-500 font-medium">جاري التحقق من حالة الدفع...</p>
//         </div>
//       </MobileLayout>
//     );
//   }

//   // --- في حالة الفشل (نظهر تصميم مختلف) ---
//   if (!isSuccess) {
//     return (
//       <MobileLayout hideBottomNav>
//         <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
//           <div className="relative mb-8">
//               <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl scale-150" />
//               <div className="relative w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-xl">
//                   <XCircle className="w-12 h-12 text-white" />
//               </div>
//           </div>

//           <h1 className="text-2xl font-bold text-gray-800 mb-3">عذراً، فشلت العملية</h1>
          
//           <p className="text-gray-600 mb-8 leading-relaxed max-w-xs mx-auto">
//               {errorMessage || "لم نتمكن من إتمام عملية الدفع. يرجى التأكد من بيانات البطاقة أو توفر رصيد كافٍ."}
//           </p>

//           <div className="w-full space-y-3">
//               <Button 
//                   onClick={() => router.push('/subscription')} // يرجع لصفحة خطط الدفع
//                   className="w-full h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 font-bold"
//               >
//                   محاولة مرة أخرى
//               </Button>
              
//               <Button 
//                   variant="outline"
//                   onClick={() => router.push('/home')}
//                   className="w-full h-14 rounded-2xl border-2 border-gray-100 text-gray-600 flex items-center justify-center gap-2 font-bold"
//               >
//                   العودة للرئيسية
//               </Button>
//           </div>
//         </div>
//       </MobileLayout>
//     );
//   }

//   // --- في حالة النجاح (نفس الكود بتاعك القديم) ---
//   return (
//     <MobileLayout hideBottomNav>
//       <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
//         {/* ... الكود الحالي بتاعك للنجاح ... */}
//         <div className="relative mb-8">
//             <div className="absolute inset-0 bg-[#33AB98]/20 rounded-full blur-2xl scale-150 animate-pulse" />
//             <div className="relative w-24 h-24 bg-[#33AB98] rounded-full flex items-center justify-center shadow-xl shadow-blue-100">
//                 <CheckCircle2 className="w-12 h-12 text-white" />
//             </div>
//             {/* ... الباقي ... */}
//         </div>
//         <h1 className="text-2xl font-bold text-gray-800 mb-3">تم تفعيل اشتراكك بنجاح!</h1>
//         {/* ... */}
//       </div>
//     </MobileLayout>
//   );
// }


'use client';

import { useEffect, useState, Suspense } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAuth } from "@/contexts/AuthContext";

// 1. المكون الذي يحتوي على المنطق (يستخدم useSearchParams)
function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const isSuccess = searchParams.get('success') === 'true';
  const rawError = searchParams.get('data.message');
  
  const getArabicErrorMessage = (error) => {
    if (!error) return "لم نتمكن من إتمام عملية الدفع. يرجى المحاولة مرة أخرى.";
    const err = String(error).toLowerCase();
    if (err.includes("receiver is not registered")) return "عذراً، هذا الرقم غير مسجل في خدمة المحفظة الإلكترونية.";
    if (err.includes("insufficient funds")) return "عذراً، لا يوجد رصيد كافٍ في المحفظة أو الكارت.";
    return "حدث خطأ أثناء الدفع: " + error;
  };

  useEffect(() => {
    const verifySubscription = async () => {
      if (isSuccess) {
        setTimeout(async () => {
          await refreshUser();
          setLoading(false);
        }, 2000);
      } else {
        setLoading(false);
      }
    };
    verifySubscription();
  }, [refreshUser, isSuccess]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <div className="w-16 h-16 border-4 border-[#33AB98]/20 border-t-[#33AB98] rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">جاري التحقق من حالة الدفع...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      {!isSuccess ? (
        <>
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl scale-150" />
            <div className="relative w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-xl">
              <XCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">عذراً، فشلت العملية</h1>
          <p className="text-gray-600 mb-8 leading-relaxed max-w-xs mx-auto">
            {getArabicErrorMessage(rawError)}
          </p>
          <div className="w-full space-y-3">
            <Button onClick={() => router.push('/subscription')} className="w-full h-14 rounded-2xl bg-red-500 text-white font-bold">
              محاولة مرة أخرى
            </Button>
            <Button variant="outline" onClick={() => router.push('/home')} className="w-full h-14 rounded-2xl border-2 border-gray-100 text-gray-600 font-bold">
              العودة للرئيسية
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-[#33AB98]/20 rounded-full blur-2xl scale-150 animate-pulse" />
            <div className="relative w-24 h-24 bg-[#33AB98] rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">تم تفعيل اشتراكك بنجاح!</h1>
          <p className="text-gray-600 mb-8 leading-relaxed max-w-xs mx-auto">
            مبروك! تم تفعيل اشتراك <span className="text-[#33AB98] font-bold">Fady's Vaccines</span> لمدة 18 شهر.
          </p>
          <Button onClick={() => router.push('/home')} className="w-full h-14 rounded-2xl bg-[#33AB98] text-white font-bold">
            الذهاب للرئيسية
          </Button>
        </>
      )}
    </div>
  );
}

// 2. المكون الرئيسي الذي يغلف بالـ Suspense (لحماية الـ Build)
export default function PaymentSuccessPage() {
  return (
    <MobileLayout hideBottomNav>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#33AB98] rounded-full animate-spin" />
        </div>
      }>
        <PaymentStatusContent />
      </Suspense>
    </MobileLayout>
  );
}