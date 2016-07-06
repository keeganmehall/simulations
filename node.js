//This is completely unrelated to node.js
var Node = function(label,position,domParent){
	//position is in the form {x:123, y:456}
	this.position = position;
	this.label = label;
	this.domObjects = [];
	this.voltage=0;
	
	this.setVoltage = function(newVoltage){
		this.voltage=newVoltage;
		var color = app.voltageScale.getColor(this.voltage.value);
		this.domObjects.forEach(function(dot){
	
			dot.attr("fill",color);
		})
		
	}
	
	this.addDomObject = function() {
		var dot=d3.select(domParent)
			.append("circle")
			.attr("r", "10px")
			.attr("cx",this.position.x)
			.attr("cy",this.position.y);
		this.domObjects.push(dot)
		
	}
	this.addDomObject();
	this.setVoltage(-200);
}

