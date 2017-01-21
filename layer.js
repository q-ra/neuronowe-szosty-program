//klasa warstwy
class Layer {
  constructor(num, numObject, numberOfInputs) {
    this.inputsCount = numberOfInputs
    this.number = num
    // ilosc perceptronow
    this.numberOfPerceptrons = numObject
    // lista perceptronow
    this.objectsList = []
  }

  init() {
    this.createObjects()
  }

  createObjects() {
    for (let x = 0; x < this.numberOfPerceptrons; x += 1) {
      this.objectsList[x] = new Perceptron(this.inputsCount)
      this.objectsList[x].init()
    }
  }

  // Metoda zwraca wyjścia ( iloczyn skalarny wag x wejść przed zaaplikowaniem funkcji aktywującej sigma)
  getValues(inputData) {
    let outputs = []
    for (let x = 0; x < this.numberOfPerceptrons; x += 1) {
      outputs[x] = this.objectsList[x].calculateValue(inputData)
    }
    return new dataOutput(outputs)
  }

  //Metoda zwraca wyjścia ze wszystkich perceptronów po zaaplikowaniu funkcji aktywującej
  getOutputs(inputData, index) {
    let outputs = []
    for (let x = 0; x < this.numberOfPerceptrons; x += 1) {
      outputs[x] = this.objectsList[x].calculateOutput(inputData)
    }
    return new dataOutput(outputs)
  }

}
