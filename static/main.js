import chessRender from "./chessrender.js";
import PgnGame from "./pgn_training_session.js";
import FenGame from "./fen_training_session.js";
import store from "./localstorage.js";

const HELP_PGN = `All game moves will be shown to you. You need to visualize the moves and find the best move(s)`;
const HELP_FEN = `You will be told the position of the pieces in random order. You need to visualize them and find the best move(s).`;
const HELP_VM = `You will be shown the board for a configurable amount of time and then it will be hidden. You need to visualize it and find the best move(s).`;

function train_pgn(){
	document.getElementById("start").style.display = "none";
	document.getElementById("game").style.display = "grid";
	if(store.data.enable_board){
		document.getElementById("chessrender").style.display = "block";
	}
	new PgnGame(store);
}
function train_fen(){
	document.getElementById("start").style.display = "none";
	document.getElementById("game").style.display = "grid";
	if(store.data.enable_board){
		document.getElementById("chessrender").style.display = "block";
	}
	new FenGame(store);
}

function goBack(){
	document.getElementById("start").style.display = "grid";
	document.getElementById("game").style.display = "none";
}
function load_config(){
	if(store.data.enable_speech){
		document.getElementById("enable_tts").checked = true;	
	}
	if(store.data.enable_board){

		document.getElementById("enable_board").checked = true;	
	}
}
load_config();

function toggle_tts(){
	store.data.enable_speech = !store.data.enable_speech; 
	store.save();
}
function toggle_board(){
	store.data.enable_board = !store.data.enable_board;
	store.save();
	document.getElementById("chessrender").style.display = "none";
	if(store.data.enable_board){
		document.getElementById("chessrender").style.display = "block";
	}

}

document.getElementById("pgntraining").addEventListener("click", ()=>{alert(HELP_PGN)});
document.getElementById("fentraining").addEventListener("click", ()=>{alert(HELP_FEN)});
document.getElementById("vmtraining").addEventListener("click", ()=>{alert(HELP_VM)});
document.getElementById("start_pgn").addEventListener("click", ()=>{train_pgn()});
document.getElementById("start_fen").addEventListener("click", ()=>{train_fen()});
document.getElementById("go_back").addEventListener("click", ()=>{goBack()});
document.getElementById("enable_board").addEventListener("click", ()=>{toggle_board()});
document.getElementById("enable_tts").addEventListener("click", ()=>{toggle_tts()});

document.getElementById("chessrender").innerHTML = chessRender("8/8/8/8/8/8/8/8");
