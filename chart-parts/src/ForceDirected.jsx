import * as React from 'react'
import {Chart,Symbol,Path} from '@chart-parts/react'
import {SymbolType} from '@chart-parts/interfaces'
import { Renderer } from '@chart-parts/react-svg-renderer'
import * as d3 from 'd3-force'

const renderer = new Renderer()

export default class ForceDirected extends React.Component {
	simulation = d3.forceSimulation()
	state = {
    nodes: null,
    links: null,
	}

	componentDidMount() {
    const { simulation } = this
    const { width, height } = this.props

		simulation.force('center', d3.forceCenter(width/2, height/2))
		simulation.force('charge', d3.forceManyBody())

		// simulation.nodes(data)
		// simulation.on('tick',
		// 	() => this.setState({
		// 		nodePositions: simulation.nodes().map(x => {console.log(x); return x}).reduce(
		// 			(obj, node) => Object.assign(obj, {
		// 					[node.id]: node,
		// 				}),
		// 			{}
		// 		)
		// 	})
		// )

    // simulation.force('link', d3.forceLink(links))
    simulation.stop()
	}

  componentDidUpdate() {
    const { nodes, links } = this.state
    if (nodes === null && links === null) {
      this.setState({
        nodes: [...this.props.nodes],
        links: [...this.props.links]
      })
      this.simulation.restart()
    }
  }

	componentWillUnmount() {
		const { simulation } = this
		simulation.on('tick', null)
	}

  startSimulation() {

  }

  render() {
    const { nodes, links } = this.state
    const { width, height } = this.props
    return (
      <Chart
        width={width}
        height={height}
        renderer={renderer}
        data={{ nodes, links }}
        title="Bar Chart"
        description="An example bar chart"
      >
				{links && <Path
					table='links'
					stroke={'#aaa'}
					strokeWidth={1}
					x={({ d }) => d.source.x }
					y={({ d }) => d.source.y }
					path={({ d }) => `M 0,0 L ${d.target.x - d.source.x},${d.target.y - d.source.y}`}
					x2={({ d }) => d.target.x }
					y2={({ d }) => d.target.y }
					/>}
				{nodes && <Symbol
					table='nodes'
					shape={SymbolType.Circle}
					size={400}
					x={({ d }) => d.x}
					y={({ d }) => d.y}
					fill={({ index }) => 'steelblue'}
					/>}
      </Chart>
    )
  }
}
