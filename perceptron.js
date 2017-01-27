class Perceptron {
  constructor(weightsCount) {
    this.weights = []
    this.weightsCount = weightsCount
    this.randomWeights()
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
    return sigma(this.calculateValue(inputData))
  }


  addToWeight(index, value) {
    this.weights[index] += value
  }

}
