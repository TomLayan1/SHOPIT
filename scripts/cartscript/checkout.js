import { cart } from './cart.js';
import { shopitProduct } from '../../data/products.js';

// loop throught the cart, generating the checkout html, store the cart item usiing accumulator pattarn
let cartSummaryHTML = '';

cart.forEach((cartItem)=> {
  const productId = cartItem.productId;

  let matchingItem;
  shopitProduct.forEach((product)=> {
    if(product.id === productId) {
      matchingItem = product;
    }
  });

  console.log(matchingItem);


  cartSummaryHTML += `    <div class="main-item-container">
          <h3 class="delivery-date">delivery date: Wednesday, September 6</h3>
          <div class="date-img-name-container">
            <div class="product-img-container">
              <img class="item-img" src="${matchingItem.image}">
            </div>
            <div class="name-price-quantity">
              <div class="name-price-container">
                <p class="item-name">${matchingItem.name}</p>
                <p class="price">$${(matchingItem.priceCents/100).toFixed(2)}</p>
              </div>
              <div class="quantity-container">
                <button class="reduce-btn js-reduce-btn" data-product-id="${matchingItem.id}">-</button>
                <p class="item-quantity js-item-quantity-${matchingItem.id}">${cartItem.quantity}</p>
                <button class="add-btn js-add-btn" data-product-id="${matchingItem.id}">+</button>
                <button class="delete-btn" data-product-id="${matchingItem.id}">Delete</button>
              </div>
            </div>
            <div class="shipping-option-container">
              <div class="shipping-option">
                <input class="select-term" type="radio">
                <div class="term-container">
                  <p class="shipping-date">Thursday, September 14</p>
                  <p class="term-fee">FREE Shipping</p>
                </div>
              </div>
              <div class="shipping-option">
                <input class="select-term" type="radio">
                <div class="term-container">
                  <p class="shipping-date">Friday, September 8</p>
                  <p class="term-fee">$4.99 - Shipping</p>
                </div>
              </div>
              <div class="shipping-option">
                <input class="select-term" type="radio">
                <div class="term-container">
                  <p class="shipping-date">Wednesday, September 6</p>
                  <p class="term-fee">$9.99 - Shipping</p>
                </div>
              </div>
            </div>
          </div>
        </div>`
});

document.querySelector('.js-cart-items-displey').innerHTML = cartSummaryHTML;

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
    })
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
    })
  });
});