// WhatsApp link — número real do cliente
const WHATSAPP_NUMBER = "5512988314037";
const WHATSAPP_TEXT = encodeURIComponent("Olá! Gostaria de agendar uma consulta na Clínica Metamorphe.");
const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;
document.querySelectorAll('#navWaBtn, .hero-wa-btn, .cta-wa-btn, #floatWaBtn').forEach(el => el.href = waLink);

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('nav.links');
menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.style.display === 'flex';
    navLinks.style.display = isOpen ? 'none' : 'flex';
    navLinks.style.cssText += isOpen ? '' : 'position:absolute;top:100%;left:0;right:0;background:var(--cream);flex-direction:column;padding:20px 32px;gap:18px;border-bottom:1px solid rgba(124,87,81,0.1);';
});
document.querySelectorAll('nav.links a').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
        navLinks.style.display = 'none';
    }
}));

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
    });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
        }
    });
}, {
    threshold: 0.15
});
revealEls.forEach(el => io.observe(el));
