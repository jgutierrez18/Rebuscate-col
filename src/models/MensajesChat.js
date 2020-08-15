const mongoose = require('mongoose');
const{ Schema } = mongoose;

const ChatSchema = new Schema({
	nombreUsuario:{ type: String,  required: true},
	mensaje:{ type: String,  required: true},
	fecha:{ type: Date ,default: Date.now}
});

module.exports = mongoose.model('MensajesChat', ChatSchema);
