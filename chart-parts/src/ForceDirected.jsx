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
    const { nodes, links, width, height } = this.props

		simulation.force('center', d3.forceCenter(width/2, height/2))
		simulation.force('charge', d3.forceManyBody())
    simulation.stop()
		simulation.on('tick',
			() => {
        simulation.nodes().reduce(
					(obj, node) => ({
            ...obj,
            [node.id]: node,
          })
        )
        this.setState({})
      }
    )

    if ( nodes || links ) {
      this.setState({
        nodes: [...nodes],
        links: [...links]
      })
    }
	}

  componentDidUpdate(prevProps, prevState) {
    const { state, props } = this
    if (state.nodes !== prevState.nodes || state.links !== prevState.links) {
      this.simulation.nodes(state.nodes)
      this.simulation.force('link', d3.forceLink(state.links))
      this.simulation.restart()
      return
    }

    if (props.nodes !== prevProps.nodes || props.links !== prevProps.links) {
      this.setState({
        nodes: [...props.nodes],
        links: [...props.links]
      })
      this.simulation.restart()
    }
  }

	componentWillUnmount() {
		const { simulation } = this
		simulation.on('tick', null)
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
					path={({ d }) => `M 0,0 L ${(d.target.x - d.source.x) || 0},${(d.target.y - d.source.y) || 0}`}
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
