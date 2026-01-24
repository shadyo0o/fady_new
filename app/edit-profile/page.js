'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileLayout from '@/components/layout/MobileLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { showToast } from '@/lib/toast';
import api from '@/lib/api/client';
import { useAuth } from '@/contexts/AuthContext';

export default function EditProfilePage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', gender: 'female' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const r1 = await api.get('/users/profile');
        const u = r1.data?.user || r1.data?.data || r1.data;
        if (u) {
          setForm({
            name: u.name || '',
            email: u.email || '',
            phone: u.phone || '',
            gender: u.gender || 'female',
          });
        } else {
          throw new Error('empty');
        }
      } catch {
        try {
          const r2 = await api.get('/profile');
          const u2 = r2.data?.user || r2.data?.data || r2.data;
          setForm({
            name: u2?.name || '',
            email: u2?.email || '',
            phone: u2?.phone || '',
            gender: u2?.gender || 'female',
          });
        } catch {
          setForm({ name: '', email: '', phone: '', gender: 'female' });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email, phone: form.phone, gender: form.gender };
      
      // Try multiple potential endpoints for update
      let res;
      const endpoints = [
        { method: 'patch', url: '/users/profile' },
        { method: 'put', url: '/users/profile' },
        { method: 'patch', url: '/users/updateProfile' },
        { method: 'post', url: '/users/update' },
        { method: 'patch', url: '/updateProfile' }
      ];

      let lastError;
      let success = false;

      for (const ep of endpoints) {
        try {
          res = await api[ep.method](ep.url, payload);
          success = true;
          break;
        } catch (err) {
          lastError = err;
          // Only continue if it's a 404 (Not Found), otherwise it's a real error (like validation)
          if (err.response && err.response.status !== 404) {
            throw err;
          }
        }
      }

      if (!success) {
        throw lastError || new Error('API endpoint not found');
      }

      const updated = res.data?.user || res.data?.data || res.data;
      showToast.success('تم تحديث الملف الشخصي بنجاح ✅');
      try { await refreshUser?.(); } catch {}
      router.push('/profile');
    } catch (err) {
      const msg = err?.response?.data?.message || 'تعذر تحديث الملف الشخصي';
      showToast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <MobileLayout dir="rtl">
      <div className="min-h-screen bg-white pb-24">
        <div className="p-5">
          <h1 className="text-lg font-bold text-gray-800 mb-4">تعديل الملف الشخصي</h1>
          {loading ? (
            <div className="p-8 text-center text-gray-500">جاري التحميل...</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="الاسم"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="اكتب اسمك"
              />
              <Input
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
              />
              <Input
                label="رقم الهاتف"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="01xxxxxxxxx"
              />
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">النوع</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={form.gender === 'male'}
                      onChange={handleChange}
                    />
                    ذكر
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={form.gender === 'female'}
                      onChange={handleChange}
                    />
                    أنثى
                  </label>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#33AB98] hover:bg-[#2b9a88] text-white rounded-xl"
                disabled={saving}
              >
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
