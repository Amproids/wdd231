import { showProductModal } from './modal.js';

// Global variable to store candle data
let candleData = [];

// Favorites functionality
class FavoritesManager {
  constructor() {
    this.favorites = this.loadFavorites();
  }

  // Load favorites from localStorage
  loadFavorites() {
    const stored = localStorage.getItem('artisanAromasFavorites');
    return stored ? JSON.parse(stored) : [];
  }

  // Save favorites to localStorage
  saveFavorites() {
    localStorage.setItem('artisanAromasFavorites', JSON.stringify(this.favorites));
  }

  // Add item to favorites
  addToFavorites(productName, productSize) {
    const favoriteId = `${productName}-${productSize}`;
    if (!this.favorites.includes(favoriteId)) {
      this.favorites.push(favoriteId);
      this.saveFavorites();
      this.updateFavoriteButtons();
      return true;
    }
    return false;
  }

  // Remove item from favorites
  removeFromFavorites(productName, productSize) {
    const favoriteId = `${productName}-${productSize}`;
    const index = this.favorites.indexOf(favoriteId);
    if (index > -1) {
      this.favorites.splice(index, 1);
      this.saveFavorites();
      this.updateFavoriteButtons();
      return true;
    }
    return false;
  }

  // Check if item is favorited
  isFavorite(productName, productSize) {
    const favoriteId = `${productName}-${productSize}`;
    return this.favorites.includes(favoriteId);
  }

  // Update all favorite buttons on the page
  updateFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(btn => {
      const productName = btn.dataset.productName;
      const productSize = btn.dataset.productSize;
      const isFav = this.isFavorite(productName, productSize);
      
      btn.innerHTML = isFav ? '❤️' : '🤍';
      btn.setAttribute('aria-label', isFav ? 'Remove from favorites' : 'Add to favorites');
      btn.classList.toggle('favorited', isFav);
    });
  }

  // Get favorites count
  getFavoritesCount() {
    return this.favorites.length;
  }
}

// Create global favorites manager
const favoritesManager = new FavoritesManager();

// Function to fetch candle data from JSON file
async function fetchCandleData() {
  try {
    const response = await fetch('data/catalog.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    candleData = await response.json();
    return candleData;
  } catch (error) {
    console.error('Error fetching candle data:', error);
    return [];
  }
}

// Function to create product card HTML
function createProductCard(product) {
  const stockStatus = product.inStock ? '' : 'out-of-stock';
  const stockLabel = product.inStock ? '' : '<span class="stock-label">Out of Stock</span>';
  const isFavorite = favoritesManager.isFavorite(product.name, product.size);
  
  return `
    <div class="product-card ${stockStatus}" data-product='${JSON.stringify(product)}'>
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${stockLabel}
        <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" 
                data-product-name="${product.name}" 
                data-product-size="${product.size}"
                aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
          ${isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-size">${product.size}</p>
        <p class="product-scents">${product.scents.join(', ')}</p>
        <p class="product-price">${product.price}</p>
        <div class="product-actions">
          <button class="add-to-cart" ${!product.inStock ? 'disabled' : ''}>
            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <button class="view-details">View Details</button>
        </div>
      </div>
    </div>
  `;
}

// Function to handle favorite button clicks
function handleFavoriteClick(e) {
  e.stopPropagation(); // Prevent card click
  
  const btn = e.target;
  const productName = btn.dataset.productName;
  const productSize = btn.dataset.productSize;
  
  if (favoritesManager.isFavorite(productName, productSize)) {
    favoritesManager.removeFromFavorites(productName, productSize);
    console.log(`Removed ${productName} (${productSize}) from favorites`);
  } else {
    favoritesManager.addToFavorites(productName, productSize);
    console.log(`Added ${productName} (${productSize}) to favorites`);
  }
}

// Function to load featured products
async function loadFeaturedProducts() {
  const productGrid = document.getElementById('product-grid');
  
  if (!productGrid) {
    console.error('Product grid element not found');
    return;
  }

  // Fetch data from JSON file
  await fetchCandleData();
  
  // Filter for featured products only
  const featuredProducts = candleData.filter(product => product.featured);
  
  // Generate HTML for featured products
  const productsHTML = featuredProducts.map(product => createProductCard(product)).join('');
  
  // Insert into the page
  productGrid.innerHTML = productsHTML;
  
  // Add click event listeners for product cards
  const productCards = productGrid.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Prevent button clicks from triggering card click
      if (e.target.classList.contains('add-to-cart') || 
          e.target.classList.contains('view-details') ||
          e.target.classList.contains('favorite-btn')) {
        return;
      }
      
      const productData = JSON.parse(card.dataset.product);
      showProductModal(productData);
    });
  });

  // Add event listeners for favorite buttons
  const favoriteButtons = productGrid.querySelectorAll('.favorite-btn');
  favoriteButtons.forEach(btn => {
    btn.addEventListener('click', handleFavoriteClick);
  });

  // Add event listeners for view details buttons
  const viewDetailsButtons = productGrid.querySelectorAll('.view-details');
  viewDetailsButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = e.target.closest('.product-card');
      const productData = JSON.parse(card.dataset.product);
      showProductModal(productData);
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadFeaturedProducts);

// Export favorites manager for use in other modules
export { favoritesManager };