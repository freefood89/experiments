import * as React from 'react';
import {Viz} from './Viz'
import data from './data.json'
import * as d3 from 'd3'

const App = () => {
  const draw = (svg, data, rootEl) => {
    const { links, nodes } = data
    const { clientWidth, clientHeight } = rootEl
    console.log(rootEl)
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

    const container = svg.append('g')

    const link = container.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = container.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", 5)
        .attr("fill", color)
        .call(drag(simulation));
    
    svg.call(
      d3.zoom()
        .scaleExtent([1/2, 2])
        .on('zoom', function handleZoom() {
          container.attr('transform', d3.zoomTransform(this).toString())
        })
      )

    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
  
      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);

    })
  }

  return (
    <Viz 
      data={data}
      draw={draw}
    />
  )
}

export default App
