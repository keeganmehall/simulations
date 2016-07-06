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
	var tooltipPosition;
	var parentPosition = domParent.getBoundingClientRect(domParent);
	
	var addTooltip = function(position){
		console.log(domObject)
		d3.select('body')
			.append(function(){return domObject})
			.style('position', 'absolute')
			.style('background-color', 'white')
			.style('min-width',parentPosition.width)
			.style('top', position.top)
			.style('left', position.left);
	}
	
	this.updatePosition= function(){};
	this.closeTooltip = function(){
		
		document.body.removeChild(domObject);
	};
	switch(position){
		case 'over': 
			addTooltip(parentPosition);
		break;
		
		
	}
}
