import { useState, useEffect, useRef } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import aboutCorkboard from "./assets/about-corkboard.png";
import experienceComputer from "./assets/experience-computer.png";
import carouselSlide3 from "./assets/carousel-slide-1.jpg";
import carouselSlide4 from "./assets/carousel-slide-2.jpg";
import carouselSlide2 from "./assets/carousel-slide-3.jpg";
import carouselSlide5 from "./assets/carousel-slide-4.jpg";
import carouselSlide6 from "./assets/carousel-slide-5.jpg";
import carouselSlide1 from "./assets/carousel-slide-6.jpg";
import bikeSticker from "./assets/bike-sticker.png";
import cameraSticker from "./assets/camera-sticker.png";
import paintSticker from "./assets/paint-sticker.png";
import headphonesSticker from "./assets/headphones-sticker.png";
import nailPolishSticker from "./assets/nail-polish-sticker-cutout.png";
import bluprintProjectPreview from "./assets/bluprint-project-preview.png";
import projectFolderGreen from "./assets/project-folder-green.png";
import projectFolderPink from "./assets/project-folder-pink.png";
import projectFolderBeige from "./assets/project-folder-beige.png";
import projectFolderBlue from "./assets/project-folder-blue.png";
import vinylStarStickers from "./assets/vinyl-star-stickers-cutout.png";
import vinylTrebleSticker from "./assets/vinyl-treble-sticker-cutout.png";
import vinylButterflySticker from "./assets/vinyl-butterfly-sticker-cutout.png";
import vinylStrawberrySticker from "./assets/vinyl-strawberry-sticker-cutout.png";
import vinylSpiderSticker from "./assets/vinyl-spider-sticker-cutout.png";
import vinylAppleSticker from "./assets/vinyl-apple-sticker-cutout.png";
import vinylSproutSticker from "./assets/vinyl-sprout-sticker-cutout.png";
import vinylJellyfishSticker from "./assets/vinyl-jellyfish-sticker-cutout.png";
import vinylRabbitStampSticker from "./assets/vinyl-rabbit-stamp-sticker-cutout.png";

function InjectFonts() {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Inter:wght@400;600;700&family=Nunito:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap";
        document.head.appendChild(link);
    }, []);
    return null;
}

const C = {
    fresh:     "#c7d1da",
    azeitona:  "#6c9770",
    figLeaf:   "#3e6897",
    moss:      "#e9efe7",
    wood:      "#362F22",
    petrol:    "#809ba5",
    bg:        "#141b20",
    bgDeep:    "#141b20",
    bgMid:     "#303d47",
    cream:     "#303d47",
    paper:     "#e6eaed",
    blush:     "#c0cab8",
    rose:      "#b97d7b",
    accent:    "#596d85",
    muted:     "#a1bfcc",
    lightText: "#9d9f97",
    ink:       "#362F22",
    yellow:    "#ede39c",
    yellowDark:"#e4ce5e",
    softpink:  "#caaeb5",
};

const ABOUT = {
    scrapInk: "#2B2420",
    twine: "#8A6D4B",
};

const CAROUSEL_PHOTOS = [
    carouselSlide1,
    carouselSlide2,
    carouselSlide3,
    carouselSlide4,
    carouselSlide5,
    carouselSlide6,
];

function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
}

/* ── Section heading with diamond bullet ── */
function SectionHeading({ children, light = false }) {
    return (
        <div style={{ marginBottom: 36 }}>
            <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px,5vw,52px)",
                fontWeight: 900,
                color: light ? C.lightText : C.ink,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                margin: 0,
            }}>
                <span style={{ color: C.accent, marginRight: 12 }}>✦</span>{children}
            </h2>
            <div style={{ height: 4, width: 80, background: C.accent, marginTop: 10, borderRadius: 2 }} />
        </div>
    );
}

function PhotoCarousel() {
    const [current, setCurrent] = useState(0);
    const total = CAROUSEL_PHOTOS.length;

    const goToSlide = (index) => {
        setCurrent((index + total) % total);
    };

    const handleKeyDown = (event) => {
        if (event.key === "ArrowLeft") goToSlide(current - 1);
        if (event.key === "ArrowRight") goToSlide(current + 1);
    };

    return (
        <div style={{
            width: "min(560px, calc(100vw - 104px))",
            aspectRatio: "1 / 1",
            position: "relative",
            overflow: "hidden",
            borderRadius: 16,
            flexShrink: 0,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            opacity: 1,
        }}>
            <div
                tabIndex={0}
                aria-label="Photo carousel"
                onKeyDown={handleKeyDown}
                style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    transform: `translateX(-${current * 100}%)`,
                    transition: "transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    outline: "none",
                }}
            >
                {CAROUSEL_PHOTOS.map((url, index) => (
                    <div key={url} style={{ flex: "0 0 100%", width: "100%", height: "100%", position: "relative" }}>
                        <img
                            src={url}
                            alt={`Aditi portfolio image ${index + 1}`}
                            draggable="false"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 16,
                                display: "block",
                                pointerEvents: "none",
                            }}
                        />
                    </div>
                ))}
            </div>

            <div style={{
                position: "absolute",
                bottom: 32,
                left: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
            }}>
                <button
                    type="button"
                    onClick={() => goToSlide(current - 1)}
                    aria-label="Previous photo"
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#c98a83",
                        color: "#fff",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: 24,
                        fontWeight: 700,
                        boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
                        transition: "filter 0.15s, transform 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "none"; }}
                    onMouseDown={e => { e.currentTarget.style.transform = "scale(0.95)"; }}
                    onMouseUp={e => { e.currentTarget.style.transform = "none"; }}
                >
                    ‹
                </button>

                <div style={{ display: "flex", gap: 8 }}>
                    {CAROUSEL_PHOTOS.map((url, index) => (
                        <button
                            key={`${url}-dot`}
                            type="button"
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to photo ${index + 1}`}
                            aria-current={index === current}
                            style={{
                                width: index === current ? 10 : 8,
                                height: index === current ? 10 : 8,
                                borderRadius: "50%",
                                border: "none",
                                background: index === current ? "#c98a83" : "#a9ab98",
                                opacity: index === current ? 1 : 0.5,
                                transform: index === current ? "scale(1.25)" : "none",
                                transition: "all 0.3s",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => goToSlide(current + 1)}
                    aria-label="Next photo"
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#c98a83",
                        color: "#fff",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: 24,
                        fontWeight: 700,
                        boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
                        transition: "filter 0.15s, transform 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "none"; }}
                    onMouseDown={e => { e.currentTarget.style.transform = "scale(0.95)"; }}
                    onMouseUp={e => { e.currentTarget.style.transform = "none"; }}
                >
                    ›
                </button>
            </div>

            <div style={{
                position: "absolute",
                top: 48,
                right: 16,
                fontFamily: "'Nunito', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#a9ab98",
                letterSpacing: "0.1em",
            }}>
                {current + 1} / {total}
            </div>
        </div>
    );
}

/* ══════════════════ NAV ══════════════════ */
function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", h);
        return () => window.removeEventListener("scroll", h);
    }, []);
    return (
        <nav style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 52px",
            background: scrolled ? C.bgDeep : "transparent",
            borderBottom: scrolled ? `2px solid ${C.accent}` : "2px solid transparent",
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            transition: "all 0.3s",
        }}>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.blush, letterSpacing: "0.01em" }}>
        <span style={{ color: C.accent }}></span> Aditi Amarnath
      </span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {[["About Me","aboutme"],["Experience","experience"],["Projects","projects"],["Contact Me!","contactme"]].map(([label, id]) => (
                    <button key={id} onClick={() => scrollTo(id)} style={{
                        fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700,
                        color: C.blush, background: "transparent",
                        border: "2px solid transparent", borderRadius: 4,
                        padding: "6px 18px", cursor: "pointer",
                        letterSpacing: "0.04em", textTransform: "uppercase",
                        transition: "all 0.2s",
                    }}
                            onMouseEnter={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.color = C.bg; e.currentTarget.style.borderColor = C.accent; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.blush; e.currentTarget.style.borderColor = "transparent"; }}
                    >{label === "Contact Me!" ? <span style={{ background: C.accent, color: C.bg, padding: "6px 18px", borderRadius: 4, fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em" }}>{label}</span> : label}</button>
                ))}
            </div>
        </nav>
    );
}

/* ══════════════════ HERO ══════════════════ */
function HeroSection() {
    const [vis, setVis] = useState(false);
    useEffect(() => { setTimeout(() => setVis(true), 150); }, []);
    return (
        <section style={{
            minHeight: "100vh",
            background: C.bg,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* big bg text */}
            <div style={{ position: "absolute", bottom: -20, right: -10, fontFamily: "'Playfair Display', serif", fontSize: "clamp(100px,18vw,200px)", fontWeight: 900, color: "rgba(192,243,7,0.12)", lineHeight: 1, userSelect: "none", letterSpacing: "-0.05em", pointerEvents: "none" }}>

            </div>

            <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "110px 52px 60px", gap: 60, position: "relative", zIndex: 2 }}>
                {/* LEFT */}
                <div style={{ flex: 1, opacity: vis ? 1 : 0, transform: vis ? "translateX(24px)" : "translate(24px, 28px)", transition: "all 0.9s ease" }}>
                    <div style={{ display: "inline-block", background: C.accent, color: C.bg, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 2, marginBottom: 20 }}>
                        CS and Statistics Major · Class of 2029
                    </div>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(56px,9vw,100px)", fontWeight: 900, color: C.lightText, lineHeight: 0.95, letterSpacing: "-0.03em", margin: "0 0 6px" }}>
                        Hello,
                    </h1>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(56px,9vw,100px)", fontWeight: 900, color: C.rose, lineHeight: 0.95, letterSpacing: "-0.03em", margin: "0 0 32px" }}>
                        I'm Aditi!
                    </h1>

                    {/* about blurb as post-it */}
                    <div style={{ position: "relative", display: "inline-block", maxWidth: 420, transform: "rotate(-1deg)" }}>
                        <div style={{ background: C.paper, border: `3px solid ${C.ink}`, borderRadius: 3, padding: "22px 26px", boxShadow: "5px 5px 0 rgba(0,0,0,0.35)" }}>
                            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: C.ink, lineHeight: 1.75, margin: 0 }}>
                                Hi! I'm passionate about software development, data analytics, and building technology-driven solutions that create real-world impact. This website highlights my projects, technical skills, and experiences as I continue growing as a developer and aspiring data professional.
                            </p>
                        </div>
                    </div>

                    <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <button onClick={() => scrollTo("projects")} style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", background: C.rose, color: C.ink, border: `3px solid ${C.ink}`, borderRadius: 4, padding: "12px 28px", cursor: "pointer", boxShadow: "4px 4px 0 rgba(0,0,0,0.3)", transition: "transform 0.15s, box-shadow 0.15s" }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "6px 6px 0 rgba(0,0,0,0.3)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "4px 4px 0 rgba(0,0,0,0.3)"; }}>
                            View Projects →
                        </button>
                        <button onClick={() => scrollTo("contactme")} style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", color: C.blush, border: `3px solid ${C.blush}`, borderRadius: 4, padding: "12px 28px", cursor: "pointer", boxShadow: "4px 4px 0 rgba(0,0,0,0.2)", transition: "transform 0.15s, box-shadow 0.15s" }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "6px 6px 0 rgba(0,0,0,0.2)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "4px 4px 0 rgba(0,0,0,0.2)"; }}>
                            Get in Touch
                        </button>
                    </div>
                </div>

                <div style={{ flexShrink: 0, opacity: vis ? 1 : 0, transform: vis ? "translateX(-28px)" : "translate(-28px, 28px)", transition: "all 1.1s ease 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PhotoCarousel />
                </div>
            </div>
        </section>
    );
}

/* ══════════════════ ABOUT ME ══════════════════ */
function AboutStack({ children, tilt, yOffset = 0, zIndex = 1 }) {
    return (
        <div className="about-stack-shell" style={{ transform: `translateY(${yOffset}px)`, zIndex }}>
            <div className="about-stack-angle" style={{ "--about-rotate": `${tilt}deg` }}>
                {children}
            </div>
        </div>
    );
}

function AboutSection() {
    const boardRef = useRef(null);
    const dragState = useRef(null);
    const hobbyStickers = [
        {
            id: "camera",
            src: cameraSticker,
            alt: "Camera sticker",
            label: "I like taking pictures of nature and little things. I also create videos of everyday pretty things.",
            x: 43,
            y: 43,
            width: "clamp(92px, 8vw, 124px)",
            rotate: "-5deg",
        },
        {
            id: "headphones",
            src: headphonesSticker,
            alt: "Headphones sticker",
            label: "My favorite genre is synth pop and RnB. My top artists currently are Tame Impala, the Marias, and Seventeen.",
            x: 54,
            y: 37,
            width: "clamp(82px, 7vw, 108px)",
            rotate: "8deg",
        },
        {
            id: "paint",
            src: paintSticker,
            alt: "Paint brushes sticker",
            label: "I love anything artistic, but especially painting with watercolor or gouache. My toxic trait is thinking I can DIY anything instead of buying it.",
            x: 43,
            y: 61,
            width: "clamp(76px, 6.6vw, 104px)",
            rotate: "4deg",
        },
        {
            id: "bike",
            src: bikeSticker,
            alt: "Bike with flowers sticker",
            label: "When I'm stressed, I like to bike on long trails, especially if they're scenic and not hilly.",
            x: 56,
            y: 55,
            width: "clamp(112px, 10vw, 152px)",
            rotate: "13deg",
        },
        {
            id: "polish",
            src: nailPolishSticker,
            alt: "Nail polish sticker",
            label: "I have been getting into doing my nails. I do my friends' nails and also create press-ons.",
            x: 50,
            y: 76,
            width: "clamp(106px, 9vw, 142px)",
            rotate: "4deg",
        },
    ];
    const [stickerPositions, setStickerPositions] = useState(() =>
        Object.fromEntries(hobbyStickers.map(({ id, x, y }) => [id, { x, y }])),
    );
    const [draggingSticker, setDraggingSticker] = useState(null);

    const beginStickerDrag = (event, sticker) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        const board = boardRef.current;
        if (!board) return;

        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);

        const rect = board.getBoundingClientRect();
        const currentPosition = stickerPositions[sticker.id];
        dragState.current = {
            id: sticker.id,
            rect,
            startPointerX: event.clientX,
            startPointerY: event.clientY,
            startX: currentPosition.x,
            startY: currentPosition.y,
        };
        setDraggingSticker(sticker.id);
    };

    const moveSticker = (event) => {
        const drag = dragState.current;
        if (!drag) return;

        const nextX = drag.startX + ((event.clientX - drag.startPointerX) / drag.rect.width) * 100;
        const nextY = drag.startY + ((event.clientY - drag.startPointerY) / drag.rect.height) * 100;
        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

        setStickerPositions((positions) => ({
            ...positions,
            [drag.id]: {
                x: clamp(nextX, 6, 94),
                y: clamp(nextY, 10, 90),
            },
        }));
    };

    const endStickerDrag = (event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        dragState.current = null;
        setDraggingSticker(null);
    };

    return (
        <section id="aboutme" className="about-corkboard-section" aria-label="About Me">
            <div className="about-corkboard-frame" ref={boardRef}>
                <img
                    src={aboutCorkboard}
                    alt=""
                    aria-hidden="true"
                    className="about-corkboard-image"
                />
                <div className="about-corkboard-postits about-stack-grid">
                    <AboutStack tilt={-2} yOffset={16} zIndex={30}>
                        <article className="about-paper-surface about-ref-torn-teal about-paper-ref-teal about-board-postit">
                            <div className="about-paper-section about-paper-heading">
                                <span style={{ fontFamily: "'Caveat', cursive", fontSize: 19, fontWeight: 700, color: ABOUT.scrapInk, opacity: 0.62, textTransform: "uppercase", marginBottom: 8, display: "block" }}>Background</span>
                                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: ABOUT.scrapInk, margin: 0 }}>Education</h3>
                            </div>
                            <div className="about-paper-section">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, marginBottom: 10 }}>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.52 }}>2022 - 2026</span>
                                    <span style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: ABOUT.twine }}>Dean&apos;s List</span>
                                </div>
                                <p style={{ fontFamily: "'Fraunces', serif", fontSize: 21, fontWeight: 700, margin: "0 0 4px" }}>B.S. Computer Science and Statistics</p>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, opacity: 0.78, margin: 0 }}>University of Wisconsin-Madison</p>
                            </div>
                            <div className="about-paper-section">
                                <p style={{ fontFamily: "'Caveat', cursive", fontSize: 21, margin: "0 0 8px" }}>Key Coursework:</p>
                                <ul style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.8, opacity: 0.72, paddingLeft: 18, margin: 0 }}>
                                    <li>Algorithms &amp; OS</li>
                                    <li>Linear Algebra</li>
                                    <li>Data Structures</li>
                                    <li>Statistics in R</li>
                                </ul>
                            </div>
                        </article>
                    </AboutStack>

                    <AboutStack tilt={3} yOffset={-8} zIndex={20}>
                        <article className="about-paper-surface about-ref-torn-pink about-paper-ref-pink about-board-postit">
                            <div className="about-paper-section about-paper-heading">
                                <span style={{ fontFamily: "'Caveat', cursive", fontSize: 19, fontWeight: 700, color: ABOUT.scrapInk, opacity: 0.62, textTransform: "uppercase", marginBottom: 8, display: "block" }}>Vibe</span>
                                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: ABOUT.scrapInk, margin: 0 }}>Hobbies</h3>
                            </div>
                        </article>
                    </AboutStack>

                    <AboutStack tilt={-1} yOffset={24} zIndex={10}>
                        <article className="about-paper-surface about-ref-torn-grid about-paper-ref-grid about-board-postit">
                            <div className="about-paper-section about-paper-heading">
                                <span style={{ fontFamily: "'Caveat', cursive", fontSize: 19, fontWeight: 700, color: ABOUT.scrapInk, opacity: 0.62, textTransform: "uppercase", marginBottom: 8, display: "block" }}>Involvement</span>
                                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: ABOUT.scrapInk, margin: 0 }}>Activities</h3>
                            </div>
                            <div className="about-paper-section">
                                <div style={{ display: "grid", gap: 14 }}>
                                    <div>
                                        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.52 }}>2023 - Now</span>
                                        <p style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, margin: "3px 0 0" }}>ACM Student Chapter</p>
                                    </div>
                                    <div>
                                        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.52 }}>2022 - Now</span>
                                        <p style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, margin: "3px 0 0" }}>Tennis</p>
                                    </div>
                                </div>
                            </div>
                            <div className="about-paper-section">
                                <div>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.52 }}>2024 - Now</span>
                                    <p style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, margin: "3px 0 0" }}>Design Club</p>
                                </div>
                                <div style={{ marginTop: 18 }}>
                                    <p style={{ fontFamily: "'Caveat', cursive", fontSize: 17, fontStyle: "italic", opacity: 0.82, margin: 0 }}>&quot;Making cool things with cool people.&quot;</p>
                                </div>
                            </div>
                        </article>
                    </AboutStack>
                </div>
                <div className="about-draggable-sticker-layer" aria-label="Draggable hobby stickers">
                    {hobbyStickers.map((sticker) => {
                        const position = stickerPositions[sticker.id];

                        return (
                            <button
                                key={sticker.id}
                                type="button"
                                className={`about-draggable-sticker ${draggingSticker === sticker.id ? "is-dragging" : ""}`}
                                aria-label={`Drag ${sticker.alt}`}
                                onPointerDown={(event) => beginStickerDrag(event, sticker)}
                                onPointerMove={moveSticker}
                                onPointerUp={endStickerDrag}
                                onPointerCancel={endStickerDrag}
                                style={{
                                    "--sticker-width": sticker.width,
                                    "--sticker-rotate": sticker.rotate,
                                    left: `${position.x}%`,
                                    top: `${position.y}%`,
                                }}
                            >
                                <img src={sticker.src} alt="" draggable="false" />
                                <span className="about-hobby-blurb">{sticker.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ExperienceSection() {
    const items = [
        { folder: "HGS", year: "Summer 2026", title: "Cloud Analytics Intern", sub: "Built a React dashboard and reduced load time by 40%.", tags: ["React", "Analytics", "Dashboard"], color: "#b2bd8a", tabColor: "#758061" },
        { folder: "Research", year: "Fall 2023", title: "Research Assistant", sub: "Supported an ML pipeline for NLP classification tasks.", tags: ["Python", "ML", "NLP"], color: "#9ba9e5", tabColor: "#6384ee" },
        { folder: "TA", year: "Spring 2024", title: "Teaching Assistant", sub: "Led labs and office hours for Data Structures students.", tags: ["Java", "Teaching", "Data Structures"], color: "#9ccbe2", tabColor: "#56abd5" },
        { folder: "Open Source", year: "Ongoing", title: "Open Source Contributor", sub: "Contributed across React, Python, and C projects on GitHub.", tags: ["Git", "React", "Python"], color: "#c894df", tabColor: "#bd70d9" },
        { folder: "ACM", year: "2023 - Now", title: "ACM Student Chapter", sub: "Participates in the campus computer science community through technical events and collaboration.", tags: ["Community", "CS", "Events"], color: "#f0eda9", tabColor: "#d8d082" },
    ];
    const [active, setActive] = useState(null);
    const current = active === null ? null : items[active];

    return (
        <section id="experience" style={{ background: "#121b21", padding: "90px clamp(14px, 5vw, 52px)", position: "relative", overflow: "hidden" }}>

            <SectionHeading light>Experience</SectionHeading>

            <div
                className="experience-computer"
                style={{ backgroundImage: `url(${experienceComputer})` }}
            >
                <div className="experience-computer-screen">
                    <div className="experience-screen-folders" role="list" aria-label="Experience folders">
                        {items.map((item, index) => (
                            <button
                                key={item.folder}
                                type="button"
                                className={`experience-screen-folder ${active === index ? "is-active" : ""}`}
                                onClick={() => setActive(index)}
                                aria-pressed={active === index}
                                style={{
                                    "--folder-color": item.color,
                                    "--folder-tab-color": item.tabColor,
                                }}
                            >
                                <span className="experience-screen-folder-icon" aria-hidden="true" />
                                <span className="experience-screen-folder-label">{item.folder}</span>
                            </button>
                        ))}
                    </div>

                    {current && (
                        <article
                            className="experience-file-window"
                            key={current.folder}
                            style={{ "--window-accent": current.tabColor }}
                        >
                            <button
                                type="button"
                                className="experience-file-close"
                                aria-label="Close experience"
                                onClick={() => setActive(null)}
                            >
                                ×
                            </button>
                            <div className="experience-file-meta">
                                <span>{current.folder}</span>
                                <span>{current.year}</span>
                            </div>
                            <h3>{current.title}</h3>
                            <p>{current.sub}</p>
                            <div className="experience-file-tags" aria-label={`${current.title} skills`}>
                                {current.tags.map((tag) => (
                                    <em key={tag}>{tag}</em>
                                ))}
                            </div>
                        </article>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════ PROJECTS ══════════════════ */
const PROJECTS = [
    { tab: "Bluprint",   title: "Bluprint",   desc: "A room design website that takes user's style preferences and generates furniture recommendations. Includes a customizable diagram of room, visual representation of items recommended, and dashboard to view all decorated rooms.",   tags: ["React","Node.js","MongoDB"],               year: "2024", emoji: "🐚", image: bluprintProjectPreview, projectUrl: "https://bluprint-iroq.onrender.com/", color: C.fresh, ink: C.ink, descColor: C.ink },
    { tab: "Databridge", title: "Databridge", desc: "Detailed a technical specification for HGS internship: Microsoft Fabric-native financial data platform, defining the OneLake medallion architecture, Direct Lake semantic layer, capacity tiering, and security requirements across a 17-item decision register.\n", tags: ["Java","Javascript","HTML","Canvas API"], year: "2026", emoji: "🗺️", color: C.yellow, ink: C.ink, descColor: C.ink },
    { tab: "Djkstra",     title: "Shortest Path Route Finder",     desc: "Interactive graph traversal visualizer - Dijkstra, A*, BFS, DFS. Draw custom grids, place walls, watch algorithms explore in real time.",   tags: ["TypeScript","Node.js","WebSockets","OT"],  year: "2024", emoji: "📝", color: C.softpink, ink: C.ink, descColor: C.ink },
    { tab: "Incoming",        title: "Coming soon ...",        desc: "Browser extension that explains ML model predictions in plain language, showing feature importance as an inline overlay on supported sites.", tags: ["Python","ML","Chrome Extension","Flask"],  year: "2023", emoji: "🔍", color: C.azeitona, ink: C.ink, descColor: C.ink },
];
const DEFAULT_PROJECT_INDEX = 0;

function ProjectsSection() {
    const [active, setActive] = useState(DEFAULT_PROJECT_INDEX);
    const p = PROJECTS[active];
    const folderLayers = [
        { projectIndex: 3, name: "blue", src: projectFolderBlue, alt: "", className: "project-folder-layer-blue", zIndex: 2, paperAccent: "#93a7bf", paperTilt: "-1.2deg", paperStartX: "-5%", paperStartY: "-30%", noteRight: "-6%", noteTop: "30%", noteRotate: "-5deg", noteAspect: "0.82", noteColor: "#c9d8ce", noteLine: "rgba(255,255,255,0.3)", noteWidth: "clamp(124px, 16vw, 176px)", noteMobileWidth: "96px", copyLeft: "0px", copyRight: "clamp(118px, 16vw, 184px)", tagsLeft: "0px", tagsRight: "clamp(118px, 16vw, 184px)" },
        { projectIndex: 2, name: "beige", src: projectFolderBeige, alt: "", className: "project-folder-layer-beige", zIndex: 3, paperAccent: "#d4c7a4", paperTilt: "1deg", paperStartX: "5%", paperStartY: "-20%", noteRight: "-4%", noteTop: "12%", noteRotate: "4deg", noteAspect: "0.82", noteColor: "#f2e4a5", noteLine: "transparent", noteWidth: "clamp(124px, 16vw, 176px)", noteMobileWidth: "96px", copyLeft: "0px", copyRight: "clamp(108px, 15vw, 164px)", tagsLeft: "0px", tagsRight: "0px" },
        { projectIndex: 1, name: "pink", src: projectFolderPink, alt: "", className: "project-folder-layer-pink", zIndex: 4, paperAccent: "#c69bad", paperTilt: "-0.6deg", paperStartX: "2%", paperStartY: "-10%", noteRight: "86%", noteTop: "48%", noteRotate: "-7deg", noteAspect: "1", noteColor: "#eadc8f", noteLine: "rgba(255,255,255,0.3)", noteWidth: "clamp(152px, 19vw, 214px)", noteMobileWidth: "116px", copyLeft: "clamp(144px, 19vw, 224px)", copyRight: "0px", tagsLeft: "clamp(144px, 19vw, 224px)", tagsRight: "0px" },
        { projectIndex: 0, name: "green", src: projectFolderGreen, alt: "", className: "project-folder-layer-green", zIndex: 5, paperAccent: "#8ca07d", paperTilt: "0.8deg", paperStartX: "-4%", paperStartY: "8%", noteRight: "-9%", noteTop: "36%", noteRotate: "-6deg", noteAspect: "0.82", noteColor: "#c9d8ce", noteLine: "rgba(255,255,255,0.3)", noteWidth: "clamp(124px, 16vw, 176px)", noteMobileWidth: "96px", copyLeft: "0px", copyRight: "clamp(118px, 16vw, 184px)", tagsLeft: "0px", tagsRight: "clamp(118px, 16vw, 184px)" },
    ];
    const folderLabels = [
        { projectIndex: 3, className: "project-folder-label-blue" },
        { projectIndex: 2, className: "project-folder-label-beige" },
        { projectIndex: 1, className: "project-folder-label-pink" },
        { projectIndex: 0, className: "project-folder-label-green" },
    ];
    const activeFolderLayer = folderLayers.find((layer) => layer.projectIndex === active) ?? folderLayers[0];

    return (
        <section id="projects" style={{ background: C.cream, padding: "70px clamp(18px, 4vw, 52px)", position: "relative", overflow: "hidden" }}>

            <SectionHeading light>Projects</SectionHeading>

            <div className="projects-shell">
                <div className="project-folder-stack" role="tablist" aria-label="Projects">
                    {folderLayers.map((layer) => (
                        <img
                            key={layer.name}
                            src={layer.src}
                            alt={layer.alt}
                            aria-hidden="true"
                            className={`project-folder-layer ${layer.className}`}
                            style={{ zIndex: layer.zIndex }}
                            draggable="false"
                        />
                    ))}

                    {folderLabels.map(({ projectIndex, className }) => {
                        const proj = PROJECTS[projectIndex];
                        return (
                            <button
                                key={proj.tab}
                                type="button"
                                id={`project-tab-${projectIndex}`}
                                role="tab"
                                aria-selected={active === projectIndex}
                                aria-controls="project-panel"
                                className={`project-folder-label ${className} ${active === projectIndex ? "is-active" : ""}`}
                                onClick={() => setActive(projectIndex)}
                            >
                                {proj.tab}
                            </button>
                        );
                    })}

                    <article
                        key={active}
                        id="project-panel"
                        role="tabpanel"
                        aria-labelledby={`project-tab-${active}`}
                        className={`project-file-paper project-file-paper-${activeFolderLayer.name}`}
                        style={{
                            "--paper-accent": activeFolderLayer.paperAccent,
                            "--paper-tilt": activeFolderLayer.paperTilt,
                            "--paper-start-x": activeFolderLayer.paperStartX,
                            "--paper-start-y": activeFolderLayer.paperStartY,
                            "--grid-note-right": activeFolderLayer.noteRight,
                            "--grid-note-top": activeFolderLayer.noteTop,
                            "--grid-note-rotate": activeFolderLayer.noteRotate,
                            "--grid-note-aspect": activeFolderLayer.noteAspect,
                            "--grid-note-color": activeFolderLayer.noteColor,
                            "--grid-note-line": activeFolderLayer.noteLine,
                            "--grid-note-width": activeFolderLayer.noteWidth,
                            "--grid-note-mobile-width": activeFolderLayer.noteMobileWidth,
                            "--project-copy-left": activeFolderLayer.copyLeft,
                            "--project-copy-right": activeFolderLayer.copyRight,
                            "--project-tags-left": activeFolderLayer.tagsLeft,
                            "--project-tags-right": activeFolderLayer.tagsRight,
                        }}
                    >
                        <span className="project-grid-note" aria-hidden="true" />
                        <span className="project-paperclip" aria-hidden="true" />
                        <div className="project-paper-folder-name" aria-hidden="true">
                            <span>{p.tab}</span>
                        </div>
                        <div className="project-heading-row">
                            <p className="project-title">{p.title}</p>
                            <span className="project-year">{p.year}</span>
                        </div>
                        <p className="project-desc">{p.desc}</p>
                        <div className="project-tags" aria-label={`${p.title} software skills`}>
                            {p.tags.map(t => (
                                <span className="project-skill-sticker" key={t}>{t}</span>
                            ))}
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════ CONTACT ══════════════════ */
function ContactSection() {
    const terminalContacts = [
        {
            command: "contact.email",
            value: "aditi.amarnath@gmail.com",
            href: "mailto:aditi.amarnath@gmail.com",
        },
        {
            command: "contact.linkedin",
            value: "linkedin.com/in/aditi",
            href: "https://www.linkedin.com/in/aditi",
        },
        {
            command: "contact.github",
            value: "github.com/aditiaamarnath-rgb",
            href: "https://github.com/aditiaamarnath-rgb",
        },
    ];

    return (
        <section id="contactme" style={{ background: C.bgMid, padding: "90px 52px 110px", position: "relative", overflow: "hidden", isolation: "isolate" }}>

            <div className="contact-vinyl-stage" aria-hidden="true">
                <div className="contact-vinyl">
                    <img src={vinylStarStickers} alt="" className="contact-vinyl-sticker contact-vinyl-sticker-stars" />
                    <img src={vinylTrebleSticker} alt="" className="contact-vinyl-sticker contact-vinyl-sticker-treble" />
                    <img src={vinylButterflySticker} alt="" className="contact-vinyl-sticker contact-vinyl-sticker-butterfly" />
                    <img src={vinylStrawberrySticker} alt="" className="contact-vinyl-sticker contact-vinyl-sticker-strawberry" />
                    <img src={vinylSpiderSticker} alt="" className="contact-vinyl-sticker contact-vinyl-sticker-spider" />
                    <img src={vinylAppleSticker} alt="" className="contact-vinyl-sticker contact-vinyl-sticker-apple" />
                    <img src={vinylSproutSticker} alt="" className="contact-vinyl-sticker contact-vinyl-sticker-sprout" />
                    <img src={vinylJellyfishSticker} alt="" className="contact-vinyl-sticker contact-vinyl-sticker-jellyfish" />
                    <img src={vinylRabbitStampSticker} alt="" className="contact-vinyl-sticker contact-vinyl-sticker-rabbit-stamp" />
                    <div className="contact-vinyl-label">
                        <span>Limited Edition</span>
                    </div>
                </div>
            </div>

            <div style={{ position: "relative", zIndex: 2 }}>
                <SectionHeading light>Contact Information</SectionHeading>
            </div>

            <div className="contact-terminal-shell">
                <div className="contact-terminal">
                    <div className="contact-terminal-header">
                        <span className="contact-terminal-dot" />
                        <span className="contact-terminal-dot" />
                        <span className="contact-terminal-dot" />
                        <span className="contact-terminal-path">aditi@portfolio:~</span>
                    </div>
                    <div className="contact-terminal-body">
                        {terminalContacts.map((item) => (
                            <div className="contact-terminal-block" key={item.command}>
                                <p className="contact-terminal-command">&gt; {item.command}</p>
                                <a
                                    className="contact-terminal-output"
                                    href={item.href}
                                    target={item.href.startsWith("http") ? "_blank" : undefined}
                                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                                >
                                    {item.value}
                                </a>
                            </div>
                        ))}
                        <div className="contact-terminal-block contact-terminal-resume">
                            <p className="contact-terminal-command contact-terminal-prompt">&gt; do you want to download resume? (y) or (n)      y</p>
                            <a
                                className="contact-terminal-output contact-terminal-resume-link"
                                href="/resume.pdf"
                                download
                            >
                                download resume
                            </a>
                        </div>
                        <span className="contact-terminal-cursor" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════ ROOT ══════════════════ */
export default function App() {
    return (
        <>
            <InjectFonts />
            <SpeedInsights />
            <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0b1509; }
        button { outline: none; }
        .about-corkboard-section {
          background: #303d47;
          padding: 72px clamp(16px, 4vw, 52px) 86px;
          position: relative;
          overflow: hidden;
        }
        .about-corkboard-frame {
          max-width: 1260px;
          min-height: clamp(690px, 59vw, 770px);
          margin: 0 auto;
          border: 3px solid #362F22;
          border-radius: 8px;
          background: #362F22;
          box-shadow: 10px 12px 0 rgba(0,0,0,0.24);
          overflow: hidden;
          position: relative;
        }
        .about-corkboard-image {
          display: block;
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          object-position: center;
          z-index: 0;
        }
        .about-corkboard-postits.about-stack-grid {
          position: absolute;
          left: 6%;
          right: 6%;
          top: 20%;
          bottom: 8%;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 315px));
          justify-content: center;
          gap: clamp(28px, 4vw, 52px);
          margin: 0;
          max-width: none;
          align-items: start;
        }
        .about-board-postit {
          min-height: 360px;
          color: #2B2420;
          filter: drop-shadow(7px 8px 0 rgba(43,36,32,0.2));
        }
        .about-paper-ref-pink.about-board-postit {
          min-height: 500px;
        }
        .about-board-postit::after {
          content: "";
          position: absolute;
          top: 12px;
          right: 16px;
          width: 15px;
          height: 15px;
          border: 2px solid rgba(43,36,32,0.68);
          border-radius: 50%;
          background:
            radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85), transparent 24%),
            #b97d7b;
          box-shadow: 2px 3px 0 rgba(43,36,32,0.18);
        }
        .about-draggable-sticker-layer {
          position: absolute;
          inset: 0;
          z-index: 80;
          pointer-events: none;
        }
        .about-draggable-sticker {
          position: absolute;
          width: var(--sticker-width);
          border: 0;
          background: transparent;
          padding: 0;
          cursor: grab;
          display: grid;
          place-items: center;
          touch-action: none;
          user-select: none;
          pointer-events: auto;
          transform: translate(-50%, -50%) rotate(var(--sticker-rotate));
          transform-origin: center center;
          transition: filter 160ms ease;
        }
        .about-draggable-sticker img {
          --white-sticker-border:
            drop-shadow(1px 0 0 #fff)
            drop-shadow(-1px 0 0 #fff)
            drop-shadow(0 1px 0 #fff)
            drop-shadow(0 -1px 0 #fff)
            drop-shadow(0.75px 0.75px 0 #fff)
            drop-shadow(-0.75px 0.75px 0 #fff)
            drop-shadow(0.75px -0.75px 0 #fff)
            drop-shadow(-0.75px -0.75px 0 #fff);
          display: block;
          width: 100%;
          height: auto;
          pointer-events: none;
          user-select: none;
          filter: var(--white-sticker-border) drop-shadow(3px 5px 0 rgba(43,36,32,0.24));
        }
        .about-draggable-sticker:hover,
        .about-draggable-sticker:focus-visible {
          z-index: 4;
          filter: brightness(1.04);
        }
        .about-draggable-sticker:focus-visible {
          outline: 3px solid rgba(237,227,156,0.85);
          outline-offset: 6px;
          border-radius: 10px;
        }
        .about-draggable-sticker.is-dragging {
          z-index: 12;
          cursor: grabbing;
          filter: brightness(1.06);
          transition: none;
        }
        .about-draggable-sticker .about-hobby-blurb {
          top: auto;
          bottom: calc(100% + 10px);
          left: 50%;
          width: 176px;
          transform: translate(-50%, 10px) rotate(-1deg) scale(0.94);
        }
        .about-draggable-sticker:hover .about-hobby-blurb,
        .about-draggable-sticker:focus-visible .about-hobby-blurb {
          opacity: 1;
          transform: translate(-50%, 0) rotate(-1deg) scale(1);
        }
        .about-draggable-sticker.is-dragging .about-hobby-blurb {
          opacity: 0;
        }
        @media (max-width: 760px) {
          .about-corkboard-section {
            padding: 48px 14px 58px;
          }
          .about-corkboard-frame {
            min-height: 1180px;
          }
          .about-corkboard-image {
            object-position: left top;
          }
          .about-corkboard-postits.about-stack-grid {
            position: relative;
            display: grid;
            gap: 16px;
            padding: 138px 18px 26px;
            left: auto;
            right: auto;
            top: auto;
            bottom: auto;
            grid-template-columns: 1fr;
          }
          .about-board-postit {
            width: min(100%, 360px);
            min-height: 0;
          }
          .about-corkboard-postits .about-stack-shell {
            padding-top: 16px;
          }
          .about-corkboard-postits .about-stack-angle {
            transform: rotate(0deg);
          }
        }
        .experience-computer {
          width: min(1420px, 108vw);
          max-width: none;
          aspect-ratio: 16 / 9;
          margin: 10px 0 0;
          position: relative;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }
        .experience-computer-screen {
          position: absolute;
          left: 22.65%;
          top: 12.68%;
          width: 55.72%;
          height: 52.58%;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: minmax(138px, 0.74fr) minmax(0, 1.26fr);
          gap: clamp(8px, 1.35vw, 18px);
          align-items: start;
          padding: clamp(12px, 1.95vw, 24px);
          overflow: hidden;
        }
        .experience-screen-folders {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(8px, 1.05vw, 14px) clamp(6px, 0.9vw, 12px);
          align-content: start;
          position: relative;
          z-index: 2;
        }
        .experience-screen-folder {
          --folder-color: #ede39c;
          --folder-tab-color: #e4ce5e;
          width: 100%;
          min-height: clamp(66px, 7.4vw, 92px);
          border: 0;
          border-radius: 6px;
          padding: 5px 4px 4px;
          color: #202832;
          background: rgba(255,255,255,0.12);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 5px;
          transition:
            transform 180ms ease,
            background-color 180ms ease,
            box-shadow 180ms ease,
            filter 180ms ease;
        }
        .experience-screen-folder:hover,
        .experience-screen-folder:focus-visible,
        .experience-screen-folder.is-active {
          background: rgba(255,255,255,0.36);
          box-shadow: inset 0 0 0 2px rgba(54,47,34,0.12);
          filter: brightness(1.03);
          transform: translateY(-3px);
        }
        .experience-screen-folder:focus-visible {
          outline: 3px solid rgba(185,125,123,0.82);
          outline-offset: 2px;
        }
        .experience-screen-folder-icon {
          position: relative;
          width: clamp(44px, 5.2vw, 66px);
          height: clamp(32px, 3.8vw, 48px);
          margin-top: 8px;
          border: 2px solid #362F22;
          border-radius: 5px;
          background-color: var(--folder-color);
          background-image:
            repeating-linear-gradient(90deg, rgba(54,47,34,0.07) 0 1px, transparent 1px 8px),
            linear-gradient(145deg, rgba(255,255,255,0.26), rgba(43,36,32,0.04));
          box-shadow: 4px 5px 0 rgba(0,0,0,0.16);
        }
        .experience-screen-folder-icon::before {
          content: "";
          position: absolute;
          left: -2px;
          top: -13px;
          width: 34px;
          height: 14px;
          border: 2px solid #362F22;
          border-bottom: 0;
          border-radius: 5px 5px 0 0;
          background-color: var(--folder-tab-color);
          background-image: linear-gradient(145deg, rgba(255,255,255,0.24), rgba(43,36,32,0.04));
        }
        .experience-screen-folder-label {
          max-width: 100%;
          font-family: 'Nunito', sans-serif;
          font-size: clamp(10px, 1.05vw, 13px);
          font-weight: 900;
          line-height: 1.12;
          letter-spacing: 0;
          text-align: center;
          overflow-wrap: anywhere;
        }
        .experience-file-window {
          --window-accent: #758061;
          position: relative;
          z-index: 3;
          min-width: 0;
          max-height: 100%;
          align-self: start;
          display: flex;
          flex-direction: column;
          min-height: clamp(220px, 23vw, 300px);
          padding: clamp(22px, 2.6vw, 32px);
          background: #e6eaed;
          border: 3px solid #362F22;
          border-radius: 8px;
          color: #362F22;
          box-shadow: 6px 7px 0 rgba(0,0,0,0.18);
          overflow: hidden;
          animation: experienceWindowOpen 240ms cubic-bezier(0.2, 0.8, 0.24, 1) both;
        }
        .experience-file-window::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 8px;
          background: var(--window-accent);
          border-bottom: 3px solid #362F22;
        }
        .experience-file-close {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 2;
          width: 27px;
          height: 27px;
          border: 2px solid #362F22;
          border-radius: 5px;
          padding: 0;
          display: grid;
          place-items: center;
          color: #362F22;
          background: rgba(255,255,255,0.64);
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 18px;
          font-weight: 900;
          line-height: 1;
        }
        .experience-file-close:hover,
        .experience-file-close:focus-visible {
          background: #ede39c;
        }
        .experience-file-close:focus-visible {
          outline: 2px solid rgba(185,125,123,0.82);
          outline-offset: 2px;
        }
        .experience-file-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin: 12px 34px 12px 0;
        }
        .experience-file-meta span {
          display: inline-flex;
          padding: 5px 8px;
          color: #362F22;
          background: rgba(255,255,255,0.56);
          border: 2px solid rgba(54,47,34,0.5);
          border-radius: 4px;
          font-family: 'Nunito', sans-serif;
          font-size: clamp(9px, 0.9vw, 11px);
          font-weight: 900;
          letter-spacing: 0.08em;
          line-height: 1;
          text-transform: uppercase;
        }
        .experience-file-meta span:first-child {
          background: color-mix(in srgb, var(--window-accent) 44%, #fff8ea);
        }
        @keyframes experienceWindowOpen {
          0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .experience-file-window h3 {
          margin: 0 0 8px;
          color: #362F22;
          font-family: 'Playfair Display', serif;
          font-size: clamp(18px, 2.25vw, 29px);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: 0;
        }
        .experience-file-window p {
          max-width: 560px;
          color: rgba(54,47,34,0.78);
          font-family: 'Nunito', sans-serif;
          font-size: clamp(12px, 1.2vw, 15px);
          line-height: 1.5;
          margin: 0;
        }
        .experience-file-tags {
          display: flex;
          flex-wrap: wrap;
          margin-top: auto;
          padding-top: clamp(18px, 2vw, 28px);
          gap: 8px;
        }
        .experience-file-tags em {
          color: #362F22;
          background: rgba(255,255,255,0.5);
          border: 2px solid rgba(54,47,34,0.46);
          border-radius: 4px;
          font-family: 'Nunito', sans-serif;
          font-size: clamp(10px, 0.95vw, 12px);
          font-weight: 900;
          font-style: normal;
          line-height: 1;
          letter-spacing: 0;
          padding: 6px 8px;
        }
        .projects-shell {
          max-width: 1220px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .project-folder-stack {
          position: relative;
          width: min(94vw, 900px);
          aspect-ratio: 1.32;
          margin: 6px auto 0;
          filter: drop-shadow(0 14px 16px rgba(0,0,0,0.26));
        }
        .project-folder-layer {
          position: absolute;
          display: block;
          height: auto;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
        }
        .project-folder-layer-blue {
          top: -10%;
          left: 7%;
          width: 86%;
          z-index: 2;
        }
        .project-folder-layer-beige {
          top: 2.5%;
          left: 7%;
          width: 86%;
          z-index: 3;
        }
        .project-folder-layer-pink {
          top: 8.5%;
          left: 7%;
          width: 86%;
          z-index: 4;
        }
        .project-folder-layer-green {
          top: 14%;
          left: 7%;
          width: 86%;
          z-index: 5;
        }
        .project-folder-label {
          position: absolute;
          z-index: 20;
          border: 0;
          border-radius: 12px;
          padding: 0;
          color: #2B2420;
          background: transparent;
          font-family: 'Nunito', sans-serif;
          font-size: clamp(10px, 1.28vw, 14px);
          font-weight: 900;
          letter-spacing: 0.04em;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          transition: none;
        }
        .project-folder-label:hover,
        .project-folder-label:focus-visible,
        .project-folder-label.is-active {
          background: transparent;
          box-shadow: none;
          color: #17120f;
          text-shadow: 0 1px 0 rgba(255,255,255,0.48);
          transform: translateY(-1px);
        }
        .project-folder-label:focus-visible {
          outline: 2px solid rgba(237,227,156,0.95);
          outline-offset: -5px;
        }
        .project-folder-label-blue {
          top: -2.5%;
          left: 8%;
          width: 35%;
          height: 12%;
        }
        .project-folder-label-beige {
          top: 3.5%;
          left: 56%;
          width: 35%;
          height: 13%;
        }
        .project-folder-label-pink {
          top: 10%;
          left: 35%;
          width: 34%;
          height: 12%;
        }
        .project-folder-label-green {
          top: 17%;
          left: 9%;
          width: 35%;
          height: 14%;
        }
        .project-file-paper {
          position: absolute;
          z-index: 18;
          left: 13%;
          right: 11%;
          top: 27%;
          bottom: 5%;
          padding: clamp(18px, 2.7vw, 32px) clamp(18px, 3.4vw, 38px) clamp(18px, 2.7vw, 30px);
          color: #2B2420;
          overflow: visible;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          background:
            linear-gradient(90deg, transparent 0 clamp(33px, 4vw, 44px), rgba(185,125,123,0.34) clamp(33px, 4vw, 44px) calc(clamp(33px, 4vw, 44px) + 2px), transparent calc(clamp(33px, 4vw, 44px) + 2px)),
            linear-gradient(110deg, rgba(255,255,255,0.56), transparent 42%),
            repeating-linear-gradient(0deg, transparent 0 30px, rgba(99,82,55,0.16) 31px 33px),
            #fbf3d8;
          border: 4px solid rgba(54,47,34,0.48);
          box-shadow:
            0 18px 24px rgba(0,0,0,0.24),
            inset 0 0 0 2px rgba(255,255,255,0.36),
            5px 6px 0 rgba(43,36,32,0.16);
          transform: translateY(0) rotate(var(--paper-tilt));
          transform-origin: 50% 92%;
          animation: projectPaperUnfile 480ms cubic-bezier(0.2, 0.8, 0.24, 1) both;
        }
        .project-file-paper::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: clamp(16px, 2vw, 22px);
          background:
            linear-gradient(90deg, rgba(255,255,255,0.22), transparent 36%),
            var(--paper-accent);
          border-bottom: 3px solid rgba(43,36,32,0.28);
          z-index: 0;
        }
        .project-file-paper::after {
          content: "";
          position: absolute;
          left: clamp(18px, 2.2vw, 30px);
          top: clamp(54px, 6vw, 72px);
          width: 13px;
          height: clamp(92px, 12vw, 126px);
          background:
            radial-gradient(circle at 50% 8px, #fbf3d8 0 4.5px, rgba(43,36,32,0.16) 5px 6px, transparent 6.5px),
            radial-gradient(circle at 50% 44px, #fbf3d8 0 4.5px, rgba(43,36,32,0.16) 5px 6px, transparent 6.5px),
            radial-gradient(circle at 50% 80px, #fbf3d8 0 4.5px, rgba(43,36,32,0.16) 5px 6px, transparent 6.5px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.72;
        }
        .project-file-paper > * {
          position: relative;
          z-index: 1;
          opacity: 0;
          animation: projectPaperElementIn 260ms ease both;
          animation-delay: 220ms;
        }
        .project-file-paper .project-grid-note {
          animation-delay: 280ms;
        }
        .project-file-paper .project-paperclip {
          animation-delay: 290ms;
        }
        .project-file-paper .project-paper-folder-name {
          animation-delay: 310ms;
        }
        .project-file-paper .project-heading-row {
          animation-delay: 340ms;
        }
        .project-file-paper .project-desc {
          animation-delay: 380ms;
        }
        .project-file-paper .project-tags {
          animation-delay: 420ms;
        }
        .project-file-paper .project-skill-sticker {
          opacity: 0;
          animation: projectPaperElementIn 220ms ease both;
        }
        .project-file-paper .project-skill-sticker:nth-child(1) {
          animation-delay: 470ms;
        }
        .project-file-paper .project-skill-sticker:nth-child(2) {
          animation-delay: 510ms;
        }
        .project-file-paper .project-skill-sticker:nth-child(3) {
          animation-delay: 550ms;
        }
        .project-file-paper .project-skill-sticker:nth-child(4) {
          animation-delay: 590ms;
        }
        .project-paperclip {
          position: absolute;
          top: clamp(-12px, -1.1vw, -8px);
          right: clamp(44px, 6vw, 74px);
          z-index: 5;
          width: clamp(24px, 3vw, 34px);
          height: clamp(42px, 5.4vw, 58px);
          border: 3px solid #9d8b62;
          border-bottom-color: transparent;
          border-radius: 999px 999px 0 0;
          transform: rotate(10deg);
          box-shadow: 1px 2px 0 rgba(54,47,34,0.18);
          pointer-events: none;
        }
        .project-paperclip::after {
          content: "";
          position: absolute;
          left: 5px;
          top: 7px;
          width: 12px;
          height: 33px;
          border: 2px solid #9d8b62;
          border-bottom-color: transparent;
          border-radius: 999px 999px 0 0;
        }
        .project-paper-folder-name {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 10px;
          margin-left: var(--project-copy-left);
          margin-right: var(--project-copy-right);
        }
        .project-paper-folder-name span {
          display: inline-flex;
          align-items: center;
          min-height: 25px;
          padding: 5px 12px;
          font-family: 'Nunito', sans-serif;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          line-height: 1;
          text-transform: uppercase;
          color: #2B2420;
          background: color-mix(in srgb, var(--paper-accent) 54%, #fff8ea);
          border: 1px solid rgba(43,36,32,0.24);
          box-shadow: 2px 3px 0 rgba(43,36,32,0.12);
        }
        .project-grid-note {
          position: absolute;
          right: var(--grid-note-right);
          top: var(--grid-note-top);
          z-index: 3;
          width: var(--grid-note-width);
          aspect-ratio: var(--grid-note-aspect);
          background:
            linear-gradient(90deg, var(--grid-note-line) 1px, transparent 1px) 0 0 / 14px 14px,
            linear-gradient(0deg, var(--grid-note-line) 1px, transparent 1px) 0 0 / 14px 14px,
            linear-gradient(145deg, rgba(255,255,255,0.34), rgba(98,125,120,0.08)),
            var(--grid-note-color);
          border: 1px solid rgba(54,47,34,0.2);
          box-shadow: 0 10px 14px rgba(43,36,32,0.16);
          transform: rotate(var(--grid-note-rotate));
          pointer-events: none;
        }
        @keyframes projectPaperUnfile {
          0% {
            opacity: 0.2;
            transform: translate(var(--paper-start-x), var(--paper-start-y)) rotate(calc(var(--paper-tilt) - 2deg)) scale(0.96);
          }
          62% {
            opacity: 1;
            transform: translate(0, -2.5%) rotate(calc(var(--paper-tilt) + 0.6deg)) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translate(0, 0) rotate(var(--paper-tilt)) scale(1);
          }
        }
        @keyframes projectPaperElementIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .project-heading-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 10px;
          margin-left: var(--project-copy-left);
          margin-right: var(--project-copy-right);
        }
        .project-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 900;
          line-height: 1.02;
          color: #2B2420;
          margin: 0;
          max-width: 720px;
        }
        .project-year {
          display: inline-block;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          color: #2B2420;
          background: rgba(255,248,234,0.62);
          border: 1px solid rgba(43,36,32,0.26);
          box-shadow: 2px 3px 0 rgba(0,0,0,0.1);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 9px;
          transform: rotate(2deg);
        }
        .project-desc {
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          line-height: 1.62;
          color: #2B2420;
          margin: 0 var(--project-copy-right) 0 var(--project-copy-left);
          max-width: 630px;
        }
        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          max-width: calc(100% - var(--project-tags-left) - var(--project-tags-right));
          margin-top: auto;
          margin-left: var(--project-tags-left);
          margin-right: var(--project-tags-right);
          padding-top: 20px;
        }
        .project-skill-sticker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 36px;
          padding: 8px 12px;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 800;
          color: #2B2420;
          background: rgba(255,248,234,0.64);
          border: 1px solid rgba(43,36,32,0.26);
          border-radius: 999px;
          box-shadow: 2px 3px 0 rgba(0,0,0,0.1);
          letter-spacing: 0.03em;
          transform: rotate(-0.7deg);
        }
        .project-skill-sticker:nth-child(2n) {
          transform: rotate(1deg);
        }
        .project-skill-sticker:nth-child(3n) {
          transform: rotate(-0.4deg);
        }
        .contact-terminal-shell {
          max-width: 650px;
          position: relative;
          z-index: 2;
          transform: rotate(-0.5deg);
          padding: 14px;
          background:
            repeating-linear-gradient(90deg, rgba(54,47,34,0.06) 0 1px, transparent 1px 7px),
            linear-gradient(120deg, rgba(255,255,255,0.2), rgba(43,36,32,0.04)),
            #e6eaed;
          border: 3px solid #362F22;
          border-radius: 4px;
          box-shadow: 8px 8px 0 rgba(0,0,0,0.32);
        }
        .contact-terminal {
          border: 3px solid #362F22;
          border-radius: 4px;
          overflow: hidden;
          background: #141b20;
          box-shadow:
            inset 0 0 0 1px rgba(230,234,237,0.06),
            4px 4px 0 rgba(0,0,0,0.18);
        }
        .contact-terminal-header {
          min-height: 38px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 14px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.06)),
            #303d47;
          border-bottom: 3px solid #362F22;
        }
        .contact-terminal-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #b97d7b;
          border: 1px solid rgba(0,0,0,0.3);
          flex: 0 0 auto;
        }
        .contact-terminal-dot:nth-child(2) {
          background: #ede39c;
        }
        .contact-terminal-dot:nth-child(3) {
          background: #6c9770;
        }
        .contact-terminal-path {
          margin-left: 8px;
          font-family: 'Inter', monospace;
          font-size: 12px;
          font-weight: 700;
          color: #c0cab8;
          letter-spacing: 0.02em;
        }
        .contact-terminal-body {
          min-height: 310px;
          padding: 30px 34px 34px;
          background:
            repeating-linear-gradient(to bottom, rgba(230,234,237,0.035) 0 1px, transparent 1px 28px),
            radial-gradient(circle at 18% 20%, rgba(89,109,133,0.2), transparent 30%),
            linear-gradient(120deg, rgba(255,255,255,0.02), rgba(0,0,0,0.12)),
            #141b20;
          color: #c0cab8;
        }
        .contact-terminal-block {
          margin-bottom: 24px;
        }
        .contact-terminal-command,
        .contact-terminal-output {
          font-family: 'Inter', 'Courier New', monospace;
          font-size: clamp(14px, 1.55vw, 17px);
          line-height: 1.55;
          letter-spacing: 0;
        }
        .contact-terminal-command {
          color: #c0cab8;
          margin: 0 0 4px;
          font-weight: 700;
        }
        .contact-terminal-command::first-letter {
          color: #b97d7b;
        }
        .contact-terminal-prompt {
          white-space: pre-wrap;
        }
        .contact-terminal-output {
          display: inline-block;
          color: #e6eaed;
          text-decoration: none;
          word-break: break-word;
          padding-left: 20px;
        }
        .contact-terminal-resume-link {
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .contact-terminal-output:hover,
        .contact-terminal-output:focus-visible {
          color: #ede39c;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .contact-terminal-output:focus-visible {
          outline: 2px solid #ede39c;
          outline-offset: 4px;
        }
        .contact-terminal-cursor {
          display: inline-block;
          width: 9px;
          height: 18px;
          background: #b97d7b;
          box-shadow: 0 0 12px rgba(185,125,123,0.35);
          animation: contact-terminal-cursor 1.1s steps(2, start) infinite;
        }
        .contact-vinyl-stage {
          position: absolute;
          top: 44%;
          right: clamp(-340px, -22vw, -190px);
          width: clamp(420px, 47vw, 650px);
          aspect-ratio: 1;
          z-index: 0;
          pointer-events: none;
          transform: translateY(-44%);
          opacity: 1;
        }
        .contact-vinyl {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background:
            repeating-radial-gradient(circle at center, #0b0b0d 0 7px, #1a1a1d 7px 8px, #080809 8px 15px),
            conic-gradient(from -18deg, #070708, #2b2b2f 9%, #111114 19%, #050506 31%, #232328 48%, #09090a 65%, #1d1d20 82%, #070708);
          box-shadow:
            inset 0 0 0 10px rgba(255,255,255,0.04),
            inset 0 0 0 17px rgba(0,0,0,0.6),
            inset 0 0 42px rgba(255,255,255,0.08),
            18px 24px 0 rgba(0,0,0,0.18);
          animation: contact-vinyl-spin 42s linear infinite;
          overflow: hidden;
        }
        .contact-vinyl::before {
          content: "";
          position: absolute;
          inset: 4.5%;
          border-radius: 50%;
          background:
            linear-gradient(115deg, transparent 0 38%, rgba(255,255,255,0.14) 46%, transparent 56%),
            repeating-radial-gradient(circle at center, transparent 0 17px, rgba(255,255,255,0.11) 17px 18px, transparent 18px 29px);
          opacity: 0.65;
          mix-blend-mode: screen;
        }
        .contact-vinyl::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          box-shadow:
            inset 0 0 0 3px rgba(255,255,255,0.08),
            inset 0 0 0 7px rgba(0,0,0,0.75);
        }
        .contact-vinyl-label {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 31%;
          aspect-ratio: 1;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 17%;
          border-radius: 50%;
          color: #14120f;
          background:
            radial-gradient(circle at 32% 28%, rgba(255,255,255,0.58), transparent 22%),
            radial-gradient(circle at center, #efe7da 0 58%, #d7cbb8 59% 63%, #f2eadf 64% 100%);
          box-shadow:
            inset 0 0 0 3px rgba(54,47,34,0.2),
            inset 0 0 0 10px rgba(255,255,255,0.28),
            0 0 0 8px rgba(0,0,0,0.54);
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .contact-vinyl-label::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: #19171a;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.24);
          transform: translate(-50%, -50%);
        }
        .contact-vinyl-label::after {
          content: "";
          position: absolute;
          left: 16%;
          right: 16%;
          bottom: 25%;
          height: 2px;
          background: rgba(54,47,34,0.22);
          box-shadow: 0 9px 0 rgba(54,47,34,0.16), 0 -9px 0 rgba(54,47,34,0.13);
        }
        .contact-vinyl-label span {
          font-family: 'Nunito', sans-serif;
          font-size: clamp(10px, 1.2vw, 17px);
          font-weight: 800;
          letter-spacing: 0.17em;
          line-height: 1;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .contact-vinyl-sticker {
          --vinyl-sticker-border:
            drop-shadow(1px 0 0 #fff)
            drop-shadow(-1px 0 0 #fff)
            drop-shadow(0 1px 0 #fff)
            drop-shadow(0 -1px 0 #fff)
            drop-shadow(0.75px 0.75px 0 #fff)
            drop-shadow(-0.75px 0.75px 0 #fff)
            drop-shadow(0.75px -0.75px 0 #fff)
            drop-shadow(-0.75px -0.75px 0 #fff);
          position: absolute;
          z-index: 1;
          left: var(--vinyl-sticker-left);
          top: var(--vinyl-sticker-top);
          width: var(--vinyl-sticker-width);
          height: auto;
          object-fit: contain;
          border-radius: var(--vinyl-sticker-radius, 12px);
          opacity: 1;
          pointer-events: none;
          user-select: none;
          transform: translate(-50%, -50%) rotate(var(--vinyl-sticker-rotate));
          filter: var(--vinyl-sticker-border) drop-shadow(2px 4px 0 rgba(0,0,0,0.34));
        }
        .contact-vinyl-sticker-stars {
          --vinyl-sticker-left: 34%;
          --vinyl-sticker-top: 22%;
          --vinyl-sticker-width: 23%;
          --vinyl-sticker-rotate: -13deg;
          --vinyl-sticker-radius: 18px;
        }
        .contact-vinyl-sticker-treble {
          --vinyl-sticker-left: 70%;
          --vinyl-sticker-top: 30%;
          --vinyl-sticker-width: 14%;
          --vinyl-sticker-rotate: 14deg;
          --vinyl-sticker-radius: 16px;
        }
        .contact-vinyl-sticker-butterfly {
          --vinyl-sticker-left: 31%;
          --vinyl-sticker-top: 67%;
          --vinyl-sticker-width: 14%;
          --vinyl-sticker-rotate: 10deg;
          --vinyl-sticker-radius: 10px;
        }
        .contact-vinyl-sticker-strawberry {
          --vinyl-sticker-left: 67%;
          --vinyl-sticker-top: 70%;
          --vinyl-sticker-width: 11%;
          --vinyl-sticker-rotate: -8deg;
          --vinyl-sticker-radius: 11px;
        }
        .contact-vinyl-sticker-spider {
          --vinyl-sticker-left: 50%;
          --vinyl-sticker-top: 82%;
          --vinyl-sticker-width: 18%;
          --vinyl-sticker-rotate: 5deg;
          --vinyl-sticker-radius: 50%;
        }
        .contact-vinyl-sticker-apple {
          --vinyl-sticker-left: 18%;
          --vinyl-sticker-top: 49%;
          --vinyl-sticker-width: 18%;
          --vinyl-sticker-rotate: -17deg;
          --vinyl-sticker-radius: 18px;
        }
        .contact-vinyl-sticker-sprout {
          --vinyl-sticker-left: 55%;
          --vinyl-sticker-top: 16%;
          --vinyl-sticker-width: 12%;
          --vinyl-sticker-rotate: 9deg;
          --vinyl-sticker-radius: 18px;
        }
        .contact-vinyl-sticker-jellyfish {
          --vinyl-sticker-left: 83%;
          --vinyl-sticker-top: 51%;
          --vinyl-sticker-width: 13%;
          --vinyl-sticker-rotate: 13deg;
          --vinyl-sticker-radius: 18px;
        }
        .contact-vinyl-sticker-rabbit-stamp {
          --vinyl-sticker-left: 77%;
          --vinyl-sticker-top: 83%;
          --vinyl-sticker-width: 19%;
          --vinyl-sticker-rotate: -10deg;
          --vinyl-sticker-radius: 10px;
        }
        @keyframes contact-vinyl-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes contact-terminal-cursor {
          50% {
            opacity: 0;
          }
        }
        .about-stack-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 48px;
          max-width: 1240px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          align-items: start;
        }
        .about-stack-shell {
          position: relative;
          padding-top: 32px;
          perspective: 1300px;
        }
        .about-stack-angle {
          transform: rotate(var(--about-rotate));
          transition: transform 520ms cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: center 24px;
        }
        .about-stack-shell:hover .about-stack-angle {
          transform: rotate(0deg) translateY(-4px);
        }
        .about-paper-reveal {
          position: relative;
          height: var(--about-paper-height);
          opacity: 0;
          filter: drop-shadow(0 14px 18px rgba(0,0,0,0.24));
          transition: opacity 0.12s linear;
        }
        .about-paper-reveal.is-cascading {
          opacity: 1;
        }
        .about-paper-mask {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          max-height: 0;
          overflow: hidden;
          will-change: max-height;
        }
        .about-paper-reveal.is-cascading .about-paper-mask {
          animation: about-paper-mask-unfurl 1.62s cubic-bezier(0.2, 0.78, 0.22, 1) both;
          animation-delay: var(--about-delay);
        }
        .about-paper-reveal.has-unfurled .about-paper-mask {
          overflow: visible;
        }
        .about-paper-surface {
          position: relative;
          overflow: hidden;
        }
        .about-paper-ref-teal {
          background-color: #9fc1bd;
          background-image:
            repeating-linear-gradient(to bottom, transparent 0 15px, rgba(255,255,255,0.34) 15px 16px),
            linear-gradient(105deg, rgba(255,255,255,0.2), rgba(43,36,32,0.04)),
            radial-gradient(circle at 18% 20%, rgba(255,255,255,0.18), transparent 30%);
          box-shadow: inset 0 0 0 2px rgba(255,255,255,0.38), inset 0 -18px 28px rgba(43,36,32,0.08);
        }
        .about-paper-ref-pink {
          background-color: #d99397;
          background-image:
            radial-gradient(circle at 18% 24%, rgba(255,255,255,0.16), transparent 26%),
            radial-gradient(circle at 76% 18%, rgba(43,36,32,0.08), transparent 24%),
            linear-gradient(175deg, rgba(255,255,255,0.18), rgba(43,36,32,0.05));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2), inset 0 -18px 30px rgba(43,36,32,0.08);
        }
        .about-paper-ref-grid {
          background-color: #f3eadf;
          background-image:
            linear-gradient(rgba(88,130,150,0.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(88,130,150,0.22) 1px, transparent 1px),
            linear-gradient(105deg, rgba(255,255,255,0.28), rgba(43,36,32,0.04));
          background-size: 18px 18px, 18px 18px, auto;
          box-shadow: inset 0 0 0 1px rgba(43,36,32,0.08), inset 18px 0 0 rgba(220,210,199,0.42);
        }
        .about-paper-ref-grid::before {
          content: "";
          position: absolute;
          top: 34px;
          bottom: 34px;
          left: 15px;
          width: 12px;
          background-image: radial-gradient(circle, #34434c 0 4px, transparent 4.6px);
          background-size: 12px 34px;
          background-repeat: repeat-y;
          z-index: 0;
          pointer-events: none;
        }
        .about-paper-ref-grid .about-paper-section {
          padding-left: 44px;
        }
        .about-ref-torn-teal {
          clip-path: polygon(2% 0%, 11% 1.5%, 21% 0.5%, 36% 2%, 48% 0%, 64% 1.5%, 78% 0.5%, 97% 1.5%, 99% 12%, 97% 27%, 100% 42%, 97% 56%, 99% 73%, 96% 89%, 98% 100%, 84% 98.5%, 67% 100%, 51% 98%, 35% 99.5%, 18% 98%, 3% 100%, 1% 88%, 3% 75%, 0% 58%, 2% 42%, 0.5% 26%, 2% 12%);
        }
        .about-ref-torn-pink {
          clip-path: polygon(0% 5%, 13% 3%, 29% 4.5%, 44% 2.5%, 61% 4%, 79% 2.5%, 100% 5%, 98% 17%, 100% 33%, 98% 48%, 100% 65%, 98% 82%, 100% 97%, 85% 95%, 68% 98%, 52% 96%, 36% 99%, 19% 96%, 1% 98%, 2% 83%, 0% 67%, 2% 50%, 0% 34%, 2% 18%);
        }
        .about-ref-torn-grid {
          clip-path: polygon(0% 0%, 96% 0%, 100% 9%, 98% 19%, 100% 31%, 97% 44%, 99% 55%, 98% 67%, 100% 78%, 96% 90%, 98% 100%, 0% 98%, 2% 88%, 0% 76%, 1.5% 63%, 0% 52%, 2% 41%, 0% 30%, 1.5% 19%, 0% 8%);
        }
        .about-paper-ref-pink.about-ref-torn-pink {
          clip-path: none;
          overflow: visible;
          background: transparent !important;
          box-shadow: none;
          isolation: isolate;
        }
        .about-paper-ref-pink.about-ref-torn-pink::before {
          content: "";
          position: absolute;
          inset: 0;
          background-color: #d99397;
          background-image:
            radial-gradient(circle at 18% 24%, rgba(255,255,255,0.16), transparent 26%),
            radial-gradient(circle at 76% 18%, rgba(43,36,32,0.08), transparent 24%),
            linear-gradient(175deg, rgba(255,255,255,0.18), rgba(43,36,32,0.05));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2), inset 0 -18px 30px rgba(43,36,32,0.08);
          clip-path: polygon(0% 5%, 13% 3%, 29% 4.5%, 44% 2.5%, 61% 4%, 79% 2.5%, 100% 5%, 98% 17%, 100% 33%, 98% 48%, 100% 65%, 98% 82%, 100% 97%, 85% 95%, 68% 98%, 52% 96%, 36% 99%, 19% 96%, 1% 98%, 2% 83%, 0% 67%, 2% 50%, 0% 34%, 2% 18%);
          pointer-events: none;
          z-index: 0;
        }
        .about-paper-section {
          position: relative;
          padding: 30px 32px;
          z-index: 1;
        }
        .about-paper-heading {
          padding-bottom: 24px;
        }
        .about-paper-curl {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 0;
          height: 18px;
          border-radius: 999px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.24), rgba(43,36,32,0.24));
          box-shadow: 0 8px 12px rgba(43,36,32,0.18);
          opacity: 0;
          transform: translateY(8px) scaleY(0.72);
          transform-origin: center center;
          pointer-events: none;
          z-index: 5;
        }
        .about-paper-reveal.is-cascading .about-paper-curl {
          animation: about-paper-curl-edge 1.62s cubic-bezier(0.2, 0.78, 0.22, 1) both;
          animation-delay: var(--about-delay);
        }
        .about-torn-1 {
          clip-path: polygon(0% 0%, 100% 0%, 98% 3%, 100% 7%, 97% 12%, 100% 18%, 98% 25%, 100% 33%, 97% 42%, 100% 50%, 98% 58%, 100% 67%, 97% 75%, 100% 83%, 98% 92%, 100% 100%, 0% 100%, 2% 92%, 0% 83%, 3% 75%, 0% 67%, 2% 58%, 0% 50%, 3% 42%, 0% 33%, 2% 25%, 0% 18%, 3% 12%, 0% 7%, 2% 3%);
        }
        .about-torn-2 {
          clip-path: polygon(0% 0%, 95% 2%, 100% 0%, 98% 10%, 100% 20%, 97% 30%, 100% 40%, 98% 50%, 100% 60%, 97% 70%, 100% 80%, 98% 90%, 100% 100%, 0% 98%, 5% 100%, 0% 90%, 3% 80%, 0% 70%, 2% 60%, 0% 50%, 3% 40%, 0% 30%, 2% 20%, 0% 10%);
        }
        .about-sticker-stage {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          align-items: center;
          gap: 0 8px;
          margin: 10px -2px -8px;
          min-height: 286px;
        }
        .about-hobby-item {
          position: relative;
          display: grid;
          place-items: center;
          min-width: 0;
          min-height: 108px;
        }
        .about-hobby-item:hover {
          z-index: 10;
        }
        .about-hobby-blurb {
          position: absolute;
          top: 0;
          left: 50%;
          width: min(176px, 92%);
          margin-bottom: -8px;
          padding: 8px 10px;
          border: 0;
          border-radius: 4px;
          background:
            linear-gradient(120deg, rgba(255,255,255,0.22), rgba(43,36,32,0.04)),
            #f3eadf;
          box-shadow: 4px 4px 0 rgba(43,36,32,0.14);
          color: #2B2420;
          font-family: 'Caveat', cursive;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.08;
          text-align: center;
          opacity: 0;
          pointer-events: none;
          transform: translate(calc(-50% + var(--hobby-blurb-x, 0px)), 14px) rotate(var(--hobby-blurb-rotate, -1deg)) scale(0.94);
          transition: opacity 180ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 20;
        }
        .about-hobby-item:hover .about-hobby-blurb {
          opacity: 1;
          transform: translate(calc(-50% + var(--hobby-blurb-x, 0px)), 6px) rotate(var(--hobby-blurb-rotate, -1deg)) scale(1);
        }
        .about-hobby-camera {
          --hobby-blurb-rotate: -2deg;
          margin-right: -10px;
        }
        .about-hobby-headphones {
          --hobby-blurb-rotate: 2deg;
          margin-top: 8px;
          margin-left: -14px;
        }
        .about-hobby-paint {
          --hobby-blurb-rotate: 1deg;
          --hobby-blurb-x: -52px;
          margin-top: -26px;
          margin-right: -24px;
        }
        .about-hobby-bike {
          --hobby-blurb-rotate: -1.5deg;
          margin-top: -32px;
          margin-left: -28px;
        }
        .about-hobby-polish {
          --hobby-blurb-rotate: 1.5deg;
          grid-column: 1 / -1;
          width: min(180px, 52%);
          justify-self: center;
          margin-top: -40px;
        }
        .about-hobby-sticker {
          grid-row: auto;
          max-width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(3px 5px 0 rgba(43,36,32,0.18));
          user-select: none;
          -webkit-user-drag: none;
          transition: transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 260ms ease;
          justify-self: center;
        }
        .about-hobby-item:hover .about-hobby-sticker,
        .about-hobby-sticker:hover {
          filter: drop-shadow(4px 7px 0 rgba(43,36,32,0.2));
        }
        .about-camera-sticker {
          --white-sticker-border:
            drop-shadow(2px 0 0 #fff)
            drop-shadow(-2px 0 0 #fff)
            drop-shadow(0 2px 0 #fff)
            drop-shadow(0 -2px 0 #fff)
            drop-shadow(1.5px 1.5px 0 #fff)
            drop-shadow(-1.5px 1.5px 0 #fff)
            drop-shadow(1.5px -1.5px 0 #fff)
            drop-shadow(-1.5px -1.5px 0 #fff);
          filter: var(--white-sticker-border) drop-shadow(3px 5px 0 rgba(43,36,32,0.18));
        }
        .about-bike-sticker {
          --white-sticker-border:
            drop-shadow(1px 0 0 #fff)
            drop-shadow(-1px 0 0 #fff)
            drop-shadow(0 1px 0 #fff)
            drop-shadow(0 -1px 0 #fff)
            drop-shadow(0.75px 0.75px 0 #fff)
            drop-shadow(-0.75px 0.75px 0 #fff)
            drop-shadow(0.75px -0.75px 0 #fff)
            drop-shadow(-0.75px -0.75px 0 #fff);
          filter: var(--white-sticker-border) drop-shadow(3px 5px 0 rgba(43,36,32,0.18));
        }
        .about-hobby-item:hover .about-camera-sticker,
        .about-hobby-item:hover .about-bike-sticker,
        .about-camera-sticker:hover,
        .about-bike-sticker:hover {
          filter: var(--white-sticker-border) drop-shadow(4px 7px 0 rgba(43,36,32,0.2));
        }
        .about-camera-sticker {
          width: 96%;
          transform: rotate(-5deg) translate(-22px, 6px);
        }
        .about-hobby-item:hover .about-camera-sticker,
        .about-camera-sticker:hover {
          transform: rotate(-2deg) translate(-22px, 2px) scale(1.04);
        }
        .about-headphones-sticker {
          width: 78%;
          transform: rotate(8deg) translate(-5px, -82px);
        }
        .about-hobby-item:hover .about-headphones-sticker,
        .about-headphones-sticker:hover {
          transform: rotate(4deg) translate(-5px, -86px) scale(1.04);
        }
        .about-paint-sticker {
          width: 72%;
          max-height: 160px;
          transform: rotate(4deg) translate(-42px, 36px);
        }
        .about-hobby-item:hover .about-paint-sticker,
        .about-paint-sticker:hover {
          transform: rotate(1deg) translate(-42px, 32px) scale(1.04);
        }
        .about-bike-sticker {
          width: 112%;
          transform: rotate(13deg) translate(16px, -34px);
        }
        .about-hobby-item:hover .about-bike-sticker,
        .about-bike-sticker:hover {
          transform: rotate(17deg) translate(16px, -38px) scale(1.03);
        }
        .about-polish-sticker {
          width: 92%;
          transform: rotate(4deg) translate(5px, -8px);
        }
        .about-hobby-item:hover .about-polish-sticker,
        .about-polish-sticker:hover {
          transform: rotate(1deg) translate(5px, -12px) scale(1.03);
        }
        @keyframes about-paper-mask-unfurl {
          0% {
            max-height: 0;
          }
          12% {
            max-height: var(--about-paper-22);
          }
          42% {
            max-height: var(--about-paper-55);
          }
          62% {
            max-height: var(--about-paper-86);
          }
          76% {
            max-height: calc(var(--about-paper-height) + 14px);
          }
          86% {
            max-height: calc(var(--about-paper-height) - 8px);
          }
          94% {
            max-height: calc(var(--about-paper-height) + 4px);
          }
          98% {
            max-height: calc(var(--about-paper-height) - 1px);
          }
          100% {
            max-height: calc(var(--about-paper-height) + 28px);
          }
        }
        @keyframes about-paper-curl-edge {
          0% {
            opacity: 0;
            transform: translateY(-6px) scaleY(0.58);
          }
          12% {
            opacity: 0.42;
            transform: translateY(-4px) scaleY(0.76);
          }
          42% {
            opacity: 0.45;
            transform: translateY(-2px) scaleY(0.92);
          }
          76% {
            opacity: 0.52;
            transform: translateY(9px) scaleY(1.18);
          }
          86% {
            opacity: 0.34;
            transform: translateY(-5px) scaleY(0.78);
          }
          94% {
            opacity: 0.2;
            transform: translateY(3px) scaleY(0.92);
          }
          100% {
            opacity: 0;
            transform: translateY(0) scaleY(0.7);
          }
        }
        @media (max-width: 980px) {
          .about-stack-grid {
            grid-template-columns: 1fr;
            max-width: 520px;
            gap: 38px;
          }
          .about-stack-shell {
            transform: none !important;
          }
        }
        @media (max-width: 720px) {
          #projects {
            padding: 80px 18px !important;
          }
          .projects-shell {
            max-width: 100%;
          }
          .project-folder-stack {
            width: min(100%, 540px);
            aspect-ratio: 1.02;
            filter: drop-shadow(0 12px 14px rgba(0,0,0,0.25));
          }
          .project-folder-label {
            font-size: 9px;
          }
          .project-folder-label-blue {
            top: -2%;
            left: 8%;
            width: 36%;
            height: 10%;
          }
          .project-folder-label-beige {
            top: 4%;
            left: 55%;
            width: 36%;
            height: 11%;
          }
          .project-folder-label-pink {
            top: 10%;
            left: 35%;
            width: 35%;
            height: 10%;
          }
          .project-folder-label-green {
            top: 16.5%;
            left: 9%;
            width: 36%;
            height: 12%;
          }
          .project-file-paper {
            top: 29%;
            left: 7%;
            right: 6%;
            bottom: 5%;
            padding: 15px 15px 18px;
          }
          .project-paper-folder-name {
            margin-bottom: 7px;
          }
          .project-paper-folder-name span {
            min-height: 20px;
            padding: 4px 8px;
            font-size: 9px;
            letter-spacing: 0.08em;
          }
          .project-grid-note {
            width: var(--grid-note-mobile-width);
          }
          .project-title {
            font-size: 24px;
            line-height: 1.03;
          }
          .project-year {
            font-size: 10px;
            padding: 4px 7px;
          }
          .project-desc {
            font-size: 12px;
            line-height: 1.5;
          }
          .project-tags {
            gap: 6px;
            max-width: calc(100% - var(--project-tags-left) - var(--project-tags-right));
            margin-top: auto;
            padding-top: 12px;
          }
          .project-skill-sticker {
            min-height: 26px;
            padding: 5px 8px;
            font-size: 10px;
          }
          .contact-vinyl-stage {
            top: 55%;
            right: -244px;
            width: 410px;
            opacity: 1;
          }
          .contact-terminal-shell {
            max-width: 100%;
            transform: rotate(-0.35deg);
          }
          .contact-terminal-body {
            min-height: 280px;
            padding: 24px 20px 28px;
          }
          .contact-terminal-command,
          .contact-terminal-output {
            font-size: 13px;
          }
          .contact-vinyl-label span {
            font-size: 9px;
          }
          .experience-computer {
            width: min(820px, 198vw);
            max-width: none;
            margin-top: 0;
          }
          .experience-computer-screen {
            grid-template-columns: 126px minmax(0, 1fr);
            gap: 7px;
            padding: 10px;
          }
          .experience-screen-folders {
            gap: 5px 6px;
          }
          .experience-screen-folder {
            min-height: 52px;
            padding: 3px 2px;
          }
          .experience-screen-folder-icon {
            width: 42px;
            height: 30px;
            margin-top: 6px;
          }
          .experience-screen-folder-icon::before {
            top: -10px;
            width: 27px;
            height: 11px;
          }
          .experience-screen-folder-label {
            font-size: 9px;
          }
          .experience-file-window {
            transform: none;
            min-height: 170px;
            padding: 18px 12px 13px;
            box-shadow: 5px 6px 0 rgba(0,0,0,0.2);
            border-radius: 7px;
          }
          .experience-file-window::before {
            height: 6px;
            border-bottom-width: 2px;
          }
          .experience-file-close {
            top: 10px;
            right: 10px;
            width: 22px;
            height: 22px;
            border-width: 1.5px;
            font-size: 14px;
          }
          .experience-file-meta {
            gap: 5px;
            margin: 8px 30px 8px 0;
          }
          .experience-file-meta span {
            padding: 4px 5px;
            font-size: 9px;
            border-width: 1.5px;
          }
          .experience-file-window h3 {
            font-size: 16px;
          }
          .experience-file-window p {
            font-size: 10px;
            line-height: 1.36;
          }
          .experience-file-tags {
            gap: 5px;
            padding-top: 10px;
          }
          .experience-file-tags em {
            font-size: 9px;
            padding: 4px 5px;
            border-width: 1.5px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .contact-vinyl-stage,
          .contact-vinyl,
          .contact-vinyl-sticker,
          .contact-terminal-cursor,
          .project-file-paper,
          .project-file-paper > *,
          .project-file-paper .project-skill-sticker,
          .experience-file-window {
            animation: none !important;
          }
          .project-file-paper > *,
          .project-file-paper .project-skill-sticker {
            opacity: 1;
          }
          .contact-vinyl-sticker {
            opacity: 1;
          }
          .experience-screen-folder,
          .experience-file-window {
            transition: none !important;
          }
          .about-stack-angle,
          .about-paper-reveal,
          .about-paper-curl {
            transition: none !important;
          }
          .about-paper-reveal,
          .about-paper-reveal.is-cascading,
          .about-paper-reveal.is-cascading .about-paper-mask,
          .about-paper-reveal.is-cascading .about-paper-curl {
            animation: none !important;
          }
          .about-paper-reveal,
          .about-paper-reveal.is-cascading {
            opacity: 1;
          }
          .about-paper-mask,
          .about-paper-reveal.is-cascading .about-paper-mask {
            max-height: calc(var(--about-paper-height) + 28px);
          }
          .about-paper-curl {
            opacity: 0;
          }
        }
      `}</style>
            <div style={{ maxWidth: "100vw", overflowX: "hidden" }}>
                <NavBar />
                <HeroSection />
                <AboutSection />
                <ExperienceSection />
                <ProjectsSection />
                <ContactSection />

            </div>
        </>
    );
}
