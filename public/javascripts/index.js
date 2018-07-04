 // 7-4-2018 release

 $(document).ready(function() {
	'use strict';

 	var interval;
	var timerRunning;
	var timerPaused;
	var secondsRemaining;
	var minutesPreference;
	var mutePreference;
	var sessionsCompleted;

 	//variables to store UI controls
	var display = $('#timer');
	var startButton = $('#start');
	var stopButton = $('#stop');
	var resetButton = $('#reset');
	var saveButton = $('#save');
	var preferencesButton = $('#preferences')
	var minutesTextBox = $('#minutes');
	var muteCheckBox = $('#mute');
	var settingsModal = $('#settingsModal');
	var sessionsCompletedBadge = $('#sessionsCompleted');
	var timesUp = document.getElementById("timesUp");
	var timesUpSrc = '/sounds/timesup.mp3';


	//timer initialization
	getPreferences();
	getSessionsCompleted();
	updateUIWithPreferences();
	//end initialization

	/*
		BUTTON EVENTS
	*/
 	startButton.click(function() {

 		if (timerRunning) {
 			//hitting 'pause' button
 			clearInterval(interval);
 			timerRunning = false;
 			timerPaused = true;
 		} else {
			//hitting 'start' or 'resume' button
 			var duration;

 			if (secondsRemaining > 0) {
 				duration = secondsRemaining;
 			} else {
				duration = minutesTextBox.val() * 60;
 			}

		 	startTimer(duration, display);
		 	timerRunning = true;
		 	timerPaused = false;
 		}

 		updatePlayButtontext();
 	});

 	stopButton.click(function() {
 		stopTimer();
 		updatePlayButtontext();
 	});

 	resetButton.click(function() {
	 	var duration = minutesTextBox.val() * 60;
 		resetTimer(duration, display);
 		updatePlayButtontext();
 	});

 	saveButton.click(function() {

 		var minutes = parseInt(minutesTextBox.val());

 		if (isNaN(minutes) || minutes < 1 || minutes > 30) {
 			minutesTextBox.addClass('error');
 		} else {
 			minutesTextBox.removeClass('error');
			mutePreference = muteCheckBox.is(":checked");
		 	minutesPreference = minutesTextBox.val();
		 	resetTimer();
		 	savePreferences();
		 	settingsModal.modal('hide');
 		}
 	});

 	/*
 		KEYBOARD EVENTS
	*/
	$(document).keypress(function(e) {
		
		switch (e.which) {
			case 13:
				//enter
				e.preventDefault();
				if (settingsModal.is(':visible')) {
					saveButton.trigger('click');
				}
				break;
			case 102:
				//f
				startButton.trigger('click');
				break;
			case 112:
				//p
				$('#settingsModal').modal('toggle');
				break;
			case 114:
				//r
				resetButton.trigger('click');
				break;
			case 115:
				//s
				stopButton.trigger('click');
				break;
		}
	});

	/*
		MODAL EVENTS
	*/
	$('#settingsModal').on('shown.bs.modal', function (e) {
		minutesTextBox.focus();
	})

	/*
 		TIMER METHODS
 	*/
 	function startTimer(duration, display) {

 		var start = Date.now()
 		var diff;
 		var minutes;
 		var seconds;

 		function timer() {
 			diff = duration - (((Date.now() - start) / 1000) | 0);
 			secondsRemaining = diff;
 			minutes = (diff / 60) | 0;
 			seconds = (diff % 60) | 0;
 			minutes = minutes < 10 ? "0" + minutes : minutes;
 			seconds = seconds < 10 ? "0" + seconds : seconds;

 			updateClockText(minutes + ":" + seconds);

 			if (minutes === "00" && seconds === "00") {
 				clearInterval(interval);
 				playTimerEndSound();
 				flashTab();
 				incrementSessionsCompleted();
 				return;
 			}

 			if (diff <= 0) {
 				start = Date.now() + 1000;
 			}
 		};

 		timer();
		interval = setInterval(timer, 1000); 		
 	};

 	function stopTimer() {
 		timerRunning = false;
 		timerPaused = false;
 		updateClockText("00:00");
 		secondsRemaining = 0;
 		pauseSound();
 		updatePlayButtontext();
 		if (interval) {
 			clearInterval(interval);
 		}
 	};

 	function resetTimer() {
 		timerRunning = false;
 		timerPaused = false;
 		secondsRemaining = 0;
 		pauseSound();
 		clearInterval(interval);
 		updatePlayButtontext();
 		updateClockText(minutesPreference + ":00");
 	};

 	//updating the UI
 	function updateClockText(text) {
		display.text(text);
		document.title = "(" + text + ") work timer";
 	};

 	function updatePlayButtontext() {

 		if (timerRunning) {
	 		startButton.text('pause');
	 	} else if (timerPaused) {
	 		startButton.text('resume');
	 	} else {
	 		startButton.text('start')
	 	}
 	};

 	function flashTab() {
 		var on = false;
 		interval = setInterval(function () { on = !on; flashTabText(on) }, 1000);
 	}

 	function flashTabText(on) {
 		if (on) {
 			document.title = "Times up!";
 		} else {
 			document.title = "work timer";
 		}
 	};

 	//local storage
 	function savePreferences() {
 		localStorage.setItem("minutes", minutesPreference);
 		localStorage.setItem("mute", mutePreference);
 	};

 	function getPreferences() {
 		//todo this could be factored to a single method that checks if the local storage exists
 		minutesPreference = localStorage.getItem("minutes");
 		//set default if a preference cannot be found
 		if (!minutesPreference) { minutesPreference = '25'; }
 		if (!localStorage.getItem("mute")) { 
 			//set default if a preference cannot be found
 			mutePreference = true; 
 		} else {
 			//local storage only allows strings so compare to 'true'
 			mutePreference = localStorage.getItem("mute") == 'true';	
 		}
 	};

 	function getSessionsCompleted() {
 		sessionsCompleted = parseInt(localStorage.getItem(getCurrentDate()), 10);
 		if (!sessionsCompleted) {
 			sessionsCompleted = 0;
 		}
 	};

 	function incrementSessionsCompleted() {
 		getSessionsCompleted();
 		sessionsCompleted += 1;
 		localStorage.setItem(getCurrentDate(), sessionsCompleted);
 		sessionsCompletedBadge.text(sessionsCompleted);
 	};

 	function updateUIWithPreferences() {
 		updateClockText(minutesPreference + ":00");
 		minutesTextBox.val(minutesPreference);
 		muteCheckBox.prop('checked', mutePreference);
		sessionsCompletedBadge.text(sessionsCompleted);
 	};

 	function getCurrentDate() {
		var currentDate = new Date();
		var day = currentDate.getDate().toString();
		var month = (currentDate.getMonth() + 1).toString();
		var year = currentDate.getFullYear().toString();
		return month + "/" + day + "/" + year;
 	};

 	//sounds
 	function playTimerEndSound() {
 		if (!mutePreference) {
 			timesUp.src = timesUpSrc;
 			timesUp.play();
 		}
 	};

 	function pauseSound() {
 		if (!mutePreference) {
 			timesUp.currentTime = 0;
 			timesUp.src = '';
 			timesUp.pause();
 		}
 	};
 });
