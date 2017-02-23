function newsnapshotGroup(selectedItems, data, description, number, ubicacion){

    //data -> data.mat original


    var selectedItemsBool = Array(data.length).fill(false);
    selectedItems.forEach(function(d){selectedItemsBool[d] = true;}) 

    if(selectedItems.length == 0)strDes = "All";
    else strDes = ("["  + getSenio(dataGroups_inGroups[selectedItems[0]].seniority) + (getSenio(dataGroups_inGroups[selectedItems[0]].seniority)=="" ? "": ", ") + getRate(dataGroups_inGroups[selectedItems[0]].Pubrate) + (getRate(dataGroups_inGroups[selectedItems[0]].Pubrate)=="" ? "": ", ") + getGender(dataGroups_inGroups[selectedItems[0]].gender) +"]");
    
    console.log("strDes", strDes);
    var scaleDes = d3.scale.linear().domain([0,100]).range([50, 700]);

    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var width = scaleDes(strDes.length) - margin.left - margin.right;//350
    var height = 50 - margin.top - margin.bottom;//200
    var colorSelect = "red";

    var xScale = d3.scale.linear()
        .range([0,width]);

    var yScale = d3.scale.linear()
        .range([0, height]); 

       
    
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

             var title = div.append("div").style("text-align", "center").append("stroke").text("Iteration" + (number))        
    var svg = div.append("svg")
        .attr("class", "svgspanshot")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    console.log("sel", selectedItems, getSenio(19))
            
    svg
        .append("text")
        .text(function(){
            if(selectedItems.length == 0)
                return "All";
            return strDes;
            
        })
        .attr("transform", "translate(" + 10 + "," + 25 + ")")
        //.attr("alignment-baseline", "middle")
        //.attr("y", height);        
    /*g.selectAll(ubicacion + " .dotsSnapShot")
        .data(data.map(function(d, i){return [d[0], d[1], selectedItemsBool[i]]}))
        .enter()
        .append("circle")
            .attr("class", "dotsSnapShot")
            .attr("r", function(d){if(d[2])return 4;return 2})
            .attr("cx", function(d){return xScale(d[0])})
            .attr("cy", function(d){return yScale(d[1])})
            .style("fill", function(d){if(d[2])return colorSelect;return "black"})
    */
    function getparseId(str){
        var res = "";
        for (var i = 1; i < str.length; i++) {
            res += str[i]; 
        };
        return res;
    } 

    /*var div = d3.select(ubicacion)
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
    */
}

