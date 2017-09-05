 /*jshint loopfunc:true */

 var map;
 var url;
 var articleStr;
 var wikiLinks;
 var markers = [];
 var $wikiElem = $('#wikipedia-links');
 var locations = [
     {
         title: 'Sulphur Baths',
         location: {
             lat: 41.688112,
             lng: 44.811014
         }
},
     {
         title: 'Georgian National Museum',
         location: {
             lat: 41.696215,
             lng: 44.800183
         }
},
     {
         title: 'Narikala Fortress',
         location: {
             lat: 41.688139,
             lng: 44.808463
         }
},
     {
         title: 'Anchiskhati Basilica',
         location: {
             lat: 41.695747,
             lng: 44.806771
         }
},
     {
         title: 'Sulphur Waterfall',
         location: {
             lat: 41.687022,
             lng: 44.809153
         }
},
     {
         title: 'The Bridge of Peace',
         location: {
             lat: 41.692983,
             lng: 44.808745
         }
}
];

 function initMap() {
     var styles = [
         {
             featureType: 'water',
             stylers: [{
                 color: '#19a0d8'
             }]
         },
         {
             featureType: 'administrative',
             elementType: 'labels.text.stroke',
             stylers: [
                 {
                     color: '#ffffff'
                 },
                 {
                     weight: 6
                 }]
         },
         {
             featureType: 'administrative',
             elementType: 'labels.text.fill',
             stylers: [{
                 color: '#e85113'
             }]
         },
         {
             featureType: 'road.highway',
             elementType: 'geometry.stroke',
             stylers: [{
                     color: '#efe9e4'
                 },
                 {
                     lightness: -40
                 }]
         },
         {
             featureType: 'transit.station',
             stylers: [{
                     weight: 9
                 },
                 {
                     hue: '#e85113'
                 }]
         },
         {
             featureType: 'road.highway',
             elementType: 'labels.icon',
             stylers: [{
                 visibility: 'off'
             }]
         },
         {
             featureType: 'water',
             elementType: 'labels.text.stroke',
             stylers: [{
                 lightness: 100
             }]
         },
         {
             featureType: 'water',
             elementType: 'labels.text.fill',
             stylers: [{
                 lightness: -100
             }]
         },
         {
             featureType: 'poi',
             elementType: 'geometry',
             stylers: [{
                     visibility: 'on'
                 },
                 {
                     color: '#f0e4d3'
                 }]
         },
         {
             featureType: 'road.highway',
             elementType: 'geometry.fill',
             stylers: [{
                     color: '#efe9e4'
                 },
                 {
                     lightness: -25
                 }]
         }];

     map = new google.maps.Map(document.getElementById('map'), {
         center: {
             lat: 41.716667,
             lng: 44.783333
         },
         zoom: 13,
         styles: styles,
         mapTypeControl: false
     });

     var largeInfowindow = new google.maps.InfoWindow();
     var defaultIcon = makeMarkerIcon('0091ff');
     var highlightedIcon = makeMarkerIcon('FFFF24');
     var marker;

     function clicker() {
         marker.addListener('click', function () {
             populateInfoWindow(this, largeInfowindow);
         });
     }

     function mouse() {
         marker.addListener('mouseover', function () {
             this.setIcon(highlightedIcon);
         });
     }

     function mousout() {
         marker.addListener('mouseout', function () {
             this.setIcon(defaultIcon);
         });
     }

     function mousclick() {
         marker.addListener('click', function () {
             this.setAnimation(google.maps.Animation.BOUNCE);
         });
     }

     function toggleBounce() {
         if (marker.getAnimation() !== null) {
             marker.setAnimation(null);
         } else {
             marker.setAnimation(google.maps.Animation.BOUNCE);
         }
     }

     for (var i = 0; i < locations.length; i++) {
         var position = locations[i].location;
         var title = locations[i].title;
         marker = new google.maps.Marker({
             position: position,
             title: title,
             animation: google.maps.Animation.DROP,
             icon: defaultIcon,
             id: i,
             map: map,
         });
         markers.push(marker);
         clicker();
         mouse();
         mousout();
         mousclick();
     }
 }

 var locNum;

 function locationWikiInfo(locNum) {
     var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + locations[locNum].title + '&format=json&callback=wikiCallbackFunction';
     var wikiRequestTimeout = setTimeout(function () {
         $wikiElem.append('<li>No article found on Wikipedia !!!</li>');
     }, 1000);

     $.ajax(wikiUrl, {
         dataType: "jsonp",
         success: function (response) {
             var articleList = response[1];
             for (var i = 0; i < articleList.length; i++) {
                 articleStr = articleList[i];
                 url = 'http://en.wikipedia.org/wiki/' + articleStr;
                 $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
                 clearTimeout(wikiRequestTimeout);
             }
         }
     });
 }

 function populateInfoWindow(marker, infowindow) {
     if (infowindow.marker != marker) {
         infowindow.setContent('');
         infowindow.marker = marker;
         infowindow.addListener('closeclick', function () {
             infowindow.marker = null;
         });
         var streetViewService = new google.maps.StreetViewService();
         var radius = 50;
         var getStreetView = function (data, status) {
             if (status == google.maps.StreetViewStatus.OK) {
                 var nearStreetViewLocation = data.location.latLng;
                 var heading = google.maps.geometry.spherical.computeHeading(
                     nearStreetViewLocation, marker.position);
                 infowindow.setContent('<div>' + marker.title + '</div>' + '<p><a href="' + url + '">' + "Click Link For Wikipedia Article" + '</a></p>' + '<div id="pano"</div>');

                 var panoramaOptions = {
                     position: nearStreetViewLocation,
                     pov: {
                         heading: heading,
                         pitch: 30
                     }
                 };

                 var panorama = new google.maps.StreetViewPanorama(
                     document.getElementById('pano'), panoramaOptions);
             } else {
                 infowindow.setContent('<div>' + marker.title + '</div>' +
                     '<div>No Street View Found</div>');
             }
         };
         streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
         infowindow.open(map, marker);
     }
 }

 function showListings() {
     var bounds = new google.maps.LatLngBounds();

     for (var i = 0; i < markers.length; i++) {
         markers[i].setMap(map);
         bounds.extend(markers[i].position);
     }
     map.fitBounds(bounds);
 }

 function hideListings() {
     for (var i = 0; i < markers.length; i++) {
         markers[i].setMap(null);
     }
 }

 function makeMarkerIcon(markerColor) {
     var markerImage = new google.maps.MarkerImage(
         'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
         '|40|_|%E2%80%A2',
         new google.maps.Size(21, 34),
         new google.maps.Point(0, 0),
         new google.maps.Point(10, 34),
         new google.maps.Size(21, 34));
     return markerImage;
 }

 var viewModel = {
     choose: ko.observable("Show/Hide Places"),
     tbilisi: ko.observable("Explore Tbilisi"),
     sbaths: ko.observable("Sulphur Baths"),
     museum: ko.observable("Georgian National Museum"),
     fortress: ko.observable("Narikala Fortress"),
     basilica: ko.observable("Anchiskhati Basilica"),
     waterfall: ko.observable("Sulphur Waterfall"),
     bridge: ko.observable("The Bridge of Peace"),
     clear: ko.observable("Clear Place Markers"),
     head: ko.observable("Relevant Wikipedia Links"),
     lists: ko.observable("See relevant Wikipedia articles here!"),
     listhide: function () {
         $("#sulphur-baths").toggle();
         $("#museum").toggle();
         $("#fortress").toggle();
         $("#basilica").toggle();
         $("#waterfall").toggle();
         $("#bridge").toggle();
         $("#hide-listings").toggle();

         hideListings();
         $("li").hide();
     },
     mark0: function () {
         markers[0].setMap(map);
         locationWikiInfo(0);
         $("li").hide();
     },
     mark1: function () {
         markers[1].setMap(map);
         locationWikiInfo(1);
         $("li").hide();
     },
     mark2: function () {
         markers[2].setMap(map);
         locationWikiInfo(2);
         $("li").hide();
     },
     mark3: function () {
         markers[3].setMap(map);
         locationWikiInfo(3);
         $("li").hide();
     },
     mark4: function () {
         markers[4].setMap(map);
         locationWikiInfo(4);
         $("li").hide();
     },
     mark5: function () {
         markers[5].setMap(map);
         locationWikiInfo(5);
         $("li").hide();
     }
 };
 ko.applyBindings(viewModel);

 function googleMapsApiErrorHandler() {
     $('body').prepend('<p id="map-error">Sorry we are having trouble loading google maps API, please try again in a moment.</p>');
 }
