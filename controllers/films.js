var mongoose = require('mongoose');
var Films  = require("../models/film");

mongoose.connect("mongodb://localhost:27017/database"); // local
//mongoose.connect("mongodb://alberto:1234@ds019624.mlab.com:19624/web-app"); // mongo lab
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function(callback){
	console.log("Connection to database succeeded."); /* Once the database connection has succeeded, the code in db.once is executed. */
});


var Film = Films.Film; //This creates the TvShow model.

//GET - Return all films in the DB
exports.findAllFilms = function(req, res) {
	Film.find(function(err, films) {
	    if(err) res.send(500, err.message);
		res.status(200).jsonp(films);
	});
};

//GET - Return a film with specified ID
exports.findById = function(req, res) {
	Film.findById(req.params.id, function(err, film) {
    	if(err) return res.send(500, err.message);
		res.status(200).jsonp(film);
	});
};

//POST - Insert a new film in the DB
exports.addFilm = function(req, res) {
	var film = new Film({
		title:    	req.body.title,
		poster:   	req.body.poster,
		year: 	  	req.body.year,
		duration: 	req.body.duration,
		genre:    	req.body.genre,
		country:  	req.body.country,		
		sypnosis: 	req.body.sypnosis
	});

	film.save(function(err, film) {
		if(err) return res.send(500, err.message);
    	res.status(200).jsonp(film);
	});
};

exports.addComment = function(req, res) {
	Film.findById(req.params.id, function(err, film) {
		console.log(film)

		var comment = {
			"username": req.params.username,
			"stars": 	req.body.stars,
			"text": 	req.body.text,
			"date": 	(new Date())
		}

		film.comments.push(comment);

		film.save(function(err) {
			if(err) return res.send(500, err.message);
			res.status(200).jsonp(film);
		});
	});
};

exports.deleteComment = function(req, res) {
	Film.findById(req.params.filmid, function(err, film) {
		for (i = 0; i < film.comments.length; i++){
			if (film.comments[i] == req.params.commentid)
				array.splice(i, 1)
		}

		film.save(function(err) {
			if(err) return res.send(500, err.message);
			res.status(200).jsonp(film);
		});
	});
};

// CORREGIR
exports.updateFilm = function(req, res) {
	Film.findById(req.params.id, function(err, film) {
		//film.title    = req.body.title;
		film.poster   = req.body.poster;
		/*film.year     = req.body.year;
		film.duration = req.body.duration;		
		film.genre    = req.body.genre;
		film.country  = req.body.country;
		film.sypnosis = req.body.sypnosis;*/

		film.save(function(err) {
			if(err) return res.send(500, err.message);
      		res.status(200).jsonp(film);
		});
	});
};

//DELETE - Delete a Film with specified ID
exports.deleteFilm = function(req, res) {
	Film.findById(req.params.id, function(err, film) {
		film.remove(function(err) {
			if(err) return res.send(500, err.message);
      		res.status(200);
		})
	});
};