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
	this.dependentVariables = [input.middle.voltage, input.sourceFunction.sourceNode.voltage];
	this.equation.element = function(t,V){
		return (rcCircuit.sourceFunction.equation.element(t) - V)/(rcCircuit.capacitance.value.element*rcCircuit.resistance.value.element)
	}//
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
		
	}
	
	this.equation = new Hook(equation, this, update);
	this.equation.subscribe(input.sourceNode.voltage.value);
}
