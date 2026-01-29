'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Stethoscope } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import InstallBanner from '@/components/ui/InstallBanner';

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
      <InstallBanner />
      {/* Header - Classic Medical */}
      <div className="bg-[#33AB98] pt-14 pb-12 px-6 text-center">
        {/* <div className="w-16 h-16 bg-white rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg">
          <Stethoscope className="w-8 h-8 text-[#33AB98]" />
        </div> */}
            <div className="w-48 h-48 rounded-full bg-white/20 mx-auto mb-6 flex items-center justify-center shadow-lg overflow-hidden border-4 border-white/30">
              <img 
                src="/logo.png" 
                alt="Fady" 
                className='w-full h-full object-cover' 
              />
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
        <p className="text-gray-500 text-sm mb-3">
          أدخل بياناتك
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-800 text-center">
            <strong>ملحوظة هامة:</strong> يرجى التأكد من حفظ البريد الإلكتروني وكلمة المرور المسجلين. لا يمكن استعادة كلمة المرور المنسية.
          </p>
        </div>

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
