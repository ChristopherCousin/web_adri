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