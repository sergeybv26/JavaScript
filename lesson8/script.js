const GAME_STATUS_STARTED = 'started';
const GAME_STATUS_PAUSED  = 'paused';
const GAME_STATUS_STOPPED = 'stopped';

const SNAKE_DIRECTION_UP = 'up';
const SNAKE_DIRECTION_DOWN = 'down';
const SNAKE_DIRECTION_LEFT = 'left';
const SNAKE_DIRECTION_RIGHT = 'right';

const SCORE_ON_START = 0;

const START_SNAKE = [
    { top: 0, left: 0 },
    { top: 0, left: 1 },
    { top: 0, left: 2 },
];

const MOVE_DELAY = 1000;


/**
 * Объект с настройками конфигурации игры
 */
const config = {
    /**
     * Размер поля.
     */
    size: 20
};

/**
 * Основной объект игры.
 */
const game = {

    /**
     * Функция ищет HTML элемент контейнера игры на странице.
     *
     * @returns {HTMLElement} Возвращает HTML элемент.
     */
    
    flagStopped: true,
    flagPaused: false,
    delay: MOVE_DELAY,
    timer: {},

    getElement() {
        return document.getElementById('game');
    },

    /**
     * Функция выполняет старт игры.
     */
    start() {
        this.setGameStatus(GAME_STATUS_STARTED);

        if (this.flagPaused) {
            this.flagPaused = false;
            this.moveNextPosition();
        }
        
        if (this.flagStopped) {
            this.flagStopped = false;
            snake.parts = [ ...START_SNAKE]; // Устанавливаем исходную позицию змейки после останова
            score.quantityScore = SCORE_ON_START;
            score.printScore();
            board.render();
            snake.render();
            food.render();
        }
    },

    /**
     * Функция выполняет паузу игры.
     */
    pause() {
        this.setGameStatus(GAME_STATUS_PAUSED);
        this.flagPaused = true;
    },

    /**
     * Функция останавливает игру.
     */
    stop() {
        this.setGameStatus(GAME_STATUS_STOPPED);
        this.flagStopped = true;
        alert('Игра окончена')
    },

    /**
     * Функция, которая перерисовывает змейку на новой позиции и перезапускает таймер
     * @returns none
     */
    
    moveNextPosition() {
        
        if (game.flagStopped || game.flagPaused) {
            return;
        }
        
        const nextPosition = snake.getNextPosition();

        /* проверяем совпадает ли следующая позиция с какой-нибудь едой */
        const foundFood = food.foundPosition(nextPosition);

        /* если найден индекс еды (то есть позиция совпадает) */
        if (foundFood !== -1) {
            /* устанавливаем следующую позицию змейки с вторым параметром "не удалять хвост змейки",
             * змейка съев еду вырастает на одну клетку */
            snake.setPosition(nextPosition, false);

            /* удаляем еду с поля */
            food.removeItem(foundFood);

            /* генерируем новую еду на поле */
            food.generateItem();

            /* перерендериваем еду */
            food.render();

            /* Увеличиваем количество очков*/
            score.addScore();

            /* Ускоряем змейку */
            if (this.delay > 10) {
                this.delay -= 10;
            };
        } else {
            /* если индекс не найден, то просто устанавливаем новую координату для змейки */
            snake.setPosition(nextPosition);
        }

        /* перерендериваем змейку */
        clearTimeout(this.timer);
        snake.render();

        game.timer = setTimeout(game.moveNextPosition, game.delay);
        
    },

    /**
     * Функция выполняет передвижение змейки по полю.
     *
     * @param event {KeyboardEvent} Событие нажатия на клавишу.
     */
    move(event) {
        let direction = null;

        if (game.flagStopped || game.flagPaused) {
            return;
        }

        /* смотрим на код клавишы и
         * устанавливаем соответсвующее направление движения */
        switch (event.keyCode) {
            case 38:
                direction = SNAKE_DIRECTION_UP;
                break;
            case 40:
                direction = SNAKE_DIRECTION_DOWN;
                break;
            case 37:
                direction = SNAKE_DIRECTION_LEFT;
                break;
            case 39:
                direction = SNAKE_DIRECTION_RIGHT;
                break;
            default:
                return;
        }

        /* устанавливаем позицию для змейки
         * и запрашиваем координаты следующей позиции */
        snake.setDirection(direction);
        
        game.moveNextPosition();

    },


    /**
     * Функция устанавливает текущий статус игры,
     * раскрашивая контейнер игры в нужный цвет.
     *
     * @param status {GAME_STATUS_STARTED | GAME_STATUS_PAUSED | GAME_STATUS_STOPPED} Строка представляющая статус.
     */
    setGameStatus(status) {
        const element = game.getElement();

        // обратить внимание, как сделать красивее
        element.classList.remove(GAME_STATUS_STARTED, GAME_STATUS_PAUSED, GAME_STATUS_STOPPED);
        element.classList.add(status);
    }
};

/**
 * Объект выполняющий подсчет и хранение очков
 */
const score = {
    
    quantityScore:  SCORE_ON_START,

    /**
     * Функция ищет HTML элемент поля с количеством заработанных очков
     * 
     * @returns {HTMLElement} Возвращает HTML элемент.
     */
    getElement() {
        return document.getElementById('score-value')
    },

    /**
     * Функция добавляет очки при съеденном фрукте
     * 
     */
    addScore() {
        this.quantityScore++;
        this.printScore();
    },

    /**
     * Функция очищает очки при завершении игры.
     */
    clearScore() {
        this.quantityScore = SCORE_ON_START;
        this.printScore();
    },

    printScore() {
        const scoreElement = this.getElement();
        scoreElement.innerText = this.quantityScore;
    }

}

/**
 * Объект, представляющий поле, где ползает змейка.
 */
const board = {

    // cells: [
    //     { top: 0, left: 0, className: '' }
    // ],

    /**
     * Функция ищет HTML элемент поля на странице.
     *
     * @returns {HTMLElement} Возвращает HTML элемент.
     */
    getElement() {
        return document.getElementById('board');
    },

    /**
     * Функция отрисовывает поле с клетками для игры.
     */
    render() {
        const board = this.getElement();
        /* Добавляю очистку доски перед новым рендером, так как без перезагрузки страницы дублируются div
           Рендер доски будет выполняться только при первом запуске игры.
        */
        board.innerHTML = '';

        /* рисуем на странице 20*20 клеток */
        for (let i = 0; i < config.size**2; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            /* высчитываем и записываем в data атрибуты
             * координаты от верхней и левой границы */
            cell.dataset.top = Math.trunc(i / config.size);
            cell.dataset.left = i % config.size;

            board.appendChild(cell);
        }
    }
};

/**
 * Объект, представляющий клетку на поле.
 */
const cells = {
    

    /**
     * Функция ищет HTML элементы клеток на странице.
     *
     * @returns { HTMLCollectionOf.<Element>} Возвращает набор HTML элементов.
     */
    getElements() {
        return document.getElementsByClassName('cell');
    },

    /**
     * Функция задает класс для клетки по заданным координатам.
     *
     * @param coordinates {Array.<{top: number, left: number}>} Массив координат клеток для изменения.
     * @param className {string} Название класса.
     */
    renderItems(coordinates, className) {
        const cells = this.getElements();

        /* для всех клеток на странице удаляем переданный класс */
        for (let cell of cells) {
            cell.classList.remove(className);
        }

        /* для заданных координат ищем клетку и добавляем класс */
        for (let coordinate of coordinates) {
            const cell = document.querySelector(`.cell[data-top="${coordinate.top}"][data-left="${coordinate.left}"]`);
            cell.classList.add(className);
        }
    }
};

/**
 * Объект, представляющий змейку.
 */
const snake = {

    /**
     * Текущее направление движение змейки.
     * По умолчанию: направо, потому змейка при старте занимает первые три клетки.
     */
    direction: SNAKE_DIRECTION_RIGHT,

    /**
     * Содержит массив объектов с координатами частей тела змейки.
     * По умолчанию: первые три клетки.
     *
     * NOTE: обратить внимание, как сделать красивее.
     * Поменять порядок координат, сейчас первый элемент массива означает хвост.
     */
    parts: [ ...START_SNAKE],

    /**
     * Функция устанавливает направление движения.
     *
     * @param direction {'up' | 'down' | 'left' | 'right'} Направление движения змейки.
     */
    setDirection(direction) {
        /* проверка не пытается ли пользователь пойти в противоположном направлении,
         * например, змейка ползет вправо, а пользователь нажал стрелку влево */
        /* обратить внимание, как сделать красивее и сократить условие */
        if (this.direction === SNAKE_DIRECTION_UP && direction === SNAKE_DIRECTION_DOWN
            || this.direction === SNAKE_DIRECTION_DOWN && direction === SNAKE_DIRECTION_UP
            || this.direction === SNAKE_DIRECTION_LEFT && direction === SNAKE_DIRECTION_RIGHT
            || this.direction === SNAKE_DIRECTION_RIGHT && direction === SNAKE_DIRECTION_LEFT) {
            return;
        }

        this.direction = direction;
    },

    /**
     * Функция считает следующую позицию головы змейки,
     * в зависимости от текущего направления.
     *
     * @returns {{top: number, left: number}} Возвращает объект с координатами.
     */
    getNextPosition() {
        /* получаем позицию головы змейки */
        const position = { ...this.parts[this.parts.length - 1] };

        /* в зависимости от текущего положения
         * высчитываем значение от верхней и левой границы */
        switch(this.direction) {
            case SNAKE_DIRECTION_UP:
                position.top -= 1;
                break;
            case SNAKE_DIRECTION_DOWN:
                position.top += 1;
                break;
            case SNAKE_DIRECTION_LEFT:
                position.left -= 1;
                break;
            case SNAKE_DIRECTION_RIGHT:
                position.left += 1;
                break;
        }

        /* если змейка выходит за верхний или нижний край поля,
         * то изменяем координаты на противоположную сторону,
         * чтобы змейка выходя за границы возвращалась обратно на поле */
        if (position.top === -1) {
            position.top = config.size - 1;
        } else if (position.top > config.size - 1) {
            position.top = 0;
        }

        /* если змейка выходит за левый или правый край поля,
         * то изменяем координаты на противоположную сторону,
         * чтобы змейка выходя за границы возвращалась обратно на поле */
        if (position.left === -1) {
            position.left = config.size - 1;
        } else if (position.left > config.size - 1) {
            position.left = 0;
        }

        return position;
    },

    /**
     * Функция устанавливает позицию для змейки.
     *
     * @param position {{top: number, left: number}} Координаты новой позиции.
     * @param shift Флаг, указывающий, нужно ли отрезать хвост для змейки.
     */
    setPosition(position, shift = true) {
        /* проверяем флаг, указывающий, нужно ли отрезать хвост для змейки,
         * если флаг положительный, то отрезаем хвост змейки (первый элемент в массиве),
         * чтобы длина змейки не изменилась,
         * если флаг будет отрицательным, то при установки позиции, мы не отрезаем хвост,
         * а значит увеличиваем змейку на одну клетку, это будет означать, что она съела еду */
        if (shift) {
            this.parts.shift();
        }

        
        /* добавляем проверку на столкновение змейки */
        for (let element of this.parts){
            if (element.top === position.top && element.left === position.left) {
                console.log('Столкновение')
                game.stop();
                return;
            }
        }
        
        /* добавляем новые координаты в конец массива (голова змейки) */
        this.parts.push(position);
    },

    /**
     * Функция отрисовывает змейку на поле.
     */
    render() {
        cells.renderItems(this.parts, 'snake');
    }
};

/**
 * Объект, представляющий еду для змейки.
 */
const food = {

    /**
     * Содержит массив объектов с координатами еды на поле.
     */
    items: [
        { top: 5, left: 5 },
        { top: 1, left: 2 },
        { top: 8, left: 6 }
    ],

    /**
     * Функция выполняет поиск переданных координат змейки в массиве с едой.
     *
     * @param snakePosition {{top: number, left: number}} Позиция головы змейки.
     *
     * @returns {number} Возвращает индекс найденного совпадения из массива с едой,
     * если ничего не найдено, то -1.
     */
    foundPosition(snakePosition) {
        /* здесь происходит вызов функции comparerFunction для каждого элемента в массиве,
         * если функция вернет true, то для этого элемента будет возвращен его индекс,
         * если функция ни разу не вернет true, то результатом будет -1 */
        return this.items.findIndex((item) =>
            item.top === snakePosition.top && item.left === snakePosition.left
        );
    },

    /**
     * Функция удаляет один элемент по индексу из массива с едой.
     *
     * @param foundPosition Индекс найденного элемента.
     */
    removeItem(foundPosition) {
        this.items.splice(foundPosition, 1);
    },

    /**
     * Функция проверяет нет ли такого объекта еды на поле и не попадает ли он на змейку
     */
    testItem(itemForTest) {
        const indx = this.items.findIndex((item) =>
            item.top === itemForTest.top && item.left === itemForTest.left);
        const indxSnake = snake.parts.findIndex((item) =>
            item.top === itemForTest.top && item.left === itemForTest.left);
        
        if (indx === -1 && indxSnake === -1) {
            return false;
        }
        return true;
    },
    
    
    /**
     * Функция генерирует объект с координатами новой еды.
     */
    generateItem() {
        let newItem = {
            top: getRandomNumber(0, config.size - 1),
            left: getRandomNumber(0, config.size - 1)
        };

        let count = 0;

        /* проверка нет ли у нас такого элемента или не попадает ли элемент на змейку
            Для исключения бесконечного цикла ограничим количество попыток в 100*/
        while (this.testItem(newItem) && count < 100) {
            newItem = {
                top: getRandomNumber(0, config.size - 1),
                left: getRandomNumber(0, config.size - 1)
            };
            count++;
        }
        count = 0;
        this.items.push(newItem);
    },

    /**
     * Функция отрисовывает еду на поле.
     */
    render() {
        cells.renderItems(this.items, 'food');
    }
};

/**
 * Функция, которая выполняет инициализацию игры.
 */
function init() {
    /* получаем кнопки */
    const startButton = document.getElementById('button-start');
    const pauseButton = document.getElementById('button-pause');
    const stopButton = document.getElementById('button-stop');

    /* добавляем обработчики клика на кнопки */
    startButton.addEventListener('click', game.start.bind(game));
    pauseButton.addEventListener('click', game.pause.bind(game));
    stopButton.addEventListener('click', game.stop.bind(game));

    /* добавляем обработчик при нажатии на любую кнопку на клавиатуре,
     * далее в методе мы будем проверять нужную нам клавишу */
    window.addEventListener('keydown', game.move);
}

/**
 * Функция, генерирующая случайные числа.
 *
 * @param min {number} Нижняя граница генерируемого числа.
 * @param max {number} Верхняя граница генерируемого числа.
 *
 * @returns {number} Возвращает случайное число.
 */
function getRandomNumber(min, max) {
    return Math.trunc(Math.random() * (max - min) + min);
}

window.addEventListener('load', init);
