 /*jshint loopfunc:true */

 var map;

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
             stylers: [
                 {
                     color: '#19a0d8'
                 }
            ]
          }, {
             featureType: 'administrative',
             elementType: 'labels.text.stroke',
             stylers: [
                 {
                     color: '#ffffff'
                 },
                 {
                     weight: 6
                 }
            ]
          }, {
             featureType: 'administrative',
             elementType: 'labels.text.fill',
             stylers: [
                 {
                     color: '#e85113'
                 }
            ]
          }, {
             featureType: 'road.highway',
             elementType: 'geometry.stroke',
             stylers: [
                 {
                     color: '#efe9e4'
                 },
                 {
                     lightness: -40
                 }
            ]
          }, {
             featureType: 'transit.station',
             stylers: [
                 {
                     weight: 9
                 },
                 {
                     hue: '#e85113'
                 }
            ]
          }, {
             featureType: 'road.highway',
             elementType: 'labels.icon',
             stylers: [
                 {
                     visibility: 'off'
                 }
            ]
          }, {
             featureType: 'water',
             elementType: 'labels.text.stroke',
             stylers: [
                 {
                     lightness: 100
                 }
            ]
          }, {
             featureType: 'water',
             elementType: 'labels.text.fill',
             stylers: [
                 {
                     lightness: -100
                 }
            ]
          }, {
             featureType: 'poi',
             elementType: 'geometry',
             stylers: [
                 {
                     visibility: 'on'
                 },
                 {
                     color: '#f0e4d3'
                 }
            ]
          }, {
             featureType: 'road.highway',
             elementType: 'geometry.fill',
             stylers: [
                 {
                     color: '#efe9e4'
                 },
                 {
                     lightness: -25
                 }
            ]
          }
        ];

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

     for (var i = 0; i < locations.length; i++) {
         var position = locations[i].location;
         var title = locations[i].title;
         marker = new google.maps.Marker({
             position: position,
             title: title,
             animation: google.maps.Animation.DROP,
             icon: defaultIcon,
             id: i
         });

         markers.push(marker);
         clicker();
         mouse();
         mousout();

     }


     //document.getElementById('show-listings').addEventListener('click', showListings);
     document.getElementById('hide-listings').addEventListener('click', hideListings);

     document.getElementById('sulphur-baths').addEventListener('click', function () {
         markers[0].setMap(map);
         locationWikiInfo(0);
     });
     document.getElementById('museum').addEventListener('click', function () {
         markers[1].setMap(map);

         locationWikiInfo(1);
     });
     document.getElementById('fortress').addEventListener('click', function () {
         markers[2].setMap(map);

         locationWikiInfo(2);
     });
     document.getElementById('basilica').addEventListener('click', function () {
         markers[3].setMap(map);

         locationWikiInfo(3);
     });
     document.getElementById('waterfall').addEventListener('click', function () {
         markers[4].setMap(map);
         locationWikiInfo(4);
     });
     document.getElementById('bridge').addEventListener('click', function () {
         markers[5].setMap(map);

         locationWikiInfo(5);
     });

     $("#choose-place").click(function () {
         $("#sulphur-baths").show();
         $("#museum").show();
         $("#fortress").show();
         $("#basilica").show();
         $("#waterfall").show();
         $("#bridge").show();
         $("#hide-listings").show();


     });
 }
 var locNum;

 function locationWikiInfo(locNum) {
     var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + locations[locNum].title + '&format=json&callback=wikiCallbackFunction';
     var wikiRequestTimeout = setTimeout(function () {
         $wikiElem.text("No article found on Wikipedia");
     }, 3000);

     $.ajax(wikiUrl, {
         dataType: "jsonp",
         success: function (response) {
             var articleList = response[1];
             for (var i = 0; i < articleList.length; i++) {
                 var articleStr = articleList[i];

                 var url = 'http://en.wikipedia.org/wiki/' + articleStr;
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
                 infowindow.setContent('<div>' + marker.title + '</div><p> niko</p><div id="pano"</div>');
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
     choose: ko.observable("Choose A Place"),
     tbilisi: ko.observable("Explore Tbilisi"),
     sbaths: ko.observable("Sulphur Baths"),
     museum: ko.observable("Georgian National Museum"),
     fortress: ko.observable("Narikala Fortress"),
     basilica: ko.observable("Anchiskhati Basilica"),
     waterfall: ko.observable("Sulphur Waterfall"),
     bridge: ko.observable("The Bridge of Peace"),
     clear: ko.observable("Clear All"),
     head: ko.observable("Relevant Wikipedia Links"),
     lists: ko.observable("See relevant Wikipedia articles here!")

 };
 ko.applyBindings(viewModel);
