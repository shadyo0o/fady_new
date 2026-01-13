'use client';

import { useAuth } from '@/contexts/AuthContext';
import styles from './Navbar.module.css';
import { Menu, LogOut, User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
            <Menu size={24} />
        </button>
        <Link href="/dashboard" className={styles.logo}>
          Fady's Vaccines
        </Link>
      </div>

      <div className={styles.right}>
        {user ? (
           <div className={styles.profile}>
              <span className={styles.welcome}>مرحباً, {user.name}</span>
              <button onClick={logout} className={styles.iconBtn} title="تسجيل الخروج">
                <LogOut size={20} />
              </button>
           </div>
        ) : (
            <Link href="/auth/signin" className={styles.link}>دخول</Link>
        )}
      </div>
    </nav>
  );
}
