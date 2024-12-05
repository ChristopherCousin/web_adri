import { BeforeAfter } from './before-after.js';

export class Portfolio {
    constructor() {
        this.initializeImageCompare();
        this.initializeVideo();
    }

    initializeImageCompare() {
        const comparers = document.querySelectorAll('.image-compare');
        
        comparers.forEach(comparer => {
            const slider = comparer.querySelector('.slider-line');
            const afterImage = comparer.querySelector('.after-image');
            let isDown = false;

            const moveSlider = (e) => {
                if (!isDown) return;
                
                const rect = comparer.getBoundingClientRect();
                let x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                x = x - rect.left;
                const position = Math.max(0, Math.min(x / rect.width * 100, 100));
                
                slider.style.left = `${position}%`;
                afterImage.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
            };

            // Mouse events
            slider.addEventListener('mousedown', () => isDown = true);
            window.addEventListener('mouseup', () => isDown = false);
            window.addEventListener('mousemove', moveSlider);

            // Touch events
            slider.addEventListener('touchstart', (e) => {
                isDown = true;
                moveSlider(e);
            });
            window.addEventListener('touchend', () => isDown = false);
            window.addEventListener('touchmove', moveSlider);

            // Set initial position
            slider.style.left = '50%';
            afterImage.style.clipPath = 'inset(0 50% 0 0)';
        });
    }

    initializeVideo() {
        const videoContainer = document.querySelector('.video-container');
        if (!videoContainer) return;

        const video = videoContainer.querySelector('.portfolio-video');
        const overlay = videoContainer.querySelector('.video-overlay');
        const playButton = overlay.querySelector('.play-button');

        const playVideo = () => {
            video.play();
            videoContainer.classList.add('playing');
        };

        const resetVideo = () => {
            videoContainer.classList.remove('playing');
        };

        playButton.addEventListener('click', playVideo);
        overlay.addEventListener('click', playVideo);

        video.addEventListener('pause', resetVideo);
        video.addEventListener('ended', resetVideo);

        // Optimización para móviles
        video.addEventListener('loadedmetadata', () => {
            video.setAttribute('playsinline', '');
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});