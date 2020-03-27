import data from './data.json'
import * as d3 from 'd3'
import {INITIALIZE_CANVAS} from './messages/initializeCanvas'
import {CLICK_EVENT} from './messages/clickEvent'

const angle = 2 * Math.PI
let x = 20
let canvas = null
let context = null

/**
 * FIXME: should be able to define handlers with actions 
 * State has to be passed into it like redux
 */

const handleClick = (message) => {
  // x += 5
  const { x, y } = message.event
  // render()
  postMessage(`clicked: ${x}, ${y}`)
}

const loadCanvas = (message) => {
  canvas = message.canvas
  context = canvas.getContext('2d')
  render()
}

const render = () => {
  const { links, nodes } = data
  const { width, height } = canvas

  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  const color = d => scale(d.group);
  const drag = simulation => {
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
    
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(0, 0));

  var x = d3.scaleLinear()
    .range([0, width])
    .domain([-width/2, width/2]);

  var y = d3.scaleLinear()
    .range([0, height])
    .domain([-height/2, height/2]);

  const angle = 2 * Math.PI

  context.clearRect(0, 0, width, height)
  
  let transform = d3.zoomIdentity

  d3.select(context.canvas).call(d3.zoom()
    .scaleExtent([1/2, 2])
    .on("zoom", () => {
      transform = d3.event.transform
      zoomed()
    }))

  function zoomed() {
    context.save()
    context.clearRect(0, 0, width, height)
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);

    links.forEach(d => {
      context.strokeStyle = `rgba(153, 153, 153, 0.6)`

      context.beginPath()
      context.moveTo(x(d.source.x), y(d.source.y))
      context.lineTo(x(d.target.x), y(d.target.y))
      context.stroke()
    })

    nodes.forEach(d => {
      context.fillStyle = color(d)

      context.beginPath()
      context.arc(x(d.x), y(d.y), 5, 0, angle)
      context.fill()
    })

    context.restore()
  }

  let t0 = new Date()

  simulation.on("tick", () => {
    zoomed()

    const t1 = new Date()
    // fps.text(`FPS: ${Math.round(1000 / (t1 - t0))}`)
    t0 = t1
  })
}

// const render = () => {
//   context.clearRect(0, 0, canvas.width, canvas.height)
//   context.fillStyle = 'gray'

//   context.beginPath()
//   context.arc(20, x, 5, 0, angle)
//   context.fill()
// }

onmessage = function(event) {
  console.log(event.data)
  switch(event.data.type) {
    case INITIALIZE_CANVAS:
      return loadCanvas(event.data)
    case CLICK_EVENT:
      return handleClick(event.data)
    default:
      console.error('worker doesnt understand')
  }
}
 