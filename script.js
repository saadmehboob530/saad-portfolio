/* =====================================================
   SAAD MEHBOOB — SOFTWARE ENGINEER PORTFOLIO
   Lenis + GSAP + Typed + Case Study System
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;

    /* ─────────────────────────────────────────────
       1. LENIS SMOOTH SCROLL (skipped under reduced motion)
    ───────────────────────────────────────────── */
    let lenis = null;

    if (!prefersReducedMotion) {
        lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.5,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
    }

    function onScroll(callback) {
        if (lenis) {
            lenis.on('scroll', callback);
        } else {
            window.addEventListener('scroll', () => callback({ scroll: window.scrollY }));
        }
    }

    function scrollToTarget(target) {
        if (lenis) {
            lenis.scrollTo(target, { duration: 1.4, offset: -80 });
        } else {
            const el = typeof target === 'string' || target instanceof Element ? target : document.body;
            if (target === 0) {
                window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            } else {
                el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
            }
        }
    }


    /* ─────────────────────────────────────────────
       2. GSAP
    ───────────────────────────────────────────── */
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
    }


    /* ─────────────────────────────────────────────
       3. CUSTOM CURSOR — fine pointer + hover only
    ───────────────────────────────────────────── */
    if (supportsFinePointer && !prefersReducedMotion) {
        document.body.classList.add('custom-cursor-enabled');

        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');

        if (cursor && follower) {
            let mouseX = 0, mouseY = 0;
            let followerX = 0, followerY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                cursor.style.left = mouseX + 'px';
                cursor.style.top = mouseY + 'px';
            });

            function animateCursor() {
                followerX += (mouseX - followerX) * 0.1;
                followerY += (mouseY - followerY) * 0.1;
                follower.style.left = followerX + 'px';
                follower.style.top = followerY + 'px';
                requestAnimationFrame(animateCursor);
            }
            animateCursor();
        }
    }


    /* ─────────────────────────────────────────────
       4. NAVBAR + SCROLL BUTTON
    ───────────────────────────────────────────── */
    const navbar = document.getElementById('navbar');
    const scrollUpBtn = document.getElementById('scrollUpBtn');

    onScroll(({ scroll }) => {
        navbar.classList.toggle('scrolled', scroll > 60);
        scrollUpBtn.classList.toggle('show', scroll > 500);
    });

    scrollUpBtn && scrollUpBtn.addEventListener('click', () => scrollToTarget(0));
    scrollUpBtn && scrollUpBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToTarget(0); }
    });


    /* ─────────────────────────────────────────────
       5. MOBILE MENU
    ───────────────────────────────────────────── */
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('mainMenu');

    function closeMenu() {
        menuToggle.classList.remove('open');
        mainMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    menuToggle && menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.classList.toggle('open');
        mainMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });


    /* ─────────────────────────────────────────────
       6. SMOOTH ANCHOR SCROLL
    ───────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                scrollToTarget(target);
            }
        });
    });


    /* ─────────────────────────────────────────────
       7. HERO ANIMATION
    ───────────────────────────────────────────── */
    gsap.set('.line-inner', { y: '110%' });
    gsap.to('.line-inner', {
        y: '0%',
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.12,
        delay: 0.3,
    });

    gsap.set('.home .reveal-up', { opacity: 0, y: 40 });
    gsap.to('.home .reveal-up', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.7,
    });


    /* ─────────────────────────────────────────────
       8. SPLIT TITLE
    ───────────────────────────────────────────── */
    document.querySelectorAll('.split-title').forEach(title => {
        const text = title.textContent;
        title.innerHTML = '';

        const words = text.split(' ');
        words.forEach((word, wi) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            word.split('').forEach(char => {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = char;
                span.style.opacity = '0';
                span.style.transform = 'translateY(110%)';
                wordSpan.appendChild(span);
            });
            title.appendChild(wordSpan);
            if (wi < words.length - 1) {
                title.appendChild(document.createTextNode(' '));
            }
        });

        ScrollTrigger.create({
            trigger: title,
            start: 'top 85%',
            onEnter: () => {
                title.querySelectorAll('.char').forEach((ch, i) => {
                    setTimeout(() => {
                        ch.style.transform = 'translateY(0)';
                        ch.style.opacity = '1';
                    }, i * 25);
                });
            },
            once: true,
        });
    });


    /* ─────────────────────────────────────────────
       9. REVEAL UP (generic)
    ───────────────────────────────────────────── */
    document.querySelectorAll('.reveal-up:not(.home .reveal-up)').forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
                delay: (i % 4) * 0.08,
            }
        );
    });


    /* ─────────────────────────────────────────────
       10. ABOUT IMAGE
    ───────────────────────────────────────────── */
    const aboutImg = document.querySelector('.about-img-wrap');
    if (aboutImg) {
        ScrollTrigger.create({
            trigger: aboutImg,
            start: 'top 80%',
            onEnter: () => aboutImg.classList.add('in-view'),
            once: true,
        });
    }


    /* ─────────────────────────────────────────────
       11. PROJECT CARDS STAGGER
    ───────────────────────────────────────────── */
    document.querySelectorAll('.project-card').forEach((card, i) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 88%',
            onEnter: () => setTimeout(() => card.classList.add('in-view'), i * 100),
            once: true,
        });
    });


    /* ─────────────────────────────────────────────
       12. CONTACT ITEMS
    ───────────────────────────────────────────── */
    document.querySelectorAll('.contact-item').forEach((item, i) => {
        gsap.fromTo(item,
            { opacity: 0, x: -20 },
            {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: { trigger: item, start: 'top 90%', once: true },
                delay: i * 0.1,
            }
        );
    });


    /* ─────────────────────────────────────────────
       13. PARALLAX BG (skipped under reduced motion)
    ───────────────────────────────────────────── */
    if (!prefersReducedMotion) {
        gsap.to('.home-bg-text', {
            y: -120,
            ease: 'none',
            scrollTrigger: {
                trigger: '.home',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
        });
    }


    /* ─────────────────────────────────────────────
       14. TYPING
    ───────────────────────────────────────────── */
    if (window.Typed && document.querySelector('.typing')) {
        new Typed('.typing', {
            strings: [
                'Software Engineer',
                'Full-Stack Developer',
                'SaaS & Business Systems Engineer',
                'AI Automation Engineer'
            ],
            typeSpeed: 70,
            backSpeed: 45,
            backDelay: 1800,
            loop: !prefersReducedMotion,
            showCursor: true,
        });
    }


    /* ─────────────────────────────────────────────
       15. MAGNETIC BUTTONS (fine pointer only)
    ───────────────────────────────────────────── */
    if (supportsFinePointer && !prefersReducedMotion) {
        document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
            if (btn.type === 'submit') return;
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0,0)';
            });
        });
    }


    /* ─────────────────────────────────────────────
       16. CONTACT FORM (mailto — no backend configured)
    ───────────────────────────────────────────── */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('fname').value;
            const email = document.getElementById('femail').value;
            const subject = document.getElementById('fsubject').value;
            const message = document.getElementById('fmessage').value;

            const body = `Name: ${name}\r\nEmail: ${email}\r\n\r\n${message}`;

            window.location.href =
                `mailto:saadmehboob25@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }


    /* ─────────────────────────────────────────────
       17. CASE STUDY SYSTEM
    ───────────────────────────────────────────── */
    const caseStudies = {
        'pos-erp': {
            category: 'SaaS · POS · ERP · Business Management',
            name: 'POS ERP',
            status: 'Private Project — Source code not public',
            overview: 'POS ERP is a business-management SaaS platform built around real retail and restaurant operations — covering point-of-sale, inventory, orders, staff and reporting in a single connected system.',
            problem: 'Retail and restaurant businesses often run on disconnected tools — a POS terminal, a spreadsheet for inventory, separate systems for staff and expenses. That fragmentation makes it hard to see the business as one operational picture.',
            solution: 'A single multi-tenant platform where each business’s data — products, orders, inventory, customers, suppliers, staff and payments — lives in one relational model, with tenant isolation handled at the data layer.',
            flows: [
                { label: 'Layered Architecture', type: 'Architecture', steps: ['Frontend', 'Application Layer', 'API / Services', 'Database'] },
                { label: 'Tenant Data Flow', type: 'Workflow', steps: ['Tenant', 'Users', 'Products', 'Orders', 'Inventory', 'Payments'] }
            ],
            features: [
                'Multi-tenant architecture with tenant-aware data access',
                'Row Level Security for tenant isolation',
                'Products, inventory, orders & purchasing',
                'Staff roles and permissions',
                'Payments and expense tracking',
                'Business reporting'
            ],
            tech: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS'],
            engineering: 'Tenant isolation is handled at the data layer using Row Level Security, keeping each business’s operational data separated within the multi-tenant architecture.',
            quality: 'The same regression-thinking and edge-case discipline from a QA background carries into how this system is engineered — treating reliability as a design consideration, not an afterthought.',
        },
        'dispatch-ai': {
            category: 'SaaS · Logistics · Dispatch Technology',
            name: 'DispatchAI OS',
            status: 'Private Project — Source code not public',
            overview: 'DispatchAI OS is a SaaS platform for logistics and trucking operations, centralizing load management, driver and truck assignment, documents, and dispatch workflows in one dashboard-driven system.',
            problem: 'Dispatch operations typically span phone calls, spreadsheets and paper documents to track which driver is on which load, in which truck, with which paperwork — making status hard to see at a glance or hand off cleanly between dispatchers.',
            solution: 'A structured application layer that models loads, drivers, trucks and documents as connected entities, with dashboards that surface dispatch status clearly.',
            flows: [
                { label: 'Layered Architecture', type: 'Architecture', steps: ['Frontend', 'Application Layer', 'API / Services', 'Database'] },
                { label: 'Dispatch Flow', type: 'Workflow', steps: ['Load', 'Dispatch', 'Driver', 'Truck', 'Document', 'Delivery'] }
            ],
            features: [
                'Authentication & dashboards',
                'Load, driver & truck management',
                'Document handling',
                'Structured dispatch workflows'
            ],
            tech: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
            engineering: 'Loads, drivers, trucks and documents are modeled as explicitly connected entities, keeping the relational structure clear around structured relational data and workflow design.',
            quality: 'The same defect-prevention thinking from a QA background applies here — treating dispatch data as operationally consequential and engineering with that in mind.',
        },
        'ai-employee': {
            category: 'AI-Powered Business Automation',
            name: 'AI Employee',
            status: 'In Development · Private Project',
            overview: 'The project explores how AI can be connected to business workflows and external actions, turning natural-language requests into structured operational tasks.',
            problem: 'Many repetitive business operations — data entry, status checks, routine coordination — still require a person to manually move information between tools, despite being structured, rule-bound work well-suited to automation.',
            solution: 'An automation layer being built around connecting AI to business workflows and external actions — with human-in-the-loop checkpoints where appropriate, rather than full autonomy.',
            flows: [
                { label: 'Automation Flow', type: 'Workflow', steps: ['Request', 'AI Processing', 'Decision', 'Tool / Action', 'Result'] }
            ],
            features: [
                'AI-driven task execution',
                'Workflow & tool orchestration',
                'Business process automation',
                'Human-in-the-loop workflows'
            ],
            tech: ['AI-Powered Workflows', 'Agentic Automation', 'Tool Orchestration'],
            engineering: 'The project explores how AI can be connected to business workflows and external actions, turning natural-language requests into structured operational tasks. Internal architecture is still evolving as the project develops.',
            quality: 'As with the other projects, quality and reliability are treated as part of the engineering process rather than an afterthought — even at this early stage of development.',
        },
        'uni-fee': {
            category: 'Business Automation · Workflow System',
            name: 'University Fee Automation System',
            status: 'Private / Academic Project',
            overview: 'A workflow-automation system built to organize and streamline university fee-related processes that would otherwise be handled manually.',
            problem: 'Fee-related administrative workflows — tracking, processing, organizing records — are repetitive and error-prone when handled manually across many students and cycles.',
            solution: 'A structured system that models the fee-management process directly, organizing data around the actual workflow rather than ad-hoc spreadsheets.',
            flows: [
                { label: 'Layered Architecture', type: 'Architecture', steps: ['Frontend', 'Application Layer', 'Database'] }
            ],
            features: [
                'Structured fee workflows',
                'Automated data handling',
                'Fee-management process organization'
            ],
            tech: ['Web Application', 'Workflow Automation'],
            engineering: 'Built to model the fee-related workflow directly, keeping each step of the process organized around structured data handling rather than ad-hoc spreadsheets.',
            quality: 'The same structured, edge-case-aware thinking from a QA background was applied to organizing this workflow.',
        },
        'restaurant': {
            category: 'Web Application · Restaurant Technology',
            name: 'Restaurant Ordering System',
            status: 'Private Project — Source code not public',
            overview: 'A web application for restaurant ordering — structuring the menu/catalog, the customer ordering flow, and order processing into one system.',
            problem: 'Manual or disconnected ordering processes make it harder for restaurants to manage order accuracy and kitchen workflow consistently.',
            solution: 'A structured digital ordering flow that models the menu, the order lifecycle, and processing steps explicitly.',
            flows: [
                { label: 'Layered Architecture', type: 'Architecture', steps: ['Frontend', 'Application Layer', 'Database'] }
            ],
            features: [
                'Menu / catalog structure',
                'Digital ordering workflow',
                'Order processing logic'
            ],
            tech: ['Web Application', 'Ordering Workflow'],
            engineering: 'The ordering workflow is modeled explicitly from menu selection through order processing, keeping the system and the people using it aligned on order status.',
            quality: 'The same edge-case discipline from a QA background was applied to the ordering workflow’s processing logic.',
        }
    };

    function flowHTML(flow) {
        const nodes = flow.steps.map(step => `<div class="flow-node"><span>${step}</span></div>`).join('<div class="flow-connector"></div>');
        const type = flow.type || 'Architecture';
        return `<div class="flow-diagram" aria-hidden="true">${nodes}</div><p class="flow-caption">Illustrative ${type} — ${flow.label}</p>`;
    }

    function renderCaseStudy(id) {
        const data = caseStudies[id];
        if (!data) return '';

        const featuresHTML = data.features.map(f => `<li>${f}</li>`).join('');
        const techHTML = data.tech.map(t => `<span>${t}</span>`).join('');
        const flowsHTML = data.flows.map(flowHTML).join('');

        return `
            <div class="case-category">${data.category}</div>
            <h2 id="caseModalTitle">${data.name}</h2>
            <span class="case-status"><i class="fas fa-lock" aria-hidden="true"></i> ${data.status}</span>

            <div class="case-block">
                <h3>Overview</h3>
                <p>${data.overview}</p>
            </div>
            <div class="case-block">
                <h3>Problem</h3>
                <p>${data.problem}</p>
            </div>
            <div class="case-block">
                <h3>Solution</h3>
                <p>${data.solution}</p>
            </div>
            <div class="case-block">
                <h3>Architecture</h3>
                ${flowsHTML}
            </div>
            <div class="case-block">
                <h3>Key Capabilities</h3>
                <ul>${featuresHTML}</ul>
            </div>
            <div class="case-block">
                <h3>Technology</h3>
                <div class="tech-badges">${techHTML}</div>
            </div>
            <div class="case-block">
                <h3>Engineering</h3>
                <p>${data.engineering}</p>
            </div>
            <div class="case-block">
                <h3>Quality &amp; Reliability</h3>
                <p>${data.quality}</p>
            </div>
            <div class="case-block">
                <h3>Visual Evidence</h3>
                <p>The diagrams above are illustrative — conceptual representations of the architecture and workflow, not screenshots or verified internal implementation diagrams. Sanitized UI screenshots will be added here if and when they're available to share.</p>
            </div>
            <div class="case-block">
                <h3>Current Status &amp; Privacy</h3>
                <div class="case-privacy">
                    <i class="fas fa-lock" aria-hidden="true"></i>
                    <p>Status: ${data.status}. Source code is private and not publicly available. This case study — architecture, engineering decisions and workflow — is provided in its place. A deeper technical walkthrough is available on request via the contact section.</p>
                </div>
            </div>
        `;
    }

    const caseModal = document.getElementById('caseModal');
    const caseModalContent = document.getElementById('caseModalContent');
    let lastFocusedEl = null;

    function openCaseStudy(id, triggerEl) {
        if (!caseStudies[id] || !caseModal || !caseModalContent) return;
        lastFocusedEl = triggerEl || document.activeElement;
        caseModalContent.innerHTML = renderCaseStudy(id);
        caseModal.classList.add('open');
        caseModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const closeBtn = caseModal.querySelector('.case-modal-close');
        closeBtn && closeBtn.focus();
    }

    function closeCaseStudy() {
        if (!caseModal) return;
        caseModal.classList.remove('open');
        caseModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocusedEl) lastFocusedEl.focus();
    }

    document.querySelectorAll('.case-study-btn').forEach(btn => {
        btn.addEventListener('click', () => openCaseStudy(btn.getAttribute('data-project'), btn));
    });

    caseModal && caseModal.querySelectorAll('[data-close]').forEach(el => {
        el.addEventListener('click', closeCaseStudy);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && caseModal && caseModal.classList.contains('open')) {
            closeCaseStudy();
        }
    });

});
