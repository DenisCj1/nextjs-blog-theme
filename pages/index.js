import Link from 'next/link';
import SiteShell from '../components/SiteShell';
import AdSlot from '../components/AdSlot';
import { tools } from '../utils/tools';

export default function Home() {
  return (
    <SiteShell
      title=""
      description="Free, fast, privacy-friendly online tools that run entirely in your browser. Compress images, convert files, count words and more — no uploads, no sign-up."
    >
      <main className="w-full">
        <section className="py-12 text-center">
          <h1 className="text-4xl font-bold lg:text-6xl">
            Free Online Tools
          </h1>
          <p className="max-w-xl mx-auto mt-4 text-lg opacity-70">
            Fast, private, and free. Everything runs in your browser — your
            files never leave your device.
          </p>
        </section>

        <AdSlot label="Top banner" />

        <ul className="grid w-full gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                className="flex flex-col h-full p-6 transition border border-gray-200 rounded-xl dark:border-gray-800 bg-white/50 dark:bg-black/30 backdrop-blur hover:border-current hover:-translate-y-1 focus:outline-none focus:ring-4"
              >
                <span className="text-3xl">{tool.emoji}</span>
                <span className="mt-3 text-xl font-semibold">{tool.name}</span>
                <span className="mt-1 text-sm opacity-60">{tool.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>

        <AdSlot label="Mid-page" />

        <section className="py-10 text-center">
          <h2 className="text-2xl font-semibold">Why QuickTools?</h2>
          <div className="grid gap-6 mt-6 sm:grid-cols-3">
            <div>
              <p className="text-2xl">🔒</p>
              <p className="mt-2 font-medium">100% Private</p>
              <p className="text-sm opacity-60">
                Files are processed locally and never uploaded.
              </p>
            </div>
            <div>
              <p className="text-2xl">⚡</p>
              <p className="mt-2 font-medium">Instant</p>
              <p className="text-sm opacity-60">
                No waiting on servers — results in milliseconds.
              </p>
            </div>
            <div>
              <p className="text-2xl">🆓</p>
              <p className="mt-2 font-medium">Free Forever</p>
              <p className="text-sm opacity-60">
                No sign-up, no limits, no catch.
              </p>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
