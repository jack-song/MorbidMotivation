window.MORBIDCOUNTER = window.MORBIDCOUNTER || {};

window.MORBIDCOUNTER.counter = window.MORBIDCOUNTER.counter || (function(){
	var 
		// divs that output the countdown
		yearsCount = document.getElementById('years'),
		monthsCount = document.getElementById('months'),
		daysCount = document.getElementById('days'),
		hoursCount = document.getElementById('hours'),
		minutesCount = document.getElementById('minutes'),
		secondsCount = document.getElementById('seconds'),

		// the two different 'pages' that can be visible
		settingsSection = document.getElementById('settingsSection'),
		displaySection = document.getElementById('displaySection');

	// keep track of the setinterval ID make sure there's only one at a time
	var counterID = null;

	function count() {
		// should run every second or tenth of a second
		// get the current date and the time elpased until the death date
		var currentDate = new Date(),
			elapsedMillis = window.MORBIDCOUNTER.settings.getDeathDate().getTime() - currentDate.getTime(),
			baseDate = new Date(0),
			elapsedDate = new Date(elapsedMillis);

		// get the difference in time for the different chunks of time
		// years have to be offset because they start in 1970
		var years = elapsedDate.getFullYear() - baseDate.getFullYear(),
			months = elapsedDate.getMonth(),
			days = elapsedDate.getDate() - 1, //minus one because date is 1 indexed, but first day should not mean a full day is left
			hours = elapsedDate.getHours(),
			minutes = elapsedDate.getMinutes(),
			seconds = elapsedDate.getSeconds();

		if(window.MORBIDCOUNTER.settings.getFastCount()){
			seconds += (elapsedDate.getMilliseconds()/1000.0);
			seconds = seconds.toFixed(1);
		}

		// set the counter values
		yearsCount.innerHTML = years;
		monthsCount.innerHTML = months;
		daysCount.innerHTML = days;
		hoursCount.innerHTML = hours;
		minutesCount.innerHTML = minutes;
		secondsCount.innerHTML = seconds;
	}

	function show() {
		if(counterID){
			window.clearInterval(counterID);
		}

		counterID = window.setInterval(count, window.MORBIDCOUNTER.settings.getFastCount() ? 100 : 1000);

		var colors = window.MORBIDCOUNTER.settings.getColors();

		document.body.style.backgroundColor = colors[0];
		Array.prototype.forEach.call(document.getElementsByClassName('countertext'), function(element){
			element.style.color = colors[1];
		});
		Array.prototype.forEach.call(document.getElementsByClassName('counter'), function(element){
			element.style.color = colors[2];
		});
		Array.prototype.forEach.call(document.getElementsByTagName('label'), function(element){
			element.style.color = colors[1];
		});
		document.getElementById('setSvg').style.fill = '#' + colors[1];
		document.getElementById('settingsSvg').style.fill = '#' + colors[1];

		settingsSection.style.display = 'none';
		displaySection.style.display = 'block';
	}

	function init() {
		// update the counter, and display the counter;
		window.MORBIDCOUNTER.settings.loadForDisplay(function (failed){
			if(failed){
				window.MORBIDCOUNTER.settings.show();
			} else {
				show();
			}
		});
	}

	return {
		init: init
	};
}());