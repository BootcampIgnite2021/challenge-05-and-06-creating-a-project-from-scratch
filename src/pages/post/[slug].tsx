/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import Head from 'next/head';

import Link from 'next/link';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { formateDate, FORMAT_DATE, FORMAT_EDIT } from '../../utils/formateDate';
import Comments from '../../components/Comments';
import { ExitPreviewButton } from '../../components/ExitPreviewButton';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
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
  preview: boolean;
  previousPost: {
    uid?: string;
    title?: string;
  };
  nextPost: {
    uid?: string;
    title?: string;
  };
}

export default function Post({
  post,
  preview,
  previousPost,
  nextPost,
}: PostProps) {
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

  const postEdit = post.first_publication_date !== post.last_publication_date;

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
            <span>{formateDate(post.first_publication_date, FORMAT_DATE)}</span>
            <FiUser /> <span>{post.data.author}</span>
            <FiClock /> <span>{timeRead} min</span>
          </div>

          {postEdit && (
            <span>{formateDate(post.last_publication_date, FORMAT_EDIT)}</span>
          )}

          {postContentText.map(postContent => (
            <>
              <h2>{postContent.heading}</h2>
              <p>{postContent.body}</p>
            </>
          ))}

          <div className={styles.navPosts}>
            {previousPost.uid ? (
              <Link href={`/post/${previousPost.uid}`}>
                <div>
                  <a>{`${previousPost.title}`}</a>
                  <strong>Post anterior</strong>
                </div>
              </Link>
            ) : (
              <a />
            )}

            {nextPost.uid ? (
              <Link href={`/post/${nextPost.uid}`}>
                <div className={styles.nextPost}>
                  <a>{`${nextPost.title}`}</a>
                  <strong>Próximo post</strong>
                </div>
              </Link>
            ) : (
              <a />
            )}
          </div>

          <Comments />
          {preview && <ExitPreviewButton />}
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

export const getStaticProps: GetStaticProps = async ({
  params,
  previewData,
  preview = true,
}) => {
  const prismic = getPrismicClient();
  const { slug } = params;
  const response = await prismic.getByUID('po', String(slug), {});

  const responsePreviousPost = (
    await prismic.query(
      Prismic.Predicates.dateBefore(
        'document.first_publication_date',
        response.first_publication_date
      ),
      { orderings: '[document.first_publication_date]' }
    )
  ).results.pop();

  const responseNextPost = (
    await prismic.query(
      Prismic.Predicates.dateAfter(
        'document.first_publication_date',
        response.first_publication_date
      ),
      { orderings: '[document.first_publication_date]' }
    )
  ).results[0];

  const previousPost = {
    uid: responsePreviousPost?.uid ? responsePreviousPost.uid : '',
    title: responsePreviousPost?.data.title
      ? responsePreviousPost.data.title
      : '',
  };

  const nextPost = {
    uid: responseNextPost?.uid ? responseNextPost.uid : '',
    title: responseNextPost?.data.title ? responseNextPost.data.title : '',
  };

  return {
    props: {
      post: response,
      preview,
      previousPost,
      nextPost,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
