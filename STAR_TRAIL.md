# Home page: green doodle star trail

This adds a looping trail of hand-drawn, pencil-shaded green stars down the empty **left side** of the home hero (`#home`, `HeroSection` in `src/personalwebsite.jsx`). The design was finalised in a Claude Design canvas. Its source is **`design/home-star-trail.reference.html`**, and it's the source of truth for exact values. Copy the star paths, keyframes and the path maths from it.

> The reference is design-tool syntax, not React. `{{hole}}` is a template value, `<sc-for>` is a loop, `<sc-if>` is a conditional, and `renderVals()` computes everything. The background, nav, heading and mascot in that file are mock-ups of the real page. **Port only the star trail.** Don't touch the existing backdrop, FoldText heading, mascot or nav.

Don't modify unrelated uncommitted work.

---

## 1. Where it lives

- Make a new **`src/components/StarTrail.jsx`** (plus `StarTrail.css`) and render it inside `HeroSection`, right after `.hero-backdrop`.
- Layer: `position:absolute; inset:0; z-index:1; pointer-events:none`. That puts it above the backdrop (`z-index:-1`) and below `.letter-intro` (`z-index:2`) and the nav (`z-index:3`).
- Everything is `aria-hidden="true"`. It's purely decorative.

## 2. Coordinate system (make it responsive)

- The canvas was 1440×900. Every path coordinate in the reference is in that space.
- **Measure the hero** with a `ResizeObserver` and scale points: `x * (W/1440)`, `y * (H/900)`.
- Keep star sizes in px; don't scale them.
- The trail must stay in the left ~50% of the hero (the text column starts at `margin-left: 53%`). If a scaled point would cross `0.5 * W`, clamp the loop radius down.
- **≤ 700px wide:** the text takes the full width, so **don't render the trail**. Use a CSS `display:none` and skip the work in JS.

## 3. The path (final settings)

- **Base curve** is the "swoop" cubic Bézier from `(230,26)` → c1 `(10,330)` → c2 `(640,500)` → end `(400,890)`. It starts at the very top-left, beside the nav.
- **Loops** are added on top of the curve, in its own tangent/normal frame (copy the `bez(t)` function from the reference exactly):
  - `loops = 5`, `R = 92`.
  - Each loop alternates side (`side = ±1` by loop index).
  - Each loop's radius is scaled by `LOOP_R = [1, .72, 1.18, .86, 1.08, .66, 1.22, .9, 1.02]`.
  - The envelope is `sin(π·min(1, t·1.1))^0.5`, so the trail starts as a clean line.
- **Sampling:** sample 900 points, build cumulative arc length, and place stars at **even arc-length** spacing (`at(f)`). Stars bunch naturally around the loops.
- **Trail line:** a faint dotted polyline through every 3rd sample point. Stroke `#e7edc6`, width 1.6, `stroke-dasharray: 2 9`, round caps, opacity .85.

## 4. Stars

- **Count 26.** Positions get a small jitter cycling `[[0,0],[6,-5],[-5,4],[4,6],[-6,-3],[3,-6],[-4,5]]`.
- **Shapes** use a 24×24 viewBox and cycle the 3 doodle paths in `PATHS` with the pattern `[0,1,2,0,1,0,2]`: two wobbly five-point stars and one four-point sparkle. Each path deliberately overshoots its start so it reads as hand-drawn.
- **Rotation** cycles `[-12,9,-4,15,-9,6,-15,3,12,-6]` degrees.
- **Size:** base 28px × the `VAR` cycle `[1,.62,1.28,.78,.95,1.4,.7,1.12,.58,1.2,.85,1.33]`, so sizes vary irregularly.
- **Colour:** `#e7edc6` (pale creamy green).
- **Each star is two stacked paths with the same `d`:**
  1. **Tint:** `fill:#e7edc6; fill-opacity:.5; stroke:none`.
  2. **Sketch:** `stroke:#e7edc6; stroke-width:1.6; round caps and joins`, with `fill:url(#sketch-hatch)`. The hatch is a `<pattern>` in `userSpaceOnUse`, 2.2×2.2, `patternTransform="rotate(45)"`, with one line of `stroke-width:1.25` in the same green.
  - Render the `<pattern>` **once** in a hidden `<svg>` and give it a unique id, e.g. `useId()`, so it can't clash.
- **DOM per star:** `span.star` (absolute, `transform: translate(-50%,-50%)`) > `span.star-in` (`transform: rotate(var(--r))`) > `svg` > the two paths. These three layers matter: the entrance, the idle animation and the cursor-repel each animate a different element, so they never fight. The `translate` property for repel goes on `.star`.

## 5. Motion (final choice)

### Entrance: comet
- `stagger = 90ms` and `span = (count-1) * 90`, so about 2.25s.
- The **comet** is 4 stacked spans that follow the trail with CSS `offset-path: path('M… L…')`, built from the same scaled polyline, plus `offset-anchor: 50% 50%`.
- Each runs `cometRun` (`offset-distance` 0%→100%, fade in at 4%, out after 92%) over `span` ms, **linear**.

  | piece | size | opacity | glow | delay |
  |---|---|---|---|---|
  | head | 30px | 1 | 8px | 0ms |
  | tail 1 | 20px | .6 | 5px | 70ms |
  | tail 2 | 14px | .38 | 3px | 140ms |
  | tail 3 | 9px | .22 | 2px | 210ms |

  - Each piece is a solid five-point star in `#fbfde9`, spinning (`spin` 900ms linear infinite).
  - The glow is `drop-shadow(0 0 Npx rgba(251,253,233,.95))`.
- **Each star** pops in with `cometPop` (620ms, `cubic-bezier(.2,1.6,.4,1)`) at delay `f * span + 30ms`, where `f` is its arc fraction. That way it bursts exactly as the comet reaches it.
- **The dotted line draws in behind the comet.** Use a `<mask>` holding a white polyline (`pathLength=1`, `stroke-width:16`) whose `stroke-dashoffset` animates from 1 to 0 over `span` ms, linear.

### Idle: twinkle ripple
- After the entrance, each star's `svg` runs `twinkle` (3.4s ease-in-out infinite: scale 1→1.16 and rotate 0→14deg).
- The delay is `span + 700 + index*80` ms, so the twinkle rolls down the trail.

### Interaction: repel cursor
- Listen for `pointermove` and `pointerleave` on the **hero section**. Don't put a listener on the star layer; keep it `pointer-events:none`.
- Within 150px of the cursor, push each star away by `(150 - dist) * 0.55` px along the vector from the cursor.
- Apply the push via the star's `translate` property with `transition: translate 480ms cubic-bezier(.2,1.35,.4,1)`, which gives a springy bounce back.
- **Performance:** write to star `ref`s inside a `requestAnimationFrame`. **Don't** call `setState` on every mouse move.
- On touch devices, skip the repel (`matchMedia('(hover: hover)')`).

Copy all keyframes (`cometRun`, `cometPop`, `twinkle`, `spin`, `draw`) verbatim from the reference's `<style>`. The other entrance and idle options in the reference (doodle, constellation, sweep, float, shimmer, ripple, spin) weren't chosen. **Don't port them.**

## 6. Timing with the rest of the hero

- The heading's FoldText also animates on mount. Start the comet at the same time; both finish in about 2.3s. If it feels busy, delay the comet by 300ms. That's the only number to tune by eye.
- Play the entrance **once per page load**. Don't replay it on scroll.

## 7. Reduced motion

With `prefers-reduced-motion: reduce`:
- No comet.
- No entrance, twinkle or repel.
- Stars and the dotted line simply show, fully drawn and filled.

## 8. Done when

- [ ] At 1440×900 it matches the canvas: the trail starts at the top-left beside the nav, makes 5 alternating loops of different sizes, and stays clear of the text column.
- [ ] The comet races down the trail, the line draws behind it, and stars burst in as it passes. Then the twinkle rolls down the trail.
- [ ] Stars spring away from the cursor and bounce back. Nothing on the page becomes unclickable.
- [ ] It scales with window size, is hidden at ≤700px, and respects reduced motion.
- [ ] No re-renders on mouse move. `npm run build` passes and there are no console errors.
