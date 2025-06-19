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
    
    // Update catalog display if favorites filter is active
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter && categoryFilter.value === 'favorites') {
      updateCatalog();
    }
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
  
  // Create badges
  let badges = '';
  if (product.featured) {
    badges += '<span class="product-badge featured-badge">Featured</span>';
  }
  if (product.seasonal) {
    badges += '<span class="product-badge seasonal-badge">Seasonal</span>';
  }
  if (product.limited) {
    badges += '<span class="product-badge limited-badge">Limited</span>';
  }
  
  return `
    <div class="product-card ${stockStatus}" data-product='${JSON.stringify(product)}'>
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${stockLabel}
        ${badges ? `<div class="product-badges">${badges}</div>` : ''}
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
        <button class="add-to-cart" ${!product.inStock ? 'disabled' : ''}>
          ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
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

// Function to populate category filter options
function populateCategoryFilter() {
  const categoryFilter = document.getElementById('category-filter');
  if (!categoryFilter) return;

  // Get unique categories based on product properties
  const categories = new Set();
  candleData.forEach(product => {
    if (product.featured) categories.add('featured');
    if (product.seasonal) categories.add('seasonal');
    if (product.limited) categories.add('limited');
    categories.add('regular'); // All products can be considered regular
  });

  // Add favorites option
  categories.add('favorites');

  // Add category options
  categories.forEach(category => {
    if (category !== 'regular') { // Skip regular since we have "All Products"
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      categoryFilter.appendChild(option);
    }
  });
}

// Function to filter products
function filterProducts(category) {
  if (category === 'all') {
    return candleData;
  }
  
  if (category === 'favorites') {
    // Filter products based on favorites in localStorage
    return candleData.filter(product => {
      return favoritesManager.isFavorite(product.name, product.size);
    });
  }
  
  return candleData.filter(product => {
    switch(category) {
      case 'featured':
        return product.featured;
      case 'seasonal':
        return product.seasonal;
      case 'limited':
        return product.limited;
      default:
        return true;
    }
  });
}

// Function to sort products
function sortProducts(products, sortBy) {
  const sortedProducts = [...products]; // Create a copy
  
  switch(sortBy) {
    case 'name':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case 'price-low':
      return sortedProducts.sort((a, b) => {
        const priceA = parseFloat(a.price.replace('$', ''));
        const priceB = parseFloat(b.price.replace('$', ''));
        return priceA - priceB;
      });
    case 'price-high':
      return sortedProducts.sort((a, b) => {
        const priceA = parseFloat(a.price.replace('$', ''));
        const priceB = parseFloat(b.price.replace('$', ''));
        return priceB - priceA;
      });
    default:
      return sortedProducts;
  }
}

// Function to display products
function displayProducts(products) {
  const catalogGrid = document.getElementById('catalog-grid');
  
  if (!catalogGrid) {
    console.error('Catalog grid element not found');
    return;
  }

  if (products.length === 0) {
    catalogGrid.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
    return;
  }

  // Generate HTML for products
  const productsHTML = products.map(product => createProductCard(product)).join('');
  
  // Insert into the page
  catalogGrid.innerHTML = productsHTML;
  
  // Add click event listeners for product cards
  const productCards = catalogGrid.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Prevent button clicks from triggering card click
      if (e.target.classList.contains('add-to-cart') || 
          e.target.classList.contains('favorite-btn')) {
        return;
      }
      
      const productData = JSON.parse(card.dataset.product);
      showProductModal(productData);
    });
  });

  // Add event listeners for favorite buttons
  const favoriteButtons = catalogGrid.querySelectorAll('.favorite-btn');
  favoriteButtons.forEach(btn => {
    btn.addEventListener('click', handleFavoriteClick);
  });
}

// Function to update catalog display
function updateCatalog() {
  const categoryFilter = document.getElementById('category-filter');
  const sortOptions = document.getElementById('sort-options');
  
  const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
  const selectedSort = sortOptions ? sortOptions.value : 'name';
  
  // Filter and sort products
  let filteredProducts = filterProducts(selectedCategory);
  let sortedProducts = sortProducts(filteredProducts, selectedSort);
  
  // Display products
  displayProducts(sortedProducts);
}

// Function to load catalog
async function loadCatalog() {
  const catalogGrid = document.getElementById('catalog-grid');
  
  if (!catalogGrid) {
    console.error('Catalog grid element not found');
    return;
  }

  // Show loading message
  catalogGrid.innerHTML = '<p>Loading products...</p>';

  // Fetch data from JSON file
  await fetchCandleData();
  
  if (candleData.length === 0) {
    catalogGrid.innerHTML = '<p>No products available at this time.</p>';
    return;
  }

  // Populate filter options
  populateCategoryFilter();
  
  // Display all products initially
  updateCatalog();
  
  // Add event listeners for filters
  const categoryFilter = document.getElementById('category-filter');
  const sortOptions = document.getElementById('sort-options');
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', updateCatalog);
  }
  
  if (sortOptions) {
    sortOptions.addEventListener('change', updateCatalog);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadCatalog);

// Export favorites manager for use in other modules
export { favoritesManager };