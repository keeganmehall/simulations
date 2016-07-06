

var Quantity = function(label, initialValue) {
	this.dependentObjects = []
	this.value = initialValue
	this.domObjects = []
	
	this.setValue = function(newValue) {
		console.log(newValue);
		if(isNaN(newValue) === false){
			this.value = newValue
			this.update()
		}
	}
	
	this.addDomObject = function() {
		var quan = this;
		var valueTooltip,valueDisplay;
		
		//valueDisplay.node().onkeydown = keyDownHandler;
		//console.log('keydown',valueDisplay.onkeydown);
		var valueFocusHandler = function(){
			
			valueDisplay.on('mouseleave', null)
				.on('blur', blurHandler);
		}		
				
		var mouseEnterHandler = function(){
			valueTooltip = new Tooltip(valueDisplay.node(),'over',this);
			valueDisplay.text(quan.value)
				.on('mouseleave', mouseLeaveHandler)
				.on('focus', valueFocusHandler);
		}
		
		var mouseLeaveHandler = function(){
			valueTooltip.closeTooltip();
			
		}
		
		var quanFocusHandler = function(){

			valueTooltip = new Tooltip(valueDisplay.node(),'over',this);
			valueDisplay.text(quan.value);
			valueDisplay.node().focus();
		}
		
		var blurHandler = function(){ //on valueDisplay
			console.log("blur");
			valueTooltip.closeTooltip();
			quan.setValue(parseFloat(valueDisplay.node().textContent));
		}
		
		var keyDownHandler = function(key){
			console.log('keypress',d3.event);
			if(d3.event.keyCode === 13){
				valueDisplay.node().blur();
			}
		}
		
		
		valueDisplay = d3.select(document.createElement("span"))
			.attr('contenteditable', 'true')
			.on('keydown', keyDownHandler);
			
		d3.select('#quan')
			.append('span')
			.attr('contentEditable', true)
			.text(label)
			.on('mouseenter', mouseEnterHandler)
			.attr('tabindex', 0)
			.on('focus', quanFocusHandler)

		//this.domObjects.push(newDomObject)
	}
	
	
	this.subscribe = function(target) {
		target.dependentObjects.push(this)
	}
	this.update = function() {
		this.dependentObjects.forEach(function(dependentObject) {
			dependentObeject.update()
		})
	}
}

