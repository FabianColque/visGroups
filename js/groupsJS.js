
var drawVISGroup = function(filegroups, fileauthors, marginGroup, widthGroup, heightGroup){
    console.log("entre a grupos")
    
    //load file data main projection
    
    d3.json(filegroups, function(dat){
        dataGroups = dat;
        xScaleGroup.domain(d3.extent(dat.mat.map(function(d){return d[0]})));
        yScaleGroup.domain(d3.extent(dat.mat.map(function(d){return d[1]})));
        //console.log("Scales", xScaleGroup.domain(), yScaleGroup.domain());
        drawGroup(marginGroup, widthGroup, heightGroup);
        //shotSelected.push(false);
        //newsnapshot([], data.mat, "holaspe", shotSelected.length, divSpanShot)
    })       
     
    function drawGroup(marginGroup, widthGroup, heightGroup){
        var svgGroup = d3.select(tagMainGroup)
            .append('svg')
            .attr("class", "mainsvgGroup")
            .attr('width', widthGroup + marginGroup.left + marginGroup.right)
            .attr('height', heightGroup + marginGroup.top + marginGroup.bottom)
            //.call(brush);
        var graph = svgGroup.append('g');
        
        var moddatamatGroup = dataGroups.groups.map(function(d,i){var f = dataGroups.mat[i]; f.push(i);return f;});
        
        var points = graph.selectAll('.pointGroup').data(moddatamatGroup);
        points.enter().append('circle').attr("class", 'pointGroup')
        .attr('r', tamMinCirleGroup)
        .attr('cx', function(d){return xScaleGroup(d[0])})
        .attr('cy', function(d){return yScaleGroup(d[1])});
        
        
        var lasso_areaGroups = svgGroup.append("rect")
                            .attr("class", "rectLassoGroup")
                            .attr("width", widthGroup + marginGroup.left + marginGroup.right)
                            .attr("height", heightGroup + marginGroup.top + marginGroup.bottom)
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
    

}//end of drawVISGroup

// DrawCrossFilter for Groups



function drawCrossFilterChartsGroups(dataO){
    
    d3.selectAll(".chartGroup svg").remove();
    datafilterGroups = [];

    d3.csv("data/authors.csv", function(error, datatot){
        var countchart      = dc.dataCount('#chartGroup5');
        var tablechart      = dc.dataTable('.dc-data-table-Group');

        for (var i = 0; i < dataO.length; i++) {
            for (var i = 0; i < Things.length; i++) {
                Things[i]
            };
        };        
    });

}

function loadDataGroups(grupos, autores){
    
    $.ajax({
        dataType    : "json",
        url         : grupos,
        async       : false,
        success     : function(data){dataGroups_inGroups = data;}
    });

    $.ajax({
        dataType    : "json",
        url         : autores,
        async       : false,
        success     : function(data){dataAuthors_inGroups = data;}
    });
    /* $.ajax({
        dataType: "text",
        type    : "GET",
        url     : autores,
        async   : false,
        success : function(data) {dataAuthors_inGroups =  processData(data);}
     });*/
}

//ya no uso esta function
function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = {};
            for (var j=0; j<headers.length; j++) {
               tarr[headers[j]] = data[j];
            }
            lines.push(tarr);
        }
    }
    // alert(lines);
    return lines;
}