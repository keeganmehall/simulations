/*var maxVoltage = new Quantity('VMax', 10, 'V');
var minVoltage = new Quantity('VMin', 0, 'V');
var app = {voltageScale: new Scale(minVoltage,maxVoltage, true), uids: []};

window.onload = function(){

var startTime = new Quantity('tMin', 0, 's', null);
var endTime = new Quantity('tMax', 30, 's', null);
var timeScale = new Scale(startTime, endTime);

var testQuan = new Quantity('test', 0, 's', timeScale);



document.getElementById('quan').appendChild(testQuan.addDisplay());

var slider = new Slider({quantity:testQuan, domParent:document.getElementById('quan')});
}*/


var Slider = function(input){
	var uid = app.uids.push(app.uids.length)-1;
	var width;
	var defMin = 0;
	var defMax = 10;
	var handleWidth = 20;
	var handleHeight = 15;
	var handlePos = 0;
	var clickOffset;
	var scale = input.quantity.scale();
	var quantity = input.quantity;
	if(input.width){
		width = input.width;
	} else{width = 100}
	var domParent = input.domParent;
	var sliderDragged = false;
	
	var sliderSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	sliderSVG.style.width = width+handleWidth;
	sliderSVG.style.height = handleHeight+20;
	
	domParent.appendChild(sliderSVG);
	var svgLocationLeft = sliderSVG.getBoundingClientRect().left+domParent.getBoundingClientRect().left;
	var sliderScale = scale.addAxis(sliderSVG, {x:handleWidth/2, y:handleHeight}, width, 'right');
	
	var gradient = d3.select(sliderSVG)
		.append('defs')
		.append('linearGradient')
		.attr('id', uid+"gradient");

	var startStop = gradient.append('stop')
		.attr('class','firstStop')
		.attr('offset','0%')
		.attr('stop-color', '#cccccc');

	var endStop = gradient.append('stop')
		.attr('class','lastStop')
		.attr('offset','100%')
		.attr('stop-color', '#888888');

	gradient.attr('x1', '0.5')
		.attr('y1',0)
		.attr('x2',0.5)
		.attr('y2',1);
	
	var handle = d3.select(sliderSVG).append('rect')
		.attr('width', handleWidth-1)
		.attr('class', 'slider-handle')
		.attr('height', handleHeight)
		.attr('x', 0.5)
		.attr('y', 2)
		.attr('fill', 'url(#'+uid+'gradient)')
		.attr('rx', 3)
		.attr('ry', 3)
		.attr('stroke-width', 0.5)
		.attr('stroke', 'gray')
		.style('cursor', 'pointer');
		
	
	var updateSliderPos = function(){
		handlePos = sliderScale.axisScale(quantity.value.element)
		handle.style('transform', 'translate('+handlePos+'px,0px)');
	}
	
	var sliderPosHook = new Hook(null, null, updateSliderPos);
	sliderPosHook.subscribe(quantity.value);
	
	
	var setValFromMouse = function(x, quan, clickOffset){
		var svgX = x - (svgLocationLeft + clickOffset);
		var plotXFrac = (svgX)/(width);
		if(plotXFrac >= 0 && plotXFrac <= 1){ 
			var newValue = plotXFrac*(scale.max.value.element - scale.min.value.element) + scale.min.value.element;
			quan.value.set(newValue);
		} else if(plotXFrac >= -0.1 && plotXFrac <= 0.1){
			quan.value.set(scale.min.value.element);
		} else if(plotXFrac >= 0.9 && plotXFrac <= 1.1){
			quan.value.set(scale.max.value.element);
		} else{
			return false;
		}
		return true;
	}
	
	
	var mouseUpHandler = function(e){
		document.removeEventListener('mousemove', mouseMoveHandler);
		document.removeEventListener('mouseup', mouseUpHandler);
		clickOffset = handleWidth/2;
		document.body.style.cursor = null;
	}
	
	var mouseMoveHandler = function(e){
		if(setValFromMouse(e.clientX, quantity, clickOffset) === false){
			mouseUpHandler(e);
			quantity.inputChanged = false;
		} else{
			sliderDragged = true;
		}
	}
	
	handle.node().addEventListener('mousedown', function(e){
		svgLocationLeft = sliderSVG.getBoundingClientRect().left;
		quantity.animationRunning.value.set(false);
		document.body.style.cursor = 'pointer';
		clickOffset = e.clientX - handlePos - svgLocationLeft;
		document.addEventListener('mousemove', mouseMoveHandler);
		document.addEventListener('mouseup', mouseUpHandler);
	});
	
	sliderSVG.addEventListener('mousedown', function(){
		sliderDragged = false;
	});
	
	sliderSVG.addEventListener('click', function(e){
		if(sliderDragged === false){
			svgLocationLeft = sliderSVG.getBoundingClientRect().left;
			quantity.animationRunning.value.set(false);
			setValFromMouse(e.clientX, quantity, handleWidth/2);
		}
	})
	updateSliderPos();
}
