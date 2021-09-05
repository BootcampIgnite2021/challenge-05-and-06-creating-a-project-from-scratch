/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Link from 'next/link';
import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header() {
  return (
    <div className={styles.contentHeader}>
      <header className={commonStyles.container}>
        <Link href="/">
          <img src="/Logo.svg" alt="logo" />
        </Link>
      </header>
    </div>
  );
}
