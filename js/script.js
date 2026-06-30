
/* ─────────────────── LENIS SMOOTH SCROLL ─────────────────── */
const lenis = new Lenis({
    duration: 1.4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

/* ─────────────────── LOADER ─────────────────── */
(function () {
    const loader = document.getElementById('loader'), bar = document.getElementById('loaderBar'), num = document.getElementById('loaderNum');
    // const loader = document.getElementById('loader');
    // if (!loader) return;
    // if (sessionStorage.getItem('loaderShown')) {
    //     loader.style.display = 'none';
    //     return;
    // }
    // sessionStorage.setItem('loaderShown', 'true');
    // const bar = document.getElementById('loaderBar'), num = document.getElementById('loaderNum');


    let p = 0;
    const iv = setInterval(() => {
        p += Math.random() * 10 + 4; if (p >= 100) { p = 100; clearInterval(iv); }
        bar.style.width = p + '%'; num.textContent = Math.round(p) + '%';
        if (p >= 100) setTimeout(() => loader.classList.add('done'), 400);
    }, 80);
    setTimeout(() => { bar.style.width = '100%'; num.textContent = '100%'; clearInterval(iv); setTimeout(() => loader.classList.add('done'), 400); }, 2600);
})();

/* ─────────────────── CURSOR ─────────────────── */
(function () {
    if (!window.matchMedia('(hover:hover)').matches) return;
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    const dot = cursor.querySelector('.c-dot'), ring = cursor.querySelector('.c-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
    (function anim() { rx += (mx - rx) * .12; ry += (my - ry) * .12; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(anim); })();
    document.querySelectorAll('a,button,.project-item,.play-item,.h-card,.skill-item,.csp-step,.ti').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
})();

/* ─────────────────── NAVBAR ─────────────────── */
window.addEventListener('scroll', () =>
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60)
);

/* ─────────────────── SMOOTH SCROLL + ACTIVE NAV ─────────────────── */
(function () {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    /* 1. Smooth scroll on click (delegates to Lenis) */
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.getElementById(link.dataset.section);
            if (!target) return;
            lenis.scrollTo(target, { duration: 1.4, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        });
    });

    /* 2. Active link highlighting via IntersectionObserver */
    // const sections = Array.from(navLinks)
    //     .map(l => document.getElementById(l.dataset.section))
    //     .filter(Boolean);

    // const setActive = id => {
    //     navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
    // };

    // const obs = new IntersectionObserver(entries => {
    //     entries.forEach(entry => {
    //         if (entry.isIntersecting) setActive(entry.target.id);
    //     });
    // }, { threshold: 0.25, rootMargin: '-60px 0px -40% 0px' });

    // sections.forEach(s => obs.observe(s));
})();

/* ─────────────────── MOBILE MENU ─────────────────── */
const burger = document.getElementById('navBurger'), mMenu = document.getElementById('mobileMenu');
function closeMobileMenu() { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); mMenu.classList.remove('open'); lenis.start(); }
burger.addEventListener('click', () => {
    const isOpen = mMenu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    isOpen ? lenis.stop() : lenis.start();
});

/* ─────────────────── SCROLL REVEALS ─────────────────── */
(function () {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: .1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ─────────────────── SKILL BARS ─────────────────── */
(function () {
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.querySelectorAll('.skill-fill').forEach(f => f.style.width = f.dataset.width + '%');
    }), { threshold: .3 });
    const g = document.querySelector('.skills-grid'); if (g) obs.observe(g);
})();

/* ─────────────────── STAT COUNTERS ─────────────────── */
(function () {
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.st-val').forEach(el => {
                const target = parseInt(el.dataset.target || 0); let start = null;
                (function step(ts) { if (!start) start = ts; const p = Math.min((ts - start) / 1400, 1); el.textContent = Math.round(target * p); if (p < 1) requestAnimationFrame(step); else el.textContent = target + '+'; })(performance.now());
            });
            obs.unobserve(e.target);
        }
    }), { threshold: .6 });
    const hs = document.querySelector('.hero-stats'); if (hs) obs.observe(hs);
})();

/* ─────────────────── PARALLAX HERO ─────────────────── */
lenis.on('scroll', ({ scroll }) => {
    const ht = document.querySelector('.hero-name-main');
    if (ht) ht.style.transform = `translateY(${scroll * .22}px)`;
});

/* ─────────────────── HERO MOUSE PARALLAX + CURSOR GLOW ─────────────────── */
(function () {
    const hero = document.getElementById('hero');
    const glow = document.getElementById('heroCursorGlow');
    if (!hero) return;
    let animReq;
    hero.addEventListener('mousemove', e => {
        cancelAnimationFrame(animReq);
        animReq = requestAnimationFrame(() => {
            const r = hero.getBoundingClientRect();
            const cx = e.clientX - r.left, cy = e.clientY - r.top;
            /* move glow */
            if (glow) { glow.style.left = cx + 'px'; glow.style.top = cy + 'px'; }
            /* parallax each tool icon */
            const nx = (cx / r.width - .5) * 2, ny = (cy / r.height - .5) * 2;
            document.querySelectorAll('.ti').forEach(ti => {
                const d = parseFloat(ti.dataset.depth || .05);
                const ox = nx * d * 60, oy = ny * d * 60;
                ti.style.setProperty('--px', ox.toFixed(2));
                ti.style.setProperty('--py', oy.toFixed(2));
            });
        });
    });
    hero.addEventListener('mouseleave', () => {
        document.querySelectorAll('.ti').forEach(ti => {
            ti.style.setProperty('--px', 0);
            ti.style.setProperty('--py', 0);
        });
        if (glow) { glow.style.left = '-9999px'; glow.style.top = '-9999px'; }
    });
})();

/* ─────────────────── PROJECT 3D TILT ─────────────────── */
document.querySelectorAll('.project-item').forEach(item => {
    if (!window.matchMedia('(hover:hover)').matches) return;
    item.addEventListener('mousemove', e => {
        const r = item.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        item.querySelector('.project-inner').style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 2}deg)`;
    });
    item.addEventListener('mouseleave', () => item.querySelector('.project-inner').style.transform = '');
});

/* ─────────────────── MAGNETIC BUTTONS ─────────────────── */
document.querySelectorAll('.btn-p,.btn-s,.csp-btn-p').forEach(btn => {
    if (!window.matchMedia('(hover:hover)').matches) return;
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .22}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

/* ─────────────────── PLAYGROUND KEYBOARD ─────────────────── */
document.querySelectorAll('.play-item').forEach(item => {
    item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const id = item.dataset.cs; if (id) openCSPage(id); }
    });
});

/* ══════════════════════════════════════════════════════════════
   CASE STUDY PAGE TRANSITION SYSTEM
   ══════════════════════════════════════════════════════════════ */
const csPage = document.getElementById('cs-page');
const csCurtain = document.getElementById('cs-curtain');
const csBack = document.getElementById('cs-back');

/* ─── DATA ─── */
const CS_DATA = {
    'cs-empezar': { title: 'Empezar Digital Corporate Website', category: 'Corporate Web Design', client: 'Empezar Digital', img: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=85', role: 'Lead UI/UX Designer & Developer', tools: 'Figma, HTML5, CSS3, Bootstrap, JavaScript, Photoshop', duration: '8 Weeks', year: '2023', link: 'https://empezar.in', challenge: 'Empezar Digital needed a website that clearly communicated their premium digital services while being technically performant and conversion-focused. Their existing presence was outdated, lacked visual hierarchy, and failed to convert visitors into leads. The challenge was to build a site that felt both trustworthy and bold — one that could compete with top-tier agencies globally.', solution: 'I led the full design and development lifecycle — from stakeholder discovery and competitor analysis through to a pixel-perfect, responsive build. The final site uses a strong typographic system, clear service cards, animated scroll reveals, and a conversion-optimised contact flow. Every section was designed to reduce friction and build brand trust at each touchpoint.', steps: [['01', 'Discovery', 'Deep-dive stakeholder interviews, brand questionnaire, and a full competitive audit of 12 agency websites to establish positioning.'], ['02', 'IA & Wireframes', 'Defined a clear information architecture with 6 core pages. Created lo-fi wireframes iterated with stakeholders across 2 rounds.'], ['03', 'Visual Design', 'High-fidelity Figma designs — dark aesthetic, teal accent, strong typographic hierarchy, and polished component library covering 40+ UI states.'], ['04', 'Development', 'Responsive HTML5/CSS3/Bootstrap build with JS micro-interactions, smooth scroll, animated section reveals. Achieved 98 PageSpeed score.']], outcomes: [['25%', 'Increase in avg. session duration'], ['40%', 'Improvement in lead form submissions'], ['98', 'Google PageSpeed score']], highlights: ['Designed and developed fully responsive 6-page corporate website', 'Created scalable Figma component library with 40+ components', 'Smooth scroll animations and CSS micro-interactions', 'WCAG AA accessibility compliance across all pages', 'Integrated contact form with email automation backend'] },

    'cs-aria': { title: 'Aria Org Non-Profit Website', category: 'Non-Profit Web Design', client: 'Aria Organisation', img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=85', role: 'UI/UX Designer & Frontend Developer', tools: 'Figma, WordPress, HTML5, CSS3, JavaScript, Photoshop', duration: '6 Weeks', year: '2022', link: 'https://ariaorg.in', challenge: 'Aria Org needed a digital presence that conveyed their humanitarian mission with emotional clarity. The previous website was visually inconsistent, not mobile-friendly, and had a donation flow with a 72% drop-off rate. The organisation needed to manage content independently without technical support for every update.', solution: 'I designed an empathy-led visual language using warm photography, clear mission storytelling, and a streamlined donation flow. Built on WordPress with a custom theme, the site empowers the Aria team to update content independently. Accessibility was a first-class concern — every design decision was validated against WCAG 2.1 AA criteria.', steps: [['01', 'Research', 'User interviews with 8 donors and 4 volunteers. Accessibility audit of 6 comparable non-profit sites.'], ['02', 'Content Strategy', 'Mapped content to emotional donor journey: Awareness → Connection → Trust → Action. Restructured site from 12 to 5 focused pages.'], ['03', 'Visual Design', 'Warm, trustworthy visual language with strong imagery, generous white space, clear CTAs, and colour system meeting WCAG AA ratios.'], ['04', 'WordPress Build', 'Custom WordPress theme with Gutenberg blocks allowing non-technical team to update all content. Tested across 8 device/browser combinations.']], outcomes: [['35%', 'Reduction in donation flow drop-off'], ['50%', 'Growth in volunteer sign-ups in 60 days'], ['WCAG AA', 'Full accessibility compliance']], highlights: ['Accessible, inclusive UI with WCAG 2.1 AA compliance', 'Custom WordPress theme with intuitive block-based editing', 'Donation flow drop-off reduced from 72% to 37%', 'Responsive design from 320px to 1920px', 'Page load improved from 6.2s to 1.8s'] },

    'cs-onegate': { title: 'OneGate — Visitor & Gatekeeper App', category: 'Mobile App Design', client: 'Empezar Digital (Product)', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=85', role: 'Lead UI/UX Designer', tools: 'Figma, Flutter, Dart, Firebase, Photoshop', duration: '12 Weeks', year: '2022', link: 'https://play.google.com', challenge: 'Security gatekeepers at large gated complexes were managing visitor check-ins with paper registers — slow, error-prone, causing bottlenecks at peak hours and security blind spots. The solution needed to serve two very different personas: tech-savvy residents and gatekeepers with limited smartphone experience.', solution: 'I led complete UX design for both resident and gatekeeper flows. The gatekeeper interface was designed for extreme simplicity — large tap targets, minimal cognitive load, and offline capability. The resident app offered pre-registration, QR code generation, and real-time visitor notifications. Firebase powered real-time sync between both.', steps: [['01', 'Field Research', 'Observed check-in at 3 complexes over 2 days. Interviewed 6 gatekeepers and 12 residents to map pain points and mental models.'], ['02', 'Dual Journey Mapping', 'Mapped the complete visitor lifecycle for both personas. Identified 11 friction points to address.'], ['03', 'Prototype & Test', 'Interactive Flutter prototypes. 2 rounds of usability testing with actual gatekeepers — iterated on tap targets, language, error states.'], ['04', 'Launch', 'Published on Google Play. Firebase Firestore for real-time data, Firebase Auth for secure multi-tenant access, push notifications.']], outcomes: [['40%', 'Reduction in check-in time'], ['4.6★', 'Google Play Store rating'], ['60%', 'Reduction in security incidents']], highlights: ['Dual-persona UX for gatekeepers and residents', 'QR-code pre-registration eliminating manual log entry', 'Real-time push notifications for visitor arrivals', 'Offline-capable design for low-connectivity environments', 'Complete visitor history and analytics for management'] },

    'cs-adani-transport': { title: 'Adani Integrated Transport Platform', category: 'Enterprise UX Design', client: 'Adani Group (Confidential)', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=85', role: 'Sr. UI/UX Designer & Developer', tools: 'Figma, Angular, HTML5, CSS3, Bootstrap, Adobe CC', duration: '20 Weeks', year: '2021', link: '#', challenge: 'Adani\'s logistics operations were managed across 6 disconnected legacy systems creating data silos, poor real-time visibility, and error-prone manual processes. The platform needed to serve 4 distinct user roles — Dispatcher, Manager, Driver and Admin — within a single unified system at enterprise scale.', solution: 'I led complete UX architecture — defining role-based information hierarchies, designing 40+ screens covering core logistics workflows, and building a comprehensive Angular component library. Validated through 3 rounds of usability testing with actual operations staff before handoff to engineering.', steps: [['01', 'Discovery & Audit', '3-day stakeholder workshop. Full heuristic evaluation of 6 legacy systems. Process mapping identifying 22 major workflow inefficiencies.'], ['02', 'Role-Based IA', 'Designed 4 distinct information architectures for Dispatcher, Manager, Driver and Admin personas. Each role sees only what they need.'], ['03', 'Design System', '80+ component library: Figma and Angular. Full design token system. All interactive states including error, empty and loading covered.'], ['04', 'Testing & Handoff', '3 moderated usability sessions with real operations staff. 2 design iteration cycles before final spec delivery at 98% fidelity.']], outcomes: [['30%', 'Improvement in operational efficiency'], ['25%', 'Reduction in user errors'], ['80+', 'Component design system delivered']], highlights: ['Role-based dashboards for 4 distinct user personas', 'Angular component library reducing dev time by 30%', '3 rounds of moderated usability testing with operations staff', '98% designer-developer spec fidelity on delivery', 'Complex data-dense tables with sort, filter, and bulk actions'] },

    'cs-adani-logistics': { title: 'Adani Logistics Management System', category: 'Enterprise Design System', client: 'Adani Group (Confidential)', img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=85', role: 'Lead UI/UX Designer', tools: 'Figma, Blazor, .NET, JavaScript, Adobe Creative Suite', duration: '24 Weeks', year: '2020', link: '#', challenge: 'The system served hundreds of internal users managing shipment tracking, inventory, and reporting. Inconsistent UI patterns across modules, poor data density design, and no shared component language were causing design and engineering teams to duplicate work and users to struggle with a fragmented experience.', solution: 'Started with a thorough UX audit identifying 60+ inconsistency patterns. Built a token-based design system in Figma and Blazor — 80+ production-ready components, full documentation, and a governance process. Core workflows redesigned with focus on data density, scanability, and error prevention.', steps: [['01', 'UX Audit', 'Comprehensive audit across all modules. Catalogued 60+ inconsistency patterns. User interviews with 15 power users.'], ['02', 'Design System', 'Token-based Figma design system: colour/spacing/typography tokens, 80+ components with all states, usage guidelines, contribution process.'], ['03', 'Core Redesign', 'Redesigned 4 core workflows: Shipment Tracking, Inventory Management, Dispatch Planning, Management Reporting. Each validated before dev handoff.'], ['04', 'Blazor Implementation', 'Worked alongside .NET team implementing components as production Blazor library. Bi-weekly design reviews ensuring spec fidelity.']], outcomes: [['25%', 'Improvement in task completion rate'], ['30%', 'Reduction in development time'], ['80+', 'Blazor components delivered']], highlights: ['80+ production-ready Blazor UI components with full documentation', 'Full design token system for colour, spacing, and typography', '4 core enterprise workflows redesigned from user research', 'Reduced designer-developer handoff friction by 40%', 'Introduced design review cadence improving ongoing quality'] },

    'cs-greenscape': { title: 'Greenscape Group Real Estate Website', category: 'Real Estate Web Design', client: 'Greenscape Group', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=85', role: 'UI/UX Designer & Developer', tools: 'Figma, Photoshop, HTML5, CSS3, JavaScript, jQuery', duration: '10 Weeks', year: '2021', link: 'https://greenscapegroup.in', challenge: 'Greenscape needed a website projecting a premium brand while making it easy for buyers to explore properties and enquire. Their previous site had small imagery, confusing listing structure, and an enquiry form with no UX consideration — resulting in poor engagement and low-quality leads.', solution: 'Led design and development of a visually immersive website with full-screen property photography, a structured showcase with filter, and a multi-step enquiry form qualifying leads before submission. The visual language was elevated to match the premium pricing of Greenscape\'s developments.', steps: [['01', 'Brand & Competitor Audit', 'Reviewed brand materials and analysed 8 competing premium real estate websites. Defined visual positioning between premium and accessible.'], ['02', 'Conversion UX', 'Mapped buyer journey from landing to enquiry. Designed 4 distinct conversion entry points across the site, contextually matched to buyer intent.'], ['03', 'Visual Design', 'Full-screen hero imagery, large property cards, generous white space, premium type pairing, and teal accent echoing brand colours.'], ['04', 'Development', 'HTML5/CSS3/jQuery with parallax scrolling, animated property reveals, interactive map integration, and multi-step enquiry form with validation.']], outcomes: [['45%', 'Increase in online property enquiries'], ['3.2 min', 'Average session duration'], ['100%', 'Mobile responsive across all breakpoints']], highlights: ['Immersive full-screen property showcase experience', 'Interactive property filter by type, location, and budget', 'Smooth parallax and scroll-reveal animations', 'Multi-step enquiry form improving lead quality', 'Google Maps integration with custom property pins'] },

    'cs-hyperion': { title: 'HyperionBCC Agency Website', category: 'Agency Web Design', client: 'HyperionBCC', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85', role: 'UI/UX Designer & Developer', tools: 'Figma, HTML5, CSS3, JavaScript, Bootstrap, Photoshop', duration: '7 Weeks', year: '2022', link: 'https://hyperionbcc.com', challenge: 'HyperionBCC\'s existing site had 3-level dropdown navigation, a broken mobile layout below 768px, and a visual language that didn\'t reflect their strategic consulting expertise. Visitors couldn\'t quickly understand what HyperionBCC did — causing a 78% bounce rate.', solution: 'Restructured navigation from 3 levels to a single clear top-level menu with mega-menu for services. Rebuilt the mobile experience from scratch with a mobile-first approach. Elevated visual language with stronger typography, more white space, and a cleaner colour system communicating authority and expertise.', steps: [['01', 'Heuristic Evaluation', 'Systematic audit against 10 Nielsen heuristics. Documented 34 specific issues across navigation, mobile responsiveness and visual hierarchy.'], ['02', 'Navigation Redesign', 'Simplified from 3-level dropdown to clear top-level + mega-menu. Card-sorted services with 6 users to validate new groupings.'], ['03', 'Mobile-First Rebuild', 'Designed mobile experience first, expanded to tablet and desktop. Full-screen hamburger overlay navigation for touch devices.'], ['04', 'Visual Elevation', 'Stronger typographic hierarchy, increased white space, authoritative colour palette, custom service iconography to communicate expertise.']], outcomes: [['55%', 'Reduction in bounce rate'], ['40%', 'Improvement in mobile session duration'], ['95+', 'Google PageSpeed score']], highlights: ['Navigation restructured from 3 levels to single clear structure', 'Complete mobile-first responsive layout rebuild', 'Custom mega-menu for service discovery', '95+ PageSpeed score across mobile and desktop', 'Clear service categorisation improving user comprehension'] },

    'cs-phillip': { title: 'PhillipCapital Trading Mobile App', category: 'FinTech Mobile App Design', client: 'PhillipCapital', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=85', role: 'Lead UI/UX Designer & Flutter Developer', tools: 'Figma, Flutter, Dart, Firebase, Photoshop', duration: '16 Weeks', year: '2020', link: 'https://phillipscapital.com', challenge: 'PhillipCapital\'s trading app had a complex 12-step onboarding flow causing 68% drop-off before first trade. The portfolio dashboard presented raw financial data without hierarchy or visual clarity — overwhelming new investors and frustrating experienced traders who needed faster data access.', solution: 'Redesigned onboarding using progressive disclosure — collecting only essential information upfront and deferring advanced settings to post-activation. Built a new portfolio dashboard with clear data hierarchy, colour-coded performance indicators, and customisable widget layout. Implemented in Flutter for pixel-perfect cross-platform delivery.', steps: [['01', 'Research & Analytics', 'User interviews with 20 traders (10 novice, 10 experienced). Analysed onboarding funnel data. Discovered step 4 (KYC) caused 42% of abandonment.'], ['02', 'Onboarding Redesign', 'Reduced from 12 to 7 steps using progressive disclosure. Moved non-critical steps post-activation. Redesigned KYC flow with clear progress indicator.'], ['03', 'Dashboard Design', 'New portfolio dashboard with card-based layout, clear P&L hierarchy, sparkline charts, and one-tap access to most-used actions.'], ['04', 'Flutter Development', 'Pixel-perfect Flutter UI with custom financial chart widgets, smooth page transitions, and Lottie animations for loading states.']], outcomes: [['25%', 'Increase in user activation rate'], ['40%', 'Reduction in onboarding steps (12→7)'], ['4.4★', 'App Store rating']], highlights: ['Redesigned 12-step onboarding to 7 steps with progressive disclosure', 'Custom Flutter financial chart widgets with clear data hierarchy', 'Colour-coded portfolio performance meeting financial conventions', 'Accessible design meeting financial app compliance requirements', 'Lottie animations improving perceived performance'] },

    'cs-cubeone-web': { title: 'CubeOneBiz — Business Platform', category: 'Enterprise Web Platform', client: 'CubeOne', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=85', role: 'Sr. UI/UX Designer & Full-Stack Developer', tools: 'Figma, HTML5, CSS3, JavaScript, Node.js, PHP', duration: '18 Weeks', year: '2019', link: 'https://cubeonebiz.com', challenge: 'Enterprise teams across 4 departments were using 6 disconnected tools for task management, reporting, invoicing, HR, and CRM. Context switching was costing an estimated 2 hours per employee per day. A unified platform was needed that consolidated everything while maintaining familiar workflows each team depended on.', solution: 'Designed a role-based dashboard platform giving each user a personalised view of their most critical workflows. Built on Node.js/PHP with a real-time data layer. The design system ensured visual consistency across all 6 consolidated feature areas despite their very different data models.', steps: [['01', 'Discovery Sprint', '5-day discovery: stakeholder interviews across 4 departments, workflow mapping, 2-week diary study tracking tool-switching behaviour.'], ['02', 'Information Architecture', 'Unified IA consolidating 6 tools. Role-based navigation ensuring each persona sees relevant tools first. Card sorting with 20 users.'], ['03', 'UI Design', 'Dashboard-led design system with role-based views, data-dense but scannable layouts, and consistent interaction patterns.'], ['04', 'Full-Stack Build', 'Node.js REST API, PHP server-side rendering, real-time dashboards via WebSocket. Fully responsive from 320px to 2560px.']], outcomes: [['35%', 'Improvement in task completion speed'], ['50%', 'Reduction in tool-switching overhead'], ['6', 'Legacy tools consolidated']], highlights: ['Unified dashboard consolidating 6 enterprise tools', 'Role-based views for Manager, Staff, and Admin personas', 'Real-time dashboards via WebSocket connection', 'Full-stack Node.js/PHP with RESTful API', 'Complete Figma design system across 6 feature areas'] },

    'cs-cubeone-mobile': { title: 'CubeOne Mobile App', category: 'Enterprise Mobile App', client: 'CubeOne', img: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=85', role: 'UI/UX Designer & Flutter Developer', tools: 'Figma, Flutter, Dart, Firebase, Photoshop', duration: '12 Weeks', year: '2019', link: 'https://play.google.com', challenge: 'Field staff needed mobile access to CubeOneBiz but the responsive web app performed poorly on mobile with no offline capability. A native experience was needed prioritising the 5 most critical field workflows while staying in real-time sync with the desktop platform.', solution: 'Identified top 5 mobile workflows through usage analytics. Designed mobile-native UX — thumb-friendly, offline-capable, and deeply integrated with Firebase for real-time sync. Implemented in Flutter for true cross-platform delivery with a shared backend.', steps: [['01', 'Usage Analysis', 'Analysed 3 months of web platform data to identify the top 5 workflows for field staff. Field interviews to understand mobile-specific context.'], ['02', 'Mobile UX Design', 'Thumb-friendly navigation, gesture-based interactions, and simplified data entry optimised for one-handed field use.'], ['03', 'Offline Architecture', 'Offline-first UX with clear sync status indicators. All critical actions work without connectivity, syncing automatically when connection restores.'], ['04', 'Flutter Build & Testing', 'Cross-platform Flutter with Firebase Firestore offline persistence. Field tested with 12 actual users across 3 locations over 2 weeks.']], outcomes: [['90%', 'Feature parity with web platform'], ['4.5★', 'Google Play Store rating'], ['60%', 'Field team adoption in 30 days']], highlights: ['Offline-first with automatic background sync via Firebase', 'Thumb-optimised navigation for one-handed field use', 'Push notifications for task assignments and approvals', 'Biometric authentication for quick secure access', 'Shared Firebase backend with real-time web platform sync'] },

    'pg-flutgrid': { title: 'FlutGrid — Flutter Package', category: 'Open Source · Flutter', client: 'Community', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85', role: 'Creator & Maintainer', tools: 'Flutter, Dart, pub.dev', duration: 'Ongoing', year: '2024', link: 'https://pub.dev', challenge: 'Across multiple Flutter projects I found myself re-building the same grid layout patterns from scratch each time. The existing pub.dev ecosystem lacked flexible, well-documented grid components that could handle masonry, staggered, and adaptive layouts out of the box.', solution: 'I abstracted the most-used grid patterns from 5+ production projects into a clean, composable Flutter package. The API was designed with DX first — minimal boilerplate, sensible defaults, full customisation. Published to pub.dev with full documentation and live example app.', steps: [['01', 'Pattern Extraction', 'Catalogued recurring grid patterns across 5+ production Flutter projects. Identified 4 core layout types worth abstracting.'], ['02', 'API Design', 'Designed the public API with DX as the primary goal — minimal required parameters, sensible defaults, full opt-in customisation.'], ['03', 'Documentation', 'Wrote full API documentation, usage examples, and a live example app covering all layout types and edge cases.'], ['04', 'Publish & Maintain', 'Published to pub.dev. Ongoing maintenance including bug fixes, Flutter SDK compatibility updates, and community feature requests.']], outcomes: [['pub.dev', 'Published and actively maintained'], ['MIT', 'Licensed — free for commercial use'], ['Flutter', 'Full SDK compatibility']], highlights: ['Responsive grid system with flexible column configurations', 'Custom masonry and staggered grid variants', 'Comprehensive documentation with live code examples', 'MIT licensed — free for commercial and personal use'] },

    'pg-clamp': { title: 'Clamp FontSize Generator', category: 'Open Source · Web Tool', client: 'Community', img: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=85', role: 'Designer & Developer', tools: 'HTML5, CSS3, Vanilla JavaScript', duration: '4 Weeks', year: '2023', link: '#', challenge: 'Manually calculating CSS clamp() values for fluid type scales was a constant, tedious, error-prone task. Existing tools were either too simplistic or required understanding the maths to use them correctly.', solution: 'Built a visual web tool that abstracts the maths entirely — input min/max font sizes and viewport breakpoints, get production-ready CSS clamp() output instantly. Designed for both designers and developers to use without needing to understand the underlying calculations.', steps: [['01', 'Problem Definition', 'Documented the exact manual process and where it broke down. Interviewed 8 developers to understand their current workflow and pain points.'], ['02', 'Formula Implementation', 'Implemented the clamp() interpolation formula accurately in JavaScript. Added support for both px and rem output units.'], ['03', 'UI Design', 'Designed a clean, minimal interface with a live preview showing font size at different viewport widths as you adjust inputs.'], ['04', 'Testing & Release', 'Tested across all major browsers. Gathered feedback from 20 developers and iterated on the UI twice before public release.']], outcomes: [['100%', 'Browser compatible (all modern browsers)'], ['px & rem', 'Both output units supported'], ['Zero deps', 'Pure HTML/CSS/JS']], highlights: ['Visual type scale preview updating in real time', 'Copy-ready CSS clamp() output with one click', 'Supports both px and rem output units', 'Fully keyboard accessible and mobile friendly'] },

    'pg-flutter-widgets': { title: 'Custom Flutter Widgets', category: 'Open Source · Components', client: 'Community', img: 'https://images.unsplash.com/photo-1545670723-196ed0954986?w=1200&q=85', role: 'Creator', tools: 'Flutter, Dart, GitHub', duration: 'Ongoing', year: '2023', link: 'https://github.com', challenge: 'The Flutter ecosystem had gaps — animated gradient buttons, complex data tables with sorting/pagination, and accessible bottom sheets with spring physics weren\'t available as polished, production-ready packages.', solution: 'A growing library of Flutter UI widgets built for community use. Each widget addresses a specific gap — designed with production quality, accessibility baked in, and detailed documentation with working example apps.', steps: [['01', 'Gap Analysis', 'Surveyed pub.dev and common Flutter dev forums to identify the most-requested missing UI components.'], ['02', 'Widget Design', 'Designed each widget\'s API, visual appearance, and animation curves before writing any code — design-first, always.'], ['03', 'Implementation', 'Built each widget in Flutter with full accessibility support — semantics, keyboard navigation, and reduced motion respect.'], ['04', 'Documentation', 'Full API docs, README with code examples, and a demo app showing each widget in context published to GitHub.']], outcomes: [['GitHub', 'Open source on GitHub'], ['Accessible', 'Full a11y support'], ['Growing', 'Actively maintained library']], highlights: ['Animated gradient button with ripple and loading states', 'Data table with sort, filter, and pagination', 'Custom bottom sheet with spring physics animation', 'Shimmer loading placeholder components', 'Full accessibility support with semantics'] },

    'pg-blazor': { title: 'Blazor Reusable Components', category: 'Open Source · .NET', client: 'Community', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=85', role: 'Creator', tools: 'Blazor, .NET, C#, CSS', duration: 'Ongoing', year: '2022', link: 'https://github.com', challenge: 'Building enterprise Blazor applications, I found myself rebuilding the same UI patterns repeatedly. The Blazor component ecosystem lacked production-grade data grids, form validation components with good accessibility, and a modal system with proper focus management.', solution: 'Extracted the most-used components from enterprise Blazor projects into a reusable, well-documented library. Following Microsoft\'s Fluent UI guidelines while remaining fully customisable via CSS custom properties.', steps: [['01', 'Component Audit', 'Catalogued all custom Blazor components built across 4 enterprise projects. Identified the 12 most-reused worth packaging.'], ['02', 'API Standardisation', 'Standardised the component API patterns across all 12 components for consistency and predictability.'], ['03', 'Accessibility', 'Added full ARIA support, keyboard navigation, and focus management to all interactive components — often missing in existing Blazor libraries.'], ['04', 'Documentation', 'XML documentation for C# API, README with usage examples, and a live Blazor demo app.']], outcomes: [['12+', 'Production-ready components'], ['ARIA', 'Full accessibility support'], ['MIT', 'Licensed']], highlights: ['Enterprise-grade data grid with virtual scrolling', 'Form validation components with accessible error messaging', 'Modal and drawer system with proper focus management', 'Full theming support via CSS custom properties', 'Follows Microsoft Fluent UI guidelines'] },

    'pg-terminal': { title: 'Terminal Portfolio', category: 'Creative Coding · UX Experiment', client: 'Personal', img: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&q=85', role: 'Designer & Developer', tools: 'HTML5, CSS3, Vanilla JavaScript', duration: '3 Weeks', year: '2022', link: 'https://abdulrazakshaikh.designfolio.me', challenge: 'Most designer portfolios follow the same predictable template — hero, work grid, about, contact. I wanted to build something that demonstrated creative coding ability and non-conventional thinking about interaction design, while still being functional and navigable.', solution: 'A fully functional terminal-style portfolio where visitors navigate by typing commands. \'help\' lists all commands, \'work\' shows projects, \'contact\' opens email, and hidden easter eggs reward curious explorers. Mobile-adapted with touch-friendly command buttons.', steps: [['01', 'Concept', 'Defined the interaction model and full command set. Wrote the experience as a script before writing any code.'], ['02', 'Terminal Engine', 'Built a custom JavaScript command parser handling input history, auto-complete, and animated typewriter output.'], ['03', 'Content', 'Structured all portfolio content as terminal responses — balancing information density with the playful medium.'], ['04', 'Mobile Adaptation', 'Designed a touch-friendly command button bar for mobile visitors who can\'t type commands.']], outcomes: [['Memorable', 'Highly distinctive vs. conventional portfolios'], ['Easter eggs', 'Hidden commands for curious explorers'], ['Mobile', 'Touch-adapted for all devices']], highlights: ['Full command-line navigation with input history support', 'Typewriter animation effects for immersive terminal feel', 'Easter eggs discoverable through specific commands', 'Mobile-adapted with touch-friendly command buttons', 'Demonstrates creative coding and unconventional UX thinking'] },
};

function buildCSPageContent(id) {
    const d = CS_DATA[id];
    if (!d) return '<p style="padding:100px 48px;color:var(--muted)">Case study not found.</p>';

    const isConfidential = d.link === '#';
    const linkBtn = isConfidential
        ? `<span class="csp-btn csp-btn-ghost">Confidential — Internal Project</span>`
        : `<a href="${d.link}" target="_blank" rel="noopener" class="csp-btn csp-btn-p">Visit Live Project →</a>`;

    const steps = d.steps.map(([n, t, desc]) => `
    <div class="csp-step csp-reveal">
      <div class="csp-step-n">${n}</div>
      <div class="csp-step-title">${t}</div>
      <div class="csp-step-desc">${desc}</div>
    </div>`).join('');

    const outcomes = d.outcomes.map(([v, l]) => `
    <div class="csp-outcome csp-reveal">
      <div class="csp-out-val">${v}</div>
      <div class="csp-out-label">${l}</div>
    </div>`).join('');

    const highlights = d.highlights.map(h => `<li>${h}</li>`).join('');

    return `
  <div class="csp-inner">
    <img src="${d.img}" alt="${d.title}" class="csp-hero-img csp-reveal" loading="eager">

    <div class="csp-eyebrow csp-reveal">${d.category} · ${d.client}</div>
    <h1 class="csp-title csp-reveal">${d.title}</h1>
    <p class="csp-lead csp-reveal">${d.solution.split('.').slice(0, 2).join('.')}.</p>

    <div class="csp-meta-row csp-reveal">
      <div class="csp-meta-cell"><div class="csp-meta-label">Role</div><div class="csp-meta-val">${d.role}</div></div>
      <div class="csp-meta-cell"><div class="csp-meta-label">Tools & Tech</div><div class="csp-meta-val sm">${d.tools}</div></div>
      <div class="csp-meta-cell"><div class="csp-meta-label">Duration</div><div class="csp-meta-val">${d.duration}</div></div>
      <div class="csp-meta-cell"><div class="csp-meta-label">Year</div><div class="csp-meta-val">${d.year}</div></div>
    </div>

    <div class="csp-2col">
      <div class="csp-section">
        <div class="csp-section-tag">The Challenge</div>
        <h2 class="csp-section-h">Problem Space</h2>
        <p class="csp-body csp-reveal">${d.challenge}</p>
      </div>
      <div class="csp-section">
        <div class="csp-section-tag">My Approach</div>
        <h2 class="csp-section-h">Solution</h2>
        <p class="csp-body csp-reveal">${d.solution}</p>
      </div>
    </div>

    <div class="csp-section">
      <div class="csp-section-tag">How I Worked</div>
      <h2 class="csp-section-h csp-reveal">Design Process</h2>
      <div class="csp-steps">${steps}</div>
    </div>

    <div class="csp-section">
      <div class="csp-section-tag">Impact</div>
      <h2 class="csp-section-h csp-reveal">Key Outcomes</h2>
      <div class="csp-outcomes">${outcomes}</div>
    </div>

    <div class="csp-section">
      <div class="csp-section-tag">Deliverables</div>
      <h2 class="csp-section-h csp-reveal">What I Delivered</h2>
      <ul class="csp-list">${highlights}</ul>
    </div>

    <div class="csp-actions">
      ${linkBtn}
      <button class="csp-btn csp-btn-s" onclick="closeCSPage()">← Back to Portfolio</button>
    </div>
  </div>`;
}

/* ── open ── */
function openCSPage(id) {
    const curtain = document.getElementById('cs-curtain');
    const page = document.getElementById('cs-page');
    const back = document.getElementById('cs-back');

    /* 1. Curtain sweeps up from bottom */
    curtain.className = '';
    void curtain.offsetWidth;
    curtain.classList.add('in');

    /* 2. After curtain covers screen, swap content + slide page in */
    setTimeout(() => {
        page.innerHTML = buildCSPageContent(id);
        page.dataset.csId = id;
        page.classList.add('open');
        page.scrollTop = 0;
        back.classList.add('visible');
        lenis.stop();
        document.body.style.overflow = 'hidden';

        /* 3. Curtain sweeps out upward */
        setTimeout(() => {
            curtain.className = '';
            void curtain.offsetWidth;
            curtain.classList.add('out');

            /* 4. Trigger in-page reveals */
            setTimeout(() => {
                curtain.className = '';
                const obs = new IntersectionObserver(entries => entries.forEach(e => {
                    if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
                }), { threshold: 0.1, root: page });
                page.querySelectorAll('.csp-reveal').forEach(el => obs.observe(el));
            }, 500);

        }, 80);
    }, 440);
}

/* ── close ── */
function closeCSPage() {
    const curtain = document.getElementById('cs-curtain');
    const page = document.getElementById('cs-page');
    const back = document.getElementById('cs-back');

    /* curtain sweeps up again */
    curtain.className = '';
    void curtain.offsetWidth;
    curtain.classList.add('in');

    setTimeout(() => {
        page.classList.remove('open');
        page.classList.add('close');
        back.classList.remove('visible');
        lenis.start();
        document.body.style.overflow = '';

        setTimeout(() => {
            curtain.className = '';
            void curtain.offsetWidth;
            curtain.classList.add('out');
            setTimeout(() => {
                curtain.className = '';
                page.classList.remove('close');
                page.innerHTML = '';
            }, 500);
        }, 80);
    }, 440);
}

window.openCSPage = openCSPage;
window.closeCSPage = closeCSPage;

/* ─── Experience Toggle Logic ─── */
function toggleExpMore() {
    const wrap = document.getElementById('expMoreWrap');
    const btn = document.getElementById('expToggleBtn');
    if (!wrap || !btn) return;

    const isExpanded = wrap.classList.toggle('expanded');
    btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

    const textSpan = btn.querySelector('.exp-toggle-text');

    if (isExpanded) {
        if (textSpan) textSpan.textContent = 'Less past experience';
    } else {
        if (textSpan) textSpan.textContent = 'More past experience';
        // Scroll back to experience block to avoid layout jump
        const aboutSec = document.getElementById('about');
        if (aboutSec) {
            lenis.scrollTo(aboutSec, { duration: 1.0 });
        }
    }
}
window.toggleExpMore = toggleExpMore;

/* ─── Page transition interceptors for Work & Playground ─── */
document.querySelectorAll('.project-item, .play-item, .proj-view-btn').forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        let targetUrl = '';
        if (item.classList.contains('proj-view-btn') || item.tagName === 'A') {
            targetUrl = item.getAttribute('href');
        } else {
            const link = item.querySelector('a');
            if (link) {
                targetUrl = link.getAttribute('href');
            } else {
                const id = item.dataset.cs;
                if (id) {
                    targetUrl = `projects/${id}.html`;
                }
            }
        }

        if (!targetUrl) return;

        const curtain = document.getElementById('cs-curtain');
        if (curtain) {
            curtain.className = '';
            void curtain.offsetWidth;
            curtain.classList.add('in');

            // Lock scrolling and show transition cursor if applicable
            document.body.style.overflow = 'hidden';
            lenis.stop();

            setTimeout(() => {
                window.location.href = targetUrl;
            }, 450);
        } else {
            window.location.href = targetUrl;
        }
    });
});

/* Escape closes cs-page */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const page = document.getElementById('cs-page');
        if (page && page.classList.contains('open')) closeCSPage();
    }
});


/* ─── VIDEO PLAY ON HOVER ─── */
document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.showcasevideo');
    videos.forEach(video => {
        video.addEventListener('mouseenter', () => video.play());
        video.addEventListener('mouseleave', () => video.pause());
    });
});