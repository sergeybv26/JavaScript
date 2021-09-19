/*
3. * Подумать над глобальными сущностями. 
К примеру, сущность «Продукт» в интернет-магазине актуальна не только для корзины, но и для каталога. 
Стремиться нужно к тому, чтобы объект «Продукт» имел единую структуру для различных модулей сайта, 
но в разных местах давал возможность вызывать разные методы
*/

// Частично реализовал во втором задании. Здесь еще немного дополню. Кроме того изменю подсчет стоимости корзины.

var cart = {
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

let productCard2 = { ...productCard };
let productCard3 = { ...productCard };

productCard2.productName = 'Монитор';
productCard2.productPrice = 12000;
productCard2.quantityOnStore = 1;

productCard3.productName = 'Принтер';
productCard3.productPrice = 6000;
productCard3.quantityOnStore = 1;
