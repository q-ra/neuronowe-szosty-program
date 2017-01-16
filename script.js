var wymiar = 50
var NauczycielSamples = []
var linie = []
var laczenie
var koniec
//tworzymy okno o wymiarach 'sizeof*sizeof'
function CreateGui(sizeof)
{
	$('#svg').svg()
	var svg = $('#svg').svg('get')
	var arms = svg.group({strokeWidth:2})
	console.log("Gui zrobione")
}

$(document).ready(function(){
	//elementy interfejsu
	CreateGui(wymiar)

	var svg = $('#svg').svg('get')
	linie[0] = svg.line(0, 200, 75, 200, {stroke: 'grey'})
	linie[1] = svg.line(75, 200, 150, 200, {stroke: 'grey'})
	laczenie = svg.circle(75, 200, 1, {fill: 'none', stroke: 'red', strokeWidth: 4})
	koniec   = svg.circle(150, 200, 1, {fill: 'none', stroke: 'black', strokeWidth: 10})

	var SVGpunkt = []
	var punkt = []
	var count = 0
	function getMousePos(canvas, evt) {
	    return {
	        x: evt.clientX - 160,
	        y: evt.clientY - 105
	    }
	}
	$("svg").click(function(e){
		var coord = getMousePos(svg, e)
		CreateRobot.aktualizuj(coord)
		count ++
	})



	var CreateRobot = new CreateRobots()
	CreateRobot.init()
})

//Tu będziemy przechowywać wejście
function dataInput(data)
{
	//alert(data[0])
	this.a = new Array()
	for(var i=0; i<data.length; i++)
	{
		this.a[i]=data[i]
	}
}

//Tu będziemy przechowywać wyjście
function dataOutput(data)
{
	this.b = new Array()
	for(var i=0; i<data.length; i++)
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
function CreateRobots(){
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
	this.learnNetwork = function()
	{
		var example
		var error = 0
		for(var i=0; i<this.learningIterations; i++)
		{
			var count = Math.floor((Math.random() * this.examples.length))
			example = this.examples[count]
			//console.log(example+"="+count)
			this.network.learn(example)

			if( i % 2000 == 0 ) {
				error = this.network.getError(this.examples)
				console.log("Error: " + error)
			}

		}

	}

	//generowanie przykladow uczacych
	this.randomLearningExamples = function()
	{
		while( this.examples.length <= this.examplesCount ) {
			// Losuje kąt alfa i beta na których podstawie obliczam punkt dłoni robota
			var alpha = Math.random() * this.positionArm.PI
			var beta = Math.random() * this.positionArm.PI
			//console.log(alpha+"="+beta)
			var learningExample = this.positionArm.calculatePosition(alpha, beta)

			// Wybieram tylko dobre przykłady uczące
			if (this.positionArm.x2 < this.a+this.b &&
				this.positionArm.y2 < (this.a+this.b + this.y) &&
				this.positionArm.y2 > 50 &&
				this.positionArm.x2 > 0 &&
				this.positionArm.alpha > 0 && this.positionArm.alpha < this.positionArm.PI &&
				this.positionArm.beta > 0 && this.positionArm.beta < this.positionArm.PI)
				{
					this.examples.push(learningExample)
				}

		}
	}

	//przesuwanie ręki
	this.aktualizuj = function(coord) {
		// Tu normalizuje dane wejściowe tak jak w metodzie normalize ( klasa PositionArm )
		var normalize = []
	    normalize[0] = (coord.x - this.x) / (this.a + this.b) - 0.2
	    normalize[1] = (coord.y - this.y) / (this.a + this.b) - 0.2
		var inputData = new dataInput(normalize)
		// Wyjście z sieci, czyli kąty Alpha i Beta
		var outputData = this.network.getOutputFromInput(inputData)
		// konwersja wyjscia na katy
		var inputAlpha = 0
		var inputBeta = 0
		inputAlpha = (outputData.b[0] - 0.2) / 0.6 * this.positionArm.PI
		inputBeta  = (outputData.b[1] - 0.2 )/ 0.6 * this.positionArm.PI

		this.positionArm.calculatePosition(inputAlpha, inputBeta)

		// część odpowiedzialna za rysowanie
		var svg = $('#svg').svg('get')
		svg.clear()
		svg.circle(coord.x, coord.y, 1, {fill: 'none', stroke: 'red', strokeWidth: 4})
		linie[0] = svg.line(this.positionArm.x0, this.positionArm.y0, this.positionArm.x1, this.positionArm.y1, {stroke: 'grey'})
		linie[1] = svg.line(this.positionArm.x1, this.positionArm.y1, this.positionArm.x2, this.positionArm.y2, {stroke: 'grey'})
		var laczenie = svg.circle(this.positionArm.x1, this.positionArm.y1, 1, {fill: 'none', stroke: 'red', strokeWidth: 4})
		var koniec   = svg.circle(this.positionArm.x2, this.positionArm.y2, 1, {fill: 'none', stroke: 'black', strokeWidth: 10})

	}

}
