/*
4 * Сделать так, чтобы товары в каталоге выводились при помощи JS:
Создать массив товаров (сущность Product);
При загрузке страницы на базе данного массива генерировать вывод из него. 
HTML-код должен содержать только div id=”catalog” без вложенного кода. 
Весь вид каталога генерируется JS.
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
    productName : '',
    productPrice : 0,
    productInCart : 0,
    productCostInCart : 0,
    productImage : '', // ссылка на изображение
    catalogId : 0, // индекс в каталоге
    quantityOnStore : 0, // Количество на складе
    productStatus : 'out of stock', // Статус товара (onStore - на складе, out of stock - нет в наличии)
    addInCart : function(quantity) { // Функция добавления в корзину
        if (this.deleteFromStore(quantity)) {
            this.productInCart += quantity;
            this.productCostInCart = this.productInCart * this.productPrice;
            if (cart.product.indexOf(this) < 0) {
                cart.product.push(this);
                cart.cartStatus = 'New';
            }
            //createCart();
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
            //createCart();
        } else {
            console.log('Количество исключаемого продукта из корзины не может превышать количества добавленного');
        }
    },
    addOnStore : function(quantity) {
        this.quantityOnStore += quantity;
        if (this.quantityOnStore > 0) {
            this.productStatus = 'onStore';
        }
        changePageCatalog(this.catalogId);
    },
    deleteFromStore : function(quantity) {
        if (this.quantityOnStore >= quantity) {
            this.quantityOnStore -= quantity;
            if (this.quantityOnStore === 0) {
                this.productStatus = 'out of stock';
            }
            changePageCatalog(this.catalogId);
            return true;
        } else {
            console.log('На складе недостаточно товара');
            return false;
        }
    }
}

let catalog = [];
let flag = 0;

function addInCatalog(name, price, quantity, image) {
    if (catalog.length > 0) {
        for (let elem of catalog) {
            if (elem.productName === name) {
                flag = 1;
                break;
            }
        }
        if (flag === 0) {
            product = { ...productCard };
            product.productName = name;
            product.productPrice = price;
            product.productImage = image;
            catalog.push(product);
            product.catalogId = catalog.length - 1;
            addToPageCatalog(product.catalogId);
            product.addOnStore(quantity);
        } else {
            console.log('Данный товар уже добавлен в каталог');
            flag = 0;
        }   
    } else {
        product = { ...productCard };
        product.productName = name;
        product.productPrice = price;
        product.productImage = image;
        catalog.push(product);
        product.catalogId = catalog.length - 1;
        addToPageCatalog(product.catalogId);
        product.addOnStore(quantity);
    }
}

function changePageCatalog(indx) {
    let catElement = document.getElementById(`${indx}`);
    catElement.innerHTML = `<p>Наименование товара: ${catalog[indx].productName}</p>
        <p>Стоимость товара: ${catalog[indx].productPrice} рублей</p>
        <p>Наличие: ${catalog[indx].quantityOnStore} шт.</p> <br>`;
}

function addToPageCatalog(indx) {
    let catElement = document.createElement('div');
    catElement.className = 'product';
    catElement.id = `${indx}`
    catElement.innerHTML = `<p>Наименование товара: ${catalog[indx].productName}</p>
        <p>Стоимость товара: ${catalog[indx].productPrice} рублей</p>
        <p>Наличие: ${catalog[indx].quantityOnStore} шт.</p> <br>`;
    document.getElementById('catalog').appendChild(catElement);
}

function createPageCatalog() {
    for (let indx in catalog) {
        addToPageCatalog(indx);
    }
}

function init() {
    createPageCatalog();
}

window.onload = init;

/* Далее будут несколько команд для тестового наполнения каталога
addInCatalog('Системный блок', 50000, 5, '');
addInCatalog('Монитор', 12000, 10, '');
addInCatalog('Принтер', 8000, 3, '')*/
