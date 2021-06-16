const productsDOM = document.querySelector(".products-center");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const cartOverlay = document.querySelector(".cart-overlay");
const cartDOM = document.querySelector(".cart");
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
let cart = [];
class Product {
    async getProduct() {
        try {
            const result = await fetch("../products.json");
            const data = await result.json();
            let products = data.items;
            products = products.map((item) => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image };
            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

class View {
    displayProducts(products) {
        let result = "";
        products.forEach((item) => {
            result += `
            <article class="product">
            <div class="img-container">
                <img src=${item.image}
                alt= ${item.title}
                class="product-img">
                <button class="bag-btn" data-id=${item.id}>افزودن به سبد خرید</button>
            </div>
            <h3> ${item.title}</h3>
            <h4> ${item.price}</h4>
        </article>
            `;
        });
        productsDOM.innerHTML = result;
    }

    getCartButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttons.forEach((item) => {
            let id = item.dataset.id;
            item.addEventListener("click", (event) => {
                let cartItem = {...Storage.getProduct(id), amount: 1 };
                cart = [...cart, cartItem];
                Storage.saveCart(cart);
                this.setCartValue(cart)
                this.addCartItem(cartItem)
                this.showcart()

            });
        });
    }
    setCartValue(cart) {
        let totalPrice = 0
        let totalItems = 0
        cart.map((item) => {
            totalPrice += item.price * item.amount
            totalItems += item.amount
            cartTotal.innerText = totalPrice
            cartItems.innerText = totalItems
        })

    }
    addCartItem(item) {
        const div = document.createElement('div')
        div.classList.add('cart-item')
        div.innerHTML = `
        <img src=${item.image}
         alt=${item.title}>
                <div>
                    <h4>${item.title}</h4>
                    <h5>${item.price}</h5>
                    <span class="remove-item">حذف</span>
                </div>
                <div>
                    <i class="fas-fa-chevron-up"></i>
                    <p class="item-amount">${item.amount}</p>
                    <i class="fas-fa-chevron-down"></i>
                </div>
        `
        cartContent.appendChild(div)
    }
    showcart() {
        cartOverlay.classList.add('transparentBcg')
        cartDOM.classList.add('showCart')
    }
    initApp() {
        cart = Storage.getCart()
        this.setCartValue(cart)
        this.populate(cart)
        cartBtn.addEventListener('click', this.showcart)
        closeCartBtn.addEventListener('click', this.hideCart)
    }
    populate(cart) {
        cart.forEach((item) => {
            return this.addCartItem(item)
        })
    }
    hideCart() {
        cartOverlay.classList.remove('transparentBcg')
        cartDOM.classList.remove('showCart')

    }
}

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find((item) => item.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : []
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const view = new View();
    const product = new Product();
    view.initApp()
    product
        .getProduct()
        .then((data) => {
            view.displayProducts(data);
            Storage.saveProducts(data);
        })
        .then(() => {
            view.getCartButtons();
        });
});