import { useState, useMemo } from 'react';
import SiteShell from '../../components/SiteShell';
import AdSlot from '../../components/AdSlot';

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = trimmed
      ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || 1
      : 0;
    const paragraphs = trimmed
      ? trimmed.split(/\n+/).filter((p) => p.trim()).length
      : 0;
    const readingTime = Math.ceil(words / 200); // ~200 wpm
    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime,
    };
  }, [text]);

  const cards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.characters },
    { label: 'Characters (no spaces)', value: stats.charactersNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    {
      label: 'Reading time',
      value: stats.readingTime ? `${stats.readingTime} min` : '0 min',
    },
  ];

  return (
    <SiteShell
      title="Word Counter"
      description="Free online word and character counter. Count words, characters, sentences and reading time instantly."
    >
      <main className="w-full py-10">
        <h1 className="text-3xl font-bold lg:text-4xl">🔢 Word Counter</h1>
        <p className="mt-2 opacity-70">
          Start typing or paste your text — stats update live.
        </p>

        <AdSlot label="Top banner" />

        <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.label}
              className="p-4 text-center border rounded-lg border-current/20 bg-white/40 dark:bg-black/30"
            >
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-xs opacity-60">{c.label}</p>
            </div>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here…"
          className="w-full p-4 mt-6 border rounded-lg resize-y min-h-[240px] border-current/20 bg-white/60 dark:bg-black/40 focus:outline-none focus:ring-4"
        />

        <div className="flex gap-3 mt-3">
          <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="px-4 py-2 text-sm border rounded-lg border-current/30 hover:border-current"
          >
            Copy text
          </button>
          <button
            onClick={() => setText('')}
            className="px-4 py-2 text-sm border rounded-lg border-current/30 hover:border-current"
          >
            Clear
          </button>
        </div>

        <AdSlot label="Bottom" />

        <section className="mt-10 prose-sm opacity-80">
          <h2 className="text-xl font-semibold">About this tool</h2>
          <p className="mt-2">
            A free, private word counter for essays, articles, social posts and
            SEO. It counts words, characters (with and without spaces),
            sentences, paragraphs and estimates reading time at 200 words per
            minute. Nothing you type is sent anywhere.
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
