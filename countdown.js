var STORAGE_BIRTH_NAME = "birthDateNum",
	STORAGE_LIFE_NAME = "lifeNum",
	yearsCount = document.getElementById("years"),
	monthsCount = document.getElementById("months"),
	daysCount = document.getElementById("days"),
	hoursCount = document.getElementById("hours"),
	minutesCount = document.getElementById("minutes"),
	secondsCount = document.getElementById("seconds"),
	birthDateInput = document.getElementById("birthDate"),
	lifeInput = document.getElementById("life"),
	setButton = document.getElementById("set"),
	settingsButton = document.getElementById("settings"),
	settingsSection = document.getElementById("settingsSection"),
	displaySection = document.getElementById("displaySection");

var	deathDate = new Date(0);

load();
window.setInterval(count, 1000);

setButton.onclick = function(){
	//get birthday and life expectancy from form
	var birthDateString = birthDateInput.value,
		lifeExpectancy = parseInt(lifeInput.value),
		deathDateNum = 0;

	//both fields must be filled
	if(!birthDate || !lifeExpectancy)
		return;

	var store = {}
	store[STORAGE_BIRTH_NAME] = birthDateString;
	store[STORAGE_LIFE_NAME] = lifeExpectancy;

	chrome.storage.sync.set({data: store}, doneSave);
}

settingsButton.onclick = function(){
	var birthDate,
		lifeExpectancy;

	//try to load saved data into inputs
	chrome.storage.sync.get("data", function(result) {
		var data = result.data;
		birthDate = data[STORAGE_BIRTH_NAME];
		lifeExpectancy = data[STORAGE_LIFE_NAME];

		if(birthDate)
			birthDateInput.value = birthDate;
		if(lifeExpectancy)
			lifeInput.value = lifeExpectancy;
	});

	displaySection.style.display = 'none';
	settingsSection.style.display = 'block';
}

function count() {
	var currentDate = new Date(),
    	elapsedMillis = deathDate.getTime() - currentDate.getTime(),
    	baseDate = new Date(0),
    	elapsedDate = new Date(elapsedMillis);

    var years = elapsedDate.getFullYear() - baseDate.getFullYear(),
    	months = elapsedDate.getMonth(),
    	days = elapsedDate.getDate() - 1, //minus one because date is 1 indexed, but first day should not mean a full day is left
    	hours = elapsedDate.getHours(),
    	minutes = elapsedDate.getMinutes(),
    	seconds = elapsedDate.getSeconds();

    yearsCount.innerHTML = years;
    monthsCount.innerHTML = months;
    daysCount.innerHTML = days;
    hoursCount.innerHTML = hours;
    minutesCount.innerHTML = minutes;
    secondsCount.innerHTML = seconds;
}

function load() {
	var birthDate,
		lifeExpectancy,
		deathDateNum = 0;

	//loads birthday and life expectancy
	chrome.storage.sync.get("data", function(result) {
		var data = result.data,
			failed = false;

		if(!data){
			failed = true;
		}
		else {
			birthDate = new Date(data[STORAGE_BIRTH_NAME]);
			lifeExpectancy = data[STORAGE_LIFE_NAME];
		}

		if(!birthDate || !lifeExpectancy){
			failed = true;
		}
		else{
			//convert date of birth to death by adding life expectency
			birthDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);
			deathDate = new Date(birthDate.getTime());

			if(isNaN(deathDate.getTime()))
				failed = true;
		}

		if(failed){
			displaySection.style.display = 'none';
			settingsSection.style.display = 'block';
		}
		else{
			count();
		}
	});
}

function doneSave() {
	load();
	count();
	displaySection.style.display = 'block';
	settingsSection.style.display = 'none';
}