/*
1. Создать функцию, генерирующую шахматную доску. Можно использовать любые html-теги. 
Доска должна быть верно разлинована на черные и белые ячейки. 
Строки должны нумероваться числами от 1 до 8, столбцы — латинскими буквами A, B, C, D, E, F, G, H.
*/

function createBoard() {
    let container = document.createElement('div');
    container.className = 'container';
    container.id = 'container';

    document.body.appendChild(container);

    let box = document.createElement('div');
    box.className = 'box';
    box.id = 'box';

    document.getElementById('container').appendChild(box);

    let chessBoard = document.createElement('table');
    chessBoard.className = 'chess_board';
    chessBoard.id = 'chess_board';
    chessBoard.innerHTML = '<table id = "table"><tbody id = "table_body"></tbody></table>';

    document.getElementById('box').appendChild(chessBoard);

    for (let i = 8; i > 0; i--) {
        let elementTr = document.createElement('tr');
        elementTr.id = `tr${i}`;
        let insertString = `<th>${i}</th>`;
        elementTr.innerHTML = insertString;
        document.getElementById('table_body').appendChild(elementTr);
        for (let code = 97; code < 105; code++) {
            let elementTd = document.createElement('td');
            elementTd.id = `${String.fromCharCode(code)}${i}`;
            document.getElementById(`tr${i}`).appendChild(elementTd);
        }
    }

    let elementTr = document.createElement('tr');
    elementTr.innerHTML = '<th></th><th>a</th><th>b</th><th>c</th><th>d</th><th>e</th><th>f</th><th>g</th><th>h</th>';
    document.getElementById('table_body').appendChild(elementTr);

    let styleNode = document.createElement('style');
    styleNode.innerText = '.container {background-color: #EEEEEE; text-align: center}' +
                        '.box {display: inline-block; margin: 0}' + 
                        '.chess_board {border-spacing: 0; border-collapse: collapse}' +
                        '.chess_board tr td {border: 1px solid; width: 5em; height: 5em; text-align: center; vertical-align: middle; background: black;}' +
                        '.chess_board tr:nth-child(odd) td:nth-child(even) {background: white;}' + 
                        '.chess_board tr:nth-child(even) td:nth-child(odd) {background: white;}';
    document.head.appendChild(styleNode);
    
}

function init() {
    createBoard();
}

window.onload = init;
