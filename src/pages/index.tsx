/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';

import Prismic from '@prismicio/client';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { formateDate } from '../utils/formateDate';

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
  preview: boolean;
}

export default function Home({ postsPagination, preview }: HomeProps) {
  const [loadPosts, setLoadPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function handleLoadPosts() {
    await fetch(nextPage || '')
      .then(response => response.json())
      .then(data => {
        const formatedData = data;
        setLoadPosts([...loadPosts, ...formatedData.results]);
        setNextPage(formatedData.next_page);
      });
  }

  return (
    <>
      <Head>spacetraveling | Posts</Head>

      <main className={commonStyles.container}>
        <div>
          {postsPagination.results.map(post => (
            <div key={post.uid} className={styles.content}>
              <Link href={`/post/${post.uid}`}>
                <h1>{post.data.title}</h1>
              </Link>
              <h3>{post.data.subtitle}</h3>

              <div>
                <FiCalendar color="#BBBBBB" size={20} />
                <span>{formateDate(post.first_publication_date)}</span>

                <FiUser color="#BBBBBB" size={20} />
                <span>{post.data.author}</span>
              </div>
            </div>
          ))}

          {loadPosts.map(post => (
            <div className={styles.content}>
              <Link href={`/post/${post.uid}`}>
                <h1>{post.data.title}</h1>
              </Link>
              <h3>{post.data.subtitle}</h3>

              <div>
                <FiCalendar color="#BBBBBB" size={20} />
                <span>{formateDate(post.first_publication_date)}</span>

                <FiUser color="#BBBBBB" size={20} />
                <span>{post.data.author}</span>
              </div>
            </div>
          ))}

          {nextPage ? (
            <button
              className={styles.buttonLoadPosts}
              onClick={handleLoadPosts}
              type="button"
            >
              Carregar mais posts
            </button>
          ) : (
            <> </>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'po')],
    {
      pageSize: 1,
    }
  );

  return {
    props: {
      postsPagination: postsResponse,
      preview,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
