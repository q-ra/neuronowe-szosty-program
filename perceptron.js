class Perceptron {
  constructor(numberOfInputs) {
    this.weights = []
    this.weightsCount = numberOfInputs
  }


  init() {
    this.randomWeights()
  }



  sigma(x) {
    return 1 / (1 + Math.exp(-x))
  }


  sigmaDerivative(x) {
    return this.sigma(x) * (1 - this.sigma(x))
  }


  randomWeights() {
    for (let x = 0; x < this.weightsCount; x += 1) {
      this.weights[x] = Math.random()
    }
  }



  calculateValue(inputData) {
    let sum = 0
    for (let x = 0; x < this.weightsCount; x += 1) {
      sum += inputData.a[x] * this.weights[x]
    }
    return sum
  }


  calculateOutput(inputData) {
    return this.sigma(this.calculateValue(inputData))
  }


  addToWeight(index, value) {
    this.weights[index] += value
  }

}
