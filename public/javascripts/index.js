 $(document).ready(function() {

 	var interval;
	var timerRunning;
	var timerPaused;
	var secondsRemaining;
	var minutesPreference;
	var mutePreference;

 	//variables to store UI controls
	var display = $('#timer');
	var startButton = $('#start');
	var stopButton = $('#stop');
	var resetButton = $('#reset');
	var saveButton = $('#save');
	var minutesTextBox = $('#minutes');
	var muteCheckBox = $('#mute');
	var tick = document.getElementById("tick");
	var timesUp = document.getElementById("timesUp");

	//

	//timer initialization
	getPreferences();
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
 		clearInterval(interval);
 		updatePlayButtontext();
 	});

 	resetButton.click(function() {
	 	var duration = minutesTextBox.val() * 60;
 		resetTimer(duration, display);
 		updatePlayButtontext();
 	});

 	saveButton.click(function() {
 		mutePreference = muteCheckBox.is(":checked");
 		minutesPreference = minutesTextBox.val();
 		resetTimer();
 		savePreferences();
 	});

 	//timer methods
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
 				return;
 			}

 			playTimerTickSound();

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
 		updatePlayButtontext();
 		if (interval) {
 			clearInterval(interval);
 		}
 	};

 	function resetTimer() {
 		timerRunning = false;
 		timerPaused = false;
 		secondsRemaining = 0;
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

 		//if timer is running
 		if (timerRunning) {
	 		startButton.text('pause');
	 	} else if (timerPaused) {
	 		startButton.text('resume');
	 	} else {
	 		startButton.text('start')
	 	}
 	}

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
 	}

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
 		
 		updateUIWithPreferences();
 	};

 	function updateUIWithPreferences() {
 		updateClockText(minutesPreference + ":00");
 		minutesTextBox.val(minutesPreference);
 		muteCheckBox.prop('checked', mutePreference);
 	}

 	//sounds
 	function playTimerEndSound() {
 		//todo this could be refactored into a single method
 		if (!mutePreference) {
 			timesUp.play();
 		}
 	};
 	
 	function playTimerTickSound() {
 		if (!mutePreference) {
	 		tick.play();
 		}
 	};




 });
