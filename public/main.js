const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const two_players_checkbox = document.querySelector("#two_players");
const normal_radio = document.querySelector("#normal")
const play_hard_radio = document.querySelector('#play_hard');
const three_only_radio = document.querySelector("#three_only");


let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let game_check = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(e) {
    checkbox_div.style.visibility= ' hidden';
    game_check = true;
    const cell = e.target;
    const index = parseInt(cell.dataset.index);

    if(two_players_checkbox.checked && gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        checkWin();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }else if(!two_players_checkbox.checked){
        if(normal_radio.checked && gameBoard[index] === '' && gameActive){
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWin();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            setTimeout(timeout_function, 2000);//normal()
        }else if(play_hard_radio.checked && (gameBoard[index] === '' || gameBoard[index] !== currentPlayer)&& gameActive){
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWin();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            setTimeout(timeout_function, 2000);//hard()
        }else if(three_only_radio.checked){
            setTimeout(timeout_function, 2000);//three_only()
        }
    }
}

function timeout_function(){
    if(!game_check){     // to check if the restart button was pressed during the bot turn
        return 0;
    }else if(play_hard_radio.checked){
        hard();
    }else if(three_only_radio.checked){
        three_only();
    }else{
        normal();
    };
};

function checkWin() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            message.textContent = `${gameBoard[a]} wins!`;
            gameActive = false;
            game_check = false;
            return;
        };
    };

    if (!gameBoard.includes('')) {
        message.textContent = 'It\'s a draw!';
        gameActive = false;
    };
};

function normal(){
    let arr =  []; //JSON.parse(JSON.stringify(gameBoard))
    gameBoard.forEach((e,i)=>{
        if(e=='') arr.push(i)
    })
    console.log(arr)
    const subtle_index = Math.floor(Math.random()*arr.length);
    console.log(subtle_index)
    const index = arr[subtle_index];
    gameBoard[index] = currentPlayer;
    console.log(index)
    const cell= document.getElementById(index)
    cell.textContent = currentPlayer;
    checkWin();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function hard(){

}

function three_only(){

}

function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    game_check = false; // to prevent the bot from playing when the user press restart
    currentPlayer = 'X';
    message.textContent = '';
    cells.forEach(cell => cell.textContent = '');
    checkbox_div.style.visibility= 'visible';
}

normal_radio.checked = true;
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);