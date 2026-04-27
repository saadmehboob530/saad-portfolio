/* =====================================================
   SAAD MEHBOOB — PREMIUM PORTFOLIO SCRIPT (UPGRADED)
   Lenis + GSAP + Typed + Advanced UI Effects
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ─────────────────────────────────────────────
       0. PAGE LOADER
    ───────────────────────────────────────────── */
    window.addEventListener("load", () => {
        gsap.to(".loader", {
            opacity: 0,
            duration: 1,
            delay: 1,
            onComplete: () => {
                const loader = document.querySelector(".loader");
                if (loader) loader.style.display = "none";
            }
        });
    });


    /* ─────────────────────────────────────────────
       1. LENIS SMOOTH SCROLL
    ───────────────────────────────────────────── */
    const lenis = new Lenis({
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

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);


    /* ─────────────────────────────────────────────
       2. GSAP
    ───────────────────────────────────────────── */
    gsap.registerPlugin(ScrollTrigger);


    /* ─────────────────────────────────────────────
       3. SCROLL PROGRESS BAR
    ───────────────────────────────────────────── */
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        const bar = document.querySelector(".progress-bar");
        if (bar) bar.style.width = progress + "%";
    });


    /* ─────────────────────────────────────────────
       4. CUSTOM CURSOR
    ───────────────────────────────────────────── */
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


    /* ─────────────────────────────────────────────
       5. NAVBAR + SCROLL BUTTON
    ───────────────────────────────────────────── */
    const navbar = document.getElementById('navbar');
    const scrollUpBtn = document.getElementById('scrollUpBtn');

    lenis.on('scroll', ({ scroll }) => {
        if (scroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scroll > 500) {
            scrollUpBtn.classList.add('show');
        } else {
            scrollUpBtn.classList.remove('show');
        }
    });

    scrollUpBtn && scrollUpBtn.addEventListener('click', () => {
        lenis.scrollTo(0, { duration: 1.4 });
    });


    /* ─────────────────────────────────────────────
       6. MOBILE MENU
    ───────────────────────────────────────────── */
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('mainMenu');

    menuToggle && menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        mainMenu.classList.toggle('open');
    });

    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            mainMenu.classList.remove('open');
        });
    });


    /* ─────────────────────────────────────────────
       7. SMOOTH ANCHOR SCROLL
    ───────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { duration: 1.4, offset: -80 });
            }
        });
    });


    /* ─────────────────────────────────────────────
       8. HERO ANIMATION
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
        stagger: 0.15,
        delay: 0.7,
    });


    /* ─────────────────────────────────────────────
       9. SPLIT TITLE
    ───────────────────────────────────────────── */
    document.querySelectorAll('.split-title').forEach(title => {
        const text = title.textContent;
        title.innerHTML = '';

        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            title.appendChild(span);
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

        title.querySelectorAll('.char').forEach(ch => {
            ch.style.opacity = '0';
            ch.style.transform = 'translateY(110%)';
        });
    });


    /* ─────────────────────────────────────────────
       10. REVEAL UP
    ───────────────────────────────────────────── */
    document.querySelectorAll('.reveal-up:not(.home .reveal-up)').forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    once: true,
                },
                delay: (i % 4) * 0.08,
            }
        );
    });


    /* ─────────────────────────────────────────────
       11. ABOUT IMAGE
    ───────────────────────────────────────────── */
    ScrollTrigger.create({
        trigger: '.about-img-wrap',
        start: 'top 80%',
        onEnter: () => {
            document.querySelector('.about-img-wrap').classList.add('in-view');
        },
        once: true,
    });


    /* ─────────────────────────────────────────────
       12. SERVICES STAGGER
    ───────────────────────────────────────────── */
    document.querySelectorAll('.service-row').forEach((row, i) => {
        ScrollTrigger.create({
            trigger: row,
            start: 'top 88%',
            onEnter: () => {
                setTimeout(() => row.classList.add('in-view'), i * 120);
            },
            once: true,
        });
    });


    /* ─────────────────────────────────────────────
       13. SKILL BARS
    ───────────────────────────────────────────── */
    document.querySelectorAll('.skill-bar').forEach((bar, i) => {
        const fill = bar.querySelector('.bar-fill');
        const targetWidth = fill.getAttribute('data-width') + '%';

        ScrollTrigger.create({
            trigger: bar,
            start: 'top 88%',
            onEnter: () => {
                setTimeout(() => {
                    bar.classList.add('in-view');
                    setTimeout(() => {
                        fill.style.width = targetWidth;
                    }, 200);
                }, i * 100);
            },
            once: true,
        });
    });


    /* ─────────────────────────────────────────────
       14. CONTACT ITEMS
    ───────────────────────────────────────────── */
    document.querySelectorAll('.contact-item').forEach((item, i) => {
        gsap.fromTo(item,
            { opacity: 0, x: -20 },
            {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    once: true,
                },
                delay: i * 0.1,
            }
        );
    });


    /* ─────────────────────────────────────────────
       15. PARALLAX BG
    ───────────────────────────────────────────── */
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


    /* ─────────────────────────────────────────────
       16. TYPING
    ───────────────────────────────────────────── */
    new Typed('.typing', {
        strings: ['QA Engineer', 'Automation Tester', 'Project Manager'],
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
    });

    new Typed('.typing-2', {
        strings: ['QA Engineer', 'Automation Tester', 'Project Manager'],
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
    });


    /* ─────────────────────────────────────────────
       17. MAGNETIC BUTTONS
    ───────────────────────────────────────────── */
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0,0)`;
        });
    });


    /* ─────────────────────────────────────────────
       18. TILT EFFECT
    ───────────────────────────────────────────── */
    document.querySelectorAll('.service-row').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateX = (y / rect.height - 0.5) * 10;
            const rotateY = (x / rect.width - 0.5) * -10;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0) rotateY(0)`;
        });
    });


    /* ─────────────────────────────────────────────
       19. CONTACT FORM
    ───────────────────────────────────────────── */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('fname').value;
            const email = document.getElementById('femail').value;
            const subject = document.getElementById('fsubject').value;
            const message = document.getElementById('fmessage').value;

            const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;

            window.location.href =
                `mailto:saadmehboob25@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
        });
    }

});