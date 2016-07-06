var Resistor = function(label,startNode,endNode,resistance,domParent){
	
	this.label = label;
	this.startNode = startNode;
	this.endNode = endNode;
	this.resistance = resistance;
	this.domParent = domParent;
	var l = app.resistorLength;
	var W = app.resistorMaxWidth;
	var w = (W - Math.pow(W,1-resistance/app.resistanceScale))/2;
	if(isNaN(w)){w = 20};
	var n = app.resistorN;
	var x1 = startNode.position.x;
	var x2 = endNode.position.x;
	var y1 = startNode.position.y;
	var y2 = endNode.position.y;
	var g1; // start of gradient; second point on spring 
	var g2; // end of gradient; second to last point on spring
	var diagram;
	var startColor = app.voltageScale.getColor(startNode.voltage.value);
	var endColor = app.voltageScale.getColor(endNode.voltage.value);
	
	var calcPath = function(w,l,n,x1,y1,x2,y2){
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
	
	var lineFunction = d3.svg.line()
		.x(function(d){return d.x})
		.y(function(d){return d.y})
		.interpolate('linear');


	this.addDomObject = function(){
		
		diagram = d3.select(this.domParent).append("path")
			.attr("d", lineFunction(calcPath(w,l,n,x1,y1,x2,y2)))
			.attr("stroke", 'url(#'+this.label+'gradient)')
			.attr("stroke-width", 4)
			.attr("fill", "none");

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
		
	gradient.append('stop')
		.attr('class','firstStop')
		.attr('offset','0%')
		.attr('stop-color', startColor);
		
	gradient.append('stop')
		.attr('class','lastStop')
		.attr('offset','100%')
		.attr('stop-color', endColor);
	
	gradient.attr('x1',gradStartX)
		.attr('y1',gradStartY)
		.attr('x2',gradEndX)
		.attr('y2',gradEndY);
		
	
		
	
}
