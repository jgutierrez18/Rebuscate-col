const {format} = require('timeago.js');

const helpers = {};

helpers.timeago = (timesstamp) => {
    return format(timesstamp);
};

module.exports = helpers;
