let playerMap = new Map();

const maxPlayersOnCourt = 5;
const numQuarters = 4;

let currentQuarter = 0;
let playersOnCourt = 0;
let quarterInPlay = false;

let quarterPER = 0;
let quarterAvePER = 0;
let totalAvePER = 0;

function processPlayers(allPlayerStats) {
    let allPlayerStatLines = allPlayerStats.split(/\r\n|\n/);

    allPlayerStatLines.shift();

    for (let statLine of allPlayerStatLines) {

        let stats = statLine.split(",");

        if (!stats || stats.length <= 1) continue;

        let playerName = stats[1];

        if (!playerMap.has(playerName)) {
            playerMap.set(playerName, []);
        }

        let per = parseFloat(stats[9]);

        playerMap.get(playerName).push(per);

    }
    displayPlayerBench();
}

function displayPlayerBench() {
    let bench = document.getElementById('playersOnBench');
    for (let playerName of playerMap.keys()) {
        let newPlayer = document.createElement('button');


        newPlayer.id = playerName;

        newPlayer.className = 'playerButton';

        newPlayer.onclick = movePlayers;
        let playerImage = document.createElement('img');

        playerImage.src = 'images/' + playerName + '.png';

        newPlayer.appendChild(playerImage);

        bench.appendChild(newPlayer);
    }
    displayPlayerCards();

}

function displayPlayerCards() {
    let playerCardDisplay = document.getElementById('playerCards');

    for (let [playerName, playerStats] of playerMap.entries()) {
        let playerCard = document.createElement('div');

        playerCard.id = playerName + '_card';

        playerCard.className = 'playerCard';

        let playerImage = document.createElement('img');

        playerImage.className = 'perCard';

        playerImage.src = 'images/' + playerName + '.png';

        playerCard.appendChild(playerImage);

        let newPlayerPER = document.createElement('p');

        newPlayerPER.className = 'perCard';

        newPlayerPER.innerText = 'PER: ' + playerStats[currentQuarter].toPrecision(4);

        playerCard.appendChild(newPlayerPER);

        playerCardDisplay.appendChild(playerCard);
    }
}

function movePlayers() {
    if (quarterInPlay) {
        return;
    }

    let parentDiv = this.parentElement;

    if (parentDiv.id == 'playersOnBench') {
        if (playersOnCourt >= maxPlayersOnCourt) {
            alert('Solo puedes tener ' + maxPlayersOnCourt + ' Jugadores en la cancha a la vez.');
        } else {
            playersOnCourt++;
            quarterPER += playerMap.get(this.id)[currentQuarter];
            quarterAvePER = quarterPER / playersOnCourt;
            document.getElementById('currentPER').innerText = 'PER ACTUAL: ' + quarterAvePER.toPrecision(4);

            document.getElementById('playersOnCourt').appendChild(this);
        }
    } else {
        playersOnCourt--;

        if (playersOnCourt != 0) {
            quarterPER -= playerMap.get(this.id)[currentQuarter];
            quarterAvePER = quarterPER / playersOnCourt;
        } else {
            quarterPER = 0;
            quarterAvePER = 0;
        }

        document.getElementById('currentPER').innerText = 'PER ACTUAL: ' + quarterAvePER.toPrecision(4);

        document.getElementById('playersOnBench').appendChild(this);
    }
}

function updateCardsInGame() {
    for (let [playerName, playerStats] of playerMap.entries()) {
        document.getElementById(playerName + '_card').children[1].innerText = 'PER: ' + playerStats[currentQuarter].toPrecision(4);
    }

    quarterPER = 0;
    quarterAvePER = 0;

    let currentPlayers = document.getElementById('playersOnCourt').children;

    for (let playerIndex = 0; playerIndex < currentPlayers.length; playerIndex++) {
        let playerName = currentPlayers[playerIndex].id;

        let playerPER = playerMap.get(playerName)[currentQuarter];

        quarterPER += playerPER;
    }

    quarterAvePER = quarterPER / playersOnCourt;

    document.getElementById('currentPER').innerText = 'PER ACTUAL: ' + quarterAvePER.toPrecision(4);
}

function endQuarter() {
    document.getElementById('timer').innerText = 'Q ' + (currentQuarter + 1) + ' Time: 0:00';

    quarterInPlay = false;

    totalAvePER += parseFloat(quarterAvePER.toPrecision(4));

    document.getElementById('averagePER').innerText += quarterAvePER + ' + ';

    currentQuarter++;

    updateCardsInGame();

    alert('Las estadísticas PER del Q' + (currentQuarter + 1) + ' estan disponibles!');

    document.getElementById('quarter').innerText = 'Escoge tus jugadores par el Q' + (currentQuarter + 1);

    document.getElementById('start').innerText = 'Empieza Q' + (currentQuarter + 1);

}

function endGame() {
    quarterInPlay = true;

    totalAvePER += parseFloat(quarterAvePER);
    let averagePER = totalAvePER / numQuarters;

    alert('Fin del juego. El PER promedio del juego fue: ' + averagePER.toPrecision(4));
    const resultado = document.getElementById('averagePER').innerText += quarterAvePER.toPrecision(4) + ' = ' + averagePER.toPrecision(4);
    obtenerDatos();
    if (resultado > obtenerDatos.valor) {
        alert('El resultado ingresado es menor, prueba otros jugadores!');
    } else {
        alert('Felicidades, has ganado. Elegiste bien a los jugadores!');
    }

    document.getElementById('timer').innerText = 'Eso es todo Amigos!';
    document.getElementById('gameButton').innerText = '';
    document.getElementById('quarter').innerText = '';
    document.getElementById('currentPER').innerText = '';
}

function startNextQuarter() {
    if (playersOnCourt != maxPlayersOnCourt) {
        alert('Escoge ' + maxPlayersOnCourt + 'jugadores para que esteen en la cancha.');
        return;
    }

    document.getElementById('start').innerText = 'Q' + (currentQuarter + 1) + ' en progreso';

    let secondsInQuarter = 12;

    quarterInPlay = true;

    let x = setInterval(function () {
        document.getElementById('timer').innerText = 'Q ' + (currentQuarter + 1) + ' Tiempo: ' + secondsInQuarter + ':00';

        secondsInQuarter--;

        if (secondsInQuarter < 0) {
            clearInterval(x);
            if (currentQuarter < 3) {
                endQuarter();
            }
            else {
                endGame();
            }
        }
    }, 1000);
}

const obtenerDatos = () => {
    const valor = parseFloat(document.getElementById('inputValue').value);
    document.getElementById('value').innerHTML = 'El equipo adversario tiene un PER promedio de: ' + valor;
}