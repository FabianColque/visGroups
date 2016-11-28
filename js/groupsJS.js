
function drawVISGroup(filegroups, fileauthors){
    console.log("entre a grupos")
    //tag html main chart
    var tagMain = "#areaMainsvgGroup";

    //dimensions of main chart    
    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var width = 500 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;                          

    //Scales
    var xScaleGroup = d3.scale.linear()
        .range([0,width]);

    var yScaleGroup = d3.scale.linear()
        .range([0, height]);

    //size circle
    var tamMinCirle = 2;
    var tamMaxCircle = 7.5;    

    //LASSO
    var lassoGroup;

    //data(grupos) seleccionados -  array of position groups

    //load file data main projection
    var data;
    d3.json(filegroups, function(dat){
        data = dat;
        xScaleGroup.domain(d3.extent(dat.mat.map(function(d){return d[0]})));
        yScaleGroup.domain(d3.extent(dat.mat.map(function(d){return d[1]})));
        //console.log("Scales", xScaleGroup.domain(), yScaleGroup.domain());
        drawGroup();
        //shotSelected.push(false);
        //newsnapshot([], data.mat, "holaspe", shotSelected.length, divSpanShot)
    })        
    
    function drawGroup(){
        var svgGroup = d3.select(tagMain)
            .append('svg')
            .attr("class", "mainsvgGroup")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            //.call(brush);
        var graph = svgGroup.append('g');
        
        var moddatamatGroup = data.groups.map(function(d,i){var f = data.mat[i]; f.push(i);return f;});
        
        var points = graph.selectAll('.pointGroup').data(moddatamatGroup);
        points.enter().append('circle').attr("class", 'pointGroup')
        .attr('r', tamMinCirle)
        .attr('cx', function(d){return xScaleGroup(d[0])})
        .attr('cy', function(d){return yScaleGroup(d[1])});
        
        
        var lasso_areaGroups = svgGroup.append("rect")
                            .attr("class", "rectLassoGroup")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .style("opacity", 0);
        lassoGroup = d3.lasso();

        lassoGroup.closePathDistance(75)
            .closePathSelect(true)
            .hoverSelect(false)
            .area(lasso_areaGroups)
            .on("start", lasso_startGroup)
            .on("draw", lasso_drawGroup)
            .on("end", lasso_endGroup);
        
        lassoGroup.items(d3.selectAll(".pointGroup"));
        svgGroup.call(lassoGroup);
    }
    //functions lasso
    var lasso_startGroup = function(){
        console.log("l1");
        /*lassoGroup.items()
            .attr("r", tamMinCirle)
            .style("fill", null)
            .classed({"not_possible": true, "selected": false});*/
    }    
     
    var lasso_drawGroup = function(){
        console.log("l2");
        /*lassoGroup.items().filter(function(d){return d.possible === true})
            .classed({"not_possible": false, "possible": true});
        lassoGroup.items().filter(function(d){return d.possible === false})
            .classed({"not_possible":true, "possible": false});*/
    }

    var lasso_endGroup = function(){
        console.log("l3");
        /*selectionData = [];
        lassoGroup.items()
            .style("fill", function(d){return "black"});
        lassoGroup.items().filter(function(d){
            if(d.selected === true){
                selectionData.push(d[2]);
            }
            return d.selected === true
        })
            .attr("r", tamMaxCircle)
            .style("fill", "blue");
        lassoGroup.items().filter(function(d){return d.selected === false})
            .classed({"not_possible": false, "posible":false})
            .attr("r", tamMinCirle);

        //if(selectionData.length == 0){
        //    redrawsvgMain(buckupDataSelected.length-1, false);
        //    console.log("nada de nada")
        //}*/    
        console.log("do you", selectionData)
    }

}//end of drawVISGroup

drawVISGroup("data/groupsnecluster5000.json", "");