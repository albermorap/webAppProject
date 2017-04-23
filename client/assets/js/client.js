var url = "http://localhost:3000/";
//var url = "web-app-project.herokuapp.com";

/*function getParameterByName(name, url) {
	if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}*/

// Homepage - Collection

function loadUserData(){
	localStorage.setItem("username", getUsernameFromUrl());
	getAllFilms()
}

function getUsernameFromUrl(){
	var url = window.location.href
	return url.substring(27) // local
	//return url.substring(43) // heroku
}

function refreshPage(){
	$("#btn_showAll").removeClass("active")
	$("#btn_showWatched").removeClass("active")
	$("#btn_showPending").removeClass("active")
}

function showAllFilms(array){
	refreshPage()
	$("#btn_showAll").addClass("active")
	$("#pageTitle").html("My Collection")
	showFilmCollection(array)
}

function showFilmsWatched(array){
	refreshPage()
	$("#btn_showWatched").addClass("active")
	$("#pageTitle").html("My Collection - Watched")
	showFilmCollection(array)
}
function showFilmsPending(array){
	refreshPage()
	$("#btn_showPending").addClass("active")
	$("#pageTitle").html("My Collection - Pending")
	showFilmCollection(array)
}

function showFilmCollection(array){
	$("#filmCollection").html("")
	array.forEach(function (v,i,array){
		$("#filmCollection").append(
			"<div class='col-sm-4 col-lg-4 col-md-4'>"+
		        "<div class='thumbnail'>"+
		            "<a href='"+url+"films/"+v._id+"'><img src='"+v.poster+"' alt=''/></a>"+
		            "<div class='caption'>"+
		                "<h4><a href='"+url+"films/"+v._id+"'>"+v.title+"</a></h4>"+	                
		                "<h4><small id='infoItem'>"+
		                    " <span class='glyphicon glyphicon-calendar'/> "+v.year+
					        " <span class='glyphicon glyphicon-time'/> "+v.duration+" min"+					        
		                "</small></h4>"+
		                "<h4><small id='infoItem'>"+
		                	" <span class='glyphicon glyphicon-tag'/> "+v.genre+
					        " <span class='glyphicon glyphicon-map-marker'/> "+v.country+
					    "</small></h4>"+
		            "</div>"+
		            "<div class='ratings'>"+
		                "<p class='pull-right'>"+v.comments.length+" comments</p>"+
		                "<p>"+getStars(v.rate)+"</p>"+
		            "</div>"+
		        "</div>"+
		    "</div>"
    	)
	})	
}

function getStars(n){
	var stars = ""
	for (var i=1; i<=5; i++){
		if (i <= n)
			stars = stars + " <span class='glyphicon glyphicon-star'></span>"
		else
			stars = stars + " <span class='glyphicon glyphicon-star-empty'></span>"
	}

	return stars
}

function addFilm(){
	resetForm($('#modalAddFilm'));
	$('#modalAddFilm').modal({ backdrop: 'static', keyboard: false })
}

function resetForm($form) {
    $form.find('input').val('');
    $form.find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected');
}

// FilmPage

function getFilmIdFromUrl(){
	var url = window.location.href
	return url.substring(28) // local
	//return url.substring(44) // heroku
}

function loadFilmPage(){
	localStorage.setItem("current_filmid", getFilmIdFromUrl())
	getFilmData(localStorage.getItem("current_filmid"))
	$('#newComment_form').attr("action", "/addComment/"+localStorage.getItem("username")+"/"+getFilmIdFromUrl());
}

function showFilmData(film){
	$("#pageTitle").html(film.title)
	$("#img_poster").attr("src",film.poster)
	$("#nameItem").html("<strong>"+film.title+"</strong>")
	$("#infoItem").html(
		"<span class='glyphicon glyphicon-calendar'/> "+film.year+" " +
        "<span class='glyphicon glyphicon-time'/> "+film.duration+" min " +
        "<span class='glyphicon glyphicon-tag'/> "+film.genre+" " +
        "<span class='glyphicon glyphicon-map-marker'/> "+film.country+" "
	)
	$("#sypnosis").html(film.sypnosis)
	$("#ratings_zone").html(
		"<p class='pull-right'>"+film.comments.length+" comments</p>"+
        "<p>"+getStars(film.rate)+" "+film.rate+" stars</p>"
	)

	showComments(film.comments)
}

function showComments(comments){
	comments.forEach(function (v,i,array){
		var date = new Date(v.date)
		var stringDate = date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()

		$("#comments_zone").append(
			"<hr>"+
	        "<div class='row'>"+
	            "<div class='col-md-12'>"+
	                getStars(v.stars)+" "+v.username+
	                "<span class='pull-right'>"+stringDate+"</span>"+
	                "<p>"+v.text+"</p>"+
	            "</div>"+
	        "</div>"
        )
	})
}

function showUserOptions(user){
	$("#btn_dropdown").removeClass("btn-default")
	$("#btn_dropdown").removeClass("btn-success")
	$("#btn_dropdown").removeClass("btn-warning")

	var array = user.showsWatched.filter(function (v,i,array){
		return v == localStorage.getItem("current_filmid")
	})

	if (array.length == 0){
		array = user.showsPending.filter(function (v,i,array){
			return v == localStorage.getItem("current_filmid")
		})

		if (array.length != 0){
			$("#btn_dropdown").html("Pending <span class='caret'/>")
			$("#btn_dropdown").addClass("btn-warning")
		}
		else{
			$("#btn_dropdown").html("No Watched <span class='caret'/>")
			$("#btn_dropdown").addClass("btn-default")
		}
	}
	else{
		$("#btn_dropdown").html("Watched <span class='caret'/>")
		$("#btn_dropdown").addClass("btn-success")
	}

	$("#dropdown_menu").html(
		"<li><a onClick='markAsWatched()'><span class='glyphicon glyphicon-eye-open'/> Watched</a></li>" +
        "<li><a onClick='markAsPending()'><span class='glyphicon glyphicon-hourglass'/> Pending</a></li>" +
        "<li role='separator' class='divider'></li>" +
        "<li><a onClick='deleteFilm()'><span class='glyphicon glyphicon-pencil'/> Edit</a></li>" +
        "<li><a onClick='deleteFilm()'><span class='glyphicon glyphicon-trash'/> Delete</a></li>"
	)
}

function leaveComment(){	
	$('#modalAddComment').modal({ backdrop: 'static', keyboard: false })
}

function deleteFilm(){
	//$('#modalAddComment').modal({ backdrop: 'static', keyboard: false })
	$.ajax({
		url: url+"films/"+localStorage.getItem("current_filmid"),
		type: 'DELETE',
		success: function(){},
		error: function(e){console.log(e)},
		data: {},
		contentType: 'application/json; charset=utf-8'
	});

	getHomepage()
}



// HTTP REQUESTS

function getHomepage(){
	window.location = url+"home/"+localStorage.getItem("username");
}

function logOut(){
	localStorage.removeItem("username")
	window.location = url+"login";
}

function getAllFilms(){
	$.getJSON(url+"films", function (films){
		showAllFilms(films)
	})
}

function getAllFilmsWatched(){
	$.getJSON(url+"films", function (films){
		$.getJSON(url+"users/"+localStorage.getItem("username"), function (user){
			if (!user)
				console.log("Error")
			else{
				var aux = []
				films.forEach(function (v,i,array){
					if (user.showsWatched.indexOf(v._id) > -1)
						aux.push(v)
				})
				showFilmsWatched(aux)
			}
		})
	})
}

function getAllFilmsPending(){
	$.getJSON(url+"films", function (films){
		$.getJSON(url+"users/"+localStorage.getItem("username"), function (user){
			if (!user)
				console.log("Error")
			else{
				var aux = []
				films.forEach(function (v,i,array){
					if (user.showsPending.indexOf(v._id) != -1)
						aux.push(v)
				})

				showFilmsPending(aux)
			}
		})
	})
}

function saveFilm(){
	$.ajax({
		url: $('#newFilm_form').attr('action'),
		type: 'POST',
		success: function(){
			getAllFilms()
			$('#modalAddFilm').modal('toggle')
		},
		error: function(e){console.log(e)},
		data: $('#newFilm_form').serialize()
	});
}

// FILMPAGE

function getFilmData(filmid){
	$.getJSON(url+"getFilmData/"+filmid, function (film){
		if (!film)
			console.log("Error")
		else{
			showFilmData(film)
		}
	})

	$.getJSON(url+"users/"+localStorage.getItem("username"), function (user){
		if (!user)
			console.log("Error")
		else{
			showUserOptions(user)
		}
	})
}

function markAsWatched(){
	$.ajax({
		url: url+"markFilmWatched/"+localStorage.getItem("username"),
		type: 'PUT',
		success: function(user){showUserOptions(user)},
		error: function(e){console.log(e)},
		data: JSON.stringify({filmid : localStorage.getItem("current_filmid")}),
		contentType: 'application/json; charset=utf-8'
	});
}

function markAsPending(){
	$.ajax({
		url: url+"markFilmPending/"+localStorage.getItem("username"),
		type: 'PUT',
		success: function(user){showUserOptions(user)},
		error: function(e){console.log(e)},
		data: JSON.stringify({filmid : localStorage.getItem("current_filmid")}),
		contentType: 'application/json; charset=utf-8'
	});
}

function saveComment(){	
	$.ajax({
		url: url+"addComment/"+localStorage.getItem("username")+"/"+localStorage.getItem("current_filmid"),
		type: 'POST',
		success: function(){
			window.location.reload()
		},
		error: function(e){console.log(e)},
		data: $('#newFilm_form').serialize()
	});
}