var app = {voltageScale: new ColorScale(0,10)};
app.resistorLength = 120;
app.resistorMaxWidth = 30;
app.resistanceScale = 10;
app.resistorN = 3;


window.onload = function(){
//Quantity
var massQuan = new Quantity('m', 5)
massQuan.addDomObject()


//circuit
var circuitDiagram = document.getElementById("circuitDiagram");

var va = new Quantity('Va', 5);
va.addDomObject();
var vb = new Quantity('Vb', 10);
vb.addDomObject();
var vc = new Quantity('Vc', 0);
vc.addDomObject();

var nodeA = new Node("nodeA", {x:20,y:20}, circuitDiagram);
nodeA.setVoltage(va);
var nodeB = new Node("nodeB", {x:280,y:280}, circuitDiagram);
nodeB.setVoltage(vb);
var nodeC = new Node("nodeC", {x:280,y:20}, circuitDiagram);
nodeC.setVoltage(vc);
//resistor
new Resistor("resistor1", nodeA , nodeB ,100,circuitDiagram);
new Resistor("resistor2", nodeA , nodeC ,100,circuitDiagram);
new Resistor("resistor3", nodeB , nodeC ,100,circuitDiagram);
}
