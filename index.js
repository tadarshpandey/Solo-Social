document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#container-form form');
    const modal = document.getElementById('status-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');

    // Helper to show modal
    const showModal = (type, title, message) => {
        if (type === 'success') {
            modalIcon.textContent = '🎉';
            modalTitle.textContent = title || 'Success!';
            modalTitle.style.color = '#a8ffb2';
            modalOkBtn.style.background = '#28a745';
            modalOkBtn.textContent = 'Awesome';
        } else {
            modalIcon.textContent = '❌';
            modalTitle.textContent = title || 'Oops!';
            modalTitle.style.color = '#ff8484';
            modalOkBtn.style.background = '#dc3545';
            modalOkBtn.textContent = 'Try Again';
        }
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
    };

    // Helper to hide modal
    const hideModal = () => {
        modal.classList.add('hidden');
    };

    // Modal event listeners
    modalCloseBtn.addEventListener('click', hideModal);
    modalOkBtn.addEventListener('click', hideModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Form submit event handler
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Collect form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            partner: document.getElementById('partner').value,
            age: document.getElementById('age').value,
            duration: document.getElementById('duration').value,
            date: document.getElementById('date').value,
            day: document.getElementById('day').value,
            notes: document.getElementById('notes').value.trim()
        };

        // Client-side validation fallback
        if (!formData.name || !formData.phone) {
            showModal('error', 'Validation Error', 'Please fill in the required fields (Full Name and Contact Number).');
            return;
        }

        try {
            // Disable submit button during fetch
            const submitBtn = form.querySelector('input[type="submit"]');
            const originalBtnValue = submitBtn.value;
            submitBtn.value = 'Registering...';
            submitBtn.disabled = true;

            // Determine backend URL dynamically:
            // - If running on a local live server/file protocol (not the express server itself), target the local express port.
            // - Otherwise, use relative path which works both on the local express server and in production.
            const isLocalLiveServer = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
                && (window.location.port !== '3000' && window.location.port !== '5000' && window.location.port !== '');
            const backendUrl = isLocalLiveServer 
                ? 'http://127.0.0.1:3000/api/register' 
                : '/api/register';
            
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            // Enable button back
            submitBtn.value = originalBtnValue;
            submitBtn.disabled = false;

            if (response.ok && result.success) {
                showModal('success', 'Booking Confirmed!', result.message);
                form.reset();
            } else {
                showModal('error', 'Registration Failed', result.message || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            // Fallback in case of network issues (e.g. server is down)
            showModal('error', 'Connection Error', 'Could not connect to the local server. Please make sure the backend server is running.');
            
            // Re-enable button
            const submitBtn = form.querySelector('input[type="submit"]');
            submitBtn.value = 'Register';
            submitBtn.disabled = false;
        }
    });

    // Make "Choose yours" hero button scroll smoothly to form
    const heroBtn = document.querySelector('#container-head button');
    if (heroBtn) {
        heroBtn.addEventListener('click', () => {
            const formSection = document.getElementById('container-form');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
