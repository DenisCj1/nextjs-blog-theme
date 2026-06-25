// Central registry of all tools. Add a new entry here and create the matching
// page under pages/tools/<slug>.js — it shows up on the homepage automatically.
export const tools = [
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    emoji: '🗜️',
    tagline: 'Shrink JPG, PNG & WebP images without losing quality.',
    keywords: 'compress image, reduce image size, image compressor online',
  },
  {
    slug: 'image-converter',
    name: 'Image Converter',
    emoji: '🔁',
    tagline: 'Convert between PNG, JPG and WebP in one click.',
    keywords: 'convert png to jpg, image converter, webp converter',
  },
  {
    slug: 'word-counter',
    name: 'Word Counter',
    emoji: '🔢',
    tagline: 'Count words, characters, sentences and reading time instantly.',
    keywords: 'word counter, character counter, count words online',
  },
];

export const getTool = (slug) => tools.find((t) => t.slug === slug);
