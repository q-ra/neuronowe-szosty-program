//klasa warstwy

class Layer{
  constructor (num, numObject, numberOfInputs){
  	this.inputsCount = numberOfInputs;
  	this.number = num;
  	// ilosc perceptronow
  	this.numberOfObjects = numObject;
  	// lista perceptronow
  	this.objectsList = new Array();
  }

	main (){
		if( this.numberOfObjects == 0 ) {
			this.numberOfObjects = Math.floor((Math.random() * (10-5+1)+5));
		} else {
			this.numberOfObjects = this.numberOfObjects;
		}
		this.createObjects();
	}


	createObjects () {
		for( var i = 0; i < this.numberOfObjects; i++ ) {
			this.objectsList[i] = new Perceptron(this.inputsCount);
			this.objectsList[i].main();
		}
	}

	// Metoda zwraca wyjścia ( iloczyn skalarny wag i wejść przed zaaplikowaniem funkcji aktywującej sigma)
	getValues (inputData) {
		var outputs = new Array();
		for( var i = 0 ; i < this.numberOfObjects; i++ ) {
			outputs[i] = this.objectsList[i].calculateValue( inputData );
		}
		return new dataOutput(outputs);
	}

	//Metoda zwraca wyjścia ze wszystkich perceptronów po zaaplikowaniu funkcji aktywującej
	getOutputs (inputData,index) {
		var outputs = new Array();
		for( var i = 0; i < this.numberOfObjects; i++ ) {
			outputs[i] = this.objectsList[i].calculateOutput( inputData );
		}
		return new dataOutput(outputs);
	}

}
