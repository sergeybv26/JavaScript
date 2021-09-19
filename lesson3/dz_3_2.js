/*
2. С этого урока начинаем работать с функционалом интернет-магазина. 
Предположим, есть сущность корзины. 
Нужно реализовать функционал подсчета стоимости корзины в зависимости от находящихся в ней товаров. 
Товары в корзине хранятся в массиве. Задачи:

a) Организовать такой массив для хранения товаров в корзине;
b) Организовать функцию countBasketPrice, которая будет считать стоимость корзины
*/

var cartArr = [
    ['Системный блок', 50000],
    ['Монитор', 12000],
    ['Принтер', 6000]
]

function countBasketPrice(cart) {
    var costCart = 0;
    for (var element of cart) {
        costCart += element[1];
    }
    return costCart;
}