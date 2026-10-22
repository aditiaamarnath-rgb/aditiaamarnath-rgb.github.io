"""Extract the supplied drawings without redrawing, resampling, or recoloring.

Usage: python3 scripts/extract-handdrawn-stickers.py source.png output-directory
Only the outside paper/background alpha is removed; retained RGB bytes and the
source color profile are copied exactly. Coordinates refer to the original sheet.
Uses the Python standard library, with no imaging/AI dependency.
"""
import collections
import hashlib
import json
from pathlib import Path
import struct
import sys
import zlib


def read_png(path):
    data = Path(path).read_bytes()
    assert data[:8] == b'\x89PNG\r\n\x1a\n', 'Expected PNG input'
    compressed, profiles = bytearray(), []
    offset = 8
    while offset < len(data):
        size = struct.unpack_from('>I', data, offset)[0]
        kind, payload = data[offset + 4:offset + 8], data[offset + 8:offset + 8 + size]
        if kind == b'IHDR':
            width, height, depth, color, compression, filtering, interlace = struct.unpack('>IIBBBBB', payload)
            assert (depth, color, compression, filtering, interlace) == (8, 6, 0, 0, 0), 'Expected 8-bit RGBA PNG'
        elif kind == b'IDAT':
            compressed.extend(payload)
        elif kind in (b'iCCP', b'cICP', b'sRGB', b'gAMA', b'cHRM'):
            profiles.append((kind, payload))
        offset += size + 12
    raw, stride = zlib.decompress(compressed), width * 4
    pixels, previous, offset = bytearray(), bytearray(stride), 0
    for _ in range(height):
        filtering = raw[offset]
        row = bytearray(raw[offset + 1:offset + 1 + stride])
        offset += stride + 1
        if filtering == 0:
            pixels.extend(row)
            previous = row
            continue
        for x in range(stride):
            left = row[x - 4] if x >= 4 else 0
            up = previous[x]
            upper_left = previous[x - 4] if x >= 4 else 0
            if filtering == 1:
                predictor = left
            elif filtering == 2:
                predictor = up
            elif filtering == 3:
                predictor = (left + up) // 2
            elif filtering == 4:
                p = left + up - upper_left
                distances = (abs(p - left), abs(p - up), abs(p - upper_left))
                predictor = (left, up, upper_left)[distances.index(min(distances))]
            else:
                assert filtering == 0
                predictor = 0
            row[x] = (row[x] + predictor) & 255
        pixels.extend(row)
        previous = row
    return width, height, pixels, profiles


def write_png(path, width, height, pixels, profiles):
    def chunk(kind, payload):
        return struct.pack('>I', len(payload)) + kind + payload + struct.pack('>I', zlib.crc32(kind + payload) & 0xffffffff)
    raw = b''.join(b'\x00' + pixels[y * width * 4:(y + 1) * width * 4] for y in range(height))
    output = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    output += b''.join(chunk(kind, payload) for kind, payload in profiles)
    output += chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b'')
    Path(path).write_bytes(output)


def inside(x, y, polygon):
    result = False
    for (ax, ay), (bx, by) in zip(polygon, polygon[1:] + polygon[:1]):
        if (ay > y) != (by > y) and x < (bx - ax) * (y - ay) / (by - ay) + ax:
            result = not result
    return result


def drawing_component(pixels, width, height):
    """Exclude neighboring drawings and loose sheet dust, preserving edge grain."""
    seen, components = bytearray(width * height), []
    for start in range(width * height):
        if seen[start] or not pixels[start * 4 + 3]:
            continue
        stack, component = [start], []
        seen[start] = 1
        while stack:
            i = stack.pop()
            component.append(i)
            x, y = i % width, i // width
            for ny in range(max(0, y - 1), min(height, y + 2)):
                for nx in range(max(0, x - 1), min(width, x + 2)):
                    neighbor = ny * width + nx
                    if not seen[neighbor] and pixels[neighbor * 4 + 3]:
                        seen[neighbor] = 1
                        stack.append(neighbor)
        components.append(component)
    largest = max(components, key=len)
    keep = set(largest)
    main = frozenset(largest)
    for component in components:
        if component is largest:
            continue
        # Keep tiny disconnected pencil marks immediately beside the outline.
        if any(ny * width + nx in main
               for i in component
               for ny in range(max(0, i // width - 2), min(height, i // width + 3))
               for nx in range(max(0, i % width - 2), min(width, i % width + 3))):
            keep.update(component)
    return keep


# Bounds follow each original object, excluding neighboring drawings. The sheet
# is 1640 x 2360; these coordinates use its 1312 x 1888 display coordinate space.
REGIONS = {
    'camera': {'polygon': [(165, 45), (745, 45), (755, 450), (420, 455), (415, 690), (30, 690), (30, 165), (165, 165)], 'holes': [(245, 585)]},
    'polish': {'polygon': [(920, 12), (1195, 12), (1195, 455), (920, 455)]},
    'button': {'polygon': [(45, 720), (305, 720), (305, 970), (45, 970)]},
    'paint': {'polygon': [(25, 1020), (283, 1010), (285, 1108), (383, 1108), (389, 1300), (470, 1360), (470, 1688), (25, 1688)], 'holes': [(415, 1460)]},
    'star': {'polygon': [(430, 1045), (704, 1045), (704, 1340), (430, 1340)]},
    'headphones': {'polygon': [(835, 1090), (1290, 1090), (1290, 1868), (520, 1868), (520, 1390), (659, 1368), (710, 1255), (763, 1166)], 'holes': [(950, 1370)]},
}


def extract(source, output_dir):
    width, height, original, profiles = read_png(source)
    assert (width, height) == (1640, 2360), 'Use the original attached sheet without resizing'
    output_dir.mkdir(parents=True, exist_ok=True)
    manifest = {'sourceSha256': hashlib.sha256(Path(source).read_bytes()).hexdigest(), 'sourceSize': [width, height], 'method': 'Direct crop and background alpha mask; original RGB and color profile retained; no resampling.', 'images': {}}
    for name, region in REGIONS.items():
        polygon = [(round(x * 1.25), round(y * 1.25)) for x, y in region['polygon']]
        x0, y0 = min(x for x, _ in polygon), min(y for _, y in polygon)
        x1, y1 = max(x for x, _ in polygon), max(y for _, y in polygon)
        w, h = x1 - x0, y1 - y0
        pixels = bytearray().join(original[((y0 + y) * width + x0) * 4:((y0 + y) * width + x1) * 4] for y in range(h))
        removable, removed = bytearray(w * h), bytearray(w * h)
        queue = collections.deque()
        for y in range(h):
            for x in range(w):
                i = y * w + x
                p = i * 4
                outside = not inside(x0 + x + .5, y0 + y + .5, polygon)
                removable[i] = outside or pixels[p + 3] == 0 or min(pixels[p:p + 3]) >= 252
                if outside or x == 0 or y == 0 or x == w - 1 or y == h - 1:
                    if removable[i]:
                        removed[i] = 1
                        queue.append(i)
        for x, y in region.get('holes', []):
            x, y = round(x * 1.25) - x0, round(y * 1.25) - y0
            i = y * w + x
            assert removable[i], f'{name}: background seed touches drawing'
            removed[i] = 1
            queue.append(i)
        while queue:
            i = queue.popleft()
            x, y = i % w, i // w
            neighbors = []
            if x: neighbors.append(i - 1)
            if x + 1 < w: neighbors.append(i + 1)
            if y: neighbors.append(i - w)
            if y + 1 < h: neighbors.append(i + w)
            for neighbor in neighbors:
                if removable[neighbor] and not removed[neighbor]:
                    removed[neighbor] = 1
                    queue.append(neighbor)
        for i, background in enumerate(removed):
            if background:
                pixels[i * 4:i * 4 + 4] = b'\x00\x00\x00\x00'
        retained = drawing_component(pixels, w, h)
        for i in range(w * h):
            if i not in retained:
                pixels[i * 4:i * 4 + 4] = b'\x00\x00\x00\x00'
        # Crop transparent padding, retaining 8 source pixels around the drawing.
        left, right = max(0, min(i % w for i in retained) - 8), min(w, max(i % w for i in retained) + 9)
        top, bottom = max(0, min(i // w for i in retained) - 8), min(h, max(i // w for i in retained) + 9)
        cropped = bytearray().join(pixels[(y * w + left) * 4:(y * w + right) * 4] for y in range(top, bottom))
        out_w, out_h = right - left, bottom - top
        path = output_dir / f'{name}.png'
        write_png(path, out_w, out_h, cropped, profiles)
        _, _, verified, _ = read_png(path)
        # Verify every retained pixel against the original sheet, byte for byte.
        for y in range(out_h):
            for x in range(out_w):
                p = (y * out_w + x) * 4
                if verified[p + 3]:
                    src = ((y0 + top + y) * width + x0 + left + x) * 4
                    assert verified[p:p + 4] == original[src:src + 4], f'{name}: changed drawing pixel'
        manifest['images'][name] = {'size': [out_w, out_h], 'sourceOrigin': [x0 + left, y0 + top], 'originalPixelsVerified': True}
        print(f'{name}: {out_w} x {out_h}; retained pixels match original exactly')
    (output_dir / 'source-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')


if __name__ == '__main__':
    extract(Path(sys.argv[1]), Path(sys.argv[2]))
