

var drawVISAuthor = function(){
    d3.json("data/pmaxauthorsnecluster4906.json", function(dat){
        data = dat;
        xScale.domain(d3.extent(dat.mat.map(function(d){return d[0]})));
        yScale.domain(d3.extent(dat.mat.map(function(d){return d[1]})));
        ////console.log("Scales", xScale.domain(), yScale.domain());
        draw();
        shotSelected.push(false);
        newsnapshot([], data.mat, name, shotSelected.length, divSpanShot)
    });

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
        .attr("id", function(d){return ('pointAuthor'+d[2]);})
        .attr('r', tamMinCirle)
        .attr('cx', function(d){return xScale(d[0])})
        .attr('cy', function(d){return yScale(d[1])});
        
        
        var lasso_area = svg.append("rect")
                            .attr("width", width)
                            .attr("height", height)
                            .style("opacity", 0);
        lasso = d3.lasso();

        lasso.closePathDistance(75)
            .closePathSelect(true)
            .hoverSelect(false)
            .area(lasso_area)
            .on("start", lasso_start)
            .on("draw", lasso_draw)
            .on("end", lasso_end);
        
        lasso.items(d3.selectAll(".pointDots"));
        svg.call(lasso);
    } 

}


function updatespanshotArrays(ind){
    
    for (var i = ind+1; i < buckupDataSelected.length; i++) {
        d3.select("#"+name+i).remove();
    };
    buckupDataSelected = buckupDataSelected.slice(0,ind+1);
    shotSelected = shotSelected.slice(0,ind+1);
    d3.selectAll(divSpanShot + " "+ ".snapshot")
        .attr("id", function(d,i){return name+i})
}

function redrawsvgMain(ind, redrawcrossfilter){
    
    var selectedItemsBool = Array(data.length).fill(false);
    buckupDataSelected[ind].forEach(function(d){selectedItemsBool[d] = true;});

    if(redrawcrossfilter)
        drawCrossFilterCharts(buckupDataSelected[ind]);

    d3.selectAll(".pointDots")
        .attr("r", function(d,i){return selectedItemsBool[i]?tamMaxCircle:tamMinCirle})
        .style("fill", function(d,i){return selectedItemsBool[i]?"blue":"black";})
}

function drawCrossFilterCharts(dataO){
    
    d3.selectAll(".chart svg").remove();  
    datafilter = [];  
    

    d3.csv("data/authors.csv", function(error, datatot){
        dados = datatot;

        var nbpublabel = ["very few publi", "few publi", "fair publi", "high publi", "very high publi"];

        var nbpubchart      = dc_author.barChart("#chart1");
        var senioritychart  = dc_author.barChart("#chart2");
        var pubratechart    = dc_author.barChart("#chart3");
        var piechart        = dc_author.pieChart("#chart4");
        var countchart      = dc_author.dataCount('#chart5');
        var tablechart      = dc_author.dataTable('.dc-data-table');


        var numberFormat = d3.format('.2f');
        for (var i = 0; i < dataO.length; i++) {
            datafilter.push(datatot[dataO[i]]);
        };
        //start crossfilter
        datafilter.forEach(function(d,i){
            ////console.log("as", i);
            d.index =  i+1;
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
            nbpub = mycross.dimension(function(d){return category_nbpub(d.nbpub);}),
            nbpubs = nbpub.group(),
            //seniority = mycross.dimension(function(d){return Math.max(limitsseniority[0], Math.min(limitsseniority[1], d.seniority))}),
            seniority = mycross.dimension(function(d){return category_seniority(d.seniority)}),
            senioritys = seniority.group(),
            pubrate = mycross.dimension(function(d){return category_ratePub(d.pubrate)}),
            pubrates = pubrate.group();
        

        ////console.log("cafe", nbpubs.all());
        ////console.log("cafe", senioritys.all());    

        function category_ratePub(d){
            if(d<=1.47){
                return "not active";
            }
            else if(d>1.47 && d<=2.48){
                return "less active";
            }
            else if(d >2.48 && d<=3.71){
                return "active";
            }
            else if(d > 3.71 && d<= 6){
                return "very active"
            }
            else{
                return "extreme active";
            }
        }

        function category_seniority(d){
            if(d<=14){
                return "very young";
            }
            else if(d>14 && d<=28){
                return "young";
            }
            else if(d >28 && d<=53){
                return "experienced";
            }
            else if(d > 53 && d<= 107){
                return "senior"
            }
            else{
                return "highly senior";
            }
        }

        function category_nbpub(d){
            ////console.log("mira", d);
            if(d<=8){
                return "very few publi";
            }
            else if(d>8 && d<=12){
                return "few publi";
            }
            else if(d >12 && d<=15){
                return "fair publi";
            }
            else if(d > 15 && d<= 21){
                return "high publi"
            }
            else{
                return "very high publi";
            }
        }
        d3.select("#botonfiltercross").remove();
        /*d3.select(".botones")
            .append("input")
                .attr("class", "btn btn-default")
                .attr("id", "botonfiltercross")
                .attr("value", "View Filtered")
                .attr("type", "button")
                .on("click", function(d){
                    //console.log('seeee');
                    updatePointSelectedbyCross();
                });
        */    
        function updatePointSelectedbyCross(){
            var auxtop = tabledim.top(Infinity);
            var auxall = tabledims.all();
            //console.log("m: ", auxtop.length, auxall.length);
            /*for (var i = 0; i < auxtop.length; i++) {
                d3.select("#pointAuthor"+auxtop[i].author_id)
                    .classed("filtered", true);
            }*/
            for (var i = 0; i < auxall.length; i++) {
                d3.select("#pointAuthor"+auxall[i].author_id)
                    .style("fill", "blue")
                    .attr("r", tamMaxCircle);
            };
            for (var i = 0; i < auxtop.length; i++) {
                d3.select("#pointAuthor"+auxtop[i].author_id)
                    .style("fill", "chartreuse")
                    .attr("r", 5);
            };
        }

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
            .elasticY(false)
            .gap(1)
            .round(dc_author.round.floor)
            .alwaysUseRounding(true)
            //.x(d3.scale.linear().domain(limitsnbpub))
            .x(d3.scale.ordinal().domain(["very few publi", "few publi", "fair publi", "high publi", "very high publi"]))
            //.x(d3.scale.ordinal())
            .xUnits(dc_author.units.ordinal)
            .barPadding(0.1)
            .outerPadding(0.5)
            //.y(d3.scale.linear().domain(nbpubs.all().map(function(f){return f.value;})))
            .renderHorizontalGridLines(true)
            .xAxisLabel('# Publication')
            .yAxisLabel('# Authors')
            
            /*.filterPrinter(function (filters) {
                var filter = filters[0], s = '';
                s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
                return s;
            });*/
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
            .centerBar(false)
            .gap(1)
            .brushOn(true)
            .round(dc_author.round.floor)
            .alwaysUseRounding(true)
            //.x(d3.scale.linear().domain(limitsseniority))
            .x(d3.scale.ordinal().domain(["very young","young", "experienced", "senior", "very senior"]))
            .xUnits(dc_author.units.ordinal)
            .renderHorizontalGridLines(true)
            .xAxisLabel('Seniority')
            .yAxisLabel('# Authors')
            
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
                ' | <a href=\'javascript:dc.filterAll(); dc_author.renderAll();\'>Reset All</a><br><br>'
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
                selectedbycross = [];
                table.selectAll('.dc-table-group')
                .classed('info', true);
                /*.text(function(d){
                    if(d.key === 'm')return "Male";
                    if(d.key === 'w')return "Female";
                    return "Undefined";
                });*/
                table.selectAll(".dc-table-label")
                    .text(function(d){
                        selectedbycross.push(d);
                        if(d.key === 'm')return "Male";
                        if(d.key === 'w')return "Female";
                        return "Undefined";    
                    })
            });
        
        dc_author.renderAll();
    })//fin de d3.csv authors  

    

}
