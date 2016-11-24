
var data;
var buckupDataSelected = [];
    buckupDataSelected.push([]);
var selectionData;
    selectionData = [];
var shotSelected = [];
var currentShowPlot = 0;
var divSpanShot = "#snapshotArea";

var colors = ['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6','#ffffcc','#e5d8bd','#fddaec','#f2f2f2'];

var scaleColorPie = d3.scale.ordinal().domain(["Undefined", "Male", "Female"]).range(['#8dd3c7','#ffffb3','#bebada']);

var colorsBar = ['#fbb4ae','#b3cde3','#ccebc5'];

var width = 500;
var height = 300;

var lasso;
    
var xScale = d3.scale.linear()
  .range([0,width]);

var yScale = d3.scale.linear()
  .range([0, height]);  

var tamMinCirle = 2;
var tamMaxCircle = 7.5;
    
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
    
}

d3.json("data/authorsnecluster4906.json", function(dat){
    data = dat;
    xScale.domain(d3.extent(dat.mat.map(function(d){return d[0]})));
    yScale.domain(d3.extent(dat.mat.map(function(d){return d[1]})));
    //console.log("Scales", xScale.domain(), yScale.domain());
    draw();
    shotSelected.push(false);
    newsnapshot([], data.mat, "holaspe", shotSelected.length, divSpanShot)
})

function draw(){
    var svg = d3.select("#areaMainscgAuthor")
        .append('svg')
        .attr("class", "mainsvg")
        .attr('width', width)
        .attr('height', height)
        //.call(brush);
    var graph = svg.append('g');
    
    var moddatamat = data.users.map(function(d,i){var f = data.mat[i]; f.push(i);return f;});
    
    var points = graph.selectAll('.pointDots').data(moddatamat);
    points.enter().append('circle').attr("class", 'pointDots')
    .attr('r', tamMinCirle)
    .attr('cx', function(d){return xScale(d[0])})
    .attr('cy', function(d){return yScale(d[1])});
    
    
    var lasso_area = svg.append("rect")
                        .attr("width", width)
                        .attr("height", height)
                        .style("opacity", 0);
    lasso = d3.lasso()
        .closePathDistance(75)
        .closePathSelect(true)
        .hoverSelect(true)
        .area(lasso_area)
        .on("start", lasso_start)
        .on("draw", lasso_draw)
        .on("end", lasso_end);
    
    lasso.items(d3.selectAll(".pointDots"));
    svg.call(lasso);
} 

function btnStartShot(){
    
    if(selectionData.length != 0){
        drawCrossFilterCharts(selectionData);
        buckupDataSelected.push(selectionData);
        shotSelected.push(false)
        newsnapshot(selectionData, data.mat, "holaspe2", shotSelected.length,divSpanShot)
    }
    selectionData = [];
}

function btnRestShot(){
    var ind = -1;
    for (var i = 0; i < shotSelected.length; i++)
        if(shotSelected[i] == true)
            ind = i;
    if(ind == -1)return;
    console.log("restart", ind);
    redrawsvgMain(ind);
    updatespanshotArrays(ind); 
    selectionData = [];   
}

function updatespanshotArrays(ind){
    
    for (var i = ind+1; i < buckupDataSelected.length; i++) {
        d3.select("#s"+i).remove();
    };
    buckupDataSelected = buckupDataSelected.slice(0,ind+1);
    shotSelected = shotSelected.slice(0,ind+1);
    d3.selectAll(divSpanShot + " "+ ".snapshot")
        .attr("id", function(d,i){return "s"+i})
}

function redrawsvgMain(ind){
    
    var selectedItemsBool = Array(data.length).fill(false);
    buckupDataSelected[ind].forEach(function(d){selectedItemsBool[d] = true;});

    drawCrossFilterCharts(buckupDataSelected[ind]);

    d3.selectAll(".pointDots")
        .attr("r", function(d,i){return selectedItemsBool[i]?tamMaxCircle:tamMinCirle})
        .style("fill", function(d,i){return selectedItemsBool[i]?"blue":"black";})
}

var datafilter;

var dados;
 

function drawCrossFilterCharts(dataO){
    
    d3.selectAll(".chart svg").remove();  
    datafilter = [];  
    //console.log("llega obo",dataO);

    d3.csv("data/authors.csv", function(error, datatot){
        dados = datatot;

        var nbpubchart      = dc.barChart("#chart1");
        var senioritychart  = dc.barChart("#chart2");
        var pubratechart    = dc.barChart("#chart3");
        var piechart        = dc.pieChart("#chart4");
        var countchart      = dc.dataCount('#chart5');
        var tablechart      = dc.dataTable('.dc-data-table');


        var numberFormat = d3.format('.2f');
        for (var i = 0; i < dataO.length; i++) {
            datafilter.push(datatot[dataO[i]]);
        };
        //start crossfilter
        datafilter.forEach(function(d,i){
            d.index =  i;
            d.seniority = parseInt(d.seniority);
            d.nbpub = parseInt(d.nbpub);
            d.pubrate = parseFloat(d.pubrate);
        });

        var limitsnbpub = d3.extent(datafilter.map(function(d){return parseInt(d.nbpub);}));
        var limitspubrate = d3.extent(datafilter.map(function(d){return parseFloat(d.pubrate);}));
        var limitsseniority = d3.extent(datafilter.map(function(d){return parseInt(d.seniority);}))

        //create the crossfilter
        var mycross = crossfilter(datafilter),
            all = mycross.groupAll(),
            nbpub = mycross.dimension(function(d){return d.nbpub;}),
            nbpubs = nbpub.group(),
            seniority = mycross.dimension(function(d){return Math.max(limitsseniority[0], Math.min(limitsseniority[1], d.seniority))}),
            senioritys = seniority.group(),
            pubrate = mycross.dimension(function(d){return Math.max(limitspubrate[0], Math.min(limitspubrate[1], d.pubrate))}),
            pubrates = pubrate.group();
        
        var cross1pie = mycross.dimension(function(d){
            if(d.gender == "u")return "Undefined";
            if(d.gender == "w")return "Female";
            return "Male";
        }),
        cross1pies = cross1pie.group();


        var tabledim = mycross.dimension(function(d){
            return d.index; 
        }),
        tabledims = tabledim.group();    
        
        
        nbpubchart.width(420)
            .height(180)
            .margins({top: 10, right: 50, bottom: 30, left: 40})
            .dimension(nbpub)
            .group(nbpubs)
            .colors(colorsBar[0])
            .elasticY(true)
            .centerBar(true)
            .gap(1)
            .round(dc.round.floor)
            .alwaysUseRounding(true)
            .x(d3.scale.linear().domain(limitsnbpub))
            .renderHorizontalGridLines(true)
            .xAxisLabel('# Publication')
            .yAxisLabel('# Authors')
            .filterPrinter(function (filters) {
                var filter = filters[0], s = '';
                s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
                return s;
            });
        nbpubchart.xAxis().tickFormat(
            function (v) { return v; });
        nbpubchart.yAxis().ticks(5);


        senioritychart.width(420)
            .height(180)
            .margins({top: 10, right: 50, bottom: 30, left: 40})
            .dimension(seniority)
            .group(senioritys)
            .colors(colorsBar[1])
            .elasticY(true)
            .centerBar(true)
            .gap(1)
            .round(dc.round.floor)
            .alwaysUseRounding(true)
            .x(d3.scale.linear().domain(limitsseniority))
            .renderHorizontalGridLines(true)
            .xAxisLabel('Seniority')
            .yAxisLabel('# Authors')
            .filterPrinter(function (filters) {
                var filter = filters[0], s = '';
                s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
                return s;
            });
        senioritychart.xAxis().tickFormat(
            function (v) { return v; });
        senioritychart.yAxis().ticks(5);


        pubratechart.width(420)
            .height(180)
            .margins({top: 10, right: 50, bottom: 30, left: 40})
            .dimension(pubrate)
            .group(pubrates)
            .colors(colorsBar[2])
            .elasticY(true)
            .centerBar(true)
            .gap(1)
            .round(dc.round.floor)
            .alwaysUseRounding(true)
            .x(d3.scale.linear().domain(limitspubrate))
            .renderHorizontalGridLines(true)
            .xAxisLabel('Rate')
            .yAxisLabel('# Authors')
            
        pubratechart.xAxis().tickFormat(
            function (v) { return v; });
        pubratechart.yAxis().ticks(5);



        piechart.width(180)
        .height(180)
        .radius(80)
        .dimension(cross1pie)
        .group(cross1pies)
        .colors(function(d){return scaleColorPie(d)})
        .label(function (d) {
                if (piechart.hasFilter() && !piechart.hasFilter(d.key)) {
                    return d.key + '(0%)';
                }
                var label = d.key;
                if (all.value()) {
                    label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
                }
                return label;
            });


        countchart
            .dimension(mycross)
            .group(all)
            .html({
                some : '<br><strong>%filter-count</strong> selected out of <strong>%total-count</strong> Authors' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset All</a><br><br>'
            });
        
        tablechart
            .dimension(tabledim)
            .group(function(d){return d.gender})
            .size(100)
            .columns([
                {
                    label   : 'Author ID',
                    format  : function(d){return d.author_id;}
                },
                {
                    label   : 'Name',
                    format  : function(d){return d.name;}
                },
                {
                    label   : 'Seniority',
                    format  : function(d){return d.seniority;}
                },
                {
                    label   : '# Publications',
                    format  : function(d){return d.nbpub;}
                },
                {
                    label   : 'Rate Pub',
                    format  : function(d){return d.pubrate;}
                }
            ])
            .sortBy(function(d){
                return d.index
            })
            .order(d3.ascending)
            .on('renderlet', function (table) {
                table.selectAll('.dc-table-group')
                .classed('info', true);
                /*.text(function(d){
                    if(d.key === 'm')return "Male";
                    if(d.key === 'w')return "Female";
                    return "Undefined";
                });*/
                table.selectAll(".dc-table-label")
                    .text(function(d){
                        if(d.key === 'm')return "Male";
                        if(d.key === 'w')return "Female";
                        return "Undefined";    
                    })
            });
        
        dc.renderAll();
    })//fin de d3.csv authors  

    

}
