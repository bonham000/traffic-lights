
// toggle display for about panel
var showAbout = () => about.style.display = 'inline';
var closeAbout = () => about.style.display = 'none';

// define light colors
const dark = 'rgb(30,30,30)';
const red = 'red';
const yellow = 'yellow';
const green = 'rgb(14,208,103)';

const about = document.getElementById('about');

// collect street references from DOM
const c_north = document.getElementById('clementina-north');
const c_south = document.getElementById('clementina-south');
const s_east = document.getElementById('sumner-east');
const s_west = document.getElementById('sumner-west');

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
		this.state = 'red';
	}
	clearAll() {
		for (var color in this.lightOne) this.lightOne[color].style.background = dark;
		for (var color in this.lightTwo) this.lightTwo[color].style.background = dark;
	}
	transition() {
		setTimeout(() => {
			this.clearAll();
			this.lightOne.yellow.style.background = yellow;
			this.lightTwo.yellow.style.background = yellow;
		}, 300);
	}
	startTraffic() {
		this.clearAll();
		this.lightOne.green.style.background = green;
		this.lightTwo.green.style.background = green;
		this.state = 'green';
	}
	turnLeft() {
		this.clearAll();
		this.lightOne.left.style.background = green;
		this.lightTwo.left.style.background = green;
		this.state = 'left';
	}
	stopTraffic() {
		this.clearAll();
		this.lightOne.red.style.background = red;
		this.lightTwo.red.style.background = red;
		this.state = 'red';
	}
	alarm() {
		this.clearAll();
		this.stopTraffic();
		setTimeout(() => {
			this.clearAll();
		}, 500);
	}
	getState() {
		return this.state;
	}
}

// define intersection class
class Intersection {
	constructor(streetOne, streetTwo) {
		// initialize intersection and set one pair of lights to be green:
		this.streetOne = streetOne;
		this.streetOne.clearAll();
		this.streetOne.startTraffic();
		this.streetTwo = streetTwo;
		this.streetTwo.clearAll();
		this.streetTwo.stopTraffic();
		this.inTransition = false;
		this.alarm = null;	
	}
	goStraight(streetOne, streetTwo) {
		if (streetOne.getState() !== 'red') {
			streetOne.transition();
			setTimeout(() => {
				streetOne.stopTraffic();
				streetTwo.startTraffic();
				this.inTransition = false;
			}, 1800);
		} else if (streetTwo.getState() === 'left') {
			streetTwo.transition();
			setTimeout(() => {
				streetTwo.startTraffic();
				this.inTransition = false;
			}, 1800);
		}
	}
	streetOneGo() {
		if (!this.inTransition) {
			this.inTransition = true;
			this.goStraight(this.streetTwo, this.streetOne);
		}
	}
	streetTwoGo() {
		if (!this.inTransition) {
			this.inTransition = true;
			this.goStraight(this.streetOne, this.streetTwo);
		}
	}
	goLeft(streetOne, streetTwo) {
		console.log('left');
		if (streetTwo.getState() !== 'red') {
			streetTwo.transition();
			setTimeout(() => {
				streetOne.turnLeft();
				streetTwo.stopTraffic();
				this.inTransition = false;
			}, 1800);
		} else if (streetOne.getState() === 'green') {
			streetOne.transition();
			setTimeout(() => {
				streetOne.turnLeft();
				this.inTransition = false;
			}, 1800);
		}
	}
	streetOneLeft() {
		if (!this.inTransition) {
			this.inTransition = true;
			this.goLeft(this.streetOne, this.streetTwo);
		}
	}
	streetTwoLeft() {
		if (!this.inTransition) {
			this.inTransition = true;
			this.goLeft(this.streetTwo, this.streetOne);
		}
	}
	emergency() {
		if (!this.alarm && !this.inTransition) {
			this.inTransition = true;
			this.streetOne.stopTraffic();
			this.streetTwo.stopTraffic();
			this.alarm = setInterval(() => {
				this.streetOne.alarm();
				this.streetTwo.alarm();
			}, 1000);
			document.getElementById('crash-btn').innerHTML = 'Use magic to fix lights';
		} else {
			this.inTransition = false;
			clearInterval(this.alarm);
			this.alarm = null;
			this.streetOne.startTraffic();
			this.streetTwo.stopTraffic();
			document.getElementById('crash-btn').innerHTML = 'Crash car into light post'
		}
	}
}

// create instances of street lights and intersections
var streetOne = new StreetLights(c_north, c_south);
var streetTwo = new StreetLights(s_east, s_west);
var block = new Intersection(streetOne, streetTwo);

// handle click events from page
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
		case 'emergency':
			block.emergency();
			break;
	}
}

