let sizeof = 50
let lines = []
let arm
let end

function initializeWindow(sizeof) {
  $('#svg').svg()
  let svg = $('#svg').svg('get')
  let arms = svg.group({
    strokeWidth: 2
  })
}

$(document).ready(function () {

  initializeWindow(sizeof)

  let svg = $('#svg').svg('get')
  lines[0] = svg.line(0, 200, 75, 200, {
    stroke: 'grey'
  })
  lines[1] = svg.line(75, 200, 150, 200, {
    stroke: 'grey'
  })
  arm = svg.circle(75, 200, 1, {
    fill: 'none',
    stroke: 'red',
    strokeWidth: 4
  })
  end = svg.circle(150, 200, 1, {
    fill: 'none',
    stroke: 'black',
    strokeWidth: 10
  })

  let SVGpunkt = []
  let punkt = []
  let count = 0

  function getMousePos(canvas, evt) {
    return {
      x: evt.clientX - 160,
      y: evt.clientY - 105
    }
  }
  $("svg").click(function (e) {
    let coord = getMousePos(svg, e)
    robot.updateHand(coord)
    count += 1
  })

  let robot = new Robot()
})


function dataInput(data) {

  this.a = []
  for (let i = 0; i < data.length; i += 1) {
    this.a[i] = data[i]
  }
}


function dataOutput(data) {
  this.b = []
  for (let i = 0; i < data.length; i += 1) {
    this.b[i] = data[i]
  }
}



function LearningExample(ini, out, exc) {
  this.input = ini
  this.output = out
  this.expectedValue = exc

}
