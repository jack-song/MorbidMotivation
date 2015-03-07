// try to load stored user data and init
window.MORBIDCOUNTER.counter.init();

// when settings are submitted
document.getElementById('set').onclick = function(){
	window.MORBIDCOUNTER.settings.save(window.MORBIDCOUNTER.counter.init);
}

// when settings are opened
document.getElementById('settings').onclick = window.MORBIDCOUNTER.settings.show;