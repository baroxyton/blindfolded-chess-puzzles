function read_text(text){
	let voices = speechSynthesis.getVoices();
	let usvoice = voices.find(voice=>voice.lang == "en-GB");

	let speech = new SpeechSynthesisUtterance(text);
	speech.voice = usvoice;

	speechSynthesis.speak(speech)
}
let pieceTable = {
	"p":"pawn",
	"n":"knight",
	"b":"bishop",
	"r":"rook",
	"q":"queen",
	"k":"king"
}
function read_pgn(move, isWhite){
	let color = isWhite?"White":"Black";
	if(move.type == "scastle"){
		read_text(isWhite?"White":"Black" + " Short-castles");
	}
	if(move.type == "lcastle"){
		read_text(isWhite?"White":"Black" + " Queenside-castles");
	}
	if(move.type == "pawn"){
		let pawnFile = move.file;
		let isCapture = pawnFile != move.dest[0];
		let text = color + " " + pawnFile + " pawn" + (isCapture?" captures ":" to ") + move.dest + (move.promote?  (" and promotes to a" + pieceTable[move.promotion.toLowerCase()]):"");
		read_text(text);
	}
	if(move.type == "piece"){
		let isCapture = move.capture;
		let text = color + " " + pieceTable[move.piece] + (isCapture?" captures ":" to ") + move.dest;
		read_text(text);
	}


}
export {read_text, read_pgn};
