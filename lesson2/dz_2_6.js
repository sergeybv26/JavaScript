/*
6. Реализовать функцию с тремя параметрами: function mathOperation(arg1, arg2, operation), 
где arg1, arg2 — значения аргументов, operation — строка с названием операции. 
В зависимости от переданного значения выполнить одну из арифметических операций (использовать функции из пункта 5) и 
вернуть полученное значение (применить switch).
*/

function additionNumber(num1, num2) {
	num1 = Number(num1);
	num2 = Number(num2);
	return num1 + num2;
}

function subtractionNumber(num1, num2) {
	return num1 - num2;
}

function multiplicationNumber(num1, num2) {
	return num1 * num2;
}

function divisionNumber(num1, num2) {
	return num1 / num2;
}

function mathOperation(arg1, arg2, operation) {
	switch (operation) {
		case '+':
			return additionNumber(arg1, arg2);
			break;
		case '-':
			return subtractionNumber(arg1, arg2);
			break;
		case '*':
			return multiplicationNumber(arg1, arg2);
			break;
		case '/':
			return divisionNumber(arg1, arg2);
			break;
	}
}
