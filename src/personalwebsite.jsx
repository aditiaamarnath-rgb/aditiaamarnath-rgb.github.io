import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
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
    kraft: "#D9C9A8",
    dustyRose: "#C9A0A0",
    sage: "#AEB89C",
    twine: "#8A6D4B",
    tape: "rgba(237, 227, 200, 0.7)",
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
        <section style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
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

function AboutPaper({ children, visible, delay, color, mask = "about-torn-1", paperClass = "" }) {
    const surfaceRef = useRef(null);
    const [paperHeight, setPaperHeight] = useState(1);

    useLayoutEffect(() => {
        const node = surfaceRef.current;
        if (!node) return undefined;

        const measure = () => {
            const nextHeight = Math.max(1, Math.ceil(node.scrollHeight));
            setPaperHeight((currentHeight) => currentHeight === nextHeight ? currentHeight : nextHeight);
        };

        measure();

        if (typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver(measure);
            observer.observe(node);
            return () => observer.disconnect();
        }

        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    return (
        <div
            className={`about-paper-reveal ${visible ? "is-cascading" : ""}`}
            style={{
                "--about-delay": `${delay}s`,
                "--about-paper-height": `${paperHeight}px`,
                "--about-paper-22": `${Math.round(paperHeight * 0.22)}px`,
                "--about-paper-55": `${Math.round(paperHeight * 0.55)}px`,
                "--about-paper-86": `${Math.round(paperHeight * 0.86)}px`,
            }}
        >
            <div className="about-paper-mask">
                <div
                    ref={surfaceRef}
                    className={`about-paper-surface ${mask} ${paperClass}`}
                    style={{
                        backgroundColor: color,
                        color: ABOUT.scrapInk,
                    }}
                >
                    {children}
                </div>
                <div className="about-paper-curl" aria-hidden="true" />
            </div>
        </div>
    );
}

function AboutSection() {
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.18, rootMargin: "-8% 0px -12% 0px" },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="aboutme" ref={sectionRef} style={{ background: C.bgMid, padding: "96px clamp(20px, 5vw, 52px) 104px", position: "relative", overflow: "hidden" }}>
            <div style={{ maxWidth: 1120, margin: "0 auto 28px", position: "relative", zIndex: 2 }}>
                <SectionHeading light>About Me</SectionHeading>
            </div>

            <div className="about-stack-grid">
                <AboutStack tilt={-2} yOffset={16} zIndex={30}>
                    <AboutPaper visible={visible} delay={0} color="#9fc1bd" mask="about-ref-torn-teal" paperClass="about-paper-ref-teal">
                        <div className="about-paper-section about-paper-heading">
                            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 19, fontWeight: 700, color: ABOUT.scrapInk, opacity: 0.62, textTransform: "uppercase", marginBottom: 8, display: "block" }}>Background</span>
                            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: ABOUT.scrapInk, margin: 0 }}>Education</h3>
                        </div>
                        <div className="about-paper-section">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, marginBottom: 10 }}>
                                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.52 }}>2022 — 2026</span>
                                <span style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: ABOUT.twine }}>Dean&apos;s List</span>
                            </div>
                            <p style={{ fontFamily: "'Fraunces', serif", fontSize: 21, fontWeight: 700, margin: "0 0 4px" }}>B.S. Computer Science</p>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, opacity: 0.78, margin: 0 }}>University</p>
                        </div>
                        <div className="about-paper-section">
                            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 21, margin: "0 0 8px" }}>Key Coursework:</p>
                            <ul style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.8, opacity: 0.72, paddingLeft: 18, margin: 0 }}>
                                <li>Algorithms &amp; OS</li>
                                <li>Machine Learning</li>
                                <li>HCI</li>
                                <li>Distributed Systems</li>
                            </ul>
                        </div>
                    </AboutPaper>
                </AboutStack>

                <AboutStack tilt={3} yOffset={-8} zIndex={20}>
                    <AboutPaper visible={visible} delay={0.18} color="#d99397" mask="about-ref-torn-pink" paperClass="about-paper-ref-pink">
                        <div className="about-paper-section about-paper-heading">
                            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 19, fontWeight: 700, color: ABOUT.scrapInk, opacity: 0.62, textTransform: "uppercase", marginBottom: 8, display: "block" }}>Vibe</span>
                            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: ABOUT.scrapInk, margin: 0 }}>Hobbies</h3>
                            <div className="about-sticker-stage">
                                <img src={cameraSticker} alt="Camera sticker" className="about-hobby-sticker about-camera-sticker" />
                                <img src={headphonesSticker} alt="Headphones sticker" className="about-hobby-sticker about-headphones-sticker" />
                                <img src={paintSticker} alt="Paint brushes sticker" className="about-hobby-sticker about-paint-sticker" />
                                <img src={bikeSticker} alt="Bike with flowers sticker" className="about-hobby-sticker about-bike-sticker" />
                            </div>
                        </div>
                    </AboutPaper>
                </AboutStack>

                <AboutStack tilt={-1} yOffset={24} zIndex={10}>
                    <AboutPaper visible={visible} delay={0.36} color="#f3eadf" mask="about-ref-torn-grid" paperClass="about-paper-ref-grid">
                        <div className="about-paper-section about-paper-heading">
                            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 19, fontWeight: 700, color: ABOUT.scrapInk, opacity: 0.62, textTransform: "uppercase", marginBottom: 8, display: "block" }}>Involvement</span>
                            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: ABOUT.scrapInk, margin: 0 }}>Activities</h3>
                        </div>
                        <div className="about-paper-section">
                            <div style={{ display: "grid", gap: 14 }}>
                                <div>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.52 }}>2023 — Now</span>
                                    <p style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, margin: "3px 0 0" }}>ACM Student Chapter</p>
                                </div>
                                <div>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.52 }}>2022 — Now</span>
                                    <p style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, margin: "3px 0 0" }}>Intramural Soccer</p>
                                </div>
                            </div>
                        </div>
                        <div className="about-paper-section">
                            <div>
                                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.52 }}>2024 — Now</span>
                                <p style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, margin: "3px 0 0" }}>Design Club</p>
                            </div>
                            <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.12)" }}>
                                <p style={{ fontFamily: "'Caveat', cursive", fontSize: 17, fontStyle: "italic", opacity: 0.82, margin: 0 }}>&quot;Making cool things with cool people.&quot;</p>
                            </div>
                        </div>
                    </AboutPaper>
                </AboutStack>
            </div>
        </section>
    );
}

/* ══════════════════ EXPERIENCE ══════════════════ */
function ExperienceEntry({ item, align = "left" }) {
    return (
        <article className={`book-entry book-entry-${align}`}>
            <span className="book-entry-year">{item.year}</span>
            <h3>{item.title}</h3>
            <p>{item.sub}</p>
        </article>
    );
}

function ExperienceSection() {
    const items = [
        { year: "Summer 2026", title: "Cloud Analytics Intern", sub: "HGS · Built a React dashboard, reduced load time 40%" },
        { year: "Fall 2023",   title: "Research Assistant",     sub: "CS Dept · ML pipeline for NLP classification tasks" },
        { year: "Spring 2024", title: "Teaching Assistant",     sub: "Data Structures · Labs + office hours for 80 students" },
        { year: "Ongoing",     title: "Open Source Contributor", sub: "Various projects on GitHub · React, Python, C" },
    ];
    const skills = ["Python","C/C++","Java","JavaScript","TypeScript","React","Node.js","Flask","Git","Docker","Linux","Figma","Procreate"];
    const [isBookOpen, setIsBookOpen] = useState(false);

    return (
        <section id="experience" style={{ background: C.bg, padding: "90px 52px", position: "relative", overflow: "hidden" }}>

            <SectionHeading light>Experience</SectionHeading>

            <div
                className={`experience-book ${isBookOpen ? "is-open" : ""}`}
            >
                <div className="experience-book-shadow" aria-hidden="true" />
                <div className="experience-book-cover" aria-hidden="true" />
                <div className="experience-bookmark">
                    <p className="experience-bookmark-title">Technical Skills</p>
                    <div className="experience-bookmark-skills">
                        {skills.map((skill) => (
                            <span className="experience-bookmark-skill" key={skill}>{skill}</span>
                        ))}
                    </div>
                </div>
                <div className="experience-book-pages">
                    <div className="book-page book-page-left">
                        <ExperienceEntry item={items[0]} align="left" />
                    </div>
                    <div className="book-page book-page-right">
                        <ExperienceEntry item={items[1]} align="right" />
                    </div>
                    <div className="book-page book-page-left book-page-under">
                        <ExperienceEntry item={items[2]} align="left" />
                    </div>
                    <div className="book-page book-page-right book-page-under">
                        <ExperienceEntry item={items[3]} align="right" />
                    </div>
                    <div className="book-flip-page" aria-hidden="true">
                        <div className="book-flip-face book-flip-front">
                            <ExperienceEntry item={items[1]} align="right" />
                        </div>
                        <div className="book-flip-face book-flip-back">
                            <ExperienceEntry item={items[2]} align="left" />
                        </div>
                    </div>
                    <div className="book-spine" aria-hidden="true" />
                    <button
                        type="button"
                        className={`book-flip-control ${isBookOpen ? "book-flip-control-prev" : "book-flip-control-next"}`}
                        aria-label={isBookOpen ? "Show previous experience spread" : "Show next experience spread"}
                        onMouseEnter={() => setIsBookOpen((open) => !open)}
                        onClick={() => setIsBookOpen((open) => !open)}
                    >
                        <span aria-hidden="true">{isBookOpen ? "‹" : "›"}</span>
                    </button>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════ PROJECTS ══════════════════ */
const PROJECTS = [
    { tab: "Route Finder", title: "Shortest Path Route Finder", desc: "Interactive graph traversal visualizer — Dijkstra, A*, BFS, DFS. Draw custom grids, place walls, watch algorithms explore in real time.", tags: ["Java","Javascript","HTML","Canvas API"], year: "2026", emoji: "🗺️", color: C.yellow, ink: C.ink, descColor: C.ink },
    { tab: "Bluprint",   title: "Bluprint",   desc: "A room design website that takes user's style preferences and generates furniture recommendations. Includes a customizable diagram of room, visual representation of items recommended, and dashboard to view all decorated rooms.",   tags: ["React","Node.js","MongoDB"],               year: "2024", emoji: "🐚", color: C.fresh, ink: C.ink, descColor: C.ink },
    { tab: "NoteFlow",     title: "NoteFlow",     desc: "Real-time collaborative markdown editor using operational transforms. Multiple users can edit simultaneously without losing changes.",   tags: ["TypeScript","Node.js","WebSockets","OT"],  year: "2024", emoji: "📝", color: C.softpink, ink: C.ink, descColor: C.ink },
    { tab: "MLens",        title: "MLens",        desc: "Browser extension that explains ML model predictions in plain language, showing feature importance as an inline overlay on supported sites.", tags: ["Python","ML","Chrome Extension","Flask"],  year: "2023", emoji: "🔍", color: C.azeitona, ink: C.ink, descColor: C.ink },
];
const PROJECT_FOLDER_META = [
    { z: 2 },
    { z: 3 },
    { z: 4 },
    { z: 5 },
];

function ProjectsSection() {
    const [active, setActive] = useState(0);
    const p = PROJECTS[active];

    return (
        <section id="projects" style={{ background: C.cream, padding: "90px 52px", position: "relative", overflow: "hidden" }}>

            <SectionHeading light>Projects</SectionHeading>

            <div className="projects-shell">
                <div className="project-tab-row" role="tablist" aria-label="Projects">
                    {PROJECTS.map((proj, i) => (
                        <button
                            key={proj.tab}
                            type="button"
                            id={`project-tab-${i}`}
                            role="tab"
                            aria-selected={active === i}
                            aria-controls="project-panel"
                            className={`project-folder-tab ${active === i ? "is-active" : ""}`}
                            onClick={() => setActive(i)}
                            style={{
                                "--project-color": proj.color,
                                "--project-ink": proj.ink,
                                "--project-z": `${PROJECT_FOLDER_META[i].z}`,
                            }}
                        >
                            <span>{proj.tab}</span>
                            <small>{proj.year}</small>
                        </button>
                    ))}
                </div>

                <article
                    id="project-panel"
                    role="tabpanel"
                    aria-labelledby={`project-tab-${active}`}
                    className="project-folder-body"
                    style={{
                        "--project-color": p.color,
                        "--project-ink": p.ink,
                        "--project-desc-color": p.descColor ?? C.ink,
                    }}
                >
                    <div className="project-folder-content">
                        <div className="project-snapshot" aria-hidden="true">
                            <span>{p.emoji}</span>
                        </div>

                        <div className="project-copy">
                            <div className="project-heading-row">
                                <p className="project-title">{p.title}</p>
                                <span className="project-year">{p.year}</span>
                            </div>
                            <p className="project-desc">{p.desc}</p>
                        </div>
                    </div>

                    <div className="project-skill-sheet">
                        <p className="project-skill-heading">Software Skills Used</p>
                        <div className="project-tags">
                            {p.tags.map(t => (
                                <span className="project-skill-sticker" key={t}>{t}</span>
                            ))}
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
}

/* ══════════════════ CONTACT ══════════════════ */
function ContactSection() {
    const contactLinks = [
        {
            icon: "✉",
            label: "aditi.amarnath@gmail.com",
            href: "mailto:aditi.amarnath@gmail.com",
        },
        {
            icon: "💼",
            label: "linkedin.com/in/aditi",
            href: "https://www.linkedin.com/in/aditi",
        },
        {
            icon: "🐱",
            label: "https://github.com/aditiaamarnath-rgb",
            href: "https://github.com/aditiaamarnath-rgb",
        },
    ];

    return (
        <section id="contactme" style={{ background: C.bgMid, padding: "90px 52px 110px", position: "relative", overflow: "hidden" }}>

            <SectionHeading light>Contact Information</SectionHeading>

            <div style={{ maxWidth: 560, position: "relative", zIndex: 1 }}>
                {/* big contact card as post-it */}
                <div style={{ position: "relative", transform: "rotate(-0.5deg)" }}>
                    <div style={{ background: C.paper, border: `3px solid ${C.ink}`, borderRadius: 3, padding: "44px 52px", boxShadow: "8px 8px 0 rgba(0,0,0,0.35)" }}>
                        {contactLinks.map(item => (
                            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
                                <div style={{ width: 46, height: 46, background: C.ink, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: `2px solid ${C.accent}` }}>
                                    {item.icon}
                                </div>
                                <a
                                    href={item.href}
                                    target={item.href.startsWith("http") ? "_blank" : undefined}
                                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                                    style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.ink, textDecoration: "underline", textDecorationThickness: 2, textUnderlineOffset: 4 }}
                                >
                                    {item.label}
                                </a>
                            </div>
                        ))}
                        <div style={{ borderTop: `2px dashed rgba(54,47,34,0.32)`, paddingTop: 20, marginTop: 8 }}>
                            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: C.petrol, fontStyle: "italic", textAlign: "center" }}>
                                Thanks for visiting :)
                            </p>
                        </div>
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
        .experience-book {
          --book-paper: #efe3cf;
          --book-paper-alt: #f7ecd9;
          --book-ink: #362F22;
          width: min(880px, calc(100% - 190px));
          height: clamp(460px, 56vw, 560px);
          margin: 0 auto;
          position: relative;
          z-index: 1;
          perspective: 1800px;
          cursor: default;
          outline: none;
          transform: translateX(clamp(-52px, -4vw, -28px));
        }
        .experience-book:focus-visible {
          box-shadow: 0 0 0 3px rgba(185,125,123,0.75);
          border-radius: 0;
        }
        .experience-book-shadow {
          position: absolute;
          left: 4%;
          right: 4%;
          bottom: -18px;
          height: 42px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(0,0,0,0.34), rgba(0,0,0,0) 70%);
          filter: blur(2px);
        }
        .experience-book-cover {
          position: absolute;
          inset: 8px -10px -10px;
          border-radius: 0;
          background: linear-gradient(135deg, #718866, #40543b);
          box-shadow: 8px 12px 0 rgba(0,0,0,0.2);
          transform: rotate(-0.6deg);
          z-index: 1;
        }
        .experience-bookmark {
          position: absolute;
          top: 42px;
          right: -178px;
          width: 160px;
          min-height: calc(100% - 84px);
          padding: 18px 14px 34px;
          color: #362F22;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 44%),
            #b97d7b;
          border: 3px solid #362F22;
          box-shadow: 5px 7px 0 rgba(0,0,0,0.24);
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 24px), 0 100%);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transform: rotate(1.6deg);
          transform-origin: top left;
          z-index: 7;
        }
        .experience-bookmark::before {
          content: "";
          position: absolute;
          top: 18px;
          bottom: 30px;
          left: -3px;
          width: 3px;
          background: rgba(54,47,34,0.26);
        }
        .experience-bookmark-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 900;
          line-height: 1.05;
          color: #362F22;
          margin: 0;
        }
        .experience-bookmark-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .experience-bookmark-skill {
          font-family: 'Nunito', sans-serif;
          font-size: 10px;
          font-weight: 800;
          line-height: 1;
          color: #362F22;
          background: rgba(230,234,237,0.76);
          border: 1px solid rgba(54,47,34,0.64);
          padding: 5px 7px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .experience-book-pages {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          z-index: 3;
        }
        .book-page,
        .book-flip-page {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
        }
        .book-page {
          padding: clamp(30px, 4.4vw, 48px);
          color: var(--book-ink);
          overflow: hidden;
          background-color: var(--book-paper);
          background-image:
            repeating-linear-gradient(to bottom, transparent 0 27px, rgba(128,94,58,0.12) 27px 28px),
            linear-gradient(110deg, rgba(255,255,255,0.36), rgba(89,64,38,0.07));
          box-shadow: inset 0 0 0 1px rgba(54,47,34,0.08);
        }
        .book-page-left {
          left: 0;
          border-radius: 0;
          transform-origin: right center;
          box-shadow: inset -18px 0 24px rgba(89,64,38,0.16), inset 0 0 0 1px rgba(54,47,34,0.08);
        }
        .book-page-right {
          left: 50%;
          border-radius: 0;
          transform-origin: left center;
          box-shadow: inset 18px 0 24px rgba(89,64,38,0.14), inset 0 0 0 1px rgba(54,47,34,0.08);
        }
        .book-page-under {
          background-color: var(--book-paper-alt);
          z-index: 1;
        }
        .book-page:not(.book-page-under) {
          z-index: 2;
        }
        .book-flip-page {
          left: 50%;
          z-index: 5;
          transform-origin: left center;
          transform-style: preserve-3d;
          transition: transform 900ms cubic-bezier(0.2, 0.72, 0.2, 1);
        }
        .experience-book.is-open .book-flip-page {
          transform: rotateY(-180deg);
        }
        .book-flip-face {
          position: absolute;
          inset: 0;
          padding: clamp(30px, 4.4vw, 48px);
          overflow: hidden;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          color: var(--book-ink);
          background-color: var(--book-paper);
          background-image:
            repeating-linear-gradient(to bottom, transparent 0 27px, rgba(128,94,58,0.12) 27px 28px),
            linear-gradient(110deg, rgba(255,255,255,0.34), rgba(89,64,38,0.08));
          box-shadow: inset 18px 0 24px rgba(89,64,38,0.14), inset 0 0 0 1px rgba(54,47,34,0.08);
        }
        .book-flip-front {
          border-radius: 0;
        }
        .book-flip-back {
          border-radius: 0;
          transform: rotateY(180deg);
          box-shadow: inset -18px 0 24px rgba(89,64,38,0.16), inset 0 0 0 1px rgba(54,47,34,0.08);
        }
        .book-spine {
          position: absolute;
          top: 8px;
          bottom: 8px;
          left: calc(50% - 8px);
          width: 16px;
          z-index: 8;
          border-radius: 999px;
          background:
            radial-gradient(ellipse at center, rgba(54,47,34,0.26), rgba(54,47,34,0.02) 62%),
            linear-gradient(90deg, rgba(89,64,38,0.2), rgba(255,255,255,0.24), rgba(89,64,38,0.2));
          pointer-events: none;
        }
        .book-flip-control {
          position: absolute;
          top: 50%;
          width: 54px;
          height: 86px;
          z-index: 12;
          border: 2px solid rgba(54,47,34,0.58);
          background:
            linear-gradient(110deg, rgba(255,255,255,0.56), rgba(239,227,207,0.92)),
            var(--book-paper-alt);
          color: #362F22;
          box-shadow: 3px 5px 0 rgba(0,0,0,0.18);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            opacity 180ms ease,
            transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
            filter 180ms ease,
            box-shadow 180ms ease;
        }
        .book-flip-control span {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 900;
          line-height: 1;
          transform: translateY(-2px);
        }
        .book-flip-control:hover,
        .book-flip-control:focus-visible {
          filter: brightness(1.04);
          box-shadow: 5px 7px 0 rgba(0,0,0,0.2);
        }
        .book-flip-control:focus-visible {
          outline: 3px solid rgba(185,125,123,0.78);
          outline-offset: 3px;
        }
        .book-flip-control-next {
          right: -16px;
          transform: translateY(-50%);
          border-right: 0;
          clip-path: polygon(0 0, 100% 10%, 100% 90%, 0 100%);
        }
        .book-flip-control-next:hover,
        .book-flip-control-next:focus-visible {
          transform: translate(6px, -50%);
        }
        .book-flip-control-prev {
          left: -16px;
          transform: translateY(-50%);
          border-left: 0;
          clip-path: polygon(0 10%, 100% 0, 100% 100%, 0 90%);
        }
        .book-flip-control-prev:hover,
        .book-flip-control-prev:focus-visible {
          transform: translate(-6px, -50%);
        }
        .book-entry {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
        }
        .book-entry-right {
          padding-left: 12px;
        }
        .book-entry-left {
          padding-right: 12px;
        }
        .book-entry-year {
          font-family: 'Nunito', sans-serif;
          font-size: 11px;
          font-weight: 800;
          color: #596d85;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .book-entry h3 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(21px, 2.2vw, 28px);
          font-weight: 900;
          line-height: 1.05;
          color: var(--book-ink);
          margin: 0;
        }
        .book-entry p {
          font-family: 'Nunito', sans-serif;
          font-size: clamp(13px, 1.45vw, 15px);
          line-height: 1.65;
          color: rgba(54,47,34,0.78);
          margin: 0;
        }
        .projects-shell {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          padding-top: 38px;
          filter: drop-shadow(0 14px 18px rgba(0,0,0,0.22));
        }
        .projects-shell::before {
          content: "";
          position: absolute;
          top: 52px;
          left: 20px;
          right: 32px;
          height: 174px;
          z-index: 0;
          background-color: #AEB89C;
          background-image:
            repeating-linear-gradient(90deg, rgba(54,47,34,0.08) 0 1px, transparent 1px 7px),
            linear-gradient(120deg, rgba(255,255,255,0.12), rgba(43,36,32,0.06));
          border: 3px solid #362F22;
          border-bottom: 0;
          border-radius: 8px 8px 0 0;
          box-shadow: 6px 7px 0 rgba(0,0,0,0.16);
          transform: rotate(-0.7deg);
        }
        .projects-shell::after {
          content: "";
          position: absolute;
          left: 24px;
          right: 26px;
          bottom: -12px;
          height: 28px;
          background: rgba(0,0,0,0.2);
          filter: blur(11px);
          z-index: -1;
        }
        .project-tab-row {
          position: relative;
          z-index: 6;
          display: flex;
          align-items: flex-end;
          gap: 6px;
          min-height: 70px;
          padding: 0 22px;
          margin-bottom: -3px;
          overflow-x: auto;
          scrollbar-width: thin;
        }
        .project-folder-tab {
          --project-color: #ede39c;
          --project-ink: #362F22;
          --project-z: 2;
          position: relative;
          flex: 0 0 auto;
          min-height: 56px;
          max-width: 220px;
          padding: 12px 18px 16px;
          border: 3px solid #362F22;
          border-bottom: 0;
          border-radius: 8px 8px 0 0;
          color: #362F22;
          background-color: var(--project-color);
          background-image:
            repeating-linear-gradient(90deg, rgba(54,47,34,0.06) 0 1px, transparent 1px 7px),
            linear-gradient(120deg, rgba(255,255,255,0.18), rgba(43,36,32,0.04));
          box-shadow: 4px -3px 0 rgba(0,0,0,0.18);
          cursor: pointer;
          text-align: left;
          transform: rotate(-0.6deg) translateY(6px);
          transform-origin: bottom center;
          transition:
            transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
            filter 180ms ease;
          z-index: var(--project-z);
        }
        .project-folder-tab:nth-child(2n) {
          transform: rotate(0.7deg) translateY(8px);
        }
        .project-folder-tab:nth-child(3n) {
          transform: rotate(-0.2deg) translateY(7px);
        }
        .project-folder-tab span {
          display: block;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          overflow-wrap: anywhere;
        }
        .project-folder-tab small {
          display: block;
          font-family: 'Nunito', sans-serif;
          font-size: 11px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: 0.08em;
          margin-top: 6px;
          opacity: 0.58;
        }
        .project-folder-tab:hover,
        .project-folder-tab:focus-visible {
          filter: brightness(1.05);
          transform: rotate(0deg) translateY(1px);
        }
        .project-folder-tab:focus-visible {
          outline: 3px solid rgba(185,125,123,0.78);
          outline-offset: 3px;
        }
        .project-folder-tab.is-active {
          z-index: 9;
          color: #362F22;
          background-color: var(--project-color);
          background-image:
            repeating-linear-gradient(90deg, rgba(54,47,34,0.06) 0 1px, transparent 1px 7px),
            linear-gradient(120deg, rgba(255,255,255,0.18), rgba(43,36,32,0.04));
          margin-bottom: -8px;
          padding-bottom: 24px;
          transform: rotate(0deg) translateY(0);
          box-shadow: 5px -4px 0 rgba(0,0,0,0.2);
        }
        .project-folder-body {
          --project-color: #ede39c;
          --project-ink: #362F22;
          --project-desc-color: #362F22;
          position: relative;
          z-index: 5;
          min-height: 430px;
          padding: 44px 44px 38px;
          color: #362F22;
          background-color: var(--project-color);
          background-image:
            repeating-linear-gradient(90deg, rgba(54,47,34,0.06) 0 1px, transparent 1px 7px),
            radial-gradient(circle at 18% 24%, rgba(255,255,255,0.18), transparent 28%),
            linear-gradient(120deg, rgba(255,255,255,0.18), rgba(43,36,32,0.06));
          border: 3px solid #362F22;
          border-radius: 0 8px 8px 8px;
          box-shadow: 8px 8px 0 rgba(0,0,0,0.25), inset 0 -18px 26px rgba(43,36,32,0.06);
        }
        .project-folder-body::after {
          content: "";
          position: absolute;
          inset: 18px;
          border: 2px solid rgba(54,47,34,0.11);
          pointer-events: none;
        }
        .project-folder-content {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(300px, 390px) minmax(0, 1fr);
          gap: clamp(28px, 4vw, 42px);
          align-items: start;
        }
        .project-snapshot {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 30% 28%, rgba(255,255,255,0.62), rgba(230,234,237,0.92)),
            #e6eaed;
          border: 3px solid #362F22;
          border-radius: 4px;
          box-shadow: 6px 7px 0 rgba(0,0,0,0.23);
          transform: rotate(-1.5deg);
          overflow: hidden;
        }
        .project-snapshot span {
          font-size: 72px;
          line-height: 1;
          filter: drop-shadow(2px 3px 0 rgba(43,36,32,0.16));
        }
        .project-copy {
          min-width: 0;
          padding-top: 4px;
        }
        .project-heading-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .project-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(30px, 4vw, 40px);
          font-weight: 900;
          line-height: 1.02;
          color: #362F22;
          margin: 0;
          max-width: 720px;
        }
        .project-year {
          display: inline-block;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          color: #362F22;
          background: rgba(230,234,237,0.7);
          border: 2px solid rgba(54,47,34,0.72);
          box-shadow: 3px 3px 0 rgba(0,0,0,0.16);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 9px;
          transform: rotate(2deg);
        }
        .project-desc {
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          line-height: 1.72;
          color: var(--project-desc-color);
          margin: 0;
          max-width: 630px;
        }
        .project-skill-sheet {
          position: relative;
          z-index: 1;
          margin-top: 30px;
          padding: 18px 20px 20px;
          background: rgba(230,234,237,0.66);
          border: 2px solid rgba(54,47,34,0.62);
          box-shadow: 4px 5px 0 rgba(0,0,0,0.16);
          transform: rotate(0.35deg);
        }
        .project-skill-heading {
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          color: #596d85;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.72;
          margin: 0 0 12px;
        }
        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
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
          color: #c0cab8;
          background: #362F22;
          border: 2px solid #362F22;
          box-shadow: 3px 3px 0 rgba(0,0,0,0.2);
          letter-spacing: 0.03em;
          transform: rotate(-0.7deg);
        }
        .project-skill-sticker:nth-child(2n) {
          transform: rotate(1deg);
          background: #596d85;
          color: #141b20;
        }
        .project-skill-sticker:nth-child(3n) {
          transform: rotate(-0.4deg);
          background: #b97d7b;
          color: #362F22;
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
        .about-paper-surface {
          position: relative;
          overflow: hidden;
        }
        .about-paper-ref-teal {
          background-image:
            repeating-linear-gradient(to bottom, transparent 0 15px, rgba(255,255,255,0.34) 15px 16px),
            linear-gradient(105deg, rgba(255,255,255,0.2), rgba(43,36,32,0.04)),
            radial-gradient(circle at 18% 20%, rgba(255,255,255,0.18), transparent 30%);
          box-shadow: inset 0 0 0 2px rgba(255,255,255,0.38), inset 0 -18px 28px rgba(43,36,32,0.08);
        }
        .about-paper-ref-pink {
          background-image:
            radial-gradient(circle at 18% 24%, rgba(255,255,255,0.16), transparent 26%),
            radial-gradient(circle at 76% 18%, rgba(43,36,32,0.08), transparent 24%),
            linear-gradient(175deg, rgba(255,255,255,0.18), rgba(43,36,32,0.05));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2), inset 0 -18px 30px rgba(43,36,32,0.08);
        }
        .about-paper-ref-grid {
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
        .about-paper-section {
          position: relative;
          padding: 30px 32px;
          z-index: 1;
        }
        .about-paper-heading {
          padding-bottom: 24px;
        }
        .about-paper-section + .about-paper-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 16px;
          right: 16px;
          height: 12px;
          background: linear-gradient(to bottom, rgba(43,36,32,0.12), rgba(43,36,32,0));
          pointer-events: none;
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
          gap: 8px 10px;
          margin: 16px -6px -8px;
          min-height: 210px;
        }
        .about-hobby-sticker {
          max-width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(3px 5px 0 rgba(43,36,32,0.18));
          user-select: none;
          -webkit-user-drag: none;
          transition: transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 260ms ease;
          justify-self: center;
        }
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
        .about-camera-sticker:hover,
        .about-bike-sticker:hover {
          filter: var(--white-sticker-border) drop-shadow(4px 7px 0 rgba(43,36,32,0.2));
        }
        .about-camera-sticker {
          width: 96%;
          transform: rotate(-5deg) translate(3px, 6px);
        }
        .about-camera-sticker:hover {
          transform: rotate(-2deg) translate(3px, 2px) scale(1.04);
        }
        .about-headphones-sticker {
          width: 78%;
          transform: rotate(8deg) translate(-5px, -10px);
        }
        .about-headphones-sticker:hover {
          transform: rotate(4deg) translate(-5px, -14px) scale(1.04);
        }
        .about-paint-sticker {
          width: 58%;
          max-height: 130px;
          transform: rotate(4deg) translate(10px, -4px);
        }
        .about-paint-sticker:hover {
          transform: rotate(1deg) translate(10px, -8px) scale(1.04);
        }
        .about-bike-sticker {
          width: 112%;
          transform: rotate(-7deg) translate(-10px, -14px);
        }
        .about-bike-sticker:hover {
          transform: rotate(-3deg) translate(-10px, -18px) scale(1.03);
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
          .projects-shell {
            max-width: 100%;
            filter: drop-shadow(0 12px 14px rgba(0,0,0,0.2));
            padding-top: 28px;
          }
          .projects-shell::before {
            top: 44px;
            left: 8px;
            right: 10px;
            height: 136px;
            border-radius: 6px 6px 0 0;
          }
          .project-tab-row {
            min-height: 64px;
            padding: 0 6px;
            gap: 5px;
            margin-bottom: -3px;
          }
          .project-folder-tab {
            min-height: 52px;
            max-width: 168px;
            padding: 10px 12px 14px;
            border-radius: 7px 7px 0 0;
            transform: rotate(-0.4deg) translateY(5px);
          }
          .project-folder-tab span {
            font-size: 11px;
          }
          .project-folder-tab small {
            display: block;
            font-size: 10px;
          }
          .project-folder-tab.is-active {
            padding-bottom: 19px;
            margin-bottom: -7px;
          }
          .project-folder-body {
            min-height: 0;
            padding: 30px 20px 28px;
            border-radius: 0 7px 7px 7px;
          }
          .project-folder-content {
            grid-template-columns: 1fr;
            gap: 22px;
          }
          .project-snapshot {
            width: 100%;
            max-width: 460px;
            aspect-ratio: 16 / 10;
            justify-self: center;
          }
          .project-snapshot span {
            font-size: 58px;
          }
          .project-title {
            font-size: 28px;
            line-height: 1.03;
          }
          .project-desc {
            font-size: 14px;
            line-height: 1.68;
          }
          .project-skill-sheet {
            margin-top: 24px;
            padding: 16px 14px 18px;
          }
          .project-tags {
            gap: 8px;
          }
          .project-skill-sticker {
            min-height: 32px;
            padding: 7px 10px;
            font-size: 12px;
          }
          .experience-book {
            width: 100%;
            height: 470px;
            margin-bottom: 146px;
            transform: none;
          }
          .experience-bookmark {
            top: auto;
            right: 16px;
            bottom: -126px;
            width: min(330px, calc(100% - 32px));
            min-height: 126px;
            padding: 14px 16px 30px;
            transform: rotate(1deg);
            z-index: 6;
          }
          .experience-bookmark-title {
            font-size: 16px;
          }
          .experience-bookmark-skills {
            gap: 5px;
          }
          .experience-bookmark-skill {
            font-size: 9px;
            padding: 4px 6px;
          }
          .book-page,
          .book-flip-face {
            padding: 24px 18px;
          }
          .book-entry {
            justify-content: flex-start;
            padding-top: 28px;
          }
          .book-entry-right,
          .book-entry-left {
            padding-left: 0;
            padding-right: 0;
          }
          .book-entry h3 {
            font-size: 19px;
          }
          .book-entry p {
            font-size: 12.5px;
            line-height: 1.55;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .book-flip-page {
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
