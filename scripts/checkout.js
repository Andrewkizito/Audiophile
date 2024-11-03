const cartEntry = document.getElementById("cart-summary");

/*------------- Handle the cart items -------------*/
function renderCartItems(cart) {
    const totalCost = cart.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
            )

    const shippingCost = (totalCost * 0.05).toFixed(2)
    const vatCost = (totalCost * 0.03).toFixed(2)

    const grandTotal = totalCost + parseFloat(shippingCost) + parseFloat(vatCost)

    cartEntry.innerHTML = `
      <div>
          ${cart
            .map((item) => {
              const productName = item.name
                .toLowerCase()
                .replace(item.category?.toLowerCase(), "");

              return `
              <div class="cart-item">
                  <div class="img-container">
                      <img
                          src="${item.image.desktop}"
                          alt="${item.name}"
                      />
                      <div class="item-details">
                          <h3>${productName}</h3>
                          <p>$${item.price}</p>
                      </div>
                  </div>
                  <div class="add-to-cart">
                    <h5>x${item.quantity}</h5>
                  </div>
              </div>
            `;
            })
            .join("")}
      </div>
      <div class="cart-footer">
        <div>
            <h4>Total</h4>
            <p>$${totalCost.toFixed(2)}</p>
        </div>
        <div>
            <h4>Shipping</h4>
            <p>$${shippingCost}</p>
        </div>
        <div>
            <h4>VAT (Included)</h4>
            <p>$${vatCost}</p>
        </div>
        <div style="margin-top: 1rem;">
            <h4>Grand Total</h4>
            <p>$${grandTotal.toFixed(2)}</p>
        </div>
      </div>
      <button id="on-continue" class="btn btn-checkout btn-primary">Continue</button>
    </div>
  `;
}

const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) {
  alert("Your cart is empty");
  window.location.href = "index.html";
}

renderCartItems(cart);

/*------------- Handle Form -------------*/
const form = document.getElementById("checkout-form");
const popUp = document.getElementById("pop-up");
const homeBtn = document.getElementById("home-btn");
const onContinue = document.getElementById("on-continue");

onContinue.addEventListener("click", () => {
  placeOrder();
});


// Listen for focus events and remove the error class
form.addEventListener("focus", (event) => {
    event.target.classList.remove("form-error");
});

// Payment methods
let payment = "";


const eMoney = document.querySelector(".payment-option-e-money");
const cashOnDelivery = document.querySelector(".payment-option-cash-on-delivery");

const radioEMoney = document.getElementById("e-money");
const radioCashOnDelivery = document.getElementById("cash-on-delivery");

eMoney.addEventListener("click", () => {
    payment = "e-money";
    
    eMoney.style.border = "1.4px solid var(--aud-primary-color)";
    radioEMoney.style.opacity = "1";
    radioCashOnDelivery.style.opacity = "0";
    cashOnDelivery.style.border = "1.4px solid #ccc";
});

cashOnDelivery.addEventListener("click", () => {
    payment = "cash-on-delivery";

    radioCashOnDelivery.style.opacity = "1";
    radioEMoney.style.opacity = "0";
    eMoney.style.border = "1.4px solid #ccc";
    cashOnDelivery.style.border = "1.4px solid var(--aud-primary-color)";
});


function placeOrder() {
    // Validate all inputs
    const inputs = form.querySelectorAll("input");
    let isValid = true;

    // Add further validation depending on input type
    inputs.forEach((input) => {
        if (!input.value) {
            isValid = false;
            input.classList.add("form-error");
        } else {
            switch (input.type) {
                case "email":
                    // Validate email
                    console.log(input.value);
                    if (!input.value.includes("@")) {
                        isValid = false;
                        input.classList.add("form-error");
                    } else {
                        input.classList.remove("form-error");
                    }
                    break;
                case "tel":
                    // Validate phone number and should only have numbers or a plus sign
                    if (input.value.length < 9 || input.value.match(/[^0-9+]/g)) {
                        isValid = false;
                        input.classList.add("form-error");
                    } else {
                        input.classList.remove("form-error");
                    }
                    break;
            
                default:
                    // Do nothing
                    input.classList.remove("form-error");
                    break;
            }
        }
    });

    if (!isValid) {
        return;
    } else if (!payment) {
        alert("Please select a payment method");
        return;
    }

    console.log("Payment method:", payment);

    // Clear cart
    localStorage.removeItem("cart");
    popUp.classList.add("pop-up-open");
}

homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
