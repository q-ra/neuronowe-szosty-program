

class Network {
  constructor(Layers, Objects, inputsCount, outputsCount) {
    
    this.numberOfLayers = Layers 
    this.numberOfPerceptrons = Objects 
    this.inputsCount = inputsCount 	
    this.outputsCount = outputsCount 
    this.etha = 0.4 
    this.layersList = [] 
  }

  init() {
    this.createLayers()
  }

  
	
	
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

  
	
  getError(examples) {
    let error = 0
    let that = this

    $.each(examples, function(index, example) {
			
      let output = that.getOutputFromInput(example.input)
      for (let x = 0; x < output.b.length; x += 1) {
        
        
        
        error += Math.pow((output.b[x] - example.output.b[x]), 2)
      }
    })

		
    return error / 2
  }

  
  learn(example) {
    
    let inputLayerValues = this.getLayersInputValues(example.input)   
    
    let networkOutput = this.getOutputFromInput(example.input) 
    
    let layerDelta = [] 

    
    let lastLayer = this.numberOfLayers - 1
    let delta
    let error = 0
		
    for (let x = lastLayer; x >= 0; x--) {
      
      if (x == lastLayer) {
        
        delta = []

        for (let y = 0; y < 2; y++) {
          error = (example.output.b[y] - networkOutput.b[y])
          
          
          
          
          delta[y] = error * this.sigmaDerivative(inputLayerValues[x].a[y])
        }
        layerDelta[x] = new dataOutput(delta) 

      } else {
        delta = []
        for (let y = 0; y < this.layersList[x].numberOfPerceptrons; y++) {
          delta[y] = 0
          for (let k = 0; k < this.layersList[x + 1].numberOfPerceptrons; k++) {
            error = layerDelta[x + 1].b[k] * this.layersList[x + 1].objectsList[k].weights[y] 	
            delta[y] += error * this.sigmaDerivative(inputLayerValues[x].a[y])
          }
          layerDelta[x] = new dataOutput(delta)
        }

      }
      error = 0
    }

    
		
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

  
  sigmaDerivative(x) {
    return this.sigma(x) * (1 - this.sigma(x))
  }

}
