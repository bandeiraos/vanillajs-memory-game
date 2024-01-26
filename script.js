'use strict';

const CARD_STATUS = {
    HIDDEN: 'hidden',
    REVEALED: 'revealed'
};

const CARDS_PAIRS = 6;

const divWrapper = document.querySelector('.wrapper');
const divScore = document.querySelector('.js-score');
const retryBtn = document.querySelector('.retry-btn');

let _selectedCards;
let _score;
let _moves;

function setupGame() {
    _selectedCards = [];
    _score = 0;
    _moves = 0;

    divWrapper.innerHTML = '';

    toggleRetryBtn(false);
    drawScore();
    fetchCountries();
}

function endGame() {
    const finalScore = divScore.textContent;

    divScore.textContent = `You Win! | ${finalScore} | Moves: ${_moves}`;

    toggleRetryBtn(true);
}

function toggleRetryBtn(show) {
    retryBtn.style.display = show ? 'block' : 'none';
}

function drawScore() {
    divScore.textContent = `Score: ${_score} / ${CARDS_PAIRS}`;
}

function setScore() {
    _score++;
    drawScore();

    if (_score === CARDS_PAIRS) {
        endGame();
    }
}

function revealCard(divCard) {
    divCard.classList.remove('hidden');
    divCard.classList.add('revealed');
}

function hideCard() {
    _selectedCards.forEach(card => {
        card.classList.remove('revealed');
        card.classList.add('hidden');
    });
}

function correctCard() {
    _selectedCards.forEach(card => {
        card.classList.add('correct');
    });
}

function handleCardClick(divCard) {
    revealCard(divCard);

    _selectedCards.push(divCard);

    if (_selectedCards.length < 2) {
        return;
    }

    _moves++;

    const answers = _selectedCards.map(card => {
        return card.getAttribute("data-flag");
    });

    setTimeout(() => {
        if (answers[0] === answers[1]) {
            correctCard();
            setScore();
        } else {
            hideCard();
        }

        _selectedCards = [];

    }, 1000);

}

function createCards(chosenCountries) {
    let domCards = [];

    chosenCountries.forEach(card => {
        let divCardName = document.createElement('div'),
            divCardImg = document.createElement('div'),
            divCardNameContent = document.createElement('div'),
            divCardImgContent = document.createElement('div');

        divCardName.className = 'card hidden';
        divCardName.setAttribute('data-flag', card.flag);
        divCardNameContent.textContent = card.name;

        divCardImg.className = 'card hidden';
        divCardImg.setAttribute('data-flag', card.flag);

        divCardImgContent.className = 'flag';
        divCardImgContent.style.backgroundImage = `url(${card.flag})`;

        divCardName.append(divCardNameContent);
        divCardImg.append(divCardImgContent);

        domCards.push(divCardName);
        domCards.push(divCardImg);
    });

    chosenCountries = domCards.sort(() => .5 - Math.random());

    chosenCountries.forEach(card => divWrapper.appendChild(card));
}

function delegateEvt() {
    document.body.addEventListener('click', (e) => {
        const targetClasslist = e.target.classList;

        if (targetClasslist.contains('retry-btn')) {
            setupGame();
        } else if (targetClasslist.contains(CARD_STATUS.HIDDEN)) {
            if (_selectedCards.length === 2)
                return;

            handleCardClick(e.target);
        }
    });
}

async function fetchCountries() {
    const response = await fetch("./data.json"),
        data = await response.json(),
        chosenNumbers = [],
        chosenCountries = [];

    function generateRandomNumber() {
        return Math.floor(Math.random() * 249);
    }

    while (chosenNumbers.length < CARDS_PAIRS) {
        const randomNumber = generateRandomNumber();
        if (!chosenNumbers.includes(randomNumber)) {
            chosenNumbers.push(randomNumber);
        }
    }

    chosenNumbers.forEach(num => {
        const { name, flags } = data[num];

        chosenCountries.push({ name, flag: flags.png });
    });

    createCards(chosenCountries);
    drawScore();
}

function start() {
    setupGame();
    delegateEvt();
}

start();