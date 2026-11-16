# UI Upgrade Plan — aditiaamarnath-rgb.github.io

Implementation instructions for Claude in the IDE. Goal: raise visual quality while keeping the crafty, paper-and-stickers feel. All changes are small, and they are independent of each other. Do them in the order below, and check each one in `npm run dev` before starting the next.

**Out of scope:** placeholder content (the film-strip "your photo here" frames, the empty Hobbies card, missing activity descriptions). Aditi will replace those herself. Don't touch them.

---

## Global rules (apply to every task)

1. **Reduced motion is mandatory.** Every new animation or transition must be disabled, or reduced to an instant state change, under `@media (prefers-reduced-motion: reduce)`. In JS, check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, following the existing pattern in `src/components/FoldText.jsx` and `SmoothMascot.tsx`. Under reduced motion, end states must still render: underlines fully drawn, tape stuck down, and so on.
2. **Animate only `transform` and `opacity`** (and `stroke-dashoffset` for the SVG underline). Don't animate `top`/`left`/`width`/`box-shadow` in loops. For a deeper shadow on hover, change `filter: drop-shadow(...)` in a single transition, which is fine.
3. **Match the existing easing vocabulary:** springy `cubic-bezier(0.34, 1.56, 0.64, 1)` for playful pops, and `cubic-bezier(0.2, 0.8, 0.24, 1)` for settling motions. Durations are 160–520 ms. Nothing should feel slow.
4. **Where styles live:** most component CSS is in the big template-literal `<style>` block inside `src/personalwebsite.jsx`. Global and hero styles are in `src/index.css`, and the sketchbook styles are in `src/components/SketchbookSection.css`. Put new styles next to the related existing rules.
5. **Keyboard parity:** anything with a `:hover` effect gets the same effect on `:focus-visible`.
6. **No new dependencies.** `framer-motion` and `gsap` are already installed, but plain CSS plus a small `IntersectionObserver` hook is enough for all of this.
7. **Verify on both viewports:** 1440×900 and 390×844 (mobile). Nothing may overlap the hero text or the "let's connect" button.

### Shared helper: `useInView` hook

Several tasks need "do X once when this element scrolls into view". Create `src/hooks/useInView.js`:

```js
import { useEffect, useRef, useState } from "react";

export default function useInView({ threshold = 0.35, rootMargin = "0px 0px -10% 0px", once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { setInView(true); return; }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) obs.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { threshold, rootMargin });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, once]);
  return [ref, inView];
}
```

---

## 1. Hero stickers: peel-up on hover

**Where:** `HeroStickers()` in `personalwebsite.jsx` (around line 150). Each sticker is a `<button className="about-draggable-sticker ...">` containing an `<img>`. The styles are the `.about-draggable-sticker` rules (around lines 1025–1100), and hero positioning is `.hero-sticker-layer .about-draggable-sticker` in `index.css`.

**Constraint:** the button's own `transform` is `translate(-50%, -50%) rotate(var(--sticker-rotate))`, and the stickers are draggable. **Don't change the button's transform**, or positioning and drag will break. Animate the inner `<img>` instead.

**Do:**
- Scope to the hero only: `.hero-sticker-layer .about-draggable-sticker img`.
- Resting state: `transition: transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 200ms ease; transform-origin: 50% 85%;`
- On `:hover` and `:focus-visible` (but **not** `.is-dragging`), apply `transform: translateY(-6px) rotate(var(--peel-tilt, -4deg)) scale(1.04);`.
- Vary the wobble direction per sticker. In the `hobbyStickers` map, add a CSS variable to the button's `style`: `"--peel-tilt": index % 2 ? "4deg" : "-4deg"` (use the map index). Keep it within ±3–5°.
- Deepen the shadow on hover to look like the sticker lifting off the page. The current img filters are, for photo stickers, `var(--white-sticker-border) drop-shadow(3px 5px 0 rgba(43,36,32,0.24))`, and for `.handdrawn-sticker`, `url(#hero-sticker-cut-edge) drop-shadow(1px 3px 2px rgba(43,36,32,0.18))`. On hover, keep the border part and swap the final drop-shadow for a larger, softer one, e.g. `drop-shadow(4px 12px 8px rgba(43,36,32,0.22))`. Write the hover filter separately for each of the two sticker types so the white cut edge isn't lost.
- Note the existing rule `.about-draggable-sticker.handdrawn-sticker:hover { filter: none; }`, which applies to the **button**. Leave it; your new rule targets the **img**.
- While dragging (`.is-dragging img`), use a slightly bigger lift (`scale(1.06)`) with `transition: none`, so the sticker feels picked up.
- Reduced motion: no transform change; keep only the shadow change.

**Acceptance:** hovering a hero sticker makes it lift and tilt slightly with a springy settle, and it returns smoothly on mouse-out. Dragging still works exactly as before. The About-section stickers are unchanged.

---

## 2. Washi tape on the About cards

**Where:** `AboutStack()` (around line 422) wraps each card in `<div className="about-stack-shell">`, containing a `<PaperCrumple>` (a three.js canvas, draggable and crumplable) and `<div className="about-note-text">`. `AboutSection()` renders three of them: Education (tilt -2), Hobbies (tilt 3) and Activities (other).

**Do:**
- Inside `AboutStack`, add a decorative element as the last child of `.about-stack-shell`: `<span className="about-washi" aria-hidden="true" />`.
- Use `useInView` on the `.about-stack-shell` div, and add the class `is-stuck` to the shell once it's in view.
- Track the paper state. `PaperCrumple` accepts an `onStateChange` prop that publishes `'flat'`, `'holding'`, or a crumpled state. Keep `const [paperState, setPaperState] = useState('flat')`, pass `onStateChange={setPaperState}`, and add `is-lifted` to the shell when `paperState !== 'flat'`, so the tape fades out while the card is being crumpled or dragged and the tape doesn't float in mid-air.
- Give each card its own tape color and angle via CSS variables on the shell `style`:
  - Education: `--tape-color: rgba(185,125,123,0.55)` (rose), `--tape-rotate: -6deg`, `--tape-x: 38%`
  - Hobbies: `--tape-color: rgba(158,167,107,0.55)` (olive), `--tape-rotate: 4deg`, `--tape-x: 50%`
  - Activities: `--tape-color: rgba(128,155,165,0.55)` (petrol), `--tape-rotate: -3deg`, `--tape-x: 60%`
- Tape CSS (put it near the existing `.about-stack-shell` rules around line 2260):

```css
.about-washi {
  position: absolute;
  top: -14px;               /* adjust so it overlaps the paper's top edge — check visually */
  left: var(--tape-x, 50%);
  width: 118px;
  height: 30px;
  z-index: 40;
  pointer-events: none;
  background:
    repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 6px, transparent 6px 12px),
    var(--tape-color);
  /* torn short ends */
  clip-path: polygon(3% 0, 97% 4%, 100% 22%, 96% 45%, 100% 70%, 97% 100%, 2% 96%, 0 74%, 4% 50%, 0 26%);
  mix-blend-mode: multiply;
  opacity: 0;
  transform: translate(-50%, -18px) rotate(var(--tape-rotate)) scale(1.08, 0.9);
  transform-origin: 50% 100%;
}
.about-stack-shell.is-stuck .about-washi {
  animation: washi-stick 420ms cubic-bezier(0.2, 0.8, 0.24, 1) var(--tape-delay, 0ms) both;
}
.about-stack-shell.is-lifted .about-washi {
  opacity: 0 !important;
  transition: opacity 120ms linear;
}
@keyframes washi-stick {
  0%   { opacity: 0; transform: translate(-50%, -18px) rotate(var(--tape-rotate)) scale(1.08, 0.9); }
  60%  { opacity: 1; transform: translate(-50%, 1px)  rotate(var(--tape-rotate)) scale(1.03, 0.94); }  /* squash */
  100% { opacity: 1; transform: translate(-50%, 0)    rotate(var(--tape-rotate)) scale(1, 1); }
}
@media (prefers-reduced-motion: reduce) {
  .about-stack-shell.is-stuck .about-washi { animation: none; opacity: 1; transform: translate(-50%, 0) rotate(var(--tape-rotate)); }
}
```

- Stagger the three cards with `--tape-delay`: 0 ms, 120 ms, 240 ms.
- The existing paper-unfurl animation on these cards (`about-paper-mask-unfurl`, which uses `--about-delay`) should finish before the tape lands. If it doesn't, add the card's `--about-delay` to the tape delay.
- Confirm the tape sits over the visible top edge of the paper, not over the canvas's empty margin. `PaperCrumple` uses `sceneHeight={640}` for a 520 px paper, so measure where the paper actually starts and set `top` accordingly. It may need to be ~50–60 px rather than -14 px.
- Mobile: `#aboutme .about-stack-shell { transform: none !important; }` already exists at ≤700 px. Make sure the tape still sits correctly there.

**Acceptance:** scrolling to About makes three tape strips drop onto the cards one after another with a tiny squash. Crumpling or dragging a card hides its tape, and it comes back when the paper flattens.

---

## 3. Sticky nav that shrinks after the hero

**Where:** `NavBar()` (around line 90) renders `<nav className="letter-nav">` inside `HeroSection`. Nav styles are in `index.css` (`.letter-nav` around line 80, `.letter-nav a` around line 89, using the `Press Start 2P` pixel font). The section ids are `home`, `aboutme`, `experience`, `projects`, `contactme`.

**Approach:** keep the big hero nav exactly as is. Add a second, compact nav (`CompactNav`) that's fixed to the top and appears once the hero nav scrolls out of view.

**Do:**
1. Put a ref on the hero `<nav>`. In `App` (or a small wrapper), observe it with `IntersectionObserver` (threshold 0). When it's **not** intersecting, set `showCompact = true`.
2. Track the active section: observe all five `<section>`s with `IntersectionObserver({ rootMargin: "-45% 0px -50% 0px" })`, a thin band in the middle of the viewport. The intersecting section becomes `activeId`.
3. Render `<CompactNav visible={showCompact} activeId={activeId} />` as a sibling at the top of the app root:

```jsx
<nav className={`compact-nav ${visible ? "is-visible" : ""}`} aria-label="Section navigation" aria-hidden={!visible}>
  {LINKS.map(([label, id]) => (
    <a key={id} href={`#${id}`} tabIndex={visible ? 0 : -1}
       aria-current={activeId === id ? "location" : undefined}
       className={activeId === id ? "is-pressed" : ""}>{label}</a>
  ))}
</nav>
```

Pull `LINKS` out of `NavBar` into a shared constant so both navs use it.

4. Styles in `index.css`. Reuse the `.letter-nav a` pixel-button look at a smaller scale:
   - `.compact-nav`: `position: fixed; top: 10px; left: 50%; z-index: 100; display: flex; gap: 8px; padding: 6px 8px;`, with a cream paper strip behind it (`background: rgba(244,240,231,0.92)`, the paper-grain texture `url('./assets/paper-grain.svg')`, `backdrop-filter: blur(6px)`, `border-radius: 6px`, and a subtle `box-shadow: 0 6px 18px rgba(43,36,32,0.12)`).
   - Hidden state: `opacity: 0; transform: translate(-50%, -140%); pointer-events: none;`. Visible: `opacity: 1; transform: translate(-50%, 0); pointer-events: auto;`. Transition `transform 320ms cubic-bezier(0.34,1.56,0.64,1), opacity 180ms ease`.
   - Links: the same font and colors as `.letter-nav a`, but with `font-size: 8px` and roughly half the padding.
   - **Pressed state** (`.is-pressed`, `[aria-current]`): the button looks pushed in. Remove or shrink its offset pixel shadow and shift it `translate(2px, 2px)`, using the same visual language as the hero buttons' existing `:active` state if one exists (check the `transition: transform 120ms steps(2, end)` rule around line 126 of `index.css` and mirror it). Darken the fill slightly.
5. Smooth scrolling: add `html { scroll-behavior: smooth; }` inside `@media (prefers-reduced-motion: no-preference)`. Add `scroll-margin-top: 64px` to each section id so headings aren't hidden under the fixed nav.
6. Mobile (≤700 px): the compact nav must fit on one row at 390 px wide. Use `font-size: 7px`, tighter padding, and `gap: 4px`. If it still doesn't fit, shorten the labels in the compact nav only (e.g. "exp", "work").
7. Reduced motion: no slide; just toggle opacity.

**Acceptance:** after scrolling past the hero, a slim pixel-button nav slides down from the top. The current section's button looks pressed in and updates while scrolling. Clicking a button scrolls smoothly to that section with its heading visible. The bar is gone again when back at the top.

---

## 4. Hand-drawn underlines that draw on scroll

**Where:** `SectionHeading()` (around line 75), used by "about me", "experiences", "projects" and "contact information". The heading class is `.page-heading` (`index.css` around line 166, Cormorant Garamond).

**Do:**
- Change `SectionHeading` so that it:
  - uses `useInView({ threshold: 0.6 })` on the wrapper `<div>`;
  - wraps the `<h2>` content in `<span className="heading-underline-wrap">` (`position: relative; display: inline-block;`);
  - renders, after the text inside that span, an SVG marker stroke:

```jsx
<svg className={`heading-underline ${inView ? "is-drawn" : ""}`} viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
  <path d="M4 15 C 40 9, 80 18, 120 13 S 200 8, 240 14 S 285 16, 296 11" pathLength="1" />
</svg>
```

- CSS:

```css
.heading-underline {
  position: absolute;
  left: -2%;
  bottom: -0.18em;
  width: 104%;
  height: 0.32em;
  overflow: visible;
  pointer-events: none;
}
.heading-underline path {
  fill: none;
  stroke: var(--underline-color, #b97d7b);
  stroke-width: 7;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.55;            /* marker, not ink */
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  vector-effect: non-scaling-stroke;
}
.heading-underline.is-drawn path {
  transition: stroke-dashoffset 700ms cubic-bezier(0.65, 0, 0.35, 1) 120ms;
  stroke-dashoffset: 0;
}
@media (prefers-reduced-motion: reduce) {
  .heading-underline path { stroke-dashoffset: 0; transition: none; }
}
```

- Give each section's underline its own site color via a `underlineColor` prop that sets `--underline-color`: about → rose `#b97d7b`, experiences → olive `#9ea76b`, projects → petrol `#809ba5`, contact → soft pink `#caaeb5`.
- Make the path look hand-drawn, not perfectly smooth. A slight overshoot past the end is good. Optionally add a second, thinner path offset by a few px for a double-stroke marker look.
- The underline must sit **behind** the descenders: put `z-index: -1` on the SVG and `isolation: isolate` on the wrap, so letters like the "p" in "experiences" and "projects" stay crisp on top of the stroke.
- Don't add this to the hero h1 ("hello, I'm Aditi."), which already has the FoldText animation, or to the sketchbook heading.

**Acceptance:** each section heading gets a colored marker stroke that draws left to right once, when the heading scrolls into view. Text stays fully legible over it, and under reduced motion the line is simply there.

---

## 5. Project folder tabs that peek on hover

**Where:** `ProjectsSection()` (around line 590). The folder artwork is a stack of `<img className="project-folder-layer project-folder-layer-{blue|beige|pink|green}">` built from `folderLayers` (around lines 595–598). Each layer has a `projectIndex`. The clickable labels are `<button className="project-folder-label ...">` built from `folderLabels`. The tab shapes are **part of the layer images**, so the label button alone can't move the tab.

**Do:**
- Add `const [peekIndex, setPeekIndex] = useState(null);`.
- On each label button: `onMouseEnter={() => setPeekIndex(projectIndex)}`, `onMouseLeave={() => setPeekIndex(null)}`, `onFocus` / `onBlur` doing the same.
- On the layer `<img>` whose `layer.projectIndex === peekIndex`, and on the matching label, add the class `is-peeking`. Skip this when it's the already-active project (`active === projectIndex`), since that folder is already open.
- CSS:

```css
.project-folder-layer,
.project-folder-label {
  transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 220ms ease;
}
.project-folder-layer.is-peeking,
.project-folder-label.is-peeking {
  transform: translateY(-6px);
}
.project-folder-layer.is-peeking {
  filter: drop-shadow(0 -2px 3px rgba(43,36,32,0.12)) brightness(1.03);
}
@media (prefers-reduced-motion: reduce) {
  .project-folder-layer.is-peeking,
  .project-folder-label.is-peeking { transform: none; }
}
```

- Check whether the layers or labels already have a `transform` (including in the mobile overrides around line 2659). If they do, compose with it (e.g. use the individual `translate:` property instead of `transform`) so the existing positioning isn't overwritten.
- The whole folder layer moves, not just the tab. 6 px is subtle enough that this reads as "pulling the folder up". If it looks wrong because the layer's body shifts visibly behind the paper, reduce it to 4 px.

**Acceptance:** hovering or tabbing to "Wavelength", "Tech and Humanity" etc. makes that folder rise slightly, as if being pulled out. The active folder doesn't move, and clicking still switches projects.

---

## 6. "Click here for link" becomes a handwritten arrow that wiggles

**Where:** the `PROJECTS` array (around lines 583–586) has `noteCaption` values: "click here for link^", "final presentation day!!", "click to visit:", "click below for link :)". The caption is rendered by `projectNoteCaption` (around line 607) as `<span className="project-grid-note-caption">` in Caveat. The note is an `<a className="project-grid-note ... project-grid-note-link">` when `projectUrl` exists.

**Do:**
- Only for projects **with** a `projectUrl` (Bluprint, Tech and Humanity, Wavelength): replace the caption text with a short phrase plus an inline hand-drawn arrow SVG.
  - Normalize the copy to one consistent phrase: **"see it live"** (or "try it out"). Remove the trailing "^", ":", ":)" punctuation hacks.
  - Change `projectNoteCaption` to render:

```jsx
<span className="project-grid-note-caption has-arrow">
  <span>{p.noteCaption}</span>
  <svg className="caption-arrow" viewBox="0 0 48 32" aria-hidden="true">
    <path d="M3 24 C 14 26, 26 22, 36 10" />
    <path d="M28 9 L 37 9 L 38 18" />
  </svg>
</span>
```

  - The arrow should point **toward the preview image**. For `noteCaptionPosition: "top"` (Wavelength) it points down, so flip it with `transform: scaleY(-1)` or a separate path. For bottom captions it points up toward the image.
- CSS:

```css
.project-grid-note-caption.has-arrow { display: inline-flex; align-items: center; gap: 6px; justify-content: center; }
.caption-arrow { width: 34px; height: 24px; overflow: visible; }
.caption-arrow path { fill: none; stroke: #2B2420; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.project-grid-note-link:hover .caption-arrow,
.project-grid-note-link:focus-visible .caption-arrow {
  animation: arrow-wiggle 600ms cubic-bezier(0.34, 1.56, 0.64, 1) infinite alternate;
}
@keyframes arrow-wiggle {
  from { transform: translate(0, 0) rotate(0deg); }
  to   { transform: translate(3px, -3px) rotate(-8deg); }
}
@media (prefers-reduced-motion: reduce) {
  .project-grid-note-link:hover .caption-arrow { animation: none; }
}
```

- Also give the whole note link a small hover lift (`translateY(-3px)` plus a slightly bigger shadow), composed with its existing `--grid-note-rotate` rotation. Check the existing `.project-grid-note-link:hover` rule (around line 1768) and extend it rather than duplicating it.
- Add the cursor and an `↗` hint: in the existing `aria-label`, change it to `Open ${p.title} live site (opens in new tab)`.
- Leave Databridge's caption ("final presentation day!!") as plain text with no arrow, since it isn't a link.

**Acceptance:** linked project notes show "see it live" with a little hand-drawn arrow. Hovering the note makes the arrow wiggle and the note lift. It's obvious that the note is clickable.

---

## 7. Torn-paper edge into the sketchbook section

**Where:** `SketchbookSection` (`src/components/SketchbookSection.jsx`), with styles in `src/components/SketchbookSection.css`. `.portfolio-sketchbook` has `background: #212121; padding: 80px 0 30px;`. It sits directly after `ContactSection` (cream `#f4f0e7`) in `App`.

**Do:**
- Add a torn top edge using a pseudo-element:

```css
.portfolio-sketchbook { position: relative; }
.portfolio-sketchbook::before {
  content: "";
  position: absolute;
  left: 0; right: 0;
  top: -22px;
  height: 24px;
  background: #212121;   /* same as section */
  -webkit-mask: url("../assets/torn-edge.svg") repeat-x bottom / 420px 24px;
          mask: url("../assets/torn-edge.svg") repeat-x bottom / 420px 24px;
  pointer-events: none;
  z-index: 1;
}
```

- Create `src/assets/torn-edge.svg`: a 420×24 shape that is solid along the bottom, with an irregular, jagged top edge (small random peaks of 2–10 px, a few deeper bites, **not** a regular zigzag). It must tile seamlessly, so the first and last points need to match in height. Example structure: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 24"><path d="M0 14 L9 10 L17 13 L26 6 ... L420 14 L420 24 L0 24 Z" fill="#000"/></svg>`. Generate ~45–60 points.
- Optional fibrous-paper detail: a second, lighter layer (`::after`, `background: #2c2a27`, a different mask offset and `top: -18px`) behind the first, so it reads as layered torn paper, not a cutout.
- Make sure the contact section's bottom padding still leaves room and that the vinyl record/terminal shadow doesn't get clipped.
- Static, no animation needed.

**Acceptance:** the cream contact section transitions into the dark sketchbook with a ripped-paper edge instead of a straight line, with no visible seam where the pattern repeats.

---

## 8. Paper grain on the dark sketchbook section

**Where:** `.portfolio-sketchbook` in `SketchbookSection.css`. The grain texture already exists at `src/assets/paper-grain.svg` and is used on the hero (`.letter-hero` in `index.css`).

**Do:**

```css
.portfolio-sketchbook {
  background-color: #212121;
  background-image: url("../assets/paper-grain.svg");
  background-blend-mode: soft-light;   /* try overlay / screen if too subtle */
}
```

- If blend modes make it invisible on near-black, use an overlay instead: `.portfolio-sketchbook > .grain` or `::after`, with `inset: 0; background: url(...); opacity: 0.06–0.10; mix-blend-mode: screen; pointer-events: none;`. If you use `::before` for the torn edge (task 7), use `::after` here.
- Target something felt more than seen: it should look like black construction paper. If you can clearly see the pattern, it's too strong.
- Make sure the grain sits **behind** the sketchbook frame and heading (lower `z-index`) and doesn't dim the paintings.

**Acceptance:** the dark section has a subtle paper texture that ties it to the cream sections, and the paintings look exactly as vivid as before.

---

# Quality improvements

## Q1. Consolidate fonts

**Current state:** Google Fonts are loaded in `InjectFonts()` (around line 40): Cormorant Garamond, Caveat, Fraunces, Inter, Nunito, Playfair Display, Press Start 2P. On top of those, Sentient is self-hosted via `@font-face` in `index.css`. Rough usage: Nunito appears in ~11 CSS rules, Fraunces in ~7 inline styles (About card titles), Inter in ~6 inline styles plus CSS, Caveat in ~9 places, and Playfair in the sketchbook heading and fallbacks.

**Target system (four families total):**

| Role | Font | Notes |
|---|---|---|
| Display headings, card and project titles | **Cormorant Garamond** (700) | Already the `.page-heading` font. |
| Handwritten accents (labels, captions, quotes, "bonus:") | **Caveat** | Keep. |
| Body and UI text (paragraphs, card text, tags, tabs, form) | **Sentient** | Already used for the hero paragraphs, and fits the paper aesthetic. If a size below 13 px looks weak, use Inter for those UI labels only, and say so in the PR. |
| Nav buttons only | **Press Start 2P** | Intentional exception, part of the pixel-button identity. Nowhere else. |

**Do:**
1. Define CSS variables in `:root` (`index.css`): `--font-display`, `--font-hand`, `--font-body`, `--font-pixel`.
2. Replace the families:
   - `'Fraunces', serif` (inline in About cards and elsewhere) → `var(--font-display)`. Fraunces 900 is heavier than Cormorant 700, so check that the titles still have weight. Bump the size ~10% if needed.
   - `'Playfair Display'` (sketchbook h2, `.project-title`, fallbacks) → `var(--font-display)`.
   - `'Nunito'` and `'Inter'` → `var(--font-body)`. This includes `.project-folder-label`, `.project-desc`, `.project-skill-sticker`, the About card bodies, `.projects-orbit-card`, and the contact terminal. **Exception:** the contact terminal deliberately looks like a terminal, so give it a monospace stack `ui-monospace, 'SF Mono', Menlo, Consolas, monospace` (system fonts, no download) rather than Inter.
   - `orbit-card-stack.tsx` uses Tailwind classes; set `font-family: var(--font-body)` on `.orbit-card-description` and the card root.
3. Remove Fraunces, Nunito, Playfair Display and Inter from the `InjectFonts` URL (keep Inter only if you used it per the table note). Fewer fonts means a faster first paint.
4. Grep afterwards to confirm nothing still references a removed family: `grep -rn "Fraunces\|Nunito\|Playfair\|'Inter'" src`.
5. Body text: line-height 1.5–1.6, and check contrast on the olive and pink cards.

**Acceptance:** at most four font families on the page. Headings, handwritten bits and body text are each visibly consistent from section to section.

## Q2. Keep the project paper tilted but render its text straight

**Where:** `.project-file-paper` (around line 1624) has `transform: translateY(0) rotate(var(--paper-tilt))`, and the `projectPaperUnfile` keyframes animate the rotation. Tilts are set per folder in `folderLayers`: -1.2deg, 1deg, -0.6deg, 0.8deg. Rotating the whole `<article>` rotates the text, which makes small text look soft.

**Do (preferred approach): move the paper visuals to a pseudo-element.**
1. Move the `background`, `border` and `box-shadow` from `.project-file-paper` to a new `.project-file-paper::after` with `content: ""; position: absolute; inset: 0; z-index: -1; transform: rotate(var(--paper-tilt)); transform-origin: 50% 92%;`. Note that `::before` is already used for the colored top band. That band also needs to tilt, so either rotate the `::before` too, or fold the band into the `::after` background as a top gradient stop.
2. Remove `rotate(var(--paper-tilt))` from the article's resting `transform` and from the **100%** keyframe. Keep the rotation only in the entrance frames (0% and 62%) so the unfile animation still has its swing, settling to `rotate(0)` on the article. `.project-file-paper` already has `isolation: isolate`, which keeps `z-index: -1` inside it.
3. Add `transform: translateZ(0)` or `will-change: transform` only during the animation if text looks soft mid-flight. Don't leave `will-change` on permanently.
4. Check that the lined-paper lines and the red margin line (part of the background gradient) still line up with the text. They now live on the tilted pseudo-element, so at ±1.2° the lines will drift slightly against straight text. If that looks off, reduce all `paperTilt` values to within ±0.6deg.

**Fallback approach:** if the pseudo-element refactor causes layout problems, just cap every `paperTilt` at ±0.4deg.

**Acceptance:** each project sheet still looks slightly askew, but the title, description and tags are pixel-sharp at 100% zoom.

## Q3. Experience cards: bullets instead of dense paragraphs

**Where:** the `EXPERIENCES` array (around line 733), with a `sub` string per entry, mapped to `EXPERIENCE_CARDS.description`. It's rendered in `src/components/ui/orbit-card-stack.tsx` (around line 289) as `<p className="orbit-card-description ...">{item.description}</p>`.

**Do:**
1. Change `sub` in `EXPERIENCES` from a string to a `bullets: string[]` (keep `sub` support for backward compatibility).
2. In `orbit-card-stack.tsx`, widen the `description` type to `string | string[]`. When it's an array, render:

```tsx
<ul className="orbit-card-description orbit-card-bullets ...same classes minus mt-4 tweaks...">
  {item.description.map((b) => <li key={b}>{b}</li>)}
</ul>
```

   Style the bullets as small hand-drawn dashes or dots in the card's accent color (`li::before { content: "–"; ... }` or a tiny SVG), with `gap` / `margin` of ~6–8 px between items.
3. Rewrite each entry into **2–3 bullets, each one line and at most ~18 words**, starting with a strong verb and keeping the existing numbers. Don't invent facts; only split and tighten the existing text. Draft for HGS:
   - "Co-wrote the technical spec for Databridge, a financial data platform built natively on Microsoft Fabric."
   - "Defined the OneLake medallion architecture, Direct Lake semantic layer, capacity tiering, and security, all tracked in a 17-item decision register."
   - "Built a Power BI semantic model (7-relationship star schema) and prototyped an EDA agent as an AI proof-of-concept."

   Do the same for the Research Assistant, Music & Dance Suite, Rush Copley volunteer and Youth and Government entries, keeping their existing facts and numbers. **Show Aditi the rewritten bullets for approval before committing.**
4. Note: the VP / Youth and Government entry has `title: "Teaching Assistant"`, which looks like a copy-paste error. Flag it to Aditi; don't change it silently.
5. Remove the inner scroll if the bullets now fit. `.projects-orbit-card .orbit-card-description` has `overflow-y: auto`. Check that no card needs scrolling at 1440×900 and 390×844.

**Acceptance:** each experience card can be skimmed in about 5 seconds: role, 2–3 punchy bullets, date.

## Q4. Reduced-motion audit

After all the tasks above, turn on reduced motion (macOS: System Settings → Accessibility → Display → Reduce motion; or in Chrome DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce") and walk the whole page:
- [ ] No hero sticker peel transform (the shadow change is fine).
- [ ] Washi tape is visible and static.
- [ ] Compact nav appears without sliding, and smooth scroll is off.
- [ ] Heading underlines are already drawn.
- [ ] Folder tabs don't move.
- [ ] Caption arrow doesn't wiggle.
- [ ] Existing animations still respect it. Already handled: the film strip, FoldText, the mascot, PaperCrumple, and the contact vinyl/cursor, project paper and experience window (see the `@media (prefers-reduced-motion: reduce)` block near the end of the `<style>` in `personalwebsite.jsx`, around line 2842). Check `about-paper-mask-unfurl` / `about-paper-curl-edge` and the sketchbook page-turn, and add them to that block if they aren't covered. Add your new reduced-motion rules to the same block where practical.

---

## Final checklist before committing

- [ ] `npm run lint` passes and `npm run build` succeeds.
- [ ] Tested at 1440×900 and 390×844, and with keyboard-only navigation (Tab through the nav, folder tabs and project links).
- [ ] No new console errors.
- [ ] No placeholder content changed.
- [ ] One commit per numbered task, so any single change is easy to revert.
