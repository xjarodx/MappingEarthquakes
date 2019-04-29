
//past month 4.5+ earthquakes
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

d3.json(queryUrl, function(data){
    console.log(data)
    buildMap(data.features);
});

function buildMap(earthquakeData) {

    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: fillColor(feature.properties.mag),
          color: "black",
          weight: 0.6,
          opacity: 0.4,
          fillOpacity: 0.6
        });
        },
  
        // Create popups
        onEachFeature: function (feature, layer) {
          return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}<br><strong>Date/Time:</strong> ${getTime(feature.properties.time)}`);
        }
      });
  
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
      var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
      });    
    
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    var baseMaps = {
      "Dark Map": darkmap,
      "Light Map": lightmap      
    };
  
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    var myMap = L.map("map", {
      center: [
        40.22, -74.75
      ],
      zoom: 3,
      layers: [darkmap, earthquakes]
    });
  
    // Create layer control
    // Pass in baseMaps and overlayMaps
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    
  var legend = L.control({ position: 'bottomright'});
  
    legend.onAdd = function() {
      var div = L.DomUtil.create('div', 'info legend'),
          magnitude = [4,5,6,7,8],
          labels = [];
  
      // loop through density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < magnitude.length; i++) {
          div.innerHTML +=
              '<i style="background:' + fillColor(magnitude[i]) + '"></i> ' +
              magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
      }
      return div;
  };

  legend.addTo(myMap);
    };
  
  // Define colors depending on the magnituge of the earthquake
  function fillColor(magnituge) {
  
      switch (true) {
        case magnituge >= 8.0:
          return 'aliceblue';
          break;
        
        case magnituge >= 7.0:
          return 'lightblue';
          break;
  
        case magnituge >= 6.0:
          return 'LightSkyBlue';
          break;
        
        case magnituge >= 5.0:
          return 'steelblue';
          break;
  
        case magnituge >= 4.0:
          return 'royalblue';
          break;
  
        default:
          return 'darkblue';
      };
  };
  
    function markerSize(magnituge) {
    return magnituge*3;
  };

  function getTime(data){
        var d = new Date(data);
        timeStampCon = d.getDate() + '/' + (d.getMonth()) + '/' + d.getFullYear() + " " + d.getHours() + ':' + d.getMinutes();
        return timeStampCon;
    };

    