
var divSpanShot = "#snapshotArea";
var name = "a";

var data = [];
var datafilter = [];


var width = 500;
var height = 300;

var xScale = d3.scale.linear()
  .range([0,width]);
var yScale = d3.scale.linear()
  .range([0, height]);
var scaleColorPie = d3.scale.ordinal().domain(["Undefined", "Male", "Female"]).range(['#66c2a5','#fc8d62','#8da0cb']);


//DC to authors
var dc_author = dc;

var tamMinCirle = 2;
var tamMaxCircle = 4;

var shotSelected = [];
var buckupDataSelected = [];
    buckupDataSelected.push([]);
var selectionData = [];    


var colorsBar = ['#fbb4ae','#b3cde3','#ccebc5'];


var lasso_start = function(){
    lasso.items()
        .attr("r", tamMinCirle)
        .style("fill", null)
        .classed({"not_possible": true, "selected": false});
}    
 
var lasso_draw = function(){
    lasso.items().filter(function(d){return d.possible === true})
        .classed({"not_possible": false, "possible": true});
    lasso.items().filter(function(d){return d.possible === false})
        .classed({"not_possible":true, "possible": false});
}

var lasso_end = function(){
    selectionData = [];
    lasso.items()
        .style("fill", function(d){return "black"});
    lasso.items().filter(function(d){
        if(d.selected === true){
            selectionData.push(d[2]);
        }
        return d.selected === true
    })
        .attr("r", tamMaxCircle)
        .style("fill", "blue");
    lasso.items().filter(function(d){return d.selected === false})
        .classed({"not_possible": false, "posible":false})
        .attr("r", tamMinCirle);

    if(selectionData.length == 0){
        redrawsvgMain(buckupDataSelected.length-1, false);
        //console.log("nada de nada")
    }    
    
}


function btnStartShot(){
    
    if(selectionData.length != 0){
        drawCrossFilterCharts(selectionData);
        buckupDataSelected.push(selectionData);
        shotSelected.push(false)
        newsnapshot(selectionData, data.mat, name, shotSelected.length,divSpanShot)
    }
    selectionData = [];
}

function btnRestShot(){
    var ind = -1;
    for (var i = 0; i < shotSelected.length; i++)
        if(shotSelected[i] == true)
            ind = i;
    if(ind == -1)return;
    //console.log("restart", ind);
    redrawsvgMain(ind, true);
    updatespanshotArrays(ind); 
    selectionData = [];   
}




