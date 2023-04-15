const selectors = {
    boardContainer: document.querySelector(".board-container"),
    board: document.querySelector(".board"),
    moves: document.querySelector(".moves"),
    timer: document.querySelector(".timer"),
    start: document.querySelector("button"),
    win: document.querySelector(".win"),

}

const stats = {
    gameStarted: false, flippedCards: 0, totalFlips: 0, totalTime: 0, loop: null,
}
//variable array wird von emojies ersetzt, damit emojies funktion für eine neue position bei Spiel start bekommen
const shuffle = array => {
    const clonedArray = [...array]
    //for Schleife für die entdeckung von anzahl die emojis, die durch dieses schleife in zufälligen positionen landen
    for (let index = clonedArray.length - 1; index > 0; index--) {
        /*Zufälligkeit berechnung um damit die emoji ein neue platz bekommen*/
        const randomIndex = Math.floor(Math.random() * (index + 1));
        //Parameter array zugriffbar machen damit wir es in die algorithmus verwenden können
        const originalEmoji = clonedArray[index] //Originale Position von Emoji
        clonedArray[index] = clonedArray[randomIndex] /*gebraucht ansonsten taucht die emoji nicht in die random position auf*/
        clonedArray[randomIndex] = originalEmoji
    }
    return clonedArray;
}

const pickRandom = (array, items) => {
    const clonedArray = [...array];
    const randomPicks = []  /*Array wo die gewählten emojis kurz in diese liste platz haben würden*/
    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)

        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1);
    }
    return randomPicks;
}

// For Generating Cards and set their pictures
const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension')

    const emojis = ['🖥', '🔭', '🎥', '💼', '👓', '🚗', '🚀', '🌌', '🌍', '🍕', '🤖', '🎱',]

    const picks = pickRandom(emojis, (dimensions * dimensions) / 2)

    const items = shuffle([...picks, ...picks])

    const cards = `<div class="board" style="...">
${items.map(item => `           
           <div class="card">
                <div class="card-front"></div>
                <div class="card-back">${item}</div>
            </div>`).join('')}
      </div>
    `
    //diese Variable erlaubt das JS die html betretet und erzeugt inhalt von cards variable als html komponent anstat ein JS objekt
    const parser = new DOMParser().parseFromString(cards, 'text/html')

    selectors.board.replaceWith(parser.querySelector(".board"))
}


const startGame = () => {
    stats.gameStarted = true
    selectors.start.classList.add("disabled")

    stats.loop = setInterval(() => {
        stats.totalTime++

        stats.totalTime++
        selectors.timer.innerText = `time: ${stats.totalTime} sec.`;
        selectors.moves.innerText = `${stats.totalFlips}`;

    }, 1000)
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    stats.flippedCards = 0
}

const flipCard = card => {
    stats.flippedCards++
    stats.totalFlips++

    if (!stats.gameStarted) {
        startGame()
    }

    if (stats.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (stats.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${stats.totalFlips}</span> moves<br />
                    under <span class="highlight">${stats.totalTime}</span> seconds
                </span>
            `

            clearInterval(stats.loop)
        }, 1000)
    }
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}

generateGame()
attachEventListeners()
