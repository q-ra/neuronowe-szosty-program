//klasa warstwy

function Layer(num, numObject, numberOfInputs){
	this.inputsCount = numberOfInputs;
	this.number = num;
	// ilosc perceptronow
	this.numberOfObjects = numObject;
	// lista perceptronow
	this.objectsList = new Array();

	this.main = function(){
		if( this.numberOfObjects == 0 ) {
			this.numberOfObjects = Math.floor((Math.random() * (10-5+1)+5));
		} else {
			this.numberOfObjects = this.numberOfObjects;
		}
		this.createObjects();
	}
	

	this.createObjects = function() {
		for( var i = 0; i < this.numberOfObjects; i++ ) {
			this.objectsList[i] = new Perceptron(this.inputsCount);
			this.objectsList[i].main();
		}
	}
	
	// Metoda zwraca wyjścia ( iloczyn skalarny wag i wejść przed zaaplikowaniem funkcji aktywującej sigma)
	this.getValues = function(inputData) {
		var outputs = new Array();
		for( var i = 0 ; i < this.numberOfObjects; i++ ) {
			outputs[i] = this.objectsList[i].calculateValue( inputData );
		}
		return new dataOutput(outputs);
	}
	
	//Metoda zwraca wyjścia ze wszystkich perceptronów po zaaplikowaniu funkcji aktywującej
	this.getOutputs = function(inputData,index) {
		var outputs = new Array();
		for( var i = 0; i < this.numberOfObjects; i++ ) { 
			outputs[i] = this.objectsList[i].calculateOutput( inputData );
			//alert('stop klatka');
			//console.log("warstwa: "+index+" perceptron: "+ i + " wejscie: "+ inputData.a + " wyjscie: "+ outputs[i]);
		}
		return new dataOutput(outputs);
	}

}


//klasa sieci warstw

function Network(Layers, Objects, inputsCount, outputsCount){
	this.numberOfLayers = Layers;
	this.numberOfObjects = Objects;
	this.inputsCount = inputsCount;
	this.outputsCount = outputsCount;
	this.etha = 0.4;
	this.layersList = new Array();
	
	this.main = function(){
		this.createLayers();
	}
	
	//tworzymy warstwy
	this.createLayers = function() {
		var lastLayer = null;
		for( var i = 0; i < this.numberOfLayers; i++ ) {
			if( i == 0 ) {
				this.layersList[i] = new Layer( i, 2, this.inputsCount);
			} else {
				lastLayer = this.layersList[this.layersList.length - 1];
				if( i == (this.numberOfLayers -1) )
					this.layersList[i] = new Layer(i, 2, lastLayer.numberOfObjects);
				else
					this.layersList[i] = new Layer(i, this.numberOfObjects, lastLayer.numberOfObjects);
			}
			this.layersList[i].main();
		}
	}

	//wyliczamy nowe wyjscie dla kolejnej warstwy
	this.getOutputFromInput = function(inputData) {
		var IDataList = new Array();
		IDataList.push(inputData);
		$.each(this.layersList, function( index, layer ) {
			var outputData = layer.getOutputs(IDataList[ IDataList.length -1 ]);
			IDataList.push(new dataInput(outputData.b));
		})
		var out = new dataOutput (IDataList[IDataList.length -1 ].a);
		return out;
	}
	

	this.getLayersInputValues = function(inputData) {
		var IDataList = new Array();
		var layersInputValues = new Array();
		IDataList.push(inputData);
		var outputValue;
		var outputData;
		
		$.each(this.layersList, function( index, layer ) {
			outputValue = layer.getValues(IDataList[IDataList.length -1 ]);
			layersInputValues.push( new dataInput (outputValue.b) );
			outputData = layer.getOutputs(IDataList[IDataList.length -1 ],index);
			IDataList.push( new dataInput (outputData.b) );
		});
		
		return layersInputValues;
	}
	
	//Wylicza error na podstawie wszystkich danych wejściowych
	this.getError = function(examples){
		var error = 0;
		var that = this;

		$.each(examples, function( index, example ) {
			var output = that.getOutputFromInput(example.input);
			for( var i = 0; i < output.b.length; i++ ) {
				error += Math.pow(( output.b[i] - example.output.b[i] ), 2);
			}
		});
		
		return error/2;
	}
	
	//Uczy sieć przykładu metodą wstecznej propagacji błędów
	this.learn = function(example){
		// wartosci wejsciowe
		var inputLayerValues = this.getLayersInputValues( example.input );
		// wyjscie z sieci
		var networkOutput = this.getOutputFromInput(example.input);
		// tablica nowych wyjsc 
		var layerDelta = new Array();
		
		// liczymy delty dla wszystkich warstw
		var lastLayer = this.numberOfLayers - 1;
		var delta;
		var error = 0;
		for( var i = lastLayer; i >= 0; i--) {
			// W ostatniej warstwie(wyjściowej) delta liczona jest inaczej
			if( i == lastLayer ) {
				// Delt jest tyle ile wyjść
				delta = new Array();

				for( var j = 0; j < 2; j++ ) {
					error = ( example.output.b[j] - networkOutput.b[j] );
					delta[j] = error * this.sigmaDerivative(inputLayerValues[i].a[j]);
				}
				layerDelta[i] = new dataOutput(delta);
				
			} else {
				delta = new Array();
				for( var j = 0; j < this.layersList[i].numberOfObjects; j++ ) {
					delta[j] = 0;
					for( var k = 0; k < this.layersList[i+1].numberOfObjects; k++ ) {
						error = layerDelta[i+1].b[k] * this.layersList[i+1].objectsList[k].weights[j];
						delta[j] += error * this.sigmaDerivative( inputLayerValues[i].a[j] );
					}
					layerDelta[i] = new dataOutput(delta);
				}
	
			}
			error = 0;
		}
		
		// zmiana wag dla wszystkich perceptronów wszystkich warstw
		var sumComponent;
		var input = example.input;
		var that = this;
		$.each(this.layersList, function( index, layer ) {
			for( var i = 0; i < layer.numberOfObjects; i++ ) {
				for( var j = 0; j < layer.inputsCount; j++ ) {
					sumComponent = that.etha * layerDelta[ layer.number ].b[i] * input.a[j];
					layer.objectsList[i].addToWeight(j, sumComponent);
				}
			}
			input = new dataInput(layer.getOutputs(input).b);
		});
	}

	this.sigma = function(x){
		return 1 / (1 + Math.exp(-x));
	}
	
	// Pochodna funkcji sigma
	this.sigmaDerivative = function(x) {
		return this.sigma(x)*(1-this.sigma(x));
	}

}
