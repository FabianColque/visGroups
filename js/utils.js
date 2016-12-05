


/*GROUPS VIS--------------------START*/


var lassogroup;


//dimensions of main chart    
var marginGroup = {top: 20, right: 20, bottom: 30, left: 40};


var heightGroup = 300 - marginGroup.top - marginGroup.bottom;
var widthGroup = 500 - marginGroup.left - marginGroup.right;
//tag html main chart
var tagMainGroup = "#areaMainsvgGroup";

//size circle
var tamMinCirleGroup = 2;
var tamMaxCircleGroup = 7.5;

//Scales
var xScaleGroup = d3.scale.linear()
    .range([0,widthGroup]);

var yScaleGroup = d3.scale.linear()
    .range([0, heightGroup]);


//variables Groups
var dataGroups_inGroups;
var dataAuthors_inGroups;
var selectionDataGroups = [];
var buckupDataSelectedGroup = [];
    buckupDataSelectedGroup.push([]);

//variables que no se voy a  usar
var datafilterGroups;

//Functions lasso start, draw and end

var lasso_startGroup = function(){
        lassoGroup.items()
            .attr("r", tamMinCirleGroup)
            .style("fill", null)
            .classed({"not_possible": true, "selected": false});
}    
     
var lasso_drawGroup = function(){
        lassoGroup.items().filter(function(d){return d.possible === true})
            .classed({"not_possible": false, "possible": true});
        lassoGroup.items().filter(function(d){return d.possible === false})
            .classed({"not_possible":true, "possible": false});
}

var lasso_endGroup = function(){
        selectionDataGroups = [];
        lassoGroup.items()
            .style("fill", function(d){return "black"});
        lassoGroup.items().filter(function(d){
            if(d.selected === true){
                selectionDataGroups.push(d[2]);
            }
            return d.selected === true
        })
            .attr("r", tamMaxCircleGroup)
            .style("fill", "blue");
        lassoGroup.items().filter(function(d){return d.selected === false})
            .classed({"not_possible": false, "posible":false})
            .attr("r", tamMinCirleGroup);

        if(selectionDataGroups.length == 0){
            //redrawsvgMain(buckupDataSelected.length-1, false);
            console.log("nada de nada")
        }    
        console.log("do you", selectionDataGroups.length)
}

//functions buttons

function btnStartShotGroup(){
    
    if(selectionDataGroups.length != 0){
        //drawCrossFilterCharts(selectionData);
        buckupDataSelectedGroup.push(selectionDataGroups);
        console.log(buckupDataSelectedGroup);
        //shotSelected.push(false)
        //newsnapshot(selectionData, data.mat, "holaspe2", shotSelected.length,divSpanShot)
    }
    selectionDataGroups = [];
}

function btnLoadData_inGroups(){
    loadDataGroups("data/group1JSON.json", "data/authorsjson.json")
}

drawVISGroup("data/group3_norm_projection10000.json", "", marginGroup, widthGroup, heightGroup);
//drawVISGroup("data/groupsnecluster5000.json", "", marginGroup, widthGroup, heightGroup);
/*GROUPS VIS--------------------END*/