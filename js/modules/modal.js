export const initModals = () => {
    // Modal de Contacto
    const mainCTA = document.getElementById('mainCTA');
    const secondaryCTA = document.getElementById('secondaryCTA');
    const contactInfoCTA = document.getElementById('contactInfoCTA');
    const contactModal = document.getElementById('contactModal');
    const closeContactModal = contactModal.querySelector('.close');

    function openContactModal(e) {
        e.preventDefault();
        contactModal.style.display = 'block';
        contactModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    mainCTA.addEventListener('click', openContactModal);
    secondaryCTA.addEventListener('click', openContactModal);
    contactInfoCTA.addEventListener('click', openContactModal);

    // Cerrar Modal de Contacto
    closeContactModal.addEventListener('click', () => {
        contactModal.style.display = 'none';
        contactModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    });

    // Cerrar Modal de Contacto al hacer clic fuera del contenido
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.style.display = 'none';
            contactModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
    });
};