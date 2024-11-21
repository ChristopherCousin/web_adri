// Variables globales
let modalSwiper;

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
});

// Navbar Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinksItems = navLinks.querySelectorAll('a');

hamburger.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
});

// Cerrar el menú al hacer clic en un enlace (móvil)
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});

// Cambio de fondo de la Navbar al hacer scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Cambio de enlace activo
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
        if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
            navLinksItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === section.getAttribute('id')) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Scroll suave
const smoothLinks = document.querySelectorAll('a[href^="#"]');

smoothLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Ignorar enlaces que abren modales
        if (link.id === 'mainCTA' || link.id === 'secondaryCTA' || link.id === 'contactInfoCTA') {
            return;
        }

        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Inicialización de Swiper.js para Testimonios
const testimonialSwiper = new Swiper('.testimonials .swiper-container', {
    loop: true,
    autoplay: {
        delay: 7000,
        disableOnInteraction: false,
    },
    // Controles de paginación y navegación eliminados
});

// Filtrado del Portafolio y Modal
let portfolioData = [];

const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioGrid = document.getElementById('portfolioGrid');
const portfolioModal = document.getElementById('portfolioModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const closePortfolioModal = portfolioModal.querySelector('.close');

// Cargar Portafolio desde JSON
fetch('portfolio.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        portfolioData = data;
        renderPortfolio(portfolioData);
    })
    .catch(error => console.error('Error cargando el portafolio:', error));

// Función para renderizar el portafolio
function renderPortfolio(projects) {
    if (!projects || projects.length === 0) {
        portfolioGrid.innerHTML = `
            <div class="portfolio-error">
                <p>No hay proyectos disponibles en este momento.</p>
            </div>`;
        return;
    }

    portfolioGrid.innerHTML = '';
    projects.forEach(project => {
        const portfolioItem = document.createElement('div');
        portfolioItem.classList.add('portfolio-item');
        portfolioItem.setAttribute('data-category', project.category);

        const imageSrc = project.image || project.videoThumbnail;
        if (!imageSrc) return; // Skip if no image available

        portfolioItem.innerHTML = `
            <div class="portfolio-image">
                <img src="${imageSrc}" 
                     alt="${project.title}"
                     loading="lazy">
                <div class="portfolio-overlay">
                    <h3>${project.title}</h3>
                    <span class="portfolio-icon"><i class="fas fa-search-plus"></i></span>
                </div>
            </div>
        `;

        portfolioItem.addEventListener('click', () => showPortfolioModal(project));
        portfolioGrid.appendChild(portfolioItem);
    });
}
// Filtrado de Portafolio
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover clase activa de todos los botones
        filterButtons.forEach(button => button.classList.remove('active'));
        // Añadir clase activa al botón clicado
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        portfolioItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                // Opcional: agregar animaciones
                item.classList.add('animate__animated', 'animate__fadeIn');
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Función para manejar el clic en un elemento del portafolio
portfolioGrid.addEventListener('click', (e) => {
    const portfolioItem = e.target.closest('.portfolio-item');
    if (portfolioItem) {
        const title = portfolioItem.querySelector('h3').innerText;

        const project = portfolioData.find(p => p.title === title);

        if (project) {
            // Establecer título y descripción
            modalTitle.innerText = project.title;
            modalDescription.innerText = project.description || 'Descripción del proyecto...';

            // Configurar las imágenes y videos en Swiper
            const modalSwiperWrapper = document.getElementById('modalSwiperWrapper');
            modalSwiperWrapper.innerHTML = ''; // Limpiar diapositivas anteriores

            // Agregar diapositivas al Swiper
            if (project.beforeImage && project.afterImage) {
                // Slider de comparación de imágenes
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');
                slide.innerHTML = `
                    <div class="before-after-slider">
                        <img src="${project.beforeImage}" alt="Antes">
                        <img src="${project.afterImage}" alt="Después">
                    </div>
                `;
                modalSwiperWrapper.appendChild(slide);

                // Inicializar el slider
                setTimeout(() => {
                    new BeforeAfter(slide.querySelector('.before-after-slider'));
                }, 0);
            }

            if (project.video && project.videoThumbnail) {
                // Miniatura de video con botón de reproducción
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');
                slide.innerHTML = `
                    <div class="video-thumbnail" data-video="${project.video}">
                        <img src="${project.videoThumbnail}" alt="${project.title}">
                        <span class="play-button"><i class="fas fa-play"></i></span>
                    </div>
                `;
                modalSwiperWrapper.appendChild(slide);
            }

            // Agregar imágenes adicionales si existen
            if (project.additionalImages && Array.isArray(project.additionalImages)) {
                project.additionalImages.forEach(imageUrl => {
                    const slide = document.createElement('div');
                    slide.classList.add('swiper-slide');
                    slide.innerHTML = `<img src="${imageUrl}" alt="${project.title}">`;
                    modalSwiperWrapper.appendChild(slide);
                });
            }

            // Mostrar el modal
            portfolioModal.style.display = 'block';
            portfolioModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Evita el scroll de fondo

            // Inicializar Swiper
            if (modalSwiper) {
                modalSwiper.destroy(); // Destruir instancia anterior si existe
            }
            modalSwiper = new Swiper('.portfolio-swiper', {
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });

            // Añadir evento para reproducir video al hacer clic en la miniatura
            modalSwiperWrapper.addEventListener('click', function(e) {
                const thumbnail = e.target.closest('.video-thumbnail');
                if (thumbnail) {
                    const videoSrc = thumbnail.getAttribute('data-video');
                    thumbnail.innerHTML = `
                        <video controls autoplay>
                            <source src="${videoSrc}" type="video/mp4">
                            Tu navegador no soporta videos HTML5.
                        </video>
                    `;
                }
            });
        }
    }
});

// Cerrar Modal de Portfolio
closePortfolioModal.addEventListener('click', () => {
    portfolioModal.style.display = 'none';
    portfolioModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Restaura el scroll

    // Destruir el Swiper para evitar conflictos
    if (modalSwiper) {
        modalSwiper.destroy();
        modalSwiper = null;
    }
});

// Cerrar Modal al hacer clic fuera del contenido
portfolioModal.addEventListener('click', (e) => {
    if (e.target === portfolioModal) {
        portfolioModal.style.display = 'none';
        portfolioModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // Restaura el scroll

        // Destruir el Swiper para evitar conflictos
        if (modalSwiper) {
            modalSwiper.destroy();
            modalSwiper = null;
        }
    }
});

// Modal de Contacto
const mainCTA = document.getElementById('mainCTA');
const secondaryCTA = document.getElementById('secondaryCTA');
const contactInfoCTA = document.getElementById('contactInfoCTA');
const contactModal = document.getElementById('contactModal');
const closeContactModal = contactModal.querySelector('.close');

function openContactModal(e) {
    e.preventDefault();
    contactModal.style.display = 'block';
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Evita el scroll de fondo
}

mainCTA.addEventListener('click', openContactModal);
secondaryCTA.addEventListener('click', openContactModal);
contactInfoCTA.addEventListener('click', openContactModal);

// Cerrar Modal de Contacto
closeContactModal.addEventListener('click', () => {
    contactModal.style.display = 'none';
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Restaura el scroll
});

// Cerrar Modal de Contacto al hacer clic fuera del contenido
contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        contactModal.style.display = 'none';
        contactModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // Restaura el scroll
    }
});

// Validación y Envío del Formulario de Contacto
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e){
    e.preventDefault();

    // Limpiar errores previos
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => {
        msg.style.display = 'none';
    });

    // Obtener valores
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    let valid = true;

    // Validación Nombre
    if(name === '') {
        const nameError = document.getElementById('nameError');
        nameError.innerText = 'Por favor, ingresa tu nombre.';
        nameError.style.display = 'block';
        valid = false;
    }

    // Validación Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email === '') {
        const emailError = document.getElementById('emailError');
        emailError.innerText = 'Por favor, ingresa tu correo electrónico.';
        emailError.style.display = 'block';
        valid = false;
    } else if(!emailPattern.test(email)) {
        const emailError = document.getElementById('emailError');
        emailError.innerText = 'Por favor, ingresa un correo electrónico válido.';
        emailError.style.display = 'block';
        valid = false;
    }

    // Validación Mensaje
    if(message === '') {
        const messageError = document.getElementById('messageError');
        messageError.innerText = 'Por favor, ingresa tu mensaje.';
        messageError.style.display = 'block';
        valid = false;
    }

    if(valid) {
        // Lógica para enviar el formulario (a implementar)
        alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
        contactForm.reset();
        // Cerrar el modal de contacto si está abierto
        if (contactModal.style.display === 'block') {
            contactModal.style.display = 'none';
            contactModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto'; // Restaura el scroll
        }
    }
});

