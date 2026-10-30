import { useEffect, useRef, useState } from 'react';
import './SketchbookSection.css';

export default function SketchbookSection() {
  const frameRef = useRef(null);
  const [frameHeight, setFrameHeight] = useState(null);

  useEffect(() => {
    const frame = frameRef.current;
    let ready = false;
    let visible = false;
    let inView = false;
    let pendingEntry = false;
    const notifyVisibility = (trigger = false) => {
      if (trigger) pendingEntry = true;
      if (!inView) pendingEntry = false;
      if (!ready) return;
      frame?.contentWindow?.postMessage({ type: 'sketchbook-visibility', visible, inView, trigger: visible && pendingEntry }, window.location.origin);
      if (visible) pendingEntry = false;
    };
    const resizeFrame = (event) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type === 'sketchbook-ready') {
        ready = true;
        notifyVisibility();
      }
      if (event.data?.type === 'sketchbook-resize' && Number.isFinite(event.data.height)) {
        setFrameHeight(Math.max(160, Math.ceil(event.data.height)));
      }
    };
    window.addEventListener('message', resizeFrame);
    const observer = new IntersectionObserver(([entry]) => {
      const nextVisible = entry.isIntersecting && entry.intersectionRatio >= 0.4;
      const enteredFromAbove = nextVisible && !visible && entry.boundingClientRect.top >= 0;
      visible = nextVisible;
      inView = entry.isIntersecting;
      notifyVisibility(enteredFromAbove);
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
    </section>
  );
}
