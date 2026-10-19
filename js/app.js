/**
 * Noedius - Ultra Dark Link in Bio - Interactive JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons if loaded
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Set Footer Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. Canvas Monochromatic Particle Aura Background
    initCanvasParticles();

    // 4. LocalStorage Profile Loading
    loadProfileData();

    // 5. Share Action with Direct Copy & Icon Animation Feedback
    initShareModal();

    // 6. Covers Carousel & Preview Modal
    initCoversCarousel();
});

/* ==========================================================================
   Canvas Monochromatic Star Dust Animation
   ========================================================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    function getDimensions() {
        return {
            w: Math.max(window.innerWidth, document.documentElement.clientWidth || 0),
            h: Math.max(window.innerHeight, document.documentElement.clientHeight || 0)
        };
    }

    let dims = getDimensions();
    let width = canvas.width = dims.w;
    let height = canvas.height = dims.h;

    function getParticleCount() {
        return window.innerWidth < 600 ? 25 : 45;
    }

    let particleCount = getParticleCount();
    const particles = [];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.0 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.alpha = Math.random() * 0.7 + 0.3;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles.length = 0;
        particleCount = getParticleCount();
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    initParticles();

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
        dims = getDimensions();
        width = canvas.width = dims.w;
        height = canvas.height = dims.h;
        initParticles();
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
}

/* ==========================================================================
   Share Action & Copy Link with Checkmark Feedback
   ========================================================================== */
function initShareModal() {
    const shareBtn = document.getElementById('share-btn');

    function getShareUrl() {
        return window.location.href;
    }

    const SHARE_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`;
    const CHECK_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

    let isCopying = false;

    function animateShareIcon() {
        if (isCopying || !shareBtn) return;
        isCopying = true;
        shareBtn.innerHTML = CHECK_SVG;
        
        setTimeout(() => {
            if (shareBtn) shareBtn.innerHTML = SHARE_SVG;
            isCopying = false;
        }, 1500);
    }

    // Direct Copy Action & Icon Feedback on Share Button Click
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const url = getShareUrl();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(() => {
                    animateShareIcon();
                }).catch(() => {
                    fallbackCopy(url);
                    animateShareIcon();
                });
            } else {
                fallbackCopy(url);
                animateShareIcon();
            }
        });
    }

    function fallbackCopy(url) {
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }
}

/* ==========================================================================
   Profile Data Management
   ========================================================================== */
const DEFAULT_PROFILE = {
    name: "Noedius",
    handle: "@noedius",
    avatar: "img/avatar.jpg"
};

function loadProfileData() {
    const savedProfile = localStorage.getItem('user_bio_profile_v3');
    const profile = savedProfile ? JSON.parse(savedProfile) : DEFAULT_PROFILE;

    applyProfileData(profile);
}

function applyProfileData(profile) {
    const handleEl = document.getElementById('display-handle');
    const avatarEl = document.getElementById('profile-avatar');

    if (handleEl) handleEl.textContent = profile.handle;
    if (avatarEl && profile.avatar) avatarEl.src = profile.avatar;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');

    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

/* ==========================================================================
   Smooth Infinite Stage Coverflow (Cálculo Físico 3D & Bucle)
   ========================================================================== */
function initCoversCarousel() {
    const container = document.querySelector('.carousel-container-pure');
    const track = document.getElementById('carousel-track');
    if (!container || !track) return;

    const cards = Array.from(track.querySelectorAll('.carousel-card'));
    const total = cards.length;
    if (total === 0) return;

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentDragDelta = 0;

    // Calcular distribución de tarjetas respecto al índice central (bucle infinito modular)
    function render() {
        const isMobile = window.innerWidth <= 480;
        const spacing = isMobile ? 130 : 210;

        cards.forEach((card, index) => {
            // Calcular distancia circular en el bucle [-total/2, total/2]
            let offset = (index - currentIndex) % total;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            // Añadir el arrastre en vivo si está activo
            const effectiveOffset = offset + (currentDragDelta / spacing);
            const absOffset = Math.abs(effectiveOffset);

            // Solo mostrar las tarjetas cercanas al centro (hasta 3 a cada lado)
            if (absOffset > 3.4) {
                card.style.visibility = 'hidden';
                card.style.opacity = '0';
                card.style.pointerEvents = 'none';
                card.classList.remove('is-center');
                return;
            }

            card.style.visibility = 'visible';
            card.style.pointerEvents = 'auto';

            // Matemáticas de curva Coverflow:
            // X: desplazamiento horizontal espaciado
            const x = effectiveOffset * spacing;
            // Scale: el central crece al 1.35x, los laterales bajan suavemente al 0.78x
            const scale = Math.max(0.72, 1.3 - (absOffset * 0.22));
            // Z: el central viaja al frente (+80px), laterales retroceden (-70px * offset)
            const z = (1 - Math.min(1, absOffset)) * 90 - (absOffset * 35);
            // Opacity: el central 1, laterales se difuminan con elegancia
            const opacity = Math.max(0, 1 - (absOffset * 0.28));
            // RotateY: rotación sutil 3D angular
            const rotateY = -Math.sign(effectiveOffset) * Math.min(30, absOffset * 18);
            // Brightness
            const brightness = Math.max(0.45, 1 - (absOffset * 0.22));

            card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`;
            card.style.opacity = opacity;
            card.style.filter = `brightness(${brightness})`;
            card.style.zIndex = Math.round(100 - absOffset * 20);

            if (absOffset < 0.45) {
                card.classList.add('is-center');
            } else {
                card.classList.remove('is-center');
            }
        });
    }

    function goToIndex(idx) {
        currentIndex = (idx % total + total) % total;
        currentDragDelta = 0;
        render();
    }

    // Interacción al hacer clic en cualquier portada
    cards.forEach((card, idx) => {
        card.addEventListener('click', (e) => {
            if (Math.abs(currentDragDelta) > 5) return; // Evitar click si fue drag

            let offset = (idx - currentIndex) % total;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            if (Math.abs(offset) < 0.3) {
                // Si ya está en el centro, abrir modal visor
                const coverModal = document.getElementById('cover-modal');
                const modalImg = document.getElementById('cover-modal-img');
                const modalTitle = document.getElementById('cover-modal-title');
                const modalCategory = document.getElementById('cover-modal-category');

                if (modalImg) modalImg.src = card.getAttribute('data-src');
                if (modalTitle) modalTitle.textContent = card.getAttribute('data-title');
                if (modalCategory) modalCategory.textContent = card.getAttribute('data-category');
                if (coverModal) coverModal.classList.add('active');
            } else {
                // Si es lateral, viajar y centrarla de inmediato con animación suave
                goToIndex(idx);
            }
        });
    });

    // Deslizamiento con Mouse (Drag) y Touch
    function onStart(e) {
        isDragging = true;
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        currentDragDelta = 0;
        track.style.transition = 'none';
    }

    function onMove(e) {
        if (!isDragging) return;
        const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        currentDragDelta = currentX - startX;
        render();
    }

    function onEnd() {
        if (!isDragging) return;
        isDragging = false;
        const threshold = 40;
        if (currentDragDelta > threshold) {
            goToIndex(currentIndex - 1);
        } else if (currentDragDelta < -threshold) {
            goToIndex(currentIndex + 1);
        } else {
            currentDragDelta = 0;
            render();
        }
    }

    container.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    container.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    // Soporte con la rueda del ratón (desplazamiento horizontal de portadas)
    container.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || Math.abs(e.deltaY) > 25) {
            e.preventDefault();
            if (e.deltaY > 0 || e.deltaX > 0) {
                goToIndex(currentIndex + 1);
            } else {
                goToIndex(currentIndex - 1);
            }
        }
    }, { passive: false });

    // Teclado (Flechas izquierda y derecha)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToIndex(currentIndex - 1);
        if (e.key === 'ArrowRight') goToIndex(currentIndex + 1);
    });

    // Render inicial
    goToIndex(0);

    // Ajustar si la ventana cambia de tamaño
    window.addEventListener('resize', () => render());

    // Modal cerrar
    const coverModal = document.getElementById('cover-modal');
    const closeCoverModal = document.getElementById('close-cover-modal');
    if (closeCoverModal && coverModal) {
        closeCoverModal.addEventListener('click', () => coverModal.classList.remove('active'));
        coverModal.addEventListener('click', (e) => {
            if (e.target === coverModal) coverModal.classList.remove('active');
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') coverModal.classList.remove('active');
        });
    }
}
