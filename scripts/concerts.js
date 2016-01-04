//Entry function for concerts page validates usable data and requests Songkick API concerts
var getConcert = function(){

	//Look to see if the search text box has content else use url information
	try{
		var stName = document.getElementById("bandSearch").value;
		console.log(document.getElementById("bandSearch").value);
	}	
	
	catch(err){
		var mySearch = location.search.substr(1).split("&");
		var stName = mySearch[1].substr(5,mySearch[0].length);
	}
	
	//Check useable data has been assigned to stName and then create request to look on SongKick for artistID.
	if(typeof stName !== "undefined"){
		var jReq = new XMLHttpRequest();
		jReq.addEventListener('load',getArtistId);
		jReq.open("GET","http://api.songkick.com/api/3.0/search/artists.json?query=" + stName + "&apikey=" + "UjoUBLauPO4FQ2i6",true);
		jReq.send();
	
	}
};
		
// Get Songkick Artist ID to allow a concert search to be done
var getArtistId = function(){
	
	//Make the response readable
	var jResp = JSON.parse(this.response);
	
	//Validate the response is good and then request concerts based on Artist ID
	if(jResp.resultsPage.status ==="ok"){
		document.getElementById("artist").innerHTML = "<h1>" + jResp.resultsPage.results.artist[0].displayName + "</h1>";
		//Assign artist ID to a variable
		var stId = jResp.resultsPage.results.artist[0].id;
		//Create new request
		var jReq = new XMLHttpRequest();
		jReq.addEventListener('load',getArtistConcerts);
		jReq.open("GET","http://api.songkick.com/api/3.0/artists/" + stId + "/calendar.json?apikey=UjoUBLauPO4FQ2i6",false);
		jReq.send();
	}
}

//Function receiving and presenting concert data
var getArtistConcerts = function(){
	//Make the concert response readable
	var jResp = JSON.parse(this.response);

	//declare a variable assigned to the main ID Div element
	var tgt = document.getElementById("main");
	//Clear any existing artist data from the page
	document.getElementById("map").innerHTML = "";
	document.getElementById("distcardiff").innerHTML = "";
	document.getElementById("onLine").innerHTML = "";
	//Try to delete the unordered list of concerts if one was loaded by a previous request
	try{
		var elList = document.getElementById("concertlist");
		elList.parentNode.removeChild(elList);
	}
	catch(err){
		//Only needed for syntactic correctness
	}
	
	//validate request response is good
	if(jResp.resultsPage.status ==="ok"){
		
		//Get the band name from the search text box or else the url
		try{
			stArtist = document.getElementById("bandSearch").value;
			console.log(document.getElementById("bandSearch").value);
		}	
		
		catch(err){
			mySearch = location.search.substr(1).split("&");
			stArtist = mySearch[1].substr(5,mySearch[0].length);
		}

		//Determine if there are any concerts planned for the artist if yes then carry on Else alert no concerts and end
	 	if(jResp.resultsPage.totalEntries > 0){

			//Create a handle for a new Unordered List
	 		var stUl = document.createElement("ul");
			stUl.setAttribute("id","concertlist");

			//Assign the new Unordered List to the ID main DIV
	 		tgt.appendChild(stUl);

			//For each concert listed in the response create a List Item
			for(var i = 0;i<jResp.resultsPage.results.event.length;i++){

				//Declare the list item and the constituent parts for the List item
	   			var stLi = document.createElement("li");
	   			var stA = document.createElement("a");
	   			var stSpan = document.createElement("span");
	   			
	   			//Assign the attributes and innerHTML to the external link to concerrt tickets
	   			stA.setAttribute("href",jResp.resultsPage.results.event[i].uri);
	   			stA.setAttribute("class","concerthlink");
	   			stA.setAttribute("target","_blank");
	   			stA.innerHTML = jResp.resultsPage.results.event[i].start.date;

				//Assign the attributes and innerHTML to the location span with the onclick functionality
	   			stSpan.setAttribute("class", "location");
	   			stSpan.setAttribute("onclick", "changeLocation({lat:" + jResp.resultsPage.results.event[i].venue.lat +",lng:" + jResp.resultsPage.results.event[i].venue.lng + "},'" + jResp.resultsPage.results.event[i].venue.displayName + "')");
	   			stSpan.innerHTML= " " + jResp.resultsPage.results.event[i].venue.displayName ;

				//Assign the constituent parts to the line item
				stLi.appendChild(stA);
				stLi.appendChild(stSpan);
				//Assign the new List Item to the list
				stUl.appendChild(stLi);
			}	
	
		}
		else{
			alert("No Concerts listed");
		}
	}
}
