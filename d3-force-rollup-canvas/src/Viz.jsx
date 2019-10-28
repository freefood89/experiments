import * as React from 'react'
import * as d3 from 'd3'

export class Viz extends React.Component {
  constructor() {
    super()
    this.root = React.createRef()
    this.svg = null
    this.canvas = null
    this.id = 'graph'
  }

  componentDidMount() {
    this.init()
    this.resize()
    // this.props.draw(this.svg, this.props.data, this.root.current)
    this.props.draw(this.canvas, this.props.data, this.root.current)
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  componentDidUpdate() {
    // this.props.draw(this.svg, this.props.data, this.root.current)
    this.props.draw(this.canvas, this.props.data, this.root.current)
  }

  init() {
    const {
      clientWidth: width,
      clientHeight: height,
    } = this.root.current

    // Clear existing viz
    // d3.select(`#${this.id}`)
    //   .selectAll('svg')
    //   .remove()

    // this.svg = d3.select(`#${this.id}`)
    //   .append('svg')
    //   .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)

    this.canvas = d3.select(`#${this.id}`)
      .append("canvas")
        .attr("width", width)
        .attr("height", height);
  }

  resize() {
    const {
      clientWidth,
      clientHeight
    } = this.root.current

    if (this.svg) {
      this.svg
        .attr('width', clientWidth)
        .attr('height', clientHeight)
        .attr('viewBox', `${-clientWidth / 2} ${-clientHeight / 2} ${clientWidth} ${clientHeight}`)
    } else if (this.canvas) {
      this.canvas
        .attr('width', clientWidth)
        .attr('height', clientHeight)
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
