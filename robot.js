
class Robot {
  constructor() {
    this.examples = []
    this.positionArm
    this.network
    this.a = 75
    this.b = 75
    this.x = 0
    this.y = 200
    this.examplesCount = 2500
    this.learningIterations = 150000
    this.positionArm = new PositionArm(this.a, this.b, this.x, this.y)
    this.network = new Network(4, 5, 2, 2)
    this.randomLearningExamples()
    this.learnNetwork()
  }

  learnNetwork() {
    let example
    let error = 0
    for (let i = 0; i < this.learningIterations; i += 1) {
      let count = Math.floor((Math.random() * this.examples.length))
      example = this.examples[count]
      this.network.learn(example)

      if (i % 2000 == 0) {
        error = this.network.getError(this.examples)
        console.log("Err: " + error)
      }

    }

  }


  randomLearningExamples() {
    while (this.examples.length <= this.examplesCount) {

      let alpha = Math.random() * Math.PI
      let beta = Math.random() * Math.PI

      let learningExample = this.positionArm.calculatePositionArm(alpha, beta)


      if (this.positionArm.x2 < this.a + this.b &&
        this.positionArm.y2 < (this.a + this.b + this.y) &&
        this.positionArm.y2 > 50 &&
        this.positionArm.x2 > 0 &&
        this.positionArm.alpha > 0 && this.positionArm.alpha < Math.PI &&
        this.positionArm.beta > 0 && this.positionArm.beta < Math.PI) {
        this.examples.push(learningExample)
      }

    }
  }


  updateHand(coord) {

    let normalize = []
    normalize[0] = (coord.x - this.x) / (this.a + this.b) - 0.2
    normalize[1] = (coord.y - this.y) / (this.a + this.b) - 0.2
    let inputData = new dataInput(normalize)

    let outputData = this.network.getOutputFromInput(inputData)

    let inputAlpha = 0
    let inputBeta = 0
    inputAlpha = (outputData.b[0] - 0.2) / 0.6 * Math.PI
    inputBeta = (outputData.b[1] - 0.2) / 0.6 * Math.PI

    this.positionArm.calculatePositionArm(inputAlpha, inputBeta)


    let svg = $('#svg').svg('get')
    svg.clear()
    svg.circle(coord.x, coord.y, 1, {
      fill: 'none',
      stroke: 'red',
      strokeWidth: 4
    })
    lines[0] = svg.line(this.positionArm.x0, this.positionArm.y0, this.positionArm.x1, this.positionArm.y1, {
      stroke: 'grey'
    })
    lines[1] = svg.line(this.positionArm.x1, this.positionArm.y1, this.positionArm.x2, this.positionArm.y2, {
      stroke: 'grey'
    })
    let arm = svg.circle(this.positionArm.x1, this.positionArm.y1, 1, {
      fill: 'none',
      stroke: 'red',
      strokeWidth: 4
    })
    let end = svg.circle(this.positionArm.x2, this.positionArm.y2, 1, {
      fill: 'none',
      stroke: 'black',
      strokeWidth: 10
    })

  }

}
