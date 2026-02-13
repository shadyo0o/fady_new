'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import InstallBanner from '@/components/ui/InstallBanner';

const SignupPage = () => {
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    cPassword: '',
    gender: 'male'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.cPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
      return;
    }

    setLoading(true);
    try {
      await signup(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء التسجيل.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" dir="rtl">
      <InstallBanner />
      {/* Header */}
      <div className="gradient-hero pt-12 pb-16 px-6 text-center">
        {/* <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-4 text-white">
          <span className="text-3xl">💉</span>
        </div> */}
                    <div className="w-48 h-48 rounded-full bg-white/20 mx-auto mb-6 flex items-center justify-center shadow-lg overflow-hidden border-4 border-white/30">
              <img 
                src="/logo.png" 
                alt="Fady" 
                className='w-full h-full object-cover' 
              />
            </div>
        <h1 className="text-2xl font-bold text-white">
          فادي
        </h1>
        <p className="text-blue-50 text-xl mt-1">
رفيقك من لحظة الولادة.        </p>
        <p className="text-blue-50 text-xl mt-1">
"دقتنا مستمدة من واقعنا.. مواعيد تطعيم ذكية ومخصصة لمكاتب الصحة داخل مدينة دمنهور"         </p>
      </div>

      {/* Form */}
      <div className="flex-1 bg-white -mt-8 rounded-t-[2rem] px-6 pt-8 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative z-10">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
         إنشاء حساب (القائم بالتسجيل الاب او الام) 
        </h2>
        <p className="text-gray-500 text-sm mb-3">
          ابدأ رحلة تطعيم طفلك
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-yellow-800 text-center">
            <strong>تأكيد مهم:</strong> يجب أن يكون البريد الإلكتروني ورقم الهاتف غير مستخدمين من قبل. يرجى حفظ هذه البيانات بشكل آمن حيث لا يمكن استعادة كلمة المرور المنسية.
          </p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="الاسم الكامل"
              className="w-full pr-12 pl-4 h-14 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-[#33AB98] transition-all outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full pr-12 pl-4 h-14 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-[#33AB98] transition-all outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              placeholder="رقم الهاتف -هذا الرقم هو وسيلة تفعيل اشتراكك في التطبيق (يرجي كتابة الرقم صحيح)"
              className="w-full pr-12 pl-4 h-14 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-[#33AB98] transition-all outline-none"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <p className="text-red-500 text-sm mt-1">يرجى التأكد من الدفع بنفس الرقم المسجل به في التطبيق لضمان تفعيل الاشتراك تلقائياً</p>
          </div>

          <div className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              className="w-full pr-12 pl-12 h-14 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-[#33AB98] transition-all outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="تأكيد كلمة المرور"
              className="w-full pr-12 pl-12 h-14 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-[#33AB98] transition-all outline-none"
              value={formData.cPassword}
              onChange={(e) => setFormData({ ...formData, cPassword: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

           <div className="relative">
             <select 
               className="w-full pr-4 pl-4 h-14 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-[#33AB98] transition-all outline-none appearance-none"
               value={formData.gender}
               onChange={(e) => setFormData({...formData, gender: e.target.value})}
             >
                <option value="male">أب</option>
                <option value="female">أم</option>
             </select>
          </div>

          <Button
            type="submit"
            className="w-full h-14 rounded-xl text-base font-semibold gradient-primary mt-6 !border-0 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              "جاري الإنشاء..."
            ) : (
              <>
                إنشاء حساب
                <ArrowLeft className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>


        {/* Sign In Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          لديك حساب بالفعل؟{" "}
          <Link href="/auth/signin" className="text-[#33AB98] font-semibold hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
