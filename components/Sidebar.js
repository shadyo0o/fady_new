'use client';

import styles from './Sidebar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Baby, Syringe, Info, Bell, X } from 'lucide-react';

const MENU_ITEMS = [
  { name: 'الرئيسية', path: '/dashboard', icon: Home },
  { name: 'الأطفال', path: '/childs', icon: Baby },
  { name: 'جدول التطعيمات', path: '/schedule', icon: Syringe }, // May specific to child later
  { name: 'نصائح طبية', path: '/information', icon: Info },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

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
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);
            
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`${styles.item} ${isActive ? styles.active : ''}`}
                onClick={onClose} // Auto close on mobile click
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
