# Projects section → folder fan (v2, final design)

This replaces the earlier version of this spec. The design was finalised in a Claude Design canvas. Its full source is in **`design/projects-folder-fan.reference.html`**. That file is the source of truth for every exact value (CSS, keyframes, SVG paths, colours). Copy from it rather than re-deriving anything.

> The reference is a design-tool component, not React. `{{hole}}` is a template value, `<sc-for>` is a loop, `<sc-if>` is a conditional, and `class Component extends DCLogic { renderVals() {...} }` computes the values. Port the markup and CSS as they are, and port the `renderVals()` maths into the React component's render.

There is already a `src/components/ProjectFolderFan.jsx` from the first pass. **Rework that component to match this spec.** Don't add a second one. Don't touch the experience section or `orbit-card-stack.tsx`. Leave unrelated uncommitted work in `personalwebsite.jsx` alone.

---

## 1. What changed from v1

- The folders are **drawn in CSS**, not the `project-folder-*.png` images. The PNGs are no longer used by this section; leave the files in place.
- **All four folders are the same shape and size.** Tabs sit at left / centre / right / left.
- Tab labels are **plain typed text**, with no paper label behind them.
- Hovering a folder **lifts it and shows its subtitle only**. There is no "open folder" button and there are no stickers on the cover.
- **Tech stack = logo stickers, shown only inside an opened folder.** Hovering a logo shows its name in the handwriting font.
- A **flip-through** plays on open: 2 sheets, then the project page, then the post-it is thrown on top. The whole sequence lasts about 0.8s.
- **Silver paper clips** on folders 0 and 2 and on the opened page. No binder clips.
- **New fonts**, scoped to this section only (section 6).

## 2. Data

Keep the `PROJECTS` array in `personalwebsite.jsx` as the content source. Add these per-project fields (values are in the reference's `projects()` method):

| idx | project | front | back (tab + inside) | tabL / tabW (%) | accent | noteColor | noteRot | tilt |
|---|---|---|---|---|---|---|---|---|
| 0 | Bluprint | `#a8ae95` | `#989f85` | 3 / 36 | `#9ea76b` | `#dfe4b9` | -5 | 0.8 |
| 1 | Databridge | `#f6d2da` | `#e9bfc9` | 32 / 36 | `#e3a7b4` | `#efe8ca` | -6 | -0.6 |
| 2 | Tech and Humanity | `#d6b891` | `#c6a57d` | 61 / 36 | `#cfc38d` | `#f9d1d9` | 4 | 1 |
| 3 | Wavelength | `#abcee3` | `#98bdd4` | 3 / 36 | `#8fb3cf` | `#dfe4b9` | -5 | -1.2 |

The post-it uses the existing `*-postit-preview.png` imports. `fit` is `cover` for Bluprint and Databridge and `contain` for the other two. Captions are unchanged ("see it live" / "final presentation day!!"). Only projects with a `projectUrl` get the link and the wiggling arrow.

## 3. Motion model (same as the experience stack)

States are `mode: "stack" | "fan" | "open"`, plus `hovered` and `openIdx`.

- **stack:** `x = i*10`, `y = |i|*5`, `rotate = i*2.8deg`, `z = 50-|i|`. Bluprint (0) is on top.
- **fan** (any folder hovered or focused): `o = i - 1.5`, `x = o*250`, `y = |o|*30 + max(0,|o|-1)*10 − (hovered ? 34 : 0)`, `rotate = o*8.5deg`. The hovered folder gets `z = 80`, the others `50-|i-hovered|`.
- **open:** the open folder sits at `x=0, y=+190, rotate 0, z 90` and grows from **380px to 940px** wide. Every other folder goes to `x = st*14, y = -20+|st|*6, rotate st*3deg, scale .92, opacity .4` (with `st = i - openIdx`), so they tuck behind.
- Cards are `position:absolute; left:50%; bottom:230px`, with `transform: translateX(-50%) translate(x,y) rotate(r) scale(s)` and `transform-origin: 50% 100%`.
- Transitions: **transform 298ms, width 318ms, opacity 198ms**, all `cubic-bezier(.2,.8,.2,1)`.
- Click and keys: the first click or tap fans the stack and lifts that folder, and a second click opens it. On desktop, hover already lifts it, so one click opens. Arrow keys move between folders and Esc closes. Mouse-leave or focus-leave collapses the fan but **never closes an open folder**. Opening a folder resets the section to stack when it closes.

## 4. Folder drawing (per card, `w` = current width)

- `h = w*0.72`, `tabH = w*0.075`, `frontTop = tabH + w*0.05`.
- Layers, back to front (see the reference markup):
  1. **Back panel.** `top: tabH`, colour `back`, radius `6px 7px 4px 4px`, class `cardstock`.
  2. **Tab.** `left: tabL%; width: tabW%; height: tabH+6`, colour `back`. Its shape is a `clip-path: path()` from the `tabPath()` helper: slight slant (3% of the tab width) and top corners at `w*0.026`. Animate the `clip-path` with the width (318ms).
  3. **Two peeking sheets.** One lined (`#f8f4e8`, rotated -1.3deg) and one plain (`#fffdf8`, rotated 0.9deg).
  4. **Paper clip** (folders 0 and 2 only, closed state only). Inline SVG from the reference.
  5. **Front panel.** Classes `cardstock front-panel`, colour `front`, radius `3px 3px 5px 5px`.
  6. **Tab label.** Uppercase DM Mono 400, letter-spacing `.1em`. The size is auto-fit (see `labelFont` in the reference).
- **`.cardstock::after`** applies `src/assets/card-paper-grain.svg` with `mix-blend-mode: multiply` at `opacity: .6`.
- **Shadow** goes on the art wrapper. At rest: `drop-shadow(0 1px 1px rgba(0,0,0,.16)) drop-shadow(0 12px 16px rgba(54,47,34,.18))`. Lifted: the deeper version in the reference, plus `brightness(1.02)`.
- **Cover text** sits at `left/right: 28px; top: frontTop+22`:
  - Title: Playfair Display 25px.
  - Year: Times New Roman 17px, **not italic**.
  - On hover only: the subtitle (`badge`) in Times New Roman 16px, fading in with `peekIn` over 200ms.

## 5. Opened folder

- The paper is `left/right 4.5%`, `top: tabH + w*0.02`, `bottom 3.5%`. It's lined with a 12px top border in `accent`, and the sheet itself is tilted by `tilt`.
- The paper is a 2-column grid. On the **left**:
  - The subtitle, in uppercase DM Mono 12px with `.14em` tracking.
  - The title (Playfair 46px) with the year (Times New Roman 26px).
  - The description (Plus Jakarta Sans 15px, line-height 1.75, scrolls if long).
  - The logo stickers.
- On the **right** is the post-it: the existing image, the tape strip, the caption in the handwriting font, and the wiggling arrow when there's a link.
- **Close button.** Top-right, faint: `1px solid rgba(54,47,34,.22)`, background `rgba(251,248,239,.6)`, text `rgba(54,47,34,.55)`. Full strength on hover.
- **Paper clip** at the paper's top-left (the reference has it at 26×70, `left:34px; top:-30px; rotate(-6deg)`).
- **Logo stickers** (`--ls: 34px`, gap `14px 16px`):
  - Icons use one `<path>` each, at viewBox 24. The paths and colours are in the reference's `LOGOS` map: React, Node.js, Three.js, MongoDB, Vite, Firebase, Supabase, SQL (database outline), Power BI (three bars).
  - Microsoft Fabric, OneLake and GroqCloud have no logo yet. They render as rounded text stickers using the `WORDS` map.
  - The die-cut look comes from `.logo-art` (four white 1.8px drop-shadows plus a soft shadow).
  - **Hover:** the sticker turns -6deg and lifts 2px. `.logo-tip` fades up above it with the tech name in the **handwriting font**, 19px × the hand scale.
  - If Aditi supplies official SVGs for Fabric, OneLake, Power BI or Groq, swap them in.

## 6. Fonts (scope to `#projects` only, via CSS variables on the section)

| var | font | used for |
|---|---|---|
| `--f-display` | **Playfair Display** 400 | heading "my projects", folder and paper titles |
| `--f-accent` | **Times New Roman**, upright | the word "projects" in the heading, years, cover subtitle |
| `--f-label` | **DM Mono** 400/500 | tab labels, hint line, subtitle inside the paper |
| `--f-body` | **Plus Jakarta Sans** | description |
| `--f-sticker` | **Plus Jakarta Sans** 700 | text stickers |
| `--f-hand` | **Nothing You Could Do** (scale `--hs: .72`) | post-it caption, logo hover names |

- Add these Google Fonts to the existing font loader. Only add the ones that aren't loaded already.
- **No italics anywhere in this section.**
- The heading is "my projects", with "projects" in the accent font. Under it goes a hint line in uppercase DM Mono 12px (`.14em`): "hover to fan the folders out — click one to open it". Swap in "press esc or close to tuck it back in" while a folder is open.

## 7. Open sequence: exact timings (click → settled ≈ 0.8s)

Everything inside the opened folder mounts on open, so these delays count from the click.

| element | keyframes | duration | delay | easing |
|---|---|---|---|---|
| folder grows and moves | (CSS transition) | 298–318ms | 0 | `cubic-bezier(.2,.8,.2,1)` |
| sheet 1 (`--r:-2.6deg; --x:-10px`, `#f8f4e8`) | `flipThrough` | 350ms | 0ms | linear |
| sheet 2 (`--r:1.9deg; --x:12px`, `#fffdf8`) | `flipThrough` | 350ms | 86ms | linear |
| project page | `paperFlip` | 450ms | 171ms | linear |
| post-it throw | `noteDrop` | 280ms | 520ms | built into the keyframes |
| post-it idle sway | `noteSway` | 7s, infinite | 800ms | ease-in-out |

- The flip sheets sit in a box that matches the paper's position, with `perspective: 1400px` and `transform-origin: 50% 100%`. They stay under the page afterwards, so their edges peek out.
- Copy `flipThrough`, `paperFlip`, `noteDrop` and `noteSway` **exactly** from the reference.
- `.postit` uses `--note-rot` and `transform-origin: 50% 30%`. Hover only uses the individual `translate` and `scale` properties, so it doesn't fight the animation.
- With `prefers-reduced-motion: reduce`, turn off every animation and transition in this section.

## 8. Mobile (≤700px)

Not designed on the canvas. Follow v1:

- Small fan spread (`--orbit-spread-scale` about 0.15).
- Folder width about `min(86vw, 380px)`, open width about `94vw`.
- The paper grid stacks into one column, with the post-it under the text.
- Tap to lift, tap again to open.
- Make the stage tall enough that the open folder doesn't overlap the next section.

## 9. Done when

- [ ] It matches the canvas side by side at 1280px wide: folder shapes and colours, tabs, grain, shadows, fonts, paper clips.
- [ ] Hover gives lift plus subtitle. Click gives the flip-through, then the page, then the post-it throw, settling in about 0.8s.
- [ ] Logo stickers appear only inside an opened folder, and each hover name is in the handwriting font.
- [ ] Esc, the close button and keyboard navigation all work. Mouse-leave doesn't close an open folder.
- [ ] Reduced motion is respected. The experience section is unchanged.
- [ ] The tablet and phone layouts work.
- [ ] `npm run build` passes and there are no console errors.
