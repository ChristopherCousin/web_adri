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

// Close navbar on link click (mobile)
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});

// Navbar Background Change on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active Link Switching
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

// Smooth Scrolling
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

// Swiper.js Initialization for Testimonials (Sin paginación ni navegación)
const swiper = new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
        delay: 7000,
        disableOnInteraction: false,
    },
    // Eliminados los controles de paginación y navegación
});

// Portfolio Filtering and Modal
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
    portfolioGrid.innerHTML = ''; // Limpiar contenido previo
    projects.forEach(project => {
        const portfolioItem = document.createElement('div');
        portfolioItem.classList.add('portfolio-item');
        portfolioItem.setAttribute('data-category', project.category);

        portfolioItem.innerHTML = `
            <div class="portfolio-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="portfolio-overlay">
                <h3>${project.title}</h3>
                <span class="portfolio-icon"><i class="fas fa-search-plus"></i></span>
            </div>
        `;

        portfolioGrid.appendChild(portfolioItem);
    });
}

// Filtrado de Portafolio
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(button => button.classList.remove('active'));
        // Add active class to clicked button
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

// Funcionalidad del Slider de Comparación
function initImageComparison() {
    const slider = document.querySelector('.slider');
    const beforeImage = document.getElementById('beforeImage');
    const afterImage = document.getElementById('afterImage');
    const imageComparison = document.querySelector('.image-comparison');
    let isDragging = false;

    const setSliderPosition = (clientX) => {
        const rect = imageComparison.getBoundingClientRect();
        let offsetX = clientX - rect.left;
        if (offsetX < 0) offsetX = 0;
        if (offsetX > rect.width) offsetX = rect.width;
        const percent = (offsetX / rect.width) * 100;
        beforeImage.style.width = `${percent}%`;
        afterImage.style.clipPath = `inset(0 0 0 ${100 - percent}%)`;
        slider.style.left = `${percent}%`;
    };

    slider.addEventListener('mousedown', () => {
        isDragging = true;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        setSliderPosition(e.clientX);
    });

    // Para dispositivos táctiles
    slider.addEventListener('touchstart', () => {
        isDragging = true;
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        setSliderPosition(touch.clientX);
    });
}

portfolioGrid.addEventListener('click', (e) => {
    const portfolioItem = e.target.closest('.portfolio-item');
    if (portfolioItem) {
        const title = portfolioItem.querySelector('h3').innerText;

        const project = portfolioData.find(p => p.title === title);

        if (project) {
            // Establecer título y descripción
            modalTitle.innerText = project.title;
            modalDescription.innerText = project.description || 'Descripción del proyecto.';

            // Configurar las imágenes en Swiper
            const modalSwiperWrapper = document.getElementById('modalSwiperWrapper');
            modalSwiperWrapper.innerHTML = ''; // Limpiar diapositivas anteriores

            // Agregar diapositivas para las imágenes
            if (project.beforeImage) {
                const slideBefore = document.createElement('div');
                slideBefore.classList.add('swiper-slide');
                slideBefore.innerHTML = `<img src="${project.beforeImage}" alt="Antes">`;
                modalSwiperWrapper.appendChild(slideBefore);
            }

            if (project.afterImage) {
                const slideAfter = document.createElement('div');
                slideAfter.classList.add('swiper-slide');
                slideAfter.innerHTML = `<img src="${project.afterImage}" alt="Después">`;
                modalSwiperWrapper.appendChild(slideAfter);
            }

            // Si el proyecto tiene imágenes adicionales, agregarlas
            if (project.additionalImages && Array.isArray(project.additionalImages)) {
                project.additionalImages.forEach(imageUrl => {
                    const slide = document.createElement('div');
                    slide.classList.add('swiper-slide');
                    slide.innerHTML = `<img src="${imageUrl}" alt="Imagen">`;
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

// Contact Form Validation and Submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e){
    e.preventDefault();

    // Clear previous errors
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
        // Lógica para enviar el formulario
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
