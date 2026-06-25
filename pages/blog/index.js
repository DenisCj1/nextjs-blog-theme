import Link from 'next/link';
import { getPosts } from '../../utils/mdx-utils';
import { getGlobalData } from '../../utils/global-data';
import SiteShell from '../../components/SiteShell';
import ArrowIcon from '../../components/ArrowIcon';
import AdSlot from '../../components/AdSlot';

export default function Blog({ posts }) {
  return (
    <SiteShell
      title="Blog"
      description="Guides and tips on images, files and productivity from QuickTools."
    >
      <main className="w-full">
        <h1 className="my-12 text-3xl text-center lg:text-5xl">Blog</h1>
        <AdSlot label="Top banner" />
        <ul className="w-full">
          {posts.map((post) => (
            <li
              key={post.filePath}
              className="transition bg-white border border-b-0 border-gray-800 md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 dark:border-white border-opacity-10 dark:border-opacity-10 last:border-b hover:border-b"
            >
              <Link
                as={`/posts/${post.filePath.replace(/\.mdx?$/, '')}`}
                href={`/posts/[slug]`}
                className="block px-6 py-6 lg:py-10 lg:px-16 focus:outline-none focus:ring-4"
              >
                {post.data.date && (
                  <p className="mb-3 font-bold uppercase opacity-60">
                    {post.data.date}
                  </p>
                )}
                <h2 className="text-2xl md:text-3xl">{post.data.title}</h2>
                {post.data.description && (
                  <p className="mt-3 text-lg opacity-60">
                    {post.data.description}
                  </p>
                )}
                <ArrowIcon className="mt-4" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </SiteShell>
  );
}

export function getStaticProps() {
  const posts = getPosts();
  const globalData = getGlobalData();
  return { props: { posts, globalData } };
}
