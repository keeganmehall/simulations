var maxVoltage = new Quantity('VMax', 10, 'V');
var minVoltage = new Quantity('VMin', 0, 'V');
var app = {voltageScale: new Scale(minVoltage,maxVoltage, 'V', 'V', true), uids: []};

window.onload = function(){
//Quantity
var quanDisplay = document.getElementById('quan');

var startTime = new Quantity('tMin', 0, 's', null);
var endTime = new Quantity('tMax', 15, 's', null);
var timeScale = new Scale(startTime, endTime, 't', 's', false);





var circuitDiagram = document.getElementById("circuitDiagram");

var time = new Quantity('t',0, 's', timeScale);

//voltages
var vcEditable = new Bool(false);
var vbEditable = new Bool(false);
var vaEditable = new Bool(false);

var va = new Quantity('Va', 5, 'V', app.voltageScale, vaEditable);
var vb = new Quantity('Vb', 0, 'V', app.voltageScale, vbEditable);
var vc = new Quantity('Vc', 0, 'V', app.voltageScale, vcEditable);
var vd = new Quantity('Vd', 0, 'V', app.voltageScale);
var ve = new Quantity('Ve', 10, 'V', app.voltageScale);

//nodes
var nodeA = new Node("nodeA", {x:40,y:20}, va, circuitDiagram);
var nodeB = new Node("nodeB", {x:280,y:20}, vb, circuitDiagram);
var nodeC = new Node("nodeC", {x:280,y:260}, vc, circuitDiagram);
var nodeD = new Node("nodeD", {x:40, y:260}, vd, circuitDiagram, 'hidden');

//components
var minResist = new Quantity('null', 0, 'Ohm');
var maxResist = new Quantity('null', 10, 'Ohm');
var resistanceScale = new Scale(minResist, maxResist, 'R', 'Ohm', false);

var minCap = new Quantity('null', 0, 'F');
var maxCap = new Quantity('null', 1, 'F');
var capacitanceScale = new Scale(minCap, maxCap, 'C', 'F', false);

var r2 = new Quantity('R', 4, 'Ohm', resistanceScale);
var c1 = new Quantity('C', 0.5, 'F', capacitanceScale);


var batteryVoltage = new Quantity('Vs', 8, 'V', app.voltageScale);

var sourceFunction = new ForcingFn({type:'node voltage', forcedQuan:batteryVoltage, time:time})

var cap1Input = {label:'capacitor1', type:'capacitor', startNode:nodeB, endNode:nodeC, capacitance:c1, domParent:circuitDiagram}
var resistor2Input = {label:'resistor2', type:'resistor', startNode:nodeA , endNode:nodeB, resistance:r2, domParent:circuitDiagram}
var vSourceInput = {label:'vSource', type:'voltageSource', startNode:nodeD, endNode:nodeA, voltage:batteryVoltage, domParent:circuitDiagram, function:sourceFunction}

var wireInput = {label:'wire', type:'wire', startNode:nodeC, endNode:nodeD, domParent:circuitDiagram}


var capacitor1 = new Component(cap1Input);

var voltageSource = new Component(vSourceInput);

var resistor2 = new Component(resistor2Input);





var wire = new Component(wireInput);


var mainCircuit = new RCCircuit({sourceFunction:sourceFunction, middle:nodeB, ground:nodeC, resistance:resistor2.resistance, capacitance:capacitor1.capacitance})


var diffEqInput = {time:time, circuit:mainCircuit}
var diffEq = new Integrate(diffEqInput);


//plot
var plotSVG = document.getElementById('plot');
var plotDiv = document.getElementById('plotDiv');

plotDiv.appendChild(minVoltage.addDisplay());
plotDiv.appendChild(maxVoltage.addDisplay());
plotDiv.appendChild(startTime.addDisplay());
plotDiv.appendChild(endTime.addDisplay());



var mainPlot = new Plot(plotSVG, timeScale, app.voltageScale);
mainPlot.addPlot(time, vb);
mainPlot.addPlot(time, batteryVoltage);


var vaOfTime = va.functionOf(time);


var playbackSpeed = new Quantity('Playback Speed', 1);

quan.appendChild(time.addDisplay());

quan.appendChild(time.animationRunning.addToggle('Play', 'Pause'));
quanDisplay.appendChild(time.addButton(0, 't=0'));
quanDisplay.appendChild(playbackSpeed.addButton(1/2, '1/2x'));
quanDisplay.appendChild(playbackSpeed.addButton(1, '1x'));
quanDisplay.appendChild(playbackSpeed.addButton(2, '2x'));


document.body.appendChild(sourceFunction.addMenu());


var animation = new Animation(time, playbackSpeed);
}
