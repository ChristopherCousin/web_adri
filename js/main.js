import { initPreloader } from './modules/preloader.js';
import { initNavigation } from './modules/navigation.js';
import { Portfolio } from './modules/portfolio.js';
import { initTestimonials } from './modules/testimonials.js';
import { initContact } from './modules/contact.js';
import { initModals } from './modules/modal.js';
import { initBeforeAfter } from './modules/before-after.js';

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavigation();
    
    initTestimonials();
    initContact();
    initModals();
    initBeforeAfter();
    
    new Portfolio();
});

function initializeBeforeAfter() {
    const imageCompares = document.querySelectorAll('.image-compare');
    
    imageCompares.forEach(container => {
        const images = container.querySelectorAll('img');
        if (images.length !== 2) return;

        const beforeImage = images[0];
        const afterImage = images[1];
        const slider = container.querySelector('.slider-line');

        // Establecer posición inicial
        afterImage.style.clipPath = 'inset(0 50% 0 0)';
        
        // Función para mover el slider
        function moveSlider(e) {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            
            // Limitar el porcentaje entre 0 y 100
            const limitedPercent = Math.max(0, Math.min(100, percent));
            
            // Actualizar la posición del slider y la imagen
            slider.style.left = `${limitedPercent}%`;
            afterImage.style.clipPath = `inset(0 ${100 - limitedPercent}% 0 0)`;
        }

        // Eventos táctiles y de ratón
        container.addEventListener('mousemove', moveSlider);
        container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            moveSlider(e.touches[0]);
        });
    });
}