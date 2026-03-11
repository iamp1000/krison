gsap.registerPlugin(ScrollTrigger);

// --- Lenis Smooth Scroll Initialization ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    orientation: 'vertical',
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- Global Polish: Scroll Skew & Global Cursor ---

function initScrollSkew() {
    let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter(".hero-bg, .hover-parallax img, .swiper-slide img", "skewY", "deg"),
        clamp = gsap.utils.clamp(-5, 5);

    lenis.on('scroll', ({ velocity }) => {
        let skew = clamp(velocity * 0.1);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
                skew: 0,
                duration: 0.8,
                ease: "power3",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew)
            });
        }
    });
}

function initGlobalCursor() {
    const cursor = document.getElementById('global-cursor');
    if (!cursor) return;

    const xTo = gsap.quickTo(cursor, "left", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "top", { duration: 0.3, ease: "power3" });

    window.addEventListener('mousemove', e => {
        xTo(e.clientX);
        yTo(e.clientY);
    });

    const hoverables = document.querySelectorAll('a, button, .magnetic, .swiper-slide');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
}

// --- Preloader & Initial Reveal ---
const preloaderTl = gsap.timeline();

window.addEventListener('load', () => {
    preloaderTl.to(".preloader-text", {
        opacity: 1,
        y: -10,
        duration: 1,
        ease: "power3.out"
    })
    .to(".preloader-line", {
        scaleX: 1,
        duration: 1.5,
        ease: "power4.inOut"
    }, "-=0.5")
    .to("#preloader", {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
        delay: 0.5
    })
    .fromTo(".hero-bg", 
        { scale: 1.2 }, 
        { scale: 1, duration: 2, ease: "power3.out" }, 
        "-=0.8"
    )
    .call(() => {
        initHeroAnimation();
        initIntroAnimation();
        initPhilosophyAnimation();
        initPenthouseAnimation();
        initFooterAnimation();
        
        initMagneticButtons();
        initHoverParallax();
        initGlobalCursor();
        initScrollSkew();
    });
});

// --- Navbar Scroll Logic ---
const navbar = document.getElementById("navbar");
ScrollTrigger.create({
    start: "top -50",
    end: 99999,
    toggleClass: {className: 'nav-scrolled', targets: navbar}
});
ScrollTrigger.create({
    start: "top -100",
    end: 99999,
    onUpdate: (self) => {
        if (self.direction === 1) {
            navbar.classList.add("nav-hidden");
        } else {
            navbar.classList.remove("nav-hidden");
        }
    }
});

// --- Grouped & Unique Section Animations ---

function initHeroAnimation() {
    const heroTl = gsap.timeline();
    const heroTitle = new SplitType('header h1', { types: 'chars' });
    const heroSub = document.querySelector('header p');
    const heroLine = document.querySelector('header .w-[1px]');

    heroTl.from(heroTitle.chars, {
        yPercent: 100,
        opacity: 0,
        rotation: 10,
        duration: 1.2,
        stagger: 0.02,
        ease: "power4.out"
    }, "+=0.2")
    .from(heroLine, {
        scaleY: 0,
        duration: 1,
        ease: "power3.inOut"
    }, "-=0.8")
    .from(heroSub, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out"
    }, "-=0.5");

    gsap.to(".hero-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: "header",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
}

function initIntroAnimation() {
    const section = document.getElementById("intro");
    const introTl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 75%",
        }
    });

    const badge = section.querySelector(".fade-up");
    const title = new SplitType(section.querySelector('h2'), { types: 'lines' });
    const button = section.querySelector("button");

    introTl.from(badge, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    })
    .from(title.lines, {
        yPercent: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out"
    }, "-=0.4")
    .from(button, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    }, "-=0.6");
}

function initPhilosophyAnimation() {
    const section = document.getElementById("philosophy");
    const philTl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 60%",
        }
    });

    const title = new SplitType(section.querySelector('h2'), { types: 'lines' });
    const texts = section.querySelectorAll('p, a');
    const imgContainer = section.querySelector(".hover-parallax");
    const img = imgContainer.querySelector("img");
    const revealLayer = imgContainer.querySelector(".reveal-layer");

    philTl.to(revealLayer, {
        scaleX: 0,
        duration: 1.5,
        ease: "power3.inOut"
    })
    .from(img, {
        scale: 1.3,
        xPercent: 10,
        duration: 1.5,
        ease: "power3.out"
    }, "-=1.5")
    .from(title.lines, {
        x: -50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out"
    }, "-=1.0")
    .from(texts, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    }, "-=0.8");
}

function initPenthouseAnimation() {
    const section = document.getElementById("penthouse-detail");
    const pentTl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 60%",
        }
    });

    const bgBlock = section.querySelector(".col-start-5, .bg-[#9eab88]");
    const title = new SplitType(bgBlock.querySelector('h2'), { types: 'chars' });
    const imgOverlap = section.querySelector(".image-overlap, .relative.z-20.-mt-16");
    const revealLayer = imgOverlap.querySelector(".reveal-layer");
    const img = imgOverlap.querySelector("img");
    const infoBox = section.querySelectorAll(".col-start-7 p, .relative.z-20.mt-12 p");

    pentTl.from(bgBlock, {
        xPercent: 100,
        duration: 1.2,
        ease: "power3.inOut"
    })
    .to(revealLayer, {
        scaleX: 0,
        duration: 1.2,
        ease: "power3.inOut"
    }, "-=0.8")
    .from(img, {
        scale: 1.3,
        duration: 1.2,
        ease: "power3.out"
    }, "-=1.2")
    .from(title.chars, {
        opacity: 0,
        x: 20,
        stagger: 0.03,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.4")
    .from(infoBox, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    }, "-=0.8");
}

function initFooterAnimation() {
    const footer = document.querySelector("footer");
    gsap.from(footer, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: footer,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true
        }
    });

    const footerTl = gsap.timeline({
        scrollTrigger: {
            trigger: footer,
            start: "top 80%",
        }
    });

    const logo = footer.querySelector(".serif-font");
    const text = footer.querySelector("p");
    const links = footer.querySelectorAll(".flex a");
    const copy = footer.querySelector(".mt-20");

    footerTl.from(logo, {
        letterSpacing: "1em",
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
    })
    .from(text, {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=1.0")
    .from(links, {
        y: 10,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.5")
    .from(copy, {
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.5");
}

// --- Utilities & Interactions ---

function initMagneticButtons() {
    const magneticEls = document.querySelectorAll('.magnetic');
    magneticEls.forEach(el => {
        const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        el.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = el.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            xTo(x * 0.35);
            yTo(y * 0.35);
        });

        el.addEventListener('mouseleave', () => {
            xTo(0);
            yTo(0);
        });
    });
}

function initHoverParallax() {
    const parallaxContainers = document.querySelectorAll('.hover-parallax');
    parallaxContainers.forEach(container => {
        const img = container.querySelector('img');
        container.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = container.getBoundingClientRect();
            const moveX = ((clientX - left) / width - 0.5) * 40;
            const moveY = ((clientY - top) / height - 0.5) * 40;
            gsap.to(img, {
                x: moveX,
                y: moveY,
                duration: 1,
                ease: "power3.out"
            });
        });
        container.addEventListener('mouseleave', () => {
            gsap.to(img, {
                x: 0,
                y: 0,
                duration: 1,
                ease: "power3.out"
            });
        });
    });
}

// --- Swiper.js Gallery Initialization ---
const swiper = new Swiper('.swiper', {
    slidesPerView: 'auto',
    centeredSlides: true,
    loop: true,
    spaceBetween: 100,
    speed: 1000,
    effect: 'coverflow',
    coverflowEffect: {
        rotate: 0, stretch: 0, depth: 0, modifier: 1, slideShadows: false,
    },
    pagination: {
        el: '.m-bullets-nav',
        clickable: true,
        type: 'bullets',
    },
});

document.querySelectorAll('.swiper-slide img').forEach(img => {
    img.addEventListener('mouseenter', () => gsap.to(img, { scale: 1.05, duration: 0.6, ease: "power2.out" }));
    img.addEventListener('mouseleave', () => gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" }));
});

const gallerySection = document.getElementById("gallery");
if (gallerySection) {
    gsap.fromTo(gallerySection, { backgroundColor: "#F4F2EE" }, { 
        backgroundColor: "#9eab88", 
        duration: 1.5,
        scrollTrigger: { trigger: gallerySection, start: "top 70%" }
    });
}

const galleryCursor = document.getElementById('gallery-cursor');
if (gallerySection && galleryCursor) {
    gallerySection.addEventListener('mousemove', (e) => {
        gsap.to(galleryCursor, { left: e.clientX, top: e.clientY, duration: 0.15, ease: "power2.out" });
        const screenWidth = window.innerWidth;
        galleryCursor.classList.remove('cursor-left', 'cursor-right', 'cursor-center');
        if (e.clientX < screenWidth * 0.25) galleryCursor.classList.add('cursor-left');
        else if (e.clientX > screenWidth * 0.75) galleryCursor.classList.add('cursor-right');
        else galleryCursor.classList.add('cursor-center');
    });
    gallerySection.addEventListener('mouseenter', () => {
        gallerySection.classList.add('cursor-hidden');
        galleryCursor.classList.add('visible');
    });
    gallerySection.addEventListener('mouseleave', () => {
        gallerySection.classList.remove('cursor-hidden');
        galleryCursor.classList.remove('visible');
    });
    gallerySection.addEventListener('click', (e) => {
        if (e.target.closest('.m-bullets-nav')) return;
        const screenWidth = window.innerWidth;
        if (e.clientX < screenWidth * 0.25) swiper.slidePrev();
        else if (e.clientX > screenWidth * 0.75) swiper.slideNext();
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) lenis.scrollTo(target);
    });
});