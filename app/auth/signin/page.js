'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Stethoscope } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

const SigninPage = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تسجيل الدخول. تأكد من البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" dir="rtl">
      {/* Header - Classic Medical */}
      <div className="bg-[#33AB98] pt-14 pb-12 px-6 text-center">
        <div className="w-16 h-16 bg-white rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg">
          <Stethoscope className="w-8 h-8 text-[#33AB98]" />
        </div>
        <h1 className="text-xl font-semibold text-white">
          مرحباً بعودتك
        </h1>
        <p className="text-blue-100 text-xl mt-1">
          تابع رحلة تطعيم طفلك
        </p>
        <p className="text-blue-100 text-xl mt-1">
"دقتنا مستمدة من واقعنا.. مواعيد تطعيم ذكية ومخصصة لمكاتب الصحة داخل مدينة دمنهور"        </p>
      </div>

      {/* Form */}
      <div className="flex-1 bg-white px-5 pt-6 pb-6 rounded-t-3xl -mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">تسجيل الدخول</h2>
        <p className="text-gray-500 text-sm mb-5">
          أدخل بياناتك
        </p>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full pr-10 pl-4 h-12 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#33AB98] transition-all outline-none"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              className="w-full pr-10 pl-10 h-12 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#33AB98] transition-all outline-none"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="text-left">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-[#33AB98] font-medium hover:underline"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-lg text-sm font-semibold bg-[#33AB98] hover:bg-[#357ABD] transition-colors mt-2 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              "جاري الدخول..."
            ) : (
              <>
                تسجيل الدخول
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">أو</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Sign In */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-lg text-sm font-medium border border-gray-200 !bg-transparent text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
          onClick={() => {}}
        >
          <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24">
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

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          ليس لديك حساب؟{" "}
          <Link href="/auth/signup" className="text-[#33AB98] font-semibold hover:underline">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SigninPage;
