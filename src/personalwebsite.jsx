import { OrbitCardStack } from "./components/ui/orbit-card-stack";
import { useState, useEffect, useRef } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Mascot } from "page-mascot";
import FoldText from "./components/FoldText";
import PaperCrumple from "./components/PaperCrumple";
import SketchbookSection from "./components/SketchbookSection";
import ProjectFolderFan from "./components/ProjectFolderFan";
import arrayRegularFont from "../fonts/Array-Regular.otf";
import bikeSticker from "./assets/bike-sticker.png";
import cameraSticker from "./assets/handdrawn-stickers/camera.png";
import paintSticker from "./assets/handdrawn-stickers/paint.png";
import headphonesSticker from "./assets/handdrawn-stickers/headphones.png";
import nailPolishSticker from "./assets/handdrawn-stickers/polish.png";
import buttonSticker from "./assets/handdrawn-stickers/button.png";
import paperStarSticker from "./assets/handdrawn-stickers/star.png";
import bobaSticker from "./assets/handdrawn-stickers/food/boba.png";
import ramenSticker from "./assets/handdrawn-stickers/food/ramen.png";
import smiskiSticker from "./assets/handdrawn-stickers/food/smiski.png";
import bluprintProjectPreview from "./assets/bluprint-postit-preview.png";
import databridgePostitPreview from "./assets/databridge-postit-preview.png";
import interdisciplinaryPostitPreview from "./assets/interdisciplinary-postit-preview.png";
import wavelengthPostitPreview from "./assets/wavelength-postit-preview.png";
import vinylStarStickers from "./assets/vinyl-star-stickers-cutout.png";
import vinylTrebleSticker from "./assets/vinyl-treble-sticker-cutout.png";
import vinylButterflySticker from "./assets/vinyl-butterfly-sticker-cutout.png";
import vinylStrawberrySticker from "./assets/vinyl-strawberry-sticker-cutout.png";
import vinylSpiderSticker from "./assets/vinyl-spider-sticker-cutout.png";
import vinylAppleSticker from "./assets/vinyl-apple-sticker-cutout.png";
import vinylSproutSticker from "./assets/vinyl-sprout-sticker-cutout.png";
import vinylJellyfishSticker from "./assets/vinyl-jellyfish-sticker-cutout.png";
import vinylRabbitStampSticker from "./assets/vinyl-rabbit-stamp-sticker-cutout.png";
import aboutEducationNote from "./assets/about-original-0.png";
import aboutHobbiesNote from "./assets/about-original-1.png";
import aboutActivitiesNote from "./assets/about-original-2.png";

function InjectFonts() {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;700&family=Caveat:wght@400;600;700&family=Inter:wght@600;700;800;900&family=Press+Start+2P&family=Playfair+Display:wght@400&family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Nothing+You+Could+Do&display=swap";
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
    bg:        "#1c1c1c",
    bgDeep:    "#1c1c1c",
    bgMid:     "#f4f0e7",
    cream:     "#f4f0e7",
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

/* ── Section heading with diamond bullet ── */
function SectionHeading({ children, fontSize = "clamp(46px,5vw,76px)", marginBottom = 36 }) {
    return (
        <div style={{ marginBottom }}>
            <h2 className="page-heading" style={{
                fontSize,
                color: C.ink,
                margin: 0,
            }}>
                {children}
            </h2>
        </div>
    );
}

/* ══════════════════ NAV ══════════════════ */
const NAV_LINKS = [["home", "home"], ["about", "aboutme"], ["experience", "experience"], ["projects", "projects"], ["contact", "contactme"]];

function NavBar() {
    return (
        <nav className="letter-nav" aria-label="Main navigation">
            {NAV_LINKS.map(([label, id]) => (
                <a key={id} href={`#${id}`}>{label}</a>
            ))}
        </nav>
    );
}

/* Slim pixel-button bar that drops in once the hero nav has scrolled away. */
function CompactNav() {
    const [visible, setVisible] = useState(false);
    const [activeId, setActiveId] = useState("home");

    useEffect(() => {
        if (!("IntersectionObserver" in window)) return undefined;
        const heroNav = document.querySelector("#home .letter-nav");
        const navObserver = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
        if (heroNav) navObserver.observe(heroNav);

        // A thin band across the middle of the viewport decides the active section.
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActiveId(entry.target.id);
            });
        }, { rootMargin: "-45% 0px -50% 0px" });
        NAV_LINKS.forEach(([, id]) => {
            const section = document.getElementById(id);
            if (section) sectionObserver.observe(section);
        });
        return () => {
            navObserver.disconnect();
            sectionObserver.disconnect();
        };
    }, []);

    return (
        <nav className={`compact-nav ${visible ? "is-visible" : ""}`} aria-label="Section navigation" aria-hidden={!visible}>
            {NAV_LINKS.map(([label, id]) => (
                <a
                    key={id}
                    href={`#${id}`}
                    tabIndex={visible ? 0 : -1}
                    aria-current={activeId === id ? "location" : undefined}
                    className={activeId === id ? "is-pressed" : ""}
                >
                    {label}
                </a>
            ))}
        </nav>
    );
}

/* ══════════════════ HERO ══════════════════ */
function HeroSection() {
    return (
        <section id="home" className="letter-hero" aria-labelledby="hero-title">
            <NavBar />
            <HeroStickers />
            <div className="letter-intro">
                <div className="letter-greeting">
                <h1 id="hero-title" className="page-heading">
                    <FoldText
                        text="hello, I’m Aditi."
                        foldStyle="paper"
                        splitBy="char"
                        hinge="top"
                        trigger="mount"
                        foldAngle={92}
                        duration={0.65}
                        stagger={0.045}
                        staggerFrom="start"
                        ease="power3.out"
                        hoverRefold={true}
                        refoldRadius={140}
                        refoldAngle={45}
                        perspective={700}
                        creaseShading={0.55}
                        fontSize="inherit"
                        fontWeight="inherit"
                        className="hero-fold-text"
                    />
                </h1>

                </div>
            <div className="letter-mascot-stamp">
                <Mascot
                    className="letter-mascot"
                    directions={`${import.meta.env.BASE_URL}mascots/aditi-cool-directions.webp`}
                    reactions={`${import.meta.env.BASE_URL}mascots/aditi-cool-reactions.webp`}
                    size={230}
                    label="Aditi’s mascot — click to say hello"
                />
            </div>
                <p>I'm currently an undergraduate student at the University of Wisconsin–Madison, majoring in Computer Science and Statistics. I'm passionate about exploring the intersection of technology and data, with particular interests in machine learning, artificial intelligence, and software development.</p>
                <p>This website is a culmination of my academics and professional interests, but also my personality and creative side. I hope you enjoy ;)</p>

                <a className="letter-contact" href="#contactme">let’s connect</a>
            </div>
        </section>
    );
}

function HeroStickers() {
    const boardRef = useRef(null);
    const dragState = useRef(null);
    const dragFrame = useRef(0);
    const pendingPointer = useRef(null);
    // Per-sticker pickup springs (lift + sway), animated outside React renders.
    const stickerMotion = useRef(new Map());
    const motionFrame = useRef(0);
    const motionTime = useRef(0);

    useEffect(() => () => {
        cancelAnimationFrame(dragFrame.current);
        cancelAnimationFrame(motionFrame.current);
    }, []);
    // Desktop centers are percentages of the hero, matching the reference layout.
    const hobbyStickers = [
        {
            id: "camera",
            src: cameraSticker,
            alt: "Hand-drawn red camera with a beaded wrist strap sticker",
            label: "I like taking pictures of nature and little things. I also create videos of everyday pretty things.",
            x: 9.5,
            y: 27.5,
            mobileX: 22,
            mobileY: 22,
            width: "clamp(155px, 15vw, 220px)",
            rotate: "-5deg",
        },
        {
            id: "headphones",
            src: headphonesSticker,
            alt: "Hand-drawn pink headphones sticker",
            label: "My favorite genre is synth pop and RnB. My top artists currently are Tame Impala, the Marias, and Seventeen.",
            x: 32.4,
            y: 26.8,
            mobileX: 68,
            mobileY: 18,
            width: "clamp(126px, 12vw, 178px)",
            rotate: "8deg",
        },
        {
            id: "paint",
            src: paintSticker,
            alt: "Hand-drawn blue paint jar filled with brushes and a pencil sticker",
            label: "I love anything artistic, but especially painting with watercolor or gouache. My toxic trait is thinking I can DIY anything instead of buying it.",
            x: 34,
            y: 55.5,
            mobileX: 80,
            mobileY: 52,
            width: "clamp(100px, 9vw, 132px)",
            rotate: "4deg",
        },
        {
            id: "bike",
            src: bikeSticker,
            alt: "Bike with flowers sticker",
            label: "When I'm stressed, I like to bike on long trails, especially if they're scenic and not hilly.",
            x: 20.3,
            y: 62.6,
            mobileX: 28,
            mobileY: 67,
            width: "clamp(150px, 13.5vw, 208px)",
            rotate: "13deg",
        },
        {
            id: "polish",
            src: nailPolishSticker,
            alt: "Hand-drawn purple nail polish bottle sticker",
            label: "I have been getting into doing my nails. I do my friends' nails and also create press-ons.",
            x: 7.4,
            y: 75,
            mobileX: 62,
            mobileY: 83,
            width: "clamp(68px, 6vw, 88px)",
            rotate: "4deg",
        },
        {
            id: "button",
            src: buttonSticker,
            alt: "Hand-drawn green flower button sticker",
            x: 42.6,
            y: 69,
            mobileX: 10,
            mobileY: 39,
            width: "clamp(58px, 5.5vw, 80px)",
            rotate: "-12deg",
        },
        {
            id: "paper-star",
            src: paperStarSticker,
            alt: "Hand-drawn blue folded paper star sticker",
            x: 44.6,
            y: 25,
            mobileX: 91,
            mobileY: 4,
            width: "clamp(64px, 6vw, 88px)",
            rotate: "15deg",
        },
        {
            id: "ramen",
            src: ramenSticker,
            alt: "Hand-drawn bowl of ramen sticker",
            label: "I love any type of brothy noodle :)",
            x: 21.3,
            y: 38.7,
            mobileX: 40,
            mobileY: 5,
            width: "clamp(136px, 13vw, 194px)",
            rotate: "-7deg",
        },
        {
            id: "boba",
            src: bobaSticker,
            alt: "Hand-drawn boba tea sticker",
            label: "My favorite (basic) drink: brown sugar milk tea with tapioca!",
            x: 44.1,
            y: 47.5,
            mobileX: 6,
            mobileY: 79,
            width: "clamp(74px, 7vw, 102px)",
            rotate: "-6deg",
        },
        {
            id: "smiski",
            src: smiskiSticker,
            alt: "Hand-drawn green Smiski playing a flute sticker",
            label: "I like collecting smiskis! Also, I play the flute ~~",
            x: 9.8,
            y: 52.3,
            mobileX: 94,
            mobileY: 69,
            width: "clamp(66px, 6.5vw, 94px)",
            rotate: "9deg",
        },
    ];
    const [stickerPositions, setStickerPositions] = useState({});
    const [draggingSticker, setDraggingSticker] = useState(null);

    const reduceStickerMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Underdamped springs drive three things per sticker:
    //  - lift/sway: picked up while dragging, swings against the drag, presses
    //    back down with a small bounce when dropped;
    //  - peel: on hover the corner nearest the pointer lifts toward the viewer,
    //    hinged on the opposite edge, and follows the pointer around the sticker.
    const PEEL_K = 300;
    const PEEL_ZETA = 0.48;
    const stepStickerMotion = (now) => {
        motionFrame.current = 0;
        const dt = motionTime.current ? Math.min(0.034, (now - motionTime.current) / 1000) : 0.016;
        motionTime.current = now;
        let active = false;
        stickerMotion.current.forEach((m, id) => {
            const dragging = dragState.current?.id === id;
            if (now - m.lastMove > 40) m.vx *= Math.exp(-dt * 10);
            const liftTarget = dragging ? 1.07 : 1;
            const swayTarget = dragging ? Math.max(-14, Math.min(14, -m.vx * 0.018)) : 0;
            const peelTarget = m.hover && !dragging ? 1 : 0;
            const steps = Math.ceil(dt / 0.004);
            const h = dt / steps;
            for (let i = 0; i < steps; i++) {
                m.liftV += (-520 * (m.lift - liftTarget) - 2 * 0.42 * Math.sqrt(520) * m.liftV) * h;
                m.lift += m.liftV * h;
                m.swayV += (-260 * (m.sway - swayTarget) - 2 * 0.38 * Math.sqrt(260) * m.swayV) * h;
                m.sway += m.swayV * h;
                m.peelV += (-PEEL_K * (m.peel - peelTarget) - 2 * PEEL_ZETA * Math.sqrt(PEEL_K) * m.peelV) * h;
                m.peel += m.peelV * h;
            }
            // When it slaps back down it may dip a hair past flat, never far.
            m.peel = Math.max(-0.08, m.peel);
            // The lifted corner glides after the pointer rather than snapping.
            const follow = 1 - Math.exp(-dt * 16);
            m.dx += (m.aimX - m.dx) * follow;
            m.dy += (m.aimY - m.dy) * follow;

            const moving = dragging
                || Math.abs(m.lift - 1) > 0.0005 || Math.abs(m.liftV) > 0.005
                || Math.abs(m.sway) > 0.02 || Math.abs(m.swayV) > 0.05
                || Math.abs(m.peel - peelTarget) > 0.001 || Math.abs(m.peelV) > 0.01
                || Math.abs(m.aimX - m.dx) > 0.002 || Math.abs(m.aimY - m.dy) > 0.002;
            if (!moving && !m.hover) {
                ["--sticker-lift", "--sticker-sway", "--peel", "--peel-dx", "--peel-dy"].forEach((name) => m.element.style.removeProperty(name));
                stickerMotion.current.delete(id);
                return;
            }
            const style = m.element.style;
            style.setProperty("--sticker-lift", m.lift.toFixed(4));
            style.setProperty("--sticker-sway", `${m.sway.toFixed(3)}deg`);
            style.setProperty("--peel", m.peel.toFixed(4));
            style.setProperty("--peel-dx", m.dx.toFixed(4));
            style.setProperty("--peel-dy", m.dy.toFixed(4));
            if (moving) active = true;
        });
        if (active) motionFrame.current = requestAnimationFrame(stepStickerMotion);
    };

    const wakeStickerMotion = () => {
        if (motionFrame.current) return;
        motionTime.current = 0;
        motionFrame.current = requestAnimationFrame(stepStickerMotion);
    };

    const stickerMotionFor = (id, element) => {
        let motion = stickerMotion.current.get(id);
        if (!motion) {
            motion = { element, lift: 1, liftV: 0, sway: 0, swayV: 0, vx: 0, lastMove: 0, lastX: 0,
                peel: 0, peelV: 0, hover: false, aimX: 0.55, aimY: 0.55, dx: 0.55, dy: 0.55 };
            stickerMotion.current.set(id, motion);
        }
        motion.element = element;
        return motion;
    };

    // Which corner peels: the pointer's direction from the sticker's centre,
    // pushed out to the rim so a pointer near the middle still picks a side.
    const aimPeel = (motion, event) => {
        const rect = motion.element.getBoundingClientRect();
        let x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        let y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        const length = Math.hypot(x, y);
        if (length < 0.001) { x = 0.55; y = 0.55; }
        else {
            const reach = Math.min(1, Math.max(0.6, length));
            x = (x / length) * reach;
            y = (y / length) * reach;
        }
        motion.aimX = x;
        motion.aimY = y;
    };

    const peelStart = (event, sticker) => {
        if (event.pointerType === "touch" || reduceStickerMotion()) return;
        const motion = stickerMotionFor(sticker.id, event.currentTarget);
        if (!motion.hover) {
            // Start the peel from where the pointer came in.
            aimPeel(motion, event);
            motion.dx = motion.aimX;
            motion.dy = motion.aimY;
        }
        motion.hover = true;
        wakeStickerMotion();
    };

    const peelEnd = (sticker) => {
        const motion = stickerMotion.current.get(sticker.id);
        if (!motion) return;
        motion.hover = false;
        wakeStickerMotion();
    };

    const peelFocus = (event, sticker) => {
        if (!event.currentTarget.matches(":focus-visible") || reduceStickerMotion()) return;
        const motion = stickerMotionFor(sticker.id, event.currentTarget);
        motion.hover = true;
        motion.aimX = motion.dx = 0.6;
        motion.aimY = motion.dy = 0.6;
        wakeStickerMotion();
    };

    const beginStickerDrag = (event, sticker) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        const board = boardRef.current;
        if (!board) return;

        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);

        const element = event.currentTarget;
        const rect = board.getBoundingClientRect();
        const stickerRect = element.getBoundingClientRect();
        const halfWidth = stickerRect.width / 2 + 10;
        const halfHeight = stickerRect.height / 2 + 10;
        const currentPosition = {
            x: ((stickerRect.left + stickerRect.width / 2 - rect.left) / rect.width) * 100,
            y: ((stickerRect.top + stickerRect.height / 2 - rect.top) / rect.height) * 100,
        };
        // Text never moves relative to the board mid-drag, so measure it once
        // instead of forcing layout reads on every pointer frame.
        const blocked = [...board.closest('section').querySelectorAll('.letter-greeting h1, .letter-intro p, .letter-contact, .letter-nav')].map((node) => {
            const text = node.getBoundingClientRect();
            return {
                left: text.left - rect.left - halfWidth,
                right: text.right - rect.left + halfWidth,
                top: text.top - rect.top - halfHeight,
                bottom: text.bottom - rect.top + halfHeight,
            };
        });
        dragState.current = {
            id: sticker.id,
            element,
            blocked,
            halfWidth,
            halfHeight,
            startPointerX: event.clientX,
            startPointerY: event.clientY,
            startX: currentPosition.x,
            startY: currentPosition.y,
            position: null,
        };
        if (!reduceStickerMotion()) {
            const motion = stickerMotionFor(sticker.id, element);
            motion.lastMove = event.timeStamp;
            motion.lastX = event.clientX;
            wakeStickerMotion();
        }
        setDraggingSticker(sticker.id);
    };

    const updateStickerPosition = (event) => {
        const drag = dragState.current;
        if (!drag) return;

        const rect = boardRef.current.getBoundingClientRect();
        const nextX = drag.startX / 100 * rect.width + event.clientX - drag.startPointerX;
        const nextY = drag.startY / 100 * rect.height + event.clientY - drag.startPointerY;
        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
        const minX = drag.halfWidth;
        const maxX = rect.width - drag.halfWidth;
        const minY = drag.halfHeight;
        const maxY = rect.height - drag.halfHeight;
        const blocked = drag.blocked;
        const x = clamp(nextX, minX, maxX);
        const y = clamp(nextY, minY, maxY);
        const allowed = (point) => !blocked.some((area) => point.x > area.left && point.x < area.right && point.y > area.top && point.y < area.bottom);
        // Test the nearest edges of every protected text area, including corners.
        const xs = [x, minX, maxX, ...blocked.flatMap((area) => [area.left, area.right])];
        const ys = [y, minY, maxY, ...blocked.flatMap((area) => [area.top, area.bottom])];
        // Most moves need no collision search at all.
        const candidates = allowed({ x, y }) ? [{ x, y }] : xs.flatMap((cx) => ys.map((cy) => ({ x: clamp(cx, minX, maxX), y: clamp(cy, minY, maxY) }))).filter(allowed);
        const position = candidates.reduce((best, point) => !best || Math.hypot(point.x - x, point.y - y) < Math.hypot(best.x - x, best.y - y) ? point : best, null);
        if (!position) return;
        // Write straight to the element while dragging; React state is only
        // committed on release, so the hero does not re-render every frame.
        drag.position = { x: position.x / rect.width * 100, y: position.y / rect.height * 100 };
        drag.element.style.left = `${drag.position.x}%`;
        drag.element.style.top = `${drag.position.y}%`;
    };

    const moveSticker = (event) => {
        const drag = dragState.current;
        if (!drag) {
            const hovered = [...stickerMotion.current.values()].find((m) => m.element === event.currentTarget && m.hover);
            if (hovered) {
                aimPeel(hovered, event);
                wakeStickerMotion();
            }
            return;
        }
        const motion = stickerMotion.current.get(drag.id);
        if (motion) {
            const now = event.timeStamp;
            const dt = Math.max(0.008, (now - motion.lastMove) / 1000);
            const blend = 1 - Math.exp(-dt * 24);
            motion.vx += ((event.clientX - motion.lastX) / dt - motion.vx) * blend;
            motion.lastX = event.clientX;
            motion.lastMove = now;
            wakeStickerMotion();
        }
        pendingPointer.current = { clientX: event.clientX, clientY: event.clientY };
        if (dragFrame.current) return;
        dragFrame.current = requestAnimationFrame(() => {
            dragFrame.current = 0;
            updateStickerPosition(pendingPointer.current);
            pendingPointer.current = null;
        });
    };

    const endStickerDrag = (event) => {
        cancelAnimationFrame(dragFrame.current);
        dragFrame.current = 0;
        if (pendingPointer.current) {
            updateStickerPosition(pendingPointer.current);
            pendingPointer.current = null;
        }
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        const drag = dragState.current;
        dragState.current = null;
        if (drag?.position) {
            setStickerPositions((positions) => ({ ...positions, [drag.id]: drag.position }));
        }
        wakeStickerMotion();
        setDraggingSticker(null);
    };

    return (
                <div className="about-draggable-sticker-layer hero-sticker-layer" ref={boardRef} aria-label="Draggable hobby stickers">
                    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
                        <defs>
                            <filter id="hero-sticker-cut-edge" x="-12%" y="-12%" width="124%" height="124%" colorInterpolationFilters="sRGB">
                                <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="edge" />
                                <feFlood floodColor="white" result="white" />
                                <feComposite in="white" in2="edge" operator="in" result="border" />
                                <feMerge>
                                    <feMergeNode in="border" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                    </svg>

                    {hobbyStickers.map((sticker) => {
                        const position = stickerPositions[sticker.id];

                        return (
                            <button
                                key={sticker.id}
                                type="button"
                                className={`about-draggable-sticker ${sticker.id !== "bike" ? "handdrawn-sticker" : ""} ${draggingSticker === sticker.id ? "is-dragging" : ""}`}
                                aria-label={`Drag ${sticker.alt}`}
                                onPointerDown={(event) => beginStickerDrag(event, sticker)}
                                onPointerMove={moveSticker}
                                onPointerUp={endStickerDrag}
                                onPointerCancel={endStickerDrag}
                                onPointerEnter={(event) => peelStart(event, sticker)}
                                onPointerLeave={() => peelEnd(sticker)}
                                onFocus={(event) => peelFocus(event, sticker)}
                                onBlur={() => peelEnd(sticker)}
                                style={{
                                    "--sticker-width": sticker.width,
                                    "--sticker-rotate": sticker.rotate,
                                    "--initial-sticker-x": sticker.x,
                                    "--initial-sticker-y": sticker.y,
                                    "--mobile-sticker-x": sticker.mobileX,
                                    "--mobile-sticker-y": sticker.mobileY,
                                    left: position ? `${position.x}%` : undefined,
                                    top: position ? `${position.y}%` : undefined,
                                }}
                            >
                                <img src={sticker.src} alt="" draggable="false" />
                                {sticker.label && <span className="about-hobby-blurb">{sticker.label}</span>}
                            </button>
                        );
                    })}
                </div>
    );
}

/* ══════════════════ ABOUT ME ══════════════════ */
function AboutStack({ children, tilt, yOffset = 0, zIndex = 1 }) {
    const note = tilt === -2
        ? { src: aboutEducationNote, title: "Education" }
        : tilt === 3
            ? { src: aboutHobbiesNote, title: "Hobbies" }
            : { src: aboutActivitiesNote, title: "Activities" };
    return (
        <div className="about-stack-shell" style={{ transform: `translateY(${yOffset}px)`, zIndex }}>
            <PaperCrumple
                src={note.src}
                alt={`${note.title} post-it note`}
                width={note.title === "Education" ? 420 : 400}
                height={520}
                sceneHeight={640}
                imageFit={note.title === "Education" ? "fill" : "contain"}
                releaseBehavior="restore"
                crumpleAmount={0.95}
                crumpleDuration={0.85}
                releaseDuration={0.7}
                foldCount={6}
                foldSharpness={0.45}
                wrinkleDepth={0.85}
                detail={80}
                creaseStrength={0.18}
                paperColor="#f4f0e8"
                paperTexture={0.08}
                draggable
                returnToOrigin
            />
            <div className="about-note-text">{children}</div>
        </div>
    );
}

const ABOUT = { scrapInk: "#2B2420", twine: "#8A6D4B" };

function AboutSection() {
    return (
        <section id="aboutme" className="about-corkboard-section" aria-label="About Me">
            <SectionHeading marginBottom={16}>about me</SectionHeading>
            <div className="about-corkboard-frame">
                <div className="about-corkboard-postits about-stack-grid">
                    <AboutStack tilt={-2} yOffset={16} zIndex={30}>
                        <article className="about-paper-surface about-ref-torn-teal about-paper-ref-teal about-board-postit">
                            <div className="about-paper-section about-paper-heading">
                                <span style={{ fontFamily: "var(--font-hand)", fontSize: 19, fontWeight: 700, color: ABOUT.scrapInk, opacity: 0.62, textTransform: "uppercase", marginBottom: 8, display: "block" }}>Background</span>
                                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: ABOUT.scrapInk, margin: 0 }}>Education</h3>
                            </div>
                            <div className="about-paper-section">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, marginBottom: 10 }}>
                                    <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.52 }}>2025 - 2028</span>
                                    <span style={{ fontFamily: "var(--font-hand)", fontSize: 16, opacity: 0.78 }}>Dean&apos;s List</span>
                                </div>
                                <p style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 700, margin: "0 0 4px" }}>B.S. Computer Science and Statistics</p>
                                <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, opacity: 0.78, margin: 0 }}>University of Wisconsin-Madison</p>
                            </div>
                            <div className="about-paper-section">
                                <p style={{ fontFamily: "var(--font-hand)", fontSize: 21, margin: "0 0 8px" }}>Key Coursework:</p>
                                <ul style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500, lineHeight: 1.8, opacity: 0.92, paddingLeft: 18, margin: 0 }}>
                                    <li>Algorithms & Software Development</li>
                                    <li>Data Structures & Object-Oriented Programming</li>
                                    <li>Linear Algebra & Calculus III</li>
                                    <li>Statistical Methods in R</li>
                                    <li>Computer Engineering</li>
                                </ul>
                            </div>
                        </article>
                    </AboutStack>

                    <AboutStack tilt={3} yOffset={-8} zIndex={20}>
                        <article className="about-paper-surface about-ref-torn-pink about-paper-ref-pink about-board-postit">
                            <div className="about-paper-section about-paper-heading">
                                <span style={{ fontFamily: "var(--font-hand)", fontSize: 19, fontWeight: 700, color: ABOUT.scrapInk, opacity: 0.62, textTransform: "uppercase", marginBottom: 8, display: "block" }}>Vibe</span>
                                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: ABOUT.scrapInk, margin: 0 }}>Hobbies</h3>
                                <p className="hobbies-paper-copy">Photography, synth pop &amp; RnB, piano, watercolor painting, scenic bike rides, and making press-on nails.</p>
                            </div>
                        </article>
                    </AboutStack>

                    <AboutStack tilt={-1} yOffset={24} zIndex={10}>
                        <article className="about-paper-surface about-ref-torn-grid about-paper-ref-grid about-board-postit">
                            <div className="about-paper-section about-paper-heading">
                                <span style={{ fontFamily: "var(--font-hand)", fontSize: 19, fontWeight: 700, color: ABOUT.scrapInk, opacity: 0.62, textTransform: "uppercase", marginBottom: 8, display: "block" }}>Involvement</span>
                                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: ABOUT.scrapInk, margin: 0 }}>Activities</h3>
                            </div>
                            <div className="about-paper-section">
                                <div style={{ display: "grid", gap: 14 }}>
                                    <div>
                                        <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.52 }}>September 2026 - Now</span>
                                        <p style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, margin: "3px 0 0" }}>Undergraduate Research Assistant</p>
                                    </div>
                                    <div>
                                        <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.52 }}>October 2026 - Now</span>
                                        <p style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, margin: "3px 0 0" }}>AI Safety Fellow, WAISI</p>
                                    </div>
                                    <div>
                                        <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.52 }}>September 2025 - Now</span>
                                        <p style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, margin: "3px 0 0" }}>Education Chair, Code To Connect</p>
                                    </div>
                                    <div>
                                        <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.52 }}>September 2025 - Now</span>
                                        <p style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, margin: "3px 0 0" }}>Women and Computing Machines</p>
                                    </div>
                                    <div>
                                        <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.52 }}>September 2025 - Now</span>
                                        <p style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, margin: "3px 0 0" }}>Social Tennis</p>
                                    </div>
                                </div>
                            </div>
                            <div className="about-paper-section" style={{ paddingTop: 0 }}>
                                <div>
                                    <p style={{ fontFamily: "var(--font-hand)", fontSize: 17, fontStyle: "italic", opacity: 0.82, margin: 0 }}>&quot;Making cool things with cool people.&quot;</p>
                                </div>
                            </div>
                        </article>
                    </AboutStack>
                </div>

            </div>
        </section>
    );
}

/* ══════════════════ MOVING FILM STRIP ══════════════════ */
// Add your photos here later: import each image above, then replace `src: null`.
const FILM_PHOTOS = [
    { src: null, alt: "Aditi photo 1", mark: "✿" },
    { src: null, alt: "Aditi photo 2", mark: "♡" },
    { src: null, alt: "Aditi photo 3", mark: "✦" },
    { src: null, alt: "Aditi photo 4", mark: "☻" },
    { src: null, alt: "Aditi photo 5", mark: "❀" },
    { src: null, alt: "Aditi photo 6", mark: "☆" },
];

function FilmFrames({ hidden = false }) {
    return (
        <div className="film-strip-set" aria-hidden={hidden || undefined}>
            {FILM_PHOTOS.map((photo, index) => (
                <figure className="film-frame" key={`${hidden ? "copy" : "original"}-${index}`}>
                    <span className="film-frame-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    {photo.src ? (
                        <img src={photo.src} alt={hidden ? "" : photo.alt} />
                    ) : (
                        <div className="film-photo-placeholder" role={hidden ? undefined : "img"} aria-label={hidden ? undefined : `${photo.alt} placeholder`}>
                            <span aria-hidden="true">{photo.mark}</span>
                            <small>your photo here</small>
                        </div>
                    )}
                </figure>
            ))}
        </div>
    );
}

function FilmStripSection() {
    return (
        <section className="film-memories" aria-label="A moving film strip of photos from Aditi's life">
            <div className="film-strip-window">
                <div className="film-strip-track">
                    <FilmFrames />
                    <FilmFrames hidden />
                </div>
            </div>
        </section>
    );
}

/* ══════════════════ PROJECTS ══════════════════ */
const PROJECTS = [
    { front: "#a8ae95", back: "#989f85", tabL: 3, tabW: 36, accent: "#9ea76b", noteColor: "#dfe4b9", noteRot: -5, tilt: 0.8, tab: "Bluprint", badge: "Personalized Interior Decorator", title: "Bluprint", desc: "A room design website that takes user's style preferences and generates furniture recommendations. Includes a customizable diagram of room, visual representation of items recommended, and dashboard to view all decorated rooms.", tags: ["React","Node.js", "Three.js","MongoDB"], year: "2024", emoji: "🐚", image: bluprintProjectPreview, noteCaption: "see it live", projectUrl: "https://bluprint-iroq.onrender.com/", color: C.fresh, ink: C.ink, descColor: C.ink },
    { front: "#f6d2da", back: "#e9bfc9", tabL: 32, tabW: 36, accent: "#e3a7b4", noteColor: "#efe8ca", noteRot: -6, tilt: -0.6, tab: "Databridge", badge: "Financial Ontology Platform", title: "Databridge", desc: "Detailed a technical specification for HGS internship: Microsoft Fabric-native financial data platform, defining the OneLake medallion architecture, Direct Lake semantic layer, capacity tiering, and security requirements across a 17-item decision register.\n", tags: ["SQL","Microsoft Fabric","Power BI","OneLake"], year: "2026", emoji: "🗺️", image: databridgePostitPreview, noteCaption: "final presentation day!!", color: C.yellow, ink: C.ink, descColor: C.ink },
    { front: "#d6b891", back: "#c6a57d", tabL: 61, tabW: 36, accent: "#cfc38d", noteColor: "#f9d1d9", noteRot: 4, tilt: 1, tab: "Tech and Humanity", badge: "Interdisciplinary Project", title: "Technology vs. Human Experiences", desc: "Interactive presentation detailing research study on whether technology/AI is replacing traditionally and evolutionarily human traits and experiences. Throughout this project, I use a psychological study CASA(Computers Are Social Actors), curiosity experiments, and popular media like WALL-E to examine how humans may become emotionally and behaviorally dependent on technology. \n", year: "2024", emoji: "📝", image: interdisciplinaryPostitPreview, noteCaption: "see it live", projectUrl: "https://prezi.com/p/1snxsaer21hu/?present=1", noteImageFit: "contain", color: C.softpink, ink: C.ink, descColor: C.ink },
    { front: "#abcee3", back: "#98bdd4", tabL: 3, tabW: 36, accent: "#8fb3cf", noteColor: "#dfe4b9", noteRot: -5, tilt: -1.2, tab: "Wavelength", badge: "Personal Symptom Log", title: "Wavelength", desc: "A symptom-tracking website that lets users log physical and mental symptoms by text or voice. Includes graphs of recurring symptoms over time, a calendar of past entries, AI-generated summaries, and a PDF brief to bring to doctor's appointments.", tags: ["Vite","Firebase","Supabase","GroqCloud"], year: "2023", emoji: "🔍", image: wavelengthPostitPreview, noteCaption: "see it live", noteCaptionPosition: "top", projectUrl: "https://wavelength-two-flame.vercel.app/", noteImageFit: "contain", color: C.azeitona, ink: C.ink, descColor: C.ink },
];

function ProjectsSection() {
    return (
        <section id="projects" style={{ background: C.cream, padding: "72px clamp(18px, 4vw, 52px) 96px", position: "relative", overflow: "hidden" }}>
            <SectionHeading>projects</SectionHeading>
            <ProjectFolderFan projects={PROJECTS} />
        </section>
    );
}

const EXPERIENCES = [
        { folder: "HGS", year: "Summer 2026", title: "Cloud Analytics Intern", sub: "At Hinduja Group Services, I helped write the technical spec for Databridge, a financial data platform built natively on Microsoft Fabric. That meant working through the OneLake medallion architecture, the Direct Lake semantic layer, capacity tiering, and security, all tracked in a 17-item decision register. I also built a Power BI semantic model by flattening a parent-child employee hierarchy into a dimension table with a 7-relationship star schema, then added an EDA agent on top as an AI proof-of-concept." },
        { folder: "Undergrad Research", year: "Fall 2026", title: "Research Assistant", sub: "As an Undergraduate Research Assistant in Prof. Andi Wang's lab in the Industrial Engineering department, I'm studying Gaussian processes, optimization, and probabilistic network models and how they apply to real engineering problems. Day to day, that means reading and summarizing research papers, implementing methods in Python and R to run experiments, and presenting my progress to Prof. Wang every week. I'm also part of the Undergraduate Research Scholars program, a year-long mentored research experience with weekly seminars." },
        { folder: "Instructor", year: "2024 - Now", title: "Music & Dance Suite", sub: "At The Music and Dance Suite, I taught private piano lessons for two years, building customized lesson plans for 20+ students. I adapted my techniques for neurodiverse and nonverbal learners so every student could make progress in a way that worked for them. I also organized and led performance recitals, which boosted student involvement and kept students coming back." },
        { folder: "Volunteer", year: "2024 - 2025", title: "Main Desk & Central Supply Volunteer", sub: "At Rush Copley Medical Center, I volunteered at the main desk and in central supply for about a year, logging 96 hours. At the desk, I helped 50+ patients and visitors per shift with directions and questions in a fast-paced hospital environment. I also handled the weekly stocking and delivery of medical supplies across multiple departments." },
        { folder: "VP", year: "Fall 2022 - 2025", title: "Teaching Assistant", sub: "At Youth and Government in Naperville, I served as school-wide Vice President and state-wide Assistant Director of Lobbyists over four years. I drove the passage of bills on recidivism and gambling advertisements, both approved unanimously at the state level. I was also recognized as Most Effective Lobbyist at the 2023 statewide conference." },
    ];

const EXPERIENCE_CARDS = EXPERIENCES.map((experience) => ({
    name: experience.title,
    role: experience.folder,
    description: experience.sub,
    stat: experience.year,
}));

function ExperienceSection() {
    return (
        <section id="experience" className="paper-experiences">
            <SectionHeading marginBottom={10}>experiences</SectionHeading>
            <p className="paper-section-note">A few places I’ve learned, contributed, and grown.</p>
            <div className="experience-orbit-stage">
                <OrbitCardStack
                    items={EXPERIENCE_CARDS}
                    defaultActiveIndex={0}
                    spread={140}
                    lift={34}
                    showPortrait={false}
                    label="Experience card stack"
                    className="experience-orbit"
                    cardClassName="experience-orbit-card"
                />
            </div>
        </section>
    );
}

/* ══════════════════ CONTACT ══════════════════ */
function ContactSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || !("IntersectionObserver" in window)) return;
        let nearViewport = false;
        const updateAnimation = () => {
            section.style.setProperty("--contact-animation-state",
                nearViewport && !document.hidden ? "running" : "paused");
        };
        const observer = new IntersectionObserver(([entry]) => {
            nearViewport = entry.isIntersecting;
            updateAnimation();
        }, { rootMargin: "200px" });
        observer.observe(section);
        document.addEventListener("visibilitychange", updateAnimation);
        updateAnimation();
        return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", updateAnimation);
            section.style.removeProperty("--contact-animation-state");
        };
    }, []);
    const [message, setMessage] = useState("");
    const [replyEmail, setReplyEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [sendState, setSendState] = useState("idle");
    const [sendStatus, setSendStatus] = useState("");
    const sendingRef = useRef(false);
    const messageInputRef = useRef(null);
    const terminalContacts = [
        {
            command: "contact.email",
            value: "aditi.amarnath@gmail.com",
            href: "mailto:aditi.amarnath@gmail.com",
        },
        {
            command: "contact.linkedin",
            value: "linkedin.com/in/aditi-amarnath/",
            href: "https://www.linkedin.com/in/aditi-amarnath/",
        },
        {
            command: "contact.github",
            value: "github.com/aditiaamarnath-rgb",
            href: "https://github.com/aditiaamarnath-rgb",
        },
    ];
    const trimmedMessage = message.trim();

    const sendMessage = async (event) => {
        event.preventDefault();
        if (!trimmedMessage || sendingRef.current) return;
        const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT;
        if (!endpoint) {
            setSendState("error");
            setSendStatus("Message sending isn’t available yet. Please use the email link above.");
            return;
        }
        sendingRef.current = true;
        setSendState("sending");
        setSendStatus("Sending your message…");
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: trimmedMessage, email: replyEmail.trim(), website }),
                signal: AbortSignal.timeout(15000),
            });
            const result = await response.json();
            if (!response.ok || result.ok !== true) throw new Error(result.error || "Could not send your message. Please try again.");
            setSendState("sent");
            setSendStatus("Message sent. Thanks for reaching out!");
            setMessage("");
            setReplyEmail("");
        } catch (error) {
            setSendState("error");
            setSendStatus(error.name === "TimeoutError" || error instanceof TypeError
                ? "Could not confirm delivery. Please try again later or use the email link above."
                : error.message);
        } finally {
            sendingRef.current = false;
        }
    };

    const focusMessagePrompt = (event) => {
        if (event.target.closest("a, input, button, label")) return;
        messageInputRef.current?.focus();
    };

    return (
        <section id="contactme" ref={sectionRef} style={{ background: C.bgMid, padding: "90px 52px 110px", position: "relative", overflow: "hidden", isolation: "isolate" }}>

            <div className="contact-vinyl-stage" aria-hidden="true">
                <div className="contact-vinyl">
                    <img src={vinylStarStickers} alt="" loading="lazy" decoding="async" className="contact-vinyl-sticker contact-vinyl-sticker-stars" />
                    <img src={vinylTrebleSticker} alt="" loading="lazy" decoding="async" className="contact-vinyl-sticker contact-vinyl-sticker-treble" />
                    <img src={vinylButterflySticker} alt="" loading="lazy" decoding="async" className="contact-vinyl-sticker contact-vinyl-sticker-butterfly" />
                    <img src={vinylStrawberrySticker} alt="" loading="lazy" decoding="async" className="contact-vinyl-sticker contact-vinyl-sticker-strawberry" />
                    <img src={vinylSpiderSticker} alt="" loading="lazy" decoding="async" className="contact-vinyl-sticker contact-vinyl-sticker-spider" />
                    <img src={vinylAppleSticker} alt="" loading="lazy" decoding="async" className="contact-vinyl-sticker contact-vinyl-sticker-apple" />
                    <img src={vinylSproutSticker} alt="" loading="lazy" decoding="async" className="contact-vinyl-sticker contact-vinyl-sticker-sprout" />
                    <img src={vinylJellyfishSticker} alt="" loading="lazy" decoding="async" className="contact-vinyl-sticker contact-vinyl-sticker-jellyfish" />
                    <img src={vinylRabbitStampSticker} alt="" loading="lazy" decoding="async" className="contact-vinyl-sticker contact-vinyl-sticker-rabbit-stamp" />
                    <div className="contact-vinyl-label">
                        <span>Limited Edition</span>
                    </div>
                </div>
            </div>

            <div style={{ position: "relative", zIndex: 2 }}>
                <SectionHeading>contact information</SectionHeading>
            </div>

            <div className="contact-terminal-shell">
                <div className="contact-terminal">
                    <div className="contact-terminal-header">
                        <span className="contact-terminal-dot" />
                        <span className="contact-terminal-dot" />
                        <span className="contact-terminal-dot" />
                        <span className="contact-terminal-path">aditi@portfolio:~</span>
                    </div>
                    <div className="contact-terminal-body" onClick={focusMessagePrompt}>
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
                                href={`${import.meta.env.BASE_URL}resume.pdf`}
                                download
                            >
                                download resume
                            </a>
                        </div>
                        <form className="contact-terminal-form" onSubmit={sendMessage}>
                            <div className="contact-terminal-message-line">
                                <label className="contact-terminal-prompt-symbol" htmlFor="contact-reply-email">&gt; reply email:</label>
                                <input id="contact-reply-email" className="contact-terminal-input" type="email" value={replyEmail} onChange={(event) => setReplyEmail(event.target.value)} placeholder="optional" autoComplete="email" maxLength={254} disabled={sendState === "sending"} />
                            </div>
                            <div className="contact-terminal-honeypot" aria-hidden="true">
                                <label htmlFor="contact-website">Website</label>
                                <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
                            </div>
                            <div className="contact-terminal-message-line">
                                <label className="contact-terminal-prompt-symbol" htmlFor="contact-message">&gt;</label>
                                <input ref={messageInputRef} id="contact-message" className="contact-terminal-input" type="text" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="type a message and press enter" autoComplete="off" aria-label="Message to Aditi" aria-describedby="contact-send-status" maxLength={4000} required disabled={sendState === "sending"} />
                                <button className="contact-terminal-send" type="submit" disabled={!trimmedMessage || sendState === "sending"}>{sendState === "sending" ? "sending…" : "send ↵"}</button>
                            </div>
                            <p id="contact-send-status" className="contact-terminal-send-status" role="status" aria-live="polite" aria-atomic="true">{sendStatus}</p>
                        </form>
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
        @font-face {
          font-family: 'Array';
          src: url("${arrayRegularFont}") format("opentype");
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (prefers-reduced-motion: no-preference) {
          html { scroll-behavior: smooth; }
        }
        body { background: #efe8ca; }
        button { outline: none; }
        .about-corkboard-section {
          background: #333333;
          padding: 72px clamp(16px, 4vw, 52px) 86px;
          position: relative;
          overflow: hidden;
        }
        .about-corkboard-frame {
          max-width: 1220px;
          min-height: clamp(690px, 59vw, 770px);
          margin: 0 auto;
          border: 3px solid #4b442d;
          border-radius: 8px;
          background: #4b442d;
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
          color: #403b28;
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
            #f9d1d9;
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
          transform: translate(-50%, -50%) rotate(calc(var(--sticker-rotate) + var(--sticker-sway, 0deg))) scale(var(--sticker-lift, 1));
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
        .about-draggable-sticker.handdrawn-sticker img {
          /* Original drawing pixels; the thin edge and shadow are CSS only. */
          height: auto;
          aspect-ratio: auto;
          object-fit: contain;
          filter: url(#hero-sticker-cut-edge) drop-shadow(1px 3px 2px rgba(43,36,32,0.18));
        }
        .about-draggable-sticker.handdrawn-sticker:hover,
        .about-draggable-sticker.handdrawn-sticker:focus-visible,
        .about-draggable-sticker.handdrawn-sticker.is-dragging {
          filter: none;
        }
        .about-draggable-sticker:hover,
        .about-draggable-sticker:focus-visible {
          z-index: 4;
          filter: brightness(1.04);
        }
        .about-draggable-sticker:focus-visible {
          outline: 3px solid rgba(158,167,107,0.85);
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
        /* Peel: --peel (0..1, springy) and --peel-dx/--peel-dy (direction of the
           lifting corner, -1..1) are written by the sticker motion loop. The img
           hinges on the edge opposite the pointer and that corner rises toward
           the viewer; the button keeps its own position transform. */
        .hero-sticker-layer .about-draggable-sticker img {
          transform-origin: calc(50% - var(--peel-dx, 0) * 50%) calc(50% - var(--peel-dy, 0) * 50%);
          transform:
            perspective(520px)
            translateY(calc(var(--peel, 0) * -3px))
            rotateX(calc(var(--peel, 0) * var(--peel-dy, 0) * 16deg))
            rotateY(calc(var(--peel, 0) * var(--peel-dx, 0) * -16deg))
            scale(calc(1 + var(--peel, 0) * 0.035));
        }
        /* The shadow stretches out under the lifted corner. */
        .hero-sticker-layer .about-draggable-sticker:not(.handdrawn-sticker) img {
          filter: var(--white-sticker-border) drop-shadow(
            calc(3px + var(--peel, 0) * (1px + var(--peel-dx, 0) * 3px))
            calc(5px + var(--peel, 0) * (6px + var(--peel-dy, 0) * 3px))
            calc(max(0px, var(--peel, 0) * 8px))
            rgba(43,36,32,0.24));
        }
        .hero-sticker-layer .about-draggable-sticker.handdrawn-sticker img {
          filter: url(#hero-sticker-cut-edge) drop-shadow(
            calc(1px + var(--peel, 0) * (3px + var(--peel-dx, 0) * 3px))
            calc(3px + var(--peel, 0) * (8px + var(--peel-dy, 0) * 3px))
            calc(2px + max(0px, var(--peel, 0) * 6px))
            rgba(43,36,32,calc(0.18 + var(--peel, 0) * 0.04)));
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
        .experience-heading-layout {
          max-width: 1480px;
          margin: 0 auto;
          position: relative;
        }
        .experience-heading-copy {
          position: relative;
          z-index: 2;
          padding-top: 6px;
          width: max-content;
          max-width: min(520px, 42vw);
        }
        .experience-title-shell {
          margin-bottom: 36px;
        }
        .experience-title-wave {
          width: max-content;
          max-width: 100%;
          color: var(--experience-title-base);
          cursor: pointer;
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          outline: none;
          user-select: none;
        }
        .experience-title-letter {
          display: inline-block;
          color: var(--experience-title-base);
          opacity: 0.64;
          text-shadow: none;
          transform: translateY(0) scale(1);
          transition:
            color 58ms ease,
            opacity 58ms ease,
            text-shadow 58ms ease,
            transform 58ms ease;
          will-change: color, opacity, text-shadow, transform;
        }
        .experience-title-letter.is-lit {
          color: var(--experience-title-lit);
          opacity: 1;
          text-shadow:
            0 0 8px var(--experience-title-glow),
            0 0 18px rgba(249, 209, 217, 0.64),
            0 0 30px rgba(255, 255, 255, 0.32);
          transform: translateY(-1px) scale(1.035);
        }
        .experience-title-wave:hover .experience-title-letter,
        .experience-title-wave:focus-visible .experience-title-letter {
          opacity: 0.74;
        }
        .experience-title-wave:hover .experience-title-letter.is-lit,
        .experience-title-wave:focus-visible .experience-title-letter.is-lit {
          opacity: 1;
        }
        .experience-title-wave:focus-visible {
          outline: 3px solid rgba(249, 209, 217, 0.72);
          outline-offset: 8px;
          border-radius: 6px;
        }
        .experience-computer {
          width: min(1280px, 104vw);
          max-width: none;
          aspect-ratio: 16 / 9;
          margin: -104px auto 0;
          position: relative;
          z-index: 1;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }
        .experience-computer-screen {
          position: absolute;
          left: 24.2%;
          top: 24.4%;
          width: 51.8%;
          height: 52.1%;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: minmax(126px, 0.72fr) minmax(0, 1.28fr);
          gap: clamp(7px, 1.1vw, 15px);
          align-items: start;
          padding: clamp(10px, 1.55vw, 20px);
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
          --folder-color: #efe8ca;
          --folder-tab-color: #9ea76b;
          position: relative;
          isolation: isolate;
          width: 100%;
          min-height: clamp(58px, 6.4vw, 76px);
          border: 0;
          border-radius: 6px;
          padding: 5px 4px 4px;
          color: #403b28;
          background: transparent;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 5px;
          transition:
            background-color 180ms ease,
            box-shadow 180ms ease,
            filter 180ms ease;
        }
        .experience-screen-folder::before {
          content: "";
          position: absolute;
          inset: -4px -3px;
          z-index: -1;
          border: 2px solid rgba(249,209,217,0);
          border-radius: 8px;
          background: rgba(255,255,255,0.1);
          opacity: 0;
          transition:
            opacity 180ms ease,
            border-color 180ms ease;
        }
        .experience-screen-folder:hover,
        .experience-screen-folder:focus-visible,
        .experience-screen-folder.is-active {
          background: rgba(255,255,255,0.12);
          box-shadow: none;
          filter: brightness(1.04);
        }
        .experience-screen-folder:hover::before,
        .experience-screen-folder:focus-visible::before,
        .experience-screen-folder.is-active::before {
          opacity: 1;
          border-color: rgba(249,209,217,0.82);
        }
        .experience-screen-folder:focus-visible {
          outline: 3px solid rgba(249,209,217,0.9);
          outline-offset: 2px;
        }
        .experience-screen-folder-icon {
          display: block;
          width: clamp(50px, 5.6vw, 66px);
          height: auto;
          margin-top: 4px;
          filter: drop-shadow(3px 4px 0 rgba(0,0,0,0.14));
          pointer-events: none;
          user-select: none;
          transition: transform 180ms ease, filter 180ms ease;
        }
        .experience-screen-folder:hover .experience-screen-folder-icon,
        .experience-screen-folder:focus-visible .experience-screen-folder-icon,
        .experience-screen-folder.is-active .experience-screen-folder-icon {
          filter: drop-shadow(4px 7px 0 rgba(0,0,0,0.22));
          transform: translateY(-6px) rotate(-2deg) scale(1.06);
        }
        .experience-screen-folder-label {
          max-width: 100%;
          font-family: var(--font-ui);
          font-size: clamp(10px, 1.05vw, 13px);
          font-weight: 900;
          line-height: 1.12;
          letter-spacing: 0;
          text-align: center;
          overflow-wrap: anywhere;
        }
        .experience-file-window {
          --window-accent: #9ea76b;
          position: relative;
          z-index: 3;
          min-width: 0;
          max-height: 100%;
          align-self: start;
          display: flex;
          flex-direction: column;
          min-height: clamp(220px, 23vw, 300px);
          padding: clamp(22px, 2.6vw, 32px);
          background: #fff8e2;
          border: 3px solid #4b442d;
          border-radius: 8px;
          color: #403b28;
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
          border-bottom: 3px solid #4b442d;
        }
        .experience-file-close {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 2;
          width: 27px;
          height: 27px;
          border: 2px solid #4b442d;
          border-radius: 5px;
          padding: 0;
          display: grid;
          place-items: center;
          color: #403b28;
          background: rgba(255,255,255,0.64);
          cursor: pointer;
          font-family: var(--font-ui);
          font-size: 18px;
          font-weight: 900;
          line-height: 1;
        }
        .experience-file-close:hover,
        .experience-file-close:focus-visible {
          background: #f9d1d9;
        }
        .experience-file-close:focus-visible {
          outline: 2px solid rgba(249,209,217,0.9);
          outline-offset: 2px;
        }
        .experience-file-next,
        .experience-file-back {
          position: absolute;
          top: 50%;
          z-index: 3;
          width: 34px;
          height: 42px;
          border: 2px solid rgba(54,47,34,0.54);
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: #362F22;
          background: color-mix(in srgb, var(--window-accent) 34%, #fff8ea);
          box-shadow: 2px 3px 0 rgba(0,0,0,0.14);
          cursor: pointer;
          font-family: var(--font-ui);
          font-size: 27px;
          font-weight: 900;
          line-height: 1;
          transform: translateY(-50%);
          transition: filter 160ms ease, transform 160ms ease;
        }
        .experience-file-next {
          right: 10px;
        }
        .experience-file-back {
          left: 10px;
        }
        .experience-file-next:hover,
        .experience-file-next:focus-visible,
        .experience-file-back:hover,
        .experience-file-back:focus-visible {
          filter: brightness(1.05);
        }
        .experience-file-next:hover,
        .experience-file-next:focus-visible {
          transform: translateY(-50%) translateX(1px);
        }
        .experience-file-back:hover,
        .experience-file-back:focus-visible {
          transform: translateY(-50%) translateX(-1px);
        }
        .experience-file-next:focus-visible,
        .experience-file-back:focus-visible {
          outline: 2px solid rgba(185,125,123,0.82);
          outline-offset: 3px;
        }
        .experience-file-content {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding-right: 6px;
          scrollbar-width: thin;
          scrollbar-color: rgba(54,47,34,0.38) transparent;
        }
        .experience-file-content::-webkit-scrollbar {
          width: 7px;
        }
        .experience-file-content::-webkit-scrollbar-thumb {
          background: rgba(54,47,34,0.34);
          border-radius: 999px;
        }
        .experience-file-content::-webkit-scrollbar-track {
          background: transparent;
        }
        .experience-file-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          margin: 5px 36px 10px 0;
        }
        .experience-file-title-row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }
        .experience-file-folder,
        .experience-file-year {
          display: inline-flex;
          padding: 5px 8px;
          color: #362F22;
          background: rgba(255,255,255,0.56);
          border: 2px solid rgba(54,47,34,0.5);
          border-radius: 4px;
          font-family: var(--font-ui);
          font-size: clamp(9px, 0.9vw, 11px);
          font-weight: 900;
          letter-spacing: 0.08em;
          line-height: 1;
          text-transform: uppercase;
        }
        .experience-file-folder {
          background: color-mix(in srgb, var(--window-accent) 44%, #fff8ea);
        }
        .experience-file-year {
          flex: 0 0 auto;
          background: rgba(255,255,255,0.56);
          transform: rotate(1deg);
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
        .experience-file-title-row h3 {
          margin: 0;
          color: #362F22;
          font-family: var(--font-display);
          font-size: clamp(19px, 2.3vw, 30px);
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: 0;
          min-width: 0;
        }
        .experience-file-window p {
          max-width: 560px;
          color: rgba(54,47,34,0.78);
          font-family: var(--font-body);
          font-size: clamp(12px, 1.2vw, 15px);
          line-height: 1.5;
          margin: 0;
          padding-right: 32px;
        }
        .experience-photo-slide {
          flex: 1;
          min-height: 0;
          display: flex;
          align-items: center;
          padding: clamp(14px, 2vw, 22px) 38px clamp(6px, 1vw, 10px) 0;
        }
        .experience-photo-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(10px, 1.3vw, 16px);
        }
        .experience-photo-frame,
        .experience-photo-placeholder {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 3;
          border: 2px solid rgba(54,47,34,0.48);
          border-radius: 5px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.62), rgba(43,36,32,0.04)),
            color-mix(in srgb, var(--window-accent) 18%, #fff8ea);
          box-shadow: 3px 4px 0 rgba(0,0,0,0.12);
          object-fit: cover;
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
            #efe8ca;
          border: 3px solid #4b442d;
          border-radius: 4px;
          box-shadow: 8px 8px 0 rgba(0,0,0,0.32);
        }
        .contact-terminal {
          border: 3px solid #4b442d;
          border-radius: 4px;
          overflow: hidden;
          background: #1c1c1c;
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
            #333333;
          border-bottom: 3px solid #4b442d;
        }
        .contact-terminal-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #f9d1d9;
          border: 1px solid rgba(0,0,0,0.3);
          flex: 0 0 auto;
        }
        .contact-terminal-dot:nth-child(2) {
          background: #efe8ca;
        }
        .contact-terminal-dot:nth-child(3) {
          background: #9ea76b;
        }
        .contact-terminal-path {
          margin-left: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          color: #efe8ca;
          letter-spacing: 0.02em;
        }
        .contact-terminal-body {
          min-height: 310px;
          padding: 30px 34px 34px;
          background:
            repeating-linear-gradient(to bottom, rgba(230,234,237,0.035) 0 1px, transparent 1px 28px),
            radial-gradient(circle at 18% 20%, rgba(89,109,133,0.2), transparent 30%),
            linear-gradient(120deg, rgba(255,255,255,0.02), rgba(0,0,0,0.12)),
            #1c1c1c;
          color: #efe8ca;
        }
        .contact-terminal-block {
          margin-bottom: 24px;
        }
        .contact-terminal-command,
        .contact-terminal-output {
          font-family: var(--font-mono);
          font-size: clamp(14px, 1.55vw, 17px);
          line-height: 1.55;
          letter-spacing: 0;
        }
        .contact-terminal-command {
          color: #efe8ca;
          margin: 0 0 4px;
          font-weight: 700;
        }
        .contact-terminal-command::first-letter {
          color: #f9d1d9;
        }
        .contact-terminal-prompt {
          white-space: pre-wrap;
        }
        .contact-terminal-output {
          display: inline-block;
          color: #fff8e2;
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
          color: #f9d1d9;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .contact-terminal-output:focus-visible {
          outline: 2px solid #f9d1d9;
          outline-offset: 4px;
        }
        .contact-terminal-message-line {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin: 4px 0 4px;
          cursor: text;
        }
        .contact-terminal-prompt-symbol,
        .contact-terminal-input {
          font-family: var(--font-mono);
          font-size: clamp(14px, 1.55vw, 17px);
          line-height: 1.55;
          letter-spacing: 0;
        }
        .contact-terminal-prompt-symbol {
          color: #f9d1d9;
          font-weight: 700;
          flex: 0 0 auto;
        }
        .contact-terminal-input {
          min-width: 0;
          flex: 1;
          border: 0;
          border-bottom: 1px solid rgba(239,232,202,0.28);
          border-radius: 0;
          background: transparent;
          color: #fff8e2;
          caret-color: #f9d1d9;
          padding: 0 0 2px;
          outline: none;
        }
        .contact-terminal-input::placeholder {
          color: rgba(239,232,202,0.64);
        }
        .contact-terminal-input:focus {
          border-bottom-color: #f9d1d9;
          box-shadow: 0 1px 0 #f9d1d9;
        }
        .contact-terminal-cursor {
          display: inline-block;
          width: 9px;
          height: 18px;
          background: #f9d1d9;
          box-shadow: 0 0 12px rgba(249,209,217,0.38);
          animation: contact-terminal-cursor 1.1s steps(2, start) infinite;
          animation-play-state: var(--contact-animation-state, running);
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
          animation-play-state: var(--contact-animation-state, running);
          /* Cache the filtered stickers with the record while it rotates. */
          will-change: transform;
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
          font-family: var(--font-ui);
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
          background-color: #c8cf98;
          background-image:
            repeating-linear-gradient(to bottom, transparent 0 15px, rgba(255,255,255,0.34) 15px 16px),
            linear-gradient(105deg, rgba(255,255,255,0.2), rgba(43,36,32,0.04)),
            radial-gradient(circle at 18% 20%, rgba(255,255,255,0.18), transparent 30%);
          box-shadow: inset 0 0 0 2px rgba(255,255,255,0.38), inset 0 -18px 28px rgba(43,36,32,0.08);
        }
        .about-paper-ref-pink {
          background-color: #f9d1d9;
          background-image:
            radial-gradient(circle at 18% 24%, rgba(255,255,255,0.16), transparent 26%),
            radial-gradient(circle at 76% 18%, rgba(43,36,32,0.08), transparent 24%),
            linear-gradient(175deg, rgba(255,255,255,0.18), rgba(43,36,32,0.05));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2), inset 0 -18px 30px rgba(43,36,32,0.08);
        }
        .about-paper-ref-grid {
          background-color: #f3eadf;
          background-image:
            linear-gradient(rgba(158,167,107,0.28) 1px, transparent 1px),
            linear-gradient(90deg, rgba(158,167,107,0.28) 1px, transparent 1px),
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
          background-image: radial-gradient(circle, #404040 0 4px, transparent 4.6px);
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
          background-color: #f9d1d9;
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
          font-family: var(--font-hand);
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
          .experience-heading-layout {
            display: block;
          }
          .experience-heading-copy {
            padding-top: 0;
            max-width: 100%;
          }
          .experience-computer {
            width: min(1180px, 108vw);
            margin: -52px auto 0;
          }
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
            margin: -26px auto 0;
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
            width: 58px;
            height: auto;
            margin-top: 4px;
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
          .experience-file-next,
          .experience-file-back {
            width: 26px;
            height: 32px;
            border-width: 1.5px;
            font-size: 21px;
          }
          .experience-file-next {
            right: 7px;
          }
          .experience-file-back {
            left: 7px;
          }
          .experience-file-content {
            padding-right: 4px;
          }
          .experience-file-header {
            gap: 5px;
            margin: 4px 30px 7px 0;
          }
          .experience-file-title-row {
            gap: 7px;
          }
          .experience-file-folder,
          .experience-file-year {
            padding: 4px 5px;
            font-size: 9px;
            border-width: 1.5px;
          }
          .experience-file-title-row h3 {
            font-size: 16px;
          }
          .experience-file-window p {
            font-size: 10px;
            line-height: 1.36;
            padding-right: 24px;
          }
          .experience-photo-slide {
            padding: 9px 28px 3px 0;
          }
          .experience-photo-grid {
            gap: 7px;
          }
          .experience-photo-frame,
          .experience-photo-placeholder {
            border-width: 1.5px;
            border-radius: 4px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .contact-vinyl-stage,
          .contact-vinyl,
          .contact-vinyl-sticker,
          .contact-terminal-cursor,
          .experience-file-window {
            animation: none !important;
          }
          .contact-vinyl-sticker {
            opacity: 1;
          }
          .experience-screen-folder,
          .experience-file-window {
            transition: none !important;
          }
          .experience-title-letter {
            transition: none !important;
            will-change: auto;
          }
          .experience-title-letter.is-lit {
            text-shadow: none;
            transform: none;
          }
          .about-stack-angle,
          .about-paper-reveal,
          .about-paper-curl {
            transition: none !important;
          }
          .hero-sticker-layer .about-draggable-sticker img {
            transform: none !important;
          }
          .hero-sticker-layer .about-draggable-sticker:hover img,
          .hero-sticker-layer .about-draggable-sticker:focus-visible img {
            --peel: 1;
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
            <CompactNav />
            <div style={{ maxWidth: "100vw", overflowX: "hidden" }}>
                <HeroSection />
                <AboutSection />
                <FilmStripSection />
                <ExperienceSection />
                <ProjectsSection />
                <ContactSection />
                <SketchbookSection />

            </div>
        </>
    );
}
