'use client';

import styles from './Sidebar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Baby, Calendar, LayoutDashboard, Bell, X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'الرئيسية', path: '/home', icon: Home },
    { name: 'الأطفال', path: '/childs', icon: Baby },
    { name: 'الجدول', path: '/schedule', icon: Calendar },
    { 
      name: 'لوحة التحكم', 
      path: '/dashboard', 
      icon: LayoutDashboard 
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.showOverlay : ''}`} 
        onClick={onClose}
      />
      
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
            <h2 className={styles.title}>القائمة</h2>
            <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
        </div>

        <div className={styles.menu}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);
            
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`${styles.item} ${isActive ? styles.active : ''}`}
                onClick={onClose}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
