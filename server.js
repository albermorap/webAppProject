// Launch: npm run dev

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const methodOverride  = require("method-override");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

app.set('port', (process.env.PORT || 3000));
app.use("/",express.static(__dirname));

// Import controllers
var FilmCtrl = require('./controllers/films.js')
var UserCtrl = require('./controllers/users.js')

// Routes

app.get('/', (req, res) => {
    res.redirect("/login")
})

app.route('/login')
    .get((req, res) => {res.sendFile(__dirname + '/client/login.html')})
    .post((req, res) => {
        UserCtrl.checkUser(req.body.username, req.body.password, function(isOk){
            if (isOk){
                res.redirect("/home/"+req.body.username)
            }
            else
                res.sendFile(__dirname + '/client/loginFailed.html')
        })        
    })

app.get('/home/:username', (req, res) => {res.sendFile(__dirname + '/client/home/homepage.html')})

app.route('/users')  
    .get(UserCtrl.findAllUsers)
    .post(UserCtrl.addUser)

app.route('/users/:username')  
    .get(UserCtrl.findByUsername)

app.route('/films')  
	.get(FilmCtrl.findAllFilms)
	.post(FilmCtrl.addFilm);

app.route('/films/:id')  
	.get((req, res) => {res.sendFile(__dirname + '/client/films/filmpage.html')})
	.put(FilmCtrl.updateFilm)
	.delete(FilmCtrl.deleteFilm)

app.get('/getFilmData/:id', FilmCtrl.findById)
app.post('/addComment/:username/:id', FilmCtrl.addComment)
app.put('/markFilmWatched/:username', UserCtrl.markFilmWatched)
app.put('/markFilmPending/:username', UserCtrl.markFilmPending)

app.listen(app.get('port'));