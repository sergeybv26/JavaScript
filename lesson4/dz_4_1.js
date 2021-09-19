/*
1. Написать функцию, преобразующую число в объект. 
Передавая на вход число от 0 до 999, надо получить на выходе объект, 
в котором в соответствующих свойствах описаны единицы, десятки и сотни. 
Например, для числа 245 надо получить следующий объект: {‘единицы’: 5, ‘десятки’: 4, ‘сотни’: 2}. 
Если число превышает 999, необходимо выдать соответствующее сообщение с помощью console.log и 
вернуть пустой объект
*/

function numberToObject(num) {
    let obj = {};
    if (num < 1000) {
        obj.units = num % 10;
        obj.decade = Math.floor((num % 100) / 10);
        obj.hundreds = Math.floor(num / 100); 
        return obj;
    } else {
        console.log('Число не должно превышать 999');
        return obj;
    }
}

userNumber = prompt('Введите число', 0);
console.log(userNumber);
resultObject = numberToObject(userNumber);
console.log(resultObject);
