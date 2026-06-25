import { useState, useRef } from 'react';
import SiteShell from '../../components/SiteShell';
import AdSlot from '../../components/AdSlot';

const FORMATS = [
  { label: 'PNG', mime: 'image/png', ext: 'png' },
  { label: 'JPG', mime: 'image/jpeg', ext: 'jpg' },
  { label: 'WebP', mime: 'image/webp', ext: 'webp' },
];

export default function ImageConverter() {
  const [src, setSrc] = useState(null); // { url, name }
  const [target, setTarget] = useState(FORMATS[1]);
  const [result, setResult] = useState(null);
  const imgRef = useRef(null);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setResult(null);
    setSrc({
      url: URL.createObjectURL(file),
      name: file.name.replace(/\.[^.]+$/, ''),
    });
  };

  const convert = (fmt) => {
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    // JPG has no transparency — fill white so it isn't black.
    if (fmt.mime === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(
      (blob) => setResult({ url: URL.createObjectURL(blob), ext: fmt.ext }),
      fmt.mime,
      0.92
    );
  };

  return (
    <SiteShell
      title="Image Converter"
      description="Convert images between PNG, JPG and WebP in your browser. Free, private, no upload."
    >
      <main className="w-full py-10">
        <h1 className="text-3xl font-bold lg:text-4xl">🔁 Image Converter</h1>
        <p className="mt-2 opacity-70">
          Convert between PNG, JPG and WebP. Files stay on your device.
        </p>

        <AdSlot label="Top banner" />

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center p-10 mt-4 text-center transition border-2 border-dashed rounded-xl cursor-pointer border-current/40 hover:bg-white/30 dark:hover:bg-black/20"
        >
          <p className="text-lg">📁 Drop an image here or click to choose</p>
          <p className="mt-1 text-sm opacity-60">Any image format</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {src && (
          <div className="mt-8">
            <img ref={imgRef} src={src.url} alt="" className="hidden" />
            <p className="mb-3 font-medium">Convert to:</p>
            <div className="flex flex-wrap gap-3">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt.ext}
                  onClick={() => {
                    setTarget(fmt);
                    convert(fmt);
                  }}
                  className={`px-5 py-2 rounded-lg border transition ${
                    target.ext === fmt.ext
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'border-current/30 hover:border-current'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            {result && (
              <div className="flex flex-col items-center mt-8">
                <img
                  src={result.url}
                  alt="converted preview"
                  className="max-h-48 mb-4 rounded-lg shadow"
                />
                <a
                  href={result.url}
                  download={`${src.name}.${result.ext}`}
                  className="px-6 py-3 font-medium text-white transition bg-black rounded-lg dark:bg-white dark:text-black hover:opacity-80"
                >
                  ⬇ Download .{result.ext}
                </a>
              </div>
            )}
          </div>
        )}

        <AdSlot label="Bottom" />

        <section className="mt-10 prose-sm opacity-80">
          <h2 className="text-xl font-semibold">About this tool</h2>
          <p className="mt-2">
            Convert images between PNG, JPG and WebP formats instantly in your
            browser. No uploads, no watermarks, no sign-up. Converting to JPG
            adds a white background where the original was transparent.
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
