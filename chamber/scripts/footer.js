document.addEventListener('DOMContentLoaded', function() {
    // Set copyright year
    const copyrightElement = document.querySelector('#copyright');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.textContent = `© ${currentYear} Mapleton Chamber of Commerce`;
    }
    
    // Set last modified date
    const lastModifiedElement = document.querySelector('#lastModified');
    if (lastModifiedElement) {
        const lastModified = new Date(document.lastModified);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const formattedDate = lastModified.toLocaleDateString('en-US', options);
        lastModifiedElement.textContent = `Last Updated: ${formattedDate}`;
    }
});