class Perceptron {
  constructor(numberOfInputs) {
    this.weights = new Array()
    this.weightRandomStart = -1
    this.weightRandomEnd = 1
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
    var random
    var result
    for (var x = 0; x < this.weightsCount; x++) {
      random = Math.random()
      result = this.weightRandomStart + (random * (this.weightRandomEnd - this.weightRandomStart))
      this.weights[x] = result
    }
  }

  //Oblicza iloczyn wag x danych wejściowych
  calculateValue(inputData) {
    var sum = 0
    for (var x = 0; x < this.weightsCount; x++) {
      sum += inputData.a[x] * this.weights[x]
    }
    return sum
  }

  //Oblicza aktywację perceptronu
  calculateOutput(inputData) {
    var x = this.calculateValue(inputData)
    return this.sigma(x)
  }

  addToWeight(index, value) {
    this.weights[index] = this.weights[index] + value
  }

}
