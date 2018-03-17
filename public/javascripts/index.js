 $(document).ready(function() {

 	var interval;
	var display = $('#timer');
	var title = $('#title');
	var tick = document.getElementById("tick");
	var timesUp = document.getElementById("timesUp");
	var mute = true;
	var timerRunning = false;
	var secondsRemaining;


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
 		updatePlayButtontext();
 	});

 	$('#reset').click(function() {
	 	var duration = $('#minutes').val() * 60;
 		resetTimer(duration, display);
 		updatePlayButtontext();
 	});

 	$('#save').click(function() {
 		mute = $('#mute').is(":checked");
 		resetTimer();
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
 		window.setInterval(function () { on = !on; flashTabText(on) }, 1000);
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

 	function resetTimer(duration, display) {
 		timerRunning = false;
 		secondsRemaining = 0;
 		clearInterval(interval);
 		updateClockText($('#minutes').val() + ":00");
 	};

 	function playTimerEndSound() {
 		if (!mute) {
 			timesUp.play();
 		}
 	};
 	
 	function playTimerTickSound() {
 		if (!mute) {
	 		tick.play();
 		}
 	};
 });