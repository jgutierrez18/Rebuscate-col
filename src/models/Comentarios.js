const mongoose = require('mongoose');
const { Schema } = mongoose;

const ComentarioSchema = new Schema({
    usuario_id: {
        type: String, required: true
    },
    vacante_id: {
        type: String, required: true
    },
    comentario: {
        type: String, required: true
    },
    date: {
        type: Date, default: Date.now
    }
});

module.exports = mongoose.model('Comentario', ComentarioSchema);