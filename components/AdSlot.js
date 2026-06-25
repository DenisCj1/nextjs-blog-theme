// AdSlot — a placeholder for display ads (e.g. Google AdSense).
//
// HOW TO GO LIVE WITH ADS:
// 1. Sign up at https://www.google.com/adsense (free). Get approved (needs a
//    live site with some content + traffic).
// 2. Add the AdSense script to pages/_document.js (one <script> tag).
// 3. Replace the placeholder <div> below with the <ins class="adsbygoogle">
//    snippet AdSense gives you, using your real data-ad-client / data-ad-slot.
// Until then this renders an unobtrusive labelled box so the layout is final.

export default function AdSlot({ label = 'Advertisement', className = '' }) {
  // Hide placeholders in production so visitors never see empty ad boxes.
  // Once real ad code is added, remove this guard.
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div
      className={`flex items-center justify-center w-full min-h-[90px] my-6 text-xs uppercase tracking-widest border border-dashed rounded-lg opacity-40 border-current ${className}`}
      aria-hidden="true"
    >
      {label} slot
    </div>
  );
}
