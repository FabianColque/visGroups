function newMatrixGroups(mdata){
    console.log("mdata",mdata);
    
    var columns = 20;
    var rows = Math.ceil(mdata.length/columns);
    
    var tamrect = 22;
    
    var width = 600;
    var height = tamrect*rows;
    
    var spa = 2;
    var rw = tamrect-spa;
    var rh = rw;
    
    var nose = d3.extent(mdata, function(d,i){return dataGroups_inGroups[d].authors.length;})
    var scale_color = d3.scale.linear().domain(nose).range(["#EEEEEE", "#1E6823"]);
    
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
    
    gra.selectAll("rect")
        .data(function(d,i){return d})
        .enter()
        .append("rect")
            .attr("x", function(d,i){return (rw+spa)*i;})
            .attr("width",rw)
            .attr("height", rh)
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .style("fill", function(d){return scale_color(dataGroups_inGroups[d].authors.length);})
            .on ("click", function(d,i){
                var active = this.active?false:true,
                newOpacity = active?0.5:1;
                d3.select(this).style("opacity", newOpacity);
                this.active = active;
                console.log("aqui llegue", this.active)
            });
    
    gra.selectAll("rect")
        .classed({"selected":false})
    
    //<input type="button" class="btn btn-success" value="Start" onclick="btnStartShotGroup()" />
    div.append("input")
        .attr("class", "btn btn-success")
        .attr("value", "GO")
        .attr("type", "button")
        .on("click", function(d,i){
            draw_table_authors_in_groups();
            console.log("click");
        })
    
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
       // d3.select("#matrix_authors_in_groups *").remove();
        var arr_ori = [];
        var auxmap = {};
        d3.selectAll("#matrix_groups rect").filter(function(d){
            if(this.active){
                arr_ori.push(mdata[d]);
            }
        })
        console.log("arr ori", arr_ori);
        var miset = new Set();
        for(var i = 0 ; i < arr_ori.length; i++){
            auxx = dataGroups_inGroups[arr_ori[i]];
            for(var j = 0; j< auxx.authors.length ; j++){
                miset.add(auxx.authors[j]);
            }
        }
        var arr_aut = Array.from(miset);
        
        var col = 20;
        var ro = Math.ceil(arr_aut.length/col);

        var tamr = 22;

        var w = 600;
        var h = tamr*ro;

        var space = 2;
        var rw2 = tamr-space;
        var rh2 = rw2;
        
        
        var pr = somematrixpos(ro, col, arr_aut.length);
        console.log("pro", pr);

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
            .style("opacity", 0);
        
        gra2.selectAll("rect")
            .data(function(d,i){return d})
            .enter()
            .append("rect")
                .attr("x", function(d,i){return (rw2+space)*i;})
                .attr("width",rw2)
                .attr("height", rh2)
                .style("fill", "#1a9641")
                .on ("click", function(d,i){
                    var active = this.active?false:true,
                    newOpacity = active?0.5:1;
                    d3.select(this).style("opacity", newOpacity);
                    this.active = active;
                    console.log("aqui llegue2", this.active)
                }).on("mouseover", function(d) {
                   divtooltip.transition()
                     .duration(200)
                     .style("opacity", .9);
                   divtooltip.html(arr_aut[d])
                     .style("left", (d3.event.pageX) + "px")
                     .style("top", (d3.event.pageY - 28) + "px");
                   })
                 .on("mouseout", function(d) {
                   divtooltip.transition()
                     .duration(500)
                     .style("opacity", 0);
                   });;
        
    }

}

