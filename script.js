'use strict';

const CARD_STATUS = {
    HIDDEN: 'hidden',
    REVEALED: 'revealed'
};

const CARDS = [
    { name: 'A', img: 'AA' },
    { name: 'B', img: 'BB' },
];

const divWrapper = document.querySelector('.wrapper');
const divScore = document.querySelector('.js-score');

let _selectedCard = null;
let _score = 0;

function drawScore() {
    divScore.textContent = `${_score} / ${CARDS.length}`;
}

function setScore() {
    _score++;
    drawScore();

    if (_score === CARDS.length) {
        alert('win');
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

    if (selecterdAnswer === currentCardAnswer) {
        correctCard(divCard);
        setScore();
    } else {
        hideCard(divCard);
    }

    _selectedCard = null;
}

function createCards() {
    CARDS.forEach(card => {
        let divCardName = document.createElement('div'),
            divCardAnswer = document.createElement('div'),
            divCardNameContent = document.createElement('div'),
            divCardAnswerContent = document.createElement('div');

        divCardName.className = 'card hidden';
        divCardName.setAttribute('data-answer', card.img);
        divCardNameContent.textContent = card.name;

        divCardAnswer.className = 'card hidden';
        divCardAnswer.setAttribute('data-answer', card.img);
        divCardAnswerContent.textContent = card.img;


        divCardName.append(divCardNameContent);
        divCardAnswer.append(divCardAnswerContent);
        divWrapper.append(divCardName);
        divWrapper.append(divCardAnswer);
    });
}

function delegateEvt() {
    divWrapper.addEventListener('click', (e) => {
        const targetClasslist = e.target.classList;
        if (targetClasslist.contains(CARD_STATUS.REVEALED)) {
            return null;
        } else if (targetClasslist.contains(CARD_STATUS.HIDDEN)) {
            revealCard(e.target);
            setTimeout(() => handleCardClick(e.target), 500);
        }
    });
}

function start() {
    delegateEvt();
    drawScore();
    createCards();
}


start();