//Główna klasa
class Robot {
  constructor() {

    this.examples = [] // Lista przykładów uczących uzupełniana przez metodę randomExamples()
    this.positionArm     // Obiekt ramienia robota
    this.network  // Obiekt sieci
    this.a = 75  // Długości ramion
    this.b = 75  // Długości ramion
    this.x = 0   // Punkt zaczepienia ramienia
    this.y = 200   // Punkt zaczepienia ramienia
    this.examplesCount = 2500 // Ilość przykładów uczących
    this.learningIterations = 150000 // Ilość kroków uczenia
  }

  init(args) {
    this.positionArm = new PositionArm(this.a, this.b, this.x, this.y)
    this.network = new Network(4, 5, 2, 2) //warstwy, ilosc perceptronów, wejścia, wyjścia
    this.network.init() //towrzy warstwy sieci
    this.randomLearningExamples() //losujemy przyklady uczace
    this.learnNetwork() //uczymy siec
  }

  //nauka robota
  learnNetwork() {
    let example
    let error = 0
    for (let i = 0; i < this.learningIterations; i++) {
      let count = Math.floor((Math.random() * this.examples.length)) //losowanie przykladu uczacego
      example = this.examples[count] //wybranie przykladu uczacego
      this.network.learn(example) //przekazanie przykladu uczacego do sieci

      if (i % 2000 == 0) {
        error = this.network.getError(this.examples) //error liczony na podstawie przykladow uczacych
        console.log("Err: " + error)
      }

    }

  }

  //generowanie przykladow uczacych
  randomLearningExamples() {
    while (this.examples.length <= this.examplesCount) {
      // Losuje kąt alfa i beta na których podstawie obliczam punkt dłoni robota
      let alpha = Math.random() * Math.PI //Losuje kąt alfa
      let beta = Math.random() * Math.PI //Losuje kąt beta
      //console.log(alpha+"="+beta)
      let learningExample = this.positionArm.calculatePosition(alpha, beta) 	//Obliczam punkt dłoni robota

      // Wybieram tylko dobre przykłady uczące
      if (this.positionArm.x2 < this.a + this.b &&
        this.positionArm.y2 < (this.a + this.b + this.y) &&
        this.positionArm.y2 > 50 &&
        this.positionArm.x2 > 0 &&
        this.positionArm.alpha > 0 && this.positionArm.alpha < Math.PI &&
        this.positionArm.beta > 0 && this.positionArm.beta < Math.PI) {
        this.examples.push(learningExample)
      }

    }
  }

  //przesuwanie ręki
  updateHand(coord) {
    // Tu normalizuje dane wejściowe tak jak w metodzie normalize ( klasa PositionArm )
    let normalize = []
    normalize[0] = (coord.x - this.x) / (this.a + this.b) - 0.2
    normalize[1] = (coord.y - this.y) / (this.a + this.b) - 0.2
    let inputData = new dataInput(normalize)
    // Wyjście z sieci, czyli kąty Alpha i Beta
    let outputData = this.network.getOutputFromInput(inputData)
    // konwersja wyjscia na katy
    let inputAlpha = 0
    let inputBeta = 0
    inputAlpha = (outputData.b[0] - 0.2) / 0.6 * Math.PI
    inputBeta = (outputData.b[1] - 0.2) / 0.6 * Math.PI

    this.positionArm.calculatePosition(inputAlpha, inputBeta)

    // część odpowiedzialna za rysowanie
    let svg = $('#svg').svg('get')
    svg.clear()
    svg.circle(coord.x, coord.y, 1, {
      fill: 'none',
      stroke: 'red',
      strokeWidth: 4
    })
    lines[0] = svg.line(this.positionArm.x0, this.positionArm.y0, this.positionArm.x1, this.positionArm.y1, {
      stroke: 'grey'
    })
    lines[1] = svg.line(this.positionArm.x1, this.positionArm.y1, this.positionArm.x2, this.positionArm.y2, {
      stroke: 'grey'
    })
    let arm = svg.circle(this.positionArm.x1, this.positionArm.y1, 1, {
      fill: 'none',
      stroke: 'red',
      strokeWidth: 4
    })
    let end = svg.circle(this.positionArm.x2, this.positionArm.y2, 1, {
      fill: 'none',
      stroke: 'black',
      strokeWidth: 10
    })

  }

}
