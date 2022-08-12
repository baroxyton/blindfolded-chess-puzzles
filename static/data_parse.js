// PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningFamily,OpeningVariation
function parse(data){
	const split = data.split(",");
	let result = {};
	result.puzzleid = split[0];
	result.fen = split[1];
	result.moves = split[2];
	result.rating = split[3];
	result.ratingdeviation = split[4];
	result.popularity = split[5];
	result.nbplays = split[6];
	result.themes = split[7];
	result.gameurl = split[8];
	result.openingfamily = split[9];
	result.openingvariation = split[10];
	return result;
}
export default parse;
