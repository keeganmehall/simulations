var Component = function(input){
	var component = this;
	//label, type, startNode, endNode, parameter, domParent, (voltage source: function)
	for(key in input){
		this[key] = input[key];
	}
	
	if(this.type === 'resistor'){
		var l = 80; // resistor length
		var W = 30; // max width
		var s = function(){return component.resistance.scale().max.value.element}; // width scale
		var n = 3;
		var lineWidth = 4;
		var w = function(){
			return W/4+(W/2 - Math.pow(W/2,1-component.resistance.value.element/s()))/2;
		}
	} else if(this.type === 'capacitor'){
		var l = 8;  // distance between capacitor plates
		var W = 40; // max width
		var s = function(){return component.capacitance.scale().max.value.element}; // width scale
		var n = 3;
		var lineWidth = 4;
		var w = function(){
			return W/4+(W/2 - Math.pow(W/2,1-component.capacitance.value.element/s()))/2;
		}
	} else if(this.type === 'voltageSource'){
		var l = 40;
		//var W = 50;
		var s = function(){return component.voltage.scale().max.value.element};
		var n = 2; //Do not change
		var r = 2; //ratio between length of short and long lines
		var lineWidth = 4;
		var w = function(){
			return 0;
		}
	} else if(this.type === 'switch'){
		var l = 40;
		var W = 50;
		var angle = 30;
		var lineWidth = 4;
		var w = function(){return 0};
	} else if(this.type === 'wire'){
		var W = 0;
		var lineWidth = 4;
		var w = function(){return 0};
	}
	

	var x1 = this.startNode.position.x;
	var x2 = this.endNode.position.x;
	var y1 = this.startNode.position.y;
	var y2 = this.endNode.position.y;
	var g1; // start of gradient; second point on spring 
	var g2; // end of gradient; second to last point on spring
	var diagram;
	var diagramG = d3.select(this.domParent)
		.insert('g', ':first-child');
	diagramG.style('cursor', 'pointer');
	
	var widthUpdate = function(){
		//console.log('updating component '+this.label+' width')
		width.element = w();

		diagram.attr("d", lineFunction(calcPath(width.element,l,n,x1,y1,x2,y2)))
	}
	var width = new Hook(w(), this, widthUpdate);
	
	if(this.type === 'resistor'){
		width.subscribe(this.resistance.value);
		width.subscribe(this.resistance.scale().scaleUpdate);
	} else if(this.type === 'capacitor'){
		width.subscribe(this.capacitance.value);
		width.subscribe(this.capacitance.scale().scaleUpdate);
	} else if(this.type === 'voltageSource'){
		width.subscribe(this.voltage.value);
		width.subscribe(this.voltage.scale().scaleUpdate);
	} else if(this.type === 'switch'){
		var transformSwitch;
		var updateSwitch = function(){
			transformSwitch();
			if(component.open.value.element === true){
				component.startNode.voltage.unlink(component.endNode.voltage);
			} else if(component.open.value.element === false){
				component.startNode.voltage.link(component.endNode.voltage);
			}
		}
		var switchUpdate = new Hook(this.open.value.element, this, updateSwitch);
		switchUpdate.subscribe(this.open.value);
	}
	
	

	
	

	
	var calcPath;
	
	
	var lineFunction = function(data){
		var svgPathArray = ['M',data[0].x, data[0].y];
		for(var i = 1; i<data.length; i++){
			if(data[i].mx){
				svgPathArray.push('M',data[i].mx,data[i].my);
			}
			if(data[i].x){
				svgPathArray.push('L',data[i].x,data[i].y);
			}
			if(data[i].c1x){
				svgPathArray.push('C');
				svgPathArray.push(data[i].c1x,data[i].c1y);
				svgPathArray.push(data[i].c2x,data[i].c2y);
				svgPathArray.push(data[i].c3x,data[i].c3y);
			}
		}
		return svgPathArray.join(' ');
	}
	
	var startColor;
	var endColor;
	
	var L = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	if(this. type === 'resistor'){
		//lineFunction = d3.svg.line()
			//.x(function(d){return d.x})
			//.y(function(d){return d.y})
			//.interpolate('linear');
		
		calcPath = function(w,l,n,x1,y1,x2,y2){
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
		
			diagram = diagramG
				.append("path")
				.attr("d", lineFunction(calcPath(width.element,l,n,x1,y1,x2,y2)))
				.attr("stroke", 'url(#'+this.label+'gradient)')
				.attr("stroke-width", lineWidth)
				.attr("fill", "white")
				.attr('fill-opacity', 0.0)
				.style('cursor', 'pointer');
		}
		
		var updateStartColor = function(){
			var newColor = app.voltageScale.getColor(this.parent.startNode.voltage.value.element);
			this.element = newColor;
			startStop.attr("stop-color", newColor);
		}
	
		var updateEndColor = function(){
			var newColor = app.voltageScale.getColor(this.parent.endNode.voltage.value.element);
			this.element = newColor;
			endStop.attr("stop-color", newColor);
		}
		
		
		startColor = new Hook(app.voltageScale.getColor(this.startNode.voltage.value.element), this, updateStartColor);
		endColor = new Hook(app.voltageScale.getColor(this.endNode.voltage.value.element), this, updateEndColor);
		
	}else if(this.type === 'capacitor'){ ////////////////Capacitor
		/*lineFunction = function(data){
			var pathString = '';
			for(var i=0;i<4;i++){
				pathString = pathString.concat('M'+data[2*i].x+','+data[2*i].y+'L'+data[2*i+1].x+','+data[2*i+1].y);
			}
			return(pathString);
		}*/
		
		calcPath = function(w,l,n,x1,y1,x2,y2){
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

			diagram = diagramG
				.append('path')
				.attr("d", lineFunction(calcPath(width.element,l,n,x1,y1,x2,y2)))
				.attr("stroke", 'url(#'+this.label+'gradient)')
				.attr("stroke-width", lineWidth)
				.attr("fill", "white")
				.attr('fill-opacity', 0.0)
		}
		
		
		var updateStartColor = function(){
			var newColor = app.voltageScale.getColor(this.parent.startNode.voltage.value.element);
			this.element = newColor;
			startStop.attr("stop-color", newColor);
		}
	
		var updateEndColor = function(){
			var newColor = app.voltageScale.getColor(this.parent.endNode.voltage.value.element);
			this.element = newColor;
			endStop.attr("stop-color", newColor);
		}
		
		startColor = new Hook(app.voltageScale.getColor(this.startNode.voltage.value.element), this, updateStartColor);
		endColor = new Hook(app.voltageScale.getColor(this.endNode.voltage.value.element), this, updateEndColor);
		
		
	}else if(this.type === 'voltageSource'){
		calcPath = function(w,l,n,x1,y1,x2,y2){
			g1 = {x:(L-l)/(2*L)*(x2-x1)+x1, y:(L-l)/(2*L)*(y2-y1)+y1}; 
			g2 = {x:x2-(L-l)/(2*L)*(x2-x1), y:y2-(L-l)/(2*L)*(y2-y1)};
			

			return [{x:x1,y:y1}, {x:x2, y:y2}];
		}
		var nx = (y2-y1)/L;
		var ny = (x1-x2)/L;
		var px = (x2-x1)/L;
		var py = (y2-y1)/L;
		var midX = (x1+x2)/2;
		var midY = (y1+y2)/2;
		var line1, line2;
		this.addDomObject = function(){
			calcPath(w,l,n,x1,y1,x2,y2);
			var line1 = diagramG.append('line')
				.attr('x1', x1)
				.attr('y1', y1)
				.attr('x2', g1.x)
				.attr('y2', g1.y)
				.attr('stroke-width', lineWidth);

			var line2 = diagramG.append('line')
				.attr('x1', g2.x)
				.attr('y1', g2.y)
				.attr('x2', x2)
				.attr('y2', y2)
				.attr('stroke-width', lineWidth);
				
			diagram = diagramG.append('circle')
				.attr('cx', (x1+x2)/2)
				.attr('cy', (y1+y2)/2)
				.attr('r', l/2)
				.attr('fill', 'white')
				.attr("stroke", 'url(#'+this.label+'gradient)')
				.attr("stroke-width", lineWidth);
		
		
			var updateStartColor = function(){
				var newColor = app.voltageScale.getColor(this.parent.startNode.voltage.value.element);
				this.element = newColor;
				line1.attr('stroke', newColor);
				startStop.attr("stop-color", newColor);
			}

			var updateEndColor = function(){
				var newColor = app.voltageScale.getColor(this.parent.endNode.voltage.value.element);
				this.element = newColor;
				line2.attr('stroke', newColor);
				endStop.attr("stop-color", newColor);
			}
			
			var typeSpecObjs = [];
			
			var setType = function(){
				var type = input.function.type;
				for(var i = 0; i < typeSpecObjs.length; i++){
					diagramG.node().removeChild(typeSpecObjs[i]);
				}
				typeSpecObjs = [];
				if(type === 'sine'){
					var width = 10;
					var height = 12;
					var lineData = [{x: midX + nx * width, y:midY + ny * width},
						{
							c1x: midX + nx * width / 3 + px * height,
							c1y: midY + ny * width / 3 + py * height,
							c2x: midX - nx * width / 3 - px * height,
							c2y: midY - ny * width / 3 - py * height,
							c3x: midX - nx * width,
							c3y: midY - ny * width
						}
					];
					var ac = document.createElementNS("http://www.w3.org/2000/svg", "path");
					ac.setAttribute('d', lineFunction(lineData));
					ac.setAttribute('stroke', 'black');
					ac.setAttribute('fill', 'none');
					ac.setAttribute('stroke-width', '2px');
					diagramG.node().appendChild(ac);
					typeSpecObjs.push(ac);
				}else if(type === 'constant' || type === 'node voltage'){
					var size = 10/2;
					var spread = 0.25*l;
					
					var plusLineData = [{x: midX + px * (spread - size), y: midY + py * (spread - size)},
						{x: midX + px * (spread + size), y: midY + py * (spread + size)},
						{mx: midX + px * spread + nx * size, my: midY + py * spread + ny * size,
							x: midX + px * spread - nx * size, y: midY + py * spread - ny * size
						}];
					var plus = document.createElementNS("http://www.w3.org/2000/svg", "path");
					plus.setAttribute('d', lineFunction(plusLineData));
					plus.setAttribute('stroke', 'black');
					plus.setAttribute('fill', 'none');
					plus.setAttribute('stroke-width', '2px');
					diagramG.node().appendChild(plus);
					typeSpecObjs.push(plus);
					
					var minusLineData = [
							{x: midX - px * spread + nx * size, y: midY - py * spread + ny * size},
							{x: midX - px * spread - nx * size, y: midY - py * spread - ny * size}
						];
					var minus = document.createElementNS("http://www.w3.org/2000/svg", "path");
					minus.setAttribute('d', lineFunction(minusLineData));
					minus.setAttribute('stroke', 'black');
					minus.setAttribute('fill', 'none');
					minus.setAttribute('stroke-width', '2px');
					diagramG.node().appendChild(minus);
					typeSpecObjs.push(minus);
				}
			}
			
			setType();
			
			var typeUpdate = new Hook(null, component, setType);
			typeUpdate.subscribe(input.function.typeUpdate);
		
		
			startColor = new Hook(app.voltageScale.getColor(this.startNode.voltage.value.element), this, updateStartColor);
			endColor = new Hook(app.voltageScale.getColor(this.endNode.voltage.value.element), this, updateEndColor);
		}
		
		
		
	} else if(this.type === 'switch'){		
		this.addDomObject = function(){
			g1 = {x:x1+(x2-x1)*(1-l/L)/2,
				y:y1+(y2-y1)*(1-l/L)/2};
			g2 = {x:x1+(x2-x1)*(1+l/L)/2,
				y:y1+(y2-y1)*(1+l/L)/2};
		
			var line1 = diagramG.append('line')
				.attr('x1', x1)
				.attr('y1', y1)
				.attr('x2', g1.x)
				.attr('y2', g1.y)
				.attr('stroke-width', lineWidth);
			var line2 = diagramG.append('line')
				.attr('x1', g1.x)
				.attr('y1', g1.y)
				.attr('x2', g2.x)
				.attr('y2', g2.y)
				.attr('stroke-width', lineWidth);
			var line3 = diagramG.append('line')
				.attr('x1', g2.x)
				.attr('y1', g2.y)
				.attr('x2', x2)
				.attr('y2', y2)
				.attr('stroke-width', lineWidth);
			var p1 = diagramG.append('circle')
				.attr('cx', g1.x)
				.attr('cy', g1.y)
				.attr('r', lineWidth)
				.attr('fill', 'white')
				.attr('stroke-width', lineWidth/2);
			var p2 = diagramG.append('circle')
				.attr('cx', g2.x)
				.attr('cy', g2.y)
				.attr('r', lineWidth)
				.attr('fill', 'white')
				.attr('stroke-width', lineWidth/2);
			
			transformSwitch = function(){
				if(component.open.value.element === true){
					var transformOrigin = g1.x.toString()+'px '+g1.y.toString()+'px';
					line2.style('transform-origin', transformOrigin);
					line2.style('transform', 'rotate('+angle+'deg)');
					line2.style('transition', 'transform 0.1s');
				} else if(component.open.value.element === false){
					line2.style('transform', 'none');
				}
			};
		
			var updateStartColor = function(){
				var newColor = app.voltageScale.getColor(this.parent.startNode.voltage.value.element);
				this.element = newColor;
				line1.attr('stroke', newColor);
				line2.attr('stroke', newColor);
				p1.attr('stroke', newColor);
			}
	
			var updateEndColor = function(){
				var newColor = app.voltageScale.getColor(this.parent.endNode.voltage.value.element);
				this.element = newColor;
				line3.attr('stroke', newColor);
				p2.attr('stroke', newColor);
			}
			
			startColor = new Hook(app.voltageScale.getColor(this.startNode.voltage.value.element), this, updateStartColor);
			endColor = new Hook(app.voltageScale.getColor(this.endNode.voltage.value.element), this, updateEndColor);
			startColor.update();
			endColor.update();
			switchUpdate.update();
		}
	} else if(this.type === 'wire'){
		this.addDomObject = function(){
			diagram = diagramG.append('line')
				.attr('x1',x1)
				.attr('x2',x2)
				.attr('y1',y1)
				.attr('y2',y2)
				.attr('stroke-width', lineWidth);
			var updateColor = function(){
				var newColor = app.voltageScale.getColor(this.parent.startNode.voltage.value.element);
				this.element = newColor;
				diagram.attr('stroke', newColor);
			}
			startColor = new Hook(app.voltageScale.getColor(this.startNode.voltage.value.element), this, updateColor);
			endColor = new Hook(app.voltageScale.getColor(this.endNode.voltage.value.element), this, updateColor);
			startColor.update();
		}
	}
		
		
	this.addDomObject();
	diagramG.append('line')
		.attr('x1', x1+(x2-x1)/6)
		.attr('x2', x2+(x1-x2)/6)
		.attr('y1', y1+(y2-y1)/6)
		.attr('y2', y2+(y1-y2)/6)
		.attr('stroke-width', 1.5*W)
		.attr('stroke', 'white')
		.attr('stroke-opacity', 0);
	
	
	startColor.subscribe(component.startNode.voltage.value);	
	endColor.subscribe(component.endNode.voltage.value);
	
	
	startColor.subscribe(app.voltageScale.scaleUpdate);
	endColor.subscribe(app.voltageScale.scaleUpdate);
	
	
	
	//this.startColor = startColor;
	//this.endColor = endColor;
	
	if(this.type === 'resistor' || this.type === 'capacitor' || this.type === 'voltageSource'){
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
		}
		
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
	}else if(this.type === 'voltageSource'){
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
	} else if(this.type === 'switch'){
		diagramClickHandler = function(){
			component.open.toggle();
		}
	} else if(this.type === 'wire'){
		diagramClickHandler = function(){}
		this.startNode.voltage.link(this.endNode.voltage);
	}
	
	diagramG.on('click', diagramClickHandler);	
	
}
