// Modal functionality for product details
class ProductModal {
  constructor() {
    this.modal = document.getElementById('product-modal');
    this.modalBody = document.getElementById('modal-body');
    this.closeButton = document.querySelector('.close-modal');
    
    this.init();
  }

  init() {
    if (!this.modal || !this.modalBody) {
      console.warn('Modal elements not found');
      return;
    }

    // Close modal when clicking the X button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.closeModal());
    }

    // Close modal when clicking outside the modal content
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.closeModal();
      }
    });
  }

  // Show product modal with product data
  showProduct(product) {
    if (!this.modal || !this.modalBody) {
      console.warn('Modal not available');
      return;
    }

    const stockStatus = product.inStock ? 'In Stock' : 'Out of Stock';
    const stockClass = product.inStock ? 'in-stock' : 'out-of-stock';
    
    // Create badges
    let badges = '';
    if (product.featured) {
      badges += '<span class="product-badge featured-badge">Featured</span>';
    }
    if (product.seasonal) {
      badges += '<span class="product-badge seasonal-badge">Seasonal</span>';
    }
    if (product.limited) {
      badges += '<span class="product-badge limited-badge">Limited Edition</span>';
    }

    this.modalBody.innerHTML = `
      <div class="modal-product">
        <div class="modal-product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-product-details">
          <h2>${product.name}</h2>
          <p class="modal-size">Size: ${product.size}</p>
          <p class="modal-price">${product.price}</p>
          
          <div class="modal-scents">
            <h3>Scent Notes:</h3>
            <ul>
              ${product.scents.map(scent => `<li>${scent}</li>`).join('')}
            </ul>
          </div>
          
          <div class="modal-status">
            <span class="stock-status ${stockClass}">${stockStatus}</span>
          </div>
          
          ${badges ? `<div class="modal-badges">${badges}</div>` : ''}
          
          <div class="modal-actions">
            <button class="add-to-cart-modal" ${!product.inStock ? 'disabled' : ''}>
              ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    `;

    this.openModal();
  }

  // Open the modal
  openModal() {
    if (this.modal) {
      this.modal.style.display = 'block';
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }

  // Close the modal
  closeModal() {
    if (this.modal) {
      this.modal.style.display = 'none';
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Restore scrolling
    }
  }

  // Check if modal is currently open
  isOpen() {
    return this.modal && this.modal.style.display === 'block';
  }
}

// Create global modal instance
let productModal;

// Initialize modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  productModal = new ProductModal();
});

// Function to show product modal (for external use)
function showProductModal(product) {
  if (productModal) {
    productModal.showProduct(product);
  } else {
    console.warn('Product modal not initialized');
  }
}

// Export for use in other modules
export { ProductModal, showProductModal };