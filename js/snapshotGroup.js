function newsnapshotGroup(selectedItems, data, description, number, ubicacion){

    //data -> data.mat original

    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var width = 300 - margin.left - margin.right;//350
    var height = 150 - margin.top - margin.bottom;//200
    var colorSelect = "red";

    var xScale = d3.scale.linear()
        .range([0,width]);

    var yScale = d3.scale.linear()
        .range([0, height]); 

    var selectedItemsBool = Array(data.length).fill(false);
    selectedItems.forEach(function(d){selectedItemsBool[d] = true;})    
    
    xScale.domain(d3.extent(data.map(function(d){return d[0]})));
    yScale.domain(d3.extent(data.map(function(d){return d[1]})));

    var div = d3.select(ubicacion)
        .insert("div")
            .attr("class", "snapshot")
            .attr("id", description + (number-1))
            .style("opacity", 1)
            .on("click", function(){
                
                var mithis = d3.select(this);
                var currentid = getparseId(mithis.attr("id"));
                
                

                d3.selectAll(ubicacion + " "+".snapshot")
                    .style("opacity", function(d,i){
                       
                        if((""+i) === currentid)
                            shotSelectedGroup[i] = true;
                        else
                            shotSelectedGroup[i] = false;
                        return 1;

                    })
                d3.select(this).style("opacity", 0.2);    
                

                ////console.log(shotSelectedGroup, currentid)    
            });
            //.style("width", (width+50)+"px")
            //.style("height", (height+100)+"px");

    var title = div.append("div").style("text-align", "center").append("stroke").text("Iteration" + (number))        
    var svg = div.append("svg")
        .attr("class", "svgspanshot")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)


    var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            

    g.selectAll(ubicacion + " .dotsSnapShot")
        .data(data.map(function(d, i){return [d[0], d[1], selectedItemsBool[i]]}))
        .enter()
        .append("circle")
            .attr("class", "dotsSnapShot")
            .attr("r", function(d){if(d[2])return 4;return 2})
            .attr("cx", function(d){return xScale(d[0])})
            .attr("cy", function(d){return yScale(d[1])})
            .style("fill", function(d){if(d[2])return colorSelect;return "black"})

    function getparseId(str){
        var res = "";
        for (var i = 1; i < str.length; i++) {
            res += str[i]; 
        };
        return res;
    }   

}

