import { calculateCartQuantity } from '../../data/cart.js';

export function renderCheckoutHeader() {
  const checkoutHeader = document.querySelector('.checkout-header-middle-section');

  const quantity = calculateCartQuantity();

  const checkoutHeaderHTML = `
    Checkout (<a class="return-to-home-link js-cart-count"
      href="amazon.html">${quantity} item${quantity !== 1 ? 's' : ''}</a>)
  `;

  checkoutHeader.innerHTML = checkoutHeaderHTML;
}
