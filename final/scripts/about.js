// Contact form functionality
class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.timestampField = document.getElementById('timestamp');
    
    this.init();
  }

  init() {
    if (!this.form) {
      console.warn('Contact form not found');
      return;
    }

    // Set timestamp when page loads
    this.setTimestamp();

    // Handle form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  // Set current timestamp
  setTimestamp() {
    if (this.timestampField) {
      const now = new Date();
      this.timestampField.value = now.toISOString();
    }
  }

  // Handle form submission
  handleSubmit(e) {
    // Update timestamp right before submission
    this.setTimestamp();
    
    // Store form data in localStorage
    const formData = new FormData(this.form);
    const formObject = {};
    
    for (let [key, value] of formData.entries()) {
      formObject[key] = value;
    }
    
    // Store in localStorage
    localStorage.setItem('contactFormSubmission', JSON.stringify(formObject));
    
    // Form will naturally submit to form-response.html via the action attribute
    // No need to prevent default since we want the normal form submission
  }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ContactForm();
});