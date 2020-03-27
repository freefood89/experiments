const angle = 2 * Math.PI
let x = 20
let canvas = null
let context = null

const handleClick = (message) => {
  x += 5
  render()
  postMessage('x: ' + x)
}

const loadCanvas = (message) => {
  canvas = message.canvas
  context = canvas.getContext('2d')
  render()
}

const render = () => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = 'gray'

  context.beginPath()
  context.arc(20, x, 5, 0, angle)
  context.fill()
}

onmessage = function(event) {
  switch(event.data.type) {
    case 'SEND_CANVAS':
      return loadCanvas(event.data)
    case 'CLICK':
      return handleClick()
    default:
      console.error('worker doesnt understand')
  }
}
 