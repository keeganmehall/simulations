var Hook = function(value, parent, update){
	this.element = value;
	this.update = update;
	this.parent = parent;
	this.dependentObjects = [];
	this.parentObjects = [];
	var stack = [];
	var visited;
	var topoSort = function(node){
		visited.push(node);
		for(var i=0; i<node.dependentObjects.length; i++){
			if (visited.indexOf(node.dependentObjects[i]) === -1){
				topoSort(node.dependentObjects[i]);
			}
		}
		stack.push(node);
	}
	this.sorted = false;
	this.set = function(newValue){
		
		this.element = newValue;
		if(this.sorted === false){
			stack = [];
			visited = [];
			topoSort(this);
			//this.sorted = true;
		}
		for(var i = stack.length-1; i>=0; i-=1){
			stack[i].update();
		}
		
		
	}
	
	var visitedParents;
	
	var sortParentObjects = function(hook){
		hook.sorted = false;
		hook.parentObjects.forEach(function(parentObj){
			if(visitedParents.indexOf(parentObj) === -1){
				visitedParents.push(parentObj);
				sortParentObjects(parentObj);
			}
		});
	}
	
	this.subscribe = function(hook){
		if(this.dependentObjects.indexOf(hook) === -1){
			this.parentObjects.push(hook);
		}
		if(hook.dependentObjects.indexOf(this) === -1){
			hook.dependentObjects.push(this);
		}
		visitedParents = [];
		sortParentObjects(this);
	}
	
	this.unsubscribe = function(hook){
		if(this.dependentObjects.indexOf(hook) !== -1){
			hook.dependentObjects.splice(hook.dependentObjects.indexOf(this));
		}
		if(this.dependentObjects.indexOf(hook) === -1){
			this.parentObjects.splice(this.parentObjects.indexOf(hook));
		}
		visitedParents = [];
		sortParentObjects(this);
	}
	
	this.unsubscribeAll = function(){
		var hook = this;
		this.parentObjects.forEach(function(parentObj){
			hook.unsubscribe(parentObj);
		})
	}
}
