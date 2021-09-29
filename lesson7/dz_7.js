/*
1. Реализовать страницу корзины. Добавить возможность не только смотреть состав корзины, но и редактировать его, 
обновляя общую стоимость или выводя сообщение «Корзина пуста»:
1.1 Сделать отдельные блоки «Состав корзины», «Адрес доставки», «Комментарий»;
1.2 Сделать эти поля сворачиваемыми;
1.3 Заполнять поля по очереди, то есть давать посмотреть состав корзины, внизу которого есть кнопка «Далее». 
Если нажать ее, сворачивается «Состав корзины» и открывается «Адрес доставки» и так далее.

2. (*) Для задачи со звездочкой из шестого урока реализовать функционал переключения между картинками по стрелкам на клавиатуре
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
        <img class="big_img" src="img/${parseInt(indx) + 1}_1_b.jpg" data-seed="${indx}" alt="${catalog[indx].productName}">
    </div>
    <div class="img_carusel">
        <img src="img/${parseInt(indx) + 1}_1_s.jpg" data-seed = "${parseInt(indx) + 1}_1" alt="${catalog[indx].productName}_s">
        <img src="img/${parseInt(indx) + 1}_2_s.jpg" data-seed = "${parseInt(indx) + 1}_2" alt="${catalog[indx].productName}_s">
        <img src="img/${parseInt(indx) + 1}_3_s.jpg" data-seed = "${parseInt(indx) + 1}_3" alt="${catalog[indx].productName}_s">
        <img src="img/${parseInt(indx) + 1}_4_s.jpg" data-seed = "${parseInt(indx) + 1}_4" alt="${catalog[indx].productName}_s">
    </div>
    <p>Стоимость товара: ${catalog[indx].productPrice} рублей</p>
    <p id="p_prod_${indx}">Наличие: ${catalog[indx].quantityOnStore} шт.</p> <br>
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
    image.setAttribute('data-seed', `${seed[0] - 1}`);
    bigImage.appendChild(image);
}

function buy_activ(event) {
    console.log(event)
    let target = event.target;
    let seed = parseInt(target.dataset.seed);
    catalog[seed].addInCart(1);
}

function addQnt(event) {
    console.log(event);
    let target = event.target;
    let idProductStr = target.attributes.id.value;
    let idProduct = parseInt(idProductStr.slice(1));
    catalog[idProduct].addInCart(1);
}

function remQnt(event) {
    let target = event.target;
    let idProductStr = target.attributes.id.value;
    let idProduct = parseInt(idProductStr.slice(1));
    catalog[idProduct].deleteFromCart(1);
}

var nextFlag = 0;

function nextButton(event) {
    let nextButtonCh = document.getElementById('button_next');
    if (nextFlag < 2) {
        nextFlag++;
    } else {
        cart.makeOrder();
        createCart();
        nextButtonCh.innerText = 'Далее';
        nextFlag = 0;
    }

    switch(nextFlag) {
        case 0:
            document.getElementById('cart').style = 'display: block';
            document.getElementById('address').style = 'display: none';
            document.getElementById('comment').style = 'display: none';
            break;
        case 1:
            document.getElementById('cart').style = 'display: none';
            document.getElementById('address').style = 'display: block';
            document.getElementById('comment').style = 'display: none';
            break;
        case 2:
            document.getElementById('cart').style = 'display: none';
            document.getElementById('address').style = 'display: none';
            document.getElementById('comment').style = 'display: block';
            nextButtonCh.innerText = 'Оформить заказ';
            break;
    }
}

function changePageCatalog(indx) {
    let catElement = document.getElementById(`p_prod_${indx}`);
    catElement.innerText = `Наличие: ${catalog[indx].quantityOnStore} шт.`;
}

function addToPageCatalog(indx) {
    let catElement = document.createElement('div');
    catElement.className = 'product';
    catElement.id = `${indx}`
    catElement.innerHTML = productCreateHtml(indx);
    document.getElementById('catalog').appendChild(catElement);
    //modalWindowCreate(indx);
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
        //addEvent();
        return;
    }

    cartObj.innerHTML = '';
    for (let i = 0; i < cart.product.length; i++) {
        let element = cart.product[i];
        let cartText = `${element.productName} - ${element.productInCart} шт. - ${element.productCostInCart} рублей`;
   
        let cartElement = document.createElement('div');
        cartElement.className = 'cart_element';
        cartElement.id = `cart${element.catalogId}`;
        cartElement.innerHTML = `<p class="cart_p" style="font-size: 20px">${cartText}</p>
            <button class="a_button" id="a${element.catalogId}" style="padding: 10px 20px">+</button>
            <button class="r_button" id="r${element.catalogId}" style="padding: 10px 20px">-</button>`;
        cartObj.appendChild(cartElement);
        element.productOnCartPage = true;
    }
    cartElement = document.createElement('div');
    cartElement.id = 'cart_footter';
    cartElement.innerText = `В корзине: ${cart.product.length} товаров на сумму ${cart.cost()} рублей`;
    cartObj.appendChild(cartElement);
    addEvent();
}

function addEvent() {
    let buy_buttons = document.querySelectorAll('.buy_button');
    console.log(buy_buttons);
    for (let buy_button of buy_buttons){
        buy_button.addEventListener('click', buy_activ);
    }

    let images = document.querySelectorAll('.img_carusel > img');
    console.log(images);
    for (let image of images) {
        image.addEventListener('click', openImage);
    }

    let addElements = document.querySelectorAll('.a_button');
    for (let addElement of addElements) {
        addElement.addEventListener('click', addQnt);
    }

    let remElements = document.querySelectorAll('.r_button');
    for (let remElement of remElements) {
        remElement.addEventListener('click', remQnt);
    }

    let nextButtonEv = document.getElementById('button_next');
    nextButtonEv.addEventListener('click', nextButton);

    /*let modalElements = document.querySelectorAll('.img_big');
    for (let modalElement of modalElements) {
        modalElement.addEventListener('click', modalWindowOpen);
    }*/
}


function init() {
    createPageCatalog();

    addEvent();
    
    createCart(0);
}

window.addEventListener('load', init);


// Добавим функцую заполнения каталога тестовыми данными

function testData() {
    addInCatalog('Системный блок', 50000, 5, true);
    addInCatalog('Монитор', 12000, 10, true);
    addInCatalog('Принтер', 8000, 3, true);
}


// Модальное окно с картинками
/*
function modalWindowCreate(indx) {
    let modalElement = document.createElement('div');
    modalElement.id = `modal${indx}`;
    modalElement.className = 'modal'
    modalElement.style = 'display: none';
    modalElement.innerHTML = `
    <div class="mod_img_big" id="mod_big_img${indx}">
        <img class="mod_big_img" src="img/${parseInt(indx) + 1}_1_b.jpg" data-seed="${indx}" alt="${catalog[indx].productName}">
    </div>
    <div class="modal_img_carusel">
        <img src="img/${parseInt(indx) + 1}_1_s.jpg" data-seed = "${parseInt(indx) + 1}_1" alt="${catalog[indx].productName}_s">
        <img src="img/${parseInt(indx) + 1}_2_s.jpg" data-seed = "${parseInt(indx) + 1}_2" alt="${catalog[indx].productName}_s">
        <img src="img/${parseInt(indx) + 1}_3_s.jpg" data-seed = "${parseInt(indx) + 1}_3" alt="${catalog[indx].productName}_s">
        <img src="img/${parseInt(indx) + 1}_4_s.jpg" data-seed = "${parseInt(indx) + 1}_4" alt="${catalog[indx].productName}_s">
    </div>`;
    document.getElementById('modal_window').appendChild(modalElement);
}

function modalWindowOpen(event) {
    let target = event.target;
    let seed = target.dataset.seed;
    let idProduct = parseInt(seed);

}*/