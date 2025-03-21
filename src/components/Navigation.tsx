'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        Mapeamento de Processos
      </Link>
      <div className={styles.navLinks}>
        <Link 
          href="/areas" 
          className={`${styles.navLink} ${isActive('/areas') ? styles.active : ''}`}
        >
          Áreas
        </Link>
        <Link 
          href="/processos" 
          className={`${styles.navLink} ${isActive('/processos') ? styles.active : ''}`}
        >
          Processos
        </Link>
        <Link 
          href="/subprocessos" 
          className={`${styles.navLink} ${isActive('/subprocessos') ? styles.active : ''}`}
        >
          Subprocessos
        </Link>
        <Link 
          href="/cadeia-processos" 
          className={`${styles.navLink} ${isActive('/cadeia-processos') ? styles.active : ''}`}
        >
          Visualizar Cadeia
        </Link>
      </div>
    </nav>
  );
} 