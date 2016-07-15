var Hook = function(value, parent, update){
	this.element = value;
	this.update = update;
	this.parent = parent;
	this.dependentObjects = [];
	this.set = function(newValue){
		this.element = newValue;
		this.update();
		this.dependentObjects.forEach(function(obj){
			obj.update();
		});
		
	}
	this.subscribe = function(hook){

		hook.dependentObjects.push(this);
	}
}
