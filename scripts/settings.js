window.MORBIDCOUNTER = window.MORBIDCOUNTER || {};

window.MORBIDCOUNTER.settings = window.MORBIDCOUNTER.settings || (function(){
	var 
		// constant keys for storing data
		STORAGE_BIRTH_NAME = 'birthDateNum',
		STORAGE_LIFE_NAME = 'lifeNum',
		STORAGE_FASTCOUNT_NAME = 'fastCount',
		STORAGE_COLORS_NAME = 'colors',

		// inputs on the settings page
		birthDateInput = document.getElementById('birthDate'),
		lifeInput = document.getElementById('life'),
		fastCountInput = document.getElementById('fastCount'),
		backColInput = document.getElementById('back-col'),
		textColInput = document.getElementById('text-col'),
		numColInput = document.getElementById('num-col'),

		// the two different 'pages' that can be visible
		settingsSection = document.getElementById('settingsSection'),
		displaySection = document.getElementById('displaySection');

	// keep track of the setinterval ID make sure there's only one at a time
	var counterID = null,
		fastCount = false,
		deathDate = new Date(0),
		colors = [];

	// when settings are submitted
	function save(onSaved) {
		// store as an object
		var store = {};

		//required inputs
		if (!birthDateInput.value || !lifeInput.value) {
			return;
		}

		store[STORAGE_BIRTH_NAME] =  birthDateInput.value;
		store[STORAGE_LIFE_NAME] = parseInt(lifeInput.value);
		store[STORAGE_FASTCOUNT_NAME] = fastCountInput.checked;
		store[STORAGE_COLORS_NAME] = [backColInput.value, textColInput.value, numColInput.value];

		//CALLBACK TO FINISH UP
		chrome.storage.sync.set({data: store}, onSaved);
	}

	function loadForSettings() {
		var birthDate,
			lifeExpectancy;

		// try to load saved data into inputs
		chrome.storage.sync.get('data', function(result) {
			var data = result.data;

			if (data) {
				birthDateInput.value = data[STORAGE_BIRTH_NAME];
				lifeInput.value = data[STORAGE_LIFE_NAME];
				fastCountInput.checked = data[STORAGE_FASTCOUNT_NAME];
				colors = data[STORAGE_COLORS_NAME];
			} else {
				colors = ['#FFFFFF', '#AAAAAA', '#A00000'];
			}


			backColInput.color.fromString(colors[0]);
			textColInput.color.fromString(colors[1]);
			numColInput.color.fromString(colors[2]);
		});
	}

	function loadForDisplay(onLoaded) {
		//loads birthday and life expectancy
		chrome.storage.sync.get('data', function(result) {
			var data = result.data,
				birthDate,
				lifeExpectancy,
				deathDateNum;

			// if the data cannot be found, storage has failed, otherwise load the required data
			if (data) {
				birthDate		= new Date(data[STORAGE_BIRTH_NAME]);
				lifeExpectancy	= data[STORAGE_LIFE_NAME];
				fastCount		= data[STORAGE_FASTCOUNT_NAME];
				colors			= data[STORAGE_COLORS_NAME] || ['#000000', '#AAAAAA', '#A00000'];

				// calculate the death date from data
				//convert date of birth to death by adding life expectency
				birthDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);
				deathDate = new Date(birthDate.getTime());
				
				onLoaded(true);
				return;
			}

			onLoaded(false);
		});
	}

	function getFastCount() {
		return fastCount;
	}

	function getDeathDate() {
		return deathDate;
	}

	function getColors() {
		return colors;
	}

	function show() {
		loadForSettings();

		document.body.style.backgroundColor = colors[0];
		Array.prototype.forEach.call(document.getElementsByTagName('label'), function(element){
			element.style.color = colors[1];
		});

		document.getElementById('setSvg').style.fill = '#' + colors[1];

		settingsSection.style.display = 'block';
		displaySection.style.display = 'none';
	}

	return {
		loadForDisplay: loadForDisplay,
		show: show,
		getFastCount: getFastCount,
		getDeathDate: getDeathDate,
		save: save,
		getColors: getColors
	};
}());