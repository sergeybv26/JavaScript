/*
3. * Заполнить созданную таблицу буквами, отвечающими за шахматную фигуру, 
например К – король, Ф – ферзь и т.п., 
причем все фигуры должны стоять на своих местах и быть соответственно черными и белыми
*/

let chessFigure = ['Л', 'К', 'С', 'Ф', 'Кор', 'П'];

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
            let classText = 'black_text'
            if (i === 1 || i === 2) {
                classText = 'white_text';
            }
            if (i === 1 || i === 8) {
                if (code === 97 || code === 104) {
                    elementTd.innerHTML = `<p class = '${classText}'>${chessFigure[0]} </p>`;
                } else if (code === 98 || code === 103) {
                    elementTd.innerHTML = `<p class = '${classText}'>${chessFigure[1]} </p>`;
                } else if (code === 99 || code === 102) {
                    elementTd.innerHTML = `<p class = '${classText}'>${chessFigure[2]} </p>`;
                } else if (code === 100) {
                    elementTd.innerHTML = `<p class = '${classText}'>${chessFigure[3]} </p>`;
                } else if (code === 101) {
                    elementTd.innerHTML = `<p class = '${classText}'>${chessFigure[4]} </p>`;
                }
            } else if (i === 2 || i === 7) {
                elementTd.innerHTML = `<p class = '${classText}'>${chessFigure[5]} </p>`;
            }
            
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
                        '.chess_board tr td {border: 1px solid; width: 5em; height: 5em; text-align: center; vertical-align: middle; background: #b58863;}' +
                        '.chess_board tr:nth-child(odd) td:nth-child(even) {background: #f0d9b5;}' + 
                        '.chess_board tr:nth-child(even) td:nth-child(odd) {background: #f0d9b5;}' +
                        '.white_text {color: white}';
    document.head.appendChild(styleNode);
    
}

function init() {
    createBoard();
}

window.onload = init;
