"""Extract original JPEGs from the supplied, image-only sketchbook PDF.

No rendering, image generation, cropping, recoloring, or recompression. Page-tree
order determines the filenames; page 1 is skipped unless --include-first is set.
This importer intentionally
checks the simple PDF structure rather than guessing image-stream order.
"""
import hashlib
import argparse
import json
from pathlib import Path
import re


def import_pdf(source, destination, skip_first=True):
    data = source.read_bytes()
    objects = {}
    for match in re.finditer(rb'(?m)^(\d+)\s+0\s+obj\s*', data):
        start = match.end()
        end = data.index(b'endobj', start)
        objects[int(match[1])] = (start, data[start:end])
    catalog = next(body for _, body in objects.values() if re.search(rb'/Type\s*/Catalog\b', body))
    root = int(re.search(rb'/Pages\s+(\d+)\s+0\s+R', catalog)[1])
    page_objects = []

    def walk(number):
        _, body = objects[number]
        if re.search(rb'/Type\s*/Pages\b', body):
            kids = re.search(rb'/Kids\s*\[([^\]]+)\]', body)[1]
            for child in re.findall(rb'(\d+)\s+0\s+R', kids):
                walk(int(child))
        else:
            assert re.search(rb'/Type\s*/Page\b', body)
            page_objects.append(number)

    walk(root)
    assert page_objects, 'No pages found in PDF'
    destination.mkdir(parents=True, exist_ok=True)
    entries = []
    for page_number, number in enumerate(page_objects, 1):
        if skip_first and page_number == 1:
            continue
        _, page = objects[number]
        assert re.search(rb'/Rotate\s+0\b', page), 'Unexpected page rotation'
        resources = objects[int(re.search(rb'/Resources\s+(\d+)\s+0\s+R', page)[1])][1]
        images = re.search(rb'/XObject\s*<<([^>]+)>>', resources)[1]
        references = re.findall(rb'/\w+\s+(\d+)\s+0\s+R', images)
        assert len(references) == 1, 'Expected one original image per page'
        image_number = int(references[0])
        start, image = objects[image_number]
        stream = re.search(rb'stream\r?\n', image)
        header = image[:stream.start()]
        assert b'/DCTDecode' in header, 'Expected original JPEG image'
        length = int(re.search(rb'/Length\s+(\d+)\b', header)[1])
        width = int(re.search(rb'/Width\s+(\d+)\b', header)[1])
        height = int(re.search(rb'/Height\s+(\d+)\b', header)[1])
        jpeg = data[start + stream.end():start + stream.end() + length]
        assert jpeg[:2] == b'\xff\xd8' and jpeg[-2:] == b'\xff\xd9', 'Invalid JPEG stream'
        name = f'page-{page_number:02}.jpg'
        target = destination / name
        target.write_bytes(jpeg)
        assert target.read_bytes() == jpeg
        entries.append({'pdfPage': page_number, 'file': name, 'width': width, 'height': height,
                        'sha256': hashlib.sha256(jpeg).hexdigest(), 'pdfImageObject': image_number})
    assert entries and len(entries) % 2 == 0, 'Expected an even number of sketches to pair'
    manifest = {'sourcePdf': source.name, 'sourceSha256': hashlib.sha256(data).hexdigest(),
                'pdfPages': len(page_objects), 'skippedPages': [1] if skip_first else [], 'importedSketches': len(entries),
                'pageSizeInches': {'width': 8, 'height': 5},
                'display': {'rotationDegrees': -90, 'fit': 'cover', 'zoom': 1.015},
                'method': 'Original JPEG streams copied byte-for-byte; no image generation or edits.',
                'images': entries,
                'spreads': [{'file': f'spread-{i // 2 + 1:02}.webp', 'leftPdfPage': entries[i]['pdfPage'],
                             'rightPdfPage': entries[i + 1]['pdfPage']} for i in range(0, len(entries), 2)]}
    (destination / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'Imported {len(entries)} original sketches into {len(manifest["spreads"])} pairs; PDF page 1 {"excluded" if skip_first else "included"}.')
    print(f'First spread: PDF pages {entries[0]["pdfPage"]} / {entries[1]["pdfPage"]}. Last spread: PDF pages {entries[-2]["pdfPage"]} / {entries[-1]["pdfPage"]}.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('destination', type=Path)
    parser.add_argument('--include-first', action='store_true', help='Include page 1 as the first left sketch')
    args = parser.parse_args()
    import_pdf(args.source, args.destination, skip_first=not args.include_first)
