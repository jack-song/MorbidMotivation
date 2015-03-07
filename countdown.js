(function(){
	var 
		// constant keys for storing data
		STORAGE_BIRTH_NAME = 'birthDateNum',
		STORAGE_LIFE_NAME = 'lifeNum',
		STORAGE_FASTCOUNT_NAME = 'fastCount',

		// divs that output the countdown
		yearsCount = document.getElementById('years'),
		monthsCount = document.getElementById('months'),
		daysCount = document.getElementById('days'),
		hoursCount = document.getElementById('hours'),
		minutesCount = document.getElementById('minutes'),
		secondsCount = document.getElementById('seconds'),

		// inputs on the settings page
		birthDateInput = document.getElementById('birthDate'),
		lifeInput = document.getElementById('life'),
		fastCountInput = document.getElementById('fastCount'),

		// button for switching back and forth between pages
		settingsButton = document.getElementById('settings'),
		setButton = document.getElementById('set'),

		// the two different 'pages' that can be visible
		settingsSection = document.getElementById('settingsSection'),
		displaySection = document.getElementById('displaySection'),

		// keep track of the setinterval ID make sure there's only one at a time
		counterID = null,
		fastCount = false;

	// value that keeps the projected date of death
	var	deathDate = new Date(0);

	// try to load stored user data and init
	load();

	// when settings are submitted
	set.onclick = function(){
		// get birthday and life expectancy from form
		var birthDateString = birthDateInput.value,
			lifeExpectancy = parseInt(lifeInput.value),
			countFast = fastCountInput.checked,
			deathDateNum = 0;

		// both fields must be filled
		if(!birthDate || !lifeExpectancy)
			return;

		// store as an object
		var store = {};

		store[STORAGE_BIRTH_NAME] = birthDateString;
		store[STORAGE_LIFE_NAME] = lifeExpectancy;
		store[STORAGE_FASTCOUNT_NAME] = countFast;

		//CALLBACK 'doneSave' TO FINISH UP
		chrome.storage.sync.set({data: store}, doneSave);
	}

	// when settings are opened
	settingsButton.onclick = function(){
		var birthDate,
			lifeExpectancy;

		// try to load saved data into inputs
		chrome.storage.sync.get('data', function(result) {
			var data 			= result.data,
				birthDate 		= data[STORAGE_BIRTH_NAME],
				lifeExpectancy 	= data[STORAGE_LIFE_NAME],
				fastCount		= data[STORAGE_FASTCOUNT_NAME];


			if(birthDate)
				birthDateInput.value = birthDate;
			if(lifeExpectancy)
				lifeInput.value = lifeExpectancy;
			
			fastCountInput.checked = fastCount;
		});

		// change the page sections being displayed
		displaySection.style.display = 'none';
		settingsSection.style.display = 'block';
	}

	function count() {
		// should run every second or tenth of a second
		// get the current date and the time elpased until the death date
		var currentDate = new Date(),
			elapsedMillis = deathDate.getTime() - currentDate.getTime(),
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

		if(fastCount){
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

	function load() {
		// use the birthdate and life expectancy to calculate the projected date of death
		var birthDate,
			lifeExpectancy,
			deathDateNum = 0;

		//loads birthday and life expectancy
		chrome.storage.sync.get('data', function(result) {
			var data = result.data,
				failed = false;

			// if the data cannot be found, storage has failed, otherwise load the required data
			if(!data){ failed = true; }
			else {
				birthDate = new Date(data[STORAGE_BIRTH_NAME]);
				lifeExpectancy = data[STORAGE_LIFE_NAME];
				fastCount = data[STORAGE_FASTCOUNT_NAME];
			}

			// if either birthdate or life expectancy data cannot be found, storage has failed
			// otherwise calculate the death date from data
			if(!birthDate || !lifeExpectancy){ failed = true; }
			else{

				//convert date of birth to death by adding life expectency
				birthDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);
				deathDate = new Date(birthDate.getTime());

				// if the death date is not a valid date, storage has failed
				if(isNaN(deathDate.getTime())){ failed = true; }
			}

			// if storage failed, request new information from user
			if(failed){
				displaySection.style.display = 'none';
				settingsSection.style.display = 'block';
			}
			// if loading succeeded, update the counter
			else{
				initTimer();
			}
		});
	}

	function initTimer(){
		if(counterID){
			window.clearInterval(counterID);
		}

		counterID = window.setInterval(count, fastCount ? 100 : 1000);
	}

	function doneSave() {
		// when data has been saved, load the new data into the counter (no reason to fail),
		// update the counter, and display the counter;
		load();
		displaySection.style.display = 'block';
		settingsSection.style.display = 'none';
	}
}());