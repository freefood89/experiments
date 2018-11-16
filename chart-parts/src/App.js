import * as React from 'react'
import {Chart,Symbol,Path} from '@chart-parts/react'
import {SymbolType} from '@chart-parts/interfaces'
import { Renderer } from '@chart-parts/react-svg-renderer'
import * as d3 from 'd3-force'
import ForceDirected from './ForceDirected';
const renderer = new Renderer()

const nodes = [
  { id : "Alice" },
  { id : "Bob" },
  { id : "Carol" },
]

const links = [
  {"source": 0, "target": 1}, // Alice → Bob
  {"source": 1, "target": 2} // Bob → Carol
]

export default class App extends React.Component {
  state = {
    nodes: [
      { id : "Alice" },
      { id : "Bob" },
      { id : "Carol" },
    ],
    links: [
      { source: 0, target: 1}, // Alice → Bob
      { source: 1, target: 2} // Bob → Carol
    ]
  }

  render() {
    return (
      <React.Fragment>
        <ForceDirected
          height={200}
          width={400}
          links={this.state.links}
          nodes={this.state.nodes}
          />
        <button onClick={() => this.setState({
            nodes: [...this.state.nodes, {id: 'David'}],
            links: [...this.state.links, {source: 0, target: 3}]
          })}
          >
          Add Data
        </button>
      </React.Fragment>
    )
  }
}
