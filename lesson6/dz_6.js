/*
1. Продолжаем реализовывать модуль корзины:

a. Добавлять в объект корзины выбранные товары по клику на кнопке «Купить» без перезагрузки страницы;

b. Привязать к событию покупки товара пересчет корзины и обновление ее внешнего вида.
2. (*) У товара может быть несколько изображений. Нужно:

a. Реализовать функционал показа полноразмерных картинок товара в модальном окне;

b. Реализовать функционал перехода между картинками внутри модального окна.
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
    productImage : false, // наличие изображения
    productOnCartPage : false, // флаг добавления на страницу заказа
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

function productCreateHtml(indx) {
    return `<h3>${catalog[indx].productName}</h3>
    <div class="img_big" id="big_img${indx}">
        <img class="big_img" src="img/${parseInt(indx) + 1}_1_b.jpg" alt="${catalog[indx].productName}">
    </div>
    <div class="img_carusel">
        <img src="img/${parseInt(indx) + 1}_1_s.jpg" data-seed = "${parseInt(indx) + 1}_1" alt="${catalog[indx].productName}_s">
        <img src="img/${parseInt(indx) + 1}_2_s.jpg" data-seed = "${parseInt(indx) + 1}_2" alt="${catalog[indx].productName}_s">
        <img src="img/${parseInt(indx) + 1}_3_s.jpg" data-seed = "${parseInt(indx) + 1}_3" alt="${catalog[indx].productName}_s">
        <img src="img/${parseInt(indx) + 1}_4_s.jpg" data-seed = "${parseInt(indx) + 1}_4" alt="${catalog[indx].productName}_s">
    </div>
    <p>Стоимость товара: ${catalog[indx].productPrice} рублей</p>
    <p>Наличие: ${catalog[indx].quantityOnStore} шт.</p> <br>
    <button class="buy_button" id="buy${indx}" data-seed="${indx}">Купить</button>`;
}


function openImage(event){
    console.log(event)
    let target = event.target;
    let seed = target.dataset.seed;

    if (!seed) {
        return;
    }

    let bigImage = document.getElementById(`big_img${seed[0] - 1}`);
    bigImage.innerHTML = '';

    let image = document.createElement('img');
    image.className = "big_img";
    image.src = `img/${seed}_b.jpg`;
    image.alt = `${catalog[seed[0] - 1].productName}`;

    bigImage.appendChild(image);
}

function buy_activ(event) {
    console.log(event)
    let target = event.target;
    let seed = parseInt(target.dataset.seed);
    catalog[seed].addInCart(1);
}

function changePageCatalog(indx) {
    let catElement = document.getElementById(`${indx}`);
    catElement.innerHTML = productCreateHtml(indx);
}

function addToPageCatalog(indx) {
    let catElement = document.createElement('div');
    catElement.className = 'product';
    catElement.id = `${indx}`
    catElement.innerHTML = productCreateHtml(indx);
    document.getElementById('catalog').appendChild(catElement);

}

function createPageCatalog() {
    testData(); // для заполнения тестовыми данными.
    /*for (let indx in catalog) {
        addToPageCatalog(indx);
    }*/
}

function createCart() {
    let cartObj = document.getElementById('cart');
    
    if (cart.cartStatus == 'Empty') {
        cartObj.innerHTML = '<p>Корзина пуста</p>';
        return;
    }

    cartObj.innerHTML = '';
    for (let i = 0; i < cart.product.length; i++) {
        let element = cart.product[i];
        let cartText = `${element.productName} - ${element.productInCart} шт. - ${element.productCostInCart} рублей`;
   
        let cartElement = document.createElement('div');
        cartElement.id = `cart${element.catalogId}`;
        cartElement.innerText = cartText;
        cartObj.appendChild(cartElement);
        element.productOnCartPage = true;
    }
    cartElement = document.createElement('div');
    cartElement.id = 'cart_footter';
    cartElement.innerText = `В корзине: ${cart.product.length} товаров на сумму ${cart.cost()} рублей`;
    cartObj.appendChild(cartElement);
}

function init() {
    createPageCatalog();
    
    let images = document.querySelectorAll('.img_carusel > img');
    console.log(images);
    for (let image of images) {
        image.addEventListener('click', openImage);
    }

    let buy_buttons = document.querySelectorAll('.buy_button');
    console.log(buy_buttons);
    for (let buy_button of buy_buttons){
        buy_button.addEventListener('click', buy_activ);
    }
    
    createCart(0);
}

window.addEventListener('load', init);


// Добавим функцую заполнения каталога тестовыми данными

function testData() {
    addInCatalog('Системный блок', 50000, 5, true);
    addInCatalog('Монитор', 12000, 10, true);
    addInCatalog('Принтер', 8000, 3, true);
}
