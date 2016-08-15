var Plot = function(domParent, xScale, yScale){
	//var indVar = [];
	//var depVar = [];
	var linePlots = [];
	var width = domParent.getBoundingClientRect().width;
	var height = domParent.getBoundingClientRect().height;
	
	
	var origin = {x:55, y:height-40}
	xAxisScale = xScale.addAxis(domParent, origin, width-80, 'right');
	yAxisScale = yScale.addAxis(domParent, origin, height-60, 'up');
	var svgBoundingRect = domParent.getBoundingClientRect();
	var xEnd = xAxisScale.axisEnd;
	var yEnd = yAxisScale.axisEnd;
	
	var lineLabels = [];
	var compareFunc = function(a, b){return a.linePosY-b.linePosY}
	var labHeight = 18;
	var labelPosX = xEnd.x;
	
	var positionLineLabels = function(){
		var offsets = [];
		lineLabels = lineLabels.sort(compareFunc);
		for(var i = 0; i<lineLabels.length; i++){
			if(lineLabels[i-1]){
				if(lineLabels[i].linePosY - (lineLabels[i-1].linePosY+offsets[i-1]) < labHeight){
					offsets.push(labHeight-(lineLabels[i].linePosY - (lineLabels[i-1].linePosY+offsets[i-1])));
				} else{
					offsets.push(0);
				}
			}else{
				offsets.push(0);
			}
		}
		for(var i=0; i<lineLabels.length; i++){
			lineLabels[i].domObject.setAttribute('x', labelPosX);
			lineLabels[i].domObject.setAttribute('y', (lineLabels[i].linePosY + offsets[i]));
		}
	}
	var lineLabelsPosHook = new Hook(null, null, positionLineLabels);
	
	
	this.addPlot = function(indVar, depVar){
		if(indVar.scale() !== xScale || depVar.scale() !== yScale){
			console.log('scales do not match');
			return;
		}
		
		var linePlot = d3.select(domParent).insert('path', ':first-child')
			.attr('stroke', 'black')
			.attr('stroke-width', 2)
			.attr('fill', 'none');
		
		var lineData;
		var drawPlot = function(){
			//if(linePlot) domParent.removeChild(linePlot.node());
			var indMin = indVar.scale().min.value.element;
			var indMax = indVar.scale().max.value.element;
			var solution = depVar.functionOf(indVar);
			lineData = [];
			for(var x = indMin; x < indMax; x+=(indMax-indMin)/100){
				lineData.push({x:xAxisScale.axisScale(x)+origin.x, y:yAxisScale.axisScale(solution.element.at(x))+yEnd.y});
			}
			var lineFunction = d3.svg.line()
				.x(function(d){return d.x})
				.y(function(d){return d.y})
				.interpolate('linear');
		
		
				linePlot.attr('d', lineFunction(lineData));
			
		}
		var linePlotUpdate = new Hook('', this, drawPlot);
		linePlotUpdate.update();
		linePlotUpdate.subscribe(depVar.functionOf(indVar));
		linePlotUpdate.subscribe(indVar.scale().scaleUpdate);
		linePlotUpdate.subscribe(depVar.scale().scaleUpdate);
		
		var setValFromMouse = function(x, indVar){
			var svgX = x-svgBoundingRect.left;
			var plotXFrac = (svgX-origin.x)/(xAxisScale.axisEnd.x-origin.x);
			if(plotXFrac >= 0 && plotXFrac <= 1){ 
				var newIndVarValue = plotXFrac*(indVar.scale().max.value.element - indVar.scale().min.value.element) + indVar.scale().min.value.element;
				indVar.value.set(newIndVarValue);
			} else if(plotXFrac >= -0.1 && plotXFrac <= 0.1){
				indVar.value.set(indVar.scale().min.value.element);
			} else if(plotXFrac >= 0.9 && plotXFrac <= 1.1){
				indVar.value.set(indVar.scale().max.value.element);
			} else{
				return false;
			}
			return true;
		}
		
		var dotDragHandler = function(e){
			e.preventDefault();
			if(setValFromMouse(e.clientX, indVar) === false){
				document.removeEventListener('mousemove', dotDragHandler);
				document.body.style.cursor = null;
			}
		
		}
		var dotMouseDownHandler = function(e){
			e.preventDefault();
			indVar.animationRunning.value.set(false);
			document.addEventListener('mousemove', dotDragHandler);
			document.body.style.cursor = 'pointer';
			document.addEventListener('mouseup', function(){
				document.removeEventListener('mousemove', dotDragHandler);
				document.body.style.cursor = null;
			});
		}
		var dot = d3.select(domParent).append('circle')
			.attr('r','6')
			.attr('fill', 'red')
			.attr('stroke-width', '30')
			.attr('stroke', 'black')
			.attr('stroke-opacity', 0)
			.style('cursor', 'pointer');
		
		dot.node().addEventListener('mousedown', dotMouseDownHandler);
		var updateDotPos = function(){
			var dotXPos = xAxisScale.axisScale(indVar.value.element)+origin.x;
			var dotYPos = yAxisScale.axisScale(depVar.value.element)+yEnd.y;
			dot.attr('cx', dotXPos)
				.attr('cy', dotYPos);
		}
		dotPosUpdate = new Hook(null, null, updateDotPos);
		dotPosUpdate.subscribe(indVar.value);
		dotPosUpdate.subscribe(depVar.value);
		dotPosUpdate.subscribe(depVar.scale().scaleUpdate);
		dotPosUpdate.subscribe(indVar.scale().scaleUpdate);
		updateDotPos();
		
		domParent.addEventListener('click', function(e){
			indVar.animationRunning.value.set(false);
			setValFromMouse(e.clientX, indVar);
		})
		var lineLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		lineLabel.textContent = depVar.label;
		lineLabel.setAttribute('class', 'mt');
		var lineLabelObj = {domObject:lineLabel}
		var updateLineLabelPos = function(){
			lineLabelObj.linePosY = lineData[lineData.length-1].y;
		}
		
		var lineLabelPosUpdate = new Hook(null, null, updateLineLabelPos);
		lineLabelPosUpdate.subscribe(linePlotUpdate);
		lineLabelsPosHook.subscribe(lineLabelPosUpdate);
		lineLabels.push(lineLabelObj);
		domParent.appendChild(lineLabel);
		updateLineLabelPos();
		positionLineLabels();
	}
	
	
	
		
}
