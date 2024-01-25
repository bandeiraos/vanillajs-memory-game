'use strict';

const CARD_STATUS = {
    HIDDEN: 'hidden',
    REVEALED: 'revealed'
};

const divWrapper = document.querySelector('.wrapper');
const divScore = document.querySelector('.js-score');

let _cards = [];
let _selectedCard = null;
let _score = 0;
let _blockClick = false;

function drawScore() {
    divScore.textContent = `${_score} / ${_cards.length}`;
}

function setScore() {
    _score++;
    drawScore();

    if (_score === _cards.length) {
        console.log('win');
    }
}

function revealCard(divCard) {
    divCard.classList.remove('hidden');
    divCard.classList.add('revealed');
}

function hideCard(divCard) {
    [divCard, _selectedCard].forEach(card => {
        card.classList.remove('revealed');
        card.classList.add('hidden');
    });
}

function correctCard(divCard) {
    [divCard, _selectedCard].forEach(card => {
        card.classList.add('correct');
    });
}

function handleCardClick(divCard) {
    if (!_selectedCard) {
        _selectedCard = divCard;

        return;
    }

    const selecterdAnswer = _selectedCard.getAttribute("data-answer");
    const currentCardAnswer = divCard.getAttribute("data-answer");

    _blockClick = true;


    setTimeout(() => {
        if (selecterdAnswer === currentCardAnswer) {
            correctCard(divCard);
            setScore();
        } else {
            hideCard(divCard);
        }
        _blockClick = false;
        _selectedCard = null;
    }, 1000);

}

function createCards() {
    _cards.forEach(card => {
        let divCardName = document.createElement('div'),
            divCardImg = document.createElement('div'),
            divCardNameContent = document.createElement('div'),
            divCardImgContent = document.createElement('div');

        divCardName.className = 'card hidden';
        divCardName.setAttribute('data-answer', card.flag);
        divCardNameContent.textContent = card.name;

        divCardImg.className = 'card hidden';
        divCardImg.setAttribute('data-answer', card.flag);

        divCardImgContent.className = 'flag';
        divCardImgContent.style.backgroundImage = `url(${card.flag})`;

        divCardName.append(divCardNameContent);
        divCardImg.append(divCardImgContent);
        divWrapper.append(divCardName);
        divWrapper.append(divCardImg);
    });
}

function delegateEvt() {
    divWrapper.addEventListener('click', (e) => {
        const targetClasslist = e.target.classList;
        if (targetClasslist.contains(CARD_STATUS.REVEALED)) {
            return null;
        } else if (targetClasslist.contains(CARD_STATUS.HIDDEN)) {
            if (_blockClick) return;

            revealCard(e.target);
            setTimeout(() => handleCardClick(e.target), 500);
        }
    });
}

async function fetchCountries() {
    const response = await fetch("./data.json"),
        data = await response.json(),
        chosenNumbers = [];

    function generateRandomNumber() {
        return Math.floor(Math.random() * 249);
    }

    while (chosenNumbers.length < 6) {
        const randomNumber = generateRandomNumber();
        if (!chosenNumbers.includes(randomNumber)) {
            chosenNumbers.push(randomNumber);
        }
    }

    chosenNumbers.forEach(num => {
        const { name, flags } = data[num];

        _cards.push({ name, flag: flags.png });
    });


    createCards();
    drawScore();
}

function start() {
    fetchCountries();
    delegateEvt();
}

start();