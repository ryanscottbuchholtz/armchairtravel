var travelLocation = '';

var images = ['IMG_3051.jpg', 'IMG_3055.jpg', 'IMG_3056.jpg', 'IMG_3063.jpg', 'IMG_3067.jpg', 'IMG_3069.jpg', 'IMG_3070.jpg', 'IMG_3071.jpg'];


$(document).ready(function() {

  $('#search').submit(function(event) {
    event.preventDefault();
    travelLocation = $('#location-input').val();
    $('#location-input').val('');
    console.log(travelLocation);
    $('#question-wrap').hide();
    $('#map').show();
    clearBackground();
    addIcons();
    getRequest(travelLocation);
  });

  $('#logo').click(function(){
    replaceBackground();
    $('#question-wrap').show();
    $('#map').hide();
    addNavLinks();
  });

  randomBackgroundImage();

});

function randomBackgroundImage() {
  $('#index-body').css({'background': 'url(../armchairtravel/assets/' + images[Math.floor(Math.random() * images.length)] + ')'});
}


function addIcons() {
  var first = '<i class="fa fa-instagram fa-2x"></i>';
  var second = '<i class="fa fa-wikipedia-w fa-2x"></i>';
  var third = '<i class="fa fa-tripadvisor fa-2x"></i>';
  $('#nav-links li:nth-child(odd)').empty();
  $('#nav-links li:nth-child(1)').addClass('instagram').append(first);
  $('#nav-links li:nth-child(3)').addClass('wiki').append(second);
  $('#nav-links li:nth-child(5)').addClass('trip').append(third);
}

function addNavLinks() {
  var first = 'About';
  var second = 'Help';
  var third = 'Contact';
  $('#nav-links li:nth-child(odd)').empty();
  $('#nav-links li:nth-child(1)').text(first);
  $('#nav-links li:nth-child(3)').text(second);
  $('#nav-links li:nth-child(5)').text(third);

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
    query: locationInput,
    key: key
  };
  url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

  $.getJSON(url, params, function(data){
    initMap(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
  });
}

function initMap(lat, lng){
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {
    center: {lat: lat, lng: lng},
    zoom: 15
  });
  var marker = new google.maps.Marker({
    position: {lat: lat, lng: lng},
    map: map
  });

  var currCenter = map.getCenter();
  google.maps.event.addDomListener(window, 'resize', function() {
    map.setCenter(currCenter);
  })
}


