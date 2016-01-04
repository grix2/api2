//Google map functions and distance between two points on the surface of a sphere for use on concers.html page

//Create a google map centered on Cardiff
function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 51.4755, lng: -3.1780},
		zoom: 8
	});
}

//Change the centre of the google map to the location of the concert selected and set the marker tag to the venue name
var changeLocation = function(Loc, stLoc) {
	//Make the concert venue the centre of the map
	var map = new google.maps.Map(document.getElementById('map'), {
		center: Loc,
		zoom: 8
	});
	//change the marker tag to the concert venue name
	var marker = new google.maps.Marker({
		position: Loc,
		map: map,
		title: stLoc
	});
	//Call the math function to determine the distance to the concert venue from Cardiff and apply the value to the distcardiff id below the map 
	document.getElementById("distcardiff").innerHTML = getDistance(Loc,{lat: 51.4755, lng: -3.1780}) + " km from Cardiff";
	//scroll up the page to show the artist and the map
	window.location.hash = '#artist';
}

//Function to workout how far from Cardiff the concert is taking place 
//REF "http://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3" 

//Had to convert for use in googlemaps v3 as lat and lng properties were declared as functions in provided solution

//p1 is Cardiff
//p2 is the concert location passed from onclick event
var getDistance = function(p1, p2) {

	var R = 6378137; // Earth’s mean radius in meter
	
	var dLat = rad(p2.lat - p1.lat);
	var dLong = rad(p2.lng - p1.lng);
	
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
  	return parseInt(d/1000); // returns the distance in kilometers
};

var rad = function(x) {
	return x * Math.PI / 180;
};
