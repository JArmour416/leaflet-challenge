// Store our API endpoint inside queryUrl
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

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

// Create our map, giving it the streetmap and earthquakes layers to display on load  
var map = L.map("map", {    
    center: [37.09, -95.71],    
    zoom: 5,     
}); 

// Add tile layer
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {    
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",    
        maxZoom: 18,    
        id: "mapbox.light",    
        accessToken: API_KEY  
    }).addTo(map); 

// Perform a GET request to the query URL
d3.json(url, data => {  
    console.log(data.features[0].properties.mag)
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker((feature, latlng), {
                fillOpacity: 0.75,
                color: "black",
                weight: 1,
                fillColor: colorScale(feature.properties.mag),
                radius: markerSize(feature.properties.mag)
            });
        },
        onEachFeature: function (feature, layer) {
        layer.bindPopup(`<p>
        Magnitude: ${feature.properties.mag} <br>
        Type: ${feature.properties.type} <br>
        Time: ${new Date(feature.properties.time)} <br>
        Place: ${feature.properties.place} <br>
        Latitude: ${feature.geometry.coordinates[1]} <br>
        Longitude: ${feature.geometry.coordinates[0]} <br>
        <a href="${feature.properties.url}" target="_blank"><Click To View USGS Map Details</a> <br>
        <a href="${feature.properties.detail}" target="_blank">Click for More Details (JSON)</a>
        </p>`);
        }
    }).addTo(map);
});

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
legend.addTo(map);
