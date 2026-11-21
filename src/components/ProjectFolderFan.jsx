import { useLayoutEffect, useRef, useState } from "react";

/*
 * Projects as a fan of CSS-drawn manila folders (design: design/projects-folder-fan.reference.html,
 * spec: PROJECTS_FOLDER_FAN.md). Stack -> fan -> lift follows the experience stack; clicking a
 * lifted folder grows it in place, one sheet ruffles up, the project page flips out, then the post-it
 * is thrown on top (~0.72s; the reference used two shuffle sheets). Values below are
 * ported from the reference's renderVals().
 */

// One path per logo at viewBox 24 (from the reference's LOGOS map).
const LOGOS = {"React": {"d": "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z", "fill": "#4FC3E0", "stroke": "none", "sw": 0}, "Node.js": {"d": "M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z", "fill": "#5FA04E", "stroke": "none", "sw": 0}, "Three.js": {"d": "M.38 0a.268.268 0 0 0-.256.332l2.894 11.716a.268.268 0 0 0 .01.04l2.89 11.708a.268.268 0 0 0 .447.128L23.802 7.15a.268.268 0 0 0-.112-.45l-5.784-1.667a.268.268 0 0 0-.123-.035L6.38 1.715a.268.268 0 0 0-.144-.04L.456.01A.268.268 0 0 0 .38 0zm.374.654L5.71 2.08 1.99 5.664zM6.61 2.34l4.864 1.4-3.65 3.515zm-.522.12l1.217 4.926-4.877-1.4zm6.28 1.538l4.878 1.404-3.662 3.53zm-.52.13l1.208 4.9-4.853-1.392zm6.3 1.534l4.947 1.424-3.715 3.574zm-.524.12l1.215 4.926-4.876-1.398zm-15.432.696l4.964 1.424-3.726 3.586zM8.047 8.15l4.877 1.4-3.66 3.527zm-.518.137l1.236 5.017-4.963-1.432zm6.274 1.535l4.965 1.425-3.73 3.586zm-.52.127l1.235 5.012-4.958-1.43zm-9.63 2.438l4.873 1.406-3.656 3.523zm5.854 1.687l4.863 1.403-3.648 3.51zm-.54.04l1.214 4.927-4.875-1.4zm-3.896 4.02l5.037 1.442-3.782 3.638z", "fill": "#1b1b1b", "stroke": "none", "sw": 0}, "MongoDB": {"d": "M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z", "fill": "#47A248", "stroke": "none", "sw": 0}, "Vite": {"d": "M13.056 23.238a.57.57 0 0 1-1.02-.355v-5.202c0-.63-.512-1.143-1.144-1.143H5.148a.57.57 0 0 1-.464-.903l3.777-5.29c.54-.753 0-1.804-.93-1.804H.57a.574.574 0 0 1-.543-.746.6.6 0 0 1 .08-.157L5.008.78a.57.57 0 0 1 .467-.24h14.589a.57.57 0 0 1 .466.903l-3.778 5.29c-.54.755 0 1.806.93 1.806h5.745c.238 0 .424.138.513.322a.56.56 0 0 1-.063.603z", "fill": "#646CFF", "stroke": "none", "sw": 0}, "Firebase": {"d": "M19.455 8.369c-.538-.748-1.778-2.285-3.681-4.569-.826-.991-1.535-1.832-1.884-2.245a146 146 0 0 0-.488-.576l-.207-.245-.113-.133-.022-.032-.01-.005L12.57 0l-.609.488c-1.555 1.246-2.828 2.851-3.681 4.64-.523 1.064-.864 2.105-1.043 3.176-.047.241-.088.489-.121.738-.209-.017-.421-.028-.632-.033-.018-.001-.035-.002-.059-.003a7.46 7.46 0 0 0-2.28.274l-.317.089-.163.286c-.765 1.342-1.198 2.869-1.252 4.416-.07 2.01.477 3.954 1.583 5.625 1.082 1.633 2.61 2.882 4.42 3.611l.236.095.071.025.003-.001a9.59 9.59 0 0 0 2.941.568q.171.006.342.006c1.273 0 2.513-.249 3.69-.742l.008.004.313-.145a9.63 9.63 0 0 0 3.927-3.335c1.01-1.49 1.577-3.234 1.641-5.042.075-2.161-.643-4.304-2.133-6.371m-7.083 6.695c.328 1.244.264 2.44-.191 3.558-1.135-1.12-1.967-2.352-2.475-3.665-.543-1.404-.87-2.74-.974-3.975.48.157.922.366 1.315.622 1.132.737 1.914 1.902 2.325 3.461zm.207 6.022c.482.368.99.712 1.513 1.028-.771.21-1.565.302-2.369.273a8 8 0 0 1-.373-.022c.458-.394.869-.823 1.228-1.279zm1.347-6.431c-.516-1.957-1.527-3.437-3.002-4.398-.647-.421-1.385-.741-2.194-.95.011-.134.026-.268.043-.4.014-.113.03-.216.046-.313.133-.689.332-1.37.589-2.025.099-.25.206-.499.321-.74l.004-.008c.177-.358.376-.719.61-1.105l.092-.152-.003-.001c.544-.851 1.197-1.627 1.942-2.311l.288.341c.672.796 1.304 1.548 1.878 2.237 1.291 1.549 2.966 3.583 3.612 4.48 1.277 1.771 1.893 3.579 1.83 5.375-.049 1.395-.461 2.755-1.195 3.933-.694 1.116-1.661 2.05-2.8 2.708-.636-.318-1.559-.839-2.539-1.599.79-1.575.952-3.28.479-5.072zm-2.575 5.397c-.725.939-1.587 1.55-2.09 1.856-.081-.029-.163-.06-.243-.093l-.065-.026c-1.49-.616-2.747-1.656-3.635-3.01-.907-1.384-1.356-2.993-1.298-4.653.041-1.19.338-2.327.882-3.379.316-.07.638-.114.96-.131l.084-.002c.162-.003.324-.003.478 0 .227.011.454.035.677.07.073 1.513.445 3.145 1.105 4.852.637 1.644 1.694 3.162 3.144 4.515z", "fill": "#F5820D", "stroke": "none", "sw": 0}, "Supabase": {"d": "M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z", "fill": "#3ECF8E", "stroke": "none", "sw": 0}, "SQL": {"d": "M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0 M4 6v6a8 3 0 0 0 16 0v-6 M4 12v6a8 3 0 0 0 16 0v-6", "fill": "none", "stroke": "#3e6897", "sw": 2.2}, "Power BI": {"d": "M16 2.5h4a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1 -1.5 1.5h-4a1.5 1.5 0 0 1 -1.5 -1.5v-16a1.5 1.5 0 0 1 1.5 -1.5z M10 7.5h4a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1 -1.5 1.5h-4a1.5 1.5 0 0 1 -1.5 -1.5v-11a1.5 1.5 0 0 1 1.5 -1.5z M4 12.5h4a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1 -1.5 1.5h-4a1.5 1.5 0 0 1 -1.5 -1.5v-6a1.5 1.5 0 0 1 1.5 -1.5z", "fill": "#E8B10E", "stroke": "rgba(0,0,0,.18)", "sw": 0.6}};
// Tech without a logo yet render as rounded text stickers.
const WORDS = {"Microsoft Fabric": {"word": "Fabric", "bg": "#117865"}, "OneLake": {"word": "OneLake", "bg": "#0F6CBD"}, "GroqCloud": {"word": "groq", "bg": "#F55036"}};
const STICKER_ROT = [-4, 3, -2, 5, -3];
const CLIP_PATH = "M7 20 V48 a5 5 0 0 0 10 0 V9 a7 7 0 0 0 -14 0 V50 a3.5 3.5 0 0 0 7 0 V20";

const DESKTOP = { W: 512, OW: 846, spread: 205, lift: 34, fanTilt: 8.5 };

// Tab outline: slight slant (3% of the tab width), top corners at 2.6% of the folder width.
const tabPath = (tw, th, fw) => {
    const sl = tw * 0.03;
    const r = fw * 0.026;
    const f = (n) => n.toFixed(1);
    return "path('M0 " + f(th) + " L" + f(sl) + " " + f(r) + " Q" + f(sl) + " 0 " + f(sl + r) + " 0 L" + f(tw - sl - r) + " 0 Q" + f(tw - sl) + " 0 " + f(tw - sl) + " " + f(r) + " L" + f(tw) + " " + f(th) + " Z')";
};

function PaperClip({ width, height, style }) {
    return (
        <svg className="pff-paperclip" width={width} height={height} viewBox="0 0 22 60" aria-hidden="true" style={style}>
            <path d={CLIP_PATH} transform="translate(1 1.2)" style={{ stroke: "rgba(54,47,34,.22)", strokeWidth: 2.4 }} />
            <path d={CLIP_PATH} style={{ stroke: "#9ea4aa", strokeWidth: 2.2 }} />
            <path d={CLIP_PATH} style={{ stroke: "#eef1f3", strokeWidth: 0.7, opacity: 0.9 }} />
        </svg>
    );
}

function CaptionArrow() {
    return (
        <svg className="caption-arrow" width="40" height="26" viewBox="0 0 48 32" aria-hidden="true">
            <path d="M3 24 C 14 26, 26 22, 36 10" />
            <path d="M28 9 L 37 9 L 38 18" />
        </svg>
    );
}

function LogoSticker({ label, rot }) {
    const logo = LOGOS[label];
    const word = WORDS[label] || { word: label, bg: "#6b5d4a" };
    return (
        <span className="logo-sticker" role="img" aria-label={label} style={{ transform: `rotate(${rot}deg)` }}>
            <span className="logo-tip" aria-hidden="true">{label}</span>
            {logo ? (
                <svg className="logo-art pff-logo-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={logo.d} style={{ fill: logo.fill, stroke: logo.stroke, strokeWidth: logo.sw }} />
                </svg>
            ) : (
                <span className="logo-art pff-logo-word" style={{ backgroundColor: word.bg }}>{word.word}</span>
            )}
        </span>
    );
}

function PostIt({ project, title }) {
    const style = { backgroundColor: project.noteColor, "--note-rot": `${project.noteRot}deg` };
    const image = <img className="pff-postit-img" src={project.image} alt={`${title} preview`} style={{ objectFit: project.noteImageFit ?? "cover" }} />;
    if (project.projectUrl) {
        return (
            <a className="note-link postit pff-postit" href={project.projectUrl} target="_blank" rel="noreferrer" aria-label={`Open ${title} live (opens in new tab)`} style={style}>
                <span className="pff-tape" aria-hidden="true" style={{ transform: "rotate(-3deg)" }} />
                {image}
                <span className="pff-postit-caption">
                    <span className="note-caption-text">{project.noteCaption}</span>
                    <CaptionArrow />
                </span>
            </a>
        );
    }
    return (
        <figure className="postit pff-postit" style={style}>
            <span className="pff-tape" aria-hidden="true" style={{ transform: "rotate(3deg)" }} />
            {image}
            <figcaption className="pff-postit-caption">{project.noteCaption}</figcaption>
        </figure>
    );
}

export default function ProjectFolderFan({ projects }) {
    const [mode, setMode] = useState("stack"); // "stack" | "fan" | "open"
    const [hovered, setHovered] = useState(0);
    const [openIdx, setOpenIdx] = useState(0);
    const [size, setSize] = useState({ cw: 1180, vw: 1280 });
    const stageRef = useRef(null);
    const pointer = useRef({ touch: false, lifted: false });
    const skipFocus = useRef(false);

    // Container and viewport widths drive the folder sizes on tablet and phone.
    useLayoutEffect(() => {
        const stage = stageRef.current;
        if (!stage) return undefined;
        const observer = new ResizeObserver(() => setSize({ cw: stage.clientWidth, vw: window.innerWidth }));
        observer.observe(stage);
        return () => observer.disconnect();
    }, []);

    const n = projects.length;
    const mid = (n - 1) / 2;
    const mobile = size.vw <= 700;
    const W = mobile ? Math.round(Math.min(DESKTOP.W, size.vw * 0.82)) : DESKTOP.W;
    const OW = mobile ? Math.round(size.vw * 0.94) : Math.min(DESKTOP.OW, size.cw);
    // Folders match the experience cards (512px, 82vw on phones), so the fan is tighter (205px vs 250px) to stay on
    // screen; it narrows further on smaller screens and is ~0.15 on phones.
    const spread = mobile ? DESKTOP.spread * 0.15 : Math.min(DESKTOP.spread, Math.max(100, (size.vw - W) / 3 - 72));
    // Phones: the opened folder is taller so the one-column page fits.
    const openH = mobile ? Math.round(OW * 1.95) : Math.round(OW * 0.72);
    // Desktop: the stack sits just under the heading (TOP leaves room for the lift and the
    // fan's tilted corners); the opened folder rises to near the top of the stage. The stage
    // height stays fixed so the bottom-anchored folders never jump.
    const TOP = 50;
    const OPEN_TOP = 16;
    const anchor = TOP + Math.round(W * 0.72);
    const deskStageH = Math.max(OPEN_TOP + openH + 40, anchor + 140);
    const bottom = mobile ? 40 : deskStageH - anchor;
    const openY = mobile ? 14 : OPEN_TOP + openH - anchor;
    const stageH = mobile
        ? (mode === "open" ? openH + bottom - openY + 24 : bottom + Math.round(W * 0.72) + 56)
        : deskStageH;

    const enter = (i) => {
        if (mode === "open") return;
        if (mode !== "fan" || hovered !== i) {
            setMode("fan");
            setHovered(i);
        }
    };
    const focusFolder = (i) => stageRef.current?.querySelector(`button[data-folder="${i}"]`)?.focus();
    const click = (i, fromKeyboard = false) => {
        if (mode === "open") return;
        // Touch: the first tap fans the stack and lifts this folder, the second opens it.
        if (pointer.current.touch && !pointer.current.lifted) {
            pointer.current = { touch: false, lifted: false };
            setMode("fan");
            setHovered(i);
            return;
        }
        // Enter/Space on a focused folder always opens it, even if the mouse is resting on another one.
        if (!fromKeyboard && (mode !== "fan" || hovered !== i)) {
            setMode("fan");
            setHovered(i);
        } else {
            setMode("open");
            setOpenIdx(i);
            requestAnimationFrame(() => stageRef.current?.querySelector(".close-btn")?.focus({ preventScroll: true }));
        }
    };
    const close = () => {
        const wasOpen = mode === "open";
        setMode("stack");
        setHovered(0);
        if (wasOpen) {
            // Focus goes back to the folder without fanning the stack out again.
            skipFocus.current = true;
            requestAnimationFrame(() => focusFolder(openIdx));
        }
    };
    const keydown = (event, i) => {
        if (event.key === "Escape") {
            event.preventDefault();
            close();
            return;
        }
        if (mode === "open") return;
        let next = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % n;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i - 1 + n) % n;
        if (next === null) return;
        event.preventDefault();
        setMode("fan");
        setHovered(next);
        focusFolder(next);
    };
    const stageLeave = () => {
        if (mode === "fan") {
            setMode("stack");
            setHovered(0);
        }
    };
    const stageBlur = (event) => {
        if (mode === "fan" && !event.currentTarget.contains(event.relatedTarget)) {
            setMode("stack");
            setHovered(0);
        }
    };

    return (
        <>
            <div
                ref={stageRef}
                className="pff-stage"
                role="list"
                aria-label="Project folders"
                style={{ height: stageH }}
                onMouseLeave={stageLeave}
                onBlur={stageBlur}
            >
                {projects.map((p, i) => {
                    const isOpen = mode === "open" && openIdx === i;
                    const w = isOpen ? OW : W;
                    let x;
                    let y;
                    let r;
                    let scale = 1;
                    let op = 1;
                    let z;
                    if (mode === "open") {
                        if (isOpen) { x = 0; y = openY; r = 0; z = 90; }
                        else { const st = i - openIdx; x = st * 14; y = -20 + Math.abs(st) * 6; r = st * 3; scale = 0.92; op = 0.4; z = 40 - Math.abs(st); }
                    } else if (mode === "fan") {
                        const o = i - mid;
                        x = o * spread;
                        y = Math.abs(o) * 30 + Math.max(0, Math.abs(o) - 1) * 10 - (i === hovered ? DESKTOP.lift : 0);
                        r = o * DESKTOP.fanTilt;
                        z = i === hovered ? 80 : 50 - Math.abs(i - hovered);
                    } else {
                        x = i * 10; y = Math.abs(i) * 5; r = i * 2.8;
                        z = 50 - Math.abs(i);
                    }
                    const lifted = mode === "fan" && hovered === i;
                    const tabH = Math.round(w * 0.075);
                    const h = isOpen ? openH : Math.round(w * 0.72);
                    const frontTop = tabH + Math.round(w * 0.05);
                    const paperTop = tabH + Math.round(w * 0.02);
                    const tabW = (w * p.tabW) / 100;
                    // Reference auto-fit, then ~20% smaller.
                    const labelFont = Math.max(7, Math.round(0.8 * Math.min(17, w * 0.031, (tabW * 0.84 - 12) / (p.tab.length * 0.68))));
                    const hasClip = !isOpen && (i === 0 || i === 2);
                    const tags = p.tags ?? [];
                    return (
                        <article
                            key={p.title}
                            role="listitem"
                            className="folder-card"
                            onMouseEnter={() => enter(i)}
                            onKeyDown={(event) => keydown(event, i)}
                            style={{
                                width: w,
                                zIndex: z,
                                opacity: op,
                                transform: `translateX(-50%) translate(${x}px, ${y}px) rotate(${r}deg) scale(${scale})`,
                                bottom,
                            }}
                        >
                            <button
                                type="button"
                                className="folder-btn"
                                data-folder={i}
                                aria-label={isOpen ? `${p.title} folder, open` : `Open ${p.title} folder`}
                                aria-expanded={isOpen}
                                style={{ cursor: isOpen ? "default" : "pointer" }}
                                onPointerDown={(event) => {
                                    pointer.current = { touch: event.pointerType !== "mouse", lifted: mode === "fan" && hovered === i };
                                }}
                                onClick={(event) => click(i, event.detail === 0)}
                                onFocus={() => {
                                    if (skipFocus.current) { skipFocus.current = false; return; }
                                    enter(i);
                                }}
                            >
                                <span
                                    className="pff-art"
                                    aria-hidden="true"
                                    style={{
                                        height: h,
                                        filter: lifted
                                            ? "drop-shadow(0 2px 2px rgba(0,0,0,.14)) drop-shadow(0 22px 26px rgba(54,47,34,.24)) brightness(1.02)"
                                            : "drop-shadow(0 1px 1px rgba(0,0,0,.16)) drop-shadow(0 12px 16px rgba(54,47,34,.18))",
                                    }}
                                >
                                    <span className="cardstock pff-back" style={{ top: tabH, backgroundColor: p.back }} />
                                    <span
                                        className="cardstock folder-tab"
                                        style={{ clipPath: tabPath(tabW, tabH + 6, w), left: `${p.tabL}%`, width: `${p.tabW}%`, height: tabH + 6, backgroundColor: p.back }}
                                    >
                                        <span className="pff-tab-label" style={{ height: Math.round(tabH * 0.66), fontSize: labelFont }}>{p.tab}</span>
                                    </span>
                                    <span className="pff-sheet-lined" style={{ top: tabH + Math.round(w * 0.016) }} />
                                    <span className="pff-sheet-plain" style={{ top: tabH + Math.round(w * 0.03) }} />
                                    {hasClip && (
                                        <PaperClip
                                            width={Math.round(w * 0.045)}
                                            height={Math.round(w * 0.12)}
                                            style={{ left: `${i === 0 ? 70 : 16}%`, top: tabH - Math.round(w * 0.01), transform: "rotate(-8deg)", zIndex: 1 }}
                                        />
                                    )}
                                    <span className="cardstock front-panel pff-front" style={{ top: frontTop, backgroundColor: p.front }} />
                                </span>
                                <span className="pff-face" style={{ top: frontTop + 22, opacity: isOpen ? 0 : 1 }}>
                                    <span className="pff-face-row">
                                        <span className="pff-face-title">{p.title}</span>
                                        <span className="pff-face-year">{p.year}</span>
                                    </span>
                                    {lifted && (
                                        <span className="peek-in pff-face-peek">
                                            <span className="pff-face-badge">{p.badge}</span>
                                        </span>
                                    )}
                                </span>
                            </button>
                            {isOpen && (
                                <>
                                    {/* One shuffle sheet ruffles up ahead of the page (the reference had two). */}
                                    <div className="pff-flip-box" aria-hidden="true" style={{ top: paperTop }}>
                                        <span className="flip-sheet" style={{ "--r": "-2.6deg", "--x": "-10px", "--d": "0ms", backgroundColor: "#f8f4e8" }} />
                                    </div>
                                    <div className="paper-in pff-paper" role="dialog" aria-label={p.title} style={{ top: paperTop }}>
                                        <div className="pff-paper-sheet" style={{ transform: `rotate(${p.tilt}deg)`, borderTopColor: p.accent }} />
                                        <PaperClip width={26} height={70} style={{ left: 34, top: -30, transform: "rotate(-6deg)", zIndex: 2 }} />
                                        <div className="pff-paper-grid">
                                            <div className="pff-paper-copy">
                                                <span className="pff-paper-badge">{p.badge}</span>
                                                <div className="pff-paper-heading">
                                                    <h3 className="pff-paper-title">{p.title}</h3>
                                                    <span className="pff-paper-year">{p.year}</span>
                                                </div>
                                                <p className="desc-scroll pff-paper-desc">{p.desc.trim()}</p>
                                                {tags.length > 0 && (
                                                    <div className="pff-logos" aria-label="Software skills">
                                                        {tags.map((t, k) => <LogoSticker key={t} label={t} rot={STICKER_ROT[(k + i) % 5]} />)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="pff-paper-note">
                                                <PostIt project={p} title={p.title} />
                                            </div>
                                        </div>
                                        <button type="button" className="close-btn" aria-label={`Close ${p.title} folder`} onClick={close}>
                                            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2 L12 12" /><path d="M12 2 L2 12" /></svg>
                                            close
                                        </button>
                                    </div>
                                </>
                            )}
                        </article>
                    );
                })}
            </div>
        </>
    );
}
