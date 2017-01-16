let sizeof = 50
let lines = []
let arm
let end
//tworzymy okno o wymiarach 'sizeof*sizeof'
function initializeWindow(sizeof) {
	$('#svg').svg()
	let svg = $('#svg').svg('get')
	let arms = svg.group({strokeWidth:2})
}

$(document).ready(function(){
	//elementy interfejsu
	initializeWindow(sizeof)

	let svg = $('#svg').svg('get')
	lines[0] = svg.line(0, 200, 75, 200, {stroke: 'grey'})
	lines[1] = svg.line(75, 200, 150, 200, {stroke: 'grey'})
	arm = svg.circle(75, 200, 1, {fill: 'none', stroke: 'red', strokeWidth: 4})
	end   = svg.circle(150, 200, 1, {fill: 'none', stroke: 'black', strokeWidth: 10})

	let SVGpunkt = []
	let punkt = []
	let count = 0
	function getMousePos(canvas, evt) {
	    return {
	        x: evt.clientX - 160,
	        y: evt.clientY - 105
	    }
	}
	$("svg").click(function(e){
		let coord = getMousePos(svg, e)
		Robot.updateHand(coord)
		count ++
	})



	let Robot = new createBot()
	Robot.init()
})

//Tu będziemy przechowywać wejście
function dataInput(data)
{
	//alert(data[0])
	this.a = new Array()
	for(let i=0; i<data.length; i++)
	{
		this.a[i]=data[i]
	}
}

//Tu będziemy przechowywać wyjście
function dataOutput(data) {
	this.b = new Array()
	for(let i=0; i<data.length; i++)
	{
		this.b[i]=data[i]
	}
}


//Tu będziemy przehowywac przykład uczący
function LearningExample(ini, out, exc){

	this.input = ini
	this.output = out
	this.expectedValue = exc

}

//Główna klasa
function createBot(){
	// Lista przykładów uczących uzupełniana przez metodę randomExamples()
	this.examples = new Array()
	// Obiekt ramienia robota
	this.positionArm
	// Obiekt sieci
	this.network
	// Długości ramion
	this.a = 75
	this.b = 75
	// Pubkt zaczepienia ramienia
	this.x = 0
	this.y = 200
	// Ilość przykładów uczących
	this.examplesCount = 2500
	// Ilość kroków uczenia
	this.learningIterations = 150000

	this.init = function(args) {
		this.positionArm = new PositionArm(this.a,this.b,this.x,this.y)
		//warstwy, ilosc perceptronów(0 oznacza losowanie między 5 a 10), wejścia, wyjścia
		this.network = new Network(4, 0, 2, 2)
		this.network.init()
		this.randomLearningExamples()

		this.learnNetwork()
	}

	//nauka robota
	this.learnNetwork = function() {
		let example
		let error = 0
		for(let i=0; i<this.learningIterations; i++) {
			let count = Math.floor((Math.random() * this.examples.length))
			example = this.examples[count]
			//console.log(example+"="+count)
			this.network.learn(example)

			if( i % 2000 == 0 ) {
				error = this.network.getError(this.examples)
				console.log("Err: " + error)
			}

		}

	}

	//generowanie przykladow uczacych
	this.randomLearningExamples = function() {
		while( this.examples.length <= this.examplesCount ) {
			// Losuje kąt alfa i beta na których podstawie obliczam punkt dłoni robota
			let alpha = Math.random() * Math.PI
			let beta = Math.random() * Math.PI
			//console.log(alpha+"="+beta)
			let learningExample = this.positionArm.calculatePosition(alpha, beta)

			// Wybieram tylko dobre przykłady uczące
			if (this.positionArm.x2 < this.a+this.b &&
				this.positionArm.y2 < (this.a+this.b + this.y) &&
				this.positionArm.y2 > 50 &&
				this.positionArm.x2 > 0 &&
				this.positionArm.alpha > 0 && this.positionArm.alpha < Math.PI &&
				this.positionArm.beta > 0 && this.positionArm.beta < Math.PI) {
					this.examples.push(learningExample)
				}

		}
	}

	//przesuwanie ręki
	this.updateHand = function(coord) {
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
		inputBeta  = (outputData.b[1] - 0.2 )/ 0.6 * Math.PI

		this.positionArm.calculatePosition(inputAlpha, inputBeta)

		// część odpowiedzialna za rysowanie
		let svg = $('#svg').svg('get')
		svg.clear()
		svg.circle(coord.x, coord.y, 1, {fill: 'none', stroke: 'red', strokeWidth: 4})
		lines[0] = svg.line(this.positionArm.x0, this.positionArm.y0, this.positionArm.x1, this.positionArm.y1, {stroke: 'grey'})
		lines[1] = svg.line(this.positionArm.x1, this.positionArm.y1, this.positionArm.x2, this.positionArm.y2, {stroke: 'grey'})
		let arm = svg.circle(this.positionArm.x1, this.positionArm.y1, 1, {fill: 'none', stroke: 'red', strokeWidth: 4})
		let end   = svg.circle(this.positionArm.x2, this.positionArm.y2, 1, {fill: 'none', stroke: 'black', strokeWidth: 10})

	}

}
