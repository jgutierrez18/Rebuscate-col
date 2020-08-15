const express = require('express');
const router = express.Router();

const Vacante = require('../models/Vacantes');
const Usuario = require('../models/Usuarios');
const ComentarioVacante = require('../models/Comentarios');

const { isAuthenticated, isNotAuthenticated } = require('../config/auth');

//rutas Crear Vacantes
router.get('/vacantes/crear', isAuthenticated, (req, res) => {
	//ruta archivo de la vista
	res.render('vacantes/crear_vacante');
});

router.post('/vacantes/crear_vacante', isAuthenticated, async (req, res) => {
	console.log(req.file);

	const { titulo, descripcion, trabajo, dinero, ciudad } = req.body;
	const reqimg = req.file;

	const errors = [];
	if (!reqimg) {
		const imgNombre = "";
		const imgDireccion = "";
		const imgSize = 0;
		const mimeType = "";
		if (!titulo) {
			errors.push({ text: 'El campo titulo no puede estar vacio ' })
		}
		if (!descripcion) {
			errors.push({ text: 'El campo descripcion no puede estar vacio ' })
		}
		if (!trabajo) {
			errors.push({ text: 'El campo trabajo no puede estar vacio ' })
		}
		if (!dinero) {
			errors.push({ text: 'El campo  dinero no puede estar vacio ' })
		}
		if (!ciudad) {
			errors.push({ text: 'El campo ciudad no puede estar vacio ' })
		}

		const NewVacante = new Vacante({ titulo, descripcion, trabajo, dinero, ciudad, imgNombre, imgDireccion, imgSize, mimeType, usuario_id: req.user.id });
		console.log(NewVacante);
		await NewVacante.save();
		req.flash('success_msg', 'Vacante creada');
		res.redirect('/vacantes');
	}

	if (!titulo) {
		errors.push({ text: 'El campo titulo no puede estar vacio ' })
	}
	if (!descripcion) {
		errors.push({ text: 'El campo descripcion no puede estar vacio ' })
	}
	if (!trabajo) {
		errors.push({ text: 'El campo trabajo no puede estar vacio ' })
	}
	if (!dinero) {
		errors.push({ text: 'El campo  dinero no puede estar vacio ' })
	}
	if (!ciudad) {
		errors.push({ text: 'El campo ciudad no puede estar vacio ' })
	}

	if (errors.length > 0) {
		//ruta archivo de la vista
		res.render('vacantes/crear_vacante', {
			errors,
			titulo, descripcion, trabajo, dinero, ciudad
		});

	} else {
		const imgNombre = req.file.filename;
		const imgDireccion = '/img/img_Vacantes/' + req.file.filename;
		const imgSize = req.file.size;
		const mimeType = req.file.mimetype;

		const NewVacante = new Vacante({ titulo, descripcion, trabajo, dinero, ciudad, imgNombre, imgDireccion, imgSize, mimeType, usuario_id: req.user.id }
		);
		console.log(NewVacante);
		await NewVacante.save();
		req.flash('success_msg', 'Vacante creada');
		res.redirect('/vacantes');
	}


});

//Rutas mostrar Vacantes
router.get('/vacantes', isAuthenticated, async (req, res) => {
	const Vacantes = await Vacante.find().sort({ date: 'desc' });
	//ruta archivo de la vista
	res.render('vacantes/mostar_vacantes', { Vacantes });
});
//Vacantes de un usuario
router.get('/vacantes/usuario', isAuthenticated, async (req, res) => {

	const userid = await Usuario.findById(req.user.id);

	if (userid._id != req.user.id) {
		req.flash('error_msg', '');
		res.redirect('/vacantes');
	} else {
		//mostrar vacantes de cada usuario.
		const Vacantes = await Vacante.find({ usuario_id: userid._id }).sort({ date: 'desc' });
		//ruta archivo de la vista
		res.render('vacantes/mostar_u_vacantes', { Vacantes });
	}

});

//Ruta Editar Vacantes
router.get('/vacantes/editar/:id', isAuthenticated, async (req, res) => {
	const vacante = await Vacante.findById(req.params.id);
	res.render('vacantes/editar_vacante', { vacante });
});

router.put('/vacantes/actualizar/:id', isAuthenticated, async (req, res) => {
	const { titulo, descripcion, trabajo, dinero, ciudad } = req.body;
	await Vacante.findByIdAndUpdate(req.params.id, { titulo, descripcion, trabajo, dinero, ciudad });
	req.flash('success_msg', 'Vacante actualizada');
	res.redirect('/vacantes');
});

//Ruta eliminar Vacantes de un usuario. 
router.delete('/vacantes/eliminar/:id', isAuthenticated, async (req, res) => {
	await Vacante.findByIdAndDelete(req.params.id);
	req.flash('success_msg', 'Vacante eliminada');
	res.redirect('/vacantes/usuario');
});

// Rutas mostrar una publicacion
router.get('/vacantes/ver/:id', isAuthenticated, async (req, res) => {
	console.log(req.params.id);
	const vacante = await Vacante.findById(req.params.id);
	const comentarios = await ComentarioVacante.find({ vacante_id: req.params.id });
	//console.log(comentarios);
	res.render('vacantes/ver_vacante', { vacante, comentarios });
});

//Rutas de Comentarios Vacantes
router.post('/vacantes/ver', isAuthenticated, async (req, res) => {

	const user = await Usuario.findById(req.user.id);
	const { vacanteid, comentario } = req.body;

	const errors = [];
	
	if (!vacanteid) {
		errors.push({ text: 'No es posible comentar, error interno.' })

	}
	if (!comentario) {
		errors.push({ text: 'No es posible comentar, llene el campo.' })

	}

	if (errors.length > 0) {
		//ruta archivo de la vista
		/*	res.render('vacantes/crear_vacante', {
				errors,
				titulo, descripcion, trabajo, dinero, ciudad
			}); */
		res.redirect('/vacantes/ver/' + vacanteid + '#messageform', {
			errors, vacanteid, comentario
		});

	} else {
		const NewComentario = new ComentarioVacante({ usuario_id: user._id, vacante_id: vacanteid, comentario });
		console.log(NewComentario);
		await NewComentario.save();

		res.redirect('/vacantes/ver/' + vacanteid + '#messageform');
	}
});

module.exports = router;