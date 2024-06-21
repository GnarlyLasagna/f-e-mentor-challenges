const body = document.querySelector("body");
const hamburgerBtn = document.querySelector(".header__hamburger-toggle");
const hamburgerImg = document.querySelector(".header__hamburger");
const mobileNav = document.querySelector(".categories--nav");
const cartModal = document.querySelector(".cart");
const cartBtn = document.querySelector(".header__cart");
const cartBasket = document.querySelector(".cart__basket");
const emptyCartBtn = document.querySelector(".cart__remove");
const basketQuantity = document.querySelector(".cart__quantity");
const grandTotal = document.querySelector(".cart__grand-total");
const submitBtn = document.querySelector(".summary__button");
const cartQuantityDisplay = document.querySelector(".header__quantity");
const receiptAccordian = document.querySelector(".checkout__accordian");
const checkoutModal = document.querySelector(".checkout__modal");
const accordianBtn = document.querySelector(".checkout__accordian-btn");
const emptyCartCard = document.querySelector(".cart__card--empty");

const productsJSONData = getProducts();
let cart = JSON.parse(localStorage.getItem("cart")) || [];

//FUNCTIONS

async function getProducts() {
    let result = await fetch("../data.json");
    return result.json();
}

function handleHam(event) {
    event.stopPropagation();
    if (cartModal.classList.contains("show-cart")) {
        cartModal.classList.remove("show-cart");
        body.classList.remove("nav-is-open");
    }
    body.classList.toggle("nav-is-open");
    mobileNav.classList.toggle("nav-is-open");
    hamburgerImg.classList.toggle("nav-is-open");

    setTimeout(() => {
        if (body.classList.contains("nav-is-open")) {
            body.addEventListener("click", removeAllModals);
        }
    }, 0);
}
function handleCartModal(event) {
    event?.stopPropagation();

    if (mobileNav.classList.contains("nav-is-open")) {
        body.classList.remove("nav-is-open");
        mobileNav.classList.remove("nav-is-open");
        hamburgerImg.classList.remove("nav-is-open");
    }
    body.classList.toggle("nav-is-open");
    cartModal.classList.toggle("show-cart");

    setTimeout(() => {
        if (body.classList.contains("nav-is-open")) {
            body.addEventListener("click", removeAllModals);
        }
    }, 0);
}

function removeAllModals(event) {
    event.stopPropagation();
    let targetClass = event.target.classList[0].split("__")[0];
    if (targetClass === "cart" || targetClass === "categories") {
        return;
    }
    cartModal.classList.remove("show-cart");
    body.classList.remove("nav-is-open");
    mobileNav.classList.remove("nav-is-open");
    hamburgerImg.classList.remove("nav-is-open");
    body.removeEventListener("click", removeAllModals);
}

function handleProductLink(event) {
    event.stopPropagation();
    let product = event.target.dataset.item;
    let productName = event.target.dataset.name;

    localStorage.setItem("product", product);
    localStorage.setItem("product-name", productName);
}

function createProductQuantityListeners() {
    const linkButtons = [
        ...document.querySelectorAll(".cart__amount-container"),
    ];
    linkButtons.forEach((button) =>
        button.addEventListener("click", handleProductQuantity)
    );
}
function handleProductQuantity(event) {
    event.stopPropagation();
    let quantityContainer = event.currentTarget.querySelector(
        ".cart__product-quantity"
    );
    let quantity = parseInt(quantityContainer.textContent);
    let target = event.target;
    let productName =
        quantityContainer.parentNode.previousElementSibling.children[0]
            .textContent;

    if (target.classList.contains("cart__subtract") && quantity === 1) {
        removeProductFromCart(productName);
    }
    if (target.classList.contains("cart__subtract") && quantity > 1) {
        quantity--;
    }
    if (target.classList.contains("cart__add")) {
        quantity++;
    }

    quantityContainer.textContent = quantity;
    updateCart(productName, quantity);
    updateCartBasket();
    populateCheckoutInfo();
}

function removeProductFromCart(name) {
    cart = cart.filter((item) => item.name !== name);
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart(name, quantity) {
    cart = cart.map((item) =>
        item.name === name ? { ...item, quantity: quantity } : item
    );
    localStorage.setItem("cart", JSON.stringify(cart));
}

function createProductListeners() {
    const linkButtons = [...document.querySelectorAll('[data-link="product"]')];
    linkButtons.forEach((button) =>
        button.addEventListener("click", handleProductLink)
    );
}

function toggleEmptyCartCard() {
    emptyCartCard.style.visibility = cart.length === 0 ? "visible" : "hidden";
}

function emptyCart(event = null, checkout = false) {
    event?.stopPropagation();
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    cartBasket.innerHTML = "";
    grandTotal.innerHTML = `$ &nbsp;0`;
    basketQuantity.innerHTML = 0;
    updateCartQuantityBubble();
    if (!checkout) {
        setTimeout(() => {
            handleCartModal();
        }, 500);
    }
    toggleEmptyCartCard();
}

function updateQuantity(event) {
    let quantityContainer = document.querySelector(".product__quantity");
    let quantity = parseInt(quantityContainer.textContent);
    let target = event.target;

    if (target.classList.contains("product__subtract") && quantity > 1) {
        quantity--;
    }
    if (target.classList.contains("product__add")) {
        quantity++;
    }

    quantityContainer.textContent = quantity;
}

//PRODUCT PAGE

function createPicture(name, className, { mobile, tablet, desktop }) {
    return `<picture>
                        <source
                            media="(min-width: 1000px)"
                            srcset="
                                ${desktop}
                            "
                        />
                        <source
                            media="(min-width: 700px)"
                            srcset="
                                ${tablet}
                            "
                        />
                        <img
                            loading="lazy"
                            src="${mobile}"
                            alt="${name}"
                            class="${className}"
                        />
                    </picture>`;
}

function createGallery({ first, second, third }, name) {
    const galleryGrid = document.querySelector(".product__gallery-grid");
    let gallery =
        `<div class="product__gallery product__gallery-1">` +
        createPicture(
            name,
            "product__gallery-image-1 product__gallery-image",
            first
        ) +
        `</div ><div class="product__gallery product__gallery-2">` +
        createPicture(
            name,
            "product__gallery-image-2 product__gallery-image",
            second
        ) +
        `</div ><div class="product__gallery product__gallery-3">` +
        createPicture(
            name,
            "product__gallery-image-3 product__gallery-image",
            third
        ) +
        `</div >`;

    galleryGrid.innerHTML = gallery;
}

function createSuggestionCards(suggestions) {
    const suggestionsGrid = document.querySelector(".suggestions__grid");
    suggestions.forEach(
        ({ slug, name, image }) =>
            (suggestionsGrid.innerHTML +=
                `<div class="suggestions__card">` +
                createPicture(name, "suggestions__image", image) +
                `<h3 class="suggestions__h3">${name}</h3>
                        <a
                            href="./product.html"
                            class="btn btn--peach"
                            data-link="product"
                            data-item="${slug}"
                            data-name="${name.toLowerCase()}"
                            >see product</a
                        >
                    </div>`)
    );
}

function addToCart(event) {
    let quantity = parseInt(
        document.querySelector(".product__quantity").textContent
    );
    let price = document
        .querySelector(".product__price-number")
        .textContent.replace(",", "");
    let name = event.target.dataset.name;
    let slug = event.target.dataset.slug;

    let object = cart.find((item) => item.name === name);

    this.classList.add("add-to-cart-animation");
    this.textContent = `successfully added to cart !`;
    setTimeout(() => {
        this.classList.remove("add-to-cart-animation");
    }, 700);

    if (object) {
        cart = cart.map((item) =>
            item.name === name
                ? { ...item, quantity: item.quantity + quantity }
                : item
        );
    } else {
        cart = [...cart, { name, slug, quantity, price }];
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBasket();
}

function addToCartListeners() {
    const toCartBtns = [...document.querySelectorAll(".add-to-cart")];
    toCartBtns.forEach((btn) => btn.addEventListener("click", addToCart));
}

async function populateProductPage() {
    const productCard = document.querySelector(".product__card");
    const productInfo = document.querySelector(".product__info");
    const productItems = document.querySelector(".product__items");
    const productName = localStorage.getItem("product-name");
    const productSlug = localStorage.getItem("product");

    const products = await productsJSONData;
    let {
        name,
        image,
        description,
        features,
        gallery,
        includes,
        new: isNewItem,
        price,
        others,
    } = products.find((obj) => obj.slug === productSlug);
    features = features.split("\n");
    let newItem = isNewItem
        ? `<p class="overline text--peach product__overline">
                            new product
                        </p>`
        : "";
    let mainPicture = createPicture(name, "product__image", image);

    let imageContainer = `<div class="product__image-container">
                    ${mainPicture}
                </div>
                <div class="product__text-container">
                    <div class="product__text-block">
                        ${newItem}
                        <h1 class="product__h1">${name}</h1>
                        <p class="product__p">
                            ${description}
                        </p>
                        <p class="product__price">$&nbsp;<span class="product__price-number">${price.toLocaleString(
                            "en-US"
                        )}</span></p>
                        <div class="product__buttons">
                            <div class="product__amount-container">
                                <button class="product__subtract">-</button>
                                <p class="product__quantity">1</p>
                                <button class="product__add">+</button>
                            </div>
                            <button class='btn btn--peach add-to-cart' data-name="${productName}"data-slug="${productSlug}">
                                add to cart
                            </button>
                        </div>
                    </div>
                </div>
        `;

    let items = includes.reduce((acc, { quantity, item }) => {
        return (
            acc +
            `<p class="product__item product__para">
                            <span class="product__item-number text--peach">
                                ${quantity}x
                            </span>
                            ${item}
                        </p>`
        );
    }, "");

    createSuggestionCards(others);
    createGallery(gallery, name);

    productCard.innerHTML = imageContainer;
    productInfo.innerHTML += `<p class="product__features product__para">${features[0]}<br/><br/>${features[2]}</p>`;
    productItems.innerHTML = items;

    document
        .querySelector(".product__amount-container")
        .addEventListener("click", updateQuantity);

    createProductListeners();
    addToCartListeners();
}

//CART

function updateCartBasket() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartBasket.innerHTML = "";
    let total = 0;

    cart.forEach(({ name: productName, slug, quantity, price }) => {
        let product = document.createElement("div");
        product.classList = "cart__product";
        product.innerHTML = `<img
                                        src="./assets/cart/image-${slug}.jpg"
                                        alt="${productName}"
                                        class="cart__image"
                                    />
                                    <div class="cart__text-block">
                                        <p class="cart__name">${productName}</p>
                                        <p class="cart__price">$ &nbsp; ${price}</p>
                                    </div>
                                    <div class="cart__amount-container">
                                        <button class="cart__subtract">
                                            -
                                        </button>
                                        <p class="cart__product-quantity">${quantity}</p>
                                        <button class="cart__add">+</button>
                                    </div>`;
        cartBasket.appendChild(product);
        total += price * quantity;
    });

    basketQuantity.innerHTML = cart.length;
    updateCartQuantityBubble(cart.length);
    grandTotal.innerHTML = `$ &nbsp;${total.toLocaleString("en")}`;
    createProductQuantityListeners();
    toggleEmptyCartCard();
}

function updateCartQuantityBubble(quantity) {
    if (!quantity) {
        cartQuantityDisplay.textContent = "";
    } else {
        cartQuantityDisplay.textContent = quantity;
    }
}

// SUMMARY

function populateCheckoutInfo() {
    if (!body.classList.contains("checkout__body")) {
        return;
    }
    const totalPrice = document.querySelector(".summary__total-cost");
    const vatPrice = document.querySelector(".summary__vat");
    const grandTotalPrice = document.querySelector(
        ".summary__grand-total-cost"
    );

    const productContainer = document.querySelector(".summary__container");
    productContainer.innerHTML = "";
    let total = 0;
    const SHIPPING_COST = 50;

    const receiptItem = document.querySelector(".checkout__receipt-item");

    const receiptPrice = document.querySelector(".checkout__receipt-price");

    const radioButtons = [...document.querySelectorAll('input[type="radio"]')];
    radioButtons.forEach((button) =>
        button.addEventListener("change", handleRadioButtons)
    );

    cart.forEach(({ name: productName, slug, quantity, price }, index) => {
        let product = document.createElement("div");
        product.classList = "summary__product";
        product.innerHTML = `<img
                                        src="./assets/cart/image-${slug}.jpg"
                                        alt="${productName}"
                                        class="summary__image"
                                    />
                                    <div class="summary__text-block">
                                        <p class="summary__name">${productName}</p>

                                        
                                        <p class="summary__price">$ &nbsp; ${formatNumber(
                                            price
                                        )}</p>
                                        
                                        </div>
                                        
                                        <p class="summary__quantity">x${quantity}</p>

                                    `;
        productContainer.appendChild(product);
        if (index === 0) {
            receiptItem.appendChild(product);
        } else {
            receiptAccordian.appendChild(product);
        }
        total += price * quantity;
    });

    let vat = total / 5;
    let grandTotal = total + SHIPPING_COST;

    totalPrice.innerHTML = `$ &nbsp; ${formatNumber(total)}`;
    vatPrice.innerHTML = `$ &nbsp; ${formatNumber(vat)}`;
    grandTotalPrice.innerHTML = `$ &nbsp; ${formatNumber(grandTotal)}`;
    receiptPrice.innerHTML = `$ &nbsp; ${formatNumber(grandTotal)}`;
    insertButtonText();
}

function handleRadioButtons(event) {
    let eMoney = document.querySelector(".checkout__e-money");
    let cash = document.querySelector(".checkout__cash");
    let eMoneyBorder = document.querySelector(".checkout__radio-emoney");
    let cashBorder = document.querySelector(".checkout__radio-COD");
    let eMoneySpan = document.querySelector(".span__emoney");
    let cashSpan = document.querySelector(".span__COD");
    let checkedRadio = event.target.id;
    const radioInputs = [...document.querySelectorAll(".checkout__radio")];
    const checkoutError = document.querySelector(".checkout__error");

    if (checkedRadio === "e-money") {
        eMoney.classList.remove("hidden");
        cash.classList.add("hidden");
        eMoneyBorder.classList.add("checkout__radio--peach");
        cashBorder.classList.remove("checkout__radio--peach");
        eMoneySpan.classList.add("checked");
        cashSpan.classList.remove("checked");
    }
    if (checkedRadio === "cash") {
        cash.classList.remove("hidden");
        eMoney.classList.add("hidden");
        eMoneyBorder.classList.remove("checkout__radio--peach");
        cashBorder.classList.add("checkout__radio--peach");
        eMoneySpan.classList.remove("checked");
        cashSpan.classList.add("checked");
    }
    radioInputs.forEach((input) => input.classList.remove("error"));
    checkoutError.classList.remove("error");
}

function formatNumber(number) {
    const options = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    return Number(number).toLocaleString("en", options);
}

//CHECKOUT
function validateForm() {
    const name = document.querySelector("#name");
    const address = document.querySelector("#address");
    const zipCode = document.querySelector("#zip-code");
    const city = document.querySelector("#city");
    const country = document.querySelector("#country");
    let strings = [name, address, city, country, zipCode];

    let count = 0;

    if (!validatePayment()) count++;
    if (!validateEmail()) count++;
    if (!validateString(strings)) count++;

    return count === 0;
}

function validateString(strings) {
    let count = 0;

    strings.forEach((input) => {
        let errorMessage = input.parentNode.querySelector(".checkout__error");
        let label = input.parentNode.querySelector(".checkout__label");

        if (!input.value) {
            input.classList.add("error");
            errorMessage.classList.add("error");
            label.classList.add("error");
            count++;
        } else {
            input.classList.remove("error");
            errorMessage.classList.remove("error");
            label.classList.remove("error");
        }
    });

    return count === 0;
}

function validateEmail() {
    const email = document.querySelector("#email");
    let label = email.parentNode.querySelector(".checkout__label");

    let errorMessage = document.querySelector(".checkout__error--email");

    let mailRegex =
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (mailRegex.test(email.value)) {
        errorMessage.classList.remove("error");
        label.classList.remove("error");
        email.classList.remove("error");
        return true;
    }

    errorMessage.classList.add("error");
    email.classList.add("error");
    label.classList.add("error");
    return false;
}

function validatePayment() {
    const radioButtons = [...document.querySelectorAll('input[type="radio"]')];
    const checkedRadioButton = radioButtons.find((button) => button.checked);
    const radioInputs = [...document.querySelectorAll(".checkout__radio")];

    const paymentError = document.querySelector(".checkout__error--payment");
    paymentError.classList.remove("error");

    if (checkedRadioButton?.id === "e-money") {
        if (!validateEmoney()) {
            return false;
        }
    }

    if (!checkedRadioButton) {
        radioInputs.forEach((input) => input.classList.add("error"));
        paymentError.classList.add("error");
        return false;
    } else {
        radioInputs.forEach((input) => input.classList.remove("error"));
        paymentError.classList.remove("error");

        return true;
    }
}

function validateEmoney() {
    const pin = document.querySelector("#pin");
    const pinError = pin.parentElement.querySelector(".checkout__error");

    const number = document.querySelector("#e-money-number");
    const numberError = number.parentElement.querySelector(".checkout__error");

    const pinRegex = /^[0-9]{4}$/;
    const numberRegex = /^[0-9]{9}$/;

    let count = 0;

    if (pin.value.match(pinRegex)) {
        pin.classList.remove("error");
        pinError.classList.remove("error");
    } else {
        pin.classList.add("error");
        pinError.classList.add("error");
        count++;
    }
    if (number.value.match(numberRegex)) {
        number.classList.remove("error");
        numberError.classList.remove("error");
    } else {
        number.classList.add("error");
        numberError.classList.add("error");
        count++;
    }
    return count === 0;
}

function handleSubmit() {
    let formIsValid = validateForm();
    let scrollTarget = formIsValid
        ? document.querySelector("#checkout")
        : document.querySelector(".error");
    if (formIsValid) {
        checkoutModal.classList.add("open");
        body.classList.add("nav-is-open");
        emptyCart(null, true);
    }
    scrollTarget.scrollIntoView();
}

//ACCORDIAN

function toggleAccordian() {
    const receiptContainer = document.querySelector(
        ".checkout__receipt-container"
    );
    const browserWidth = document.body.offsetWidth;
    receiptAccordian.classList.toggle("show");

    if (receiptAccordian.classList.contains("show")) {
        receiptAccordian.style.height = "auto";
        let height = receiptAccordian.clientHeight;
        receiptAccordian.style.height = 0;
        if (browserWidth > 599) {
            receiptContainer.style.marginTop = "150%";
        }

        setTimeout(() => {
            receiptAccordian.style.height = height + "px";
        }, 0);
    } else {
        setTimeout(() => {
            receiptAccordian.style.height = 0;
            receiptContainer.style.marginTop = 0;
        }, 0);
    }
    insertButtonText();
}

function insertButtonText() {
    let items = receiptAccordian.children.length;

    if (receiptAccordian.classList.contains("show")) {
        accordianBtn.textContent = "view less";
        return;
    }
    if (!items) {
        accordianBtn.style.display = "none";
        return;
    }
    if (items === 1) {
        accordianBtn.textContent = `and ${items} other item`;
        return;
    }
    if (items > 1) {
        accordianBtn.textContent = `and ${items} other items`;
        return;
    }
}

//EVENT LISTENERS
hamburgerBtn.addEventListener("click", handleHam);
cartBtn.addEventListener("click", handleCartModal);
emptyCartBtn.addEventListener("click", emptyCart);
submitBtn?.addEventListener("click", handleSubmit);
accordianBtn?.addEventListener("click", toggleAccordian);
document.addEventListener("DOMContentLoaded", () => {
    if (body.classList.contains("product-page")) {
        populateProductPage();
    }

    createProductListeners();
    updateCartBasket();
    populateCheckoutInfo();
});
