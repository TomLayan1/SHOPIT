import { cart, removeFromCart, updateDeliveryOption } from '../cart.js';
import { shopitProduct, getProduct } from '../../../data/products.js';
import { formatCurrency } from '../../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from '../../../data/deliveryOption.js';
import { renderPaymentSummary } from './paymentSummary.js';

// Put all the codes in a function and re-run them by calling the function whenever changes are made.
export function renderOrderSummary() {
  // loop throught the cart, generating the checkout html, store the cart item usiing accumulator pattarn
  let cartSummaryHTML = '';

  cart.forEach((cartItem)=> {
    const productId = cartItem.productId;

    const matchingItem = getProduct(productId)


    // get the deliveryOptionId out of the cart 
    const deliveryOptionId = cartItem.deliveryOptionId;

    // Use the id to find the full delivery option
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `    <div class="main-item-container js-main-item-container-${matchingItem.id}">
            <h3 class="delivery-date">delivery date: ${dateString}</h3>
            <div class="date-img-name-container">
              <div class="product-img-container">
                <img class="item-img" src="${matchingItem.image}">
              </div>
              <div class="name-price-quantity">
                <div class="name-price-container">
                  <p class="item-name">${matchingItem.name}</p>
                  <p class="price">$${formatCurrency(matchingItem.priceCents)}</p>
                </div>
                <div class="quantity-container">
                  <button class="reduce-btn js-reduce-btn" data-product-id="${matchingItem.id}">-</button>
                  <p class="item-quantity js-item-quantity-${matchingItem.id}">${cartItem.quantity}</p>
                  <button class="add-btn js-add-btn" data-product-id="${matchingItem.id}">+</button>
                  <button class="delete-btn js-delete-btn" data-product-id="${matchingItem.id}">Delete</button>
                </div>
              </div>
              <div class="shipping-option-container">${deliveryOptionHTML(matchingItem, cartItem)}</div>
            </div>
          </div>`
  });

  function deliveryOptionHTML(matchingItem, cartItem) {
    let deliveryHTML = '';
    deliveryOptions.forEach((deliveryOption) =>{

      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString =  deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;
      
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
      
      deliveryHTML += `
        <div class="shipping-option js-shipping-option" data-product-id ="${matchingItem.id}" data-delivery-option-id="${deliveryOption.id}">
          <input class="select-term" type="radio" ${isChecked ? 'checked' : ''} name="delivery-option-${matchingItem.id}">
          <div class="term-container">
            <p class="shipping-date">${dateString}</p>
            <p class="term-fee">${priceString} Shipping</p>
          </div>
        </div>
      `
    });
    return deliveryHTML;
  }

  document.querySelector('.js-cart-items-displey').innerHTML = cartSummaryHTML;



  // add eventListers to the delivery options
  document.querySelectorAll('.js-shipping-option').forEach((optionElement) => {
    optionElement.addEventListener('click', () => {
      // get values out of data attribute
      const {productId, deliveryOptionId} = optionElement.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      // call the renderOrderSummary function to re-run the code when delivery options are selected
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  // making the delete button interactive
  let deleteBtn = document.querySelectorAll('.js-delete-btn');
  deleteBtn.forEach((deleteBtn)=> {
    deleteBtn.addEventListener('click', ()=> {
      const productId = deleteBtn.dataset.productId;

      removeFromCart(productId);

      const container = document.querySelector(`.js-main-item-container-${productId}`);
      container.remove();

      renderPaymentSummary();
    })
  })

  // for reducing and increasing cart quantity
  // for reduce button
  let reduceBtn = document.querySelectorAll('.js-reduce-btn');
  reduceBtn.forEach((reduceBtn)=>{
    reduceBtn.addEventListener('click', ()=>{
      const productId = reduceBtn.dataset.productId

      cart.forEach((cartItem)=>{
        let itemQuantity = document.querySelector(`.js-item-quantity-${productId}`);
        if(cartItem.productId === productId) {
          cartItem.quantity -= 1;
          itemQuantity.innerHTML = cartItem.quantity;

          if (cartItem.quantity < 1) {
            cartItem.quantity = 1;
            itemQuantity.innerHTML = cartItem.quantity;
          }
        }
      });

      renderPaymentSummary();
    });
  });

  // for add button
  let addBtn = document.querySelectorAll('.js-add-btn');
  addBtn.forEach((addBtn)=>{
    addBtn.addEventListener('click', ()=>{
      const productId = addBtn.dataset.productId
      cart.forEach((cartItem)=>{
        let itemQuantity = document.querySelector(`.js-item-quantity-${productId}`);
        if(cartItem.productId === productId) {
          cartItem.quantity += 1;
          itemQuantity.innerHTML = cartItem.quantity;

          if (cartItem.quantity > 10) {
            cartItem.quantity = 10;
            itemQuantity.innerHTML = cartItem.quantity;
          }
        }
      });

      renderPaymentSummary();
    });
  });
}