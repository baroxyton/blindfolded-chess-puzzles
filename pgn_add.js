function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const fetch = require("sync-fetch");
const fs= require("fs");
//const apiKey = process.env.LICHESSAPI;

console.log("reading & parsing..");
let data = JSON.parse(fs.readFileSync("./pgn_puzzles.json").toString());

let ids = [];
let responses = [];
(async function(){
 console.log("getting ids..")
 for(item in data){
 const url = data[item].data.split(",")[8];
 const id = url.split("/")[3].split("#")[0];


 ids.push(id);
 }
 let i = 0;
 console.log("Requesting lichess pgn..")
 while(i < ids.length){
 let ids_batch = [];
 let i_old = i;
 for(i=i; i<(i_old+300); i++){
 if(i>ids.length){
 break;
 }
 ids_batch.push(ids[i]);
 }
 responses.push(makeRequest(ids_batch).text());
 await sleep(500);
 console.log((i/80).toFixed(2) + "%");
 }
 console.log("adding pgn to puzzles...");
 processResponses();
})()

function processResponses(){
	responses.forEach((response,i)=>{
			const pgns = response.split("\n\n\n").slice(0,-1);
			pgns.forEach((pgnr,i)=>{
					const split = pgnr.split("\n\n");
					const tags = split[0].split("\n");
					const url = tags[1].split("\"")[1];
					const id = url.split("/")[3];
					const index = ids.indexOf(id);
					

					let pgn = split[1].split(" ").filter(move=>!move.includes("."));
					const pgn_length = data[index].data.split(",")[8].split("#")[1];
					pgn = pgn.slice(0, pgn_length);
					data[index].pgn = pgn;
					
					
					})
			console.log(i/responses.length * 100);
			});
console.log("Saving..");
fs.writeFileSync("./pgn_puzzles.json", JSON.stringify(data));
}

function makeRequest(ids){
	console.log(ids[0], ids.length);
	const body = ids.join(",");
	const url = "https://lichess.org/api/games/export/_ids";
	return fetch(url, {method:"POST", body});
}
