/*
4. *Нарисовать пирамиду с помощью console.log, 
как показано на рисунке, только у вашей пирамиды должно быть 20 рядов, а не 5
*/

console.log('Task 4');

var ROW = 20;
var quantity = 1;
var str = '';

for (var i = 0; i < ROW; i++) {
    quantity += i;
    for (var j = 0; j < quantity; j++){
        str += '*';
    }
    console.log(str);
    str = '';
    quantity = 1;
}
