const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcryptjs');

const UsuarioSchema = new Schema({
    numeroCedula:{
        type: Number, required: true
    },
    fechaExpedicion:{
        type: String, required: true
    },
    ciudadExpedicion: {
        type: String, required: true
    },
    nombre:{
        type: String, required: true
    },
    apellido:{
        type: String, required: true
    },
    fechaNacimiento:{
        type: String, required: true
    },
    ciudadNacimiento:{
        type: String, required: true
    },
     ciudadRecidencia:{
        type: String, required: true
    },
    email:{
        type: String, required: true
    },
    telefono:{
        type: Number, required: true
    },
    nombreRef:{
        type: String, required: true
    },
    telefonoRef:{
        type: Number, required: true
    },
    contraseña:{
        type: String, required: true
    },
     date: {
        type: Date , default: Date.now
    }
});

UsuarioSchema.methods.encryptContraseña = async (contraseña) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(contraseña, salt);
  return hash;
};

UsuarioSchema.methods.matchContraseña = async function (contraseña) {
  return await bcrypt.compare(contraseña, this.contraseña);
};


module.exports = mongoose.model('Usuarios', UsuarioSchema);