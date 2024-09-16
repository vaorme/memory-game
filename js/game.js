const selectors = {
    board: document.querySelector('.cards'),
    moves: document.querySelector('.moves_num'),
    score: document.querySelector('.score_num')
}
const states = {
    cardSame: false,
    moves: 0,
    score: 0,
    hits: 0
}

const words = [
    'bucket',
    'cow',
    'car',
    'hammer',
    'jet-fighter-up',
    'radiation',
    'wifi',
    'skull-crossbones',
];

let lockBoard = false;
let isFlipped = false;
let firstCard, secondCard;

// ? DUPLICATE WORDS
words.push(...words);

function countScore(){
    states.hits = states.hits + 4
    states.score = states.score + states.hits
    selectors.score.innerHTML = states.score
}
function countMoves(){
    states.moves = states.moves + 1;
    selectors.moves.innerHTML = states.moves;
}

const htmlCards = generateCards();
selectors.board.innerHTML = htmlCards;

function startGame(){
    setTimeout(() => {
        document.querySelector('.main').style.display = "none";
        showGame('.start')
    }, 800);

    const clickCards = document.querySelectorAll('.card');
    clickCards.forEach(card => {
        card.addEventListener('click', flipCard)
    });
}

function generateCards(){
    const arrayWords = shuffleWords();
    return `
        ${arrayWords.map((item, key) =>`
            <div class="card" data-value="${item}">
                <div class="card_front"><i class="fa-solid fa-question"></i></div>
                <div class="card_back"><i class="fa fa-${item}"></i></div>
            </div>
        `).join('')}
    `;
}

function shuffleWords(){
    return words.sort(() => Math.random() - 0.5);
}
function flipCard(){
    if(lockBoard) return;
    if(this === firstCard) return;
    this.classList.add('flip');

    if(!isFlipped){
        isFlipped = true;
        firstCard = this;

        return;
    }
    secondCard = this

    checkCards();
}

function checkCards(){
    lockBoard = true;

    let firstValue = firstCard.getAttribute('data-value');
    let secondValue = secondCard.getAttribute('data-value');

    if(firstValue === secondValue){
        firstCard.classList.add('flipped');
        secondCard.classList.add('flipped');
        addScore();
    }
    unflipCards();
    countMoves();
}

function unflipCards(){
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        clearElements();
    }, 500);
}

function clearElements(){
    [firstCard, secondCard] = [null, null];
    isFlipped = false;
    lockBoard = false;
}

function countMoves(){
    states.moves += 1;
    selectors.moves.textContent = states.moves;
}

function addScore(){
    states.score += 4;
    selectors.score.textContent = states.score;
}

// ? MAIN MENU

const buttonStartGame = document.querySelector(".startGame");
buttonStartGame?.addEventListener("click", function(e){
    e.preventDefault();
    hideMain('.main');
    startGame();
});

function showGame(selector){
    document.querySelector(selector).style.opacity = 1;
    document.querySelector(selector).style.visibility = "visible";
}
function hideMain(selector){
    document.querySelector(selector).style.opacity = 0;
    document.querySelector(selector).style.visibility = "hidden";
}

// ? RESTART GAME
const buttonRestartGame = document.querySelector(".restart a");
buttonRestartGame?.addEventListener("click", function(e){
    e.preventDefault()

    restartGame();
});

function restartGame(){
    clearElements();
    const cards = document.querySelectorAll('.cards .card');
    const arrayWords = shuffleWords();
    cards?.forEach((item, key) =>{
        item.classList.remove('flip', 'flipped');
        item.setAttribute('data-value', arrayWords[key]);
        item.innerHTML = `
            <div class="card_front"><i class="fa-solid fa-question"></i></div>
            <div class="card_back"><i class="fa fa-${arrayWords[key]}"></i></div>
        `;
    });

    // * SCORE
    states.score = 0;
    selectors.score.textContent = states.score;

    // * MOVES
    states.moves = 0;
    selectors.moves.textContent = states.moves;
}
