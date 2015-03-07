window.MORBIDCOUNTER = window.MORBIDCOUNTER || {};

window.MORBIDCOUNTER.settings = window.MORBIDCOUNTER.settings || (function(){
	var 
		// constant keys for storing data
		STORAGE_BIRTH_NAME = 'birthDateNum',
		STORAGE_LIFE_NAME = 'lifeNum',
		STORAGE_FASTCOUNT_NAME = 'fastCount',

		// inputs on the settings page
		birthDateInput = document.getElementById('birthDate'),
		lifeInput = document.getElementById('life'),
		fastCountInput = document.getElementById('fastCount'),

		// the two different 'pages' that can be visible
		settingsSection = document.getElementById('settingsSection'),
		displaySection = document.getElementById('displaySection');

	// keep track of the setinterval ID make sure there's only one at a time
	var counterID = null,
		fastCount = false,
		deathDate = new Date(0);

	// when settings are submitted
	function save(callback) {
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

		//CALLBACK TO FINISH UP
		chrome.storage.sync.set({data: store}, callback);
	}

	function loadForSettings() {
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
	}

	function loadForDisplay(callback) {
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

			callback(failed);
		});
	}

	function getFastCount() {
		return fastCount;
	}

	function getDeathDate() {
		return deathDate;
	}

	function show() {
		loadForSettings();

		settingsSection.style.display = 'block';
		displaySection.style.display = 'none';
	}

	return {
		loadForDisplay: loadForDisplay,
		show: show,
		getFastCount: getFastCount,
		getDeathDate: getDeathDate,
		save: save
	};
}());