import {shopitProduct} from '../../data/products.js';
import {deliveryOptions} from '../../data/deliveryOption.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

// export cart variable with the use of module
export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart){
  cart = [];
}

function saveToCart(){
  localStorage.setItem('cart', JSON.stringify(cart));
};
// export addToCart function with the use of module
export function addToCart(productId) {

// to checked if items in the cart are the same
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  // to get the value of the quantity selector
  const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
  const quantity = Number(quantitySelector.value);
  
// to add product to the cart
  if(matchingItem){
    matchingItem.quantity += quantity;
  }
  else{
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: '1'
    });
    saveToCart();
  }
}

// loop throught the cart, generating the checkout html, store the cart item usiing accumulator pattarn
let cartSummaryHTML = '';

cart.forEach((cartItem) =>{
  // save the IDs in the cart array in a variable to match them with IDs of the products array to get other details about the items in the cart
  const cartId = cartItem.productId;

  // declare a variable without a value to save matching IDs
  let matchingItem;

  // loop through the product to check for IDs that match to get their details
  shopitProduct.forEach((product) =>{
    if(product.id === cartId){
      matchingItem = product;
    }
  })

  const deliveryOptionId = cartItem.deliveryOption;
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if(option.id === deliveryOptionId){
      deliveryOption = option;
    }
  });

  const today = dayjs();
  const deliveryDate = today.add(deliveryOptions.deliveryDays, 'days');
  const dateString = deliveryDate.format('dddd, MMMM D');
  console.log(dateString);


  
  //generate the cart html 
  cartSummaryHTML += `<div class="main-item-container js-main-item-container-${matchingItem.id}">
          <div class="date-img-name-container">
            <div class="delivery-date-container">
              <h3 class="delivery-date">delivery date: </h3>
            </div>
            <div class="img-name-container">
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
                  <button class="delete-btn js-delete-btn" data-product-id="${matchingItem.id}">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <div class="shipping-option-container">
            <p style="text-align: center; font-weight: bold;" class="pick-delivery-date">Select a delivery date</p>
            ${deliveryOptionHTML(matchingItem, cartItem)}
          </div>
        </div>`;
});

function deliveryOptionHTML(matchingItem, cartItem) {
  let deliveryHTML = '';

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString = deliveryOptions.priceCents === 0
    ? 'FREE'
    : `$${(deliveryOption.priceCents/100).toFixed(2)}`

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
  
    deliveryHTML += `
    <div class="shipping-option">
      <input class="select-term" type="radio" ${isChecked ? 'checked' : ''} name="delivery-option-${matchingItem.id}">
      <div class="term-container">
        <p class="shipping-term">${dateString}</p>
        <p class="term-fee">${priceString}-Shipping</p>
      </div>       
    </div>
    `;
  })
  return deliveryHTML;
}

// put the generated cart on the screen
let cartItem = document.querySelector('.cart-items-displey');
if (cartItem){
  cartItem.innerHTML = cartSummaryHTML;
}

document.querySelectorAll('.delete-btn').forEach((deleteButton) =>{
  deleteButton.addEventListener('click', ()=> {
    let productId = deleteButton.dataset.productId;
    removeFromCart(productId);

    // to remove the item ferom the web page
    let container = document.querySelector(`.js-main-item-container-${productId}`);
    container.remove();

    saveToCart()
  });
});

function removeFromCart(productId) {
  let newCart = [];
  cart.forEach((cartItem) =>{
    if (cartItem.productId !== productId){
      newCart.push(cartItem);
    }
  })
  cart = newCart;

  saveToCart();
}

// for reducing and increasing cart quantity
// for reduce button
document.querySelectorAll(`.js-reduce-btn`).forEach((reduceButton) =>{
  reduceButton.addEventListener('click', ()=>{
    let productId = reduceButton.dataset.productId;
    
    cart.forEach((cartItem)=>{
      let itemQuantity = document.querySelector(`.js-item-quantity-${productId}`);

      if (cartItem.productId === productId){
        cartItem.quantity -= 1;
        itemQuantity.innerHTML = cartItem.quantity;
        if (cartItem.quantity < 1) {
          cartItem.quantity = 1;
          itemQuantity.innerHTML = cartItem.quantity;
        }
      }
      saveToCart();
    })
  })
})

// forincrease button
document.querySelectorAll(`.js-add-btn`).forEach((addButton) =>{
  addButton.addEventListener('click', ()=>{
    let productId = addButton.dataset.productId;
    
    cart.forEach((cartItem)=>{
      let itemQuantity = document.querySelector(`.js-item-quantity-${productId}`);
      if (cartItem.productId === productId){
        cartItem.quantity += 1;
        itemQuantity.innerHTML = cartItem.quantity;
        if (cartItem.quantity > 10) {
          cartItem.quantity = 10;
          itemQuantity.innerHTML = cartItem.quantity;
        }
      }
      saveToCart();
    })
  })
})