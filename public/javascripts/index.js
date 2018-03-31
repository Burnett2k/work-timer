 $(document).ready(function() {

 	var interval;
	var display = $('#timer');
	var title = $('#title');
	var tick = document.getElementById("tick");
	var timesUp = document.getElementById("timesUp");
	var timerRunning = false;
	var secondsRemaining;
	var minutesPreference;
	var mutePreference;

	getPreferences();

	/*
		BUTTON EVENTS
	*/
 	$('#start').click(function() {

 		if (timerRunning) {
 			clearInterval(interval);
 			timerRunning = false;
 		} else {
 			var duration;

 			if (secondsRemaining > 0) {
 				duration = secondsRemaining;
 			} else {
				duration = $('#minutes').val() * 60;
 			}

		 	startTimer(duration, display);
		 	timerRunning = true;
 		}

 		updatePlayButtontext();
 	});

 	$('#stop').click(function() {
 		stopTimer();
 		clearInterval(interval);
 		updatePlayButtontext();
 	});

 	$('#reset').click(function() {
	 	var duration = $('#minutes').val() * 60;
 		resetTimer(duration, display);
 		updatePlayButtontext();
 	});

 	$('#save').click(function() {
 		mutePreference = $('#mute').is(":checked");
 		minutesPreference = $('#minutes').val();
 		resetTimer();
 		savePreferences();
 	});

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

 	function updateClockText(text) {
		display.text(text);
		document.title = "(" + text + ") work timer";
 	};

 	function updatePlayButtontext() {
 		if (timerRunning) {
	 		$('#start').text('pause');
	 	} else {
	 		$('#start').text('start');
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

 	function stopTimer() {
 		timerRunning = false;
 		updateClockText("00:00");
 		secondsRemaining = 0;
 		if (interval) {
 			clearInterval(interval);
 		}
 	};

 	function resetTimer() {
 		timerRunning = false;
 		secondsRemaining = 0;
 		clearInterval(interval);
 		updateClockText(minutesPreference + ":00");
 	};

 	function playTimerEndSound() {
 		if (!mutePreference) {
 			timesUp.play();
 		}
 	};
 	
 	function playTimerTickSound() {
 		if (!mutePreference) {
	 		tick.play();
 		}
 	};

 	function savePreferences() {
 		localStorage.setItem("minutes", minutesPreference);
 		localStorage.setItem("mute", mutePreference);
 	};

 	function getPreferences() {


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
 		$('#minutes').val(minutesPreference);
 		$('#mute').prop('checked', mutePreference);
 	}

 });