export const initTestimonials = () => {
    const testimonialsSlider = document.querySelector('.testimonials .swiper-container');
    if (!testimonialsSlider || typeof Swiper === 'undefined') {
        return null;
    }

    const testimonialSwiper = new Swiper('.testimonials .swiper-container', {
        loop: true,
        autoplay: {
            delay: 7000,
            disableOnInteraction: false,
        }
    });
    
    return testimonialSwiper;
};