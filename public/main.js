const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const two_players_checkbox = document.querySelector("#two_players");
const normal_radio = document.querySelector("#normal")
const play_hard_radio = document.querySelector('#play_hard');
const three_only_radio = document.querySelector("#three_only");
const score_sheet = document.querySelector('#score_sheet'); // didn't use it yet
let x_score = 0;
let o_score = 0;
const x_score_sheet = document.querySelector('#x');
const o_score_sheet = document.querySelector('#o');
x_score_sheet.textContent = x_score;
o_score_sheet.textContent = o_score;
let index;
let x_indices = [];
let o_indices = [];
let x_index;
let o_index;

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let game_check = true;
let human_play = true;

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

async function handleCellClick(e) {
    if(!human_play) return 0; // prevent the user from playing before the bot end his turn 
    checkbox_div.style.visibility= 'hidden';
    game_check = true;
    const cell = e.target;
    index = parseInt(cell.dataset.index);

    if(two_players_checkbox.checked){
        if(normal_radio.checked && gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        checkWin();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }else if(play_hard_radio.checked && (gameBoard[index] === '' || (gameBoard.filter(e=>e!='').length>=6 && gameBoard[index] !== currentPlayer && index!=x_index && index!=o_index))&& gameActive){
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWin();
            currentPlayer === 'X' ? x_index = index: o_index = index;
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }else if(three_only_radio.checked && gameBoard[index] === '' && gameActive){
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWin();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            three_only();
        }
    }else if(!two_players_checkbox.checked){
        human_play = false;
        if(normal_radio.checked && gameBoard[index] === '' && gameActive){
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWin();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            setTimeout(timeout_function, 2000);//normal_bot()
        }else if(play_hard_radio.checked && (gameBoard[index] === '' || (gameBoard.filter(e=>e!='').length>=6 && gameBoard[index] !== currentPlayer && index!=x_index && index!=o_index))&& gameActive){
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWin();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            setTimeout(timeout_function, 2000);//hard_bot()
        }else if(three_only_radio.checked && gameBoard[index] === '' && gameActive){
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWin();
            x_indices.push(index);
            console.log('x_indices '+ x_indices)
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if(gameBoard.filter(e=>e=='O').length ==3 && currentPlayer == 'O'){ // check the 3 O case before letting the bot play
                let index_three_only = o_indices.shift();
                gameBoard[index_three_only] ='';
                const cell= document.getElementById(index_three_only);
                cell.textContent = '';
            }
            setTimeout(timeout_function, 2000);//three_only_bot()
        }
    }
    setTimeout(()=>human_play=true,2000) // to let the human play again
}

function timeout_function(){
    if(!game_check){     // to check if the restart button was pressed during the bot turn
        return 0;
    }else if(two_players_checkbox.checked){  // two players
        if(play_hard_radio.checked){
            hard();
        }else if(three_only_radio.checked){
            three_only();
        }
    }else{  // against bot
        if(play_hard_radio.checked){
            hard_bot();
        }else if(three_only_radio.checked){
            three_only_bot();
        }else{
            normal_bot();
        }
    };
};

function checkWin() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            message.textContent = `${gameBoard[a]} wins!`;
            gameActive = false;
            game_check = false;
            gameBoard[a] == 'X' ? ++x_score :  ++o_score
            console.log(x_score)
            console.log(o_score)
            gameBoard[a] == 'X' ? x_score_sheet.textContent = x_score :  o_score_sheet.textContent = o_score;
            return;
        };
    };

    if (!gameBoard.includes('')) {
        message.textContent = 'It\'s a draw!';
        gameActive = false;
    };
};

function normal_bot(){
    let index_normal;
    if(gameBoard.filter(e=>e=='X').length==1 && gameBoard[4]==''){
        index_normal = 4;
    }
    if(gameBoard.filter(e=>e=='X').length==2 && (gameBoard.filter((e,i)=>{if(e=='X'&&(i==0||i==8))return true}).length==2||gameBoard.filter((e,i)=>{if(e=='X'&&(i==2||i==6))return true}).length==2)){ // to prevent karam from winning
        index_normal = 1;
    }
    if(!index_normal){
        winningConditions.forEach((e,i)=>{
            if(e.filter(el=>gameBoard[el]=='O').length==2 && e.filter(el=>gameBoard[el]=='').length==1) index_normal = e.filter(el=>gameBoard[el]=='')
        })
    }
    if(!index_normal){
        winningConditions.forEach((e,i)=>{
            if(e.filter(el=>gameBoard[el]=='X').length==2 && e.filter(el=>gameBoard[el]=='').length==1) index_normal = e.filter(el=>gameBoard[el]=='')
        })
    }
    if(!index_normal){
        let arr =  [];
        gameBoard.forEach((e,i)=>{
            if(e=='') arr.push(i)
        })
        console.log(arr)
        const subtle_index = Math.floor(Math.random()*arr.length);
        console.log(subtle_index)
        index_normal = arr[subtle_index];
    }
    gameBoard[index_normal] = currentPlayer;
    console.log('index '+ index_normal)
    if(three_only_radio.checked)o_indices.push(index_normal); // for 3 only purposes
    const cell= document.getElementById(index_normal)
    cell.textContent = currentPlayer;
    checkWin();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function hard_bot(){
    let index_hard;
    if(gameBoard.filter(e=>e=='X').length==1 && gameBoard[4]==''){
        index_hard = 4;
    }
    if(gameBoard.filter(e=>e=='X').length==2 && (gameBoard.filter((e,i)=>{if(e=='X'&&(i==0||i==8))return true}).length==2||gameBoard.filter((e,i)=>{if(e=='X'&&(i==2||i==6))return true}).length==2)){ // to prevent karam from winning
        index_hard = 1;
    }
    if(!index_hard){
        winningConditions.forEach((e,i)=>{ // check 2 O
            if(gameBoard.filter(el=>el!='').length>=6 &&e.filter(el=>gameBoard[el]=='O').length==2 && e.filter(el=>gameBoard[el]=='').length==1){
                 index_hard = e.filter(el=>gameBoard[el]=='') // place the third O in the empty cell
                }else if(gameBoard.filter(el=>el!='').length>=6 &&e.filter(el=>gameBoard[el]=='O').length==2 && e.filter(el=>gameBoard[el]=='X').length==1 &&e.filter(el=>gameBoard[el]=='')!=x_index){
                    index_hard = e.filter(el=>gameBoard[el]=='X') // place the third O in the X cell but not the last one
                }
        })
    }
    if(!index_hard){
        winningConditions.forEach((e,i)=>{
            if(e.filter(el=>gameBoard[el]=='X').length==2 && e.filter(el=>gameBoard[el]=='').length==1) index_hard = e.filter(el=>gameBoard[el]=='')
        })
    }
    if(!index_hard){
        let arr =  [];
        gameBoard.forEach((e,i)=>{
            if(e=='') arr.push(i)
        })
        console.log(arr)
        const subtle_index = Math.floor(Math.random()*arr.length);
        console.log(subtle_index)
        index_hard = arr[subtle_index];
    }
    gameBoard[index_hard] = currentPlayer;
    console.log('index '+ index_hard)
    if(three_only_radio.checked)o_indices.push(index_hard); // for 3 only purposes
    const cell= document.getElementById(index_hard)
    cell.textContent = currentPlayer;
    checkWin();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function three_only(){
    if(currentPlayer=='O')x_indices.push(index);
    if(currentPlayer=='X')o_indices.push(index);
    if(gameBoard.filter(e=>e=='X').length ==3 && currentPlayer == 'X'){
        let index_three_only = x_indices.shift();
        gameBoard[index_three_only] ='';
        const cell= document.getElementById(index_three_only);
        cell.textContent = '';
    }else if(gameBoard.filter(e=>e=='O').length ==3 && currentPlayer == 'O'){
        let index_three_only = o_indices.shift();
        gameBoard[index_three_only] ='';
        const cell= document.getElementById(index_three_only);
        cell.textContent = '';
    }
}

async function three_only_bot(){
    normal_bot();
    if(gameBoard.filter(e=>e=='X').length ==3 && currentPlayer == 'X'){  // check the 3 X case
        let index_three_only = x_indices.shift();
        gameBoard[index_three_only] ='';
        const cell= document.getElementById(index_three_only);
        cell.textContent = '';
    }
}

function restartGame() {
    game_check = false; // to prevent the bot from playing when the user press restart
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    message.textContent = '';
    cells.forEach(cell => cell.textContent = '');
    checkbox_div.style.visibility= 'visible';
    x_indices = [];
    o_indices = [];
    x_index = 10;
    o_index = 10;
}

normal_radio.checked = true;
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);