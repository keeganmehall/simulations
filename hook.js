var Hook = function(value, parent, update){
	this.element = value;
	this.update = update;
	this.parent = parent;
	this.dependentObjects = [];
	var stack = [];
	var visited = [];
	var topoSort = function(node){
		visited.push(node);
		for(var i=0; i<node.dependentObjects.length; i++){
			if (visited.indexOf(node.dependentObjects[i]) === -1){
				topoSort(node.dependentObjects[i]);
			}
		}
		stack.push(node);
	}
	var sorted = false;
	this.set = function(newValue){
	
		this.element = newValue;
		if(!sorted){
			topoSort(this);
			//sorted = true;
		}
		for(var i = stack.length-1; i>=0; i-=1){
			stack[i].update();
		}
		
		
	}
	this.subscribe = function(hook){

		hook.dependentObjects.push(this);
	}
}
