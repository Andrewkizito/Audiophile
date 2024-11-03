const cartBtn = document.getElementById("cart");
const backdrop = document.querySelector(".backdrop");
const cartDropdown = document.querySelector(".cart-dropdown");
const body = document.body;

cartBtn.addEventListener("click", () => {
  // Read cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  // Add opacity to backdrop
  backdrop.classList.add("open-backdrop");

  // Open cart
  cartDropdown.classList.add("open-cart");

  // Render the cart items
  renderCartItems(cart);
});

// Function to render cart items
function renderCartItems(cart) {
  cartDropdown.innerHTML = `
    <div class="cart-container">
      <div class="cart-header">
        <h3>Cart (${cart.length})</h3>
        <p onclick="clearCart()">Remove All</p>
      </div>
      <div class="cart-items">
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
                      <div class="btn btn-cart">
                          <ion-icon onclick="decrement('${item.id}')" class="icon" name="remove-outline"></ion-icon>
                          <span id="quantity-${item.id}">${item.quantity}</span>
                          <ion-icon onclick="increment('${item.id}')" class="icon" name="add-outline"></ion-icon>
                      </div>
                  </div>
              </div>
            `;
            })
            .join("")}
      </div>
      <div class="cart-footer">
        <h4>Total</h4>
        <p>$${cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</p>
      </div>
      <a href="checkout.html">
        <button class="btn btn-checkout btn-primary">Checkout</button>
      </a>
    </div>
  `;
}

// Increment quantity
function increment(itemId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((product) => product.id === parseInt(itemId));

  if (item) {
    item.quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    document.getElementById(`quantity-${itemId}`).textContent = item.quantity;
  }
}

// Decrement quantity
function decrement(itemId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((product) => product.id === parseInt(itemId));

  if (item && item.quantity > 1) {
    item.quantity -= 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    document.getElementById(`quantity-${itemId}`).textContent = item.quantity;
  } else if (item && item.quantity === 1) {
    // Optionally, remove the item if quantity reaches 0
    const updatedCart = cart.filter((product) => product.id !== parseInt(itemId));

    if (updatedCart.length === 0) {
      clearCart();
    }
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    renderCartItems(updatedCart); // Refresh cart display
  }
}

// Clear cart
function clearCart() {
  localStorage.removeItem("cart");
  renderCartItems([]);
  closeCart();
}

// Function to close the cart
function closeCart() {
  backdrop.classList.remove("open-backdrop");
  cartDropdown.classList.remove("open-cart");
}

// Add event listener to backdrop
backdrop.addEventListener("click", () => {
  closeCart();

  if (window.location.pathname === "/checkout.html") {
    window.location.reload();
  }
});
