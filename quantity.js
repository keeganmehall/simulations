var Quantity = function(label, initialValue, unit, scale) {
	var quan = this;
	if(!unit){
		unit = '';
	}
	this.scale = function(){
		if(scale){
			return scale;
		} else{
			var newScaleMin = new Quantity('', quan.value.element-10, null, null);
			var newScaleMax = new Quantity('', quan.value.element+10, null, null);
			return new Scale(newScaleMin, newScaleMax);
			
		}
	}
	this.dependsOn = []
	this.functionOf = function(indVar){
		for(var i = 0; i<quan.dependsOn.length; i++){
			if(this.dependsOn[i].independent === indVar){
				return this.dependsOn[i].func;
			}
		}
	};
	this.valuesVisible = false;
	this.displays = [];
	
	this.linkedQuantities = [];
	
	var updateValue = function(){
		for(var i=0;i<quan.displays.length;i++){
			if(quan.displays[i].valueTooltip){
				quan.displays[i].valueDisplay.textContent = quan.value.element.toPrecision(2) + unit;
			}
		}
		quan.linkedQuantities.forEach(function(linkedQuantity){
			linkedQuantity.value.element = quan.value.element;
		});
	}
	this.value = new Hook(initialValue, this, updateValue);
	
	
	
	var inputChanged = false;
	
	this.addDisplay = function() {
		var display = {};
		var domObject,valueTooltip,valueDisplay,sliderTooltip,slider;
		
		
		
		
		var valueFocusHandler = function(){
			
			for(var i=0; i<quan.displays.length;i++){
				quan.displays[i].valueDisplay.removeEventListener('mouseleave', mouseLeaveHandler);
			}
			
			
			var slider = createSlider();
			
			display.sliderTooltip = new Tooltip(slider.node(), 'below', display.valueDisplay);
			slider.node().addEventListener('mousedown', sliderMouseDownHandler);
		}		
				
		
		var slideEventHandler = function(e,newValue){
			quan.value.set(newValue);
			inputChanged = false;
		}
		
		var mouseEnterHandler = function(){
			for(var i=0; i<quan.displays.length;i++){
				quan.displays[i].valueTooltip = new Tooltip(quan.displays[i].valueDisplay, 'covering', quan.displays[i].domObject);
				quan.displays[i].valueDisplay.textContent = quan.value.element.toPrecision(2)+unit;
				quan.displays[i].valueDisplay.addEventListener('input', function(){inputChanged = true});
			}
			display.valueDisplay.addEventListener('mouseleave', mouseLeaveHandler);
			
				
			
			
		}
		
		var mouseLeaveHandler = function(){
			for(var i=0; i<quan.displays.length;i++){
				quan.displays[i].valueTooltip.closeTooltip();
			}

			
		}
		
		var quanFocusHandler = function(){
			for(var i=0; i<quan.displays.length;i++){
				quan.displays[i].valueTooltip = new Tooltip(quan.displays[i].valueDisplay, 'covering', quan.displays[i].domObject);
				quan.displays[i].valueTooltip.domObject.textContent = quan.value.element.toPrecision(2)+unit;
				quan.displays[i].valueTooltip.domObject.addEventListener('focus', valueFocusHandler);
				quan.displays[i].valueTooltip.domObject.addEventListener('input', function(){inputChanged = true});
			}
			display.valueTooltip.domObject.focus();
		}
		
		var blurHandler = function(){ //on valueDisplay
			for(var i=0; i<quan.displays.length;i++){
				quan.displays[i].valueTooltip.closeTooltip();
				if(quan.displays[i].sliderTooltip){
					quan.displays[i].sliderTooltip.closeTooltip();
					delete quan.displays[i].sliderTooltip;
				}
			}
			
			if(inputChanged){
				var newValue = parseFloat(display.valueDisplay.textContent)
				if(!isNaN(newValue)){
					quan.value.set(newValue);
				}
			}
		}
		
		var keyDownHandler = function(e){
			if(e.keyCode === 13){
				display.valueDisplay.blur();
			}
		}
		
		var sliderMouseDownHandler = function(evt){
			evt.preventDefault();
		}
		
			
		
		
		display.domObject = document.createElement('span');
		display.domObject.contentEditable = 'true';
		display.domObject.textContent = label;
		display.domObject.addEventListener('mouseenter', mouseEnterHandler);
		display.domObject.tabindex = '0';
		display.domObject.addEventListener('focus', quanFocusHandler);
		
		display.valueDisplay = document.createElement("span");
		display.valueDisplay.contenteditable = 'true';
		display.valueDisplay.addEventListener('keydown', keyDownHandler);
		display.valueDisplay.contentEditable = 'true';
		display.valueDisplay.addEventListener('focus', valueFocusHandler);
		display.valueDisplay.addEventListener('blur', blurHandler);
			
			
		var createSlider = function(){
			var slider = d3.select(document.createElement("div"))
			slider
				.style('width', '100px')
				.style('background-color', 'white')
				.call(
					d3.slider()
						.axis(true).min(quan.scale().min.value.element).max(quan.scale().max.value.element)
						.value(quan.value.element)
						.on('slide',slideEventHandler)
				);
			return slider;
		}
		
		this.displays.push(display)
		
		return display.domObject;
	}
	
	
	this.link = function(otherQuantity){
		this.linkedQuantities.push(otherQuantity);
		otherQuantity.linkedQuantities.push(this);
		this.value.subscribe(otherQuantity.value);
		otherQuantity.value.subscribe(this.value);
	}
	
	
	this.addButton = function(value, label){
		var button = document.createElement('button');
		button.textContent = label;
		button.addEventListener('click', function(){
			quan.value.set(value);
		});
		return button;
	}
}

