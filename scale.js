var Scale = function(minimum, maximum, colorScale){
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
		var uid = app.uids.push(app.uids.length)-1;
		var plot = d3.select(domParent)

		
		var orientation;
		if(direction === 'up' || direction === 'down'){
			orientation = 'left';
		}else if(direction === 'left' || direction === 'right'){
			orientation = 'bottom';
		}
		
		
		//Create the Scale we will use for the Axis

		var translation;
		var end;
		var grad;
		var rect;
		var axisWidth = 6;
		if(direction === 'right'){
			translation = 'translate('+start.x+','+start.y+')';
			end = {x:start.x+length, y:start.y};
			grad = {x1:0, y1:0.5, x2:1, y2:0.5};
			rect = {x:start.x, y:start.y, width:length, height:axisWidth};
		} else if(direction === 'up'){
			var yTranslation = start.y-length;
			translation = 'translate('+start.x+','+yTranslation+')';
			end = {x:start.x, y:start.y-length};
			grad = {x1:0.5, y1:1, x2:0.5, y2:0};
			rect = {x:end.x-axisWidth, y:end.y, width:axisWidth, height:length};
		} else if(direction === 'down'){
			translation = 'translate('+start.x+','+start.y+')'; 
			end = {x:start.x, y:start.y+length};
			grad = {x1:0.5, y1:0, x2:0.5, y2:1};
			rect = {x:start.x-axisWidth, y:start.y, width:axisWidth, height:length};
		} else if(direction === 'left'){
			var xTranslation = start.x-length;
			translation = 'translate('+xTranslation+','+start.y+')';
			end = {x:start.x+length, y:start.y};
			grad = {x1:1, y1:0.5, x2:0, y2:0.5};
			rect = {x:end.x, y:end.y, width:length, height:axisWidth};
		}
	
		var domain = function(){
			if(direction === 'right' || direction === 'down'){
				return [scale.min.value.element, scale.max.value.element];
			} else if(direction === 'left' || direction === 'up'){
				return [scale.max.value.element, scale.min.value.element];
			}
		}
	
		
		if(colorScale){
			var gradient = d3.select(domParent)
				.append('defs')
				.append('linearGradient')
				.attr('id', uid+"gradient");
		
			var startStop = gradient.append('stop')
				.attr('class','firstStop')
				.attr('offset','0%')
				.attr('stop-color', this.getColor(min));
		
			var endStop = gradient.append('stop')
				.attr('class','lastStop')
				.attr('offset','100%')
				.attr('stop-color', this.getColor(max));
	
			gradient.attr('x1',grad.x1)
				.attr('y1',grad.y1)
				.attr('x2',grad.x2)
				.attr('y2',grad.y2);
			
			
			if(orientation === 'left'){
				var scaleTrans = {x:-3, y:0};
			}else if(orientation === 'bottom'){
				var scaleTrans = {x:0, y:3};
			}
			var colorScalerect = plot.append('rect')
				.attr('x', rect.x)
				.attr('y', rect.y)
				.attr('width', rect.width)
				.attr('height', rect.height)
				.attr('fill', 'url(#'+uid+'gradient)')
		}
		
		
		var axisScale = d3.scale.linear()
			.domain(domain())
			.range([0, length]);
	
		var axis = d3.svg.axis()
			.scale(axisScale)
			.orient(orientation);
		
			
			
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
