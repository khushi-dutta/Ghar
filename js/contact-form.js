(function() {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
})();

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            first_name: document.getElementById('first-name').value,
            last_name: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        if (!validateForm(formData)) {
            return;
        }

        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, {
            from_name: `${formData.first_name} ${formData.last_name}`,
            from_email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            message: formData.message,
            to_name: 'Ghar Support Team'
        })
        .then(function(response) {
            console.log('Main email sent successfully!', response.status, response.text);

            return emailjs.send(EMAILJS_CONFIG.SERVICE_ID, 'template_auto_reply', {
                to_email: formData.email,
                first_name: formData.first_name,
                message: formData.message
            });
        })
        .then(function(response) {
            console.log('Auto-reply sent successfully!', response.status, response.text);
            showSuccessMessage();
            contactForm.reset();
        })
        .catch(function(error) {
            console.log('FAILED...', error);
            showErrorMessage();
        })
        .finally(function() {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    });

    function validateForm(data) {
        if (!data.first_name.trim()) {
            showValidationError('Please enter your first name');
            return false;
        }
        if (!data.last_name.trim()) {
            showValidationError('Please enter your last name');
            return false;
        }
        if (!data.email.trim()) {
            showValidationError('Please enter your email address');
            return false;
        }
        if (!isValidEmail(data.email)) {
            showValidationError('Please enter a valid email address');
            return false;
        }
        if (!data.message.trim()) {
            showValidationError('Please enter your message');
            return false;
        }
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showSuccessMessage() {
        const alertDiv = createAlertDiv('success', 
            'Thank you for your message! We\'ll get back to you within 24 hours.');
        insertAlert(alertDiv);
    }

    function showErrorMessage() {
        const alertDiv = createAlertDiv('error', 
            'Sorry, there was an error sending your message. Please try again or email us directly at ghar@gmail.com');
        insertAlert(alertDiv);
    }

    function showValidationError(message) {
        const alertDiv = createAlertDiv('warning', message);
        insertAlert(alertDiv);
    }

    function createAlertDiv(type, message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `contact-alert contact-alert-${type}`;
        alertDiv.innerHTML = `
            <span class="alert-icon">${getAlertIcon(type)}</span>
            <span class="alert-message">${message}</span>
            <button type="button" class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;
        return alertDiv;
    }

    function getAlertIcon(type) {
        switch(type) {
            case 'success': return '✓';
            case 'error': return '✗';
            case 'warning': return '⚠';
            default: return 'ℹ';
        }
    }

    function insertAlert(alertDiv) {
        const existingAlerts = contactForm.querySelectorAll('.contact-alert');
        existingAlerts.forEach(alert => alert.remove());

        contactForm.parentNode.insertBefore(alertDiv, contactForm);

        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);

        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
