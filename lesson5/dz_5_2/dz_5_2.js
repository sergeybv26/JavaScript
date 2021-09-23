/*
2. Сделать генерацию корзины динамической: верстка корзины не должна находиться в HTML-структуре. 
Там должен быть только div, в который будет вставляться корзина, сгенерированная на базе JS:
Пустая корзина должна выводить строку «Корзина пуста»;
Наполненная должна выводить «В корзине: n товаров на сумму m рублей».
*/

let cart = {
    product : [],
    cost : function() {
        let costCart = 0;
        for (let elem of this.product) {
            costCart += elem.productCostInCart;
        }
        return costCart;
    },
    cartStatus : 'Empty', // Статус корзины (Empty - пустая, New - добавлен товар)
    makeOrder : function() {
        this.cartStatus = 'Empty';
        for (let elem of this.product) {
            elem.productInCart = 0;
            elem.productCostInCart = 0;
        }
        this.product = [];
    }
}

let productCard = {
    productName : 'Системный блок',
    productPrice : 50000,
    productInCart : 0,
    productCostInCart : 0,
    quantityOnStore : 5, // Количество на складе
    productStatus : 'onStore', // Статус товара (onStore - на складе, out of stock - нет в наличии)
    addInCart : function(quantity) { // Функция добавления в корзину
        if (this.deleteFromStore(quantity)) {
            this.productInCart += quantity;
            this.productCostInCart = this.productInCart * this.productPrice;
            if (cart.product.indexOf(this) < 0) {
                cart.product.push(this);
                cart.cartStatus = 'New';
            }
            createCart();
        }
    },
    deleteFromCart : function(quantity) { // Функция удаления из корзины
        if (this.productInCart >= quantity) {
            this.productInCart -= quantity;
            this.productCostInCart = this.productInCart * this.productPrice;
            this.addOnStore(quantity);
            if (this.productInCart < 1) {
                let indx = cart.product.indexOf(this);
                if (indx >= 0) {
                    cart.product.splice(indx, 1);
                }
                if (cart.product.length === 0) {
                    cart.cartStatus = 'Empty';
                }
            }
            createCart();
        } else {
            console.log('Количество исключаемого продукта из корзины не может превышать количества добавленного');
        }
    },
    addOnStore : function(quantity) {
        this.quantityOnStore += quantity;
        if (this.quantityOnStore > 0) {
            this.productStatus = 'onStore';
        }
    },
    deleteFromStore : function(quantity) {
        if (this.quantityOnStore >= quantity) {
            this.quantityOnStore -= quantity;
            if (this.quantityOnStore === 0) {
                this.productStatus = 'out of stock';
            }
            return true;
        } else {
            console.log('На складе недостаточно товара');
            return false;
        }
    }
}

function createCart() {
    let cartElement = document.getElementById('cart');
    if (cart.cartStatus == 'Empty') {
        cartElement.innerText = 'Корзина пуста';
    } else {
        cartElement.innerText = `В корзине: ${cart.product.length} товаров на сумму ${cart.cost()} рублей`;
    }
}

function init() {
    createCart();
}

window.onload = init;

/*Тестовый вызов функции добавления в корзину
productCard.addInCart(3);
*/
