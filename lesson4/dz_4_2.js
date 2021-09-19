/*
2. Продолжить работу с интернет-магазином:
    a) В прошлом домашнем задании вы реализовали корзину на базе массивов. 
       Какими объектами можно заменить их элементы?
    b) Реализуйте такие объекты.
    c) Перенести функционал подсчета корзины на объектно-ориентированную базу
*/

var cart = [];

let productCard = {
    productName : 'Системный блок',
    productPrice : 50000,
    productInCart : 0,
    productCostInCart : 0,
    addInCart : function(quantity) {
        this.productInCart += quantity;
        this.productCostInCart = this.productInCart * this.productPrice;
        if (cart.indexOf(this) < 0) {
            cart.push(this);
        }
    },
    deleteFromCart : function(quantity) {
        this.productInCart -= quantity;
        this.productCostInCart = this.productInCart * this.productPrice;
        if (this.productInCart < 1) {
            let indx = cart.indexOf(this);
            if (indx >= 0) {
                cart.splice(indx, 1);
            }
        }
    }
}

let productCard2 = { ...productCard };
let productCard3 = { ...productCard };

productCard2.productName = 'Монитор';
productCard2.productPrice = 12000;

productCard3.productName = 'Принтер';
productCard3.productPrice = 6000;

// При добавлении в корзину используется функция addInCart с указанием количества
// Для удаления из корзины используется функция deleteFromCart с указанием количества

function countCartPrice() {
    let costCart = 0;
    for (let elem of cart) {
        costCart += elem.productCostInCart
    }
    return costCart;
}
