var socket = io();
$('form_men').submit(function(){
    var men = $('m').val('');
    console.log(men);
    socket.emit('chat message', men);
    return false;
});

$('form_username').submit(function(){
    var men = $('username').val('');
    console.log(men);
    socket.emit('add user', men);
    return false;
});


socket.on('chat message', function(msg){
    $('messages').append($('<li>').text(msg));
});