
var drawVISGroup = function(filegroups, fileauthors, marginGroup, widthGroup, heightGroup){
    
    d3.select("#SelectProjection")
    .on("change", function(){
        console.log("select")
        reDrawAllGroups(this.value);
    })
    
    //load file data main projection
    
    d3.json(filegroups, function(dat){
        dataGroups = dat;
        xScaleGroup.domain(d3.extent(dat.mat.map(function(d){return d[0]})));
        yScaleGroup.domain(d3.extent(dat.mat.map(function(d){return d[1]})));
        ////console.log("Scales", xScaleGroup.domain(), yScaleGroup.domain());
        drawGroup(marginGroup, widthGroup, heightGroup);
        shotSelectedGroup.push(false);
        newsnapshotGroup([], dataGroups.mat, nameGroup, shotSelectedGroup.length, divSpanShotGroup)
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
    
    //extent para todos los componentes de crossfilter
    //SENIORITY
    var seniority_extent = d3.extent(dataGroups_inGroups, function(d){return d.seniority;})
    var seniority_scale = d3.scale.linear().domain(seniority_extent).range(["#B7D7E8","#4B93C3"]);
    d3.select("#chartGroup1 strong")
        .on("click", function(){
            d3.selectAll("#areaMainsvgGroup .pointGroup")
                .style("fill", function(d){return seniority_scale(dataGroups_inGroups[d[2]].seniority)})
    })
    //PUBLICATION RATE
    var pubRate_extent = d3.extent(dataGroups_inGroups, function(d){return d.Pubrate;});
    var pubRate_scale = d3.scale.linear().domain(pubRate_extent).range(["#C1E5A1","#5BB356"]);
    d3.select("#chartGroup2 strong")
        .on("click", function(){
            d3.selectAll("#areaMainsvgGroup .pointGroup")
                .style("fill", function(d){return pubRate_scale(dataGroups_inGroups[d[2]].Pubrate)})
    })
    
    //GENDER
    var gender_extent = [1,2,3];
    var scale_gender = d3.scale.linear().domain(gender_extent).range(["#FCA381","#8DA0CB","#66C2A5"])
    d3.select("#chartGroup3 strong")
        .on("click", function(){
            d3.selectAll("#areaMainsvgGroup .pointGroup")
                .style("fill", function(d,i){return scale_gender(dataGroups_inGroups[d[2]].gender)})
    })
    
    //CONFERENCES
    var conference_extent = d3.extent(dataGroups_inGroups, function(d){return d.conferences.length;});
    var conference_scale = d3.scale.linear().domain(pubRate_extent).range(["#B9A7CE","#310568"]);
    d3.select("#chartGroup4 strong")
        .on("click", function(){
            d3.selectAll("#areaMainsvgGroup .pointGroup")
                .style("fill", function(d){return conference_scale(dataGroups_inGroups[d[2]].conferences.length)})
    })
}//end of drawVISGroup

// DrawCrossFilter for Groups



function drawCrossFilterChartsGroups(dataO){
    
    d3.selectAll("#matrix_groups *").remove();
    d3.selectAll("#legend_matGroups *").remove();
    d3.selectAll("#matrix_authors_in_groups *").remove();
    d3.selectAll("#legend_matAuthors *").remove();
    d3.selectAll("#list_authors_in_groups *").remove();
    
    d3.selectAll(".chartGroup svg").remove();
    datafilterGroups = [];

    newMatrixGroups(dataO);

    //d3.json("data/group3NewJSON2.json", function(error, datatot){
        //dataGroups_inGroups = datatot;
        ////console.log("srtyrytera", dataO)
        var limitGroup = 10000;

        //var nbpub_Group_Chart = dc.barChart("#chartGroup1");
        var seniority_Group_Chart = dc_groups.barChart('#chartGroup1');
        var pubrate_Group_Chart = dc_groups.barChart('#chartGroup2');
        var pieGender_Group_Chart = dc_groups.pieChart('#chartGroup3');
        //var bubbleCloud_Group_Chart = dc.bubbleCloud('#chartGroup4');
        var row_Group_Chart = dc.rowChart('#chartGroup4');
        var count_Group_chart      = dc.dataCount('#chartGroup5');

        for (var i = 0; i < dataO.length; i++) {
            datafilterGroups.push(dataGroups_inGroups[dataO[i]]);
        };

        datafilterGroups.forEach(function(d,i){
            d.index = i+1;
            d.seniority = parseInt(d.seniority);
            d.numPub = parseInt(d.numPub);
            d.Pubrate = parseInt(d.Pubrate); 
        });

        var mycrossGroup = crossfilter(datafilterGroups),
            all = mycrossGroup.groupAll(),
            seniority = mycrossGroup.dimension(function(d){return getSenio(d.seniority)}),
            senioritys = seniority.group(),
            pubrate = mycrossGroup.dimension(function(d){return getRate(d.Pubrate)}),
            pubrates = pubrate.group(),
            pieGender = mycrossGroup.dimension(function(d){
                return getGender(d.gender);
            }),
            pieGenders = pieGender.group(),
            Bconference = mycrossGroup.dimension(function(d){return d.conferences}),
            Bconferences = Bconference.groupAll().reduce(reduceAdd, reduceRemove, reduceInitial).value();

            Bconferences.all = function(){
                var newObject = [];
                for(var key in this){
                    if(this.hasOwnProperty(key) && key != 'all' && key!="top"){
                        newObject.push({
                            key: key,
                            value: this[key]
                        });
                    }
                }
                return newObject;
            }
        //******************
        
        seniority_Group_Chart.width(420)
                .height(180)
                .margins({top: 10, right: 50, bottom: 30, left: 40})
                .dimension(seniority)
                .group(senioritys)
                .colors(colorsBar[1])
                .elasticY(true)
                .centerBar(false)
                .gap(1)
                .brushOn(true)
                .round(dc_groups.round.floor)
                .alwaysUseRounding(true)
                //.x(d3.scale.linear().domain(limitsseniority))
                .x(d3.scale.ordinal().domain(["very young","young", "experienced", "senior", "very senior"]))
                .xUnits(dc_groups.units.ordinal)
                .renderHorizontalGridLines(true)
                .xAxisLabel('Seniority')
                .yAxisLabel('# Authors')
                
            seniority_Group_Chart.xAxis().tickFormat(
                function (v) { return v; });
            seniority_Group_Chart.yAxis().ticks(5); 



        pubrate_Group_Chart.width(420)
            .height(180)
            .margins({top: 10, right: 50, bottom: 30, left: 40})
            .dimension(pubrate)
            .group(pubrates)
            .colors(colorsBar[2])
            .elasticY(true)
            .centerBar(false)
            .gap(1)
            .round(dc_author.round.floor)
            .alwaysUseRounding(true)
            //.x(d3.scale.linear().domain(limitspubrate))
            .x(d3.scale.ordinal().domain(["not active", "less active", "active", "very active", "extreme active"]))
            .xUnits(dc_author.units.ordinal)
            .renderHorizontalGridLines(true)
            .xAxisLabel('Rate')
            .yAxisLabel('# Authors')
            
        pubrate_Group_Chart.xAxis().tickFormat(
            function (v) { return v; });
        pubrate_Group_Chart.yAxis().ticks(5);


        pieGender_Group_Chart.width(180)
        .height(180)
        .radius(80)
        .dimension(pieGender)
        .group(pieGenders)
        .colors(function(d){return scaleColorPieGroup(d)})
        .label(function (d) {
                if (pieGender_Group_Chart.hasFilter() && !pieGender_Group_Chart.hasFilter(d.key)) {
                    return d.key + '(0%)';
                }
                var label = d.key;
                if (all.value()) {
                    label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
                }
                return label;
            });

        row_Group_Chart
        .width(180)
        .height(400)
        .margins({top: 20, left: 10, right: 10, bottom: 20})
        .group(Bconferences)
        .dimension(Bconference)
        // Assign colors to each value in the x scale domain
        .ordinalColors(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'])
        .label(function (d) {
            return getNameConference(d.key);
        })
        // Title sets the row text
        .title(function (d) {
            ////console.log("value", d.value, d.key)
            return getNameConference(d.key)+" : "+d.value;
        })
        .elasticX(true)
        .xAxis().ticks(4);
             

        count_Group_chart
            .dimension(mycrossGroup)
            .group(all)
            .html({
                some : '<br><strong>%filter-count</strong> selected out of <strong>%total-count</strong> Groups' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset All</a><br><br>'
            });

            
        dc_groups.renderAll();
             
    //})

    

}

function reduceAdd(p,v){
    if(v.conferences.length == 0)return  p;
    v.conferences.forEach(function(val,idx){
        ////console.log("mirer", val);
        p[val] = (p[val] || 0) + 1;
    });
    return p;
}

function reduceRemove(p,v){
    if(v.conferences.length == 0)return p;
    v.conferences.forEach(function(val,idx){
        p[val] = (p[val] || 0)-1;
    });
    return p;
}

function reduceInitial(){
    return {};
}

function getSenio(id){
    var aux = ["very young","young", "experienced", "senior", "very senior"];
    var pos = id - 15;

    if(pos>=0)
        return aux[pos];
    else
        return "undef1";
}

function getRate(id){
    var aux = ["not active", "less active", "active", "very active", "extreme active"];
    var pos = id - 20;

    if(pos>=0)
        return aux[pos];
    else
        return "undef2";
}

function getGender(d){
    var aux = ["", "Male", "Female", "Undefined"];
    return aux[d];
}

function loadDataGroups(grupos, autores, conferences){
    
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


    $.ajax({
        dataType    : "json",
        url         : conferences,
        async       : false,
        success     : function(data){dataConferences_inGroups = data;}
    });
    /* $.ajax({
        dataType: "text",
        type    : "GET",
        url     : autores,
        async   : false,
        success : function(data) {dataAuthors_inGroups =  processData(data);}
     });*/
}

function redrawsvgMainGroup(ind, redrawcrossfilter){
    
    var selectedItemsBool = Array(dataGroups.length).fill(false);
    buckupDataSelectedGroup[ind].forEach(function(d){selectedItemsBool[d] = true;});

    if(redrawcrossfilter)
        drawCrossFilterChartsGroups(buckupDataSelectedGroup[ind]);

    d3.selectAll(".pointGroup")
        .attr("r", function(d,i){return selectedItemsBool[i]?tamMaxCircleGroup:tamMinCirleGroup})
        .style("fill", function(d,i){return selectedItemsBool[i]?"blue":"black";})
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

function updatespanshotArraysGroup(ind){
    
    for (var i = ind+1; i < buckupDataSelectedGroup.length; i++) {
        d3.select("#"+nameGroup+i).remove();
    };
    buckupDataSelectedGroup = buckupDataSelectedGroup.slice(0,ind+1);
    shotSelectedGroup = shotSelectedGroup.slice(0,ind+1);
    d3.selectAll(divSpanShotGroup + " "+ ".snapshot")
        .attr("id", function(d,i){return nameGroup+i})
}

function reDrawAllGroups(value){
    d3.select(".mainsvgGroup").remove();
    d3.selectAll(".chartGroup svg").remove();
    d3.selectAll("#snapshotAreaGroup .snapshot").remove()

    dataGroups = [];
    selectionDataGroups = [];
    buckupDataSelectedGroup = [];
    buckupDataSelectedGroup.push([]);
    shotSelectedGroup = [];
    datafilterGroups = [];
    filenew = getFileSelectedProjection(value);
    drawVISGroup("data/"+filenew, "", marginGroup, widthGroup, heightGroup);    
}

function getFileSelectedProjection(value){
    //var arrFiles_projection = ["group3_norm_projection10000.json", "group3_norm_projection_100isomap10000.json", "group3_norm_projection_200isomap10000.json", "group3_norm_projection_300isomap10000.json",  "group3_norm_projection_400isomap10000.json", "group3_norm_projection_500isomap10000.json", "group3_norm_projection_1000isomap10000.json"]; 
    var arrFiles_projection = ["group3_norm_projection10000.json", "group3_norm3_projection10000.json", "group3_norm_projection_100isomap10000.json", "group3_norm_projection_200isomap10000.json", "group3_norm_projection_300isomap10000.json",  "group3_norm_projection_400isomap10000.json", "group3_norm_projection_500isomap10000.json", "group3_norm_projection_1000isomap10000.json","group3_norm_projection_confe100isomap10000.json", "group3_norm_projection_confe200isomap10000.json", "group3_norm_projection_confe300isomap10000.json",  "group3_norm_projection_confe400isomap10000.json", "group3_norm_projection_confe500isomap10000.json", "group3_norm_projection_confe1000isomap10000.json"];

    if(value === "T-SNE-2"){
        return arrFiles_projection[0];
    }
    if(value === "T-SNE-3"){
        return arrFiles_projection[1];
    }
    
    if(value == "Ia100"){
        return arrFiles_projection[2];
    }
    if(value == "Ia200"){
        return arrFiles_projection[3];
    }
    if(value == "Ia300"){
        return arrFiles_projection[4];
    }
    if(value == "Ia400"){
        return arrFiles_projection[5];
    }
    if(value == "Ia500"){
        return arrFiles_projection[6];
    }
    if(value == "Ia1000"){
        return arrFiles_projection[7];
    }

    if(value == "I100"){
        return arrFiles_projection[8];
    }
    if(value == "I200"){
        return arrFiles_projection[9];
    }
    if(value == "I300"){
        return arrFiles_projection[10];
    }
    if(value == "I400"){
        return arrFiles_projection[11];
    }
    if(value == "I500"){
        return arrFiles_projection[12];
    }
    if(value == "I1000"){
        return arrFiles_projection[13];
    }
}
