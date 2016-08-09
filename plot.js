var Plot = function(domParent, indVar, depVar, showCurrentPos){
	//var indVar = [];
	//var depVar = [];
	var linePlots = [];
	var width = domParent.getBoundingClientRect().width;
	var height = domParent.getBoundingClientRect().height;
	this.addDependentObject = function(dependentObject){
		
	}
	
	var origin = {x:30, y:height-30}
	indVarScale = indVar.scale().addAxis(domParent, origin, width-60, 'right');
	depVarScale = depVar.scale().addAxis(domParent, origin, height-60, 'up');
	////////////////////////////////////////////////////////FIX TOPO SORT
	var linePlot = d3.select(domParent).append('path')
		.attr('stroke', 'black')
		.attr('stroke-width', 2)
		.attr('fill', 'none');
		
	var drawPlot = function(){
		//if(linePlot) domParent.removeChild(linePlot.node());
		var indMin = indVar.scale().min.value.element;
		var indMax = indVar.scale().max.value.element;
		var solution = depVar.functionOf(indVar);
		var lineData = [];
		for(var x = indMin; x < indMax; x+=(indMax-indMin)/100){
			lineData.push({x:indVarScale.axisScale(x)+origin.x, y:depVarScale.axisScale(solution.element.at(x))+height-origin.y});
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

	var svgBoundingRect = domParent.getBoundingClientRect();
	var dotDragHandler = function(e){
		e.preventDefault();
		var svgX = e.clientX-svgBoundingRect.left;
		var svgY = e.clientY-svgBoundingRect.top;
		var plotXFrac = (svgX-origin.x)/(indVarScale.axisEnd.x-origin.x);
		//var plotYFrac = (svgY-origin.y)/(depVarScale.axisEnd.y-origin.y);
		if(plotXFrac >= 0 && plotXFrac <= 1){ 
			var newIndVarValue = plotXFrac*(indVar.scale().max.value.element - indVar.scale().min.value.element) + indVar.scale().min.value.element;
			indVar.value.set(newIndVarValue);
		} else if(plotXFrac >= -0.1 && plotXFrac <= 0.1){
			indVar.value.set(indVar.scale().min.value.element);
		} else if(plotXFrac >= 0.9 && plotXFrac <= 1.1){
			indVar.value.set(indVar.scale().max.value.element);
		} else{
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
		.attr('stroke-width', '10')
		.attr('stroke', 'black')
		.attr('stroke-opacity', 0)
		.style('cursor', 'pointer');
		
	dot.node().addEventListener('mousedown', dotMouseDownHandler);
	var updateDotPos = function(){
		var dotXPos = indVarScale.axisScale(indVar.value.element)+origin.x;
		var dotYPos = depVarScale.axisScale(depVar.value.element)+height-origin.y;
		dot.attr('cx', dotXPos)
			.attr('cy', dotYPos);
	}
	dotPosUpdate = new Hook(null, null, updateDotPos);
	dotPosUpdate.subscribe(indVar.value);
	dotPosUpdate.subscribe(depVar.value);
	updateDotPos();
}
