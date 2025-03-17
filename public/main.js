const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const two_players_checkbox = document.querySelector("#two_players");
const two_players_div = document.querySelector("#two_players_div");
const bot_starts_checkbox = document.querySelector("#bot_starts");
const bot_starts_div = document.querySelector("#bot_starts_div");
const normal_radio = document.querySelector("#normal")
const play_hard_radio = document.querySelector('#play_hard');
const three_only_radio = document.querySelector("#three_only");
const score_sheet = document.querySelector('#score_sheet'); // didn't use it yet 
const help = document.querySelector('#help');
const help_paragraph = document.querySelector('#help_paragraph');
const i_icon = document.querySelector('.circled-question-svg')
let human_score = 0;
let bot_score = 0;
const human_score_sheet = document.querySelector('#x');
const bot_score_sheet = document.querySelector('#o');
human_score_sheet.textContent = human_score;
bot_score_sheet.textContent = bot_score;
let index;
let human_indices = [];
let bot_indices = [];
let human = 'X';
let bot = 'O';
let currentPlayer = human;
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
    help_paragraph.style.display = "none"; // Hide the paragraph
    checkbox_div.style.visibility= 'hidden';
    i_icon.style.visibility = 'hidden';
    game_check = true;
    const cell = e.target;
    index = parseInt(cell.dataset.index);

    if(two_players_checkbox.checked){
        if(normal_radio.checked && gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        checkWin();
        currentPlayer = currentPlayer === human ? bot : human;
        }else if(play_hard_radio.checked && (gameBoard[index] === '' || (gameBoard.filter(e=>e!='').length>=6 && gameBoard[index] !== currentPlayer && !human_indices.includes(index) && !bot_indices.includes(index)))&& gameActive){
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWin();
            currentPlayer === human ? human_indices.push(index): bot_indices.push(index);
            if(human_indices.length>2) human_indices.shift();
            if(bot_indices.length>2) bot_indices.shift();
            ccurrentPlayer = currentPlayer === human ? bot : human;
        }else if(three_only_radio.checked && gameBoard[index] === '' && gameActive){
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWin();
            currentPlayer = currentPlayer === human ? bot : human;
            three_only();
        }
    }else if(!two_players_checkbox.checked){
        human_play = false;
        if(normal_radio.checked && gameBoard[index] === '' && gameActive){
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWin();
            currentPlayer = currentPlayer === human ? bot : human;
            setTimeout(timeout_function, 2000);//normal_bot()
        }else if(play_hard_radio.checked && (gameBoard[index] === '' || (gameBoard.filter(e=>e!='').length>=6 && gameBoard[index] !== currentPlayer && !human_indices.includes(index) && !(bot_indices.includes(index))))&& gameActive){
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWin();
            currentPlayer === human ? human_indices.push(index): bot_indices.push(index);
            if(human_indices.length>2) human_indices.shift();
            if(bot_indices.length>2) bot_indices.shift();
            currentPlayer = currentPlayer === human ? bot : human;
            setTimeout(timeout_function, 2000);//hard_bot()
        }else if(three_only_radio.checked && gameBoard[index] === '' && gameActive){
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWin();
            human_indices.push(index);
            currentPlayer = currentPlayer === human ? bot : human;
            if(gameBoard.filter(e=>e==bot).length ==3 && currentPlayer == bot){ // check the 3 O case before letting the bot play
                let index_three_only = bot_indices.shift();
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
            if(bot_starts_checkbox.checked){
                gameBoard[a] == human ? ++bot_score :  ++human_score;
                gameBoard[a] == human ? bot_score_sheet.textContent = bot_score :  human_score_sheet.textContent = human_score;
            }else{
                gameBoard[a] == human ? ++human_score :  ++bot_score;
                gameBoard[a] == human ? human_score_sheet.textContent = human_score :  bot_score_sheet.textContent = bot_score;
            }
            return;
        };
    };

    if (!gameBoard.includes('')) {
        message.textContent = 'It\'s a draw!';
        gameActive = false;
        game_check = false;
    };
};

function normal_bot(){
    let index_normal;
    if(gameBoard.filter(e=>e==human).length==1 && gameBoard[4]==''){
        index_normal = 4;
    }
    if(gameBoard.filter(e=>e==human).length==1 && gameBoard[4]==human){
        index_normal = 2;
    }
    if(gameBoard.filter(e=>e==human).length==1 && gameBoard[3]==human){
        index_normal = 6;
    }
    if(gameBoard.filter(e=>e==human).length==1 && gameBoard[5]==human){
        index_normal = 8;
    }
    if(gameBoard.filter(e=>e==human).length==2 && gameBoard[4]=='' && ((gameBoard[1]==human&&gameBoard[3]==human)||(gameBoard[1]==human&&gameBoard[5]==human)||(gameBoard[3]==human&&gameBoard[7]==human)||(gameBoard[7]==human&&gameBoard[5]==human))){// to prevent karam from winning
        index_normal = 4;
    }
    if(!index_normal && gameBoard.filter(e=>e==human).length==2 && (gameBoard.filter((e,i)=>{if(e==human&&(i==0||i==8))return true}).length==2||gameBoard.filter((e,i)=>{if(e==human&&(i==2||i==6))return true}).length==2)){ // to prevent karam from winning
        index_normal = 1;
    }
    if(!index_normal){
        winningConditions.forEach((e,i)=>{ // check 2 Os
            if(e.filter(el=>gameBoard[el]==bot).length==2 && e.filter(el=>gameBoard[el]=='').length==1) index_normal = e.filter(el=>gameBoard[el]=='')[0]
        })
    }
    if(!index_normal && index_normal!=0){ // check 2 Xs
        winningConditions.forEach((e,i)=>{
            if(e.filter(el=>gameBoard[el]==human).length==2 && e.filter(el=>gameBoard[el]=='').length==1) index_normal = e.filter(el=>gameBoard[el]=='')[0]
        })
    }
    if(!index_normal && index_normal!=0){
        let arr =  [];
        gameBoard.forEach((e,i)=>{
            if(e=='') arr.push(i)
        })
        // console.log(arr)
        const subtle_index = Math.floor(Math.random()*arr.length);
        // console.log(subtle_index)
        index_normal = arr[subtle_index];
    }
    gameBoard[index_normal] = currentPlayer;
    // console.log('index '+ index_normal)
    if(three_only_radio.checked)bot_indices.push(index_normal); // for 3 only purposes
    const cell= document.getElementById(index_normal)
    cell.textContent = currentPlayer;
    checkWin();
    currentPlayer = currentPlayer === human ? bot : human;
}

function hard_bot(){
    let index_hard;
    if(gameBoard.filter(e=>e==human).length==1 && gameBoard[4]==''){
        index_hard = 4;
    }
    if(gameBoard.filter(e=>e==human).length==2 && (gameBoard.filter((e,i)=>{if(e==human&&(i==0||i==8))return true}).length==2||gameBoard.filter((e,i)=>{if(e==human&&(i==2||i==6))return true}).length==2)){ // to prevent karam from winning
        index_hard = 1;
    }
    if(!index_hard){
        winningConditions.forEach((e,i)=>{ // check 2 Os
            if(gameBoard.filter(el=>el!='').length>=6 &&e.filter(el=>gameBoard[el]==bot).length==2 && e.filter(el=>gameBoard[el]=='').length==1){
                 index_hard = e.filter(el=>gameBoard[el]=='')[0] // place the third O in the empty cell
                }else if(gameBoard.filter(el=>el!='').length>=6 &&e.filter(el=>gameBoard[el]==bot).length==2 && e.filter(el=>gameBoard[el]==human).length==1 &&!human_indices.includes(e.filter(el=>gameBoard[el]==human)[0])){
                    index_hard = e.filter(el=>gameBoard[el]==human)[0] // place the third O in the X cell but not the last two
                }
        })
    }
    if(!index_hard && index_hard!=0){
        winningConditions.forEach((e)=>{ // check 2 Xs
            if(e.filter(el=>gameBoard[el]==human).length==2 && e.filter(el=>gameBoard[el]=='').length==1) index_hard = e.filter(el=>gameBoard[el]=='')[0]
        })
    }
    // console.log(index_hard)
    if(!index_hard && index_hard!=0){
        let arr =  [];
        gameBoard.forEach((e,i)=>{
            if(e=='') arr.push(i)
        })
        // console.log(arr)
        const subtle_index = Math.floor(Math.random()*arr.length);
        // console.log(subtle_index)
        index_hard = arr[subtle_index];
    }
    gameBoard[index_hard] = currentPlayer;
    // console.log('index '+ index_hard)
    const cell= document.getElementById(index_hard)
    cell.textContent = currentPlayer;
    checkWin();
    bot_indices.push(index_hard);
    if(bot_indices.length>2) bot_indices.shift();
    currentPlayer = currentPlayer === human ? bot : human;
}

function three_only(){
    if(currentPlayer==bot)human_indices.push(index);
    if(currentPlayer==human)bot_indices.push(index);
    if(gameBoard.filter(e=>e==human).length ==3 && currentPlayer == human){
        let index_three_only = human_indices.shift();
        gameBoard[index_three_only] ='';
        const cell= document.getElementById(index_three_only);
        cell.textContent = '';
    }else if(gameBoard.filter(e=>e==bot).length ==3 && currentPlayer == bot){
        let index_three_only = bot_indices.shift();
        gameBoard[index_three_only] ='';
        const cell= document.getElementById(index_three_only);
        cell.textContent = '';
    }
}

async function three_only_bot(){
    normal_bot();
    if(gameBoard.filter(e=>e==human).length ==3 && currentPlayer == human){
        let index_three_only = human_indices.shift();
        gameBoard[index_three_only] ='';
        const cell= document.getElementById(index_three_only);
        cell.textContent = '';
    }
}

function restartGame() {
    game_check = false; // to prevent the bot from playing when the user press restart
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = human;
    message.textContent = '';
    cells.forEach(cell => cell.textContent = '');
    checkbox_div.style.visibility= 'visible';
    i_icon.style.visibility = 'visible';
    human_indices = [];
    bot_indices = [];
    if(bot_starts_checkbox.checked){
        let arr =  [];
        gameBoard.forEach((e,i)=>{
            if(e=='') arr.push(i)
        })
        const subtle_index = Math.floor(Math.random()*arr.length);
        let index_hard = arr[subtle_index];
        human = 'O';
        bot = 'X';
        currentPlayer = bot;
        gameBoard[index_hard] = currentPlayer;
        const cell= document.getElementById(index_hard)
        cell.textContent = currentPlayer;
        bot_indices.push(index_hard);
        currentPlayer = currentPlayer === human ? bot : human;
        help_paragraph.style.display = "none"; // Hide the paragraph
    }
}

function help_func(){
    if (help_paragraph.style.display === "none") {
        help_paragraph.style.display = "flex"; // Show the paragraph
      } else {
        help_paragraph.style.display = "none"; // Hide the paragraph
      }
}

function toggle(){ // to prevent the user from checking both 2 players and bot starts
    if(two_players_checkbox.checked){
        bot_starts_div.style.display = 'none';
    }else{
        bot_starts_div.style.display = 'block';
    }
    if(bot_starts_checkbox.checked){
        two_players_div.style.display = 'none';
    }else{
        two_players_div.style.display = 'block';
    }
}

two_players_checkbox .addEventListener('click', toggle)
bot_starts_checkbox.addEventListener('click',toggle)
normal_radio.checked = true;
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
help.addEventListener('click',help_func);
