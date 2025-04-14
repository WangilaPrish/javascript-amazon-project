import {cart, removeFromCart, calculateCartQuantity, saveToStorage, updateDeliveryOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { updateCartQuantity } from '../amazon.js';
import  dayjs  from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions, getDeliveryOption, calculateDeliveryDate} from '../../data/deliveryOptions.js';
import { renderPaymentSummary} from './paymentSummary.js'
import { renderCheckoutHeader } from './checkoutHeader.js';
import isWeekend from '../../data/deliveryOptions.js';


export function renderOrderSummary(){

let cartSummaryHTML = '';

cart.forEach((cartItem)=> {
    const productId = cartItem.productId;

   const matchingProduct = getProduct(productId);
    const deliveryOptionId = cartItem.deliveryOptionId;
    
const dateString = calculateDeliveryDate(deliveryOptionId);

cartSummaryHTML += `
<div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
    `;
});

function getDeliveryDateSkippingWeekends(deliveryDays) {
  let date = dayjs();
  let remainingDays = deliveryDays;

  while (remainingDays > 0) {
    date = date.add(1, 'day');
    if (!isWeekend(date)) {
      remainingDays--;
    }
  }

  return date;
}

function deliveryOptionsHTML(matchingProduct, cartItem){
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = getDeliveryDateSkippingWeekends(deliveryOption.deliveryDays);

    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryOption.priceCents === 0
    ? 'FREE Shipping'
    : `$${formatCurrency(deliveryOption.priceCents)} - `;
  const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

  html += `
      <div class="delivery-option js-delivery-option"
      data-product-id ="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
                  <input type="radio"
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      ${priceString} Shipping
                    </div>
                  </div>
                </div>
      `
  });

  return html;
};

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML

updateCartQuantity();

document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);
    renderOrderSummary(); // Refresh the order summary
    renderPaymentSummary(); 
    
  });
});
document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    console.log('Update clicked for:', productId);

    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    
    // Replace the quantity span with an input field + save button
    const quantityLabel = container.querySelector('.quantity-label');
    const currentQuantity = quantityLabel.innerText;

    quantityLabel.parentElement.innerHTML = `
      Quantity: 
      <input class="js-update-input" data-product-id="${productId}" type="number" value="${currentQuantity}" min="1" style="width: 40px; margin-left: 4px;">
      <button class="js-save-button link-primary" data-product-id="${productId}">Save</button>
    `;

    // Add click listener to Save button
    container.querySelector('.js-save-button').addEventListener('click', () => {
      const newQuantity = Number(container.querySelector('.js-update-input').value);
      
      // Update cart
      const matchingItem = cart.find((item) => item.productId === productId);
      if (matchingItem) {
        matchingItem.quantity = newQuantity;
        saveToStorage(); // if not already exposed, export this in cart.js
        updateCartQuantity();

        // Refresh the page or just the quantity display
        location.reload(); // simple for now
      }
    });
  });
});

document.querySelectorAll('.js-delivery-option').forEach((element) => {
  element.addEventListener('click', () => {
    const {productId, deliveryOptionId} = element.dataset;
    updateDeliveryOption(productId, deliveryOptionId);
    renderOrderSummary();
    renderPaymentSummary();
    renderCheckoutHeader();
  });
});
}
