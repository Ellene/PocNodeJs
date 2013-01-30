var express = require('express'),
    app = express(),
    io = require('socket.io').listen(app),
    fs = require('fs');

var team;

app.listen(8000);
app.use(express.bodyParser());
app.use(express.static(__dirname + '/lib'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/team.html');
});

app.post('/login', function (req, res) {
    console.log(req.param('team')+" is connected");
    team = req.param('team');
    res.sendfile(__dirname + '/client.html');
    res.cookie('team', team)
});

io.sockets.on('connection', function (client) {
    var my_timer;
    var my_client = {
        "id": clientId,
        "obj": client
    };

    clientId += 1;
    allClients += 1;

    my_timer = setInterval(function () {
        my_client.obj.send(JSON.stringify({
            "timestamp": (new Date()).getTime(),
            "clients": allClients
        }));
    }, 1000);

    client.on('disconnect', function() {
        clearTimeout(my_timer);
        allClients -= 1;
        console.log('disconnect');
    });
});