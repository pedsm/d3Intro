
const MIN_ZOOM = 0.1
const MAX_ZOOM = 7
const zoomed = (...a) => { circles.attr('transform', d3.event.transform) }
const zoom = d3.zoom()
    .scaleExtent([MIN_ZOOM, MAX_ZOOM])
    .on('zoom', zoomed)
const svg = d3.select('svg')
    .attr('width', 800)
    .attr('height', 800)
    .call(zoom)
let circles = null

d3.json('./eprints-articles.json')
    .then((data) => {
        draw(data)
    })
    .catch(err => console.error(err))

function draw(dataIn) {
    const divisions = new Set()
    for(paper of dataIn) {
        divisions.add(...paper.divisions)
    }
    console.log([...divisions])
    const data = dataIn.slice(0,1000)
    // console.log(data)
    const simulation = d3.forceSimulation()
        //.force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("collision", d3.forceCollide(d =>  d.authors.length * 5))
        .force('x', d3.forceX(800/2))
        .force('y', d3.forceY(800/2))

    circles = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .attr("r", 5)
        .data(data)
        .enter()
        .append('circle')
        .attr('fill', 'black')
        .attr('stroke', 'white')
        .attr('r', d => d.authors.length * 5)
        .attr('fill', d => d3.schemeCategory10[[...divisions].indexOf(d.divisions[0]) % 10])
    
    circles.append('title')
        .text(d => d.title + '//' + d.authors.length)

    simulation
        .nodes(data)
        .on('tick', ticked)

    function ticked() {
        circles        
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
    }
}
