(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = form.querySelector('#form-status');
  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const message = form.querySelector('#message');

  // Utility to create or get an inline error container after a field
  function getErrorEl(input) {
    let el = input.nextElementSibling;
    if (!el || !el.classList || !el.classList.contains('field-error')) {
      el = document.createElement('p');
      el.className = 'field-error mt-2 text-red-500 text-sm';
      input.insertAdjacentElement('afterend', el);
    }
    return el;
  }

  function clearError(input) {
    input.setAttribute('aria-invalid', 'false');
    input.classList.remove('border-red-500');
    const el = input.nextElementSibling;
    if (el && el.classList && el.classList.contains('field-error')) {
      el.textContent = '';
    }
  }

  function setError(input, msg) {
    input.setAttribute('aria-invalid', 'true');
    input.classList.add('border-red-500');
    const el = getErrorEl(input);
    el.textContent = msg;
  }

  function validate() {
    let valid = true;
    clearError(name); clearError(email); clearError(message);

    const nameVal = name.value.trim();
    const emailVal = email.value.trim();
    const msgVal = message.value.trim();

    if (nameVal.length < 2) {
      setError(name, 'Please enter your full name (at least 2 characters).');
      valid = false;
    }

    // Basic email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailVal)) {
      setError(email, 'Please enter a valid email address.');
      valid = false;
    }

    if (msgVal.length < 10) {
      setError(message, 'Please enter a message (at least 10 characters).');
      valid = false;
    }

    return valid;
  }

  function updateStatus(type, text) {
    if (!status) return;
    status.classList.remove('sr-only');
    status.classList.remove('text-green-400', 'text-red-400');
    status.classList.remove('text-green-500', 'text-red-500');
    status.classList.add(type === 'success' ? 'text-green-500' : 'text-red-500');
    status.textContent = text;
  }

  // Real-time validation on blur
  [name, email, message].forEach((input) => {
    input.addEventListener('input', () => {
      clearError(input);
    });
    input.addEventListener('blur', () => {
      validate();
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate()) {
      updateStatus('error', 'Please fix the errors above and try again.');
      return;
    }

    updateStatus('success', 'Sending your message...');

    try {
      const formData = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'text/plain',
        },
      });

      const text = await res.text();
      if (res.ok) {
        // Heuristic: PHP echoes plain success text; check for the word 'success'
        const isSuccess = /success/i.test(text);
        if (isSuccess) {
          updateStatus('success', 'Your message was sent successfully. Thank you!');
          form.reset();
          clearError(name); clearError(email); clearError(message);
        } else {
          updateStatus('error', text || 'Something went wrong. Please try again later.');
        }
      } else {
        updateStatus('error', text || 'Failed to send the message. Please try again later.');
      }
    } catch (err) {
      updateStatus('error', 'Network error. Please check your connection and try again.');
    }
  });
})();
