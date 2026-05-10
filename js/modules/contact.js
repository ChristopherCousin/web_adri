export const initContact = () => {
    const contactForm = document.getElementById('contactForm');
    const recipientEmail = 'leoganinvest@gmail.com';

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Limpiar errores previos
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            msg.style.display = 'none';
        });

        // Obtener valores
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();

        let valid = validateForm(name, email, message);

        if(valid) {
            const subject = encodeURIComponent(`Solicitud de presupuesto de ${name}`);
            const body = encodeURIComponent(
                `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || 'No indicado'}\n\nMensaje:\n${message}`
            );

            window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
            contactForm.reset();
            // Cerrar el modal de contacto si está abierto
            const contactModal = document.getElementById('contactModal');
            if (contactModal.style.display === 'block') {
                contactModal.style.display = 'none';
                contactModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            }
        }
    });
};

function validateForm(name, email, message) {
    let valid = true;

    // Validación Nombre
    if(name === '') {
        showError('nameError', 'Por favor, ingresa tu nombre.');
        valid = false;
    }

    // Validación Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email === '') {
        showError('emailError', 'Por favor, ingresa tu correo electrónico.');
        valid = false;
    } else if(!emailPattern.test(email)) {
        showError('emailError', 'Por favor, ingresa un correo electrónico válido.');
        valid = false;
    }

    // Validación Mensaje
    if(message === '') {
        showError('messageError', 'Por favor, ingresa tu mensaje.');
        valid = false;
    }

    return valid;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.innerText = message;
    errorElement.style.display = 'block';
}