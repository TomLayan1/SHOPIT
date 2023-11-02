import {cart, addToCart} from './cartscript/cart.js';
import {shopitProduct} from '../data/products.js';

// for drop down menu
function tuggleMenu() {
  const menuNav = document.querySelector('.js-menu');
  if (menuNav.style.display === 'none'){
    menuNav.style.display = 'block';
  }
  else{
    menuNav.style.display = 'none';
  }
}

// we make use of the accumulator pattern to combine all the html
let productHTML = '';

// we use the .foreach() array method to loop throught each date in the object above
shopitProduct.forEach((product) => {
  productHTML += `
  <div class="product-container">
  <div class="product-image-container">
    <img class="product-image" src="${product.image}">
  </div>
  <div class="product-info-container">
    <p>${product.name}</p>
  </div>
  <div class="star-rating-container">
    <img class="star-img" src="shopit-starpic/rating-${product.rating.stars * 10}.png">
    <p class="js-rating rating">${product.rating.count}</p>
  </div>
  <div class="price-quantity-container">
    <p class="js-product-price product-price">$${(product.priceCents / 100).toFixed(2)}</p>
    <select class="quantity-list js-quantity-selector-${product.id}" id="quantity-list">
      <option selected value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
  </div>

  <div class="product-spacer"></div>

  <div class="added-to-cart">
    <p class="js-added-text added-text"></p>
  </div>
  <div class="add-button-container">
    <button class="js-add-btn add-cart-btn"
    data-product-id="${product.id}">ADD TO CART</button>
  </div>
</div>`;
});
document.querySelector('.js-product-grid').innerHTML = productHTML;


// to display the text 'added' when the add to cart button is clicked and remove it after 2 seconds 
function showAddedText() {
  const addedText = document.querySelector('.added-to-cart');
  if (addedText.style.opacity === '0'){
    addedText.style.opaacity = '1';
    setTimeout(() => {
      addedText.style.opaacity = '0';
    }, 2000);
  }
}

// to update cart quantity on the page
function updateCartQuantity() {
  let cartQuantity = 0;
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    })
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

// to show added text when add to cart button is clicked and disappear after 2s
function showAddedt(button){
  let addedText = button.parentElement.parentElement.querySelector('.js-added-text')
    addedText.innerHTML = 'Added';
    if (addedText.innerHTML === 'Added'){
      setTimeout(() => {
        addedText.innerHTML = '';
      },2000)
    }
}

document.querySelectorAll('.js-add-btn').forEach((button) => {
  button.addEventListener('click', () => {
    showAddedt(button);
    const productId = button.dataset.productId;
    console.log(productId);
    addToCart(productId);
    updateCartQuantity();
    console.log(cart);
  });
});