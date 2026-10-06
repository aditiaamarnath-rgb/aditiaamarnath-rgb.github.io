# Cooler brown skin correction

Color edit created with the built-in image generation tool using the photo as a skin-tone reference. Original photo-inspired assets remain in `../aditi-likeness/`. These sheets replace the orange skin with a cooler cocoa-brown palette.

Generated originals: `directions-generated.png`, `reactions-generated.png`. Run the preparation scripts in this folder to repack them, then the page-mascot skill's `scripts/mascot.py aditi-cool --skip-generate` from the project root. Runtime files are in `public/mascots/aditi-cool-{directions,reactions}.webp`.

## Directions edit prompt

Precise color-only edit of image1 mascot DIRECTIONS sprite sheet. Image2 photo is skin-tone reference. Change ONLY the skin colors on face ears neck in all nine cells to a cooler neutral medium brown matching person in photo. The current artwork is much too orange/golden/light. Target desaturated cocoa brown with subtle cool rosy/olive-neutral undertone: illustrative midtone approximately #956B60, shadow #65483F, gentle highlight #B58A7B. Avoid orange amber golden tan peach and yellow lighting. Keep skin looking natural brown, not grey purple or pink. Maintain same shading and facial details, but recolor highlights too so no orange remains. Preserve EXACT face shapes, eyes, eyebrows, lips, hair, lavender hoodie, pose directions, cell layout, scale and coordinates. No redrawing, no repositioning, no new details. Keep all nine original head directions and body alignment, exact transparent background alpha. Output same square 3x3 PNG sprite sheet.

## Reactions edit prompt

Precise color-only edit of image1 mascot REACTIONS sprite sheet. Image2 photo is skin-tone reference. Change ONLY skin colors on face ears neck across ALL nine expressions to cooler neutral medium brown matching person in photo. Current skin is too orange/golden/light. Use desaturated cocoa brown with subtle cool rosy/olive-neutral undertone: illustrative midtone #956B60, shadow #65483F, gentle highlight #B58A7B. Avoid orange amber golden tan peach yellow lighting. Natural brown skin, not grey purple or pink. Preserve shading and facial details; recolor highlights too so no orange remains. Preserve blush as subtle muted rose for blushing expression. Preserve EXACT face geometry, eyes and expressions, hair, lavender hoodie, symbols heart stars zzz, cell layout, scale coordinates body alignment and transparent alpha. No redrawing or repositioning. Output same square 3x3 PNG sheet. This must match a directions sheet being recolored to identical cocoa skin palette.

