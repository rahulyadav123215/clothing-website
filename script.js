const PRODUCTS = [
  {
    id: 1,
    name: "Classic Black Hoodie",
    price: 999,
    image: "images/hoodie.jpg.jpg",
  },
  {
    id: 2,
    name: "Urban White T-Shirt",
    price: 499,
    image: "images/tshirt.jpg.jpg",
  },
  {
    id: 3,
    name: "Denim Jacket Blue",
    price: 1499,
    image: "images/jacket.jpg.jpg",
  },
  {
    id: 4,
    name: "Comfort Joggers",
    price: 799,
    image: "images/joggers.jpg.jpg",
  },
  {
    id: 5,
    name: "Minimal Sneakers",
    price: 1799,
    image: "images/sneakers.jpg.jpg",
  },
  {
    id: 6,
    name: "Summer Overshirt",
    price: 899,
    image: "images/overshirt.jpg.jpg",
  },
  {
    id: 7,
    name: "Casual Check Shirt",
    price: 699,
    image: "images/checkshirt.jpg.jpg",
  },
  {
    id: 8,
    name: "Premium Jeans",
    price: 1299,
    image: "images/jeans.jpg.webp",
  },
];

function getUser() {
  return JSON.parse(localStorage.getItem("user")) || null;
}

function setUser(userObj) {
  localStorage.setItem("user", JSON.stringify(userObj));
}

function logoutUser() {
  localStorage.removeItem("user");
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function isLoggedIn() {
  return getUser() !== null;
}

function showToast(message = "✅ Done!") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1600);
}

function updateNavbar() {
  const cartCountEl = document.getElementById("cartCount");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (cartCountEl) {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalQty;
  }

  if (loginBtn && logoutBtn) {
    if (isLoggedIn()) {
      loginBtn.classList.add("hidden");
      logoutBtn.classList.remove("hidden");
    } else {
      loginBtn.classList.remove("hidden");
      logoutBtn.classList.add("hidden");
    }
  }
}

function addToCart(productId) {
  if (!isLoggedIn()) {
    alert("Please login first");
    return;
  }

  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  setCart(cart);
  updateNavbar();
  showToast("✅ Added to cart!");
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(
    (p) => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" />
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-bottom">
          <div class="price">₹${p.price}</div>
          <button class="btn btn-primary" onclick="addToCart(${p.id})">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `
  ).join("");
}

function renderCart() {
  const cartItemsEl = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  if (!cartItemsEl) return;

  let cart = getCart();

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="auth-card" style="text-align:center;">
        <h2>Your cart is empty 🛒</h2>
        <p class="muted" style="margin-top:8px;">Add products from the home page.</p>
        <a href="index.html#products" class="btn btn-primary" style="margin-top:14px; display:inline-block;">
          Shop Products
        </a>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = "₹0";
    if (totalEl) totalEl.textContent = "₹0";
    updateNavbar();
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-details">
          <h4>${item.name}</h4>
          <p class="muted">₹${item.price}</p>
        </div>

        <div class="cart-actions">
          <div class="qty-box">
            <button class="qty-btn" onclick="decreaseQty(${item.id})">-</button>
            <strong>${item.quantity}</strong>
            <button class="qty-btn" onclick="increaseQty(${item.id})">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `
    )
    .join("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (totalEl) totalEl.textContent = `₹${subtotal}`;

  updateNavbar();
}

function increaseQty(id) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.quantity += 1;
  setCart(cart);
  renderCart();
  showToast("✅ Updated cart!");
}

function decreaseQty(id) {
  let cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart = cart.filter((i) => i.id !== id);
  }

  setCart(cart);
  renderCart();
  showToast("✅ Updated cart!");
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter((i) => i.id !== id);

  setCart(cart);
  renderCart();
  updateNavbar();
  showToast("✅ Removed item!");
}

function setupLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  if (isLoggedIn()) {
    window.location.href = "index.html";
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setUser({ email });

    showToast("✅ Logged in successfully!");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  });
}

function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    logoutUser();
    showToast("✅ Logged out!");
    updateNavbar();

    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
  setupLogout();
  renderProducts();
  renderCart();
  setupLoginPage();
});
