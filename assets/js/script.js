// WhatsApp link — número real do cliente
const WHATSAPP_NUMBER = "5512988314037";
const WHATSAPP_TEXT = encodeURIComponent("Olá! Gostaria de agendar uma consulta na Clínica Metamorphe.");
const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;
document.querySelectorAll('#navWaBtn, .hero-wa-btn, .cta-wa-btn, #floatWaBtn').forEach(el => el.href = waLink);

// Acessibilidade: painel de texto maior / alto contraste, com preferência salva
(function () {
    const toggle = document.getElementById('a11yToggle');
    const panel = document.getElementById('a11yPanel');
    if (!toggle || !panel) return;

    const root = document.documentElement;
    const STORAGE_KEY = 'metamorphe-a11y';

    const readPrefs = () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch (e) {
            return {};
        }
    };
    const savePrefs = (prefs) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
        } catch (e) { /* localStorage pode estar indisponível (modo privado); ignora */ }
    };

    const apply = (prefs) => {
        root.classList.toggle('a11y-text-larger', !!prefs.textLarger);
        root.classList.toggle('a11y-contrast', !!prefs.contrast);
    };

    apply(readPrefs());

    toggle.addEventListener('click', () => {
        const isOpen = !panel.hidden;
        panel.hidden = isOpen;
        toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', (event) => {
        if (!panel.hidden && !panel.contains(event.target) && event.target !== toggle && !toggle.contains(event.target)) {
            panel.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
        }
    });

    panel.querySelectorAll('[data-a11y]').forEach(btn => {
        btn.addEventListener('click', () => {
            const prefs = readPrefs();
            const action = btn.dataset.a11y;
            if (action === 'text-larger') prefs.textLarger = true;
            if (action === 'text-reset') prefs.textLarger = false;
            if (action === 'contrast') prefs.contrast = !prefs.contrast;
            savePrefs(prefs);
            apply(prefs);
        });
    });
})();

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('nav-open');
        menuToggle.classList.toggle('active', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        if (window.innerWidth <= 1050) {
            navLinks.classList.remove('nav-open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }));
}

// FAQ accordion — max-height calculado dinamicamente, sem cortar respostas longas
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!question || !answer) return;

    const setHeight = () => {
        answer.style.maxHeight = item.classList.contains('open') ? `${answer.scrollHeight}px` : '0px';
    };
    setHeight();

    question.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('open');
            const a = i.querySelector('.faq-a');
            if (a) a.style.maxHeight = '0px';
        });
        if (!wasOpen) {
            item.classList.add('open');
            setHeight();
        }
    });
});

// Scrollspy: destaca o link do menu correspondente à seção visível
if (navLinks) {
    const navAnchors = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
    const sections = navAnchors
        .map(a => document.getElementById(a.getAttribute('href').slice(1)))
        .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const link = navAnchors.find(a => a.getAttribute('href') === `#${entry.target.id}`);
                if (!link) return;
                navAnchors.forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            });
        }, {
            rootMargin: '-45% 0px -50% 0px',
            threshold: 0
        });
        sections.forEach(section => spy.observe(section));
    }
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
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
}

// Formulário de contato
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const submitBtn = document.getElementById('contactSubmit');
    const statusEl = document.getElementById('contactStatus');

    // Fallback sem JS: se a página veio de um redirect de erro (?erro=...), mostra a mensagem aqui.
    const erroParam = new URLSearchParams(window.location.search).get('erro');
    if (erroParam) {
        statusEl.textContent = erroParam;
        statusEl.classList.add('error');
    }

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        statusEl.textContent = '';
        statusEl.classList.remove('success', 'error');

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            const formData = new FormData(contactForm);
            const contactMessage = `Olá! Meu nome é ${formData.get('name')}. E-mail: ${formData.get('email')}. Mensagem: ${formData.get('message')}`;
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(contactMessage)}`, '_blank', 'noopener');
            statusEl.textContent = 'Abrimos o WhatsApp para você concluir o contato.';
            statusEl.classList.add('success');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar mensagem';
        } catch (err) {
            statusEl.textContent = 'Falha de conexão. Tente novamente ou chame no WhatsApp.';
            statusEl.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar mensagem';
        }
    });
}
