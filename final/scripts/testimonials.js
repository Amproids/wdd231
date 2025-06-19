// Global variable to store testimonials data
let testimonialsData = [];

// Function to fetch testimonials data from JSON file
async function fetchTestimonialsData() {
  try {
    const response = await fetch('data/testimonials.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    testimonialsData = await response.json();
    return testimonialsData;
  } catch (error) {
    console.error('Error fetching testimonials data:', error);
    return [];
  }
}

// Function to create testimonial card HTML
function createTestimonialCard(testimonial) {
  const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
  const verifiedBadge = testimonial.verified ? '<span class="verified-badge">✓ Verified Purchase</span>' : '';
  
  return `
    <div class="testimonial-card">
      <div class="testimonial-header">
        <div class="customer-info">
          <h4>${testimonial.name}</h4>
          <p class="location">${testimonial.location}</p>
        </div>
        <div class="rating">
          <span class="stars">${stars}</span>
        </div>
      </div>
      <div class="testimonial-body">
        <p class="review">"${testimonial.review}"</p>
        <p class="product-mention">Product: <strong>${testimonial.product}</strong></p>
        ${verifiedBadge}
      </div>
    </div>
  `;
}

// Function to load testimonials
async function loadTestimonials() {
  const testimonialsGrid = document.querySelector('.testimonial-grid');
  
  if (!testimonialsGrid) {
    console.error('Testimonials grid element not found');
    return;
  }

  // Fetch data from JSON file
  await fetchTestimonialsData();
  
  if (testimonialsData.length === 0) {
    testimonialsGrid.innerHTML = '<p>No testimonials available at this time.</p>';
    return;
  }

  // Generate HTML for testimonials
  const testimonialsHTML = testimonialsData.map(testimonial => createTestimonialCard(testimonial)).join('');
  
  // Insert into the page
  testimonialsGrid.innerHTML = testimonialsHTML;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadTestimonials);