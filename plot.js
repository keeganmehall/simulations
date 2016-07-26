var Plot = function(domParent, indVar, depVar){
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
	var linePlot;
	var drawPlot = function(){
		if(linePlot) domParent.removeChild(linePlot.node());
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
		
		linePlot = d3.select(domParent).append('path')
			.attr('d', lineFunction(lineData))
			.attr('stroke', 'black')
			.attr('stroke-width', 2)
			.attr('fill', 'none');
	}
	var linePlotUpdate = new Hook('', this, drawPlot);
	linePlotUpdate.update();
	linePlotUpdate.subscribe(depVar.functionOf(indVar));
	linePlotUpdate.subscribe(indVar.scale().scaleUpdate);
	linePlotUpdate.subscribe(depVar.scale().scaleUpdate);
}
