var RCCircuit = function(input){
	// input takes sourceFunction, middle and ground (nodes), resistance, and capacitance
	for(key in input){
		this[key] = input[key];
	}
	var rcCircuit = this;
	this.dependentVariable = input.middle.voltage.value;
	this.ground.voltage.value.set(0);
	this.equation = new Hook(null, this, function(){});
	this.equation.subscribe(input.resistance.value);
	this.equation.subscribe(input.capacitance.value);
	this.equation.subscribe(input.sourceFunction.equation);
	this.dependentVariables = [input.middle.voltage];
	this.equation.element = function(t,V){
		return (rcCircuit.sourceFunction.equation.element(t) - V)/(rcCircuit.capacitance.value.element*rcCircuit.resistance.value.element)
	}
}

var SourceFunction = function(input){
	//sourceNode, type
	for(key in input){
		this[key] = input[key];
	}
	
	var equation;
	var update;
	
	if(input.type === 'constant'){
		equation = function(t){
			return input.sourceNode.voltage.value.element;
		}
		update = function(){}
		
	}else if(input.type === 'node voltage'){ ////Update future when voltage is changed, keep past
		var tValueArray = [input.time.value.element];
		var vValueArray = [input.sourceNode.voltage.value.element];
		//var spline = numeric.spline(tValueArray.concat([input.time.scale().max.value.element]), vValueArray.concat([input.sourceNode.voltage.value.element]));

		update = function(){
			while(tValueArray[tValueArray.length-1] > input.time.value.element){
				tValueArray.pop();
				vValueArray.pop();
			}
			tValueArray.push(input.time.value.element);
			vValueArray.push(input.sourceNode.voltage.value.element);
			//spline = numeric.spline(tValueArray.concat([input.time.scale().max.value.element]), vValueArray.concat([input.sourceNode.voltage.value.element]));	
		}
		
		equation = function(t){	
			var i = 0;
			while(tValueArray[i] < t){
				i++;
			}
			if(vValueArray[i-1]){
				return vValueArray[i-1];
			} else{return vValueArray[i]}
		}
	}
	
	this.equation = new Hook(equation, this, update);
	this.equation.subscribe(input.sourceNode.voltage.value);
	if(input.type  === 'node voltage'){
		this.equation.subscribe(input.time.value);///////////////////////////FIX THIS ---- source function graph constantly redraws.
	}
	equationWithAt = {};
	equationWithAt.at = function(t){return equation(t)}
	depOnEqn = new Hook(equationWithAt, null, function(){})
	depOnEqn.subscribe(this.equation);
	input.sourceNode.voltage.dependsOn.push({independent:input.time, func:depOnEqn});
}
