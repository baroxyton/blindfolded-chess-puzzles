import parseData from "./data_parse.js";
import {info_async, prompt_async, gameover_async} from "./prompt_async.js";
import Engine from "./pgn_engine.js";


class PgnTraining{
	constructor(store){
		this.store = store;
		this.enable_tts = ()=>this.store.data.enable_speech;
		document.getElementById("elo_display").innerText = Math.round(this.store.data.pgn_elo) + " Elo";
		this.fetchGames();
	}
	async fetchGames(){
		this.games = await (await fetch("pgn_puzzles.json")).json();
		this.game = this.chooseGame();
		console.log(this.game);
		this.startGame();
	}
	// O(n)
	chooseGame(){
		let best_match;
		let best_score = 0;
		let games = this.games;
		games.forEach(game=>{
			const id = parseData(game.data).puzzleid;
			let score = 1;
			const played_before = this.store.data.pgn_puzzles_solved.includes(id);
			if(played_before){
				score *= 0.2;
			}
			const ratingdiff = Math.abs(this.store.data.pgn_elo - game.rating.pgn_rating);
			score *= (30/(ratingdiff + 0.01));
			score *= (1 + Math.random()) 

			if(score > best_score ){
				best_score = score;
				best_match = game;
			}

		});
		return best_match;
	}
	async startGame(){
		this.data = parseData(this.game.data);
		let move_num = this.game.pgn.length + this.data.moves.split(" ").length - 1;
		document.getElementById("movesleft").innerText = `moves: 1/${move_num}` 
		let move_count = 0;
		document.getElementById("prating").innerText = `${Math.round(this.game.rating.pgn_rating)} elo puzzle` 
		this.engine = new Engine(this.game.pgn);
		let isWhite = true
		for(const move in this.game.pgn){
			move_count++;
			document.getElementById("movesleft").innerText = `moves: ${move_count}/${move_num}` 
			const color = isWhite?"White":"Black";
			await info_async(color + ": " + this.game.pgn[move], this.engine.detectMove(this.game.pgn[move]), isWhite, this.enable_tts());	
			isWhite = !isWhite;
		}
		let userPerspective = isWhite;
		let moves = this.data.moves.split(" ").slice(1);
		let success = true;
		for(let move in moves){
			move_count++;
			if(!success){
				continue;
			}
			let uciMove = moves[move];
			let pgnMove = this.engine.toPgn(uciMove);
			let parsedMove = this.engine.detectMove(pgnMove);
			if(isWhite == userPerspective){
				const userAnswer = await prompt_async((isWhite?"White":"Black") + " to move", this.enable_tts()); 
				let parsedUA;
				try{
				parsedUA = this.engine.detectMove(userAnswer);
				}
				catch(e){
					parsedUA = {};
				}
				console.log(parsedMove, parsedUA)
				let isCorrect = (parsedMove.piece == parsedUA.piece && parsedMove.dest == parsedUA.dest);
				if(!isCorrect){
					success = false;
				}
				if(success){
					if(move_count==move_num){
					await gameover_async("Solved!", this.enable_tts(), this.data.puzzleid);				
					}
					else{
					await gameover_async("Correct move!", this.enable_tts());				
					}
				}
				else{
					await gameover_async("Incorrect! Solution: " + pgnMove, this.enable_tts(), this.data.puzzleid);
				}

			}
			else{
				const color = isWhite?"White":"Black";
				await info_async(color + ": " + pgnMove, parsedMove, isWhite, this.enable_tts());	
			}

			isWhite = !isWhite;
		}
		this.finished(success);


	}
	finished(success){
		let elo_diff = success?20:-20;
		if(this.store.data.pgn_newb_multiplier > 0){
			elo_diff *= this.store.data.pgn_newb_multiplier * 1.2;
			this.store.data.pgn_newb_multiplier  -= 0.5;
		}
		this.store.data.pgn_elo += elo_diff;
		this.store.data.pgn_puzzles_solved.push(this.data.puzzleid);
		this.store.save();
		new PgnTraining(this.store); 
	}
}
export default PgnTraining;
