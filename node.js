//This is completely unrelated to node.js
var Node = function(label,position, voltage ,domParent){
	//position is in the form {x:123, y:456}
	var node = this;
	this.voltage = voltage;
	this.position = position;
	this.label = label;
	var dot;
	this.domObjects = [];
	//this.voltage=0;
	
	
	
	/*this.setVoltage = function(quantity){
		this.voltage=quantity;
		//this.voltage.update();
	}*/
	
	var updateColor = function(){
		//console.log('updating color'+label);
		var newColor = app.voltageScale.getColor(this.parent.voltage.value.element);
		this.element = newColor;
		this.parent.domObjects.forEach(function(dot){
			dot.attr("fill", newColor);
		})
	}
	
	this.color = new Hook('black', this, updateColor);
	this.color.update();
	this.color.subscribe(this.voltage.value);
	
	/*this.voltage.update = function(){
		console.log(this.voltage);
		var color = app.voltageScale.getColor(this.voltage.value.element);
		this.domObjects.forEach(function(dot){
	
			dot.attr("fill",color);
		})	
	};*/
	
	this.addDomObject = function() {
		dot=d3.select(domParent)
			.append("circle")
			.attr("r", "10px")
			.attr("cx",this.position.x)
			.attr("cy",this.position.y)
			.attr('fill', this.color.element)
			.style('cursor', 'pointer');
		this.domObjects.push(dot)
		
	}
	this.addDomObject();
	
	var voltageTooltipDisplay = node.voltage.addDisplay();
	
	dotClickHandler = function(){
		var voltageTooltip = new Tooltip(voltageTooltipDisplay, 'below', this)
		var documentClickHandler = function(){
			voltageTooltip.closeTooltip();
			document.removeEventListener('mousedown', documentClickHandler);
		}
		document.addEventListener('mousedown', documentClickHandler)
	}
	
	dot.on('click', dotClickHandler);
}

