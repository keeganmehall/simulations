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

var ForcingFn = function(input){
	//forcedQuan, (default) type, time
	var forcingFn = this;
	for(key in input){
		this[key] = input[key];
	}
	var type = input.type;
	var equation;
	var update = function(){};
	this.equation = new Hook(null, this, update);
	this.typeUpdate = new Hook(null, this, function(){});
	//Create menu
	forcingFn.menu = document.createElement('div');
	d3.select(forcingFn.menu).append('h3').text('Source Behavior:');
	forcingFn.typeDropdown = document.createElement('select');
	forcingFn.typeDropdown.innerHTML = "<option value='node voltage'> Node Voltage </option> <option value='constant'> Constant </option>  <option value='sine'> Sine </option>"
	forcingFn.menu.appendChild(forcingFn.typeDropdown);
	forcingFn.typeDropdown.addEventListener('change', function(){
		type = forcingFn.typeDropdown.value;
		setType()
	});
	controlsDiv = document.createElement('div');
	forcingFn.controlsDiv = controlsDiv;
	forcingFn.menu.appendChild(forcingFn.controlsDiv);
	
	var controlDisplays = [];
	var setType = function(){
		forcingFn.type = type;
		forcingFn.typeUpdate.set(null);
		if(type === 'node voltage' || type === 'constant'){
			forcingFn.equation.subscribe(input.forcedQuan.value);
		} else{
			forcingFn.equation.unsubscribe(input.forcedQuan.value);
		}
		
		if(type  === 'node voltage' || type === 'sine'){
			input.forcedQuan.value.subscribe(input.time.value);///////////////////////////FIX THIS ---- source function graph constantly redraws.
		} else{
			input.forcedQuan.value.unsubscribe(input.time.value);
		}
		
		//Split between user controlled and a function
		if(type === 'sine'){
			var evaluate = function(){
				var t = input.time.value.element;
				input.forcedQuan.value.element = forcingFn.equation.element(t);
			}
			forcingFn.evaluation = new Hook(null, null, evaluate);
			forcingFn.evaluation.subscribe(input.time.value);
			forcingFn.evaluation.subscribe(forcingFn.equation);
			input.forcedQuan.value.subscribe(forcingFn.evaluation);
			input.forcedQuan.editable.value.set(false);
		} else{
			if(forcingFn.evaluation){
				forcingFn.evaluation.unsubscribe(input.time.value);
				input.forcedQuan.value.unsubscribe(forcingFn.evaluation);
			}
			input.forcedQuan.editable.value.set(true);
		}
		
		if(type === 'constant'){
			forcingFn.equation.set(function(t){
				return input.forcedQuan.value.element;
			});
			forcingFn.equation.update = function(){}
		
		}else if(type === 'node voltage'){ ////Update future when voltage is changed, keep past
			var tValueArray = [input.time.value.element];
			var vValueArray = [input.forcedQuan.value.element];
		

			forcingFn.equation.update = function(){
				while(tValueArray[tValueArray.length-1] >= input.time.value.element){
					tValueArray.pop();
					vValueArray.pop();
				}
				tValueArray.push(input.time.value.element);
				vValueArray.push(input.forcedQuan.value.element);
			
			}
		
			forcingFn.equation.set(function(t){	
				var i = 0;
				while(tValueArray[i] < t){
					i++;
				}
				if(vValueArray[i-1]){
					return vValueArray[i-1];
				} else{return vValueArray[i]}
			})
		}else if(type === 'sine'){
			forcingFn.freq = new Quantity('f', 0.5, 'Hz', new Scale(0,1));
			forcingFn.amplitude = new Quantity('A', 3, 'V', app.voltageScale);
			forcingFn.center = new Quantity('C', 3, 'V', app.voltageScale);
			forcingFn.phase = new Quantity('&phi;', 0, 's', new Scale(0, 3));
			forcingFn.equation.update = function(){}
			forcingFn.equation.set(function(t){	
				var ans = forcingFn.amplitude.value.element*
					Math.sin(2*Math.PI*forcingFn.freq.value.element*(t + forcingFn.phase.value.element))+forcingFn.center.value.element;
				//console.log(forcingFn.amplitude.value.element, forcingFn.freq.value.element, forcingFn.freq.value.element);
				//console.log(ans);
				return ans;
			});
			forcingFn.equation.subscribe(forcingFn.freq.value);
			forcingFn.equation.subscribe(forcingFn.amplitude.value);
			forcingFn.equation.subscribe(forcingFn.center.value);
			forcingFn.equation.subscribe(forcingFn.phase.value);
		}
		
		//Show Controls
		while (controlsDiv.firstChild) {
			controlsDiv.removeChild(controlsDiv.firstChild);
		}
		if(type === 'node voltage' || type === 'constant'){
			//controlsDiv.appendChild(forcingFn.forcedQuan.addDisplay()); ////Add this later after preventing undisplayed quantities from displaying
		}else if(type === 'sine'){
			controlsDiv.appendChild(forcingFn.amplitude.addDisplay());
			var span1 = document.createElement('span');
			span1.innerHTML = '*sin(2&pi;';
			span1.className = 'mt'
			controlsDiv.appendChild(span1);
			controlsDiv.appendChild(forcingFn.freq.addDisplay());
			var span2 = document.createElement('span');
			span2.innerHTML = '(';
			span2.className = 'mt'
			controlsDiv.appendChild(span2);
			controlsDiv.appendChild(forcingFn.time.addDisplay());
			var span3 = document.createElement('span');
			span3.innerHTML = '+';
			span3.className = 'mt'
			controlsDiv.appendChild(span3);
			controlsDiv.appendChild(forcingFn.phase.addDisplay());
			var span4 = document.createElement('span');
			span4.innerHTML = '))';
			span4.className = 'mt'
			controlsDiv.appendChild(span4);
			var span5 = document.createElement('span');
			span5.innerHTML = '+';
			span5.className = 'mt'
			controlsDiv.appendChild(span5);
			controlsDiv.appendChild(forcingFn.center.addDisplay());
		}
		
		input.time.animationRunning.value.set(false);
		input.time.value.set(0);
	}
	
	setType(input.type);
	
	
	
	equationWithAt = {};
	equationWithAt.at = function(t){return forcingFn.equation.element(t)}
	depOnEqn = new Hook(equationWithAt, null, function(){})
	depOnEqn.subscribe(this.equation);
	input.forcedQuan.dependsOn.push({independent:input.time, func:depOnEqn});
	
	
	this.addMenu = function(){
		
		return forcingFn.menu;
	}
	
}
