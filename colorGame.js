var codedColors=[];
var attemptCount=0;
var liner_matrix={1:["Guess number 1", "First attempt!", "One shot!", "Killed it!", "That one click!", "First touch!", "Immediate win!", "Wohoo!"],
			  2:["Second chance story!", "Not first but then second!", "Guess number two", "Wohoo!", "Second click!"],
			  3:["You win!", "Slayed!", "Thats nice", "Great!", "You're right!", "Thats the one", "Thats it", "Found it!", "Got it!", "Yap"],
			  4:["You win!", "Slayed!", "Thats nice", "Great!", "You're right!", "Thats the one", "Thats it", "Found it!", "Got it!", "Yap"],
			  5:["5 attempts ain't bad", "Last second guess!", "Just one less", "Finally!", "Yeah!", "It took you 5 tries", "5 tries", "5 clicks", "5 guesses"],
			  6:["You anyways win :P", "That was the only one :P", "That's a 100% win", "Only square :P", "One lock, one key :P"],
			  last:["You anyways win :P", "That was the only one :P", "That's a 100% win case", "Only square :P", "One lock, one key :P"]}		  
var numSquares = 6;
var colors = generateRandomColors(numSquares);
var squares = document.querySelectorAll(".square");
var pickedColor = pickColor();
var colorDisplay = document.getElementById("colorDisplay");
var messageDisplay = document.querySelector("#message");
var h1 = document.querySelector("h1");
var resetButton = document.querySelector("#reset");
var modeButtons = document.querySelectorAll(".mode");
var heading1 = document.getElementById("line1");
var body = document.getElementById("backbody");


for(var i = 0; i < modeButtons.length; i++) {
	modeButtons[i].addEventListener("click", function() {
		modeButtons[0].classList.remove("selected");
		modeButtons[1].classList.remove("selected");
		this.classList.add("selected");	
		this.textContent === "1 x 3" ?	numSquares = 3 : numSquares = 6;
		var reset_trigger = setInterval(reset, 60);
		setTimeout(()=>{clearInterval(reset_trigger);}, 500);
	});
}


refresh();
resetButton.addEventListener("click", refresh);






// ---------------------FUNCTIONS---------------------


function clickSetter() 
{
		//grab color of clicked squares
		var clickedColor = this.style.background;
		attemptCount++;
		//compare color to pickedColor
		if(clickedColor === pickedColor) {
			colorDisplay.textContent = "correct guess";
			messageDisplay.textContent = "";
			changeColors(clickedColor);
			heading1.textContent = getRelevantRandomMessage();
			h1.style.background = clickedColor;
			document.getElementsByTagName("html")[0].style.backgroundColor=invertColor(getCode(pickedColor));
			clearEvents();
			setTimeout(refresh, 1500);

		} else 
		{
			this.style.background = "#FFFFFF";
			messageDisplay.textContent = "Try Again";
		}
}

async function refresh()
{
	clearEvents();
	allocateColors();
	colorDisplay.textContent = pickedColor;
	var reset_trigger = setInterval(reset, 100);
	let p= new Promise((resolve, reject)=>{
		setTimeout(()=>{clearInterval(reset_trigger); resolve();}, 500);
	});

	await p.then(()=>{associateEvents()});
	
}

function reset() 
{
	colors = generateRandomColors(numSquares);
	//pick a new random color from array
	pickedColor = pickColor();
	//change colorDisplay to match picked Color
	colorDisplay.textContent = pickedColor;
	resetButton.textContent = "New Colors";
	messageDisplay.textContent = "";
	attemptCount=0;
	codedColors=[];
	//change colors of squares
	allocateColors();

	h1.style.background = "black";
	heading1.textContent = "Guess the square";
	document.getElementsByTagName("html")[0].style.backgroundColor="white";
}

function allocateColors()
{
	for(var i = 0; i < squares.length; i++) {
		if(colors[i]){
			squares[i].style.display = "block";
			squares[i].style.background = colors[i];
		} else {
			squares[i].style.display = "none";
		}
	}
}

function changeColors(color) {
	//loop through all squares
	for(var i = 0; i < squares.length; i++) {
		//change each color to match given color
		squares[i].style.background = color;
	}
}

function pickColor() {
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
}

function generateRandomColors(num) {
	//make an array
	var arr = [];
	//add num random colors to arr
	for(var i = 0; i < num; i++) {
		//get random color and push into arr
		var x=randomColor()
		arr.push(x);
		codedColors.push(getCode(x));
	}
	//return that array
	return arr;
}

function randomColor() 
{
	try
	{
		//pick a "red" from 0 - 255
		var r = Math.floor(Math.random() * 256);
		//pick a "green" from 0 - 255
		var g = Math.floor(Math.random() * 256);
		//pick a "blue" from 0 - 255
		var b = Math.floor(Math.random() * 256);

		//Generate string code
		var string = "rgb(" + r + ", " + g + ", " + b + ")";

		if(!confirmVariance(getCode(string)))
		{
			return randomColor();
		}

		else
		{
			return string;
		}
	}
	catch(err)
	{
		return randomColor();
	}
}

function getCode(array)
{
	let [r,g,b]=array.slice(4,-1).replace(/\s/g, '').split(",");
	r=parseInt(r);
	g=parseInt(g);
	b=parseInt(b);
	return [r,g,b];
}

function EucDistBetween(c1,c2)
{
	return Math.sqrt(Math.pow((c2[0]-c1[0]),2)+Math.pow((c2[1]-c1[1]),2)+Math.pow((c2[2]-c1[2]),2));
}

function confirmVariance(color)
{
	if (codedColors.length===0)
	{
		return true;
	}

	for (var each of codedColors)
	{
		if(EucDistBetween(each, color)<120)
		{
			return false;
		}
	}
	return true;
}


function help_distanceMatrix()
{
	for (var c1 of codedColors)
	{
		for (var c2 of codedColors)
		{
			console.log(EucDistBetween(c1,c2));
		}
		console.log("------------");
	}
}

function getRelevantRandomMessage()
{
	if(attemptCount===numSquares)
	{
		return liner_matrix["last"][Math.floor(Math.random() * liner_matrix["last"].length)];
	}
	else
	{
		return liner_matrix[attemptCount][Math.floor(Math.random() * liner_matrix[attemptCount].length)];
	}
}


function invertColor(color){return "rgb(" + Math.abs(255-color[0]) + ", " + Math.abs(255-color[1]) + ", " + Math.abs(255-color[2]) + ")";}

function clearEvents()
{
	for(var i = 0; i < squares.length; i++)
	{
		squares[i].removeEventListener("click", clickSetter);	//remove event listener so no user interaction during UI animation
	}
}

function associateEvents()
{
	for(var i = 0; i < squares.length; i++)
	{
		squares[i].style.background = colors[i];	// add initial colors to squares
		squares[i].addEventListener("click", clickSetter);	//add click listeners to squares
	}
}