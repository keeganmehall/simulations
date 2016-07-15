var Tooltip = function(domObject, position, domParent){
	var tooltipPosition;
	var parentPosition = document.getBoundingClientRect(domParent);
	var setPosition = function(position){
		console.log('running bears')
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
		case 'below':
			tooltipPosition.top = parentPosition.top+parenPosition.height;
			tooltipPosition.left = parentPosition.left;
			setPosition(tooltipPosition);
			break;
		
	}
}
