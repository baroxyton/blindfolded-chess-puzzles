// Render the FEN
const pieces = ["♟", "♞", "♝", "♜", "♛", "♚"];
const pieceIndex = ["p", "n", "b", "r", "q", "k"];

function square(isBlack, piece){
	const bg = isBlack?"brown":"lightgray";
	return `<div style="background-color:${bg}" class="square">${piece}</div>`;
}
function isBlack(x, y){
	return !((x%2)^(y%2));
}

// String, bool
function generate(fen, blackPerspective){
	let result = "";
	const position = fen.split(" ")[0];
	let rows = position.split("/");
	if(blackPerspective){
		rows.reverse();
	}
	rows.forEach((row, index)=>{
		let chars = row.split("");
		if(blackPerspective){
		chars.reverse();
		}
		let j = 0;
		chars.forEach((char)=>{
			if(parseInt(char)){
				for(let i = 0; i < parseInt(char); i++){
					j++;
					result += square(isBlack(index, j, blackPerspective), "");
				}
			}
			else{
				j++;
				const isWhite = (char.toUpperCase() == char);
				let charLower = char.toLowerCase();
				const pieceColor = isWhite?"white":"black";
				const piece = pieces[pieceIndex.indexOf(charLower)];

				result += square(isBlack(index, j, blackPerspective), `<a class="piece" style="color:${pieceColor}">${piece}</a>`);

			}
		});
		result += "<br>";
	})
	return result;
}
export default generate;
