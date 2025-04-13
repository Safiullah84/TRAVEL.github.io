document.addEventListener('DOMContentLoaded', function() {
    // Form validation and submission
    const contactForm = document.querySelector('.form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form fields
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('massage').value.trim(); // Note: ID is still 'massage' to match HTML
            
            // Clear previous error messages
            clearErrors();
            
            let isValid = true;
            
            // Validate username
            if (username === '') {
                showError('username', 'Username is required');
                isValid = false;
            }
            
            // Validate email
            if (email === '') {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate phone
            if (phone === '') {
                showError('phone', 'Phone number is required');
                isValid = false;
            } else if (!isValidPhone(phone)) {
                showError('phone', 'Please enter a valid phone number');
                isValid = false;
            }
            
            // Validate message
            if (message === '') {
                showError('massage', 'Message is required');
                isValid = false;
            }
            
            // If form is valid, submit it
            if (isValid) {
                submitForm();
            }
        });
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Helper function to validate phone number format
    function isValidPhone(phone) {
        const re = /^[0-9]{10,15}$/;
        return re.test(phone);
    }
    
    // Function to show error messages
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        // Create error element if it doesn't exist
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-red';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        field.classList.add('error');
    }
    
    // Function to clear all error messages
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        const errorFields = document.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }
    
    // Function to submit the form
    function submitForm() {
        const form = document.querySelector('.form');
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.form-btn');
        
        // Disable submit button to prevent multiple submissions
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Send form data to Web3Forms
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Show success message
                showSuccessMessage('Your message has been sent successfully!');
                form.reset();
            } else {
                throw new Error(data.message || 'Form submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('form', 'There was an error submitting the form. Please try again.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        });
    }
    
    // Function to show success message
    function showSuccessMessage(message) {
        // Remove any existing success message
        const existingSuccess = document.querySelector('.success-message');
        if (existingSuccess) existingSuccess.remove();
        
        // Create and show new success message
        const successElement = document.createElement('div');
        successElement.className = 'success-message text-green';
        successElement.textContent = message;
        
        const form = document.querySelector('.form');
        form.insertBefore(successElement, form.firstChild);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successElement.remove();
        }, 5000);
    }
});