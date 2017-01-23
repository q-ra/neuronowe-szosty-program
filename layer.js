//klasa warstwy
class Layer {
  constructor(num, numObject, numberOfInputs) {
    this.inputsCount = numberOfInputs // ilosc wejsc do perceptronow
    this.number = num // numer warstwy
    this.numberOfPerceptrons = numObject // ilosc perceptronow
    this.objectsList = []   // lista perceptronow
  }

  init() {
    this.createObjects() // Tworzenie perceptronow
  }

	//Funkcja tworzaca perceptrony w danej wartstwie. Wywoluje init na perceptronie by od razu wylosowac w nim wagi.
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
      outputs[x] = this.objectsList[x].calculateValue(inputData) //oblicza sumę dla każdego perceptronu
    }
    return new dataOutput(outputs)
  }

  //Metoda zwraca wyjścia ze wszystkich perceptronów po zaaplikowaniu funkcji aktywującej
  getOutputs(inputData, index) {
    let outputs = []
    for (let x = 0; x < this.numberOfPerceptrons; x += 1) {
      outputs[x] = this.objectsList[x].calculateOutput(inputData) //Oblicza aktywacje dla kazdego perceptronu
    }
    return new dataOutput(outputs)
  }

}
