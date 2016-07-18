var app = {voltageScale: new ColorScale(0,10)};
app.resistorLength = 120;
app.resistorMaxWidth = 30;
app.resistanceScale = 10;
app.resistorN = 3;


window.onload = function(){
//Quantity
var quanDisplay = document.getElementById('quan');
//var massQuan = new Quantity('m', 5)
//massQuan.addDomObject()


//circuit

var circuitDiagram = document.getElementById("circuitDiagram");

var time = new Quantity('t',0);
time.addDomObject(quanDisplay);

var va = new Quantity('Va', 10);
//va.addDomObject(quanDisplay);
var vb = new Quantity('Vb', 0);
//vb.addDomObject(quanDisplay);
var vc = new Quantity('Vc', 10);
//vc.addDomObject(quanDisplay);

var nodeA = new Node("nodeA", {x:20,y:20}, va, circuitDiagram);

var nodeB = new Node("nodeB", {x:280,y:20}, vb, circuitDiagram);

var nodeC = new Node("nodeC", {x:280,y:280}, vc, circuitDiagram);

//resistor
var r1 = new Quantity('r1', 2);
//r1.addDomObject(quanDisplay);
var r2 = new Quantity('R', 5);
//r2.addDomObject(quanDisplay);
var c1 = new Quantity('C', 3);
//c1.addDomObject(quanDisplay);

var cap1Input = {label:'capacitor1', type:'capacitor', startNode:nodeB, endNode:nodeC, capacitance:c1, domParent:circuitDiagram}
var resistor2Input = {label:'resistor2', type:'resistor', startNode:nodeA , endNode:nodeB, resistance:r2, domParent:circuitDiagram}

//var resistor1 = new Resistor("resistor1", nodeA , nodeB ,r1,circuitDiagram);
var resistor2 = new Component(resistor2Input);
//var capacitor1 = new Component("capacitor1", 'capacitor', nodeB , nodeC ,c1,circuitDiagram);
var capacitor1 = new Component(cap1Input);

var sourceFunction = new SourceFunction({type:'constant', sourceNode:nodeA})
var mainCircuit = new RCCircuit({sourceFunction:sourceFunction, middle:nodeB, ground:nodeC, resistance:resistor2.resistance, capacitance:capacitor1.capacitance})


var diffEqInput = {time:time.value, circuit:mainCircuit}
var diffEq = new Integrate(diffEqInput);

var playbackSpeed = new Quantity('Playback', 0);

d3.select(quanDisplay).append('span').text('   ')
playbackSpeed.addDomObject(quanDisplay);
var animation = new Animation(time, playbackSpeed);
}
