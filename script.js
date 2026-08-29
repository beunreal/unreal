/* ==================================
   UNREAL SHOP
================================== */


/* ==================================
   PAYSTACK
================================== */

/*
   ONLY put your PAYSTACK PUBLIC KEY here.

   It should look like:

   pk_test_xxxxxxxxxxxxx

   NEVER put a secret key here.
*/

const PAYSTACK_PUBLIC_KEY =
    "pk_test_3a375e8fecc483d487ca511e8950d26e5ff5a1f1";



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


    if (!container) {

        return;

    }


    container.innerHTML = "";


    products.forEach(product => {

        container.innerHTML += `

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

                        GHS
                        ${product.price.toFixed(2)}

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


    if (!product) {

        return;

    }


    const existing =
        cart.find(
            item =>
                item.id === productID
        );


    if (existing) {

        existing.quantity++;

    }

    else {

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

        cartItems.innerHTML = `

            <p class="empty-cart">

                Your cart is empty.

            </p>

        `;

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

                    ${(
                        item.price *
                        item.quantity
                    ).toFixed(2)}


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


    if (!overlay) {

        return;

    }


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


    if (!overlay) {

        return;

    }


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
       CHANGE THIS TO YOUR
       REAL UNREAL WHATSAPP NUMBER.

       Ghana format:

       233XXXXXXXXX

       Do NOT use +.
       Do NOT use spaces.
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


        total +=
            subtotal;


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
   PAYSTACK ONLINE PAYMENT
================================== */

function startPayment() {


    /* --------------------------------
       CHECK CART
    -------------------------------- */

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }



    /* --------------------------------
       CHECK PAYSTACK KEY
    -------------------------------- */

    if (

        PAYSTACK_PUBLIC_KEY ===

        "PUT_YOUR_PK_TEST_KEY_HERE"

    ) {

        alert(

            "Please add your Paystack Test Public Key."

        );

        return;

    }



    /* --------------------------------
       ASK CUSTOMER FOR EMAIL
    -------------------------------- */

    const customerEmail =
        prompt(
            "Enter your email address:"
        );


    /*
       Customer cancelled email box.
    */

    if (!customerEmail) {

        return;

    }


    /*
       Remove accidental spaces.
    */

    const cleanEmail =
        customerEmail.trim();


    /*
       Basic email validation.
    */

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



    /* --------------------------------
       CALCULATE TOTAL
    -------------------------------- */

    let total = 0;


    cart.forEach(item => {

        total +=
            item.price *
            item.quantity;

    });



    /* --------------------------------
       CONVERT TO PESEWAS
    -------------------------------- */

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



    /* --------------------------------
       CHECK PAYSTACK LIBRARY
    -------------------------------- */

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



    /* --------------------------------
       CREATE PAYSTACK POPUP
    -------------------------------- */

    const popup =
        new PaystackPop();



    /* --------------------------------
       START PAYMENT
    -------------------------------- */

    popup.newTransaction({

        key:
            PAYSTACK_PUBLIC_KEY,


        email:
            cleanEmail,


        amount:
            amount,


        currency:
            "GHS",



        /* ============================
           PAYMENT SUCCESS
        ============================ */

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


                /*
                   Clear cart after
                   successful payment.
                */

                cart = [];


                saveCart();


                updateCart();


                closeCart();

            },



        /* ============================
           PAYMENT CANCELLED
        ============================ */

        onCancel:
            function() {


                alert(

                    "Payment cancelled."

                );

            },



        /* ============================
           PAYMENT ERROR
        ============================ */

        onError:
            function(error) {


                console.error(

                    "PAYSTACK ERROR:",

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


    if (!emailInput) {

        return;

    }


    const email =
        emailInput.value.trim();


    if (!email) {

        return;

    }


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


    if (!nav) {

        return;

    }


    if (

        nav.style.display ===
        "flex"

    ) {

        nav.style.display =
            "none";

    }

    else {

        nav.style.display =
            "flex";

        nav.style.position =
            "absolute";

        nav.style.top =
            "75px";

        nav.style.right =
            "5%";

        nav.style.background =
            "#f7f3e9";

        nav.style.padding =
            "25px";

        nav.style.flexDirection =
            "column";

    }

}



/* ==================================
   START UNREAL
================================== */

displayProducts();

updateCart();