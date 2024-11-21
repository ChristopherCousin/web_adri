export const initTestimonials = () => {
    const testimonialSwiper = new Swiper('.testimonials .swiper-container', {
        loop: true,
        autoplay: {
            delay: 7000,
            disableOnInteraction: false,
        }
    });
    
    return testimonialSwiper;
};