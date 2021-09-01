import Link from 'next/link';
import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header() {
  return (
    <div className={styles.contentHeader}>
      <header className={commonStyles.container}>
        <Link href="/">
          <img src="/Logo.svg" alt="Logo" />
        </Link>
      </header>
    </div>
  );
}
