import { useEffect, useRef, useState } from 'react';
import './SketchbookSection.css';

export default function SketchbookSection() {
  const frameRef = useRef(null);
  const [frameHeight, setFrameHeight] = useState(null);

  useEffect(() => {
    const frame = frameRef.current;
    let ready = false;
    let visible = false;
    const notifyVisibility = () => {
      if (ready) frame?.contentWindow?.postMessage({ type: 'sketchbook-visibility', visible }, window.location.origin);
    };
    const resizeFrame = (event) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type === 'sketchbook-ready') {
        ready = true;
        notifyVisibility();
      }
      if (event.data?.type === 'sketchbook-resize' && Number.isFinite(event.data.height)) {
        setFrameHeight(Math.max(240, Math.ceil(event.data.height)));
      }
    };
    window.addEventListener('message', resizeFrame);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.4;
      notifyVisibility();
    }, { threshold: [0, 0.4], rootMargin: '0px 0px -8% 0px' });
    if (frame) observer.observe(frame);
    return () => {
      observer.disconnect();
      window.removeEventListener('message', resizeFrame);
    };
  }, []);

  return (
    <section className="portfolio-sketchbook" id="sketchbook" aria-labelledby="sketchbook-heading">
      <header className="portfolio-sketchbook-heading">
        <h2 id="sketchbook-heading"><span>bonus:</span> sneak peek at my sketchbook</h2>
      </header>
      <iframe
        ref={frameRef}
        className="portfolio-sketchbook-frame"
        style={frameHeight ? { height: frameHeight } : undefined}
        src={`${import.meta.env.BASE_URL}sketchbook/index.html?scrollIntro`}
        title="Aditi’s interactive sketchbook — drag or tap to turn pages"
        loading="lazy"
      />
      <p className="portfolio-sketchbook-credit">
        Sketchbook interaction adapted from{' '}
        <a href="https://github.com/MengTo/sketchbook" target="_blank" rel="noreferrer">Meng To</a>.
      </p>
    </section>
  );
}
