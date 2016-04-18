var travelLocation = '';
var gmarkers = [];

var images = ['assets/IMG_3051.jpg', 'assets/IMG_3055.jpg', 'assets/IMG_3056.jpg', 'assets/IMG_3063.jpg', 'assets/IMG_3067.jpg', 'assets/IMG_3069.jpg', 'assets/IMG_3070.jpg', 'assets/IMG_3071.jpg'];
var currentImage = 0;

$(document).ready(function() {

  autoPlaces();

  $('#search').submit(function(event) {
    event.preventDefault();
    submitLocation();
  });

  $('#logo').click(function(){
    replaceBackground();
    $('#question-wrap').show();
    $('#map').empty().hide();
    $('#location-input').val('');
    addNavLinks();
  });

  randomBackgroundImage();

  $('#map').click(function(){
    newPinsOnMove();
  });

  $(window).resize(function() {
    centerMap();
  });

});

function randomBackgroundImage() {
  $('#index-body').css({'background': 'url(../armchairtravel/' + images[Math.floor(Math.random() * images.length)] + ') no-repeat'});
}

function addIcons() {
  var first = '<i class="fa fa-instagram fa-2x"></i>';
  var second = '<i class="fa fa-wikipedia-w fa-2x"></i>';
  var third = '<i class="fa fa-tripadvisor fa-2x"></i>';
  $('#nav-links li:nth-child(odd)').empty();
  $('#nav-links li:nth-child(1)').append(first);
  $('#nav-links li:nth-child(3)').append(second);
  $('#nav-links li:nth-child(5)').append(third);
}

function addNavLinks() {
  var first = 'About';
  var second = 'Help';
  var third = 'Contact';
  $('#nav-links li:nth-child(odd)').empty();
  $('#nav-links li:nth-child(1)').text(first);
  $('#nav-links li:nth-child(3)').text(second);
  $('#nav-links li:nth-child(5)').text(third);
  $('#nav-links li').removeClass();

}

function clearBackground(){
  $('#index-body').css('background', 'none')
                  .css('background-color', '#FCFFF5');
}

function replaceBackground(){
  randomBackgroundImage();
  $('#index-body').css('background-size', 'cover')
                  .css('background-position', 'left')
}

function getRequest(locationInput){
  var key = 'AIzaSyCKI8h94-_C9rS06RcgrHutWTrXhabO0GM';
  var params = {
    address: locationInput,
    key: key
  };
  url = 'https://maps.googleapis.com/maps/api/geocode/json';

  $.getJSON(url, params, function(data){
    lat = data.results[0].geometry.location.lat
    lng = data.results[0].geometry.location.lng
    initMap(lat, lng);
    // console.log(data);
  });
}

function getWiki(lat, lng) {
  var params = {
    prop: 'coordinates|pageimages|pageterms',
    colimit: 50,
    piprop: 'thumbnail',
    pithumbsize: 144,
    pilimit: 250,
    format: 'json',
    wbptterms: 'description',
    generator: 'geosearch',
    ggscoord: lat + '|' + lng,
    ggsradius: 10000,
    ggslimit: 250
  };
  url = 'https://en.wikipedia.org/w/api.php?action=query';

  $.ajax({
    url: url,
    data: params,
    dataType: 'jsonp',
    success: function(data){
      $.each(data, function(index, value){
        $.each(value.pages, function(index, object){
          console.log(object);
          var marker = new google.maps.Marker({
            position: {lat: object.coordinates ? object.coordinates[0].lat: "not available", lng: object.coordinates ? object.coordinates[0].lon: "not available"},
            map: map,
            title: object.title,
            url: "https://en.wikipedia.org/wiki?curid=" + object.pageid
            })
          gmarkers.push(marker);
          console.log(gmarkers.length);
          google.maps.event.addListener(marker, 'mouseover', function(event) {
            this.setIcon(object.thumbnail.source);
            });
          google.maps.event.addListener(marker, 'mouseout', function(event) {
            this.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
            });
          google.maps.event.addListener(marker, 'click', function(event) {
            window.open(this.url);
            });
          });
        })
      }
  })
};

function initMap(lat, lng){
  var mapDiv = document.getElementById('map');
  
  map = new google.maps.Map(mapDiv, {
    center: {lat: lat, lng: lng},
    zoom: 16
  });

  var marker = new google.maps.Marker({
    position: {lat: lat, lng: lng},
    map: map,
    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    animation: google.maps.Animation.DROP,
  }); 
  getWiki(lat, lng);
}

function centerMap() {
  var currCenter = map.getCenter();
  google.maps.event.addDomListener(window, 'resize', function() {
    map.setCenter(currCenter);
  });
}

function newPinsOnMove(){
  removeMarkers();
  gmarkers = [];
  var getCenter = map.getCenter();
  var latitude = getCenter.lat();
  var longitude = getCenter.lng();
  getWiki(latitude, longitude);
}


function autoPlaces() {
  var input = document.getElementById('location-input');
  var searchBox = new google.maps.places.SearchBox(input);

  searchBox.addListener('places_changed', function() {
    submitLocation();
  });
}

function removeMarkers() {
  for (i=0; i < gmarkers.length; i++) {
    gmarkers[i].setMap(null);
  }
}

function submitLocation() {
  travelLocation = $('#location-input').val();

  getRequest(travelLocation);
    
  $('#location-input').val('');
  $('#question-wrap').hide();
  $('#map').show();
  
  clearBackground();
  
  addIcons(); 
}

