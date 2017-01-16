//klasa warstwy
class Layer {
  constructor(num, numObject, numberOfInputs) {
    this.inputsCount = numberOfInputs
    this.number = num
    // ilosc perceptronow
    this.numberOfPerceptrons = numObject
    // lista perceptronow
    this.objectsList = new Array()
  }

  init() {
    if (this.numberOfPerceptrons == 0) {
      this.numberOfPerceptrons = Math.floor((Math.random() * (10 - 5 + 1) + 5))
    } else {
      this.numberOfPerceptrons = this.numberOfPerceptrons
    }
    this.createObjects()
  }


  createObjects() {
    for (let x = 0; x < this.numberOfPerceptrons; x++) {
      this.objectsList[x] = new Perceptron(this.inputsCount)
      this.objectsList[x].init()
    }
  }

  // Metoda zwraca wyjścia ( iloczyn skalarny wag x wejść przed zaaplikowaniem funkcji aktywującej sigma)
  getValues(inputData) {
    let outputs = new Array()
    for (let x = 0; x < this.numberOfPerceptrons; x++) {
      outputs[x] = this.objectsList[x].calculateValue(inputData)
    }
    return new dataOutput(outputs)
  }

  //Metoda zwraca wyjścia ze wszystkich perceptronów po zaaplikowaniu funkcji aktywującej
  getOutputs(inputData, index) {
    let outputs = new Array()
    for (let x = 0; x < this.numberOfPerceptrons; x++) {
      outputs[x] = this.objectsList[x].calculateOutput(inputData)
    }
    return new dataOutput(outputs)
  }

}
