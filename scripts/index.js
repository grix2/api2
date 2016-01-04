//Functions associated to the Index page exclusively

//Create a request to get images of the artist based on the spotify artist ID
var getSpotArtistImage = function(stId){

		var jReq = new XMLHttpRequest();
		jReq.addEventListener('load',getSpotArtistImagesResponse);
		jReq.open("GET","https://api.spotify.com/v1/artists/" + stId,false);
		jReq.send();
	}

//Response to request for EchoNest Biographies for an artist
var getENestBiogResponse = function(){

	//Convert the response to a usable format and then assign the biographies section to a variable
	var jResp = JSON.parse(this.response);
	var stBiogs = jResp.response.biographies;
	if(jResp.response.status.message === "Success"){

		//get a handle for the div to assign the artist biography to.
	 	var elBiog = document.getElementById("bandbiog");
	 	//Look for the Wikipedia biography in the response
	 	var i = 0;
	 	var blFound = false;
	 	//Loop through the list while there are list items left and Wikipedia hasn't been found
	 	while(i <11 && blFound ===false){
	 		console.log(stBiogs[i].site);
	 		if(stBiogs[i].site === "wikipedia"){
	 			//If wikipedia biog found stop searching and use it
	 			blFound = true;
	 			console.log(blFound);
	 			elBiog.innerHTML = "<a href='" + stBiogs[i].url + "'>Link</a><p>"+ stBiogs[i].text +"</p>";
	 		}
	 		else{
	 			i=i+1;
	 		}
	 	}
	 	//if Can't find wikipedia biography then use the first in the list but add an external link as it is probably only a partial biography
	 	if(blFound === false){
	 		elBiog.innerHTML = stBiogs[0].text 
	 		elBiog = "<a class='biogtext' target='_blank' href='" + stBiogs[0].url + "'>Link</a><p>"+ stBiogs[0].text +"</p>";
	 	}
	 }
	 else{
	 	//if no biography not found 
	 	var elBiog = document.getElementById("bandbiog");
	 	elBiog.innerHTML = "";
	 }
}

//Response to request for artist images
var getSpotArtistImagesResponse = function(){
	//Convert the response to a usable format
	var jResp = JSON.parse(this.response);
	//Check that the response is good by checking there is more than one image returned
	if(jResp.images.length > 1){
	 	var elDiv = document.getElementById("bandimage");
		elDiv.innerHTML = ("<img src=" + jResp.images[1].url + ">");
	}
}



