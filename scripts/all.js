//This JavaScript carries all functions common to all pages other than the jquery functions

//On Load trigger that initiates the process that checks to see if there is actionable info in the url
$(document).ready( function(){
	//console.log("Location " + location.search.substr(1).length>1);
	//Check to see if there are passed variables in the URL, if yes initiate the page population functions by calling the selectFunction
	if(location.search.substr(1).length>1){
		selectFunction();
	}
});


//This function is hit from either the document ready or the search button click to determine which page is loaded and therefore which function to call
var selectFunction = function(){

	//Get the page file name from the url
	var stDoc = window.location.href;
	var stParts = stDoc.split("/");
	var stPage = stParts[(stParts.length - 1)].toString();
	//clean off any variables at the end of the url
	var stCleanPages = stPage.split("?");
	var stCleanPage = stCleanPages[0].toString();
	
	//console.log(stCleanPage);
	var stName = "";
	
	//Match the loaded page to one of the possibilities, then run the functions to populate the identified page
	switch(stCleanPage){
		case "index.html" :
			console.log("fired");
			getArtist();
			break;
		case "concerts.html" :
			getConcert();
			getArtist();
			break;
		case "video.html" :
			getVideos();
			getArtist();
			break;
		case "albums.html" :
			//Try to use information in the search text box to populate the screen
			//If nothing in the search text box screen then use the information in the url
			try{
				getAlbums();
			}
			catch(err){
				getIdAlbumResponse();
			}
			getArtist();
			break;
	}

}	

//Initiate the process for getting the spotify band ID and the Echonest online band links
var getArtist = function(){
	console.log("shot");	
	//Instantiate stArtist string variable
	var stArtist = "";
	// test to see if there is info available in the search text box and assign it to stArtist
	try{
		stArtist = document.getElementById("bandSearch").value;
		console.log(document.getElementById("bandSearch").value);
	}	
	//if there isn't info available in the search text box look to see if there is info in the url and assign it to stArtist
	catch(err){
		mySearch = location.search.substr(1).split("&");
		stArtist = mySearch[1].substr(5,mySearch[0].length);
	}
		
	//Prepare and send the echonest JSON request with event listener to get artist identifier
	var jENestReq = new XMLHttpRequest();
	jENestReq.addEventListener('load',getENestArtistResponse);
	jENestReq.open("GET","http://developer.echonest.com/api/v4/artist/profile?api_key=YB4F9B7ZLS2YMOGUG&format=json&name=" + stArtist,false);
	jENestReq.send();
	
	//Prepare and send the spotify XML request with event listener to get artist identifier
	var jSpotReq = new XMLHttpRequest();
	jSpotReq.addEventListener('load',getSpotArtistResponse);
	jSpotReq.open("GET","http://ws.spotify.com/search/1/artist?q=artist%3A" + stArtist);
	jSpotReq.send();
}

// Get Echonest response to request for media links and apply to online div
var getArtistMediaResponse = function(){

	//Convert the response to easily readable format
	var jResp = JSON.parse(this.response);
	//Get the part of the parsed response we need at this time
	var url = jResp.response.urls;
	
	//clear the online div of the current links
 	var onLine = document.getElementById("onLine");
	onLine.innerHTML = "";
	
	//Instantiate stArtist string variable
	var stArtist = "";
	// test to see if there is info available in the search text box and assign it to stArtist
	try{
		stArtist = document.getElementById("bandSearch").value;
	}	
	//if there isn't info available in the search text box look to see if there is info in the url and assign it to stArtist
	catch(err){
		mySearch = location.search.substr(1).split("&");
		stArtist = mySearch[1].substr(5,mySearch[0].length);
	}
	//Create the online media links for the new artist and assign to the online div element
 	if(url.lastfm_url!=='undefined'){
 		onLine.innerHTML = onLine.innerHTML + ("<div class='bandLink'><a href='" + url.lastfm_url + "' target='_blank'><img src='images/lastfm.png'></a></div>");
 	}
 	if(url.mb_url!=='undefined'){
 		onLine.innerHTML = onLine.innerHTML + ("<div class='bandLink'><a href='" + url.mb_url + "' target='_blank'><img src='images/MusicBrainz2.png'></a></div>");
 	}
 	if(url.official_url!=='undefined'){
 		onLine.innerHTML = onLine.innerHTML + ("<div class='bandLink'><a href='" + url.official_url + "' target='_blank' >" + stArtist + "</a></div>");
	}
 	if(url.twitter_url!=='undefined'){
 		onLine.innerHTML = onLine.innerHTML + ("<div class='bandLink'><a href='" + url.twitter_url + "'  target='_blank'><img src='images/twitter.png'></a></div>");
	} 
}


//Set Up The Navigation Links with the Spotify XML Response
var getSpotArtistResponse = function(){
	//XML response needs to be parsed based on whether the browser is ie or not.
	if (window.DOMParser){
		parser=new DOMParser();
		xmlDoc=parser.parseFromString(this.response,"text/xml");
  	}
	else{
    	xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    	xmlDoc.async=false;
    	xmlDoc.loadXML(txt);
  	}

  	//Get the artist name and ID as defined by spotify and assign them to variables
	var stArtist = xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue;
	var artistId = new String(xmlDoc.getElementsByTagName("artist")[0].getAttribute("href"));
	//remove special characters that impact code execution such as / in AC/DC
	stArtist = stArtist.replace('/','');
	console.log(stArtist);
	//Create the navigation links to the website pages
	document.getElementById("albumlink").setAttribute("href" ,"albums.html?id=" + artistId.substr(15,37) + "&name=" + stArtist);
	document.getElementById("concertslink").setAttribute("href" ,"concerts.html?id=" + artistId.substr(15,37) + "&name=" + stArtist);
	document.getElementById("artistlink").setAttribute("href" ,"index.html?id=" + artistId.substr(15,37) + "&name=" + stArtist);
	document.getElementById("videoslink").setAttribute("href" ,"video.html?id=" + artistId.substr(15,37) + "&name=" + stArtist);

	// Test to see if the current loaded page is "index.html" if it is then send a request for a large image of the artist from using the artist id
	var stDoc = window.location.href;
	var stParts = stDoc.split("/");
	var stPage = stParts[(stParts.length - 1)].toString();
	var stCleanPages = stPage.split("?");
	var stCleanPage = stCleanPages[0].toString();
	if(stCleanPage === "index.html"){
		getSpotArtistImage(artistId.substr(15,37));
	}
}

// JSON response to request for Echonest ID based on artist name 
// Use this ID to request 
var getENestArtistResponse = function(){
	console.log("Also Here");
	var jResp = JSON.parse(this.response);
	console.log(jResp);
	//Validate Response is good
	if(jResp.response.status.code !== 5){
		var bandId = jResp.response.artist.id;
		getArtistMedia(bandId);
	}
	else{
		//If no band identified tell the user
		alert("Pick a band EchoNest knows!");
	}
}

// Request to get the Artist OnLine Media based on the Echonest ID
// If the loaded page is index.html then request the Echonest biographies.
var getArtistMedia = function(stId){
	console.log("And Here");
	var jReq = new XMLHttpRequest();
	jReq.addEventListener('load',getArtistMediaResponse);
	jReq.open("GET","http://developer.echonest.com/api/v4/artist/urls?api_key=YB4F9B7ZLS2YMOGUG&format=json&id=" + stId,false);
	jReq.send();
	var stDoc = window.location.href;
	var stParts = stDoc.split("/");
	var stPage = stParts[(stParts.length - 1)].toString();
	var stCleanPages = stPage.split("?");
	var stCleanPage = stCleanPages[0].toString();

	if(stCleanPage === "index.html"){
		var jENestBReq = new XMLHttpRequest();
		jENestBReq.addEventListener('load',getENestBiogResponse);
		jENestBReq.open("GET","http://developer.echonest.com/api/v4/artist/biographies?api_key=YB4F9B7ZLS2YMOGUG&format=json&id=" + stId,false);
		jENestBReq.send();
	}
}

/*
function checkEnter (event){
	var x = event.which;
	console.log(x);
	if(x == 13){
		console.log("Hello");
		return false;
	}
	else{
		return true;
	}
}  */

$('#band').keypress(function (e) {
 var key = e.which;
 if(key == 13)  // the enter key code
  {
    
    return false;  
  }
});