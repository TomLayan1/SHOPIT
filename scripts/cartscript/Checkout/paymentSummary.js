import { cart } from '../cart.js';
import { getProduct } from '../../../data/products.js';
import { getDeliveryOption } from '../../../data/deliveryOption.js';
import { formatCurrency } from '../../utils/money.js';

export function renderPaymentSummary() {
  let productPriceTotal = 0;
  let shippingPriceTotal = 0
  // loop through the cart
  cart.forEach((cartItem ) =>{
    // for each item, multiply the price by the quantity
    // Use the productId to get the full product details
    const product = getProduct(cartItem.productId);
    productPriceTotal += product.priceCents * cartItem.quantity

    // calculate shipping cost
    // Use the deliveryOptionId to get the full delivery option details
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    // Get the price for the delivery options
    shippingPriceTotal += deliveryOption.priceCents
  });

  const totalBeforeTax = productPriceTotal + shippingPriceTotal
  const estimatedTax = totalBeforeTax * 0.1;
  const totalOrderPrice = totalBeforeTax + estimatedTax;

  // Generate the paymentSummary HTML 
  const paymentSummaryHTML = `
        <div class="item-summary-container">
          <p class="items-summary">Items(1):</p>
          <p class="items-price-sum">$${formatCurrency(productPriceTotal)}</p>
        </div>
        <div class="shipping-summary-container">
          <p class="shipping-handling">Shipping & handling:</p>
          <div class="shipping-fee-div">
            <p class="shipping-fee">$${formatCurrency(shippingPriceTotal)}</p>
          </div>
        </div>
        <div class="before-tax-summary-container">
          <p class="before-tax">Total before tax:</p>
          <p class="before-tax-price">$${formatCurrency(totalBeforeTax)}</p>
        </div>
        <div class="plus-summary-container">
          <p class="tax-pay">Tax(10%):</p>
          <p class="plus-tax-sum">$${formatCurrency(estimatedTax)}</p>
        </div>
        <div class="total-summary-container">
          <h3 class="order-total">Total Price Of Order</h3>
          <h3 class="total-price">$${formatCurrency(totalOrderPrice)}</h3>
        </div>
  `;

  document.querySelector('.js-cart-calculator-container').innerHTML = paymentSummaryHTML;
}