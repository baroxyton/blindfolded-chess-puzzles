import {read_pgn, read_text} from "./read_moves.js";
function prompt_async(message, speechText){
	if(speechText){
		read_text(message);
	}
	document.getElementById("prompt").style.display = "grid";
	document.getElementById("promptmessage").innerText = message;
	return new Promise(success=>{
		let solve = ()=>{
			let answer = document.getElementById("promptinput").value;
			document.getElementById("promptinput").value = "";
			document.getElementById("prompt").style.display = "none";
			success(answer);
		}
		document.getElementById("promptnext").onclick = ()=>solve(); 
		document.body.onkeydown = (e)=>{
			if(e.key != "Enter"){
				document.getElementById("promptinput").focus();
			}
			else{
				solve();
			}
		};
	})
}
function info_async(message,move,isWhite,speechText){
		document.getElementById("lipuzzle").innerHTML = ""; 
	if(speechText){
		read_pgn(move, isWhite);
	}
	document.getElementById("moveinfo").style.display = "grid";
	document.getElementById("infotext").innerText = message;
	return new Promise(success=>{
		let solve = ()=>{
			document.getElementById("moveinfo").style.display = "none";
			success();
		}
		document.getElementById("infonext").onclick = ()=>solve(); 
		document.body.onkeydown = (e)=>e.key=="Enter"?solve():0;
	});
}

function gameover_async(message, speechText, puzzleid){
		document.getElementById("lipuzzle").innerHTML = ""; 
	if(speechText){
		read_text(message);
	}
	document.getElementById("moveinfo").style.display = "grid";
	document.getElementById("infotext").innerText = message;
	if(puzzleid){
		document.getElementById("lipuzzle").innerHTML = `<a href="https://lichess.org/training/${puzzleid}" target="_blank">View on lichess</a>`;
	}
	return new Promise(success=>{
		let solve = ()=>{
			document.getElementById("moveinfo").style.display = "none";
			success();
		}
		document.getElementById("infonext").onclick = ()=>solve(); 
		document.body.onkeydown = (e)=>e.key=="Enter"?solve():0;
	});


}


export {info_async, prompt_async, gameover_async};
