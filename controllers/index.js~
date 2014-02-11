'use strict';

var IndexModel = require('../models/index');
var youtube = require('youtube-api');

module.exports = function (app) {
    var model = new IndexModel();
    var cloudinary = require('cloudinary'),
    nconf = require('nconf'),
    cloudinary_config = nconf.get('cloudinary');
    cloudinary.config(cloudinary_config);
    app.get('/', function (req, res) {
	cloudinary.uploader.upload("http://cloudinary.com/images/npm_logo.png", function(result) { 
		console.log(result);
	    });
	res.render('index', model);
    });
};
