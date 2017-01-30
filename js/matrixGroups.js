function newMatrixGroups(mdata){
    //console.log("mdata",mdata);
    
    var columns = 40;
    var rows = Math.ceil(mdata.length/columns);
    
    var tamrect = 22;
    
    var width = 900;
    var height = tamrect*rows;
    
    var spa = 2;
    var rw = tamrect-spa;
    var rh = rw;
    
    var nose = d3.extent(mdata, function(d,i){return dataGroups_inGroups[d].authors.length;})
    //var scale_color = d3.scale.linear().domain(nose).range(["#EEEEEE", "#1E6823"]);
    var scale_color = d3.scale.linear().domain(nose).range(["#ffffd9", "#081d58"]);
    
    var pro = somematrixpos(rows, columns, mdata.length);
    console.log("pro", pro);
    
    var div = d3.select('#matrix_groups');
    var svg = div.append("svg")
        .attr("width", width)
        .attr("height", height);
    
    var auxrows = someArray(rows);
    var auxcolumns = someArray(columns);
    var gra = svg.selectAll("g")
        .data(pro)
        .enter()
        .append("g")
        .attr("transform", function(d,i){
            return "translate(0,"+(rh+spa)*i+')';
        })
    
    new_legend(scale_color.range(), nose, "#legend_matGroups", "# of Authors");
    
    var ttip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("text-align","center")
            .style("width", "80px")
            .style("height", "35px")
            .style("padding","2px")
            .style("font","12px sans-serif")
            .style("background","lightsteelblue")
            .style("border","1px")
            .style("border-radius","8px")
            .style("pointer-events","none");
    
    
    gra.selectAll("rect")
        .data(function(d,i){return d})
        .enter()
        .append("rect")
            .attr("x", function(d,i){return (rw+spa)*i;})
            .attr("width",rw)
            .attr("height", rh)
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .style("fill", function(d){return scale_color(dataGroups_inGroups[mdata[d]].authors.length);})
            .on ("click", function(d,i){
                var active = this.active?false:true,
                newOpacity = active?0.9:1;
                d3.select(this).style("opacity", newOpacity);
                if(active){
                    d3.select(this).style("stroke-width", 2);
                }else{
                    d3.select(this).style("stroke-width", 0.5);
                }
                this.active = active;
                
            }).on("mouseover", function(d) {
                   //console.log("dile", arr_aut[d]-1);
                   ttip.transition()
                     .duration(200)
                     .style("opacity", .9);
                   ttip.html("Group "+mdata[d] + " <br> ("+dataGroups_inGroups[mdata[d]].authors.length+" Authors)")
                     .style("left", (d3.event.pageX) + "px")
                     .style("top", (d3.event.pageY - 28) + "px");
                   })
                 .on("mouseout", function(d) {
                   ttip.transition()
                     .duration(500)
                     .style("opacity", 0);
                   });;
    
    gra.selectAll("rect")
        .classed({"selected":false})
    
    
    div.append("input")
        .attr("class", "btn btn-success")
        .attr("value", "Select All")
        .attr("type", "button")
        .on("click", function(d,i){
            selectAll_groups();
            console.log("click select all");
        });
    
    div.append("input")
        .attr("class", "btn btn-success")
        .attr("value", "Unselect All")
        .attr("type", "button")
        .on("click", function(d,i){
            unSelectAll_groups();
            console.log("click unselect all");
        });
    //<input type="button" class="btn btn-success" value="Start" onclick="btnStartShotGroup()" />
    div.append("input")
        .attr("class", "btn btn-success")
        .attr("value", "GO")
        .attr("type", "button")
        .on("click", function(d,i){
            draw_table_authors_in_groups();
            //list_authors_groups();
        });
    
    function selectAll_groups(){
        gra.selectAll("rect").filter(function(d){
            this.active = true;
        })
        
        gra.selectAll("rect").style("stroke-width", 2);
    }
    
    function unSelectAll_groups(){
        gra.selectAll("rect").filter(function(d){
            this.active = false;
        })
        
        gra.selectAll("rect").style("stroke-width", 0.5);
    }
    
    function someArray(tam){
        var arr = [];
        for(var i=0;i<tam;i++)
            arr.push(i);
        return arr;
    }

    function somematrixpos(rows, columns, ala){
        var arr=[];
        var aux=[];
        var sz = ala;
        var cnt = 0;
        for(var i = 0; i < rows; i++){
            aux = [];
            for(var j = 0; j < columns; j++){
                if(cnt < sz){
                    aux.push(cnt);
                    cnt++;
                }else{
                    break;
                }
            }
            arr.push(aux);
        }
        return arr;
    }
    
    
    
    //table for authors in groups
    
    function draw_table_authors_in_groups(){
        d3.selectAll("#matrix_authors_in_groups *").remove();
        d3.selectAll("#legend_matAuthors *").remove();
        var arr_ori = [];
        var auxmap = {};
        d3.selectAll("#matrix_groups rect").filter(function(d){
            if(this.active){
                arr_ori.push(mdata[d]);
            }
        })
        var miset = new Set();
        var countAuthors = new Array(dataAuthors_inGroups.length).fill(0);
        
        var json_tree_list = {"name":"Groups/Authors", "children":[]};
        var hh;
        var num_height_list = 2;
        
        for(var i = 0 ; i < arr_ori.length; i++){
            auxx = dataGroups_inGroups[arr_ori[i]];
            hh = [];
            hh = {"name": ("Group"+arr_ori[i]), "children": []};
            num_height_list++;
            for(var j = 0; j< auxx.authors.length ; j++){
                miset.add(auxx.authors[j]);
                countAuthors[auxx.authors[j]-1] = countAuthors[auxx.authors[j]] + 1;
                
                hh.children.push({"name": dataAuthors_inGroups[auxx.authors[j]].name, "size":0});
                num_height_list++;
            }
            
            json_tree_list.children.push(hh);
        }
        
        console.log("no digas", json_tree_list);
        
        var arr_aut = Array.from(miset);
        
        var limites_authors = d3.extent(countAuthors, function(d){
            return d;
        });
        limites_authors[0]=1;
        
        var scale_authors = d3.scale.linear().domain(limites_authors).range(["#fdae61", "#d7191c"]);
        var col = 40;
        var ro = Math.ceil(arr_aut.length/col);

        var tamr = 22;

        var w = 900;
        var h = tamr*ro;

        var space = 2;
        var rw2 = tamr-space;
        var rh2 = rw2;
        
        
        var pr = somematrixpos(ro, col, arr_aut.length);
        
        new_legend(scale_authors.range(), limites_authors, "#legend_matAuthors", "Frequency");
        
        var div2 = d3.select('#matrix_authors_in_groups');
        var svg2 = div2.append("svg")
            .attr("width", w)
            .attr("height", h);

        var gra2 = svg2.selectAll("g")
            .data(pr) 
            .enter()
            .append("g")
            .attr("transform", function(d,i){
                return "translate(0,"+(rh2+space)*i+')';
            })

            var divtooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("text-align","center")
            .style("width", "100px")
            .style("height", "60px")
            .style("padding","2px")
            .style("font","12px sans-serif")
            .style("background","lightsteelblue")
            .style("border","1px")
            .style("border-radius","8px")
            .style("pointer-events","none");
        
        gra2.selectAll("rect")
            .data(function(d,i){return d})
            .enter()
            .append("rect")
                .attr("x", function(d,i){return (rw2+space)*i;})
                .attr("width",rw2)
                .attr("height", rh2)
                .style("fill", function(d){return scale_authors(countAuthors[arr_aut[d]]);})
                .on ("click", function(d,i){
                    var active = this.active?false:true,
                    newOpacity = active?0.5:1;
                    d3.select(this).style("opacity", newOpacity);
                    this.active = active;
                    
                }).on("mouseover", function(d) {
                   //console.log("dile", arr_aut[d]-1);
                   divtooltip.transition()
                     .duration(200)
                     .style("opacity", .9);
                   divtooltip.html(arr_aut[d] + " - " + dataAuthors_inGroups[arr_aut[d]].name)
                     .style("left", (d3.event.pageX) + "px")
                     .style("top", (d3.event.pageY - 28) + "px");
                   })
                 .on("mouseout", function(d) {
                   divtooltip.transition()
                     .duration(500)
                     .style("opacity", 0);
                   });;
        
        
        console.log("califica esto", arr_ori);
        //LIST OF AUTHORS IN GROUPS
        
        list_authors_groups();
        
        function list_authors_groups(){
            d3.select("#list_authors_in_groups *").remove();
            console.log("holas peses");
            
            var margin = {top: 30, right: 20, bottom: 30, left: 20},
                width = 400 - margin.left - margin.right,
                barHeight = 20,
                barWidth = width * .8;
            var height = num_height_list*barHeight;
            var i = 0,
                duration = 400,
                root;

            var tree = d3.layout.tree()
                .nodeSize([0, 20]);

            var diagonal = d3.svg.diagonal()
                .projection(function(d) { return [d.y, d.x]; });

            var svg = d3.select("#list_authors_in_groups").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            json_tree_list.x0 = 0;
            json_tree_list.y0 = 0;
            update(root = json_tree_list);
            

            function update(source) {

              // Compute the flattened node list. TODO use d3.layout.hierarchy.
              var nodes = tree.nodes(root);

              var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

              d3.select("svg").transition()
                  .duration(duration)
                  .attr("height", height);

              d3.select(self.frameElement).transition()
                  .duration(duration)
                  .style("height", height + "px");

              // Compute the "layout".
              nodes.forEach(function(n, i) {
                n.x = i * barHeight;
              });

              // Update the nodes…
              var node = svg.selectAll("g.node")
                  .data(nodes, function(d) { return d.id || (d.id = ++i); });

              var nodeEnter = node.enter().append("g")
                  .attr("class", "node")
                  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                  .style("opacity", 1e-6);

              // Enter any new nodes at the parent's previous position.
              nodeEnter.append("rect")
                  .attr("y", -barHeight / 2)
                  .attr("height", barHeight)
                  .attr("width", barWidth)
                  .style("fill", color)
                  .on("click", click);

              nodeEnter.append("text")
                  .attr("dy", 3.5)
                  .attr("dx", 5.5)
                  .text(function(d) { return d.name; });

              // Transition nodes to their new position.
              nodeEnter.transition()
                  .duration(duration)
                  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
                  .style("opacity", 1);

              node.transition()
                  .duration(duration)
                  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
                  .style("opacity", 1)
                .select("rect")
                  .style("fill", color);

              // Transition exiting nodes to the parent's new position.
              node.exit().transition()
                  .duration(duration)
                  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                  .style("opacity", 1e-6)
                  .remove();

              // Update the links…
              var link = svg.selectAll("path.link")
                  .data(tree.links(nodes), function(d) { return d.target.id; });

              // Enter any new links at the parent's previous position.
              link.enter().insert("path", "g")
                  .attr("class", "link")
                  .attr("d", function(d) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                  })
                .transition()
                  .duration(duration)
                  .attr("d", diagonal);

              // Transition links to their new position.
              link.transition()
                  .duration(duration)
                  .attr("d", diagonal);

              // Transition exiting nodes to the parent's new position.
              link.exit().transition()
                  .duration(duration)
                  .attr("d", function(d) {
                    var o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                  })
                  .remove();

              // Stash the old positions for transition.
              nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
              });
            }//fin de update

            // Toggle children on click.
            function click(d) {
              if (d.children) {
                d._children = d.children;
                d.children = null;
              } else {
                d.children = d._children;
                d._children = null;
              }
              update(d);
            }

            function color(d) {
              return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
            }
            
        }//fin list authors groups    
    }
    
    
    

}

function new_legend(colors, limites, id, description){
    //var colors = [ 'rgb(255,0,0)', 'rgb(255,255,0)' ];

    var div = d3.select(id);
    var svg = div.append("svg")
        .attr("width", 200)
        .attr("height", 52);

    var grad = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'grad')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    grad.selectAll('stop')
      .data(colors)
      .enter()
      .append('stop')
      .style('stop-color', function(d){ return d; })
      .attr('offset', function(d,i){
        return 100 * (i / (colors.length - 1)) + '%';
      })

    svg.append('rect')
      .attr('x', 50)
      .attr('y', 15)
      .attr('width', 150)
      .attr('height', 25)
      .style('fill', 'url(#grad)');
    svg.append("text")
        .text(limites[0])
        .attr("x", 50)
        .attr("y", 10);
    svg.append("text")
        .text(limites[1])
        .attr("x", 180)
        .attr("y", 10);
    svg.append("text")
        .text(description)
        .attr("x", 80)
        .attr("y", 10);
}