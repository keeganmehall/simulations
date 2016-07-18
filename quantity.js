var Quantity = function(label, initialValue) {
	var updateValue = function(){
		//console.log('updating quantity '+label);
		//eventually update value if tooltip is open
	}
	this.value = new Hook(initialValue, this, updateValue);
	this.domObjects = []
	
	
	
	this.updateValue = function(){
		
	}
	
	var inputChanged = false;
	
	this.addDomObject = function(domParent) {
		var quan = this;
		var valueTooltip,valueDisplay,sliderTooltip,slider;
		
		//valueDisplay.node().onkeydown = keyDownHandler;
		//console.log('keydown',valueDisplay.onkeydown);
		var valueFocusHandler = function(){
			
			valueDisplay.on('mouseleave', null)
				.on('blur', blurHandler);
			
			slider = d3.select(document.createElement("div"))
			
			slider
				.style('width', '100px')
				.call(
					d3.slider()
						.value(quan.value.element)
						.axis(true).min(0).max(10)
						.on('slide',slideEventHandler)
				)
			sliderTooltip = new Tooltip(slider.node(), 'below', this);
			slider.node().addEventListener('mousedown', sliderMouseDownHandler);
		}		
				
		
		var slideEventHandler = function(e,newValue){
			quan.value.set(newValue);
			inputChanged = false;
			valueDisplay.text(quan.value.element.toPrecision(2));
		}
		
		var mouseEnterHandler = function(){
		
			valueTooltip = new Tooltip(valueDisplay.node(),'covering',this);
			valueDisplay.text(quan.value.element.toPrecision(2))
				.on('mouseleave', mouseLeaveHandler)
				.on('focus', valueFocusHandler)
				.on('input', function(){inputChanged = true});
				
			
			
		}
		
		var mouseLeaveHandler = function(){
			valueTooltip.closeTooltip();
			
		}
		
		var quanFocusHandler = function(){

			valueTooltip = new Tooltip(valueDisplay.node(),'covering',this);
			valueDisplay.text(quan.value.element);
			valueDisplay.node().focus();
		}
		
		var blurHandler = function(){ //on valueDisplay
			valueTooltip.closeTooltip();
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
		
		valueDisplay = d3.select(document.createElement("span"))
			.attr('contenteditable', 'true')
			.on('keydown', keyDownHandler);
			
		d3.select(domParent)
			.append('span')
			.attr('contentEditable', true)
			.text(label)
			.on('mouseenter', mouseEnterHandler)
			.attr('tabindex', 0)
			.on('focus', quanFocusHandler)

		//this.domObjects.push(newDomObject)
	}
	
	/*
	this.subscribe = function(target) {
		target.dependentObjects.push(this)
	}*/
	//this.update = function() {
	//	this.dependentObjects.forEach(function(dependentObject) {
	//		dependentObeject.update()
	//	})
	//}
}

