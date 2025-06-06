const membersContainer = document.querySelector('#members-container');
const gridViewBtn = document.querySelector('#grid-view');
const listViewBtn = document.querySelector('#list-view');

let currentView = 'grid';

// Reserve space immediately to prevent CLS
function initializeContainer() {

    membersContainer.style.minHeight = '600px';

    membersContainer.innerHTML = `
        <div class="loading-container">
            <div class="loading-skeleton">
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
            </div>
        </div>
    `;
}

async function getMembers() {
    try {
        // Initialize container with reserved space first
        initializeContainer();
        
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Small delay to ensure smooth transition
        setTimeout(() => {
            displayMembers(data);
        }, 100);
        
    } catch (error) {
        console.error('Error fetching member data:', error);
        membersContainer.innerHTML = '<div class="error">Error loading member data. Please try again later.</div>';
    }
}

function displayMembers(data) {
    if (!data || data.length === 0) {
        membersContainer.innerHTML = '<div class="empty">No members found.</div>';
        return;
    }
    
    // Clear container and reset min-height to auto
    membersContainer.innerHTML = '';
    membersContainer.style.minHeight = 'auto';
    
    data.forEach((member) => {
        const memberCard = document.createElement('div');
        memberCard.classList.add('member-card');
        memberCard.innerHTML = `
            <div class="membership-level ${getMembershipLevelText(member.membershipLevel)}">
                ${getMembershipLevelText(member.membershipLevel)}
            </div>
            <h3>${member.name}</h3>
            <div class="card-contact-info">
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
            </div>
            <div class="category"><strong>Category:</strong> ${member.category}</div>
            <div class="description">${member.description}</div>
        `;
        membersContainer.appendChild(memberCard);
    })
}

function getMembershipLevelText(level) {
    switch(level) {
        case 1: return 'member';
        case 2: return 'silver';
        case 3: return 'gold';
        default: return 'member';
    }
}

gridViewBtn.addEventListener('click', () => {
    membersContainer.classList.remove('list-view');
    membersContainer.classList.add('grid-view');
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    currentView = 'grid';
});

listViewBtn.addEventListener('click', () => {
    membersContainer.classList.remove('grid-view');
    membersContainer.classList.add('list-view');
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    currentView = 'list';
});

// Event listener for changing view size
window.addEventListener('resize', (event) => {
    if (window.innerWidth < 769 && currentView === 'list') {
        membersContainer.classList.remove('list-view');
        membersContainer.classList.add('grid-view');
        listViewBtn.classList.remove('active');
        gridViewBtn.classList.add('active');
        currentView = 'grid';
    }
})

// Initialize on page load
getMembers();