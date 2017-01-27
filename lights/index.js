// define light colors
const dark = 'rgb(30,30,30)';
const red = 'red';
const yellow = 'yellow';
const green = 'rgb(14,208,103)';

// collect street references from DOM
var c_north = document.getElementById('clementina-north');
var c_south = document.getElementById('clementina-south');
var s_east = document.getElementById('sumner-east');
var s_west = document.getElementById('sumner-west');

// define stree lights object
class StreetLights {
	constructor(lightOne, lightTwo) {
		function initializeLight(light) {
			var red = light.getElementsByClassName('red');
			var yellow = light.getElementsByClassName('yellow');
			var green = light.getElementsByClassName('green');
			var left = light.getElementsByClassName('left');
			return {
				red: red[0],
				yellow: yellow[0],
				green: green[0],
				left: left[0]
			}
		}
		this.lightOne = initializeLight(lightOne);
		this.lightTwo = initializeLight(lightTwo);
	}
	clearAll() {
		for (var color in this.lightOne) {
			this.lightOne[color].style.background = dark;
		}
		for (var color in this.lightTwo) {
			this.lightTwo[color].style.background = dark;
		}
	}
	transition() {
		setTimeout(() => {
			this.clearAll();
			this.lightOne.yellow.style.background = yellow;
			this.lightTwo.yellow.style.background = yellow;
		}, 500);
	}
	startTraffic() {
		this.clearAll();
		this.lightOne.green.style.background = green;
		this.lightTwo.green.style.background = green;
	}
	turnLeft() {
		this.clearAll();
		console.log('turning left')
		this.lightOne.left.style.background = green;
		this.lightTwo.left.style.background = green;
	}
	stopTraffic() {
		this.clearAll();
		this.lightOne.red.style.background = red;
		this.lightTwo.red.style.background = red;
	}
}

// define intersection class
class Intersection {
	constructor(streetOne, streetTwo) {
		this.streetOne = streetOne;
		this.streetTwo = streetTwo;
	}
	streetOneGo() {
		this.streetOne.transition();
		setTimeout(() => {
			this.streetOne.startTraffic();
			this.streetTwo.stopTraffic();
		}, 3000);
	}
	streetOneLeft() {
		this.streetOne.turnLeft();
		this.streetTwo.stopTraffic();
	}
	streetTwoGo() {
		this.streetOne.stopTraffic();
		this.streetTwo.startTraffic();
	}
	streetTwoLeft() {
		this.streetOne.stopTraffic();
		this.streetTwo.turnLeft();	
	}
}

var streetOne = new StreetLights(c_north, c_south);
var streetTwo = new StreetLights(s_east, s_west);

var block = new Intersection(streetOne, streetTwo);

function handleClick(direction) {
	switch(direction) {
		case 'street-one-go':
			block.streetOneGo();
			break;
		case 'street-one-left':
			block.streetOneLeft();
			break;
		case 'street-two-go':
			block.streetTwoGo();
			break;
		case 'street-two-left':
			block.streetTwoLeft();
			break;
	}
}

// initialize intersection
block.streetOneGo();



