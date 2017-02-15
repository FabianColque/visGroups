
var divSpanShot = "#snapshotArea";
var name = "a";

var data = [];
var datafilter = [];
var dados;

var width = 600;
var height = 400;

var xScale = d3.scale.linear()
  .range([0,width]);
var yScale = d3.scale.linear()
  .range([0, height]);
var scaleColorPie = d3.scale.ordinal().domain(["Undefined", "Male", "Female"]).range(['#66c2a5','#fc8d62','#8da0cb']);


//DC to authors
var dc_author = dc;

var tamMinCirle = 1;
var tamMaxCircle = 4;

var shotSelected = [];
var buckupDataSelected = [];
    buckupDataSelected.push([]);
var selectionData = [];    

//filtro about crossfilter yo draw authors
var tabledim = [];
var tabledims = [];
var exist_authors_charts = false;
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
    exist_authors_charts = true;
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


function category_ratePub(d){
            if(d<=1.47){
                return 0;
            }
            else if(d>1.47 && d<=2.48){
                return 1;
            }
            else if(d >2.48 && d<=3.71){
                return 2;
            }
            else if(d > 3.71 && d<= 6){
                return 3;
            }
            else{
                return 4;
            }
        }

        function category_seniority(d){
            if(d<=14){
                return 0;
            }
            else if(d>14 && d<=28){
                return 1;
            }
            else if(d >28 && d<=53){
                return 2;
            }
            else if(d > 53 && d<= 107){
                return 3;
            }
            else{
                return 4;
            }
        }

        function category_nbpub(d){
            ////console.log("mira", d);
            if(d<=8){
                return 0;
            }
            else if(d>8 && d<=12){
                return 1;
            }
            else if(d >12 && d<=15){
                return 2;
            }
            else if(d > 15 && d<= 21){
                return 3;
            }
            else{
                return 4;
            }
        }

function drawPoints_authors_filterChartCF(){
    //console.log("miren estos selec", tabledim.top(Infinity));
    var auxall = tabledim.top(Infinity);
    
    redrawsvgMain(buckupDataSelected.length-1, false);
    
    for (var i = 0; i < auxall.length; i++) {
                d3.select("#pointAuthor"+(parseInt(auxall[i].author_id)-1))
                    .style("fill", "red")
                    .attr("r", tamMaxCircle);
    };
}