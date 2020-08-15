//coneccion socket servidor
module.exports = function (io) {

	io.on('connection', socket => {
		console.log('nuevo usuario conectado');

		socket.on('send message', function (data) {
			console.log(data);

			//emitir mensaje en el chat a todos los usuarios
			io.sockets.emit('new message', data);

		});

	});

}