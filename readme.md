![Alpine.js](https://img.shields.io/badge/Alpine.js-8BC0D0?style=flat&logo=alpinedotjs&logoColor=black) ![Astro](https://img.shields.io/badge/Astro-FF5D01?style=flat&logo=astro&logoColor=white) ![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white) ![Conventional Commits](https://img.shields.io/badge/Conventional_Commits-FE5196?style=flat&logo=conventionalcommits&logoColor=white)

# Frasi

Italian phrase flashcards. Browse one card at a time on screen, or print US Letter sheets of eight and cut them out. Matching words across the two languages are colour linked.

Built on a static site template with [Astro](https://astro.build) and [Alpine.js](https://alpinejs.dev). Optimised for minimal Javascript footprint, performance, a11y, and SEO.

## Stack

- **Astro 7**: static output, client-side routing via `<ClientRouter />`
- **Alpine.js**: lightweight interactivity, no build step
- **Bun**: package manager and script runner
- **SCSS**: including breakpoint mixins and Foundation-type base styles


## Quickstart

```bash
bun install        # requires node 24+
bun run dev        # local development
bun run build      # outputs to ./dist
bun run preview    # preview the ./dist build locally
bun run check      # type check .astro and .ts files
```

_(Use `bun run build` rather than `bun build`, which invokes bun's own bundler instead of the script)_

## Directory structure

```
/
├── public/
│   ├── _headers          # Cloudflare Pages security headers + CSP
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── fonts/            # Self-hosted Source Serif 4 and IBM Plex Sans (variable woff2)
│   └── robots.txt
│
├── src/
│   ├── assets/
│   │   ├── fonts/        # Source fonts (processed by Vite)
│   │   └── images/       # loggia1.jpg and loggia2.jpg, one is picked per visit as the backdrop
│   │
│   ├── components/
│   │   ├── Card.astro      # One two-row card face (Italian, English)
│   │   ├── CardPair.astro  # Phrase card over response card, used on screen and in print
│   │   ├── Footer.astro
│   │   ├── Header.astro    # Wordmark plus header-meta and header-tools slots
│   │   ├── Nav.astro       # Unused, kept from the starter
│   │   ├── Pagination.astro # Prev/next, counter, chips, with a slot for extra tools
│   │   ├── Sheet.astro     # One US Letter sheet of 8 card pairs
│   │   ├── Switch.astro    # Alpine bound on/off switch
│   │   └── SEO.astro       # <title>, meta, canonical, OG, Twitter card
│   │
│   ├── content/
│   │   ├── global.toon   # Site-wide values (name, URL, description, title postfix)
│   │   ├── cards.toon    # The card set, labels and print settings
│   │   ├── home.toon     # UI strings for the card browser
│   │   ├── about.toon
│   │   ├── privacy.toon
│   │   └── 404.toon
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro  # Root HTML shell, accepts SEO + JSON-LD props
│   │
│   ├── lib/
│   │   ├── backdrops.ts  # Background images with their edge colours
│   │   ├── cards.ts      # Word match markup parser
│   │   └── content.ts    # loadGlobal(), loadPage() and loadData() helpers
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── privacy.astro
│   │   └── 404.astro
│   │
│   ├── styles/
│   │   ├── _breakpoints.scss  # Media query mixins
│   │   ├── foundation.min.css # Grid, normalize, base ui
│   │   ├── reset.css
│   │   ├── variables.css      # Palette, fonts, type scale
│   │   ├── prose.css          # .markdown long-form styles
│   │   ├── x-browser.css      # Browser-specific fixes
│   │   └── global.scss        # Entry point, imports the rest, @font-face, print rules
│   │
│   └── entrypoint.ts     # Alpine store for the card browser
│
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## Commit messages

Commits must use a conventional prefix, `.githooks/` rejects anything else.

Allowed types: `feat`, `fix`, `hotfix`, `refactor`, `style`, `chore`, `cleanup`, `perf`, `test`, `docs`, `content`

## Content

All page content lives in `src/content/` as [TOON](https://toonformat.dev) files, a compact, human-readable format. Each page file follows a consistent three-section structure:

```
meta:
  title: Page Title
  description: Page-specific meta description.
  og_image: /og-page.png

options:
  noindex: true   # omit or set null to allow indexing

content:
  heading: Welcome
  tagline: A minimal starting point.
```

### Global content

`src/content/global.toon` holds site-wide values used across all pages — site name, default description, default OG image, and the title postfix appended to every page title:

```
name: Site Name
tagline: Short site tagline.
description: Default meta description.
url: https://example.com
title_postfix: " — Site Name"
og_image: /og-default.png
```

### Cards

`src/content/cards.toon` holds the card set. Each card is one row of four strings, question and answer in both languages:

```
name: Set 1
subject: Italian phrases

labels:
  en: English
  it: Italian

settings:
  cream_print: false   # print on the cream paper colour instead of white
  cut_guides: true     # dashed cut lines on the print sheets

cards[25]{q_en,q_it,a_en,a_it}:
  "{1How}'s it {2going}?","{1Come} {2va}?","{1Pretty} {2good}, {3thanks}!","{1Abbastanza} {2bene}, {3grazie}!"
```

Wrap a word or phrase in `{n…}` to link it to the same number in the other language. Each number gets one of `--match-1` to `--match-5`. The Word matching switch under the card turns the colours on, they are off by default. Parsed by `segment()` in `src/lib/cards.ts`, rendered by `Card.astro`. Each card is shown as a pair, the phrase over the response with Italian first, via `CardPair.astro`. Load the set with `loadData<CardSet>('cards')`.

### Browse and print

State for the card browser lives in an Alpine store registered in `src/entrypoint.ts`: the current view (`browse` or `sheets`), the current card index and the word matching flag (both persisted to `localStorage`), and `print()`, which switches to the sheets view and then calls `window.print()`. Anything marked `data-noprint` is hidden when printing, and `@page` is set to US Letter with no margin so each `Sheet.astro` fills one page exactly.

### Adding a content file for a new page

Create `src/content/my-page.toon`, then load it in the corresponding `.astro` file:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { loadPage } from '../lib/content';

const { meta, options, content } = loadPage('my-page');
const c = content as { heading: string; body: string };
---

<BaseLayout
  title={meta.title ?? undefined}
  description={meta.description}
  noindex={options?.noindex ?? false}
>
  <h1>{c.heading}</h1>
  <p>{c.body}</p>
</BaseLayout>
```

`loadGlobal()` is available for components that need site-wide values (name, URL, etc.).

## Configuration

### Site metadata

Edit `src/content/global.toon` to set the site name, description, URL, and title postfix before deploying.

### Production domain

Set `site` in `astro.config.mjs` to your production URL. This is required for correct canonical URLs and sitemap generation:

```js
export default defineConfig({
  site: 'https://foo.com',
  // ...
});
```

Also update the `Sitemap:` entry in `public/robots.txt` to match.

### Local development server

Configured in `astro.config.mjs`:

```js
server: {
  port: 14780,
},
```

## Adding pages

Create a new `.astro` file in `src/pages/`. Pass `title` and `description` to `BaseLayout`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Page Title" description="Page description for search engines.">
  <section>
    <div class="container">
      <h1>Page Title</h1>
    </div>
  </section>
</BaseLayout>
```

The `title` prop renders as `Page Title - Site Name` in `<title>`. Omit it on the home page to render just the site name.

### Header slots

The header renders the site name, then two named slots any page can fill through `BaseLayout`:

```astro
<BaseLayout>
  <Fragment slot="header-meta">
    <span>Italian phrases</span>
  </Fragment>
  <Fragment slot="header-tools">
    <button class="btn btn-primary">Print</button>
  </Fragment>
</BaseLayout>
```

`header-meta` sits beside the wordmark, `header-tools` is pushed to the right. `src/components/Nav.astro` is left over from the starter and is not rendered.

### SEO

All props are optional and fall back to values in `src/content/global.toon`:

```astro
<BaseLayout
  title="Page Title"
  description="Page-specific description."
  ogImage="/og-custom.png"
  noindex={false}
>
```

Set `noindex={true}` on pages that should not be indexed (e.g. thank-you pages).

### JSON-LD

Pass a structured data object to `BaseLayout` via the `jsonLD` prop:

```astro
---
const jsonLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Page Title',
  url: 'https://foo.com/page',
};
---

<BaseLayout title="Page Title" jsonLD={jsonLD}>
```

Only pass developer-controlled data — never raw user input.

### Sitemap

Generated automatically at build time by `@astrojs/sitemap`. The output file is `dist/sitemap-index.xml`. It will 404 in dev, this is expected.

### Fonts

Fonts are self hosted in `public/fonts/` as variable weight `.woff2`, declared in `src/styles/global.scss` and exposed as `--font-serif` (Source Serif 4, page chrome) and `--font-sans` (IBM Plex Sans, card faces) in `src/styles/variables.css`. Only the latin and latin-ext subsets ship, plus one cyrillic subset of Plex Sans for the numero sign on card numbers.

To add a font:

1. Put the `.woff2` in `public/fonts/`
2. Add an `@font-face` in `src/styles/global.scss`
3. Reference it from a font variable in `src/styles/variables.css`

```css
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2') format('woff2');
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}
```

### Backdrop

`src/lib/backdrops.ts` lists the background images by name. An inline script in `BaseLayout.astro` picks one per visit before first paint, sets `--bg-image` and `data-backdrop` on `<html>`, and reapplies them after each client-side navigation. The `.backdrop` element in `global.scss` is fixed behind the page: the image is centred at a share of the viewport set by `--backdrop-scale` and capped by `--backdrop-max` (80% and native size by default, the pergola overrides both to sit larger), and masked so all four edges dissolve into a fill chosen by `data-backdrop`. The pergola fades into parchment all around, the arch fades into `--persian` at the sides and bottom and parchment at the top centre. Below the large breakpoint the image goes back to a full bleed cover.

## Utilities and Conventions

### Heading utility classes

Apply heading visual styles to any element without changing its semantic role:

```html
<p class="h2">Visually an h2, semantically a paragraph</p>
<span class="h4">Visually an h4</span>
```

`.h1` through `.h6` mirror the corresponding heading sizes and weights from the type scale.

#### `.markdown`

Apply to any wrapper containing rendered markdown or long-form content. Handles headings, paragraphs, lists (with custom bullet dots), blockquotes, tables, inline code, and code blocks — all styled with the site's design tokens.

```html
<div class="markdown">
  <h2>Section</h2>
  <p>Body copy with <code>inline code</code>.</p>
  <ul>
    <li>Custom bullet dot</li>
    <li>Nested list gets a hollow ring bullet</li>
  </ul>
  <blockquote>Callout text</blockquote>
</div>
```

Pair with a `max-width` constraint for comfortable line lengths:

```css
.markdown { max-width: 68ch; }
```

#### `[data-tooltip]`

Pure CSS tooltip. Add a `data-tooltip` attribute to any element:

```html
<button data-tooltip="Helpful hint">Hover me</button>
<abbr data-tooltip="HyperText Markup Language">HTML</abbr>
```

The tooltip appears below the element on hover. Styled with `--persian` and `--parchment`.

#### `.video-wrapper`

Responsive 16:9 container for `<iframe>` or `<video>` embeds:

```html
<div class="video-wrapper">
  <iframe src="https://www.youtube.com/embed/…" allowfullscreen></iframe>
</div>
```

#### `.magnify-onhover`

Subtle `scale(1.05)` on hover with directional easing (ease-in on enter, ease-out on leave):

```html
<a href="/page" class="btn btn-primary magnify-onhover">Get started</a>
```

### Body state classes

Toggle classes on `<body>` to control page-level state:

```js
document.body.classList.add('no-scroll')   // disable scroll (e.g. while a modal is open)
document.body.classList.add('no-cursor')   // hide cursor (e.g. custom cursor implementations)
```

### Breakpoints

Breakpoints are mixins defined in `src/styles/_breakpoints.scss`:

| Mixin     | Max width         |
|-----------|-------------------|
| `tiny`    | 20rem (320px)     |
| `small`   | 30rem (480px)     |
| `medium`  | 40rem (640px)     |
| `large`   | 48rem (768px)     |
| `xl`      | 64rem (1024px)    |
| `xxl`     | 80rem (1280px)    |
| `xxxl`    | 96rem (1536px)    |


Usage is as follows:
```scss
@use '../styles/breakpoints' as *;

.my-component {
  display: flex;

  @include large {
    display: block;
  }
}
```

### Cross-browser compatibility

`src/styles/x-browser.css` (imported automatically via `global.scss`) handles browser-specific quirks:

- **Firefox** — removes inner button focus ring; fixes `select` focus ring rendering
- **WebKit/Blink** — styles file upload button; suppresses number input spinners; removes search field decorations
- **All browsers** — cross-browser `::placeholder` colour (each vendor prefix as its own rule)
- **iOS Safari** — prevents font-size inflation after orientation change (`text-size-adjust`)
- **Touch devices** — removes tap highlight flash on links, buttons and labels (`-webkit-tap-highlight-color`)

Number input spinners are suppressed globally. Re-enable them on a per-element basis if needed:

```css
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: auto;
}
input[type='number'] {
  -moz-appearance: auto;
}
```

### Security headers

Production headers are configured in `public/_headers` (Cloudflare Pages format). The Content Security Policy includes `unsafe-eval` required by Alpine.js v3. Tighten `img-src` and `connect-src` as needed for your CDN or API domains.

Dev server headers are set in the `vite.server.headers` block in `astro.config.mjs`.


## Deployment

Assuming a static site host like Cloudflare Pages, Github Pages, Netlify, etc.

- Build command: `bun run build`
- Set output directory: `dist`
- Ensure Node version is set to **24** or higher in environment settings
- Add any environment variables (none by default)
