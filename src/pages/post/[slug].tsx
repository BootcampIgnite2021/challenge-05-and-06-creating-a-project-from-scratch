import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import Head from 'next/head';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { formateDate } from '../../utils/formateDate';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  const postContentText = post.data.content.map(content => {
    return {
      heading: content.heading,
      body: RichText.asText(content.body),
    };
  });

  const postWords = postContentText.map(word => {
    return word.heading?.split(/\s/g).length + word.body?.split(/\s/g).length;
  });

  const postWordsTotal = postWords.reduce((acc, curr) => acc + curr);

  const timeRead = Math.ceil(postWordsTotal / 200);

  return (
    <>
      <Head>spacetraveling | {post.data.title}</Head>

      <div className={styles.image}>
        <img src={post.data.banner.url} alt="Banner" />
      </div>

      <div className={commonStyles.container}>
        <article className={styles.container}>
          <h1>{post.data.title}</h1>

          <div>
            <FiCalendar />
            <span>{formateDate(post.first_publication_date)}</span>
            <FiUser /> <span>{post.data.author}</span>
            <FiClock /> <span>{timeRead} min</span>
          </div>

          {postContentText.map(postContent => (
            <>
              <h2>{postContent.heading}</h2>
              <p>{postContent.body}</p>
            </>
          ))}
        </article>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'po'),
  ]);

  const paths = posts.results.map(post => ({
    params: { slug: post.id },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;
  const response = await prismic.getByUID('po', String(slug), {});

  return {
    props: {
      post: response,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
