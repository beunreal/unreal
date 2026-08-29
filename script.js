/* ==================================
   UNREAL SHOP
================================== */


/* ==================================
   STORE PRODUCTS

   Change these products later.
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

let cart = JSON.parse(
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


        container.innerHTML += productHTML;

    });

}



/* ==================================
   ADD TO CART
================================== */

function addToCart(productID) {

    const product =
        products.find(
            item => item.id === productID
        );


    const existing =
        cart.find(
            item => item.id === productID
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

        itemCount += item.quantity;


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
                    ${(item.price * item.quantity)
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
            item => item.id !== productID
        );


    saveCart();

    updateCart();

}



/* ==================================
   OPEN CART
================================== */

function openCart() {

    document.getElementById(
        "cart-overlay"
    ).style.display = "flex";

}



/* ==================================
   CLOSE CART
================================== */

function closeCart() {

    document.getElementById(
        "cart-overlay"
    ).style.display = "none";

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
       IMPORTANT:

       Replace this number with
       your UNREAL WhatsApp number.

       Ghana example:
       233XXXXXXXXX

       Do NOT put + or spaces.
    */


    const phone =
        "233XXXXXXXXX";


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
   ONLINE PAYMENT
================================== */

function startPayment() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    /*
       PAYMENT GATEWAY GOES HERE.

       We should connect this to
       a Ghana-compatible gateway
       such as Paystack or another
       provider.

       Do NOT put secret API keys
       inside this JavaScript file.
    */


    alert(

        "Online payment setup is ready. " +
        "The payment gateway needs to be connected " +
        "before accepting real payments."

    );

}



/* ==================================
   NEWSLETTER
================================== */

function subscribe(event) {

    event.preventDefault();


    const email =
        document.getElementById(
            "email"
        ).value;


    alert(
        "Welcome to UNREAL, " +
        email +
        "!"
    );


    document.getElementById(
        "email"
    ).value = "";

}



/* ==================================
   MOBILE MENU
================================== */

function toggleMenu() {

    const nav =
        document.querySelector(
            ".nav"
        );


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