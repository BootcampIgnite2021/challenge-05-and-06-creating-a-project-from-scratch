/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Link from 'next/link';

import styles from './exitPreviewButton.module.scss';

export function ExitPreviewButton() {
  return (
    <Link href="/api/exit-preview">
      <aside className={styles.exitButton}>
        <a>Sair do modo Preview</a>
      </aside>
    </Link>
  );
}
