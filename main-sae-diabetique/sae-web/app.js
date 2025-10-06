const menuToggle = document.querySelector('.menu-toggle');
const menuBar = document.querySelector('nav.menu-bar');

menuToggle.addEventListener('click', () => {
    menuBar.classList.toggle('active');
});
// --------------------------------------------------------------------------
// 🎞️ Carousel principal

const list = document.querySelectorAll('section.carousel .list article.carousel-item'); // toutes les slides
const carousel = document.querySelector('section.carousel');                           // conteneur
const points   = document.querySelectorAll('.points li');                               // points
const nextBtn = document.getElementById('next');                                        // suivant
const prevBtn = document.getElementById('prev');                                        // précédent

let active = 0;
let zIndex = 2;
const lastPosition = list.length - 1;

list[active].classList.add('active');
points[active].classList.add('active');

// Navigation manuelle
nextBtn.onclick = () => setItemActive(active + 1 > lastPosition ? 0 : active + 1);
prevBtn.onclick = () => setItemActive(active - 1 < 0 ? lastPosition : active - 1);

// points de Navigation
points.forEach((dot, index) => dot.addEventListener('click', () => setItemActive(index)));

// Fonction utilitaire
function setItemActive(newValue) {
    if (newValue === active) return;
    const type = newValue > active ? 'next' : 'prev';
    active = newValue;
    showSlider(type);
}

// Défilement automatique
let removeEffect;
let autoRun = setTimeout(() => nextBtn.click(), 9000);

// Affichage slider
function showSlider(type) {
    carousel.style.pointerEvents = 'none';

    const oldActive = document.querySelector('section.carousel .list article.carousel-item.active');
    if (oldActive) oldActive.classList.remove('active');

    zIndex++;
    list[active].style.zIndex = zIndex;
    list[active].classList.add('active');

    // Animation via CSS variable
    carousel.style.setProperty('--transform', type === 'next' ? '300px' : '-300px');
    carousel.classList.add('effect');

    const oldDot = document.querySelector('.points li.active');
    if (oldDot) oldDot.classList.remove('active');
    points[active].classList.add('active');

    clearTimeout(removeEffect);
    removeEffect = setTimeout(() => {
        carousel.classList.remove('effect');
        carousel.style.pointerEvents = 'auto';
    }, 1500);

    clearTimeout(autoRun);
    autoRun = setTimeout(() => nextBtn.click(), 9000);
}

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// 🎞️ Mini-carousel

const miniList = document.querySelector('.mini-list');
const miniItems = document.querySelectorAll('.mini-item');
const miniNext = document.querySelector('.mini-next');
const miniPrev = document.querySelector('.mini-prev');

let miniIndex = 0;

// Récupère la largeur exacte des items et l'espacement
const gap = 20; // doit correspondre au gap CSS
const itemWidth = miniItems[0].offsetWidth + gap;
const visibleCount = 5; // nombre de cartes visibles max

function updateMiniCarousel() {
    const maxIndex = miniItems.length - visibleCount;
    if (miniIndex < 0) miniIndex = maxIndex;
    if (miniIndex > maxIndex) miniIndex = 0;

    miniList.style.transform = `translateX(${-miniIndex * itemWidth}px)`;
}

// Bouton suivant
miniNext.addEventListener('click', () => {
    miniIndex++;
    updateMiniCarousel();
});

// Bouton précédent
miniPrev.addEventListener('click', () => {
    miniIndex--;
    updateMiniCarousel();
});

// Scroll automatique toutes les 5 secondes
setInterval(() => miniNext.click(), 5000);

//------------------------------stats------------------------------------------------
function animateCount(el, duration = 1800) {
    const target = +el.dataset.target;
    const start = 0;
    const startTime = performance.now();

    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * (target - start) + start);
        el.textContent = value.toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// Déclenche l'animation au scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            animateCount(entry.target);
            entry.target.dataset.animated = true;
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.count').forEach(el => observer.observe(el));

// --------------------------------------------------------------------------
// Bouton "Retour en haut"

const toTop = document.getElementById('toTop');
toTop.style.display = 'none';

window.addEventListener('scroll', () => {
    toTop.style.display = window.scrollY > 500 ? 'block' : 'none';
});

toTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// --------------------------------------------------------------------------
// Navbar scroll + changement logo

const header = document.querySelector("header");
const logoImg = document.querySelector("header .logo img");

window.addEventListener("scroll", () => {
    const isScrolled = window.scrollY > 50;
    header.classList.toggle("scrolled", isScrolled);

    // Changement du logo
    logoImg.src = isScrolled ? "images/logo.png" : "images/logo2.png";
});
