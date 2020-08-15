//coneccion socket usuarios
$(function(){
	
	const socket = io();

	const $messageForm = $('#message-form');
	const $messageBox = $('#message');
	const $chat = $('#chat');

	//eventos
	$messageForm.submit( e => {
		e.preventDefault();

		console.log('Enviando mensaje = ' + $messageBox.val()); 

		socket.emit('send message', $messageBox.val());
		$messageBox.val('');
	});

	socket.on('new message', function(data){
		$chat.append(data + '<br/>');
	});
})