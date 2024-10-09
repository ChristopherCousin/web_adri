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
const portfolioGrid = document.getElementById('portfolioGrid');
const portfolioModal = document.getElementById('portfolioModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const closeModal = document.querySelector('.close');

// Cargar Portafolio desde JSON
fetch('portfolio.json')
    .then(response => response.json())
    .then(data => {
        renderPortfolio(data);
    })
    .catch(error => console.error('Error cargando el portafolio:', error));

// Función para renderizar el portafolio
function renderPortfolio(projects) {
    projects.forEach(project => {
        const portfolioItem = document.createElement('div');
        portfolioItem.classList.add('portfolio-item');
        portfolioItem.setAttribute('data-category', project.category);

        portfolioItem.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
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

// Portfolio Modal
portfolioGrid.addEventListener('click', (e) => {
    const portfolioItem = e.target.closest('.portfolio-item');
    if (portfolioItem) {
        const imgSrc = portfolioItem.querySelector('img').src;
        const title = portfolioItem.querySelector('h3').innerText;
        const projects = JSON.parse(localStorage.getItem('portfolioData')) || [];

        const project = projects.find(p => p.title === title);

        if (project) {
            modalImage.src = project.afterImage || imgSrc;
            modalTitle.innerText = project.title;
            modalDescription.innerText = project.description || 'Descripción del proyecto.';
            portfolioModal.style.display = 'block';
        }
    }
});

closeModal.addEventListener('click', () => {
    portfolioModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target == portfolioModal) {
        portfolioModal.style.display = 'none';
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
        // Lógica para enviar el formulario
        alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
        contactForm.reset();
    }
}
);
