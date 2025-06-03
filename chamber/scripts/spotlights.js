// Load and display member spotlights
async function loadSpotlights() {
    try {
        const response = await fetch('data/members.json');
        const members = await response.json();
        
        // Filter for gold (3) and silver (2) members only
        const qualifiedMembers = members.filter(member => 
            member.membershipLevel === 2 || member.membershipLevel === 3
        );
        
        // Randomly select 2-3 members
        const selectedMembers = getRandomMembers(qualifiedMembers, 3);
        
        displaySpotlights(selectedMembers);
        
    } catch (error) {
        console.error('Error loading member data:', error);
        document.getElementById('spotlight-container').innerHTML = 
            '<p class="error">Unable to load member spotlights</p>';
    }
}

// Get random members from the qualified list
function getRandomMembers(members, count) {
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, members.length));
}

// Display spotlight cards
function displaySpotlights(members) {
    const container = document.getElementById('spotlight-container');
    
    if (!container) return;
    
    container.innerHTML = members.map(member => `
        <div class="spotlight-card">
            <img src="${member.image}" alt="${member.name} logo" class="spotlight-logo">
            <h3>${member.name}</h3>
            <span class="membership-level ${getMembershipClass(member.membershipLevel)}">
                ${getMembershipName(member.membershipLevel)} Member
            </span>
            <div class="contact-info">
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><a href="${member.website}" target="_blank" class="website-link">Visit Website</a></p>
            </div>
        </div>
    `).join('');
}

// Get membership level name
function getMembershipName(level) {
    return level === 3 ? 'Gold' : 'Silver';
}

// Get CSS class for membership level
function getMembershipClass(level) {
    return level === 3 ? 'gold' : 'silver';
}

// Initialize spotlights when page loads
document.addEventListener('DOMContentLoaded', loadSpotlights);