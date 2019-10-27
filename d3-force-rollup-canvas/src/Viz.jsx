import * as React from 'react'
import * as d3 from 'd3'

export class Viz extends React.Component {
  constructor() {
    super()
    this.root = React.createRef()
    this.svg = null
    this.id = 'graph'
  }

  componentDidMount() {
    this.init()
    this.resize()
    this.props.draw(this.svg, this.props.data, this.root.current)
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  componentDidUpdate() {
    this.props.draw(this.svg, this.props.data, this.root.current)
  }

  init() {
    const {
      clientWidth: width,
      clientHeight: height,
    } = this.root.current

    // Clear existing viz
    d3.select(`#${this.id}`)
      .selectAll('svg')
      .remove()

    this.svg = d3.select(`#${this.id}`)
      .append('svg')
      .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)

    // const container = this.svg
    //   .append('g')

    // container.append("g")
    //   .attr("stroke", "#999")
    //   .attr("stroke-opacity", 1)
    //   .attr("stroke-width", 1)
    //   .attr("fill", "#999")
    //   .attr("fill-opacity", 1)
    //   .attr('id', LINK_GROUP_ID)

    // container.append("g")
    //   .attr('id', NODE_GROUP_ID)

    // this._svg.call(
    //   d3.zoom()
    //     .scaleExtent([1/2, 2])
    //     .on('zoom', function handleZoom() {
    //       container.attr('transform', d3.zoomTransform(this).toString())
    //     })
    //   )
  }

  resize() {
    if (this.svg) {
      const {
        clientWidth,
        clientHeight
      } = this.root.current
  
      this.svg
        .attr('width', clientWidth)
        .attr('height', clientHeight)
        .attr('viewBox', `${-clientWidth / 2} ${-clientHeight / 2} ${clientWidth} ${clientHeight}`)
    }
  }

  render() {
    return (
      <div
        ref={this.root}
        id={this.id}
        style={{
          width: '100%',
          height: 500
        }}
      />
    )
  }
}
