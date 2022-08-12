const fs = require("fs");
const data = fs.readFileSync("./lichess_db_puzzle.csv").toString().split("\n");
// PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningFamily,OpeningVariation

let result = [];

// const sample = "00sHx,q3k1nr/1pp1nQpp/3p4/1P2p3/4P3/B1PP1b2/B5PP/5K2 b k - 0 17,e8d7 a2e6 d7d8 f7f8,1760,80,83,72,mate mateIn2 middlegame short,https://lichess.org/yyznGmXs/black#34,Italian_Game,Italian_Game_Classical_Variation"
data.slice(0,-1).forEach((sample,i)=>{
const values =  sample.split(",");
const pid = values[0];
const fen = values[1].split(" ")[0].split("");;
let piece_count = 0;
fen.forEach((char,i)=>{
if(!parseInt(char)&&char !== "/"){
piece_count++;
}
})
const rating = values[3];
const gameUrl = values[8];
const puzzleLength = values[2].split(" ").length;
const puzzlePos = parseInt(gameUrl.split("#")[1]);
// const pgn_rating = rating/17 * (Math.log(puzzlePos**2 * puzzleLength**3)/Math.log(1.2));
pgn_rating = Math.log(puzzlePos**3 * puzzleLength**3)/Math.log(1.1) * 10;
if(rating > 2500){
pgn_rating *= 3;
}
else if(rating > 2000){
pgn_rating *= 2;
}
else if(rating > 1500){
pgn_rating *= 1.5;
}
 
const fen_rating = rating/40 * Math.log(piece_count * rating)/Math.log(1.2);
//console.log({rating, gameUrl, puzzleLength, puzzlePos, adjusted_rating});
result.push({data:sample,rating:{pgn_rating,fen_rating}})
if(i % 30000 == 0){
console.log((i/27000).toFixed(2)+"%");
}
}
)

console.log("Done adjusting ratings.. start sorting");

const resultsPgn = result.sort((a,b)=>{
return a.rating.pgn_rating - b.rating.pgn_rating;
});
console.log("hardest pgn puzzle: ", resultsPgn[resultsPgn.length - 1])
console.log("Done sorting pgns puzzles.. saving and sorting fen puzzles next");
// 3000 easiest puzzles
let toSave = resultsPgn.slice(0,3000);
// 2'700'000/1'000 = 2'700
for(let i = 3000; i < resultsPgn.length; i += 1000){
toSave.push(resultsPgn[i]);
}
fs.writeFileSync("./pgn_puzzles.json", JSON.stringify(toSave));


const resultsFen = result.sort((a,b)=>{
return a.rating.fen_rating - b.rating.fen_rating;
});


let toSaveFen = resultsFen.slice(0,3000);
for(let i = 3000; i < resultsFen.length; i += 1000){
toSaveFen.push(resultsFen[i]);
}

console.log("Done sorting fen puzzles.. saving");
fs.writeFileSync("./fen_puzzles.json", JSON.stringify(toSaveFen));


console.log("All done");
