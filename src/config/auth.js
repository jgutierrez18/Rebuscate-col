
const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Not Authorized.');
  res.redirect('/usuario/login');
};

helpers.isNotAuthenticated =(req,res,next)=>{
	if (!req.isAuthenticated()) {
		return next();
	}
	return res.redirect('/usuario/perfil');
}; 
module.exports = helpers;