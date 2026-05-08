document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const reason = document.getElementById('reason').value;
    const subject = document.getElementById('subject').value;
    const messageDiv = document.getElementById('formMessage');
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        messageDiv.textContent = 'Please enter a valid email address.';
        messageDiv.className = 'message error';
        messageDiv.classList.remove('hidden');
        return;
    }
    
    if (!subject.trim()) {
        messageDiv.textContent = 'Please write a message.';
        messageDiv.className = 'message error';
        messageDiv.classList.remove('hidden');
        return;
    }
    
    messageDiv.textContent = 'Feedback sent! We\'ll reply soon.';
    messageDiv.className = 'message success';
    messageDiv.classList.remove('hidden');
    
    this.reset();
});