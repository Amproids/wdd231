// Display form submission data from URL parameters
document.addEventListener('DOMContentLoaded', () => {
  displayFormData();
});

function displayFormData() {
  // Get data from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check if we have form data in the URL
  if (urlParams.has('firstName') || urlParams.has('email')) {
    // Create display container
    const container = document.querySelector('.thank-you-container');
    
    // Create data display section
    const dataDisplay = document.createElement('div');
    dataDisplay.className = 'submission-details';
    dataDisplay.innerHTML = `
      <h2>Submission Details</h2>
      <div class="form-data">
        <p><strong>Name:</strong> ${urlParams.get('firstName') || ''} ${urlParams.get('lastName') || ''}</p>
        <p><strong>Email:</strong> ${urlParams.get('email') || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${urlParams.get('phone') || 'Not provided'}</p>
        <p><strong>Inquiry Type:</strong> ${formatInquiryType(urlParams.get('inquiryType')) || 'Not specified'}</p>
        <p><strong>Subject:</strong> ${urlParams.get('subject') || 'Not provided'}</p>
        <p><strong>Message:</strong> ${urlParams.get('message') || 'Not provided'}</p>
        <p><strong>Newsletter Signup:</strong> ${urlParams.get('newsletter') ? 'Yes' : 'No'}</p>
        <p><strong>Submitted:</strong> ${formatTimestamp(urlParams.get('timestamp'))}</p>
      </div>
    `;
    
    // Insert before the back button
    const backButton = container.querySelector('.back-button');
    container.insertBefore(dataDisplay, backButton);
  }
}

function formatInquiryType(type) {
  switch(type) {
    case 'question': return 'Product Question';
    case 'testimonial': return 'Testimonial';
    case 'general': return 'General Inquiry';
    default: return type;
  }
}

function formatTimestamp(timestamp) {
  if (!timestamp) return 'Not available';
  
  const date = new Date(timestamp);
  return date.toLocaleString();
}