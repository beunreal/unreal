/* =========================================================
UNREAL 2.0
SCRIPT.JS
========================================================= */

/* =========================================================
PAYSTACK
========================================================= */

/*
IMPORTANT:

Put ONLY your Paystack PUBLIC key here.
Example:
pk_test_xxxxxxxxxxxxxxxxx
NEVER put a Paystack SECRET KEY here.

*/

const PAYSTACK_PUBLIC_KEY =
“PUT_YOUR_PAYSTACK_PUBLIC_KEY_HERE”;

/* =========================================================
WHATSAPP
========================================================= */

/*
Put your UNREAL WhatsApp number here.

Ghana format:
233XXXXXXXXX
Example:
const WHATSAPP_NUMBER = "233241234567";
Do NOT use:
+233
spaces
brackets
dashes

*/

const WHATSAPP_NUMBER =
“233XXXXXXXXX”;

/* =========================================================
PRODUCTS
========================================================= */

const products = [

{
    id: 1,
    name: "UNREAL Core Tee",
    price: 250,
    image: "images/pic1.jpg",
    description: "The classic UNREAL statement tee."
},
{
    id: 2,
    name: "BE UNREAL Tee",
    price: 280,
    image: "images/pic2.jpg",
    description: "Made for people who refuse to blend in."
},
{
    id: 3,
    name: "UNREAL Essential Hoodie",
    price: 450,
    image: "images/pic3.jpg",
    description: "Heavyweight comfort with the UNREAL identity."
},
{
    id: 4,
    name: "UNREAL Signature Tee",
    price: 300,
    image: "images/pic4.jpg",
    description: "A clean everyday UNREAL essential."
},
{
    id: 5,
    name: "UNREAL Oversized Tee",
    price: 320,
    image: "images/pic5.jpg",
    description: "Relaxed fit. Loud identity."
},
{
    id: 6,
    name: "UNREAL Statement Hoodie",
    price: 500,
    image: "images/pic6.jpg",
    description: "The boldest piece from Collection 001."
}

];

/* =========================================================
CART
========================================================= */

let cart = [];

try {

cart =
    JSON.parse(
        localStorage.getItem("unrealCart")
    ) || [];

} catch (error) {

cart = [];

}

/* =========================================================
DISPLAY PRODUCTS
========================================================= */

function displayProducts() {

const container =
    document.getElementById(
        "products-container"
    );
if (!container) {
    console.error(
        "UNREAL: Products container not found."
    );
    return;
}
container.innerHTML = "";
products.forEach(product => {
    const article =
        document.createElement("article");
    article.className =
        "product";
    article.innerHTML = `
        <div class="product-image">
            <img
                src="${product.image}"
                alt="${product.name}"
            >
        </div>
        <div class="product-info">
            <div class="product-name">
                ${product.name}
            </div>
            <div class="product-description">
                ${product.description}
            </div>
            <div class="product-bottom">
                <span class="product-price">
                    GHS ${product.price.toFixed(2)}
                </span>
                <button
                    class="add-button"
                    onclick="addToCart(${product.id})"
                >
                    ADD TO CART
                </button>
            </div>
        </div>
    `;
    /*
        If an image is missing or broken,
        replace it with a safe placeholder.
    */
    const image =
        article.querySelector("img");
    image.addEventListener(
        "error",
        function() {
            this.style.display = "none";
            const placeholder =
                document.createElement("div");
            placeholder.style.width =
                "100%";
            placeholder.style.height =
                "100%";
            placeholder.style.display =
                "flex";
            placeholder.style.alignItems =
                "center";
            placeholder.style.justifyContent =
                "center";
            placeholder.style.background =
                "#dedbd2";
            placeholder.style.color =
                "#101010";
            placeholder.style.fontSize =
                "12px";
            placeholder.style.fontWeight =
                "900";
            placeholder.innerText =
                "IMAGE UNAVAILABLE";
            this.parentElement.appendChild(
                placeholder
            );
        }
    );
    container.appendChild(article);
});

}

/* =========================================================
ADD TO CART
========================================================= */

function addToCart(productID) {

const product =
    products.find(
        item =>
            item.id === productID
    );
if (!product) {
    return;
}
const existing =
    cart.find(
        item =>
            item.id === productID
    );
if (existing) {
    existing.quantity += 1;
} else {
    cart.push({
        ...product,
        quantity: 1
    });
}
saveCart();
updateCart();
showToast(
    `${product.name} added to cart.`
);

}

/* =========================================================
SAVE CART
========================================================= */

function saveCart() {

try {
    localStorage.setItem(
        "unrealCart",
        JSON.stringify(cart)
    );
} catch (error) {
    console.error(
        "UNREAL: Could not save cart.",
        error
    );
}

}

/* =========================================================
UPDATE CART
========================================================= */

function updateCart() {

const cartItems =
    document.getElementById(
        "cart-items"
    );
const cartCount =
    document.getElementById(
        "cart-count"
    );
const cartTotal =
    document.getElementById(
        "cart-total"
    );
if (
    !cartItems ||
    !cartCount ||
    !cartTotal
) {
    return;
}
let itemCount = 0;
let total = 0;
cartItems.innerHTML = "";
if (cart.length === 0) {
    cartItems.innerHTML = `
        <div class="empty-cart">
            <h3>
                YOUR CART IS EMPTY.
            </h3>
            <p>
                Add something UNREAL.
            </p>
            <button
                onclick="closeCart()"
            >
                CONTINUE SHOPPING
            </button>
        </div>
    `;
}
cart.forEach(item => {
    const quantity =
        Number(item.quantity) || 1;
    const subtotal =
        item.price * quantity;
    itemCount += quantity;
    total += subtotal;
    cartItems.innerHTML += `
        <div class="cart-item">
            <div class="cart-item-mini">
                <img
                    src="${item.image}"
                    alt="${item.name}"
                    onerror="this.style.display='none'"
                >
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">
                    ${item.name}
                </div>
                <div class="cart-item-price">
                    GHS ${subtotal.toFixed(2)}
                </div>
                <div class="quantity-controls">
                    <button
                        onclick="changeQuantity(${item.id}, -1)"
                    >
                        −
                    </button>
                    <span>
                        ${quantity}
                    </span>
                    <button
                        onclick="changeQuantity(${item.id}, 1)"
                    >
                        +
                    </button>
                    <button
                        class="remove"
                        onclick="removeFromCart(${item.id})"
                    >
                        REMOVE
                    </button>
                </div>
            </div>
        </div>
    `;
});
cartCount.innerText =
    itemCount;
cartTotal.innerText =
    "GHS " +
    total.toFixed(2);

}

/* =========================================================
CHANGE QUANTITY
========================================================= */

function changeQuantity(
productID,
change
) {

const item =
    cart.find(
        product =>
            product.id === productID
    );
if (!item) {
    return;
}
item.quantity += change;
if (item.quantity <= 0) {
    removeFromCart(productID);
    return;
}
saveCart();
updateCart();

}

/* =========================================================
REMOVE PRODUCT
========================================================= */

function removeFromCart(productID) {

cart =
    cart.filter(
        item =>
            item.id !== productID
    );
saveCart();
updateCart();

}

/* =========================================================
OPEN CART
========================================================= */

function openCart() {

const overlay =
    document.getElementById(
        "cart-overlay"
    );
if (!overlay) {
    return;
}
overlay.style.display =
    "flex";
document.body.classList.add(
    "cart-open"
);
requestAnimationFrame(() => {
    overlay.classList.add(
        "open"
    );
});

}

/* =========================================================
CLOSE CART
========================================================= */

function closeCart() {

const overlay =
    document.getElementById(
        "cart-overlay"
    );
if (!overlay) {
    return;
}
overlay.classList.remove(
    "open"
);
document.body.classList.remove(
    "cart-open"
);
setTimeout(() => {
    if (
        !overlay.classList.contains(
            "open"
        )
    ) {
        overlay.style.display =
            "none";
    }
}, 300);

}

/* =========================================================
CLOSE CART BY CLICKING BACKGROUND
========================================================= */

function closeCartFromOverlay(event) {

if (
    event.target.id ===
    "cart-overlay"
) {
    closeCart();
}

}

/* =========================================================
WHATSAPP ORDER
========================================================= */

function orderWhatsApp() {

if (cart.length === 0) {
    alert(
        "Your cart is empty."
    );
    return;
}
if (
    WHATSAPP_NUMBER ===
    "233XXXXXXXXX"
) {
    alert(
        "UNREAL WhatsApp number has not been added yet."
    );
    return;
}
let message =
    "🔥 UNREAL ORDER\n\n";
let total = 0;
cart.forEach(item => {
    const subtotal =
        item.price *
        item.quantity;
    total += subtotal;
    message +=
        `${item.name}\n` +
        `Qty: ${item.quantity}\n` +
        `Price: GHS ${subtotal.toFixed(2)}\n\n`;
});
message +=
    `TOTAL: GHS ${total.toFixed(2)}\n\n`;
message +=
    "I would like to place this order.";
const encodedMessage =
    encodeURIComponent(
        message
    );
const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
window.open(
    url,
    "_blank"
);

}

/* =========================================================
PAYSTACK PAYMENT
========================================================= */

function startPayment() {

if (cart.length === 0) {
    alert(
        "Your cart is empty."
    );
    return;
}
if (
    PAYSTACK_PUBLIC_KEY ===
    "PUT_YOUR_PAYSTACK_PUBLIC_KEY_HERE"
) {
    alert(
        "Please add your Paystack Public Key first."
    );
    return;
}
const customerEmail =
    prompt(
        "Enter your email address:"
    );
if (!customerEmail) {
    return;
}
const cleanEmail =
    customerEmail.trim();
const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (
    !emailPattern.test(
        cleanEmail
    )
) {
    alert(
        "Please enter a valid email address."
    );
    return;
}
let total = 0;
cart.forEach(item => {
    total +=
        item.price *
        item.quantity;
});
/*
    Paystack uses the smallest
    currency unit.
    GHS 250.00
    =
    25,000 pesewas.
*/
const amount =
    Math.round(
        total * 100
    );
if (
    typeof PaystackPop ===
    "undefined"
) {
    alert(
        "Paystack did not load.\n\n" +
        "Please refresh the page and try again."
    );
    return;
}
const popup =
    new PaystackPop();
popup.newTransaction({
    key:
        PAYSTACK_PUBLIC_KEY,
    email:
        cleanEmail,
    amount:
        amount,
    currency:
        "GHS",
    onSuccess:
        function(transaction) {
            console.log(
                "UNREAL PAYMENT SUCCESS:",
                transaction
            );
            alert(
                "PAYMENT SUCCESSFUL!\n\n" +
                "Thank you for shopping UNREAL."
            );
            cart = [];
            saveCart();
            updateCart();
            closeCart();
        },
    onCancel:
        function() {
            alert(
                "Payment cancelled."
            );
        },
    onError:
        function(error) {
            console.error(
                "UNREAL PAYSTACK ERROR:",
                error
            );
            alert(
                "Payment could not be completed.\n\n" +
                "Please try again."
            );
        }
});

}

/* =========================================================
NEWSLETTER
========================================================= */

function subscribe(event) {

event.preventDefault();
const input =
    document.getElementById(
        "email"
    );
const message =
    document.getElementById(
        "form-message"
    );
if (!input) {
    return;
}
const email =
    input.value.trim();
const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (
    !emailPattern.test(email)
) {
    if (message) {
        message.innerText =
            "Please enter a valid email address.";
    }
    return;
}
/*
    CURRENTLY THIS IS A FRONT-END
    DEMO.
    Later we can connect this
    directly to your real email
    collection system.
*/
if (message) {
    message.innerText =
        "You're officially part of UNREAL.";
}
input.value = "";
showToast(
    "Welcome to the UNREAL movement."
);

}

/* =========================================================
MOBILE MENU
========================================================= */

function toggleMenu() {

const nav =
    document.getElementById(
        "main-nav"
    );
const button =
    document.getElementById(
        "mobile-menu-button"
    );
if (!nav) {
    return;
}
nav.classList.toggle(
    "mobile-open"
);
if (button) {
    const isOpen =
        nav.classList.contains(
            "mobile-open"
        );
    button.setAttribute(
        "aria-expanded",
        isOpen
    );
    button.innerText =
        isOpen
            ? "×"
            : "☰";
}

}

/* =========================================================
CLOSE MOBILE MENU AFTER CLICK
========================================================= */

document.addEventListener(
“click”,
function(event) {

    const nav =
        document.getElementById(
            "main-nav"
        );
    const button =
        document.getElementById(
            "mobile-menu-button"
        );
    if (
        !nav ||
        !button
    ) {
        return;
    }
    if (
        !nav.contains(event.target) &&
        !button.contains(event.target)
    ) {
        nav.classList.remove(
            "mobile-open"
        );
        button.innerText =
            "☰";
        button.setAttribute(
            "aria-expanded",
            "false"
        );
    }
}

);

/* =========================================================
TOAST
========================================================= */

let toastTimer;

function showToast(message) {

const toast =
    document.getElementById(
        "toast"
    );
const toastMessage =
    document.getElementById(
        "toast-message"
    );
if (
    !toast ||
    !toastMessage
) {
    return;
}
toastMessage.innerText =
    message;
toast.classList.add(
    "show"
);
clearTimeout(
    toastTimer
);
toastTimer =
    setTimeout(
        function() {
            toast.classList.remove(
                "show"
            );
        },
        2500
    );

}

/* =========================================================
START UNREAL
========================================================= */

document.addEventListener(
“DOMContentLoaded”,
function() {

    displayProducts();
    updateCart();
}

);