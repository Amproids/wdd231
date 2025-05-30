const membersContainer = document.querySelector('#members-container');
const gridViewBtn = document.querySelector('#grid-view');
const listViewBtn = document.querySelector('#list-view');

let currentView = 'grid';

async function getMembers() {
    try {
        membersContainer.innerHTML = '<h1>Loading members...</h1>';
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        displayMembers(data);
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
    membersContainer.innerHTML = '';
    data.forEach((member) => {
        const memberCard = document.createElement('div');
        memberCard.classList.add('member-card');
        memberCard.innerHTML = `
            <div class="membership-level ${getMembershipLevelText(member.membershipLevel)}">
                ${getMembershipLevelText(member.membershipLevel)}
            </div>
            <img src="${member.image}" alt="${member.name}">
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
    currentView = 'grid';
});

listViewBtn.addEventListener('click', () => {
    membersContainer.classList.remove('grid-view');
    membersContainer.classList.add('list-view');
    currentView = 'list';
});

//event listener for changing view size
window.addEventListener('resize', (event) => {
    if (window.innerWidth < 769 && currentView === 'list') {
        membersContainer.classList.remove('list-view');
        membersContainer.classList.add('grid-view');
        currentView = 'grid';
    }
})

getMembers();