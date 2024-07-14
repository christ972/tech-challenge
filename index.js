const width = 960;
const height = 500;
  const config = {
  speed: 0.005,
  verticalTilt: -30,
  horizontalTilt: 0
}
let locations = [];
const svg = d3.select('svg')
    .attr('width', width).attr('height', height);
const markerGroup = svg.append('g');
const projection = d3.geoOrthographic();
const initialScale = projection.scale();
const path = d3.geoPath().projection(projection);
const center = [width/2, height/2];

drawGlobe();    
drawGraticule();
enableRotation();    

function drawGlobe() {  
    d3.queue()
        .defer(d3.json, 'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json')          
        .defer(d3.json, 'locations.json')
        .await((error, worldData, locationData) => {
            svg.selectAll(".segment")
                .data(topojson.feature(worldData, worldData.objects.countries).features)
                .enter().append("path")
                .attr("class", "segment")
                .attr("d", path)
                .style("stroke", "#888")
                .style("stroke-width", "1px")
                .style("fill", (d, i) => '#e5e5e5')
                .style("opacity", ".6");
                locations = locationData;
                drawMarkers();                   
        });
}

function drawGraticule() {
    const graticule = d3.geoGraticule()
        .step([10, 10]);

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .style("fill", "#fff")
        .style("stroke", "#ccc");
}

function enableRotation() {
    d3.timer(function (elapsed) {
        projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
        svg.selectAll("path").attr("d", path);
        drawMarkers();
    });
}        

function drawMarkers() {
    const markers = markerGroup.selectAll('circle')
        .data(locations);
    markers
        .enter()
        .append('circle')
        .merge(markers)
        .attr('cx', d => projection([d.longitude, d.latitude])[0])
        .attr('cy', d => projection([d.longitude, d.latitude])[1])
        .attr('fill', d => {
            const coordinate = [d.longitude, d.latitude];
            gdistance = d3.geoDistance(coordinate, projection.invert(center));
            return gdistance > 1.57 ? 'none' : 'steelblue';
        })
        .attr('r', 7);

    markerGroup.each(function () {
        this.parentNode.appendChild(this);
    });
}
var etat = false;
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#theme').onclick = function() {
        if (etat === false) {
            document.querySelector('body').style.backgroundColor = '#121212';
            document.querySelectorAll('h1, h2, h3, p,h5,i').forEach(el => {
                el.style.color = '#ffffff';
            });
            document.querySelectorAll('.card-body,#pro,#do').forEach(ci=>{
                ci.style.backgroundColor='#121212';
            });            
            document.querySelectorAll('label').forEach(l=>{
                l.style.color='blue'
            })
            document.querySelector('#theme-icon').textContent = '🌜';
            etat = true;
        } else {
            document.querySelector('body').style.backgroundColor = 'white';
            document.querySelectorAll('h1, h2, h3, p,h5').forEach(el => {
                el.style.color = '#121212';
            });
            document.querySelectorAll('label,i').forEach(l=>{
                l.style.color='black'
            });
            document.querySelectorAll('.card-body,#do,#pro').forEach(ci=>{
                ci.style.backgroundColor='#ffffff';
            });             document.querySelector('#theme-icon').textContent = '🌞';
            etat = false;
        }
    }
});