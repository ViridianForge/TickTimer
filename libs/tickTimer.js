/**
* Databases
*/
var timerDB = null;

var workoutDB = null;

/**
* Globals
*/
//Fields to cache elements that are frequently accessed.
var timeVis = null;
var timeFlipper = null;
var timeSet = null;
var startButton = null;
var cadenceChoose = null;
var signalChoose = null;
var metronome = null;
var timerList = null;

//Current Timer Modifiers
var curSound = null;
var curCadence = null;
var curDuration = null;
var curTimer = null;
var origTimer = null;
var curWorkout = null;
var timerRunning = null;
var lastTick = null;

//Metronome Sound Related things
var curMetSound = null;

var running = false;

//Initialize things on Window Load
window.onload = function(){
	
	//Cache elements that are frequently accessed.
	timeVis = $('#timer');
	timeSet = $('#timeSet');
	startButton = $('#start');
	cadenceChoose = $('#bpmSlider');
	signalChoose = $('#signalChooser');
	timeFlipper = $('#timeFlip');
	timerList = $('#timerPanel');
	
	//Test to see if local storage has anything related to the timer or workout information.
	if(!localStorage.getItem('timerDB')){
		timerDB = [];
	}else{
		timerDB = localStorage.getItem('timerDB');
		console.log(timerDB);
		console.log(timerDB[0]);
		for(var setting in timerDB){
			console.log(setting);
			addPreset(setting[1],setting[2],setting[3]);
		}
	}
	
	if(!localStorage.getItem('workoutDB')){
		workoutDB = [];
	}else{
		workoutDB = localStorage.getItem('workoutDB');
	}
	
	//Assign Button onClick Events
	
	//Start Button
	$('#start').click(function(){
		if(running === false){
			running = true;
			startButton.text("Pause");
			curDuration = getCurTime();
			lastTick = curDuration;
			curCadence = detCadence(cadenceChoose.val(),signalChoose.val());
			runTimer();
		}else{
			clearInterval(timerRunning);
			running = false;
			startButton.text("Start");
		}
	});

	//Reset Button
	$('#reset').click(function(){
		clearInterval(timerRunning);
		$('#timer').text(origTimer);
		if(running === true){
			running = false;
			startButton.text("Start");
		}
	});
	
	//Set Button
	$('#timeSet').click(function(){
		timeFlipper.datebox('open');
	});
	
	//Override functions for Dateflipper here?
	
	//Save the current settings as a new Timer Setting
	$('#saveSetting').click(function(){
		var newPreset = [origTimer, cadenceChoose.val(), signalChoose.val()];
		timerDB.push(newPreset);
		localStorage.setItem('timerDB',timerDB);
		//Add button representing new object
		console.log(timerDB);
		addPreset(origTimer, cadenceChoose.val(), signalChoose.val());
	});
}

//Timer related functions

function addPreset(time, cadence, effect){
	var idString = time+cadence+effect;
	var delIDString = 'del'+idString;
	var gridIDString = 'grid'+idString;
	//Begin by adding grid structure
	var appendNode = '<div class="ui-grid-a" id="'+gridIDString+'">';
	//Add Preset Button Structure
	appendNode+= '<div class="ui-block-a"><div class="ui-bar ui-bar-a" style="height: 60px;">';
	appendNode+= '<button id="'+idString+'">'+ time + ' ' + cadence + ' ' + effect +'</button>';
	appendNode+= '</div></div>';
	//Add Delete Button Structure
	appendNode+= '<div class="ui-block-a"><div class="ui-bar ui-bar-a" style="height: 60px;">';
	appendNode+= '<button id="'+delIDString+'" class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all"> Remove </button>';
	appendNode+= '</div></div>';
	//End grid structure and add new feature
	appendNode+= '</div>';
	timerList.append(appendNode);
	timerList.enhanceWithin();
	//Add event listeners
	$('#'+idString).click(function(){
		console.log(' Preset Pressed?')
		$('#timer').text(time);
		$('#bpmSlider').slider('value',cadence);
		$('#signalChooser').val(effect);
	});
	$('#'+delIDString).click(function(){
		console.log(' Preset Deleted?')		
		//Delete related grid structure
		$('#'+gridIDString).remove();
		//According to (http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory), jQuery should be doing binding cleanups when calling remove.
		timerList.enhanceWithin();
	});
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

function getCurTime(){
	var timeString = timeVis.text();
	var hours = parseInt(timeString.substring(0,2));
	var minutes = parseInt(timeString.substring(3,5));
	var seconds = parseInt(timeString.substring(6,8));
	var millis = parseInt(timeString.substring(9,12));
	return hours*3600000 + minutes*60000 + seconds*1000 + millis;
}

/**
Function to set the current timer value from a control system.
*/
function setTime(){
	var timeValue = timeFlipper.val();
	var hours = timeValue.substring(timeValue.length-8,timeValue.length-6);
	var minutes = timeValue.substring(timeValue.length-5,timeValue.length-3);
	var seconds = timeValue.substring(timeValue.length-2,timeValue.length);
	origTimer = hours + ':' + minutes + ":" + seconds + ":000";
	timeVis.text(origTimer);
}

/**
Function to start current timer operation
*/
function runTimer(){
	//Prep Timer
	timerRunning = window.setInterval(countdown, 33);
}

/**
Function to actually run timer
*/
function countdown(){
	updateTimer(curDuration);
	curDuration = curDuration - 33;
	if(curDuration <= 0){
		clearInterval(timerRunning);
		timeVis.text("00:00:00.000");
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
			curMetSound.play();
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

function detCadence(selection, effect){
	if(selection === 0){
		return 0;
	}else{
		//Convert the cadence selection into a ms representation of BPM.
		console.log(effect)
		console.log(metronome);
		curMetSound = new Audio('media/' + effect);
		console.log(metronome);
		return (60 / parseInt(selection)) * 1000;
	}
}