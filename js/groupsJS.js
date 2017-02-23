
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
        drawGroup(marginGroup, widthGroup, heightGroup, dataGroups);
        shotSelectedGroup.push(false);
        newsnapshotGroup([], dataGroups.mat, nameGroup, shotSelectedGroup.length, divSpanShotGroup)
    
        
    })       
     
    function drawGroup(marginGroup, widthGroup, heightGroup, dataGroups){
        /*var svgGroup = d3.select(tagMainGroup)
            .append('svg')
            .attr("class", "mainsvgGroup")
            .style("background", "white")
            .attr('width', widthGroup + marginGroup.left + marginGroup.right)
            .attr('height', heightGroup + marginGroup.top + marginGroup.bottom)
            //.call(brush);
        var graph = svgGroup.append('g');
        
        console.log("asdasd", dataGroups);

        var moddatamatGroup = dataGroups.groups.map(function(d,i){var f = dataGroups.mat[i]; f.push(dataGroups.groups[i]-1); f.push(dataGroups.cluster[i]);return f;});
        console.log("moddatasdasdasd", moddatamatGroup);
        var points = graph.selectAll('.pointGroup').data(moddatamatGroup);
        points.enter().append('circle').attr("class", 'pointGroup')
        .attr("id", function(d){return ('pointGroup'+d[2]);})
        .style("fill", function(d){return colorCluster[d[3]]})
        .attr('r', tamMinCirleGroup)
        .attr('cx', function(d){return xScaleGroup(d[0])})
        .attr('cy', function(d){return yScaleGroup(d[1])})
        .style("stroke", "black")
        .style("stroke-width", "1.5px")
        .style("opacity", opacityCircleGroup)
        
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
        */



        var links = [];
        var nose = Array.from(new Set(dataGroups.cluster));
          
          var len = nose.length;

          var flag = false;
          var matriz = [];
          for (var i = 0; i < len; i++) {
            matriz.push([]);    
          };

          for (var i = 0; i < dataGroups.groups.length; i++) {
            matriz[dataGroups.cluster[i]].push(dataGroups.groups[i]);    
          };


          for (var i = 0; i < matriz.length; i++) {
            for (var ii = 0; ii < matriz[i].length; ii++) {
              for (var iii = 0; iii < matriz[i].length; iii++) {
                if(iii>ii){
                  var jj = {"source": (""+matriz[i][ii]), "target": (""+matriz[i][iii]), "value": 3};
                  links.push(jj);
                }
              };  
            };
          };



        var nodes = {};

        // Compute the distinct nodes from the links.
        links.forEach(function(link) {
            link.source = nodes[link.source] || 
                (nodes[link.source] = {name: link.source});
            link.target = nodes[link.target] || 
                (nodes[link.target] = {name: link.target});
            link.value = +link.value;
        });

        var width = 600,
            height = 600;

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(300)
            .charge(-100)
            .on("tick", tick)
            .start();

        var svg = d3.select(tagMainGroup).append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "mainsvgGroup");

        // build the arrow.
        svg.append("svg:defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
          .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
          .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        // add the links and the arrows
        var path = svg.append("svg:g").selectAll("path")
            .data(force.links())
          .enter().append("svg:path")
        //    .attr("class", function(d) { return "link " + d.type; })
            .attr("class", "link")
            .attr("marker-end", "url(#end)");

        // define the nodes
        var node = svg.selectAll(".node")
            .data(force.nodes())
          .enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        // add the nodes
        node.append("circle")
            .attr("class", 'pointGroup')
            .attr("id", function(d){return ('pointGroup'+d.name);})
            .attr("r", function(d){return tamCircleScaleGroup(dataGroups_inGroups[parseInt(d.name)].authors.length)})
            .style("fill", "white")
            //.style("stroke", "black")
            //.style("stroke-width", "2.5px")
            .on("click", function(d){
              
              selectionDataGroups.push(parseInt(d.name));
              btnStartShotGroup();

              d3.select("#nroGroupSelected").text("Group " + d.name + " ("+dataGroups_inGroups[parseInt(d.name)].authors.length + " Authors)")
                .style("color", "mediumseagreen")
                .style("font-size", "19px")
            });

        node.append("title")
            .text(function(d) { 
                return "["  + getSenio(dataGroups_inGroups[parseInt(d.name)].seniority) + (getSenio(dataGroups_inGroups[parseInt(d.name)].seniority)=="" ? "": ", ") + getRate(dataGroups_inGroups[parseInt(d.name)].Pubrate) + (getRate(dataGroups_inGroups[parseInt(d.name)].Pubrate)=="" ? "": ", ") + getGender(dataGroups_inGroups[parseInt(d.name)].gender) +"]"; });    

        // add the text 
        /*node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });
*/
        // add the curvy lines
        function tick() {
            path.attr("d", function(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" + 
                    d.source.x + "," + 
                    d.source.y + "A" + 
                    dr + "," + dr + " 0 0,1 " + 
                    d.target.x + "," + 
                    d.target.y;
            });

            node
                .attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; });
        }

       


        d3.select(tagMainGroup).append("div").text("# Total of Groups: " + dataGroups.groups.length)


        //extent para todos los componentes de crossfilter
        
        var tooltip_scales_cfilter = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0)
                .style("text-align","center")
                .style("width", "130px")
                .style("height", "100px")
                .style("padding","2px")
                .style("font","12px sans-serif")
                .style("background","#fff")
                .style("border","1px dashed #1b1a19")
                .style("pointer-events","none");
        
        
        //SENIORITY
        


        //var seniority_extent = d3.extent(dataGroups_inGroups, function(d){return d.seniority;})
        var seniority_extent = [0,1,2,3,4];
        var seniority_scale = d3.scale.linear().domain(seniority_extent).range(colorslegend);//['#edf8fb','#b2e2e2','#66c2a4','#2ca25f','#006d2c']
        
        var noms = ["Very Young", "Young", "Experienced", "Senior", "Very Senior"];
                tooltip_scales_cfilter
                         .style("opacity", 1)
                         .style("position", "absolute");
                       tooltip_scales_cfilter.html("<div><strong><u>Seniority</u></strong></div><br><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[0]+"</div><div style=\"background-color:"+colorslegendGroup[0]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[1]+"</div><div style=\"background-color:"+colorslegendGroup[1]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[2]+"</div><div style=\"background-color:"+colorslegendGroup[2]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[3]+"</div><div style=\"background-color:"+colorslegendGroup[3]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[4]+"</div><div style=\"background-color:"+colorslegendGroup[4]+"; height:13px; width:13px\"></div></div>")
                         .style("left", "18%")
                         .style("top", "230px");


        d3.select("#chartGroup1 p")
            .on("click", function(){
                d3.selectAll("#areaMainsvgGroup .pointGroup")
                    .style("fill", function(d){return seniority_scale(getnumSenio(dataGroups_inGroups[parseInt(d.name)].seniority))})//d[2] mudou d.name
            
                d3.select("#chartGroup"+lastcategoriaSelected+" p").style("color", "black");
                d3.select("#chartGroup"+1+" p").style("color", "red");
                //d3.selectAll("#chartGroup"+lastcategoriaSelected+" .x.axis text").style("fill", function(d,i){return "black"})
                //d3.selectAll("#chartGroup"+1+" .x.axis text").style("fill", function(d,i){return colorslegend[i]})   
                lastcategoriaSelected = 1;

                var noms = ["Very Young", "Young", "Experienced", "Senior", "Very Senior"];
                tooltip_scales_cfilter
                         .style("opacity", 1)
                         .style("position", "absolute");
                       tooltip_scales_cfilter.html("<div><strong><u>Seniority</u></strong></div><br><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[0]+"</div><div style=\"background-color:"+colorslegendGroup[0]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[1]+"</div><div style=\"background-color:"+colorslegendGroup[1]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[2]+"</div><div style=\"background-color:"+colorslegendGroup[2]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[3]+"</div><div style=\"background-color:"+colorslegendGroup[3]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[4]+"</div><div style=\"background-color:"+colorslegendGroup[4]+"; height:13px; width:13px\"></div></div>")
                         .style("left", "18%")
                         .style("top", "230px");


            })

    /*.on("mouseover", function(d) {
                       console.log("<div class=></div>");
                        //var scolor = ["RGB(0, 0, 255)", "RGB(0, 255, 255)", "RGB(0, 255, 0)", "RGB(255, 255, 0)","RGB(255, 0, 0)"];//['#edf8fb','#b2e2e2','#66c2a4','#2ca25f','#006d2c'];
                        var noms = ["Very Young", "Young", "Experienced", "Senior", "Very Senior"];
                       tooltip_scales_cfilter.transition()
                         .duration(200)
                         .style("opacity", 1);
                       tooltip_scales_cfilter.html("<div>Seniority</div><br><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[0]+"</div><div style=\"background-color:"+colorslegendGroup[0]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[1]+"</div><div style=\"background-color:"+colorslegendGroup[1]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[2]+"</div><div style=\"background-color:"+colorslegendGroup[2]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[3]+"</div><div style=\"background-color:"+colorslegendGroup[3]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[4]+"</div><div style=\"background-color:"+colorslegendGroup[4]+"; height:13px; width:13px\"></div></div>")
                         .style("left", (d3.event.pageX) + "px")
                         .style("top", (d3.event.pageY - 28) + "px");
            }).on("mouseout", function(d) {
                    tooltip_scales_cfilter.transition()
                        .duration(500)
                        .style("opacity", 0);
            });*/
       
        
        //PUBLICATION RATE
        //var pubRate_extent = d3.extent(dataGroups_inGroups, function(d){return d.Pubrate;});
        var pubRate_extent = [0,1,2,3,4];
        var pubRate_scale = d3.scale.linear().domain(pubRate_extent).range(["RGB(0, 0, 255)", "RGB(0, 255, 255)", "RGB(0, 255, 0)", "RGB(255, 255, 0)","RGB(255, 0, 0)"]);
        d3.select("#chartGroup2 p")
            .on("click", function(){
                d3.selectAll("#areaMainsvgGroup .pointGroup")
                    .style("fill", function(d){return pubRate_scale(getnumRate(dataGroups_inGroups[parseInt(d.name)].Pubrate))})

                d3.select("#chartGroup"+lastcategoriaSelected+" p").style("color", "black");
                d3.select("#chartGroup"+2+" p").style("color", "red");

                //d3.selectAll("#chartGroup"+lastcategoriaSelected+" .x.axis text").style("fill", function(d,i){return "black"})
                //d3.selectAll("#chartGroup"+2+" .x.axis text").style("fill", function(d,i){return colorslegend[i]})   

                lastcategoriaSelected = 2;    


                var noms = ["Not Active", "Less Active", "Active", "Very Active", "Extremely Active"];
                       tooltip_scales_cfilter
                         .style("opacity", 1)
                         .style("position", "absolute");
                       tooltip_scales_cfilter.html("<div><strong><u>Publication Rate</u></strong></div><br><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[0]+"</div><div style=\"background-color:"+colorslegendGroup[0]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[1]+"</div><div style=\"background-color:"+colorslegendGroup[1]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[2]+"</div><div style=\"background-color:"+colorslegendGroup[2]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[3]+"</div><div style=\"background-color:"+colorslegendGroup[3]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[4]+"</div><div style=\"background-color:"+colorslegendGroup[4]+"; height:13px; width:13px\"></div></div>")
                         .style("left", "18%")
                         .style("top", "230px");

            })/*.on("mouseover", function(d) {
                       console.log("<div class=></div>");
                        //var colorslegendGroup = ["RGB(0, 0, 255)", "RGB(0, 255, 255)", "RGB(0, 255, 0)", "RGB(255, 255, 0)","RGB(255, 0, 0)"];
                        var noms = ["Not Active", "Less Active", "Active", "Very Active", "Extremely Active"];
                       tooltip_scales_cfilter.transition()
                         .duration(200)
                         .style("opacity", 1);
                       tooltip_scales_cfilter.html("<br><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[0]+"</div><div style=\"background-color:"+colorslegendGroup[0]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[1]+"</div><div style=\"background-color:"+colorslegendGroup[1]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[2]+"</div><div style=\"background-color:"+colorslegendGroup[2]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[3]+"</div><div style=\"background-color:"+colorslegendGroup[3]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[4]+"</div><div style=\"background-color:"+colorslegendGroup[4]+"; height:13px; width:13px\"></div></div>")
                         .style("left", (d3.event.pageX) + "px")
                         .style("top", (d3.event.pageY - 28) + "px");
            }).on("mouseout", function(d) {
                    tooltip_scales_cfilter.transition()
                        .duration(500)
                        .style("opacity", 0);
            });*/
        
        //GENDER
        var gender_extent = [1,2,3];
        var scale_gender = d3.scale.linear().domain(gender_extent).range(['#7fc97f','#beaed4','#fdc086'])
        d3.select("#chartGroup3 p")
            .on("click", function(){
                d3.selectAll("#areaMainsvgGroup .pointGroup")
                    .style("fill", function(d,i){return scale_gender(dataGroups_inGroups[parseInt(d.name)].gender)})
            
                d3.select("#chartGroup"+lastcategoriaSelected+" p").style("color", "black");
                d3.select("#chartGroup"+3+" p").style("color", "red");
                lastcategoriaSelected = 3;  

                var scolor = ['#7fc97f','#beaed4','#fdc086'];
                        var noms = ["Male", "Female", "Undefined"];
                       tooltip_scales_cfilter
                         .style("opacity", 1)
                         .style("position", "absolute");
                       tooltip_scales_cfilter.html("<div><strong><u>Gender</u></strong></div><br><br><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[0]+"</div><div style=\"background-color:"+scolor[0]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[1]+"</div><div style=\"background-color:"+scolor[1]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[2]+"</div><div style=\"background-color:"+scolor[2]+"; height:13px; width:13px\"></div></div>")
                         .style("left", "18%")
                         .style("top", "230px"); 
            })/*.on("mouseover", function(d) {
                       console.log("<div class=></div>");
                        var scolor = ['#7fc97f','#beaed4','#fdc086'];
                        var noms = ["Male", "Female", "Undefined"];
                       tooltip_scales_cfilter.transition()
                         .duration(200)
                         .style("opacity", 1);
                       tooltip_scales_cfilter.html("<br><br><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[0]+"</div><div style=\"background-color:"+scolor[0]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[1]+"</div><div style=\"background-color:"+scolor[1]+"; height:13px; width:13px\"></div></div><div style=\"display:-webkit-inline-box\"><div style=\"width:100px\">"+noms[2]+"</div><div style=\"background-color:"+scolor[2]+"; height:13px; width:13px\"></div></div>")
                         .style("left", (d3.event.pageX) + "px")
                         .style("top", (d3.event.pageY - 28) + "px");
            }).on("mouseout", function(d) {
                    tooltip_scales_cfilter.transition()
                        .duration(500)
                        .style("opacity", 0);
            });*/
        
        //CONFERENCES

        
        var conference_extent = d3.extent(dataGroups.groups, function(d,i){return dataGroups_inGroups[d].conferences.length;});
        //console.log("cong", conference_extent);
        var conference_scale = d3.scale.linear().domain(conference_extent).range([ "RGB(0, 255, 0)",  "RGB(255, 0, 0)"]);//["#B9A7CE","#310568"]
        d3.select("#chartGroup4 p")
            .on("click", function(){
                d3.selectAll("#areaMainsvgGroup .pointGroup")
                    .style("fill", function(d){return conference_scale(dataGroups_inGroups[parseInt(d.name)].conferences.length)})
            
                d3.select("#chartGroup"+lastcategoriaSelected+" p").style("color", "black");
                d3.select("#chartGroup"+4+" p").style("color", "red");
                lastcategoriaSelected = 4; 

                tooltip_scales_cfilter.transition()
                         .duration(200)
                         .style("opacity", 1)
                         .style("position", "absolute");
                       tooltip_scales_cfilter.html("<div><strong><u>Conferences</u></strong></div><br><br><div style=\"display:-webkit-inline-box\"><div style=\"width:65px; text-align: -webkit-left; margin-left: 10px;\">"+conference_extent[0]+"</div><div style=\"width:65px\">"+conference_extent[1]+"</div></div></div><div class=\"scaleConferenceToolTip\"></div>")
                         .style("left", "18%")
                         .style("top", "230px");  
            })/*.on("mouseover", function(d) {
                       console.log("<div class=></div>");
                        tooltip_scales_cfilter.transition()
                         .duration(200)
                         .style("opacity", 1);
                       tooltip_scales_cfilter.html("<br><br><div style=\"display:-webkit-inline-box\"><div style=\"width:65px; text-align: -webkit-left; margin-left: 10px;\">"+conference_extent[0]+"</div><div style=\"width:65px\">"+conference_extent[1]+"</div></div></div><div class=\"scaleConferenceToolTip\"></div>")
                         .style("left", (d3.event.pageX) + "px")
                         .style("top", (d3.event.pageY - 28) + "px");
            }).on("mouseout", function(d) {
                    tooltip_scales_cfilter.transition()
                        .duration(500)
                        .style("opacity", 0);
            });*/





         d3.select("#chartGroup"+lastcategoriaSelected+" p").style("color", "red");
        d3.selectAll("#areaMainsvgGroup .pointGroup")
                .style("fill", function(d){return seniority_scale(getnumSenio(dataGroups_inGroups[parseInt(d.name)].seniority))})//d[2] mudou d.name




    }//fin de drawGroup 
    //functions lasso
    
    
    
    
    
    
    
    
    
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

    //newMatrixGroups(dataO);

    //d3.json("data/group3NewJSON2.json", function(error, datatot){
        //dataGroups_inGroups = datatot;
        ////console.log("srtyrytera", dataO)
        var limitGroup = 10000;

        //var nbpub_Group_Chart = dc.barChart("#chartGroup1");
        var seniority_Group_Chart = dc_groups.barChart('#chartGroup1');
        var pubrate_Group_Chart = dc_groups.barChart('#chartGroup2');
        var pieGender_Group_Chart = dc_groups.pieChart('#chartGroup3');
        var count_Group_chart      = dc_groups.dataCount('#chartGroup5');
        var tablechartGroup      = dc_author.dataTable('#tablaGroup');

        var row_Group_Chart = dc_groups.rowChart('#chartGroup4');

        for (var i = 0; i < dataO.length; i++) {
            datafilterGroups.push(dataGroups_inGroups[dataO[i]]);
        };

        datafilterGroups.forEach(function(d,i){
            d.index = i+1;
            d.seniority = parseInt(d.seniority);
            d.numPub = parseInt(d.numPub);
            d.Pubrate = parseInt(d.Pubrate); 
        });
    

        var authorsfiltered = []
        for (var i = 0; i < datafilterGroups[0].authors.length; i++) {
            authorsfiltered.push(dataAuthors_inGroups[datafilterGroups[0].authors[i]]);
        };

        
/*        var mycrossGroup = crossfilter(authorsfiltered),
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
            }*/
        //******************

        console.log("auhto filt", authorsfiltered)
        var mycrossGroup = crossfilter(authorsfiltered),
            all = mycrossGroup.groupAll(),
            seniority = mycrossGroup.dimension(function(d){return category_seniority(d.seniority)}),
            senioritys = seniority.group(),
            pubrate = mycrossGroup.dimension(function(d){return category_ratePub(d.pubrate)}),
            pubrates = pubrate.group(),
            pieGender = mycrossGroup.dimension(function(d){
                console.log("genera", d.gender);
                if(d.gender == "u")return "Undefined";
                if(d.gender == "w")return "Female";
                return "Male";
            }),
            pieGenders = pieGender.group(),
            //Bconference = mycrossGroup.dimension(function(d){return d.conferences}),
            //Bconferences = Bconference.groupAll().reduce(reduceAdd, reduceRemove, reduceInitial).value();

            /*Bconferences.all = function(){
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
            }*/
    
        
        tabledimGroup = mycrossGroup.dimension(function(d){
            return d.index; 
        }),
        tabledimsGroup = tabledimGroup.group();    
            
        tabledim2 = mycrossGroup.dimension(function(d){
                    return parseInt(d.author_id); 
                }),
                tabledims2 = tabledim2.group();    
            
        seniority_Group_Chart.width(220)//420
                .height(180)
                .margins({top: 15, right: 50, bottom: 50, left: 40})
                .dimension(seniority)
                .group(senioritys)
                .colors(colorsBar[1])
                .elasticY(true)
                .centerBar(false)//false
                .gap(1)//lo comente
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



        pubrate_Group_Chart.width(220)//420
            .height(180)
            .margins({top: 15, right: 50, bottom: 50, left: 40})
            .dimension(pubrate)
            .group(pubrates)
            .colors(colorsBar[2])
            .elasticY(true)
            .centerBar(false)
            .gap(1)
            .round(dc_author.round.floor)
            .alwaysUseRounding(true)
            //.x(d3.scale.linear().domain(limitspubrate))
            .x(d3.scale.ordinal().domain(["not active", "less active", "active", "very active", "extremely active"]))
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
                console.log("all value", all.value())
                if (all.value()) {

                    label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
                }
                console.log("label", label)
                return label;
            });

        
        tablechartGroup
                    .dimension(tabledim2)
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
        




        

        var mycrossGroup2 = crossfilter(datafilterGroups),
            all2 = mycrossGroup2.groupAll(),
            Bconference = mycrossGroup2.dimension(function(d){return d.conferences}),
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
            };


        

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
             

        count_Group_chart
            .dimension(mycrossGroup)
            .group(all)
            .html({
                some : '<br><strong>%filter-count</strong> selected out of <strong>%total-count</strong> Authors' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset All</a><br><br>'
            });        


        



    




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
        return "";
}

function getRate(id){
    var aux = ["not active", "less active", "active", "very active", "extremely active"];
    var pos = id - 20;

    if(pos>=0)
        return aux[pos];
    else
        return "";
}

function getGender(d){
    var aux = ["", "male", "female", "gender undefined"];
    return aux[d];
}

function loadDataGroups(grupos, autores, conferences, authors){
    
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
    
    
     $.ajax({
        dataType: "text",
        type    : "GET",
        url     : authors,
        async   : false,
        success : function(data) {dados =  processData(data);}
     });
}

function redrawsvgMainGroup(ind, redrawcrossfilter){
    
    var selectedItemsBool = Array(dataGroups.length).fill(false);
    buckupDataSelectedGroup[ind].forEach(function(d){selectedItemsBool[d] = true;});

    if(redrawcrossfilter)
        drawCrossFilterChartsGroups(buckupDataSelectedGroup[ind]);

    d3.selectAll(".pointGroup")
        .attr("r", function(d){return tamCircleScaleGroup(dataGroups_inGroups[parseInt(d.name)].authors.length)})
        //.style("fill", function(d,i){return selectedItemsBool[i]?"blue":colorCircleDefault;})
        .style("opacity", function(d,i){return selectedItemsBool[i]?opacityCircleGroup:1})
        .style("stroke", "white")
        .style("opacity", opacityCircleGroup);

    
    d3.select("#pointGroup"+lastCircle).style("stroke", "white")
        .style("stroke-width", "0px");
    lastCircle = datafilterGroups[0].id;    
    d3.select("#pointGroup"+lastCircle).style("stroke", "black")
        .style("stroke-width", "5px");
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
