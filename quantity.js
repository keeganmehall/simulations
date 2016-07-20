var Quantity = function(label, initialValue) {
	var quan = this;
	this.valuesVisible = false;
	this.displays = [];
	var updateValue = function(){
		/*console.log(quan.domObjects, label);
		for(var i=0;i<quan.domObjects.length;i++){
			console.log(quan.domObjects[i].valueTooltip);
			var domObj = quan.domObjects[i].valueTooltip;
			if(domObj){console.log(domObj.visible)}
			if(domObj && domObj.visible){
				console.log(domObj.visible);
				domObj.domObject.textContent = quan.value.element.toPrecision(2);
			}
		}*/
	}
	this.value = new Hook(initialValue, this, updateValue);
	
	
	
	var inputChanged = false;
	
	this.addDisplay = function() {
		var display = {};
		var domObject,valueTooltip,valueDisplay,sliderTooltip,slider;
		
		
		var showSliderTooltip = function(){
			if(!sliderTooltip){
				sliderTooltip = new Tooltip(slider.node(), 'below', domObject.node());
			}
			sliderTooltip.showTooltip();
		}
		
		var showValueTooltip = function(disp){
			console.log('showValueTooltip',disp);
			if(!disp.hasOwnProperty('valueTooltip')){
				disp.valueTooltip = new Tooltip(valueDisplay.node(),'covering',disp.domObject.node());
			}
			disp.valueTooltip.showTooltip();
		}
		
		//valueDisplay.node().onkeydown = keyDownHandler;
		//console.log('keydown',valueDisplay.onkeydown);
		var valueFocusHandler = function(){
			
			valueDisplay.on('mouseleave', null)
				.on('blur', blurHandler);
			
			
			slider.node().addEventListener('mousedown', sliderMouseDownHandler);
		}		
				
		
		var slideEventHandler = function(e,newValue){
			quan.value.set(newValue);
			inputChanged = false;
			valueDisplay.text(quan.value.element.toPrecision(2));
		}
		
		var mouseEnterHandler = function(){
			console.log(quan.displays);
			for(var i=0; i<quan.displays.length;i++){
				showValueTooltip(quan.displays[i]);
			}
			valueDisplay.text(quan.value.element.toPrecision(2))
				.on('mouseleave', mouseLeaveHandler)
				.on('focus', valueFocusHandler)
				.on('input', function(){inputChanged = true});
				
			
			
		}
		
		var mouseLeaveHandler = function(){
			quan.displays.forEach(function(display){
				display.valueTooltip.closeTooltip();
			});
			
		}
		
		var quanFocusHandler = function(){
			quan.displays.forEach(function(display){
				showValueTooltip(display);
			});
			valueDisplay.text(quan.value.element);
			valueDisplay.node().focus();
		}
		
		var blurHandler = function(){ //on valueDisplay
			quan.displays.forEach(function(display){
				display.valueTooltip.closeTooltip();
			});
			sliderTooltip.closeTooltip();
			if(inputChanged){
				console.log('inputChanged');
				var newValue = parseFloat(valueDisplay.node().textContent)
				if(!isNaN(newValue)){
					quan.value.set(newValue);
				}
			}
		}
		
		var keyDownHandler = function(key){
			if(d3.event.keyCode === 13){
				valueDisplay.node().blur();
			}
		}
		
		var sliderMouseDownHandler = function(evt){
			evt.preventDefault();
		}
		
		
		var slider;	
		
		
		domObject = d3.select(document.createElement('span'))
			.attr('contentEditable', true)
			.text(label)
			.on('mouseenter', mouseEnterHandler)
			.attr('tabindex', 0)
			.on('focus', quanFocusHandler);
		
		valueDisplay = d3.select(document.createElement("span"))
			.attr('contenteditable', 'true')
			.on('keydown', keyDownHandler);
			
			
		slider = d3.select(document.createElement("div"))
			
		slider
			.style('width', '100px')
			.call(
				d3.slider()
					.value(quan.value.element)
					.axis(true).min(0).max(10)
					.on('slide',slideEventHandler)
			);
		
		display.domObject = domObject;
		this.displays.push(display)
		
		return domObject.node();
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

