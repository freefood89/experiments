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
  render() {
    return (
      <ForceDirected
        height={200}
        width={400}
        links={links}
        node={nodes}
        />
    )
  }
}
