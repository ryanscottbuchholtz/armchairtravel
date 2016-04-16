var travelLocation = '';

var images = ['IMG_3051.jpg', 'IMG_3055.jpg', 'IMG_3056.jpg', 'IMG_3063.jpg', 'IMG_3067.jpg', 'IMG_3069.jpg', 'IMG_3070.jpg', 'IMG_3071.jpg'];


$(document).ready(function() {

  autoPlaces();

  $('#logo').click(function(){
    replaceBackground();
    $('#question-wrap').show();
    $('#map').hide();
    addNavLinks();
  });

  $(document).on('click', '.wiki', function(){   //due to 'created' element
    getWiki(lat, lng);
  });

  randomBackgroundImage();
});

function randomBackgroundImage() {
  $('#index-body').css({'background': 'url(../armchairtravel/assets/' + images[Math.floor(Math.random() * images.length)] + ') no-repeat'});
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
    console.log(data);
  });
}

function getWiki(lat, lng) {
  var params = {
    prop: 'coordinates|pageimages|pageterms',
    colimit: 50,
    piprop: 'thumbnail',
    pithumbsize: 144,
    pilimit: 50,
    format: 'json',
    wbptterms: 'description',
    generator: 'geosearch',
    ggscoord: lat + '|' + lng,
    ggsradius: 10000,
    ggslimit: 100
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
            position: {lat: object.coordinates[0].lat, lng: object.coordinates[0].lon},
            map: map,
            title: object.title,
            url: "http:en.wikipedia.org/wiki?curid=" + object.pageid
            })
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
    map: map
  });

  var currCenter = map.getCenter();
  google.maps.event.addDomListener(window, 'resize', function() {
    map.setCenter(currCenter);
  })

}

function autoPlaces() {
  var input = document.getElementById('location-input');
  var searchBox = new google.maps.places.SearchBox(input);

  searchBox.addListener('places_changed', function() {
    // $('#search').submit(function(event) {
    // event.preventDefault();
    travelLocation = $('#location-input').val();
    $('#location-input').val('');
    $('#question-wrap').hide();
    $('#map').show();
    clearBackground();
    addIcons();
    getRequest(travelLocation);
  });
}

