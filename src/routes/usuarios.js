const express = require('express');
const router = express.Router();
const passport = require('passport');


const Usuario = require('../models/Usuarios');
const { isAuthenticated, isNotAuthenticated } = require('../config/auth');


//ruta fomulario de registro
router.get('/usuario/registro', (req, res) => {
    res.render('usuario/registro_usuario');
});

//ruta formulario de login
router.get('/usuario/login', isNotAuthenticated, (req, res) => {
    res.render('usuario/login_usuario');
});
//ruta Perfil 1 usuari logeado
router.get('/usuario/perfil', isAuthenticated, (req, res) => {
    res.render('usuario/perfil_usuario');
});

//ruta chat usuario logeado
router.get('/usuario/chat', isAuthenticated, async (req, res) => {
    //encontar toda la lista de usurios en la db
    const Usuarios = await Usuario.find().sort({ date: 'desc' });
    //mostrar la vista y pasar los usuarios encontrados
    res.render('usuario/chat_usuario', { Usuarios });
});


//ruta api datos de registro
router.post('/usuario/registro', async (req, res) => {
    const { numeroCedula,
        fechaExpedicion,
        ciudadExpedicion,
        nombre,
        apellido,
        fechaNacimiento,
        ciudadNacimiento,
        ciudadRecidencia,
        email,
        telefono,
        nombreRef,
        telefonoRef,
        contraseña,
        contraseñaConfir } = req.body;

    const errors = [];

    if (!numeroCedula) {
        errors.push({ text: 'Numero de cedula no valido' });
    }
    if (numeroCedula.length < 5) {
        errors.push({ text: 'La cedula no es calida, debe tener almenos 5 digitos' });
    }
    if (!nombre) {
        errors.push({ text: 'El nombre no es valido' });
    }
    if (!apellido) {
        errors.push({ text: 'El apellidon no es valido' });
    }
    if (!email) {
        errors.push({ text: 'El campo email no puede estar vacio' });
    }
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!expr.test(email))
        errors.push({ text: 'el email no es correcto' })

    if (!telefono) {
        errors.push({ text: 'El numero de telefono no es valido' });
    }

    if (contraseña != contraseñaConfir) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }
    if (contraseña.length < 4) {
        errors.push({ text: 'la contraseña debe tener mas de 4 caracteres' });
    }
    if (errors.length > 0) {
        res.render('usuario/registro_usuario', {
            errors,
            numeroCedula,
            fechaExpedicion,
            ciudadExpedicion,
            nombre,
            apellido,
            fechaNacimiento,
            ciudadNacimiento,
            ciudadRecidencia,
            email,
            telefono,
            nombreRef,
            telefonoRef
        });
    } else {
        const cedulaUsuario = await Usuario.findOne({ numeroCedula: numeroCedula });
        if (cedulaUsuario) {
            req.flash('error_msg', 'Ese numero de cedula ya esta registrada');
            res.redirect('/usuario/registro_usuario');
        }
        console.log(req.body);
        const newUsuario = new Usuario({
            documentoIdentidad,
            fechaExpedicion,
            ciudadExpedicion,
            nombre,
            apellido,
            fechaNacimiento,
            ciudadNacimiento,
            ciudadRecidencia,
            email,
            telefono,
            nombreRef,
            telefonoRef,
            contraseña
        });
        newUsuario.contraseña = await newUsuario.encryptContraseña(contraseña);
        await newUsuario.save();
        req.flash('success_msg', 'Cuenta Creada');
        res.redirect('/usuario/login');
        //res.send('ok');
    }

});

router.post('/usuario/login', (req, res, next) => passport.authenticate('local', {
    successRedirect: '/vacantes',
    failureRedirect: '/usuario/login',
    failureFlash: true
})(req, res));


router.get('/usuario/salir', isAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/');
});


router.get('/usuario/step', (req, res) => {


    res.render('usuario/step-form');
});

/*
router.post('/usuario/step',[
    check('name').not().isEmpty().withMessage('Name must have more than 5 characters'),
    check('classYear', 'Class Year should be a number').not().isEmpty(),
    check('weekday', 'Choose a weekday').optional(),
    check('email', 'Your email is not valid').not().isEmpty(),
    check('password', 'Your password must be at least 5 characters').not().isEmpty(),
  ], (req, res)=>{
 
    const errors = validationResult(req);
    console.log(req.body);

    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    } else {
      res.send({});
    }
  });
  */

module.exports = router;