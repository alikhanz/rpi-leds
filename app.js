var Gpio = require('onoff').Gpio,
	button = new Gpio(13, 'in', 'both');
	relay1 = new Gpio(12, 'out'),
	triggerEnabled = 0, // 0 - on, 1 - off
	lastChangeTime = null;

button.watch((err, val) => {
	if ((Date.now() - lastChangeTime) > 400 && val == 1) {
		triggerRelay();
	}

	lastChangeTime = Date.now();
});

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function triggerRelay() {
	triggerEnabled = triggerEnabled == 1 ? 0 : 1;
	relay1.writeSync(triggerEnabled);

	io.emit('relay.state', triggerEnabled);
}

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.log('A user connected');

	socket.emit('relay.state', triggerEnabled);

	socket.on('relay.trigger', function() {
		triggerRelay();
	});
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});