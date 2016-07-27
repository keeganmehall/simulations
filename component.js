var Component = function(input){
	var component = this;
	//label, type, startNode, endNode, parameter, domParent
	for(key in input){
		this[key] = input[key];
	}
	
	if(this.type === 'resistor'){
		var l = 80; // resistor length
		var W = 30; // max width
		var s = 10; // width scale
		var n = 3;
		var lineWidth = 4;
		var w = function(){
			return 0.01+(W - Math.pow(W,1-component.resistance.value.element/s))/2;
		}
	} else if(this.type === 'capacitor'){
		var l = 8;  // distance between capacitor plates
		var W = 40; // max width
		var s = 10; // width scale
		var n = 3;
		var lineWidth = 4;
		var w = function(){
			return 0.01+(W - Math.pow(W,1-component.capacitance.value.element/s))/2;
		}
	} else if(this.type === 'battery'){
		var l = 24;
		var W = 50;
		var s = 10;
		var n = 2;
		var r = 2; //ratio between length of short and long lines
		var lineWidth = 4;
		var w = function(){
			return 0.01+(W - Math.pow(W,1-component.voltage.value.element/s))/2;;
		}
	}
	
	
	var x1 = this.startNode.position.x;
	var x2 = this.endNode.position.x;
	var y1 = this.startNode.position.y;
	var y2 = this.endNode.position.y;
	var g1; // start of gradient; second point on spring 
	var g2; // end of gradient; second to last point on spring
	var diagram;
	
	var widthUpdate = function(){
		//console.log('updating component '+this.label+' width')
		width.element = w();

		diagram.attr("d", lineFunction(calcPath(width.element,l,n,x1,y1,x2,y2)))
	}
	var width = new Hook(w(), this, widthUpdate);

	if(this.type === 'resistor'){
		width.subscribe(this.resistance.value);
	} else if(this.type === 'capacitor'){
		width.subscribe(this.capacitance.value);
	} else if(this.type === 'battery'){
		width.subscribe(this.voltage.value);
	}
	
	
	var updateStartColor = function(){
		//console.log('updating component '+component.label+' start color')
		var newColor = app.voltageScale.getColor(this.parent.startNode.voltage.value.element);
		this.element = newColor;
		startStop.attr("stop-color", newColor);
	}
	
	var updateEndColor = function(){
		//console.log('updating component '+component.label+' end color')
		var newColor = app.voltageScale.getColor(this.parent.endNode.voltage.value.element);
		this.element = newColor;
		endStop.attr("stop-color", newColor);
	}
	
	
	var startColor = new Hook(app.voltageScale.getColor(this.startNode.voltage.value.element), this, updateStartColor);
	startColor.subscribe(this.startNode.voltage.value);
	startColor.subscribe(app.voltageScale.scaleUpdate);
	
	var endColor = new Hook(app.voltageScale.getColor(this.endNode.voltage.value.element), this, updateEndColor);
	endColor.subscribe(this.endNode.voltage.value);
	endColor.subscribe(app.voltageScale.scaleUpdate);
	
	var calcPath;
	
	
	var lineFunction = function(data){
		var svgPathArray = ['M',data[0].x, data[0].y];
		for(var i = 1; i<data.length; i++){
			if(data[i].mx){
				svgPathArray.push('M',data[i].mx,data[i].my);
			}
			svgPathArray.push('L',data[i].x,data[i].y);
		}
		return svgPathArray.join(' ');
	}


	if(this. type === 'resistor'){
		//lineFunction = d3.svg.line()
			//.x(function(d){return d.x})
			//.y(function(d){return d.y})
			//.interpolate('linear');
		
		calcPath = function(w,l,n,x1,y1,x2,y2){
			var L = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
			var dx = l/n*(x2-x1)/L;
			var dy = l/n*(y2-y1)/L;
			var vx = w*(y2-y1)/L
			var vy = w*(x1-x2)/L
			g1 = {x:(L-l)/(2*L)*(x2-x1)+x1, y:(L-l)/(2*L)*(y2-y1)+y1}
			g2 = {x:x2-(L-l)/(2*L)*(x2-x1), y:y2-(L-l)/(2*L)*(y2-y1)}
			var data = [{x:x1,y:y1}, g1]
			for(i=0; i<n; i++){
				data.push({x:(L-l)/(2*L)*(x2-x1)+x1+i*dx+0.25*dx+vx,y:(L-l)/(2*L)*(y2-y1)+y1+i*dy+0.25*dy+vy},
					{x:(L-l)/(2*L)*(x2-x1)+x1+i*dx+0.75*dx-vx,y:(L-l)/(2*L)*(y2-y1)+y1+i*dy+0.75*dy-vy});
			}
			data.push(g2,{x:x2,y:y2})
		
			return data;
		}
		
		this.addDomObject = function(){
		
			diagram = d3.select(this.domParent).insert("path", ":first-child")
				.attr("d", lineFunction(calcPath(width.element,l,n,x1,y1,x2,y2)))
				.attr("stroke", 'url(#'+this.label+'gradient)')
				.attr("stroke-width", lineWidth)
				.attr("fill", "white")
				.attr('fill-opacity', 0.0)
				.style('cursor', 'pointer');
		}
	}else if(this.type === 'capacitor'){ ////////////////Capacitor
		/*lineFunction = function(data){
			var pathString = '';
			for(var i=0;i<4;i++){
				pathString = pathString.concat('M'+data[2*i].x+','+data[2*i].y+'L'+data[2*i+1].x+','+data[2*i+1].y);
			}
			return(pathString);
		}*/
		
		calcPath = function(w,l,n,x1,y1,x2,y2){
			var L = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
			l += lineWidth; //so gradient is not shown
			var vx = w*(y2-y1)/L
			var vy = w*(x1-x2)/L
			g1 = {x:(L-l)/(2*L)*(x2-x1)+x1, y:(L-l)/(2*L)*(y2-y1)+y1}
			g2 = {x:x2-(L-l)/(2*L)*(x2-x1), y:y2-(L-l)/(2*L)*(y2-y1)}
			var data = [{x:x1,y:y1}, {x:g1.x, y:g1.y}];
			data.push({mx:g1.x+vx, my:g1.y+vy, x:g1.x-vx, y:g1.y-vy});
			data.push({mx:g2.x+vx, my:g2.y+vy, x:g2.x-vx, y:g2.y-vy});
			
			data.push({mx:g2.x, my:g2.y ,x:x2, y:y2});
		
			return data;
		}
		
		this.addDomObject = function(){
		
			diagram = d3.select(this.domParent)	
				.append('path')
				.attr("d", lineFunction(calcPath(width.element,l,n,x1,y1,x2,y2)))
				.attr("stroke", 'url(#'+this.label+'gradient)')
				.attr("stroke-width", lineWidth)
				.attr("fill", "white")
				.attr('fill-opacity', 0.0)
				.style('cursor', 'pointer');
		}
	}else if(this.type === 'battery'){
		calcPath = function(w,l,n,x1,y1,x2,y2){
			var L = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
			l += lineWidth; //so gradient is not shown
			var dx = l/n*(x2-x1)/L;
			var dy = l/n*(y2-y1)/L;
			var vx = w*(y2-y1)/L
			var vy = w*(x1-x2)/L
			g3 = {x:(L-l)/(2*L)*(x2-x1)+x1, y:(L-l)/(2*L)*(y2-y1)+y1}; 
			g1 = {x:(L-l/3)/(2*L)*(x2-x1)+x1, y:(L-l/3)/(2*L)*(y2-y1)+y1};
			g2 = {x:x2-(L-l/3)/(2*L)*(x2-x1), y:y2-(L-l/3)/(2*L)*(y2-y1)};
			g4 = {x:x2-(L-l)/(2*L)*(x2-x1), y:y2-(L-l)/(2*L)*(y2-y1)};
			
			var data = [{x:x1,y:y1}, {x:g3.x, y:g3.y}];
			
			var mdps = [g3,g1,g2,g4]; //midpoints; //order is g3,g1,g2,g4 for gradient
			
			for(var i = 0; i<n; i++){
				data.push({mx:mdps[2*i].x+vx/r, my:mdps[2*i].y+vy/r, x:mdps[2*i].x-vx/r, y:mdps[2*i].y-vy/r},
					{mx:mdps[2*i+1].x+vx, my:mdps[2*i+1].y+vy, x:mdps[2*i+1].x-vx, y:mdps[2*i+1].y-vy})
			}
			
			data.push({mx:g4.x, my:g4.y ,x:x2, y:y2});
		
			return data;
		}
		this.addDomObject = function(){
		
			diagram = d3.select(this.domParent)	
				.append('path')
				.attr("d", lineFunction(calcPath(width.element,l,n,x1,y1,x2,y2)))
				.attr("stroke", 'url(#'+this.label+'gradient)')
				.attr("stroke-width", lineWidth)
				.attr("fill", "white")
				.attr('fill-opacity', 0.0)
				.style('cursor', 'pointer');
		}
	}
		
		
	this.addDomObject();
	
	
	var boundingBox = diagram.node().getBBox();
	var gradStartX = (g1.x-boundingBox.x)/boundingBox.width;
	var gradStartY = (g1.y-boundingBox.y)/boundingBox.height;
	var gradEndX = (g2.x-boundingBox.x)/boundingBox.width;
	var gradEndY = (g2.y-boundingBox.y)/boundingBox.height;
	
	var gradient = d3.select(this.domParent)
		.append('defs')
		.append('linearGradient')
		.attr('id', this.label+"gradient");
		
	var startStop = gradient.append('stop')
		.attr('class','firstStop')
		.attr('offset','0%')
		.attr('stop-color', startColor.element);
		
	var endStop = gradient.append('stop')
		.attr('class','lastStop')
		.attr('offset','100%')
		.attr('stop-color', endColor.element);
	
	gradient.attr('x1',gradStartX)
		.attr('y1',gradStartY)
		.attr('x2',gradEndX)
		.attr('y2',gradEndY);
		
	if(this.type === 'resistor'){
		var resistanceTooltipDisplay = component.resistance.addDisplay();
		diagramClickHandler = function(){
			var resistanceTooltip = new Tooltip(resistanceTooltipDisplay, 'over', this);
			var documentClickHandler = function(){
				resistanceTooltip.closeTooltip();
				document.removeEventListener('mousedown', documentClickHandler);
			}
			document.addEventListener('mousedown', documentClickHandler)
		}
	}else if(this.type === 'capacitor'){
		var capacitanceTooltipDisplay = component.capacitance.addDisplay();
		diagramClickHandler = function(){
			var capacitanceTooltip = new Tooltip(capacitanceTooltipDisplay, 'over', this);
			var documentClickHandler = function(){
				capacitanceTooltip.closeTooltip();
				document.removeEventListener('mousedown', documentClickHandler);
			}
			document.addEventListener('mousedown', documentClickHandler)
		}
	}else if(this.type === 'battery'){
		var voltageTooltipDisplay = component.voltage.addDisplay();
		diagramClickHandler = function(){
			var voltageTooltip = new Tooltip(voltageTooltipDisplay, 'over', this);
			var documentClickHandler = function(){
				voltageTooltip.closeTooltip();
				document.removeEventListener('mousedown', documentClickHandler);
			}
			document.addEventListener('mousedown', documentClickHandler)
		}
		this.voltage.link(this.endNode.voltage);
	}
	
	diagram.on('click', diagramClickHandler);	
	
}
