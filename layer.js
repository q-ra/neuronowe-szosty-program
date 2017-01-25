
class Layer {
  constructor(num, numObject, numberOfInputs) {
    this.inputsCount = numberOfInputs 
    this.number = num 
    this.numberOfPerceptrons = numObject 
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
