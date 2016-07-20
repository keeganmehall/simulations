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
	var tooltip = this;
	var tooltipPosition = {};
	var parentPosition = domParent.getBoundingClientRect(domParent);
	tooltip.domObject = domObject;
	var newTooltip;
	var addTooltip = function(position){
		console.log('adding tooltip at ',position.left);
		console.log(domObject);
		d3.select('body')
			.append(function(){return domObject})
			.style('position', 'absolute')
			.style('background-color', 'white')
			.style('top', position.top)
			.style('left', position.left);
		domObject.style.visibility = 'visible';
		
	}
	
	this.updatePosition= function(){};
	this.showTooltip = function(){
		domObject.style.visibility = 'visible';
	}
	
	this.closeTooltip = function(){
		domObject.style.visibility = 'hidden';
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
		this.element = numeric.dopri(0,30,[0],f,1e-6,2000);//input.circuit.middle.voltage.value.element
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
var Animation = function(parameter, playbackSpeed, running){
	
	
	
	var updatePlayback = function(){
		var tm0 = parameter.value.element;	//model time
		var tw0 = performance.now()/1000;	//world time
		
		var step = function(timeMS){
			setTimeout(function(){
				if(running.value.element){
					var factor = playbackSpeed.value.element;
					var tw = timeMS/1000;
					var tm = factor*(tw-tw0)+tm0
					parameter.value.set(tm)
					if(tm < 30){
						window.requestAnimationFrame(step);
					} else{running.value.set(false)}
				}
			}, 1000);	
		}
		var anim = window.requestAnimationFrame(step);
	}
	var playback = new Hook({speed:playbackSpeed.value.element, running:running}, this, updatePlayback);
	playback.subscribe(playbackSpeed.value);
	playback.subscribe(running.value);
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
		var toggle = function(){
			if(bool.value.element){
				bool.value.set(false);
			} else{
				bool.value.set(true);
			}
		}
		button.addEventListener('click', toggle);
		domObjects.push(button);
		return button;
	}
}
