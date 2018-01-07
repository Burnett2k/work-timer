 $(document).ready(function() {

 	var interval;
	var display = $('#timer');
	var tick = document.getElementById("tick");

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
 	})

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

 			display.text(minutes + ":" + seconds);
 			playTimerTickSound();

 			if (minutes === "00" && seconds === "00") {
 				clearInterval(interval);
 				return;
 			}
 			
 			if (diff <= 0) {
 				start = Date.now() + 1000;
 			}

 		};

 		timer();
		interval = setInterval(timer, 1000); 		

 	}
 	function stopTimer() {
 		display.text("00:00");
 		if (interval) {
 			clearInterval(interval);
 		}
 	};
 	function resetTimer(duration, display) {
 		clearInterval(interval);
 		display.text($('#minutes').val() + ":00");
 	}

 	function playTimerEndSound() {

 	};
 	function playTimerTickSound() {
 		tick.play();
 	};
 });