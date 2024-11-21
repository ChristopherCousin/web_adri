export const initPreloader = () => {
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        preloader.style.display = 'none';
    });
};