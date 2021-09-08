/*
1. С помощью цикла while вывести все простые числа в промежутке от 0 до 100
*/

var START_NUM = 2; //Стартовое число принято 2, т.к. простые числа больше 1
var END_NUM = 100;
var nowNum = START_NUM;
var divNum;
var flag = 0;

while (nowNum <= END_NUM) {
    divNum = START_NUM;
    while (divNum <= nowNum) {
        if (nowNum % divNum == 0 && divNum !== nowNum) {
            flag = 1;
            break;
        }
    divNum++;
    }
    if (flag === 0) {
        console.log(nowNum);
    } else {
        flag = 0;
    }
    nowNum++;
}
