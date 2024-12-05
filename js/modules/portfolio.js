import { BeforeAfter } from './before-after.js';

export class Portfolio {
    constructor() {
        // Referencias a elementos del DOM
        this.portfolioGrid = document.querySelector('.portfolio-grid');
        this.modal = document.getElementById('portfolioModal');
        this.projectViewer = this.modal.querySelector('.project-viewer');
        this.closeBtn = this.modal.querySelector('.close');
        
        // Inicializar eventos y funcionalidades
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Cerrar modal
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Inicializar items del portafolio
        this.initializePortfolioItems();

        // Manejar tecla ESC para cerrar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    initializePortfolioItems() {
        // Video Preview
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            const video = videoContainer.querySelector('video');
            const playButton = videoContainer.querySelector('.portfolio-icon');
            
            // Evento para reproducir video
            videoContainer.addEventListener('click', (e) => {
                e.preventDefault();
                this.openVideoModal(video);
            });

            // Optimización de carga de video
            video.addEventListener('loadeddata', () => {
                video.classList.add('loaded');
            });
        }

        // Before/After Images
        const beforeAfterContainers = document.querySelectorAll('.before-after-container');
        beforeAfterContainers.forEach(container => {
            const portfolioItem = container.closest('.portfolio-item');
            const overlay = portfolioItem.querySelector('.portfolio-overlay');
            
            overlay.addEventListener('click', () => {
                this.openBeforeAfterModal(container);
            });
        });

        // Inicializar comparadores de imágenes
        this.initializeBeforeAfter();
    }

    openVideoModal(video) {
        this.projectViewer.innerHTML = `
            <div class="modal-video-container">
                <video controls autoplay class="modal-video">
                    <source src="${video.querySelector('source').src}" type="${video.querySelector('source').type}">
                    Tu navegador no soporta videos HTML5.
                </video>
            </div>
        `;
        this.showModal();
    }

    openBeforeAfterModal(container) {
        const beforeImg = container.getAttribute('data-before');
        const afterImg = container.getAttribute('data-after');
        
        this.projectViewer.innerHTML = `
            <div class="modal-comparison-container">
                <div class="before-after-container" 
                     data-before="${beforeImg}" 
                     data-after="${afterImg}">
                </div>
            </div>
        `;
        
        this.showModal();
        new BeforeAfter(this.projectViewer.querySelector('.before-after-container'));
    }

    showModal() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Usar setTimeout para asegurar que la transición funcione
        requestAnimationFrame(() => {
            this.modal.classList.add('active');
        });
    }

    closeModal() {
        this.modal.classList.remove('active');
        
        // Esperar a que termine la animación antes de ocultar
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.projectViewer.innerHTML = '';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    initializeBeforeAfter() {
        const containers = document.querySelectorAll('.before-after-container');
        containers.forEach(container => {
            new BeforeAfter(container);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});