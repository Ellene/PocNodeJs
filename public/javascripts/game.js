$(document).ready(function () {
    var socket = io.connect();
    socket.on('message', function (data) {
        var obj = JSON.parse(data);
        if (obj.message) {
            $('#message').text(obj.message);
        } else {
            $('#timestamp').text(obj.timestamp);
            $('#clients').text(obj.clients);
        }
    });
    $("button").click(function (event) {
        socket.send("The answer : " + event.target.value);
    });
});
