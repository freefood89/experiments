import * as React from 'react'
import CanvasWorker from 'web-worker:./GraphService/worker'

import {clickEvent} from './GraphService/messages/clickEvent'
import {initializeCanvas} from './GraphService/messages/initializeCanvas'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      response: ''
    }
    this.canvas = React.createRef()
    this.handleClick = this.handleClick.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }


  componentDidMount() {
    // this.worker = new Worker('worker.js')
    this.worker = new CanvasWorker()
    this.worker.onmessage = (event) => {
      console.log('Message received from worker script')
      console.log('data: ' + event.data)
      this.setState({ response: event.data })
    }

    const offscreen = this.canvas.current.transferControlToOffscreen()
    // FIXME: hmmm. the api is not nice here worker can be hidden 
    this.worker.postMessage(initializeCanvas(offscreen), [offscreen])

  }

  componentWillUnmount() {
    this.worker.terminate()
  }

  dispatch(action) {
    this.worker.postMessage(action)
  }

  handleClick(e) {
    this.dispatch(clickEvent({
      x: e.clientX,
      y: e.clientY,
    }))
  }

  render() {
    return (
      <div>
        {/* <button onClick={this.communicate}>
          communicate
        </button>
        <p>{this.state.response}</p> */}
        <canvas 
          onClick={this.handleClick}
          ref={this.canvas}
          width="500"
          height="500"
        ></canvas>
      </div>
    )
  }
}
