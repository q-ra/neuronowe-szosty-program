class PositionArm {
  constructor(a, b, x0, y0) {
    this.a = a
    this.b = b
    this.x0 = x0
    this.y0 = y0
    this.alpha = 0
    this.beta = 0
    this.x1 = 0
    this.y1 = 0
    this.x2 = 0
    this.y2 = 0
    this.piHalf = Math.PI / 2
  }
  // wylicza polozenie lokcia i dloni dla zadanych katow z przedzialu (0, PI)
  calculatePosition(inputAlpha, inputBeta) {
    this.alpha = inputAlpha
    this.beta = inputBeta

    if (this.alpha >= this.piHalf) {
      this.x1 = this.x0 + this.a * Math.cos(this.alpha - this.piHalf)
      this.y1 = this.y0 - this.a * Math.sin(this.alpha - this.piHalf)
    } else {
      this.x1 = this.x0 + this.a * Math.cos(this.piHalf - this.alpha)
      this.y1 = this.y0 + this.a * Math.sin(this.piHalf - this.alpha)
    }

    let alphaTmp = this.alpha + this.beta + this.piHalf
    this.x2 = this.x1 + this.b * Math.cos(alphaTmp)
    this.y2 = this.y1 - this.b * Math.sin(alphaTmp)

    return this.normalize()
  }

  // zwraca znormalizowane wejscie do obrobki przez siec warstwowa (N=2, M=2)
  normalize() {
    // wyjscie
    let output = []
    output[0] = this.alpha / Math.PI * 0.6 + 0.2
    output[1] = this.beta / Math.PI * 0.6 + 0.2
    output = new dataOutput(output)
    // wejscie
    let input = []
    input[0] = (this.x2 - this.x0) / (this.a + this.b) - 0.2
    input[1] = (this.y2 - this.y0) / (this.a + this.b) - 0.2
    input = new dataInput(input)

    let learningExample = new LearningExample(input, output, 1)
    return learningExample
  }

}
