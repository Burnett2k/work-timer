 $(document).ready(function() {

 	var interval;
	var display = $('#timer');
	var title = $('#title');
	var tick = document.getElementById("tick");
	var timesUp = document.getElementById("timesUp");
	var mute = true;

 	$('#start').click(function() {

 		if (interval) {
 			clearInterval(interval);
 		}

	 	var duration = $('#minutes').val() * 60;

	 	startTimer(duration, display);
 	});

 	$('#stop').click(function() {
 		stopTimer();
 	});

 	$('#reset').click(function() {
	 	var duration = $('#minutes').val() * 60;
 		resetTimer(duration, display);
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
 			minutes = (diff / 60) | 0;
 			seconds = (diff % 60) | 0;
 			minutes = minutes < 10 ? "0" + minutes : minutes;
 			seconds = seconds < 10 ? "0" + seconds : seconds;

 			updateClockText(minutes + ":" + seconds);

 			if (minutes === "00" && seconds === "00") {
 				clearInterval(interval);
 				playTimerEndSound();
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

 	function stopTimer() {
 		updateClockText("00:00");
 		if (interval) {
 			clearInterval(interval);
 		}
 	};

 	function resetTimer(duration, display) {
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