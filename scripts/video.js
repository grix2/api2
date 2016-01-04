//Functions relating exclusively to video.html


//Core page function for videos
var getVideos = function(){
	//Test whether the call came from the click button or the url
	try{
		var stName = document.getElementById("bandSearch").value;
		console.log(document.getElementById("bandSearch").value);
	}	
	
	catch(err){
		var mySearch = location.search.substr(1).split("&");
		var stName = mySearch[1].substr(5,mySearch[0].length);
	}
	//Form the request to look for youtube videos based on an artist name
	var xhr = new XMLHttpRequest();
	xhr.addEventListener('load',getVideoList);
	xhr.open("GET", "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=" + stName + "&type=video&videoCaption=any&key=AIzaSyDBVELYY4TslpVyNshBwloc1QbPauAipP8",false);
	xhr.send();
};

//Response to request for videos
var getVideoList = function(){
	//Convert the response to a usable format
	var jResp = JSON.parse(this.response);

	// get the videolist div to assign new content to
	var tgt = document.getElementById("videolist");
	var i;
	//clear any existing video items from the page
	document.getElementById("videolist").innerHTML = "";
	//validate that the parsed response is good
	if(typeof jResp !=="undefined"){
		//create an unordered list to assign the new videos to and append it to the videolist Div
	 	var stUl = document.createElement("ul");
	 	tgt.appendChild(stUl);
	 	
	 	//For each video create a list item with an image and a id for the video
		for(i = 0;i<jResp.items.length;i++){
			console.log(jResp.items[i].id.videoId);
	   		var stLi = document.createElement("li");
	   		var stImg = document.createElement("img");
	   		var stH1 = document.createElement("h1");
	   		stImg.setAttribute("src",jResp.items[i].snippet.thumbnails.high.url);
	   		stImg.setAttribute("onclick","openVideo('" + jResp.items[i].id.videoId + "')" );
	   		
			//Add a a title	
	   		stH1.innerHTML= jResp.items[i].snippet.title;
			//Append the parts to their parent to form the Listitem in the list
			stLi.appendChild(stH1);
			stLi.appendChild(stImg);
			stUl.appendChild(stLi);
		}
	}
}

//When the video image is clicked open the video in the videoplaydiv
var openVideo = function(stId){
	//declare a variabble for the videoplay div and clear any existing content
	var elVideo = document.getElementById("videoplay");
	elVideo.innerHTML = ""
	
	//Create an iframe element with the youtube player and dowload the video
	elVideo.innerHTML = "<iframe id='player,type=,text/html' width='95%' height='520' src='http://www.youtube.com/embed/" + stId +"?enablejsapi=1&origin=http://example.com' frameborder='0'  events: {'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange}></iframe>"
	//scroll to the video player
	window.location.hash = '#videoplay';
}

function onPlayerReady(event) {
	event.target.playVideo();
}

