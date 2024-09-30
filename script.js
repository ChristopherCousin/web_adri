window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
});

// Navbar Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinksItems = navLinks.querySelectorAll('a');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close navbar on link click (mobile)
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
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


// Portfolio Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(button => button.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                item.classList.add('animate__animated', 'animate__fadeIn');
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Portfolio Modal
const portfolioGrid = document.querySelector('.portfolio-grid');
const modal = document.getElementById('portfolioModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const closeModal = document.querySelector('.close');

portfolioGrid.addEventListener('click', (e) => {
    const portfolioItem = e.target.closest('.portfolio-item');
    if (portfolioItem) {
        const imgSrc = portfolioItem.querySelector('img').src;
        const title = portfolioItem.querySelector('h3').innerText;
        // Aquí puedes agregar una descripción dinámica según el proyecto
        let description = '';
        switch(title) {
            case 'Reforma de Cocina':
                description = 'Descripción detallada del proyecto de reforma de cocina...';
                break;
            case 'Renovación de Baño':
                description = 'Descripción detallada del proyecto de renovación de baño...';
                break;
            case 'Ampliación de Vivienda':
                description = 'Descripción detallada del proyecto de ampliación de vivienda...';
                break;
            default:
                description = 'Descripción del proyecto...';
        }
        modalImage.src = imgSrc;
        modalTitle.innerText = title;
        modalDescription.innerText = description;
        modal.style.display = 'block';
    }
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});

// Swiper.js Initialization
const swiper = new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
        delay: 7000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
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
        // Aquí puedes agregar la lógica para enviar el formulario, por ejemplo, usando fetch a un backend.
        // Por ahora, mostraremos una alerta y reiniciaremos el formulario.

        alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
        contactForm.reset();
    }
});

// Google Maps Initialization
function initMap() {
    const location = { lat: 39.5696, lng: 2.6502 }; // Coordenadas de Palma de Mallorca
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: location,
    });
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: '[Tu Empresa]',
    });
}
