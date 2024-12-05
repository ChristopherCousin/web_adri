export class BeforeAfter {
    constructor(container) {
        this.container = container;
        this.beforeImage = container.getAttribute('data-before');
        this.afterImage = container.getAttribute('data-after');
        this.isDown = false;
        this.position = 50;

        this.init();
    }

    init() {
        // Limpiar el contenedor
        this.container.innerHTML = '';
        
        // Crear estructura HTML
        this.container.innerHTML = `
            <div class="comparison-images">
                <img src="${this.beforeImage}" alt="Antes" class="before-image">
                <div class="after-image-container">
                    <img src="${this.afterImage}" alt="Después" class="after-image">
                </div>
                <div class="slider-handle">
                    <div class="slider-line"></div>
                    <div class="slider-button">
                        <i class="fas fa-chevron-left"></i>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </div>
            </div>
        `;

        // Referencias a elementos
        this.sliderHandle = this.container.querySelector('.slider-handle');
        this.afterImageContainer = this.container.querySelector('.after-image-container');

        // Establecer posición inicial
        this.updatePosition(this.position);

        // Event listeners
        this.container.addEventListener('mousedown', this.startSliding.bind(this));
        this.container.addEventListener('mousemove', this.slide.bind(this));
        this.container.addEventListener('mouseup', this.stopSliding.bind(this));
        this.container.addEventListener('mouseleave', this.stopSliding.bind(this));

        // Soporte táctil
        this.container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startSliding(e.touches[0]);
        });
        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.slide(e.touches[0]);
        });
        this.container.addEventListener('touchend', this.stopSliding.bind(this));
    }

    startSliding(e) {
        this.isDown = true;
        this.container.classList.add('sliding');
    }

    stopSliding() {
        this.isDown = false;
        this.container.classList.remove('sliding');
    }

    slide(e) {
        if (!this.isDown) return;

        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        this.position = Math.max(0, Math.min(x / rect.width * 100, 100));
        this.updatePosition(this.position);
    }

    updatePosition(position) {
        this.sliderHandle.style.left = `${position}%`;
        this.afterImageContainer.style.width = `${position}%`;
    }
}

// Inicializar todos los comparadores de la página
export function initBeforeAfter() {
    const containers = document.querySelectorAll('.before-after-container');
    containers.forEach(container => {
        new BeforeAfter(container);
    });
}