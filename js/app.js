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
        return window.innerWidth < 600 ? 80 : 150;
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
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
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
