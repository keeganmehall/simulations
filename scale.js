var Scale = function(minimum, maximum){
	var scale = this;
	this.min = minimum;
	this.max = maximum;
	var min = minimum.value.element;
	var max = maximum.value.element;
	this.getColor = function(value){
		var blue = Math.round(255*(1-(value - min)/(max-min)));
		var red = Math.round(255*(value - min)/(max-min));
		return(d3.rgb(red,0,blue));
	}
	var updateScale = function(){
		min = minimum.value.element;
		max = maximum.value.element;
	}
	this.scaleUpdate = new Hook('null', this, updateScale); 
	this.scaleUpdate.subscribe(minimum.value);
	this.scaleUpdate.subscribe(maximum.value);
	
	this.addAxis = function(domParent, start, length, direction){
				//Create the SVG Viewport selection
		var plot = d3.select(domParent)

		
		var orientation;
		if(direction === 'up' || direction === 'down'){
			orientation = 'left';
		}else if(direction === 'left' || direction === 'right'){
			orientation = 'bottom';
		}
		
		
		//Create the Scale we will use for the Axis

		var translation;
		if(direction === 'right'){
			translation = 'translate('+start.x+','+start.y+')';
		} else if(direction === 'up'){
			var yTranslation = start.y-length;
			translation = 'translate('+start.x+','+yTranslation+')';
		} else if(direction === 'down'){
			translation = 'translate('+start.x+','+start.y+')'; 
		} else if(direction === 'left'){
			var xTranslation = start.x-length;
			translation = 'translate('+xTranslation+','+start.y+')';
		}
	
		var domain = function(){
			if(direction === 'right' || direction === 'down'){
				return [scale.min.value.element, scale.max.value.element];
			} else if(direction === 'left' || direction === 'up'){
				return [scale.max.value.element, scale.min.value.element];
			}
		}
	
		var axisScale = d3.scale.linear()
			.domain(domain())
			.range([0, length]);
	
		var axis = d3.svg.axis()
			.scale(axisScale)
			.orient(orientation)
	
		var axisGroup = plot
			.append("g")
			.attr("class", "axis")
			.attr("transform", translation)
			.call(axis);

	
		var draw = function(){
			axisScale.domain(domain())
			axisGroup.call(axis);
		}
	
		draw();
	
		var updateWindow = function(){
			draw();
		}
	
		var axisWindowUpdate = new Hook(null, null, updateWindow);
	
		axisWindowUpdate.subscribe(scale.scaleUpdate);
		
		var removeAxis = function(){
			plot.remove(axisGrop);
		}

		return {axisScale:axisScale, axisWindowUpdate: axisWindowUpdate};		
		}
}
