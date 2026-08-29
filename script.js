/* ==================================
   UNREAL SHOP
================================== */
/* ==================================
   PAYSTACK
================================== */
/*
   IMPORTANT:
   Put ONLY your Paystack PUBLIC TEST KEY here.
   It starts with:
   pk_test_
   NEVER put:
   sk_test_
   sk_live_
   in this file.
*/
const PAYSTACK_PUBLIC_KEY =
    "pk_test_3a375e8fecc483d487ca511e8950d26e5ff5a1f1";
/*
   Email used for this TEST checkout.
   Later we will change this so the
   customer enters their own email.
*/
const PAYMENT_EMAIL =
    "hello.beunreal.com";
/* ==================================
   STORE PRODUCTS
================================== */
const products = [
    {
        id: 1,
        name: "UNREAL Core Tee",
        price: 250,
        image: "images/tee-black.jpg"
    },
    {
        id: 2,
        name: "BE UNREAL Tee",
        price: 280,
        image: "images/tee-white.jpg"
    },
    {
        id: 3,
        name: "UNREAL Essential Hoodie",
        price: 450,
        image: "images/hoodie.jpg"
    }
];
/* ==================================
   CART
================================== */
let cart =
    JSON.parse(
        localStorage.getItem("unrealCart")
    ) || [];
/* ==================================
   DISPLAY PRODUCTS
================================== */
function displayProducts() {
    const container =
        document.getElementById(
            "products-container"
        );
    if (!container) return;
    container.innerHTML = "";
    products.forEach(product => {
        const productHTML = `
            <article class="product">
                <div class="product-image">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        onerror="this.style.display='none'"
                    >
                </div>
                <div class="product-name">
                    ${product.name}
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
            </article>
        `;
        container.innerHTML +=
            productHTML;
    });
}
/* ==================================
   ADD TO CART
================================== */
function addToCart(productID) {
    const product =
        products.find(
            item =>
                item.id === productID
        );
    if (!product) return;
    const existing =
        cart.find(
            item =>
                item.id === productID
        );
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    saveCart();
    updateCart();
    openCart();
}
/* ==================================
   SAVE CART
================================== */
function saveCart() {
    localStorage.setItem(
        "unrealCart",
        JSON.stringify(cart)
    );
}
/* ==================================
   UPDATE CART
================================== */
function updateCart() {
    const cartItems =
        document.getElementById(
            "cart-items"
        );
    const count =
        document.getElementById(
            "cart-count"
        );
    const total =
        document.getElementById(
            "cart-total"
        );
    if (
        !cartItems ||
        !count ||
        !total
    ) {
        return;
    }
    let itemCount = 0;
    let cartTotal = 0;
    cartItems.innerHTML = "";
    if (cart.length === 0) {
        cartItems.innerHTML =
            `<p class="empty-cart">
                Your cart is empty.
            </p>`;
    }
    cart.forEach(item => {
        itemCount +=
            item.quantity;
        cartTotal +=
            item.price *
            item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>
                        ${item.name}
                    </strong>
                    <br>
                    Qty:
                    ${item.quantity}
                    <br>
                    GHS
                    ${(item.price *
                      item.quantity)
                      .toFixed(2)}
                    <br><br>
                    <span
                        class="remove"
                        onclick="removeFromCart(${item.id})"
                    >
                        REMOVE
                    </span>
                </div>
            </div>
        `;
    });
    count.innerText =
        itemCount;
    total.innerText =
        "GHS " +
        cartTotal.toFixed(2);
}
/* ==================================
   REMOVE FROM CART
================================== */
function removeFromCart(productID) {
    cart =
        cart.filter(
            item =>
                item.id !== productID
        );
    saveCart();
    updateCart();
}
/* ==================================
   OPEN CART
================================== */
function openCart() {
    const overlay =
        document.getElementById(
            "cart-overlay"
        );
    if (!overlay) return;
    overlay.style.display =
        "flex";
}
/* ==================================
   CLOSE CART
================================== */
function closeCart() {
    const overlay =
        document.getElementById(
            "cart-overlay"
        );
    if (!overlay) return;
    overlay.style.display =
        "none";
}
/* ==================================
   WHATSAPP ORDER
================================== */
function orderWhatsApp() {
    if (cart.length === 0) {
        alert(
            "Your cart is empty."
        );
        return;
    }
    /*
       Replace this with your
       UNREAL WhatsApp number.
       Ghana example:
       233XXXXXXXXX
       No + sign.
       No spaces.
    */
    const phone =
        "233201050184";
    let message =
        "🔥 UNREAL ORDER%0A%0A";
    let total = 0;
    cart.forEach(item => {
        const subtotal =
            item.price *
            item.quantity;
        total += subtotal;
        message +=
            `${item.name}%0A` +
            `Qty: ${item.quantity}%0A` +
            `Price: GHS ${subtotal.toFixed(2)}%0A%0A`;
    });
    message +=
        `TOTAL: GHS ${total.toFixed(2)}%0A%0A`;
    message +=
        "I would like to place this order.";
    window.open(
        `https://wa.me/${phone}?text=${message}`,
        "_blank"
    );
}
/* ==================================
   ONLINE PAYMENT — PAYSTACK
================================== */
function startPayment() {
    /*
       Make sure cart isn't empty.
    */
    if (cart.length === 0) {
        alert(
            "Your cart is empty."
        );
        return;
    }
    /*
       Make sure the public key
       has been entered.
    */
    if (
        PAYSTACK_PUBLIC_KEY ===
        "PUT_YOUR_PK_TEST_KEY_HERE"
    ) {
        alert(
            "Please add your Paystack Test Public Key first."
        );
        return;
    }
    /*
       Make sure a test email
       has been entered.
    */
    if (
        PAYMENT_EMAIL ===
        "PUT_YOUR_EMAIL_HERE"
    ) {
        alert(
            "Please add your test email first."
        );
        return;
    }
    /*
       Calculate cart total.
    */
    let total = 0;
    cart.forEach(item => {
        total +=
            item.price *
            item.quantity;
    });
    /*
       Paystack expects GHS amounts
       in pesewas.
       GHS 250 =
       25,000 pesewas.
       GHS 730 =
       73,000 pesewas.
    */
    const amountInPesewas =
        Math.round(
            total * 100
        );
    /*
       Make sure Paystack loaded.
    */
    if (
        typeof PaystackPop ===
        "undefined"
    ) {
        alert(
            "Paystack could not load. " +
            "Please refresh the page and try again."
        );
        return;
    }
    /*
       Open Paystack.
    */
    const popup =
        new PaystackPop();
    popup.newTransaction({
        key:
            PAYSTACK_PUBLIC_KEY,
        email:
            PAYMENT_EMAIL,
        amount:
            amountInPesewas,
        currency:
            "GHS",
        /*
           Payment successful.
        */
        onSuccess:
            function(transaction) {
                console.log(
                    "UNREAL payment successful:",
                    transaction
                );
                alert(
                    "PAYMENT SUCCESSFUL!\n\n" +
                    "Thank you for shopping UNREAL."
                );
                /*
                   Empty the cart after
                   successful TEST payment.
                */
                cart = [];
                saveCart();
                updateCart();
                closeCart();
            },
        /*
           Customer cancelled.
        */
        onCancel:
            function() {
                alert(
                    "Payment cancelled."
                );
            },
        /*
           Payment error.
        */
        onError:
            function(error) {
                console.error(
                    "Paystack error:",
                    error
                );
                alert(
                    "Payment could not be completed.\n\n" +
                    "Please try again."
                );
            }
    });
}
/* ==================================
   NEWSLETTER
================================== */
function subscribe(event) {
    event.preventDefault();
    const emailInput =
        document.getElementById(
            "email"
        );
    if (!emailInput) return;
    const email =
        emailInput.value;
    alert(
        "Welcome to UNREAL, " +
        email +
        "!"
    );
    emailInput.value = "";
}
/* ==================================
   MOBILE MENU
================================== */
function toggleMenu() {
    const nav =
        document.querySelector(
            ".nav"
        );
    if (!nav) return;
    if (
        nav.style.display ===
        "flex"
    ) {
        nav.style.display =
            "none";
    } else {
        nav.style.display =
            "flex";
        nav.style.position =
            "absolute";
        nav.style.top =
            "75px";
        nav.style.right =
            "5%";
        nav.style.background =
            "#f5f4ef";
        nav.style.padding =
            "25px";
        nav.style.flexDirection =
            "column";
    }
}
/* ==================================
   START WEBSITE
================================== */
displayProducts();
updateCart();