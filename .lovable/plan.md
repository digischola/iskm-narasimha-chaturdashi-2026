
# Performance Optimization — Ratha Yatra Page

The Lighthouse report shows FCP 5.4s, LCP 10.5s, Speed Index 10.9s. Here are the key bottlenecks and fixes, all preserving existing functionality and animations.

---

## 1. Compress images (~6.2 MB total, biggest win)

All 25 images in `/public/images/ratha-yatra/` are unoptimized webp files (146KB–409KB each). Resize and re-compress them to appropriate display dimensions:
- Hero image: max 1200px wide, quality 80 → ~80KB
- Gallery images (g1–g12): max 600px wide, quality 75 → ~40–60KB each
- Highlight cards (h1–h6): max 500px wide, quality 75 → ~30–50KB each
- Story/about/other images: similar treatment

Target: reduce total from ~6.2MB to ~1.2MB.

## 2. Defer YouTube iframe until visible

The YouTube embed loads immediately with `autoplay=1`, pulling in ~1–2MB of YouTube scripts/player resources. Replace it with an IntersectionObserver-based facade:
- Show a static thumbnail initially (use YouTube's thumbnail URL)
- Only insert the actual `<iframe>` when the section scrolls into view
- Keeps autoplay behavior once loaded — no functionality change

## 3. Defer Google Maps iframe until visible

Same pattern as YouTube — only load the Maps iframe when the Location section enters the viewport.

## 4. Optimize font loading (render-blocking)

Currently in `index.html`:
- Google Fonts CSS is render-blocking (`<link rel="stylesheet">`)
- Font Awesome full CSS (~100KB) is loaded for only ~39 icons

Fixes:
- Add `font-display: swap` via the Google Fonts URL parameter (`&display=swap` — already present, good)
- Add `rel="preload"` + `as="style"` for the Google Fonts link, with `onload` swap to stylesheet
- For Font Awesome: add `media="print" onload="this.media='all'"` pattern to defer it

## 5. Add explicit width/height to all images

Several images lack `width`/`height` attributes, contributing to CLS (0.102). Add dimensions to:
- Story images, highlight cards, about image, gallery images

## 6. Preload hero image with correct path

The `<link rel="preload">` for the hero is in the Helmet component (rendered client-side), so it fires too late. Move it to `index.html` for the Ratha Yatra route, or add it as a conditional preload.

---

## Technical Details

### Image compression script
Will use ImageMagick via nix to batch-resize all images in-place, keeping webp format.

### YouTube facade component
```tsx
function LazyYouTube({ src, title }) {
  const [load, setLoad] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLoad(true); obs.disconnect(); } }, { rootMargin: '200px' });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="yt-responsive">
      {load ? <iframe src={src} title={title} ... /> : <div className="yt-placeholder" />}
    </div>
  );
}
```

### Font Awesome deferral
```html
<link rel="stylesheet" href="...font-awesome..." media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="...font-awesome..."></noscript>
```

### Estimated impact
- Image compression: FCP -1s, LCP -3–5s, Speed Index -3–4s
- YouTube defer: FCP -0.5s, TBT reduction
- Font defer: FCP -0.5–1s
- Combined target: LCP under 4s, FCP under 2.5s
