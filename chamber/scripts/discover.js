const discoverContainer = document.querySelector('#discover-container');

async function getLocations() {
    try {
        const response = await fetch('data/locations.json');
        const locationData = await response.json();
        displayLocations(locationData);
    }
    catch (error) {
        console.error('Error fetching locations:', error);
        discoverContainer.innerHTML = '<div class="error">Error loading locations. Please try again later.</div>';
    }
}

function displayLocations(locationData) {
    let locationHTML = '';
    locationData.attractions.forEach(location => {
        locationHTML += `
            <div class="location-card">
                <h2>${location.name}</h2>
                <figure>
                    <img src="images/${location.image}" alt="${location.name}" loading="lazy">
                </figure>
                <address>${location.address}</address>
                <p>${location.description}</p>
                <button>Learn More</button>
            </div>`;
    });
    discoverContainer.innerHTML = locationHTML;
}

// Visitor message functionality
function displayVisitorMessage() {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    let message = '';
    
    if (!lastVisit) {
        message = "Welcome! Let us know if you have any questions.";
    } else {
        const daysBetween = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
        if (daysBetween < 1) {
            message = "Back so soon! Awesome!";
        } else if (daysBetween === 1) {
            message = "You last visited 1 day ago.";
        } else {
            message = `You last visited ${daysBetween} days ago.`;
        }
    }
    const messageDiv = document.querySelector('#visitor-message');
    messageDiv.textContent = message;
    localStorage.setItem('lastVisit', now);
}

// Initialize
getLocations();
displayVisitorMessage();