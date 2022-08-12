const DEFAULT_DATA = {
	pgn_newb_multiplier:5,
	fen_newb_multiplier:5,
	pgn_elo:800,
	fen_elo:800,
	pgn_puzzles_solved:[],
	fen_puzzles_solved:[],
	enable_speech:false,
	enable_board:false
}


let storage = {
	data:{},
	save: saveData
}
function saveData(){
	window.localStorage.data = JSON.stringify(storage.data);
}

if(localStorage.data){
	storage.data = JSON.parse(localStorage.data);
}
else{
	storage.data = DEFAULT_DATA;
	storage.save();
}
window.debug = storage;
export default storage;
