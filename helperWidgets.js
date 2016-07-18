//ColorScale
var ColorScale = function(minimum, maximum){
	this.min = minimum
	this.max = maximum
	this.getColor = function(value){
		var blue = Math.round(255*(1-(value - this.min)/(this.max-this.min)));
		var red = Math.round(255*(value - this.min)/(this.max-this.min));
	return(d3.rgb(red,0,blue));
	}
}


//Tooltip
var Tooltip = function(domObject, position, domParent){
	var tooltipPosition = {};
	var parentPosition = domParent.getBoundingClientRect(domParent);
	var tooltip;
	var addTooltip = function(position){
		tooltip = d3.select('body')
			.append(function(){return domObject})
			.style('position', 'absolute')
			.style('background-color', 'white')
			.style('top', position.top)
			.style('left', position.left);
	}
	
	this.updatePosition= function(){};
	this.closeTooltip = function(){
		
		document.body.removeChild(domObject);
	};
	switch(position){
		case 'covering': 
			addTooltip(parentPosition);
			tooltip.style('min-width',parentPosition.width)
				.style('min-height', parentPosition.height);
		break;
		case 'over': 
			tooltipPosition.top = parentPosition.top+parentPosition.height/2
			tooltipPosition.left = parentPosition.left+parentPosition.width/2
			addTooltip(tooltipPosition);
		break;
		case 'below':
			tooltipPosition.top = parentPosition.top+parentPosition.height;
			tooltipPosition.left = parentPosition.left;
			addTooltip(tooltipPosition);
			break;
		
		
	}
}





//Differential Equation
var Integrate = function(input){
	var diffEq = this;
	this.input = input;
	var solve = function(){
		var f = input.circuit.equation.element;
		this.element = numeric.dopri(0,10,[0],f,1e-6,2000);//input.circuit.middle.voltage.value.element
		//for(var i = 0; i < this.element.y.length; i++){
		//	console.log(this.element.y[i][0]);
		//}
		//console.log([this.element.at(0)[0],this.element.at(3.3)[0],this.element.at(6.7)[0],this.element.at(10)[0]])
	}
	this.solution = new Hook(null, null, solve);
	this.solution.subscribe(input.circuit.equation)
	this.solution.update();
	
	var evaluate = function(){
		var t = input.time.element;
		this.element = diffEq.solution.element.at(t)[0];
		input.circuit.dependentVariable.element = diffEq.evaluation.element;
		//console.log('Voltage: ',this.element, ' Resistance: ', diffEq.input.circuit.resistance.value.element, ' Capacitance: ', diffEq.input.circuit.capacitance.value.element);
	}
	
	this.evaluation = new Hook(null, null, evaluate);
	this.evaluation.subscribe(input.time);
	this.evaluation.subscribe(this.solution);
	input.circuit.dependentVariable.subscribe(this.evaluation);
}


//Animation
var Animation = function(parameter, playbackSpeed){
	
	
	
	var updatePlayback = function(){
		var tm0 = parameter.value.element;	//model time
		var tw0 = performance.now()/1000;	//world time
		
		var step = function(timeMS){
			var factor = playbackSpeed.value.element;
			var tw = timeMS/1000;
			var tm = factor*(tw-tw0)+tm0
			parameter.value.set(tm)
			if(tm < 10){
				window.requestAnimationFrame(step);
			}
		}
		var anim = window.requestAnimationFrame(step);
	}
	var playback = new Hook(playbackSpeed.value.element, this, updatePlayback);
	playback.subscribe(playbackSpeed.value);
	playback.update();
}
