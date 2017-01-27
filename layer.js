
class Layer {
  constructor(num, numberOfPerceptrons, inputsCount) {
    this.inputsCount = inputsCount
    this.number = num
    this.numberOfPerceptrons = numberOfPerceptrons
    this.objectsList = []
    this.createObjects()
  }

  createObjects() {
    for (let x = 0; x < this.numberOfPerceptrons; x += 1) {
      this.objectsList[x] = new Perceptron(this.inputsCount)
    }
  }


  getValues(inputData) {
    let outputs = []
    for (let x = 0; x < this.numberOfPerceptrons; x += 1) {
      outputs[x] = this.objectsList[x].calculateValue(inputData)
    }
    return new dataOutput(outputs)
  }


  getOutputs(inputData, index) {
    let outputs = []
    for (let x = 0; x < this.numberOfPerceptrons; x += 1) {
      outputs[x] = this.objectsList[x].calculateOutput(inputData)
    }
    return new dataOutput(outputs)
  }

}
