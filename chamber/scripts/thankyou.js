// Thank You Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters from the form submission
    const urlParams = new URLSearchParams(window.location.search);
    
    // Extract form data from URL parameters
    const formData = {
        firstName: urlParams.get('fname') || 'Not provided',
        lastName: urlParams.get('lname') || 'Not provided',
        email: urlParams.get('email') || 'Not provided',
        phone: urlParams.get('phone') || 'Not provided',
        businessName: urlParams.get('bname') || 'Not provided',
        timestamp: urlParams.get('timestamp') || 'Not provided'
    };
    
    // Display the form data
    displayFormData(formData);
});

function displayFormData(data) {
    // Display name (combine first and last name)
    const nameElement = document.getElementById('display-name');
    if (nameElement) {
        nameElement.textContent = `${data.firstName} ${data.lastName}`;
    }
    
    // Display email
    const emailElement = document.getElementById('display-email');
    if (emailElement) {
        emailElement.textContent = data.email;
    }
    
    // Display phone
    const phoneElement = document.getElementById('display-phone');
    if (phoneElement) {
        phoneElement.textContent = data.phone;
    }
    
    // Display business name
    const businessElement = document.getElementById('display-business');
    if (businessElement) {
        businessElement.textContent = data.businessName;
    }
    
    // Display formatted date
    const dateElement = document.getElementById('display-date');
    if (dateElement) {
        const formattedDate = formatTimestamp(data.timestamp);
        dateElement.textContent = formattedDate;
    }
}

function formatTimestamp(timestamp) {
    // Handle the timestamp formatting
    if (!timestamp || timestamp === 'Not provided') {
        return 'Not provided';
    }
    
    try {
        // Try to parse the ISO timestamp
        const date = new Date(timestamp);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }
        
        // Format the date for display
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        };
        
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.error('Error formatting timestamp:', error);
        return 'Invalid date format';
    }
}

// Handle cases where no form data is present
function checkForFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // If no parameters are found, show a message
    if (!urlParams.has('fname') && !urlParams.has('lname')) {
        const summaryContent = document.querySelector('.summary-content');
        if (summaryContent) {
            summaryContent.innerHTML = `
                <div class="no-data-message">
                    <p>No form data found. This page should be accessed after submitting the membership form.</p>
                    <a href="join.html" class="btn btn-primary">Return to Join Form</a>
                </div>
            `;
        }
    }
}

// Call the check function
checkForFormData();