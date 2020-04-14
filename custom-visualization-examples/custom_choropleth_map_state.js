var _this = this;

d3.json("https://raw.githubusercontent.com/python-visualization/folium/master/tests/us-counties.json", function (data) {
    _this.counties = data;
    // {"type":"Feature","id":"6075","properties":{"name":"San Francisco"},"geometry":{"type":"Polygon","coordinates":[[[-122.428146,37.706788],[-122.504823,37.706788],[-122.389807,37.706788],[-122.428146,37.706788]]]}}
    L.geoJson(_this.counties, {style: style, onEachFeature: onEachFeature}).addTo(map);
});

finalData = {};
let row, max, min;

for (let i = 0; i < data.length; i++) {
    row = data[i];
    let val = row.values*1.0;
    if (!max) {
        max = val;
        min = val;
    } else if (val > max) {
        max = val;
    } else if (val < min) {
        min = val;
    }
    finalData[+row.fips] = row;
}


// the function for setting the style
function style(feature) {
    var colorScaleExp = "white";
    //if geometry is defined, get the color from the d3 RdPu colormap
    if (finalData[+feature.id] !== undefined) {
        var scale = d3.scaleLinear()
            .domain([min, max])
            .range([0, 1]);

        colorScaleExp=d3.interpolateReds(scale(finalData[+feature.id].values));

    }
    return {
        fillColor: colorScaleExp,
        color: "lightred",
        weight: 1,
        fillOpacity: 0.75
    };
}

function drilldown(e){
        var popLocation= e.latlng;
        // var widgetId = e.target).parents('.widget').attr('data-id');
        var widgetId= e.target.getContainer().querySelectorAll('.widget');

        var tmp =  e.currentTarget.dataset.location;
        //.parentNode.querySelectorAll('.widget');
        var elData = JSON.parse($(e.currentTarget).attr('data-location'));
        // var data = (elData[3] && elData[3].row) ? elData[3].row : elData[4].row;

        drilldownProxy.trigger('drilldown', data, widgetId, data);
        var popup = L.popup()
            .setLatLng(popLocation)
            .setContent('<p>Hello world!<br />This is a nice popup.</p>')
            .openOn(map);

}
// Define a function that will get called for each geometry feature
// This will add a Popup feature for each feature
function onEachFeature(feature, layer) {
    if (finalData[+feature.id] !== undefined) {

        var row = finalData[+feature.id];

        let value = finalData[+feature.id].values;

        // define the popup content
        let content = `<div>County Name: ${feature.properties.name}</div>
                          <div>Value: ${value}</div>`

        // bind the popup to the layer
        layer.bindPopup(content, {'offset': L.point(0, -50)});

        layer.on('mouseover', function (e) {
            this.openPopup();
        });
        layer.on('mouseout', function (e) {
            this.closePopup();
        });

        //bind click
        layer.on({
            click: drilldown
        });
    }
}


// {"type":"Feature","id":"6075","properties":{"name":"San Francisco"},"geometry":{"type":"Polygon","coordinates":[[[-122.428146,37.706788],[-122.504823,37.706788],[-122.389807,37.706788],[-122.428146,37.706788]]]}},

