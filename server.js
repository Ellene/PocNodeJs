// Express config
var express = require('express');
var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 8000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: "duchess-france" }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});
app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function () {
    app.use(express.errorHandler());
});

var isAuthenticated = function (req) {
    return req.session['team'];
}
var restricted = function (req, res, next) {
    if (!isAuthenticated(req)) res.redirect('/login');
    else next();
}

// Express routes
app.get('/', function (req, res) {
    res.redirect('/game');
});
app.get('/login', function (req, res) {
    if (isAuthenticated(req)) res.redirect('game');
    else res.render('login');
});
app.post('/login', function (req, res) {
    var team = req.param('team');
    console.log(team + " is connected");
    req.session.team = team;
    res.redirect('game');
});
app.get('/game', restricted, function (req, res) {
    res.render('game', { team: req.session.team });
});
app.get('/logout', restricted, function (req, res) {
    delete req.session.team;
    res.redirect('/');
});
app.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

// Socket.IO
var io = require('socket.io').listen(app);
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

    client.on('disconnect', function () {
        clearTimeout(my_timer);
        allClients -= 1;
        console.log('disconnect');
    });
});
