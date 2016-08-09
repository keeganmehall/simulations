//ColorScale
/*var Scale = function(minimum, maximum){
	var scale = this;
	this.min = minimum;
	this.max = maximum;
	var min = minimum.value.element;
	var max = maximum.value.element;
	this.getColor = function(value){
		var blue = Math.round(255*(1-(value - min)/(max-min)));
		var red = Math.round(255*(value - min)/(max-min));
		return(d3.rgb(red,0,blue));
	}
	var updateScale = function(){
		min = minimum.value.element;
		max = maximum.value.element;
	}
	this.scaleUpdate = new Hook('null', this, updateScale); 
	this.scaleUpdate.subscribe(minimum.value);
	this.scaleUpdate.subscribe(maximum.value);
	
	this.addAxis = function(){
	}
}*/


//Tooltip
var Tooltip = function(domObject, position, domParent){
	var tooltip = this;
	var tooltipPosition = {};
	var parentPosition = {};
	var boundingClientRect = domParent.getBoundingClientRect();
	parentPosition.top = boundingClientRect.top + window.pageYOffset;
	parentPosition.left = boundingClientRect.left + window.pageXOffset;
	parentPosition.width = boundingClientRect.width;
	parentPosition.height = boundingClientRect.height;
	this.domObject = domObject;
	var newTooltip;
	var addTooltip = function(position){
		document.body.appendChild(domObject);
		domObject.style.position = 'absolute';
		domObject.style.backgroundColor = 'white';
		domObject.style.top = position.top;
		domObject.style.left = position.left;
		
	}
	
	
	
	this.closeTooltip = function(){
		document.body.removeChild(domObject)
	};
	switch(position){
		case 'covering': 
			addTooltip(parentPosition);
			domObject.style.minWidth = parentPosition.width;
			domObject.style.minHeight = parentPosition.height;
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
		this.element = numeric.dopri(input.time.scale().min.value.element,input.time.scale().max.value.element,[0],f,1e-6,2000);//input.circuit.middle.voltage.value.element
		//for(var i = 0; i < this.element.y.length; i++){
		//	console.log(this.element.y[i][0]);
		//}
		//console.log([this.element.at(0)[0],this.element.at(3.3)[0],this.element.at(6.7)[0],this.element.at(10)[0]])
	}
	var solution = new Hook(null, null, solve);
	this.solution = solution;
	this.solution.subscribe(input.circuit.equation);
	this.solution.subscribe(input.time.scale().min.value);
	this.solution.subscribe(input.time.scale().max.value);
	this.solution.update();
	//console.log(this.circuit.dependentVariables);
	input.circuit.dependentVariables.forEach(function(variable){
		variable.dependsOn.push({independent:input.time, func:solution});
	})
	
	var evaluate = function(){
		var t = input.time.value.element;
		this.element = diffEq.solution.element.at(t)[0];
		input.circuit.dependentVariable.element = diffEq.evaluation.element;
		//console.log('Voltage: ',this.element, ' Resistance: ', diffEq.input.circuit.resistance.value.element, ' Capacitance: ', diffEq.input.circuit.capacitance.value.element);
	}
	
	this.evaluation = new Hook(null, null, evaluate);
	this.evaluation.subscribe(input.time.value);
	this.evaluation.subscribe(this.solution);
	input.circuit.dependentVariable.subscribe(this.evaluation);
}


//Animation
var Animation = function(parameter, playbackSpeed){
	
	
	
	var updatePlayback = function(){
		var tm0 = parameter.value.element;	//model time
		var tw0 = performance.now()/1000;	//world time
		var stopValue = parameter.scale().max.value.element;
		var step = function(timeMS){
			if(parameter.animationRunning.value.element){
				var factor = playbackSpeed.value.element;
				var tw = timeMS/1000;
				var tm = factor*(tw-tw0)+tm0
				parameter.value.set(tm)
				if(tm < stopValue){
					window.requestAnimationFrame(step);
				} else{parameter.animationRunning.value.set(false)}
			}
		}
		var anim = window.requestAnimationFrame(step);
	}
	var playback = new Hook({speed:playbackSpeed.value.element, running:parameter.animationRunning}, this, updatePlayback);
	playback.subscribe(playbackSpeed.value);
	playback.subscribe(parameter.animationRunning.value);
	playback.update();
}



//Boolean
var Bool = function(initialValue){
	var bool = this;
	var domObjects = [];
	var update = function(){
		domObjects.forEach(function(button){
			if(bool.value.element){
				button.textContent = button.falseLabel;
			} else{
				button.textContent = button.trueLabel;
			}
		});
	}
	this.toggle = function(){
		if(bool.value.element){
			bool.value.set(false);
		} else{
			bool.value.set(true);
		}
	}
	
	bool.value = new Hook(initialValue, this, update);
	this.addToggle = function(trueLabel, falseLabel){
		var button = document.createElement('button');
		button.trueLabel = trueLabel;
		button.falseLabel = falseLabel;
		if(bool.value.element){
			button.textContent = falseLabel;
		} else{
			button.textContent = trueLabel;
		}
		bool.toggle;
		button.addEventListener('click', bool.toggle);
		domObjects.push(button);
		return button;
	}
}


