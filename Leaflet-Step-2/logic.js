var plates;
var map;
var link = "plates.json"

d3.json(link,function(response) {
    // console.log(response);
    plates = L.geoJSON(response, {
        style: function(feature) {
            return {
                color: "orange",
                fillColor: "white",
                fillOpacity: 0
            }
        },
        onEachFeature: function(feature, layer) {
            console.log(feature.coordinates);
            layer.bindPopup("Plate Name: "+feature.properties.PlateName);
        }
    })

    // Store our API endpoint inside queryUrl
    var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    // Perform a GET request to the query URL
    d3.json(url, function(data) {  
    // console.log(data);
 
    function createCircleMarker(feature, latlng) {
        let options = {
            radius: feature.properties.mag*4,
            fillColor: colorScale(feature.properties.mag),               
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.75,    
        }
        return L.circleMarker(latlng, options);
    }

    var earthQuakes = L.geoJSON(data,{
        onEachFeature: function(feature,layer){
            layer.bindPopup("Place:"+feature.properties.place + "<br> Magnitude: "+feature.properties.mag+"<br> Time: "+new Date(feature.properties.time));
        },
        pointToLayer: createCircleMarker

    });

    createMap(plates,earthQuakes);

    });

    
});    

    // Define layers
    function createMap(plates, earthQuakes) {
        var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.satellite",
            accessToken: API_KEY
        });
        
        var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.light",
            accessToken: API_KEY
        });
  
        var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.outdoors",
            accessToken: API_KEY
        });
    
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors
      };
    
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Fault Lines": plates,
        Earthquakes: earthQuakes
    };

    // Create our map  
    var map = L.map("map", {    
        center: [37.09024, -95.71289],    
        zoom: 3, 
        layers: [satellite, plates, earthQuakes]    
    }); 

    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    var info = L.control({
        position: "bottomright"
    });

    }

// marker size function
function markerSize(magValue) {
    return magValue*3;
};

// color function using ternary conditional
function colorScale(colorValue) {
    return colorValue > 5 ? '#FF3200' :
           colorValue > 4 ? '#FF6C00' :
           colorValue > 3 ? '#FFAD00' :
           colorValue > 2 ? '#FFCC00' :
           colorValue > 1 ? '#FFF700' :
                            '#AAFF00'
};

// add legend
var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend")
    var limits = [0,1,2,3,4,5]

    for (let i = 0; i < limits.length; i++) {
        div.innerHTML +=
        '<i style="background:' + colorScale(limits[i] + 1) + '"></i> ' +
        limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>':'+');
        }
                    
    return div;
};
    
