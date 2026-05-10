export const initPreloader = () => {
    const hidePreloader = () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
        }
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        hidePreloader();
    } else {
        document.addEventListener('DOMContentLoaded', hidePreloader, { once: true });
    }

    window.addEventListener('load', hidePreloader, { once: true });
    setTimeout(hidePreloader, 2500);
};