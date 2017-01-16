function PositionArm(aa, bb, x00, y00){
/* 

		    	  (x1,y1)
		              o---b---o (x2,y2)
		+-------+    / kąt beta)
		|    	|  a
		|       | /
		|	 	|/  
		|(x0,y0)o Kąt alpha)
		|	 	| 
		+-------+ 


*/
	this.alpha = 0;
	this.beta = 0;
	this.a = aa;
	this.b = bb;
	this.x0 = x00;
	this.y0 = y00;
	this.x1 = 0;
	this.y1 = 0;
	this.x2 = 0;
	this.y2 = 0;
	this.PI = Math.PI;

	// wylicza polozenie lokcia i dloni dla zadanych katow z przedzialu (0, PI)
	this.calculatePosition = function(inputAlpha, inputBeta){
		this.alpha = inputAlpha;
		this.beta = inputBeta;
		
		if (this.alpha >= this.PI/2){
			this.x1 = this.x0 + this.a * Math.cos(this.alpha - this.PI/2);
			this.y1 = this.y0 - this.a * Math.sin(this.alpha - this.PI/2);
		}else{
			this.x1 = this.x0 + this.a * Math.cos(this.PI/2 - this.alpha);
			this.y1 = this.y0 + this.a * Math.sin(this.PI/2 - this.alpha);
		}
			
		var alphaa = this.alpha + this.beta + this.PI/2;
		this.x2 = this.x1 + this.b * Math.cos(alphaa);
		this.y2 = this.y1 - this.b * Math.sin(alphaa);
				
		return this.normalize();
	}	
	

	// zwraca znormalizowane wejscie do obrobki przez siec warstwowa (N=2, M=2)
	this.normalize = function(){
		// wyjscie
		var output = [];
		output[0]  = this.alpha  / this.PI * 0.6 + 0.2;
		output[1]   = this.beta / this.PI * 0.6 + 0.2;
		var output = new dataOutput(output);
		// wejscie
		var input = [];
		input[0] = (this.x2 - this.x0) / (this.a + this.b) - 0.2;
		input[1] = (this.y2 - this.y0) / (this.a + this.b) - 0.2;
		var input = new dataInput(input);
		
		var learningExample = new LearningExample( input, output, 1 );
		return learningExample;
	}

}