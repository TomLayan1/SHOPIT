import {shopitProduct} from '../../data/products.js';

// export cart variable with the use of module
export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart){
  cart = [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1
    }
  ];
}

console.log(cart);

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
      quantity: quantity
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

  //generate the cart html 
  cartSummaryHTML += `<div class="main-item-container js-main-item-container-${matchingItem.id}">
    <div class="product-img-container">
      <img class="item-img" src="${matchingItem.image}">
    </div>
    <div class="name-price-quantity">
      <div class="name-price-container">
        <p class="item-name">${matchingItem.name}</p>
        <p class="price">$${(matchingItem.priceCents/100).toFixed(2)}</p>
      </div>
      <div class="quantity-container">
        <button class="reduce-btn">-</button>
        <p class="item-quantity">${cartItem.quantity}</p>
        <button class="add-btn">+</button>
        <button class="js-delete-btn delete-btn" data-product-id="${matchingItem.id}">Delete</button>
      </div>
    </div>
    <div class="shipping-option-container">
      <div class="shipping-option">
        <input class="select-term" type="radio" name="delivery-option-${matchingItem.id}">
        <div class="term-container">
          <p class="shipping-term">Thursday, September 14</p>
          <p class="term-fee">FREE Shipping</p>
        </div>        
      </div>
      <div class="shipping-option">
        <input class="select-term" type="radio" name="delivery-option-${matchingItem.id}">
        <div class="term-container">
          <p class="shipping-term">Friday, September 8</p>
          <p class="term-fee">$4.99 - Shipping</p>
        </div>        
      </div>
      <div class="shipping-option">
        <input class="select-term" type="radio" name="delivery-option-${matchingItem.id}">
        <div class="term-container">
          <p class="shipping-term">Wednesday, September 6</p>
          <p class="term-fee">$9.99 - Shipping</p>
        </div>        
      </div>
    </div>
  </div>`;

});
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