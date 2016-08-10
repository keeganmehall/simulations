var maxVoltage = new Quantity('VMax', 10, 'V');
var minVoltage = new Quantity('VMin', 0, 'V');
var app = {voltageScale: new Scale(minVoltage,maxVoltage, true), uids: []};

window.onload = function(){
//Quantity
var quanDisplay = document.getElementById('quan');

var startTime = new Quantity('tMin', 0, 's', null);
var endTime = new Quantity('tMax', 30, 's', null);
var timeScale = new Scale(startTime, endTime);


/*


var plotXMin = new Quantity('x min', 0);
var plotXMax = new Quantity('x max', 100);
app.voltageScale.addAxis(document.getElementById('plot'), {x:30, y:410}, 400, 'up');
var plotYMin = new Quantity('x min', 0);
var plotYMax = new Quantity('x max', 100);
timeScale.addAxis(document.getElementById('plot'), {x:30, y:410}, 400, 'right');
*/


//circuit


var circuitDiagram = document.getElementById("circuitDiagram");

var time = new Quantity('t',0, 's', timeScale);

//voltages
var vcEditable = new Bool(false);
var vbEditable = new Bool(false);

var va = new Quantity('Va', 10, 'V', app.voltageScale);
var vb = new Quantity('Vb', 0, 'V', app.voltageScale, vbEditable);
var vc = new Quantity('Vc', 0, 'V', app.voltageScale, vcEditable);
var vd = new Quantity('Vd', 0, 'V', app.voltageScale);
var ve = new Quantity('Ve', 10, 'V', app.voltageScale);

//nodes
var nodeA = new Node("nodeA", {x:20,y:20}, va, circuitDiagram);
var nodeB = new Node("nodeB", {x:280,y:20}, vb, circuitDiagram);
var nodeC = new Node("nodeC", {x:280,y:280}, vc, circuitDiagram);
var nodeD = new Node("nodeD", {x:20, y:280}, vd, circuitDiagram, 'hidden');
var nodeE = new Node("nodeE", {x:20, y:150}, ve, circuitDiagram, 'hidden');

//resistor
var minResist = new Quantity('null', 0, 'Ohm');
var maxResist = new Quantity('null', 10, 'Ohm');
var resistanceScale = new Scale(minResist, maxResist);

var minCap = new Quantity('null', 0, 'F');
var maxCap = new Quantity('null', 10, 'F');
var capacitanceScale = new Scale(minCap, maxCap);

var r1 = new Quantity('r1', 2, 'Ohm', resistanceScale);
var r2 = new Quantity('R', 5, 'Ohm', resistanceScale);
var c1 = new Quantity('C', 3, 'F', resistanceScale);
var switchOpen = new Bool(true);

var batteryVoltage = new Quantity('V', 10, 'V', app.voltageScale);


var cap1Input = {label:'capacitor1', type:'capacitor', startNode:nodeB, endNode:nodeC, capacitance:c1, domParent:circuitDiagram}
var resistor2Input = {label:'resistor2', type:'resistor', startNode:nodeA , endNode:nodeB, resistance:r2, domParent:circuitDiagram}
var batteryInput = {label:'battery', type:'battery', startNode:nodeD, endNode:nodeE, voltage:batteryVoltage, domParent:circuitDiagram}
var switchInput = {label:'switch', type:'switch', startNode:nodeE, endNode:nodeA, open:switchOpen, domParent:circuitDiagram}
var wireInput = {label:'wire', type:'wire', startNode:nodeC, endNode:nodeD, domParent:circuitDiagram}

//var resistor1 = new Resistor("resistor1", nodeA , nodeB ,r1,circuitDiagram);
var capacitor1 = new Component(cap1Input);

var battery = new Component(batteryInput);

var resistor2 = new Component(resistor2Input);
//var capacitor1 = new Component("capacitor1", 'capacitor', nodeB , nodeC ,c1,circuitDiagram);


var switch1 = new Component(switchInput);

var wire = new Component(wireInput);

var sourceFunction = new SourceFunction({type:'node voltage', sourceNode:nodeA, time:time})
var mainCircuit = new RCCircuit({sourceFunction:sourceFunction, middle:nodeB, ground:nodeC, resistance:resistor2.resistance, capacitance:capacitor1.capacitance})


var diffEqInput = {time:time, circuit:mainCircuit}
var diffEq = new Integrate(diffEqInput);


//plot
var plotSVG = document.getElementById('plot');
var plotDiv = document.getElementById('plotDiv');

plotDiv.appendChild(minVoltage.addDisplay());
d3.select(plotDiv).append('span').text('   ');
plotDiv.appendChild(maxVoltage.addDisplay());
d3.select(plotDiv).append('span').text('   ');
plotDiv.appendChild(startTime.addDisplay());
d3.select(plotDiv).append('span').text('   ');
plotDiv.appendChild(endTime.addDisplay());



var mainPlot = new Plot(plotSVG, timeScale, app.voltageScale);
mainPlot.addPlot(time, vb);
mainPlot.addPlot(time, va);


var vaOfTime = va.functionOf(time);
console.log(vaOfTime);


var playbackSpeed = new Quantity('Playback Speed', 1);

quan.appendChild(time.addDisplay());
d3.select(quanDisplay).append('span').text('   ');

quan.appendChild(time.animationRunning.addToggle('Play', 'Pause'));
d3.select(quanDisplay).append('span').text('   ');
quanDisplay.appendChild(playbackSpeed.addDisplay());
d3.select(quanDisplay).append('span').text('   ');
quan.appendChild(time.addDisplay());
d3.select(quanDisplay).append('span').text('   ');




var animation = new Animation(time, playbackSpeed);
}
