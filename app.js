var Gpio = require('onoff').Gpio,
	button = new Gpio(13, 'in', 'both');
	relay1 = new Gpio(12, 'out'),
	triggerEnabled = 0, // 0 - on, 1 - off
	lastChangeTime = null;

button.watch((err, val) => {
	if ((Date.now() - lastChangeTime) > 400) {
		triggerRelay();
	}

	lastChangeTime = Date.now();
});

function triggerRelay() {
	triggerEnabled = triggerEnabled == 1 ? 0 : 1;
	relay1.writeSync(triggerEnabled);
}
