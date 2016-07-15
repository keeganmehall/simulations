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
