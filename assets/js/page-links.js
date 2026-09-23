// Mapeamento das páginas por área
// As chaves do objeto correspondem exatamente ao texto do título (h3) de cada card

const areaPages = {
    'Ansiedade': './pages/ansiedade.html',
    'Depressão e humor': './pages/depressao.html',
    'Autoestima': './pages/autoestima.html',
    'Relacionamentos': './pages/relacionamentos.html',
    'Terapia de casal': './pages/terapia-de-casal.html',
    'Adolescentes': './pages/adolescentes.html',
};

document.querySelectorAll('.area-card').forEach((card) => {
    const title = card.querySelector('h3')?.textContent.trim();
    const href = areaPages[title];

    if (!href) return;

    card.classList.add('area-card-link');
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.addEventListener('click', () => { window.location.href = href; });
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            window.location.href = href;
        }
    });
});
