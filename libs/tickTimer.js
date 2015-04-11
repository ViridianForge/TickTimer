/**
* Databases
*/
var timerDB = { "timers": [
	{"name":"Test 1", "length": "120000", "cadence": "1000", "tick":"default 1"},
	{"name":"Test 2", "length": "60000", "cadence": "2000", "tick":"default 2"},
	{"name":"Test 3", "length": "180000", "cadence": "500", "tick":"default 3"}
	]
};

var workoutDB = { "workOuts": [
	{	"Workout 1": [
			"Test 1",
			"Test 1"
			],
		"Workout 2": [
			"Test 2",
			"Test 3",
			"Test 1",
			"Test 2"
			],
		"Workout 3": [
			"Test 2"
		]
	}
	]
};

/**
* Globals
*/

//Time Elements
var hrTens = null;
var hrOnes = null;

var mnTens = null;
var mnOnes = null;

var scTens = null;
var scOnes = null;

var millis = null;

//Control Elements
var timer = null;
var start = null;
var reset = null;

//Current Timer Modifiers
var curSound = null;
var curCadence = null;
var curDuration = null;
var curTimer = null;
var curWorkout = null;
var timerRunning = null;
var lastTick = null;

//Current Timer Data
var curHour = null;
var curMin = null;
var curSec = null;
var curCentSec = null;

var running = false;

//Initialize things on Window Load
window.onload = function(){
	
	var hrTens = $('#hrTens');
	var hrOnes = $('#hrTens');

	var mnTens = $('#hrTens');
	var mnOnes = $('#hrTens');

	var scTens = $('#hrTens');
	var scOnes = $('#hrTens');

	var millis = $('#hrTens');
	
	timer = document.getElementById('timer');
	start = document.getElementById('start');
	reset = document.getElementById('reset');
	
	metronome = document.getElementById('metronome');

	//Assign Button onClick Events
	$('#start').click(function(){
		if(running === false){
			running = true;
			$('#start').text("Pause");
			curDuration = 43510650;
			lastTick = curDuration;
			curCadence = detCadence(document.getElementById("cadenceChooser").value);
			console.log(curCadence);
			runTimer();
		}else{
			clearInterval(timerRunning);
			running = false;
			$('#start').text("Start");;
		}
	});

	$('#reset').click(function(){
		clearInterval(timerRunning);
		timer.textContent = "00:00:00.000";
		curHour = 0;
		curMin = 0;
		curSec = 0;
		curCentSec = 0;
	});
	
	$('#timeSet').click(function(){
		$('#timeFlip').datebox('open');
	});
}

//Timer related functions

/**
Function to define a new addition to the timer DB
*/
function newTimer(name, duration, cadence, sound){
}

/**
Function to change settings on a pre-existing timer
*/
function setTimer(name, duration, cadence, sound){
}

/**
Function to remove a timer from the database
*/
function deleteTimer(name){
}

//Workout related functions

/**
Function to define a new addition to the workout DB
*/
function newWorkout(name){
}

/**
Function to set the current timer value from a control system.
*/
function setTime(){
	console.log('Am I called?');
	var timeValue = $("#timeFlip").val();
	var hours = timeValue.substring(timeValue.length-8,timeValue.length-6);
	var minutes = timeValue.substring(timeValue.length-5,timeValue.length-3);
	var seconds = timeValue.substring(timeValue.length-2,timeValue.length);
	console.log(hours);
	console.log(minutes);
	console.log(seconds);
	timer.textContent = hours + ':' + minutes + ":" + seconds + ":000";
}

/**
Function to start current timer operation
*/
function runTimer(){
	//Prep Timer
	timerRunning = window.setInterval(countdown, 33);
	console.log(timerRunning);
}

/**
Function to actually run timer
*/
function countdown(){
	updateTimer(curDuration);
	curDuration = curDuration - 33;
	if(curDuration <= 0){
		clearInterval(timerRunning);
		timer.textContent = "00:00:00.000";
		curHour = 0;
		curMin = 0;
		curSec = 0;
		curCentSec = 0;
	}
}

function updateTimer(time){
	//Check to see if its time to play the cadence counter
	if(curCadence > 0){
		//console.log(lastTick)
		//console.log(time)
		if((lastTick - time) > curCadence){
			metronome.play();
			//console.log("Tick");
			lastTick = time;
		}
	}
	//Modify to stringify on the fly, adding leading zero if necessary.
	var hours = ~~(time / 3600000);
	time = time - (hours * 3600000);
	var minutes = ~~(time / 60000);
	time = time - (minutes * 60000);
	var seconds = ~~(time / 1000);
	time = time - (seconds * 1000);
	var milliSec = time;
	timer.textContent = timeString(hours,2) + ":" + timeString(minutes,2) + ":" + timeString(seconds,2) + "." + timeString(milliSec,3);
}

function timeString(input, digits){
	output = '';
	if(typeof input === 'number'){
		output = input.toString();	
	}
	for(var i=output.length; i<digits; i++){
		output = '0' + output;
	}
	return output;
}

function detCadence(selection){
	if(selection === 'No'){
		return 0;
	}else{
		//Convert the cadence selection into a ms representation of BPM.
		return (60 / parseInt(selection)) * 1000;
	}
}