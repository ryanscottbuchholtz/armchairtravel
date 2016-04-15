var travelLocation = '';


$(document).ready(function() {

  $('#search').submit(function(event) {
    event.preventDefault();
    travelLocation = $('#location-input').val();
    $('#location-input').val('');
    console.log(travelLocation);
    $('#question-wrap').hide();
    $('#map').show();
    clearBackground();
    getRequest(travelLocation);
  });

  $('#logo').click(function(){
    replaceBackground();
    $('#question-wrap').show();
    $('#map').hide();
  });

});

function clearBackground(){
  $('#index-body').css('background', 'none')
                  .css('background-color', '#FCFFF5');
}

function replaceBackground(){
  $('#index-body').css('background', "url(../armchairtravel/assets/IMG_3051.jpg)")
                  .css('background-size', 'cover')
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


