
// toggle display for about panel
const about = document.getElementById('about');
var showAbout = () => about.style.display = 'inline';
var closeAbout = () => about.style.display = 'none';

// define colors for lights
const dark = 'rgb(30,30,30)';
const red = 'red';
const yellow = 'yellow';
const green = 'rgb(14,208,103)';

// collect street references from DOM
const c_north = document.getElementById('clementina-north');
const c_south = document.getElementById('clementina-south');
const s_east  = document.getElementById('sumner-east');
const s_west  = document.getElementById('sumner-west');

// define street lights object
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
	getState() {
		return this.state;
	}
	clearAll() {
		for (var color in this.lightOne) this.lightOne[color].style.background = dark;
		for (var color in this.lightTwo) this.lightTwo[color].style.background = dark;
		this.lightOne.left.style.color = dark;
		this.lightTwo.left.style.color = dark;
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
		this.lightOne.left.style.background = dark;
		this.lightOne.left.style.color = green;
		this.lightTwo.left.style.background = dark;
		this.lightTwo.left.style.color = green;
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
	// one function to handle green-lights:
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
	// one function to handle left-turn lights:
	goLeft(streetOne, streetTwo) {
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
		} else {
			this.inTransition = false;
		}
	}
	streetOneLeft() {
		console.log('left');
		if (!this.inTransition) {
			console.log('here');
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
	// handle emergency behavior where there is a mechanical problem in the system:
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
		} else if (this.alarm) {
			this.inTransition = false;
			clearInterval(this.alarm);
			this.alarm = null;
			this.streetOne.stopTraffic();
			this.streetTwo.stopTraffic();
			setTimeout(() => {
				this.streetOne.startTraffic();
				this.streetTwo.stopTraffic();
			}, 1005);
			document.getElementById('crash-btn').innerHTML = 'Crash car into light post'
		}
	}
}

// create instances of street lights and intersection
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


