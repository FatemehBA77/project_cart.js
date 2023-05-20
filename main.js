const hamberBtn = document.querySelector(".humberguer");
const mobileMenu = document.querySelector(".mobile-nav");
const closeBtn = document.querySelector(".fa-window-close");
const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".back_drop");
const closeModal = document.querySelector(".cart_footer_rigth2");
const comfirmModal = document.querySelector(".cart_footer_rigth1");
const productDom = document.querySelector(".product-center");
const cartTotal = document.querySelector(".cart-total");
const cartItem = document.querySelector(".cart-item");
const cartContainer = document.querySelector(".cart_container");
const clearCart = document.querySelector(".cart_footer_rigth2");
import { productsData } from "./product.js";

let cart = [];
let buttonDom = [];
// get product
class Products {
  // دیتاهایی که برای اولین بار میخوادلود بشه رو بگیره و نمایش بده
  // این دیتاها میتونه از یک apiهم باشه
  getProducts() {
    return productsData;
    // return axios.getData : request to backend
  }
}

// display product
class UI {
  displayProduct(products) {
    let result = "";
    products.forEach((item) => {
      result += `<section class="product">
      <div class="img-container">
        <img class="product-img" src=${item.imageUrl} />
      </div>
      <div class="product-desc">
        <p class="product-title">${item.title}</p>
        <p class="product-price">${item.price}<span>$</span></p>
      </div>
      <button class="add-to-cart" data-id=${item.id}>
        <i class="fa-solid fa-cart-shopping"></i>add to cart
      </button>
    </section>`;
      productDom.innerHTML = result;
    });
  }
  getAddToCartBtn() {
    // خروجی نودلیست است که باید به ارایه تبدیل کنیم
    const addTocartBtns = [...document.querySelectorAll(".add-to-cart")];
    buttonDom = addTocartBtns;
    console.log(addTocartBtns); //it display node list for convert => array
    addTocartBtns.forEach((btn) => {
      const id = btn.dataset.id;
      // check in product in cart or not
      const IsinCart = cart.find((p) => p.id === parseInt(id));
      if (IsinCart) {
        btn.innerText = "In Cart";
        btn.disable = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disable = true;
        // get product from products:
        const addedProduct = { ...Storage.getProductStorage(id), quantity: 1 };
        // add to cart
        cart = [...cart, addedProduct];
        //  save cart to local storage
        Storage.saveCart(cart);
        this.setCartValue(cart);
        this.addCartItem(addedProduct);
      });
    });
    console.log(buttonDom);
  }

  setCartValue(cart) {
    let tempCartItem = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItem += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `total Price : ${totalPrice.toFixed(2)} $`;
    cartItem.innerText = tempCartItem;
  }
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("content_cart");
    div.innerHTML = `
    <div class="image_content">
    <img src=${cartItem.imageUrl} alt="" />
  </div>
  <div class="text_content">
    <p>${cartItem.title}</p>
    <p class="text_content_2">${cartItem.price}<span>$</span></p>
  </div>
  <div class="icon_content">
    <i class="fa-solid fa-caret-up" data-id=${cartItem.id}></i>
    <p>${cartItem.quantity}</p>
    <i class="fa-sharp fa-solid fa-caret-down" data-id=${cartItem.id}></i>
  </div>
  <div class="iconLast_content">
    <i class="fa-sharp fa-solid fa-trash" data-id=${cartItem.id}></i>
  </div>`;
    cartContainer.appendChild(div);
  }
  setupApp() {
    // get cartfrom stroge
    cart = Storage.getCart() || [];
    // add cart item
    cart.forEach((cartItem) => this.addCartItem(cartItem));
    this.setCartValue(cart);
  }
  cartLogic() {
    // clear cart
    clearCart.addEventListener("click", () => {
      this.clearCart();
    });
    cartContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("fa-caret-up")) {
        console.log(event.target.dataset.id);
        const addQuantiy = event.target;
        const addedItem = cart.find(
          (cItem) => cItem.id == addQuantiy.dataset.id
        );
        addedItem.quantity++;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        addQuantiy.nextElementSibling.innerText = addedItem.quantity;
      } else if (event.target.classList.contains("fa-trash")) {
        const removeItem = event.target;
        const _removedItem = cart.find((c) => c.id == removeItem.dataset.id);
        this.removeItem(_removedItem.id);
        Storage.saveCart(cart);
        cartContainer.removeChild(removeItem.parentElement.parentElement);
      } else if (event.target.classList.contains("fa-caret-down")) {
        const subQuantity = event.target;
        const substractedItem = cart.find(
          (cItem) => cItem.id == subQuantity.dataset.id
        );
        if (substractedItem.quantity === 1) {
          this.removeItem(substractedItem.id);
          cartContainer.removeChild(subQuantity.parentElement.parentElement);
          return;
        }
        substractedItem.quantity--;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        subQuantity.previousElementSibling.innerText = substractedItem.quantity;
      }
    });
  }
  clearCart() {
    cart.forEach((cItem) => this.removeItem(cItem.id));
    while (cartContainer.children.length) {
      cartContainer.removeChild(cartContainer.children[0]);
    }
    closeModalFunc();
  }
  removeItem(id) {
    cart = cart.filter((cItem) => cItem.id !== id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    this.getSingleButton(id);
  }
  getSingleButton(id) {
    const button = buttonDom.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = `add to cart`;
    button.disable = false;
  }
}

// save in localStroge

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProductStorage(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  console.log(productsData);
  const ui = new UI();
  ui.setupApp();
  ui.displayProduct(productsData);
  ui.getAddToCartBtn();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});

cartBtn.addEventListener("click", showModalFunc);
backDrop.addEventListener("click", closeModalFunc);
closeModal.addEventListener("click", closeModalFunc);
comfirmModal.addEventListener("click", () => {
  closeModalFunc();
  alert("your request accepted");
});
function closeModalFunc() {
  backDrop.style.display = "none";
  cartModal.style.top = "-100px";
  cartModal.style.opacity = "0";
}
function showModalFunc() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}
hamberBtn.addEventListener("click", function () {
  hamberBtn.classList.toggle("is-active");
  mobileMenu.classList.toggle("is-active");
});
closeBtn.addEventListener("click", () => {
  hamberBtn.classList.toggle("is-active");
  mobileMenu.classList.toggle("is-active");
});
