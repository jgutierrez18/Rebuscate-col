
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const Usuario = require('../models/Usuarios');

passport.use(new LocalStrategy({
  usernameField: 'numeroCedula',
  passwordField: 'contraseña'
}, async (numeroCedula, contraseña, done) => {
  // encontar user por cedula
  const user = await Usuario.findOne({ numeroCedula: numeroCedula });
  console.log(user);
  if (!user) {
    return done(null, false, { message: 'Not User found.' });
  } else {
    // validacion de contraseña
    const match = await user.matchContraseña(contraseña);
    if (match) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect Password.' });
    }
  }

}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Usuario.findById(id, (err, user) => {
    done(err, user);
  });
});