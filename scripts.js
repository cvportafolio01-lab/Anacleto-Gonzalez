/* ============================================
   ARCHIVO: scripts.js (ESTABLE Y SEGURO)
============================================ */

document.addEventListener('DOMContentLoaded', () => {

    if (window.AOS) {
        AOS.init({
            duration: 700,
            easing: 'ease-out-cubic',
            once: true,
            offset: 120
        });
    }

    inicializarNavbar();
    cargarTimeline();
    inicializarScrollSuave();
});

/* ============================================
   NAVBAR
============================================ */
function inicializarNavbar() {
    const navbar = document.getElementById('navbar-principal');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
    });
}

/* ============================================
   TIMELINE (FIX DEFINITIVO)
============================================ */
function cargarTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    fetch('datos-timeline.json')
        .then(r => r.json())
        .then(data => renderizarTimeline(data.eventos, container))
        .catch(() => usarTimelineFallback(container));
}

function renderizarTimeline(eventos, container) {

    let html = '<div class="timeline-linea"></div>';

    eventos.forEach((evento, index) => {

        const delay = Math.min(index * 120, 600); // 🔒 límite real

        html += `
            <div class="timeline-evento" data-aos="fade-up" data-aos-delay="${delay}">
                <div class="timeline-punto"></div>
                <span class="timeline-tipo">${evento.tipo}</span>
                <div class="timeline-año">${evento.año}</div>
                <h3 class="timeline-titulo">${evento.titulo}</h3>
                <p class="timeline-descripcion">${evento.descripcion}</p>
                <img
                    class="timeline-imagen"
                    src="${evento.imagen}"
                    alt="${evento.titulo}"
                    loading="lazy">
            </div>
        `;
    });

    container.innerHTML = html;

    // 🔥 ESPERAR IMÁGENES ANTES DE AOS
    const imgs = container.querySelectorAll('img');
    let cargadas = 0;

    imgs.forEach(img => {
        if (img.complete) {
            cargadas++;
        } else {
            img.addEventListener('load', () => {
                cargadas++;
                if (cargadas === imgs.length && window.AOS) {
                    AOS.refresh();
                }
            });
        }
    });

    if (cargadas === imgs.length && window.AOS) {
        AOS.refresh();
    }
}

/* ============================================
   FALLBACK SEGURO
============================================ */
function usarTimelineFallback(container) {
    renderizarTimeline([
        {
            año: '1888',
            titulo: 'Nacimiento',
            descripcion: 'Nace en Tepatitlán de Morelos.',
            imagen: 'images/anacletoprincipal.jpeg',
            tipo: 'Nacimiento'
        },
        {
            año: '1927',
            titulo: 'Martirio',
            descripcion: 'Ejecutado sin juicio.',
            imagen: 'images/anacletojuntacolor.jpeg',
            tipo: 'Martirio'
        }
    ], container);
}

/* ============================================
   SCROLL SUAVE
============================================ */
function inicializarScrollSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();

            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}
