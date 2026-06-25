import Link from 'next/link';
import Head from 'next/head';
import { useEffect } from 'react';
import { GradientBackground } from './Layout';

// Shared shell for the tools site: theme handling, top nav, SEO head,
// gradient background and footer. Tool pages just drop their content inside.
export default function SiteShell({ title, description, children }) {
  // Reuse the theme system from the original blog Layout.
  useEffect(() => {
    const darkMode = localStorage.getItem('theme') === 'dark';
    const lightMode = localStorage.getItem('theme') === 'light';
    if (darkMode) document.documentElement.classList.add('dark');
    else if (lightMode) document.documentElement.classList.remove('dark');

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkQuery.onchange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    };
  }, []);

  const fullTitle = title ? `${title} · QuickTools` : 'QuickTools — Free Online Tools';

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden">
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="sticky top-0 z-20 w-full border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-black/40 backdrop-blur-lg">
        <div className="flex items-center justify-between w-full max-w-3xl px-4 py-3 mx-auto">
          <Link href="/" className="text-xl font-bold tracking-tight">
            ⚡ QuickTools
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/" className="hover:underline">
              All Tools
            </Link>
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex flex-col items-center w-full max-w-3xl px-4 mx-auto">
        {children}
      </div>

      <footer className="w-full max-w-3xl px-4 mx-auto mt-16 text-sm text-center opacity-60">
        <p>
          All tools run entirely in your browser — your files never leave your
          device.
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} QuickTools ·{' '}
          <Link href="/blog" className="underline">
            Blog
          </Link>
        </p>
      </footer>

      <GradientBackground
        variant="large"
        className="fixed top-20 opacity-40 dark:opacity-60 -z-10"
      />
      <GradientBackground
        variant="small"
        className="absolute bottom-0 opacity-20 dark:opacity-10 -z-10"
      />
    </div>
  );
}
