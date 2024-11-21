export class Portfolio {
    constructor() {
        this.portfolioData = [];
        this.modalSwiper = null;
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioGrid = document.getElementById('portfolioGrid');
        this.portfolioModal = document.getElementById('portfolioModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.getElementById('modalDescription');
        this.closePortfolioModal = this.portfolioModal.querySelector('.close');
    }

    init() {
        this.loadPortfolioData();
        this.initializeFilters();
        this.initializeModal();
    }

    loadPortfolioData() {
        fetch('portfolio.json')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                this.portfolioData = data;
                this.renderPortfolio(data);
            })
            .catch(error => console.error('Error loading portfolio:', error));
    }

    renderPortfolio(projects) {
        if (!projects || projects.length === 0) {
            this.portfolioGrid.innerHTML = `
                <div class="portfolio-error">
                    <p>No hay proyectos disponibles en este momento.</p>
                </div>`;
            return;
        }

        this.portfolioGrid.innerHTML = '';
        projects.forEach(project => {
            const portfolioItem = document.createElement('div');
            portfolioItem.classList.add('portfolio-item');
            portfolioItem.setAttribute('data-category', project.category);

            const imageSrc = project.image || project.videoThumbnail;
            if (!imageSrc) return;

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

            portfolioItem.addEventListener('click', () => this.showPortfolioModal(project));
            this.portfolioGrid.appendChild(portfolioItem);
        });
    }

    initializeFilters() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterButtons.forEach(button => button.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                const portfolioItems = document.querySelectorAll('.portfolio-item');

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
    }

    showPortfolioModal(project) {
        // Establecer título y descripción
        this.modalTitle.innerText = project.title;
        this.modalDescription.innerText = project.description || 'Descripción del proyecto...';

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
        this.portfolioModal.style.display = 'block';
        this.portfolioModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Inicializar Swiper
        if (this.modalSwiper) {
            this.modalSwiper.destroy();
        }
        
        this.modalSwiper = new Swiper('.portfolio-swiper', {
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

        // Añadir evento para reproducir video
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

    initializeModal() {
        // Cerrar Modal de Portfolio
        this.closePortfolioModal.addEventListener('click', () => this.closeModal());

        // Cerrar Modal al hacer clic fuera del contenido
        this.portfolioModal.addEventListener('click', (e) => {
            if (e.target === this.portfolioModal) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        this.portfolioModal.style.display = 'none';
        this.portfolioModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';

        if (this.modalSwiper) {
            this.modalSwiper.destroy();
            this.modalSwiper = null;
        }
    }
}