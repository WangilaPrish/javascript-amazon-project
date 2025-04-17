import { cart, addToCart } from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { calculateCartQuantity } from '../data/cart.js';

// Load product data and render UI
loadProducts(renderProductsGrid);

// Separate this function so it's globally accessible
export function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();

  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  }

  const checkoutCartQuantityElement = document.querySelector('.js-cart-count');
  if (checkoutCartQuantityElement) {
    checkoutCartQuantityElement.innerHTML = `${cartQuantity} item${cartQuantity !== 1 ? 's' : ''}`;
  }
}

function renderProductsGrid() {
  let productsHTML = '';

  products.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getSTarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count} 
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container-${product.id}">
          <select class="js-quantity-selector-${product.id}">
            ${[...Array(10)].map((_, i) => `<option value="${i+1}" ${i === 0 ? 'selected' : ''}>${i+1}</option>`).join('')}
          </select>
        </div>

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  const productGridElement = document.querySelector('.js-products-grid');
  if (productGridElement) {
    productGridElement.innerHTML = productsHTML;
  }

  // Add-to-cart event listeners
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;

      const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
      const selectedValue = quantitySelector.value;
      const quantity = Number(selectedValue);

      addToCart(productId, quantity);
      updateCartQuantity();

      const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
      addedMessage.classList.add('added-visible');

      let timeoutId;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        addedMessage.classList.remove('added-visible');
      }, 1000);
    });
  });

  updateCartQuantity(); // Call after grid is rendered
}
