var yearsCount = document.getElementById("years"),
	monthsCount = document.getElementById("months"),
	daysCount = document.getElementById("days"),
	hoursCount = document.getElementById("hours"),
	minutesCount = document.getElementById("minutes"),
	secondsCount = document.getElementById("seconds"),
	setButton = document.getElementById("set"),
	settingsButton = document.getElementById("settings"),
	settingsSection = document.getElementById("settingsSection"),
	displaySection = document.getElementById("displaySection");

var birthDate = new Date(2000, 1, 1),
	lifeExpectancy = 75,
	deathDate = birthDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);

//run once right away
count();
window.setInterval(count, 1000);

setButton.onclick = function(){
	displaySection.style.display = 'block';
	settingsSection.style.display = 'none';
}

settingsButton.onclick = function(){
	displaySection.style.display = 'none';
	settingsSection.style.display = 'block';
}

function count() {
	var currentDate = new Date().getTime(),
    	elapsedMillis = deathDate - currentDate,
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