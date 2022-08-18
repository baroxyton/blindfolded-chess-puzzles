class Square{
	constructor(piece=undefined, color=undefined, isNew=true){

		this.square = {piece, color, isNew};
	}
}
class Engine{
	// Either PGN moves or FEN
	constructor(moves=undefined,fen=undefined){
		this.defaultBoard();
		if(moves){
			this.makeMoves(moves);
		}
		else if(fen){
			this.setFEN(fen);
		}
	}
	getFEN(){
		let result = [];
		for(let i = 0; i < 8; i++){
			let row = this.board[i];
			let rowResult = "";
			row.forEach(piece=>{
				if(!piece.square.piece){
					if(parseInt(rowResult.slice(-1))){
						rowResult = rowResult.slice(0, -1) + (parseInt(rowResult.slice(-1)) + 1);
					}
					else{
						rowResult += 1;
					}
				}
				else{
					let isWhite = (piece.square.color=="w");
					let pieceType = piece.square.piece;

					if(isWhite){
						pieceType = pieceType.toUpperCase();
					}
					rowResult += pieceType;

				}

			})
			result.push(rowResult)
		}
		return result.reverse().join("/");
	}
	setFEN(fen, isNew=true){
		this.board = Array(8);
		for(let r = 0; r < 8; r++){
			this.board[r] = [];
		}
		let rows = fen.split(" ")[0].split("/").reverse();
		rows.forEach((rowfen,i)=>{
			let row = this.board[i];
			let pieces = rowfen.split("");
			pieces.forEach(piece=>{
				if(parseInt(piece)){
					let num = parseInt(piece);
					for(let j = 0; j < num; j++){
						row.push(new Square());
					}
				}
				else{
					let isWhite = piece.toUpperCase() == piece;
					let pieceType = piece.toLowerCase();
					row.push(new Square(pieceType, isWhite?"w":"b", isNew));
				}
			});
		})
	}
	empty(){
		this.setFEN("///////");
	}
	defaultBoard(){
		this.setFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
	}
	findMoves(pieceType, dest, isWhite){
		let enPassant = [];
		const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
		let results = [];

		for(let i = 0; i < this.board.length; i++){
			let row = this.board[i];
			for(let j = 0; j < row.length; j++){
				let isPassant = false;
				let dests = [];
				let square = row[j];
				if(square.square.piece != pieceType){
					continue;
				}
				if(square.square.color == (isWhite?"b":"w")){
					continue;
				}
				if(pieceType == "p"){
					if(!this.board[i + (isWhite?1:-1)][j].square.piece){
						dests.push(letters[j] + (1+i  + (1 * (isWhite?1:-1))));

						if((i == (isWhite?1:6)) && !this.board[i + (2 * (isWhite?1:-1))][j].square.piece&& square.square.isNew){

							dests.push(letters[j] + (i + 1  + (2 * (isWhite?1:-1))));
						}
					}
					// Pawn capture

					if((j < 7) && (this.board[i + (1 * (isWhite?1:-1))][j+1].square.color === (isWhite?"b":"w"))){
						dests.push(letters[j+1] + (i + 1  + (1 * (isWhite?1:-1))));
					}
					if((j > 0)  && (this.board[i + (1 * (isWhite?1:-1))][j-1].square.color === (isWhite?"b":"w"))){
						dests.push(letters[j-1] + (i + 1  + (1 * (isWhite?1:-1))));
					}
					// En passant
					if((j < 7) && (this.board[i][j+1].square.color === (isWhite?"b":"w"))){
						isPassant = true;
						dests.push(letters[j+1] + (i + 1  + (1 * (isWhite?1:-1))));
					}

					if((j < 0) && (this.board[i][j-1].square.color === (isWhite?"b":"w"))){
						isPassant = true;
						dests.push(letters[j-1] + (i + 1  + (1 * (isWhite?1:-1))));
					}






				}
				else if(pieceType == "n"){

					let locations = [[i+1, j+2],[i+2, j+1],[i-1, j+2],[i-2, j+1],[i+1, j-2],[i+2, j-1],[i-1, j-2],[i-2, j-1]].filter(xy=>xy[0]<8&&xy[0]>-1&&xy[1]<8&&xy[1]>-1);
					locations.forEach(location=>{
						if(!this.board[location[0]][location[1]].square.piece||this.board[location[0]][location[1]].square.color == (isWhite?"b":"w")){
							dests.push(letters[location[1]] + (1+location[0]));
						}
					});


				}

				// Only one king & queen
				else if(pieceType == "k"){
					results.push([i, j]);
				}
				else if(pieceType == "b"){
					dests = this.slideMove([i, j], isWhite,(x,y)=>[x+1, y+1]).concat(this.slideMove([i, j], isWhite,(x,y)=>[x-1, y-1]),this.slideMove([i, j], isWhite,(x,y)=>[x+1, y-1]),this.slideMove([i, j], isWhite,(x,y)=>[x-1, y+1]));	
				}
				else if(pieceType == "r"){
					dests = this.slideMove([i, j], isWhite,(x,y)=>[x+1, y]).concat(this.slideMove([i, j], isWhite,(x,y)=>[x-1, y]),this.slideMove([i, j], isWhite,(x,y)=>[x, y-1]),this.slideMove([i, j], isWhite,(x,y)=>[x, y+1]));	
				}
				else if(pieceType == "q"){
					let bishopMoves =  this.slideMove([i, j], isWhite,(x,y)=>[x+1, y+1]).concat(this.slideMove([i, j], isWhite,(x,y)=>[x-1, y-1]),this.slideMove([i, j], isWhite,(x,y)=>[x+1, y-1]),this.slideMove([i, j], isWhite,(x,y)=>[x-1, y+1]));	
					let rookMoves =  this.slideMove([i, j], isWhite,(x,y)=>[x+1, y]).concat(this.slideMove([i, j], isWhite,(x,y)=>[x-1, y]),this.slideMove([i, j], isWhite,(x,y)=>[x, y-1]),this.slideMove([i, j], isWhite,(x,y)=>[x, y+1]));	
					dests = bishopMoves.concat(rookMoves);
				}
				if(dests.includes(dest)){
					if(isPassant){
						enPassant.push([i, j]);
					}
					results.push([i, j]);
				}

			}
		}
		results.enPassant = enPassant;
		return results;
	}
	detectMove(pgn){
		let result = {};
		// Slice off check & checkmate
		if(pgn.slice(-1) == "#"||pgn.slice(-1) == "+"){
			pgn = pgn.slice(0,-1);
		}
		if(pgn.includes("x")){
			result.capture = true;
		}
		pgn.replace("x", "");
		if(pgn.split("=")[1]){
			result.promote = true;
			result.promotion = pgn.split("=")[1];
			pgn = pgn.split("=")[0];
		}
		// Check for castling
		if(pgn == "O-O"){
			result.type = "scastle";
			return result;
		}
		if(pgn == "O-O-O"){
			result.type = "lcastle";
			return result;
		}
		// Check for pawn move
		// exd8=Q# -> exd8=Q -> exd8 -> ed8 -> d8
		// e3 -> e3
		if(pgn[0] == pgn[0].toLowerCase()){
			result.file = pgn[0];
			result.type = "pawn";
			result.piece = "p";
			result.dest = pgn.slice(-2);
			return result;
		}
		// Has to be normal piece move "Nf3"
		result.type = "piece";
		result.piece = pgn[0].toLowerCase();
		result.dest = pgn.slice(-2);
		// Move like: R1d5 where file clarification is needed
		if(pgn.length == 4){
			result.file = pgn[1];
		}
		return result;
	}
	// No move verification needed (trusted dataset)
	makeMove(pgnNotation, isWhite){
		console.log(pgnNotation);
		const move = this.detectMove(pgnNotation);	
		if(move.type =="scastle"){
			if(isWhite){
				//e1
				// [R N B Q K . . R] -> [R N B Q . R K .]
				let king = this.board[0][4];
				let rook = this.board[0][7];

				this.board[0][4] = new Square();
				this.board[0][7] = new Square();

				this.board[0][6] = king;
				this.board[0][5] = rook;
				return;
			}

			else{
				let king = this.board[7][4];
				let rook = this.board[7][7];

				this.board[7][4] = new Square();
				this.board[7][7] = new Square();

				this.board[7][6] = king;
				this.board[7][5] = rook;
				return;
			}

		}
		if(move.type == "lcastle"){
			if(isWhite){
				// [R . . . K B N R] -> [. . K R . B N R] 
				let king = this.board[0][4];
				let rook = this.board[0][0];

				this.board[0][4] = new Square();
				this.board[0][0] = new Square();

				this.board[0][2] = king;
				this.board[0][3] = rook;
				return;
			}
			else{
				// [R . . . K B N R] -> [. . K R . B N R] 
				let king = this.board[7][4];
				let rook = this.board[7][0];

				this.board[7][4] = new Square();
				this.board[7][0] = new Square();

				this.board[7][2] = king;
				this.board[7][3] = rook;
				return;
			}
		}
		if(move.type == "pawn"||move.type == "piece"){
			let opos  = this.findMoves(move.piece, move.dest, isWhite);
			if(opos.length>1&&move.file){
				opos = opos.filter(om=>{
					if(parseInt(move.file)){
						return om[0] == parseInt(move.file - 1); 
					}
					return om[1] == ["a","b","c","d","e","f","g","h"].indexOf(move.file);
				})	
			}
			console.log(opos, "OPOS");
			if(!opos.length){
				console.log("Move fail: " + pgnNotation)
				return;
			}
			let enPassant = false;
			if(opos.enPassant?.find(passant=>{
				return opos[0][0] == passant[0] && opos[0][1] == passant[1];
			})){
				enPassant = true;
			}
			opos = opos[0];
			let piece = this.board[opos[0]][opos[1]];
			if(move.promote){
				piece.square.piece = move.promotion.toLowerCase();
			}
			let target = this.coords(move.dest);

			this.board[target[0]][target[1]] = piece;
			this.board[opos[0]][opos[1]] = new Square();
			if(enPassant){
				console.log("REMOVING EN PASSANT SQUARE")
				
			this.board[target[0] - (isWhite?1:-1)][target[1]] = new Square();
			}


		}
	}                                               
	slideMove(startCoords, isWhite, moveFunc){
		let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
		let availableMoves = [];
		let x = startCoords[1];
		let y = startCoords[0];

		let isValid = true;
		while(isValid){
			let newCoords = moveFunc(y,x);
			x = newCoords[1];
			y = newCoords[0];
			if(x > 7||x<0||y>7||y<0){
				isValid = false;
				break;
			}
			// Friendly piece in the way
			if(this.board[y][x].square.color == (isWhite?"w":"b")){
				isValid = false;
				break;
			}
			if(this.board[y][x].square.color == (isWhite?"b":"w")){
				isValid = false;
				availableMoves.push(letters[x] + (y+1));
				break;
			}

			availableMoves.push(letters[x] + (y+1));


		}

		return availableMoves;
	}
	coords(coords){
		let col = coords[0];
		let row = parseInt(coords[1]);

		let colNum = ["a","b","c","d","e","f","g","h"].indexOf(col);
		return [row-1, colNum];
	}
	makeMoves(pgn){
		let isWhite = true;
		pgn.forEach(move=>{this.makeMove(move, isWhite);
		isWhite = !isWhite;
		});
	}
	toPgn(uci){
		let promote = false;
		if(uci.includes("=")){
			promote = uci.split("=")[1];
			uci = uci.split("=")[0];
		}
		let startPos = uci.slice(0, 2);
		let dest = uci.slice(-2);

		let xDest = ["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(dest[0]);
		let yDest = parseInt(dest[1]) - 1;

		let isCapture = Boolean(this.board[yDest][xDest].square.piece);

		let x = ["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(startPos[0]);
		let y = parseInt(startPos[1]) - 1;

		let pieceType = this.board[y][x].square.piece.toUpperCase();
		if(pieceType == "P"){
			let file = startPos[0];

			return (file + (isCapture?"x":"") + dest + (promote?("=" + promote):""));
		}
		else{
			return pieceType + (isCapture?"x":"") + dest;
		}
	}
}
export default Engine;
