/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticProps } from 'next';
import Head from 'next/head';

import { FiCalendar, FiUser } from 'react-icons/fi';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  return (
    <>
      <Head>spacetraveling | Posts</Head>

      <main className={commonStyles.container}>
        <div>
          <div className={styles.content}>
            <h1>Como utilizar Hooks</h1>
            <h3>Pensando em sincronização em vez de ciclos de vida.</h3>

            <div>
              <FiCalendar color="#BBBBBB" size={20} />
              <span>tetse</span>

              <FiUser color="#BBBBBB" size={20} />
              <span>teste</span>
            </div>
          </div>

          <div className={styles.content}>
            <h1>Como utilizar Hooks</h1>
            <h3>Pensando em sincronização em vez de ciclos de vida.</h3>

            <div>
              <FiCalendar color="#BBBBBB" size={20} />
              <span>tetse</span>

              <FiUser color="#BBBBBB" size={20} />
              <span>teste</span>
            </div>
          </div>

          <div className={styles.content}>
            <h1>Como utilizar Hooks</h1>
            <h3>Pensando em sincronização em vez de ciclos de vida.</h3>

            <div>
              <FiCalendar color="#BBBBBB" size={20} />
              <span>tetse</span>

              <FiUser color="#BBBBBB" size={20} />
              <span>teste</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'po'),
  ]);

  return {
    props: {
      postsPagination: postsResponse,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
