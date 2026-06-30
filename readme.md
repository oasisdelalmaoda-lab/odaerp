# Oda — Oasis del Alma · Design System

> **Bienestar en cada respiro.** (*Wellness in every breath.*)

Oda is the design system for **Oasis del Alma**, a Colombian aromatherapy & wellness
brand selling essential oils, roll-ons, nasal inhalers, brumas (linen sprays),
massage candles, diffusers and gift kits — organised around how you want to *feel*:
**Calma, Respira, Despierta, Descansa, Alivio, Pasión.**

The aesthetic is warm, earthy and calm: golden-brown brand color, cream/sand
surfaces, an elegant high-contrast serif paired with a quiet humanist sans, soft
rounding, and gentle warm-tinted shadows. It should feel like a spa, not a pharmacy.

- **Live store:** https://www.oasisdelalma.co (Shopify)
- **Market:** Colombia · prices in COP (`$100.000`) · Spanish (voseo/tuteo "tú")
- **Instagram / WhatsApp:** @oasisdelalma · +57 313 406 3259

## Sources used to build this system
- `uploads/Cod-RGB_OdA.png` — official brand color palette (brand + 12 scent tones).
- `uploads/Variaciones logo OdA_CONTORNOS-0{1–6}.png` — logo wordmark + isotype, brown / black / white.
- `uploads/Oasis_Informe_Optimizacion_2026-06-12.docx` — a Meta Ads report; used only for
  **product context** (product lines: Kit Inhala, Kits Generales, Catálogo).
- **oasisdelalma.co** — fetched for product names, prices, categories, copy and live imagery.

> ⚠️ **Not accessible at build time:** `ODA BRANDBOOK.pdf` and the `.ai` vector logo
> sources were referenced but were **not present in the upload set**. The brand's exact
> typefaces almost certainly live there — see *Typography → font substitution* below.

---

## CONTENT FUNDAMENTALS — voice & copy

**Language:** Colombian Spanish, informal **"tú"** ("Gana un 10% en *tu* primera compra",
"¿Qué necesita *tu* alma hoy?"). Warm, caring, close — like a knowledgeable friend.

**Tone:** calm, reassuring, sensorial, benefit-led. Copy sells *feelings and rituals*,
not chemistry. Lead with the outcome ("Calma la ansiedad", "Respira libre", "Descansa mejor").

**Casing:** Sentence case for body and most headings. Letterspaced **UPPERCASE** reserved
for eyebrows, nav and scent labels ("AROMATERAPIA · BIENESTAR"). The wordmark is **OdA**
(capital O, lowercase d, capital A).

**Question hooks:** the storefront speaks to a need as a question —
*"¿Tienes estrés?" · "¿No puedes dormir?" · "¿Te falta energía?" · "¿Problemas respiratorios?"*
Use these to organise mood-based shopping.

**Numbers / money:** COP with period thousands and no decimals — `$29.900`, `$150.000`.
Sale shows the struck regular price beside a `-NN%` flag. Free-shipping threshold `$150.000`.

**Emoji:** sparingly, and mostly in *brand-voice utility* lines (announcement bar:
🎁 ✍️ ⚡) and in *customer testimonials* (😍 🤗). **Do not** decorate headings or body
copy with emoji — keep editorial surfaces clean. Trust marks use a small ✦ separator.

**Recurring phrases:** "Bienestar en cada respiro", "Aceites esenciales 100% puros",
"Ingredientes naturales", "Cruelty free · No testeado en animales", "Hecho en Colombia",
"Comprador verificado", "Envío gratis", "Entregas el mismo día".

---

## VISUAL FOUNDATIONS

**Color.** A single warm brand hue — **golden-brown `#A78659`** (`--brand-primary`) — over
**cream/sand** surfaces (`#F7F2E9` page, `#FBF8F2` ivory cards, white tiles). Deep warm
brown `#5A4A33` / near-black `#3A3326` for text and the dark footer. A **12-tone scent
palette** (Calma teal, Respira sage, Descansa slate-blue, Despierta sand, Lavanda, Menta,
Eucalipto, etc.) is used as *accents only* — a dot on a pill, a wash behind a mood tile —
never as large fills. One functional accent: **terracotta `#B5503C`** for sale/discount.
*(Note: the brand sheet mislabels Lavanda's hex; the correct value `#9C97A2` is used.)*

**Type.** Display = **Cormorant Garamond** (elegant high-contrast serif — headings, hero,
prices on PDP, scent names in small-caps). Body/UI = **Mulish** (warm humanist sans —
paragraphs, nav, buttons, prices on cards). Eyebrows & scent labels are letterspaced caps
(`0.22em`). Headings use `text-wrap: balance`; body uses `text-wrap: pretty`.

**Backgrounds.** Mostly flat cream/sand — *no* gradients on UI surfaces. Photography is the
hero: warm, natural, lifestyle product shots, frequently full-bleed with a left-to-dark
**protection gradient** (`rgba(58,51,38,…)`) so white text reads. Alternating sections swap
between `--surface-page` (cream) and `--surface-linen` for rhythm. The one bold fill is the
gold-brown trust **marquee**.

**Spacing & layout.** 4px base grid; generous, airy section padding (`--space-9` ≈ 96px).
Centered `1240px` max container with a fluid gutter. Product/mood/category grids are 4-up.
Sticky header; sticky gallery on the product page.

**Radius.** Soft and organic: cards `--radius-lg` (18px), images `--radius-xl` (28px) on PDP,
buttons & pills fully rounded (`999px`). Nothing sharp-cornered.

**Shadows.** Warm-tinted and diffuse — built from brown alpha, **never** hard black.
`--shadow-sm/md` for cards on hover; `--shadow-lg` for drawers/modals. Resting cards are
flat with a `1px` `--border-subtle` hairline and lift on hover.

**Cards.** White surface, 1px warm hairline border, 18px radius, no resting shadow; on hover
they translate up `4px` and gain `--shadow-md`. Product image sits on a sand tile.

**Borders.** 1px hairlines in `--border-subtle` (warm stone `#E4DBCC`); stronger `--border-strong`
(clay) for inputs and qty steppers.

**Motion.** Calm and soft. `--ease-soft` / `--ease-out`, `140–420ms`. Buttons press to
`scale(0.97)`; cards rise on hover; images zoom `1.05–1.06` inside their frame; drawer slides
with `--ease-out`; announcement bar cross-fades. No bounces, no infinite spinners. The only
continuous motion is the slow trust marquee. Respect `prefers-reduced-motion`.

**Hover / press.** Hover = subtle: sand wash on ghost controls, brand-hover darken on primary
buttons (`#8A6F49`), soft shadow appears, image zoom. Press = `scale` down. Focus = `--shadow-focus`
gold ring.

**Transparency / blur.** Used lightly — overlay scrims behind drawers/search
(`rgba(58,51,38,0.4)`) and photo protection gradients. No glassmorphism.

---

## ICONOGRAPHY

The brand uses **no proprietary icon font**. Across the live site icons are light line
glyphs (search, account, bag) plus emoji in promo/testimonial copy. For this system we
standardise on **[Lucide](https://lucide.dev)** (loaded from CDN) — a clean ~1.75–2px stroke
line set that matches the airy, minimal feel. Use `<i data-lucide="name"></i>` then
`lucide.createIcons()`.

- **Common glyphs:** `search`, `user`, `heart`, `shopping-bag`, `x`, `plus`, `minus`,
  `arrow-right`, `leaf`, `map-pin`, `message-circle` (WhatsApp).
- **Social:** Lucide's "latest" UMD dropped the `instagram`/`facebook` brand marks — the kit
  substitutes `camera` / `thumbs-up`. ⚠️ **Flagged:** swap in real Instagram/Facebook/WhatsApp
  brand SVGs for production.
- **Scent identity** is carried by **color dots**, not icons — a filled circle in the scent's
  palette color (see `ScentTag`).
- **Emoji** appear only in utility/announcement and testimonial text, never as section icons.
- **Logo assets** are PNG with transparent backgrounds in `assets/` (brown / black / white,
  wordmark + isotype). No hand-drawn SVG recreations — always use the supplied files.

---

## INDEX — what's in this system

**Root**
- `styles.css` — the single entry point consumers link (import manifest only).
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`.
- `assets/` — logos (`logo-wordmark-{brown,black,white}.png`, `logo-mark-{brown,black,white}.png`)
  and `brand-palette.png`.
- `SKILL.md` — Agent-Skill wrapper for use in Claude Code.

**Components** (`components/` → `window.OdaOasisDelAlmaDesignSystem_35d6ca`)
- `core/` — `Button`, `Badge`, `ScentTag`, `Input`, `Rating`, `IconButton`
- `commerce/` — `ProductCard`
- Each has `.jsx` + `.d.ts` + `.prompt.md`; one `@dsCard` HTML per group.

**Guidelines** (`guidelines/` — foundation specimen cards for the Design System tab)
- Colors: brand scale · neutrals · scent palette · functional
- Type: display · body · eyebrows/labels · scale
- Spacing: scale · radii · shadows
- Brand: wordmark · isotype + dark lockup

**UI kit** (`ui_kits/website/`) — interactive Shopify-style storefront recreation
- `index.html` — **Homepage** (hero, mood grid, product rails, categories, trust marquee,
  testimonials, newsletter, cart drawer, search overlay). Starting point.
- `product.html` — **Product detail** (gallery, scent selector, qty, accordions, related).
  Starting point.
- `data.js`, `components.jsx`, `chrome.jsx`, `sections.jsx`, `product.jsx` — well-factored
  source; the kit is self-contained (mirrors the DS primitives so it runs without the bundle).

---

## Using the components

```jsx
const { Button, ProductCard, ScentTag } = window.OdaOasisDelAlmaDesignSystem_35d6ca;

<ProductCard title="Kit Inhala" image={img} price={100000} compareAt={128700}
  scents={['calma','respira','despierta']} rating={5} reviews={42} onAdd={addToCart} />
```

Always `<link rel="stylesheet" href="…/styles.css">` and load `…/_ds_bundle.js` before mounting.
