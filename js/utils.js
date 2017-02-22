


/*GROUPS VIS--------------------START*/


var lassogroup;


//dimensions of main chart    
var marginGroup = {top: 20, right: 20, bottom: 30, left: 40};


var heightGroup = 400 - marginGroup.top - marginGroup.bottom;//300
var widthGroup = 600 - marginGroup.left - marginGroup.right;//500
//tag html main chart
var tagMainGroup = "#areaMainsvgGroup";

//snapshot historial groups
var divSpanShotGroup = "#snapshotAreaGroup";
var nameGroup = "g";

//size circle
var tamMinCirleGroup = 8;//2
var tamMaxCircleGroup = 12//7.5;

//Scales
var xScaleGroup = d3.scale.linear()
    .range([10,widthGroup]);

var yScaleGroup = d3.scale.linear()
    .range([10, heightGroup]);

//Scale tam circle groups
var tamCircleScaleGroup = d3.scale.linear().domain([0,50])
    .range([5, 25]);

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


//variable para puntos groups filtrados de CF
var tabledimGroup = [];
var tabledimsGroup = [];

//variables que no se voy a  usar
var datafilterGroups;

//colors charts
var colorsBar = ['#fbb4ae','#b3cde3','#ccebc5'];
var scaleColorPieGroup = d3.scale.ordinal().domain(["Undefined", "Male", "Female"]).range(['#66c2a5','#fc8d62','#8da0cb']);

//colors to bar chart in crossfilter
var colorslegendGroup = ["RGB(0, 0, 255)", "RGB(0, 255, 255)", "RGB(0, 255, 0)", "RGB(255, 255, 0)","RGB(255, 0, 0)"];

var opacityCircleGroup = 1;

var colorCircleDefault = "white";

var colorCluster = ["rgb(117,234,182)", "rgb(5,149,122)", "rgb(191,218,212)", "rgb(27,81,29)", "rgb(145,218,77)", "rgb(7,77,101)", "rgb(48,138,201)", "rgb(112,122,228)", "rgb(148,3,147)", "rgb(239,106,222)", "rgb(75,53,150)", "rgb(246,176,236)", "rgb(64,7,217)", "rgb(182,108,150)", "rgb(97,59,79)", "rgb(250,27,252)", "rgb(94,146,34)", "rgb(222,218,82)", "rgb(118,72,13)", "rgb(251,165,92)", "rgb(168,56,30)", "rgb(252,44,68)", "rgb(44,245,43)", "rgb(139,147,136)"]


//este es parte de la nueva version sin lasso
//variable del ultimo seleccionado
var lastCircle = 0;
var lastcategoriaSelected = 1;


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
            .style("fill", function(d){return colorCircleDefault});
        lassoGroup.items().filter(function(d){
            if(d.selected === true){
                selectionDataGroups.push(d[2]);
            }
            return d.selected === true
        })
            .attr("r", tamMaxCircleGroup)
            .style("fill", "blue")
            .style("opacity", opacityCircleGroup);
        lassoGroup.items().filter(function(d){return d.selected === false})
            .classed({"not_possible": false, "posible":false})
            .attr("r", tamMinCirleGroup)
            .style("stroke", "black");

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
        redrawsvgMainGroup(buckupDataSelectedGroup.length-1, false);
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


function drawPoints_groups_filterChartCF(){
    //console.log("miren estos selec groups", tabledim.top(Infinity));
    var auxall = tabledimGroup.top(Infinity);
    
    redrawsvgMainGroup(buckupDataSelectedGroup.length-1, false);
    
    for (var i = 0; i < auxall.length; i++) {
                d3.select("#pointGroup"+(parseInt(auxall[i].id)))
                    .style("stroke", "black")
                    //.attr("r", tamMaxCircleGroup);
    };
}


function getnumSenio(id){
    var aux = ["very young","young", "experienced", "senior", "very senior"];
    var pos = id - 15;

    return pos;
}

function getnumRate(id){
    var aux = ["not active", "less active", "active", "very active", "extreme active"];
    var pos = id - 20;

    return pos;
}




//drawVISGroup("data/groupsnecluster5000.json", "", marginGroup, widthGroup, heightGroup);
/*GROUPS VIS--------------------END*/