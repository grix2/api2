//Function initiating the get albums process if the search box is populated and therefore no Artist ID
var getAlbums =function(){
	// create the Spotify request for a list of albums
	var jSpotReq = new XMLHttpRequest();
	jSpotReq.addEventListener('load',getAlbumResponse);
	jSpotReq.open("GET","http://ws.spotify.com/search/1/artist?q=artist%3A" + document.getElementById("bandSearch").value);
	jSpotReq.send();
}

//Function initiating the get albums process if the search box is not populated
var getIdAlbumResponse = function(){
	mySearch = location.search.substr(1).split("&");
	stId = mySearch[0].substr(3,mySearch[0].length);
	if(typeof stId !== "undefined"){
		document.getElementById("main").innerHTML = "";
		var jReq = new XMLHttpRequest();
		jReq.addEventListener('load',getArtistResponse);
		jReq.open("GET","https://api.spotify.com/v1/artists/" + stId + "/albums?album_type=album&market=GB",false);
		jReq.send();
	}
}

//Response to search box based request to get Artist ID
var getAlbumResponse = function(){

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

	//Get Artist ID by extracting href value of xml and selecting characters 15 to 37
	var sthref = new String(xmlDoc.getElementsByTagName("artist")[0].getAttribute("href"));
	var stId = sthref.substr(15,37);

	//Validate that a value has been assigned to the stId then create a request for the artists albums based on their ID
	if(typeof stId !== "undefined"){
		document.getElementById("main").innerHTML = "";
		var jReq = new XMLHttpRequest();
		jReq.addEventListener('load',getArtistResponse);
		console.log("Link to Run https://api.spotify.com/v1/artists/"+stId+"/albums?album_type=album&market=GB");
		jReq.open("GET","https://api.spotify.com/v1/artists/" + stId + "/albums?album_type=album&market=GB",false);
		jReq.send();
	}
}


// Response to request from either search text box or url for artist albums
var getArtistResponse = function(){
	//Convert the response into a readable response
	var jResp = JSON.parse(this.response);
	var y=0;
	console.log(jResp);
	//Validate that response is good
	if(jResp.items.length > 0){
		//Create a div for each album with an image an id and a title
	 	for(var i = 0;i<jResp.items.length;i++){
	 		//for every second album close off the row and add a blank row
	 		if(y===1){
	 			y=0;
	 			document.getElementById("main").innerHTML = document.getElementById("main").innerHTML + "<div><div id='" + jResp.items[i].id + "' class='albumview'><img  src='" + jResp.items[i].images[1].url + "' onclick= getTracks('" + jResp.items[i].id + "')><h1>" + jResp.items[i].name + "</h1></div><div class='column1'></div>"; 		
	 		}
	 		else{
	 			y=1;
	 			document.getElementById("main").innerHTML = document.getElementById("main").innerHTML + "<div><div id='" + jResp.items[i].id + "' class='albumview'><img  src='" + jResp.items[i].images[1].url + "' onclick= getTracks('" + jResp.items[i].id + "')><h1>" + jResp.items[i].name + "</h1></div>";
	 			
	 		}
	 	}
	 }
}

// When an album image is clicked use the albums id to create a request for album tracks
var getTracks = function(stId){

	var xhr = new XMLHttpRequest();
	xhr.addEventListener('load',getAlbumTracks);
	xhr.open("GET","https://api.spotify.com/v1/albums/" + stId + "/tracks?market=GB&limit=50",false);
	xhr.send();
}

//Response to album tracks
var getAlbumTracks = function(){
	//Convert the response into a usable form
	var jResp = JSON.parse(this.response);

 	console.log(jResp);
 	// Declare variables for the elements in the track list div 
 	var stDiv = document.createElement("div");
 	var stUl = document.createElement("ul");
 	
 	//Check to see if a tracklist already exists if it does get rid of it.
 	var divExist = document.getElementById("trackview");
 	console.log(divExist);
 	if(typeof divExist === "undefined" || divExist === null){
 	}
 	else{
 			divExist.parentElement.removeChild(divExist);
 	}
 	
 	//Create new trackview div and assign an unordered list
 	stDiv.setAttribute("id","trackview");
 	stDiv.appendChild(stUl);
 	var stId = jResp.href.substr(34,22);

	//Validate that there are tracks associated with the album track response
 	if(jResp.items.length > 0){
 		//For each track create an element
		for(var i = 0;i<jResp.items.length;i++){
			// Create list item and span item set values 
   			var stLi = document.createElement("li");
 			var stSpan = document.createElement("span");
 			stSpan.innerHTML = jResp.items[i].name;
 			//Append Span to List item then List item to Unordered List
 			stLi.appendChild(stSpan);
			stUl.appendChild(stLi);
		}	
			
 	}
 	//Append the new div to the album div
	document.getElementById(stId).parentElement.appendChild(stDiv);
}
