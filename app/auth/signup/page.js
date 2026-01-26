'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

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
        <p className="text-gray-500 text-sm mb-6">
          ابدأ رحلة تطعيم طفلك
        </p>

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
              placeholder="رقم الهاتف"
              className="w-full pr-12 pl-4 h-14 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-[#33AB98] transition-all outline-none"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
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

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-sm text-gray-400">أو</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Google Sign In - Placeholder for UI consistency */}
        <Button
          variant="outline"
          className="w-full h-14 rounded-xl text-base font-medium border-2 !bg-transparent text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-3"
          onClick={() => {}}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          المتابعة مع جوجل
        </Button>

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
