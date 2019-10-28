import * as React from 'react';
import {Viz} from './Viz'
import data from './data.json'
import * as d3 from 'd3'

const App = () => {
  // const draw = (svg, data, rootEl) => {
  //   const { links, nodes } = data
  //   const { clientWidth, clientHeight } = rootEl

  //   const scale = d3.scaleOrdinal(d3.schemeCategory10);
  //   const color = d => scale(d.group);
  //   const drag = simulation => {
  //     function dragstarted(d) {
  //       if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  //       d.fx = d.x;
  //       d.fy = d.y;
  //     }
      
  //     function dragged(d) {
  //       d.fx = d3.event.x;
  //       d.fy = d3.event.y;
  //     }
      
  //     function dragended(d) {
  //       if (!d3.event.active) simulation.alphaTarget(0);
  //       d.fx = null;
  //       d.fy = null;
  //     }
      
  //     return d3.drag()
  //       .on("start", dragstarted)
  //       .on("drag", dragged)
  //       .on("end", dragended);
  //   }
      
  //   const simulation = d3.forceSimulation(nodes)
  //     .force("link", d3.forceLink(links).id(d => d.id))
  //     .force("charge", d3.forceManyBody())
  //     .force("center", d3.forceCenter(0, 0));

  //   const container = svg.append('g')

  //   const link = container.append("g")
  //       .attr("stroke", "#999")
  //       .attr("stroke-opacity", 0.6)
  //     .selectAll("line")
  //     .data(links)
  //     .join("line")
  //       .attr("stroke-width", d => Math.sqrt(d.value));

  //   const node = container.append("g")
  //       .attr("stroke", "#fff")
  //       .attr("stroke-width", 1.5)
  //     .selectAll("circle")
  //     .data(nodes)
  //     .join("circle")
  //       .attr("r", 5)
  //       .attr("fill", color)
  //       .call(drag(simulation));
    

  //   const fps = container.append('text')
  //       .text(`FPS:`)
  //       .attr('x', -clientWidth/2)
  //       .attr('y', -clientHeight/2 + 16)
  //       .attr("text-anchor", 'left')
  //       .attr('font-size', '16px')

  //   svg.call(
  //     d3.zoom()
  //       .scaleExtent([1/2, 2])
  //       .on('zoom', function handleZoom() {
  //         container.attr('transform', d3.zoomTransform(this).toString())
  //       })
  //     )

  //   let t0 = new Date()

  //   simulation.on("tick", () => {
  //     link
  //         .attr("x1", d => d.source.x)
  //         .attr("y1", d => d.source.y)
  //         .attr("x2", d => d.target.x)
  //         .attr("y2", d => d.target.y);
  
  //     node
  //         .attr("cx", d => d.x)
  //         .attr("cy", d => d.y);

  //     const t1 = new Date()
  //     fps.text(`FPS: ${Math.round(1000 / (t1 - t0))}`)
  //     t0 = t1
  //   })
  // }

  const draw = (canvas, data, rootEl) => {
    const { links, nodes } = data
    const { clientWidth: width , clientHeight: height } = rootEl

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

    const context = canvas.node().getContext("2d")
    // context.fillStyle = "steelblue";
    // context.strokeStyle = "#666";
    // context.strokeWidth = 1.5;

    // const container = svg.append('g')

    // const link = container.append("g")
    //     .attr("stroke", "#999")
    //     .attr("stroke-opacity", 0.6)
    //   .selectAll("line")
    //   .data(links)
    //   .join("line")
    //     .attr("stroke-width", d => Math.sqrt(d.value));

    var x = d3.scaleLinear()
      .range([0, width])
      .domain([-width/2, width/2]);

    var y = d3.scaleLinear()
      .range([0, height])
      .domain([-height/2, height/2]);

    const angle = 2 * Math.PI

    context.clearRect(0, 0, width, height)
    
    // data.links.forEach(data => {
    //   context.beginPath()
    //   con
    // })

    // const node = container.append("g")
    //     .attr("stroke", "#fff")
    //     .attr("stroke-width", 1.5)
    //   .selectAll("circle")
    //   .data(nodes)
    //   .join("circle")
    //     .attr("r", 5)
    //     .attr("fill", color)
    //     .call(drag(simulation));
    

    // const fps = container.append('text')
    //     .text(`FPS:`)
    //     .attr('x', -clientWidth/2)
    //     .attr('y', -clientHeight/2 + 16)
    //     .attr("text-anchor", 'left')
    //     .attr('font-size', '16px')
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


  return (
    <Viz 
      data={data}
      draw={draw}
    />
  )
}

export default App
