// Events data
const events = [
    {
        badge: 'Evento',
        badgeClass: 'evento',
        logo: 'loghi/io creo.png',
        description: 'L\'unico evento di formazione in Italia che unisce Crescita Personale ed Educazione finanziaria, a cui hanno già partecipato migliaia di persone per migliorare i propri risultati.',
        url: 'https://iocreoilmiodestino.it/',
        cta: 'Scopri l\'evento'
    },
    {
        badge: 'Evento',
        badgeClass: 'evento',
        logo: 'loghi/donna leader.png',
        description: 'L\'evento dedicato alle donne che vogliono sviluppare leadership, autonomia e indipendenza, per guidare la propria vita e il proprio futuro professionale.',
        url: 'https://leonemasterschool.it/lms-mep-luglio-2025-donna-leader/',
        cta: 'Scopri l\'evento'
    },
    {
        badge: 'Evento',
        badgeClass: 'evento',
        logo: 'loghi/money maker.png',
        description: 'Il primo evento che porta il MOVIMENTO FIRE in Italia, dove riceverai gli strumenti per costruire una "macchina della libertà" per smettere di lavorare e vivere di rendita.',
        url: 'https://www.money-maker.it/mms-ottobre-2025/',
        cta: 'Scopri l\'evento'
    }
];

// Configuration
const config = {
    cardDistance: 60,
    verticalDistance: 70,
    delay: 5000,
    skewAmount: 6,
    ease: 'power2.out',
    durDrop: 0.6,
    durMove: 0.5,
    durReturn: 0.5,
    promoteOverlap: 0.5,
    returnDelay: 0.1
};

// State
let order = [];
let cards = [];
let currentIndex = 0;
let intervalId = null;
let timeline = null;
let isAnimating = false;

// DOM elements
const badge = document.getElementById('badge');
const eventLogo = document.getElementById('event-logo');
const description = document.getElementById('description');
const cta = document.getElementById('cta');
const contentLeft = document.querySelector('.content-left');
const dots = document.querySelectorAll('.dot');

// Initialize
function init() {
    cards = Array.from(document.querySelectorAll('.card'));
    order = cards.map((_, i) => i);
    
    // Place cards initially
    cards.forEach((card, i) => {
        placeCard(card, i);
    });

    // Update content for first card
    updateContent(0, false);

    // Setup event listeners
    setupEventListeners();

    // Start auto-swap
    startAutoSwap();
}

// Create slot position
function makeSlot(index) {
    const total = cards.length;
    const isMobilePortrait = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
    
    if (isMobilePortrait) {
        // Mobile portrait: stack vertically centered (no horizontal offset)
        return {
            x: 0,
            y: -index * 15, // Small vertical offset for stacking effect
            z: -index * 30,
            zIndex: total - index
        };
    } else {
        // Desktop/landscape: diagonal stack
        return {
            x: index * config.cardDistance,
            y: -index * config.verticalDistance,
            z: -index * config.cardDistance * 1.5,
            zIndex: total - index
        };
    }
}

// Place card at slot
function placeCard(card, index) {
    const slot = makeSlot(index);
    const isMobilePortrait = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
    
    gsap.set(card, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        skewY: isMobilePortrait ? 0 : config.skewAmount, // No skew on mobile
        transformOrigin: 'center center',
        zIndex: slot.zIndex,
        force3D: true
    });
}

// Update left content
function updateContent(index, animate = true) {
    const event = events[index];
    
    // Update data-event attribute for dynamic styling
    contentLeft.setAttribute('data-event', index);
    
    // Update dots
    updateDots(index);
    
    if (animate) {
        // Fade out
        badge.classList.add('fade-out');
        eventLogo.classList.add('fade-out');
        description.classList.add('fade-out');
        cta.classList.add('fade-out');

        setTimeout(() => {
            // Update content
            badge.textContent = event.badge;
            badge.className = `badge ${event.badgeClass}`;
            eventLogo.querySelector('.logo-image').src = event.logo;
            description.textContent = event.description;
            cta.textContent = event.cta;
            cta.href = event.url || '#';
            cta.target = '_top';
            cta.rel = 'noopener';

            // Fade in
            badge.classList.remove('fade-out');
            eventLogo.classList.remove('fade-out');
            description.classList.remove('fade-out');
            cta.classList.remove('fade-out');
            
            badge.classList.add('fade-in');
            eventLogo.classList.add('fade-in');
            description.classList.add('fade-in');
            cta.classList.add('fade-in');

            setTimeout(() => {
                badge.classList.remove('fade-in');
                eventLogo.classList.remove('fade-in');
                description.classList.remove('fade-in');
                cta.classList.remove('fade-in');
            }, 500);
        }, 300);
    } else {
        // Initial load without animation
        badge.textContent = event.badge;
        badge.className = `badge ${event.badgeClass}`;
        eventLogo.querySelector('.logo-image').src = event.logo;
        description.textContent = event.description;
        cta.textContent = event.cta;
        cta.href = event.url || '#';
        cta.target = '_top';
        cta.rel = 'noopener';
    }
}

// Swap cards
function swap() {
    if (order.length < 2 || isAnimating) return;
    
    isAnimating = true;
    
    // Kill previous timeline if exists
    if (timeline) {
        timeline.kill();
    }

    const [front, ...rest] = order;
    const frontCard = cards[front];
    
    // Update content BEFORE animation starts (sync with next card)
    const nextIndex = rest[0];
    updateContent(nextIndex);
    
    // Create timeline
    const tl = gsap.timeline({
        onComplete: () => {
            isAnimating = false;
        }
    });
    timeline = tl;

    // Drop front card
    tl.to(frontCard, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
    });

    // Promote other cards
    tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
    
    rest.forEach((idx, i) => {
        const card = cards[idx];
        const slot = makeSlot(i);
        
        tl.set(card, { zIndex: slot.zIndex }, 'promote');
        tl.to(
            card,
            {
                x: slot.x,
                y: slot.y,
                z: slot.z,
                duration: config.durMove,
                ease: config.ease
            },
            `promote+=${i * 0.15}`
        );
    });

    // Return front card to back
    const backSlot = makeSlot(cards.length - 1);
    tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
    
    tl.call(() => {
        gsap.set(frontCard, { zIndex: backSlot.zIndex });
    }, undefined, 'return');
    
    tl.to(
        frontCard,
        {
            x: backSlot.x,
            y: backSlot.y,
            z: backSlot.z,
            duration: config.durReturn,
            ease: config.ease
        },
        'return'
    );

    // Update order
    tl.call(() => {
        order = [...rest, front];
        currentIndex = order[0];
    });
}

// Auto-swap
function startAutoSwap() {
    swap();
    intervalId = setInterval(swap, config.delay);
}

function stopAutoSwap() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    if (timeline) {
        timeline.pause();
    }
}

function resumeAutoSwap() {
    if (timeline) {
        timeline.play();
    }
    if (!intervalId) {
        intervalId = setInterval(swap, config.delay);
    }
}

// Update dots indicator
function updateDots(activeIndex) {
    dots.forEach((dot, i) => {
        if (i === activeIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    const container = document.querySelector('.card-swap-container');
    
    // Pause on hover (desktop)
    container.addEventListener('mouseenter', stopAutoSwap);
    container.addEventListener('mouseleave', resumeAutoSwap);

    // Click to swap (desktop)
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (isAnimating) return;
            stopAutoSwap();
            swap();
            setTimeout(resumeAutoSwap, 1000);
        });
    });

    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (isAnimating) return;
            stopAutoSwap();
            navigateToIndex(index);
            setTimeout(resumeAutoSwap, 2000);
        });
    });

    // Touch swipe (mobile)
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) < minSwipeDistance) return;
        if (isAnimating) return;

        stopAutoSwap();

        if (swipeDistance > 0) {
            // Swipe right - go back
            swapReverse();
        } else {
            // Swipe left - go forward
            swap();
        }

        setTimeout(resumeAutoSwap, 2000);
    }
}

// Navigate to specific index
function navigateToIndex(targetIndex) {
    if (isAnimating) return;
    
    const currentFront = order[0];
    if (currentFront === targetIndex) return;
    
    // Find target in order
    const targetPosition = order.indexOf(targetIndex);
    
    // Swap forward or backward to reach target
    if (targetPosition === 1) {
        swap();
    } else if (targetPosition === order.length - 1) {
        swapReverse();
    } else {
        // Multiple swaps needed - just do one in the right direction
        if (targetPosition < order.length / 2) {
            swap();
        } else {
            swapReverse();
        }
    }
}

// Reverse swap (go back)
function swapReverse() {
    if (order.length < 2 || isAnimating) return;
    
    isAnimating = true;
    
    // Kill previous timeline if exists
    if (timeline) {
        timeline.kill();
    }

    // Get last card and move to front
    const last = order[order.length - 1];
    const rest = order.slice(0, -1);
    const lastCard = cards[last];
    
    // Update content to last card
    updateContent(last);
    
    // Create timeline
    const tl = gsap.timeline({
        onComplete: () => {
            isAnimating = false;
        }
    });
    timeline = tl;

    // Move last card from back to front
    const frontSlot = makeSlot(0);
    tl.set(lastCard, { zIndex: cards.length });
    tl.to(lastCard, {
        x: frontSlot.x,
        y: frontSlot.y,
        z: frontSlot.z,
        duration: config.durMove,
        ease: config.ease
    });

    // Push other cards back
    tl.addLabel('pushBack', `-=${config.durMove * 0.5}`);
    rest.forEach((idx, i) => {
        const card = cards[idx];
        const slot = makeSlot(i + 1);
        
        tl.set(card, { zIndex: slot.zIndex }, 'pushBack');
        tl.to(
            card,
            {
                x: slot.x,
                y: slot.y,
                z: slot.z,
                duration: config.durMove,
                ease: config.ease
            },
            `pushBack+=${i * 0.1}`
        );
    });

    // Update order
    tl.call(() => {
        order = [last, ...rest];
        currentIndex = order[0];
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
