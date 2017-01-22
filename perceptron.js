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

  //Pochodna funkcji sigma
  sigmaDerivative(x) {
    return this.sigma(x) * (1 - this.sigma(x))
  }

  //Losujemy małe wagi
  randomWeights() {
    for (let x = 0; x < this.weightsCount; x += 1) {
      this.weights[x] = Math.random()
    }
  }

  //Oblicza iloczyn wag x danych wejściowych
  calculateValue(inputData) {
    let sum = 0
    for (let x = 0; x < this.weightsCount; x += 1) {
      sum += inputData.a[x] * this.weights[x]
    }
    return sum
  }

  //Oblicza aktywację perceptronu
  calculateOutput(inputData) {
    return this.sigma(this.calculateValue(inputData))
  }

  addToWeight(index, value) {
    this.weights[index] += value
  }

}
