import { BeforeAfter } from './before-after.js';

export class Portfolio {
    constructor() {
        this.portfolioGrid = document.querySelector('.portfolio-grid');
        this.modal = document.getElementById('portfolioModal');
        this.projectViewer = this.modal.querySelector('.project-viewer');
        this.closeBtn = this.modal.querySelector('.close');
        
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
    }

    initializePortfolioItems() {
        // Video Preview
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            const video = videoContainer.querySelector('video');
            const playButton = videoContainer.querySelector('.portfolio-icon');
            
            playButton.addEventListener('click', (e) => {
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
            <video controls autoplay class="modal-video">
                <source src="${video.querySelector('source').src}" type="${video.querySelector('source').type}">
                Tu navegador no soporta videos HTML5.
            </video>
        `;
        this.showModal();
    }

    openBeforeAfterModal(container) {
        const beforeImg = container.getAttribute('data-before');
        const afterImg = container.getAttribute('data-after');
        
        this.projectViewer.innerHTML = `
            <div class="before-after-container" 
                 data-before="${beforeImg}" 
                 data-after="${afterImg}">
            </div>
        `;
        
        this.showModal();
        new BeforeAfter(this.projectViewer.querySelector('.before-after-container'));
    }

    showModal() {
        this.modal.style.display = 'block';
        setTimeout(() => {
            this.modal.classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.projectViewer.innerHTML = '';
        }, 300);
        document.body.style.overflow = 'auto';
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