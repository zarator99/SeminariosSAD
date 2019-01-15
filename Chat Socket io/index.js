var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var usuarios = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/public/CSS/styles.css', function (req, res) {
    res.sendFile(__dirname + '/public/CSS/styles.css');
});

io.on('connection', function (socket) {
    socket.emit('getusuarios', usuarios);

    socket.on('disconnect', function () {
        if (!socket.username) return;
        delete usuarios[socket.username];
        io.emit('user disconnects', usuarios);
    });

    socket.on('chat message', function (msg) {
        var msg_sp = msg.split(' ');
        var nombre = msg_sp[0];
        var l_nombre = nombre.length;
        var toUser = nombre.replace('@', '');

        if (nombre.includes('@')) {

            usuarios[toUser].emit('private', {
                from: socket.username,
                username: toUser,
                message: msg.substr(l_nombre, msg.length)
            });

        } else {
            io.emit('chat message', msg, socket.username);
        }
    });

    socket.on("private", function (data) {
        io.sockets.sockets[data.to].emit("private", {from: client.id, to: data.to, msg: data.msg});
    });

    socket.on('add user', function (usuario) {
        if (usuarios[usuario] === undefined) {
            usuarios[usuario] = socket;
            socket.username = usuario;
            io.emit('add user', usuario)
        }
        else {
            socket.emit('user exist', usuario);
        }
    });
    socket.on('user typing', function (user) {
        io.emit('user typing', user)
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
