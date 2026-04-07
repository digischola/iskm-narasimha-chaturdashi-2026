

## Plan: Kavacha Styling Fix + Page Performance Optimization

### 1. Kavacha section background color
Change `.kavacha-section` background from `linear-gradient(180deg, var(--cream-warm), var(--cream))` to `#fdf4ec`.

### 2. Shop Now button → pink (matching other CTAs)
Change `.btn-kavacha` background from `var(--saffron)` to `var(--pink)` (`#f8a4c0`), and hover to `var(--pink-light)`. Update text color to `var(--navy)` to match `.nav-cta` style.

### 3. Page performance — image optimization
Images are the bottleneck. Changes:

- **Convert all JPG/JPEG images to WebP** using a build script, reducing file sizes by ~30-50%. Place optimized versions in `public/images/` replacing originals (or add `.webp` variants and update `src` references).
- **Add `width` and `height` attributes** to all `<img>` tags to prevent layout shift (CLS).
- **Add `loading="lazy"`** to any images missing it (hero image currently lacks it — but hero should use `loading="eager"` since it's above the fold; others should be lazy).
- **Add `fetchpriority="high"`** to the hero image for LCP improvement.
- **Preload hero image** via `<link rel="preload">` in `index.html`.
- **Use `decoding="async"`** on all non-critical images.

### Files Modified
- `src/index.css` — kavacha background + button color
- `src/App.tsx` — image attributes (width/height, decoding, fetchpriority)
- `index.html` — preload hero image
- `public/images/` — convert JPGs to WebP via build script

