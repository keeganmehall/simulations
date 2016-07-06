var Tooltip = function(domObject, position, domParent){
	var tooltipPosition;
	var parentPosition = document.getBoundingClientRect(domParent);
	var setPosition = function(position){
		d3.select(body)
			.append(domObject)
			.style('position', 'absolute')
			.style('top', position.top)
			.style('left', position.left);
	}
	switch(position){
		case 'over': 
			setPosition(parentPosition);
		break;
		
		
	}
}
