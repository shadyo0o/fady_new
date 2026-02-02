// import { Inter } from "next/font/google";
// import "./globals.css";
// import { Viewport, Metadata } from 'next';

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Fady's Vaccines",
//   description: "Child vaccination tracker and health assistant",
//   manifest: "/manifest.json",
// };

// export const viewport = {
//   themeColor: "#33AB98",
//   width: "device-width",
//   initialScale: 1,
//   maximumScale: 1,
// };

// import DashboardLayout from "@/components/DashboardLayout";

// export default function RootLayout({ children }) {
//   return (
//     <html lang="ar" dir="rtl">
//       <body className={inter.className}>
//         <DashboardLayout>
//             {children}
//         </DashboardLayout>
//       </body>
//     </html>
//   );
// }



import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 1. تحديث الـ Metadata لدعم خصائص Apple PWA
export const metadata = {
  title: "Fady's Vaccines",
  description: "Child vaccination tracker and health assistant",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true, // تسمح بفتح التطبيق بدون شريط المتصفح (Fullscreen)
    statusBarStyle: "default",
    title: "Fady's Vaccines",
  },
};

export const viewport = {
  themeColor: "#33AB98",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // يمنع الزووم العشوائي لتبدو كأنها App حقيقي
};

import { ChildProvider } from "@/contexts/ChildContext";
import DashboardLayout from "@/components/DashboardLayout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* 2. إضافة أيقونة التفاحة يدوياً لضمان ظهورها عند الـ Add to Home Screen */}
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={inter.className}>
        <ChildProvider>
          <DashboardLayout>
            {children}
          </DashboardLayout>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ direction: 'rtl' }}
          />
        </ChildProvider>
      </body>
    </html>
  );
}