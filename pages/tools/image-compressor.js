import { useState, useRef } from 'react';
import SiteShell from '../../components/SiteShell';
import AdSlot from '../../components/AdSlot';

const formatBytes = (b) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
};

export default function ImageCompressor() {
  const [original, setOriginal] = useState(null); // { url, size, name }
  const [result, setResult] = useState(null); // { url, size }
  const [quality, setQuality] = useState(0.7);
  const [busy, setBusy] = useState(false);
  const imgRef = useRef(null);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setResult(null);
    setOriginal({
      url: URL.createObjectURL(file),
      size: file.size,
      name: file.name.replace(/\.[^.]+$/, ''),
    });
  };

  const compress = () => {
    const img = imgRef.current;
    if (!img) return;
    setBusy(true);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    canvas.toBlob(
      (blob) => {
        setResult({ url: URL.createObjectURL(blob), size: blob.size });
        setBusy(false);
      },
      'image/jpeg',
      quality
    );
  };

  const savings =
    original && result
      ? Math.max(0, Math.round((1 - result.size / original.size) * 100))
      : 0;

  return (
    <SiteShell
      title="Image Compressor"
      description="Compress JPG, PNG and WebP images right in your browser. Free, private, no upload."
    >
      <main className="w-full py-10">
        <h1 className="text-3xl font-bold lg:text-4xl">🗜️ Image Compressor</h1>
        <p className="mt-2 opacity-70">
          Reduce image file size without uploading anything. Everything happens
          on your device.
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
          <p className="mt-1 text-sm opacity-60">JPG, PNG or WebP</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {original && (
          <div className="mt-8">
            {/* hidden source image used for canvas drawing */}
            <img
              ref={imgRef}
              src={original.url}
              alt=""
              className="hidden"
              onLoad={compress}
            />

            <label className="block mb-2 font-medium">
              Quality: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              onMouseUp={compress}
              onTouchEnd={compress}
              className="w-full"
            />

            <div className="grid gap-4 mt-6 sm:grid-cols-2">
              <div className="p-4 border rounded-lg border-current/20">
                <p className="text-sm opacity-60">Original</p>
                <p className="text-xl font-semibold">
                  {formatBytes(original.size)}
                </p>
              </div>
              <div className="p-4 border rounded-lg border-current/20">
                <p className="text-sm opacity-60">Compressed</p>
                <p className="text-xl font-semibold">
                  {busy
                    ? 'Working…'
                    : result
                    ? formatBytes(result.size)
                    : '—'}
                </p>
              </div>
            </div>

            {result && !busy && (
              <div className="flex flex-col items-center mt-6">
                <p className="mb-3 text-lg">
                  {savings > 0 ? (
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      Saved {savings}% 🎉
                    </span>
                  ) : (
                    'Already well optimized — try a lower quality.'
                  )}
                </p>
                <a
                  href={result.url}
                  download={`${original.name}-compressed.jpg`}
                  className="px-6 py-3 font-medium text-white transition bg-black rounded-lg dark:bg-white dark:text-black hover:opacity-80"
                >
                  ⬇ Download compressed image
                </a>
              </div>
            )}
          </div>
        )}

        <AdSlot label="Bottom" />

        <section className="mt-10 prose-sm opacity-80">
          <h2 className="text-xl font-semibold">About this tool</h2>
          <p className="mt-2">
            This free image compressor reduces the file size of your JPG, PNG or
            WebP images directly in your browser using the HTML canvas. Because
            nothing is uploaded to a server, it&apos;s completely private and
            works even offline once loaded.
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
