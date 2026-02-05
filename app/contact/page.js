'use client'

import MobileLayout from '@/components/layout/MobileLayout';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <MobileLayout dir="rtl">
      <div className="min-h-screen bg-white pb-24">
        <div className="p-5 space-y-6">
          <div className="bg-[#33AB98] rounded-2xl p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold mb-2">اتصل بنا</h1>
            <p className="text-blue-100 text-sm">يسعدنا تواصلكم واقتراحاتكم في أي وقت</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-100 text-red-500">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">البريد الإلكتروني</h3>
                <p className="text-sm text-gray-600">vaccination653@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-green-100 text-green-500">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">الهاتف</h3>
                <p className="text-sm text-gray-600" dir="ltr">01556495549</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100 text-blue-500">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">العنوان</h3>
                <p className="text-sm text-gray-600">البحيرة، دمنهور.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
