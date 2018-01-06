 $(document).ready(function() {

 	var interval;

 	$('#start').click(function() {

 		if (interval) {
 			clearInterval(interval);
 		}
	 	var duration = 60 * 5;
	 	var display = $('#timer');
	 	startTimer(duration, display);
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

 			display.text(minutes + ":" + seconds);

 			if (diff <= 0) {
 				start = Date.now() + 1000;
 			}

 		};

 		timer();
		interval = setInterval(timer, 1000); 		

		// setInterval(function() {
		//     $('#timer').text((new Date - start) / 1000 + " Seconds");
		// }, 1000);

 	}
 });