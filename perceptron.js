class Perceptron {
  constructor(numberOfInputs) {
    this.weights = [] //tablica wag
    this.weightsCount = numberOfInputs //wielkosc tablicy wag
  }

	//losowanie wag (wywolywane przy tworzeniu perceptronow)
  init() {
    this.randomWeights()
  }

  //http://www-users.mat.uni.torun.pl/~piersaj/www/contents/teaching/wsn2010/wsn-lab05.pdf
	//Funkcja sigma
  sigma(x) {
    return 1 / (1 + Math.exp(-x))
  }

  //Pochodna funkcji sigma
  sigmaDerivative(x) {
    return this.sigma(x) * (1 - this.sigma(x))
  }

  //Losujemy małe wagi dla perceptronów
  randomWeights() {
    for (let x = 0; x < this.weightsCount; x += 1) {
      this.weights[x] = Math.random()
    }
  }

  //Oblicza sume iloczynow wag i danych wejściowych
	//inputData - dane wejsciowe
  calculateValue(inputData) {
    let sum = 0
    for (let x = 0; x < this.weightsCount; x += 1) {
      sum += inputData.a[x] * this.weights[x]
    }
    return sum
  }

	//Oblicza aktywację perceptronu uzywjac powyzszej funkcji
  calculateOutput(inputData) {
    return this.sigma(this.calculateValue(inputData))
  }

	//poprawa wag wykorzystywana w wstecznej propagacji bledow do poprawienia wag (juz po wyznaczeniu delt)
  addToWeight(index, value) {
    this.weights[index] += value
  }

}
