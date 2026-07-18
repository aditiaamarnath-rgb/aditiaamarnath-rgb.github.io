import { useState, useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function InjectFonts() {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Nunito:wght@400;600;700&display=swap";
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

function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
}

/* ── Tape strip ── */
function Tape({ style }) {
    return (
        <div style={{
            width: 56, height: 20,
            background: "rgba(255,255,255,0.58)",
            position: "absolute",
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
            ...style,
        }} />
    );
}

/* ── Post-it note ── */
function PostIt({ children, color = C.yellow, rotate = 0, style = {} }) {
    return (
        <div style={{
            background: color,
            borderRadius: 3,
            padding: "20px 20px 24px",
            position: "relative",
            transform: `rotate(${rotate}deg)`,
            boxShadow: "3px 4px 0 rgba(0,0,0,0.25), 1px 1px 0 rgba(0,0,0,0.1)",
            transition: "transform 0.2s, box-shadow 0.2s",
            ...style,
        }}>
            <Tape style={{ top: -10, left: "50%", transform: "translateX(-50%)" }} />
            {children}
        </div>
    );
}

/* ── Bold tag/chip ── */
function Chip({ label, dark = false }) {
    return (
        <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 12, fontWeight: 700,
            background: dark ? C.ink : C.paper,
            color: dark ? C.lightText : C.ink,
            border: `2px solid ${C.ink}`,
            borderRadius: 20,
            padding: "4px 14px",
            display: "inline-block",
            margin: "3px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
        }}>{label}</span>
    );
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

/* ── Timeline dot row ── */
function TLItem({ year, title, sub, light = false }) {
    return (
        <div style={{ display: "flex", gap: 16, marginBottom: 18, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                <div style={{ width: 12, height: 12, background: C.accent, borderRadius: "50%", border: `2px solid ${light ? C.bgDeep : C.cream}`, flexShrink: 0 }} />
                <div style={{ width: 2, height: 40, background: `${C.accent}44`, marginTop: 2 }} />
            </div>
            <div>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: "0.06em", textTransform: "uppercase" }}>{year}</span>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: light ? C.cream : C.ink, margin: "2px 0 2px" }}>{title}</p>
                {sub && <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: light ? C.muted : C.petrol, margin: 0, lineHeight: 1.5 }}>{sub}</p>}
            </div>
        </div>
    );
}

/* ── Doodle circle ── */
function DoodleCircle({ label, emoji }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                width: 90, height: 90, borderRadius: "50%",
                border: `3px solid ${hov ? C.accent : C.ink}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: hov ? C.accent : C.paper,
                transform: hov ? "scale(1.1) rotate(-5deg)" : "none",
                transition: "all 0.22s ease", cursor: "default",
            }}
        >
            <span style={{ fontSize: 26 }}>{emoji}</span>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: C.ink, fontWeight: 700, marginTop: 2 }}>{label}</span>
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
                <div style={{ flex: 1, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(28px)", transition: "all 0.9s ease" }}>
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

            </div>
        </section>
    );
}

/* ══════════════════ ABOUT ME ══════════════════ */
function AboutSection() {
    return (
        <section id="aboutme" style={{ background: C.cream, padding: "90px 52px", position: "relative", overflow: "hidden" }}>
            {/* bg text */}
            <SectionHeading light>About Me</SectionHeading>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr 1fr", gap: 56, maxWidth: 1120, position: "relative", zIndex: 1 }}>

                {/* Education post-it */}
                <PostIt color={C.fresh} rotate={-1.5}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.ink, marginBottom: 18 }}>Education</h3>
                    <TLItem year="2022–2026" title="B.S. Computer Science" sub="University · Dean's List" />
                    <TLItem year="Courses" title="Algorithms · OS · ML" sub="HCI · Distributed Systems" />
                </PostIt>

                {/* Hobbies post-it */}
                <PostIt color={C.softpink} rotate={0.8}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.ink, marginBottom: 18 }}>Hobbies &amp; Interests</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 8 }}>
                        <DoodleCircle label="Art"    emoji="🎨" />
                        <DoodleCircle label="Design" emoji="✏️" />
                        <DoodleCircle label="Sports" emoji="⚽" />
                        <DoodleCircle label="Music"  emoji="🎵" />
                    </div>
                </PostIt>

                {/* Activities post-it */}
                <PostIt color={C.fresh} rotate={1.2}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.ink, marginBottom: 18 }}>Activities</h3>
                    <TLItem year="2023–" title="ACM Student Chapter" sub="Software committee" />
                    <TLItem year="2022–" title="Intramural Soccer" sub="Team captain" />
                    <TLItem year="2024–" title="Design Club" sub="UI/UX team lead" />
                </PostIt>
            </div>
        </section>
    );
}

/* ══════════════════ EXPERIENCE ══════════════════ */
function ExperienceSection() {
    const items = [
        { year: "Summer 2026", title: "Cloud Analytics Intern", sub: "HGS · Built a React dashboard, reduced load time 40%", color: C.yellow, rotate: -1.5 },
        { year: "Fall 2023",   title: "Research Assistant",          sub: "CS Dept · ML pipeline for NLP classification tasks",        color: C.softpink, rotate: 1 },
        { year: "Spring 2024", title: "Teaching Assistant",          sub: "Data Structures · Labs + office hours for 80 students",     color: C.fresh, rotate: -0.8 },
        { year: "Ongoing",     title: "Open Source Contributor",     sub: "Various projects on GitHub · React, Python, C",             color: C.azeitona, rotate: 1.5 },
    ];

    return (
        <section id="experience" style={{ background: C.bg, padding: "90px 52px", position: "relative", overflow: "hidden" }}>

            <SectionHeading light>Experience</SectionHeading>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 28, maxWidth: 820, position: "relative", zIndex: 1 }}>
                {items.map((item) => (
                    <div key={item.title} style={{ position: "relative" }}>
                        <PostIt color={item.color} rotate={item.rotate} style={{ height: "100%" }}>
                            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>{item.year}</span>
                            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.ink, margin: "5px 0 8px", lineHeight: 1.2 }}>{item.title}</p>
                            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: C.moss, lineHeight: 1.6, margin: 0 }}>{item.sub}</p>
                        </PostIt>
                    </div>
                ))}
            </div>

            {/* Skills strip */}
            <div style={{ maxWidth: 820, marginTop: 40, position: "relative", zIndex: 1 }}>
                <div style={{ background: C.ink, border: `3px solid ${C.accent}`, borderRadius: 3, padding: "20px 24px", boxShadow: "5px 5px 0 rgba(0,0,0,0.3)", position: "relative" }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.rose, marginBottom: 12 }}>Technical Skills</p>
                    <div>
                        {["Python","C/C++","Java","JavaScript","TypeScript","React","Node.js","Flask","Git","Docker","Linux","Figma","Procreate"].map(s => (
                            <Chip key={s} label={s} dark />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════ PROJECTS ══════════════════ */
const PROJECTS = [
    { tab: "Shortest Path Route Finder", title: "Shortest Path Route Finder", desc: "Interactive graph traversal visualizer — Dijkstra, A*, BFS, DFS. Draw custom grids, place walls, watch algorithms explore in real time.", tags: ["Java","Javascript","HTML","Canvas API"], year: "2026", emoji: "🗺️", color: C.yellow, descColor: C.ink },
    { tab: "Bluprint",   title: "Bluprint",   desc: "A room design website that takes user's style preferences and generates furniture recommendations. Includes a customizable diagram of room, visual representation of items recommended, and dashboard to view all decorated rooms.",   tags: ["React","Node.js","MongoDB"],               year: "2024", emoji: "🐚", color: C.fresh },
    { tab: "NoteFlow",     title: "NoteFlow",     desc: "Real-time collaborative markdown editor using operational transforms. Multiple users can edit simultaneously without losing changes.",   tags: ["TypeScript","Node.js","WebSockets","OT"],  year: "2024", emoji: "📝", color: C.softpink },
    { tab: "MLens",        title: "MLens",        desc: "Browser extension that explains ML model predictions in plain language, showing feature importance as an inline overlay on supported sites.", tags: ["Python","ML","Chrome Extension","Flask"],  year: "2023", emoji: "🔍", color: C.azeitona },
];

function ProjectsSection() {
    const [active, setActive] = useState(0);
    const p = PROJECTS[active];

    return (
        <section id="projects" style={{ background: C.cream, padding: "90px 52px", position: "relative", overflow: "hidden" }}>

            <SectionHeading light>Projects</SectionHeading>

            <div style={{ maxWidth: 860, position: "relative", zIndex: 1 }}>
                {/* Folder tabs */}
                <div style={{ display: "flex", gap: 3 }}>
                    {PROJECTS.map((proj, i) => (
                        <button key={proj.tab} onClick={() => setActive(i)} style={{
                            fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700,
                            letterSpacing: "0.04em", textTransform: "uppercase",
                            color: active === i ? C.ink : C.petrol,
                            background: active === i ? proj.color : "rgba(240,241,234,0.28)",
                            border: `3px solid ${C.ink}`,
                            borderBottom: active === i ? `3px solid ${proj.color}` : `3px solid ${C.ink}`,
                            borderRadius: "6px 6px 0 0",
                            padding: "9px 22px",
                            cursor: "pointer",
                            marginBottom: -3,
                            position: "relative", zIndex: active === i ? 3 : 1,
                            transition: "all 0.15s",
                        }}>{proj.tab}</button>
                    ))}
                </div>

                {/* Folder body */}
                <div style={{ background: p.color, borderColor: C.ink, borderStyle: "solid", borderWidth: "0 3px 3px", borderRadius: "0 6px 6px 6px", padding: "36px 36px 32px", boxShadow: "6px 6px 0 rgba(0,0,0,0.25)", position: "relative", zIndex: 2 }}>
                    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
                        {/* graphic element */}
                        <div style={{ flexShrink: 0, width: 140, height: 140, background: C.ink, border: `3px solid ${C.ink}`, borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transform: "rotate(-1.5deg)", boxShadow: "4px 4px 0 rgba(0,0,0,0.25)" }}>
                            <span style={{ fontSize: 44 }}>{p.emoji}</span>
                            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 13, color: C.muted }}>graphic element</span>
                        </div>

                        {/* text */}
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: C.ink, margin: 0 }}>{p.title}</p>
                                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>{p.year}</span>
                            </div>
                            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: p.descColor ?? C.moss, lineHeight: 1.75, margin: "0 0 20px" }}>{p.desc}</p>
                        </div>
                    </div>

                    {/* skills grid */}
                    <div style={{ marginTop: 28, borderTop: `2px dashed ${C.ink}`, paddingTop: 20 }}>
                        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Software Skills Used</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                            {p.tags.map(t => (
                                <div key={t} style={{ background: C.ink, border: `2px solid ${C.ink}`, borderRadius: 4, padding: "10px 8px", textAlign: "center", boxShadow: "3px 3px 0 rgba(0,0,0,0.2)" }}>
                                    <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700, color: C.blush, letterSpacing: "0.04em" }}>{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
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
