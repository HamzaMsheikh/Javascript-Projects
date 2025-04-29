function deleteCard(cardId) {
    let card = document.getElementById(cardId);
    card.remove();
    checkCards();
}

function checkCards() {
    let cards = document.querySelectorAll('.card');
    if(cards.length === 0) {
        let none = document.querySelector('.none')
        none.style.display = 'block';
    }
}