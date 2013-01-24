var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');

app.listen(8000);



var allClients = 0;
var clientId = 1;

// on server started we can load our client.html page
function handler ( req, res ) {
    fs.readFile( __dirname + '/client.html' ,
        function ( err, data ) {
            if ( err ) {
                console.log( err );
                res.writeHead(500);
                return res.end( 'Error loading client.html' );
            }
            res.writeHead( 200 );
            res.end( data );
        });
};

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

    client.on('message', function(data) {
        my_client.obj.broadcast.send(JSON.stringify({
            message: "poke send by client " + my_client.id
        }));
        console.log(data);
    });

    client.on('disconnect', function() {
        clearTimeout(my_timer);
        allClients -= 1;
        console.log('disconnect');
    });
});