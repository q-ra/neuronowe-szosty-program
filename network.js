//klasa sieci warstw

class Network {
  constructor(Layers, Objects, inputsCount, outputsCount) {
    //liczba warstw (wszystkich), ilosc perceptronow, liczba wejsc, liczba wyjsc
    this.numberOfLayers = Layers //liczba warstw
    this.numberOfPerceptrons = Objects //liczba perceptronów
    this.inputsCount = inputsCount 	//liczba wejsc
    this.outputsCount = outputsCount //liczba wyjsc
    this.etha = 0.4 //stała uczenia się
    this.layersList = [] //lista warstw
  }

  init() {
    this.createLayers()
  }

  //tworzymy warstwy. Pierwsza warstwa ma dwa perceptrony oraz dwa wejścia, ostatnia warstwa ma również dwa perceptrony
	// i liczbe wejsc rowna liczbie wyjsc (perceptronow) poprzedniej warstwy (stad numberOfObjects na i-1 warstwie).
	// init wywoluje stworzenie warstw (czyli stworzenie perceptronow)
  createLayers() {
    let lastLayer = null
    for (let x = 0; x < this.numberOfLayers; x += 1) {
      if (x == 0) {
        this.layersList[x] = new Layer(x, 2, this.inputsCount)
      } else {
        lastLayer = this.layersList[this.layersList.length - 1]
        if (x == (this.numberOfLayers - 1))
          this.layersList[x] = new Layer(x, 2, lastLayer.numberOfPerceptrons)
        else
          this.layersList[x] = new Layer(x, this.numberOfPerceptrons, lastLayer.numberOfPerceptrons)
      }
      this.layersList[x].init()
    }
  }

	//wyliczamy nowe wyjscie dla kolejnych warstw. W ostatecznosci zwraca nam wyjscie z sieci (dwie wagi z warstwy wyjsciowej)
  getOutputFromInput(inputData) {
    let IDataList = []
    IDataList.push(inputData)
    $.each(this.layersList, function(index, layer) {
      let outputData = layer.getOutputs(IDataList[IDataList.length - 1])
      IDataList.push(new dataInput(outputData.b))
    })
    let out = new dataOutput(IDataList[IDataList.length - 1].a)
    return out
  }

  //liczy 'e' czyli wejscia dla kazdej sieci, i wrzuca to do zmiennejm. Nastepnie liczy f(e) gdyz
	// wyjscia poprzednich perceptronow sa wejsciami perceptronow z nastepnej warstwy.
  getLayersInputValues(inputData) {
    let IDataList = []
    let layersInputValues = []
    IDataList.push(inputData)
    let outputValue
    let outputData

    $.each(this.layersList, function(index, layer) {
      outputValue = layer.getValues(IDataList[IDataList.length - 1])
      layersInputValues.push(new dataInput(outputValue.b))
      outputData = layer.getOutputs(IDataList[IDataList.length - 1], index)
      IDataList.push(new dataInput(outputData.b))
    })

    return layersInputValues
  }

  //Wylicza error na podstawie wszystkich danych wejściowych
	//Funkcja błędu, określa jak bardzo niedostosowana jest sieć do zestawu uczącego
  getError(examples) {
    let error = 0
    let that = this

    $.each(examples, function(index, example) {
			// wyliczamy nowe wyjscie dla kolejnej warstwy
      let output = that.getOutputFromInput(example.input)
      for (let x = 0; x < output.b.length; x += 1) {
        //propagacja bledu czesc 1
        //http://www-users.mat.umk.pl/~rudy/wsn/wyk/wsn-wyklad-05a-propag.pdf  -strona 32
        // Ek(n) = 1/2(Zk(n) - Tk(n) )^2
        error += Math.pow((output.b[x] - example.output.b[x]), 2)
      }
    })

		// error dzielony przez 1/2 z powyzszego wzoru
    return error / 2
  }

  //Uczy sieć przykładu metodą wstecznej propagacji błędów
  learn(example) {
    // wartosci wejsciowe
    let inputLayerValues = this.getLayersInputValues(example.input)   //zwraca nam to e, czyli wartosci wejsciowe, potrzebne przy BEP
    // wyjscie z sieci
    let networkOutput = this.getOutputFromInput(example.input) //zwraca wyjscie z sieci
    // tablica nowych wyjsc
    let layerDelta = [] //tablica delt, czyli nowych wartosci ktore pomoga w poprawie wag

    // liczymy delty dla wszystkich warstw
    let lastLayer = this.numberOfLayers - 1
    let delta
    let error = 0
		//lecimy od konca, gdyz tak dziala algorytm BEP
    for (let x = lastLayer; x >= 0; x--) {
      // W ostatniej warstwie(wyjściowej) delta liczona jest inaczej
      if (x == lastLayer) {
        // Delt jest tyle ile wyjść
        delta = []

        for (let y = 0; y < 2; y++) {
          error = (example.output.b[y] - networkOutput.b[y])
          //galaxy - wartosc oczekiwana - wartosc sygnalu wejsciowego
          //pochodna f sigma
          // adnotacja 2.3 44 strona
          // liczymy delte dla kazdej jednostki
          delta[y] = error * this.sigmaDerivative(inputLayerValues[x].a[y])
        }
        layerDelta[x] = new dataOutput(delta) //tablica wyliczonych delt dla perceptronow

      } else {
        delta = []
        for (let y = 0; y < this.layersList[x].numberOfPerceptrons; y++) {
          delta[y] = 0
          for (let k = 0; k < this.layersList[x + 1].numberOfPerceptrons; k++) {
            error = layerDelta[x + 1].b[k] * this.layersList[x + 1].objectsList[k].weights[y] 	//tutaj uwzgledniamy rowniez poprzednie warstwy
            delta[y] += error * this.sigmaDerivative(inputLayerValues[x].a[y])
          }
          layerDelta[x] = new dataOutput(delta)
        }

      }
      error = 0
    }

    // zmiana wag dla wszystkich perceptronów wszystkich warstw
		// juz po wyliczeniu delty, mam zapamietana ja w layerData, wiec lecimy dalej z poprawa tych wag jak na obrazku
    let sumComponent
    let input = example.input
    let that = this
    $.each(this.layersList, function(index, layer) {
      for (let x = 0; x < layer.numberOfPerceptrons; x += 1) {
        for (let y = 0; y < layer.inputsCount; y++) {
          sumComponent = that.etha * layerDelta[layer.number].b[x] * input.a[y]
          layer.objectsList[x].addToWeight(y, sumComponent)
        }
      }
      input = new dataInput(layer.getOutputs(input).b)
    })
  }

  sigma(x) {
    return 1 / (1 + Math.exp(-x))
  }

  // Pochodna funkcji sigma
  sigmaDerivative(x) {
    return this.sigma(x) * (1 - this.sigma(x))
  }

}
