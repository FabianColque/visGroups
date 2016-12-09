


/*GROUPS VIS--------------------START*/


var lassogroup;


//dimensions of main chart    
var marginGroup = {top: 20, right: 20, bottom: 30, left: 40};


var heightGroup = 300 - marginGroup.top - marginGroup.bottom;
var widthGroup = 500 - marginGroup.left - marginGroup.right;
//tag html main chart
var tagMainGroup = "#areaMainsvgGroup";

//snapshot historial groups
var divSpanShotGroup = "#snapshotAreaGroup";
var nameGroup = "g";

//size circle
var tamMinCirleGroup = 2;
var tamMaxCircleGroup = 7.5;

//Scales
var xScaleGroup = d3.scale.linear()
    .range([0,widthGroup]);

var yScaleGroup = d3.scale.linear()
    .range([0, heightGroup]);
//DC groups
var dc_groups = dc;

//variables Groups
var dataGroups;
var dataGroups_inGroups;
var dataAuthors_inGroups;
var dataConferences_inGroups;

var selectionDataGroups = [];
var buckupDataSelectedGroup = [];
    buckupDataSelectedGroup.push([]);
var shotSelectedGroup = [];

//variables que no se voy a  usar
var datafilterGroups;

//colors charts
var colorsBar = ['#fbb4ae','#b3cde3','#ccebc5'];
var scaleColorPieGroup = d3.scale.ordinal().domain(["Undefined", "Male", "Female"]).range(['#66c2a5','#fc8d62','#8da0cb']);

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
            redrawsvgMainGroup(buckupDataSelectedGroup.length-1, false);
            //console.log("nada de nada")
        }    
        
}

//functions buttons

function btnStartShotGroup(){
    
    if(selectionDataGroups.length != 0){
        drawCrossFilterChartsGroups(selectionDataGroups);
        buckupDataSelectedGroup.push(selectionDataGroups);
        //console.log(buckupDataSelectedGroup);
        shotSelectedGroup.push(false)
        newsnapshotGroup(selectionDataGroups, dataGroups.mat, nameGroup, shotSelectedGroup.length,divSpanShotGroup)
    }
    selectionDataGroups = [];

}

function getNameConference(id){
    var aux = parseInt(id);
    return dataConferences_inGroups[aux-100].name;
}

function btnRestShotGroup(){
    var ind = -1;
    for (var i = 0; i < shotSelectedGroup.length; i++)
        if(shotSelectedGroup[i] == true)
            ind = i;
    if(ind == -1)return;
    //console.log("restart", ind);
    redrawsvgMainGroup(ind, true);
    updatespanshotArraysGroup(ind); 
    selectionDataGroups = [];   
}



//drawVISGroup("data/groupsnecluster5000.json", "", marginGroup, widthGroup, heightGroup);
/*GROUPS VIS--------------------END*/