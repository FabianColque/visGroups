//javascript main
var btnLoad_visible = true;
function btnLoadData_inGroups(){
    loadDataGroups("data/group3NewJSON2.json", "data/authorsFinal.json", "data/conferences.json", "data/authors.csv")
    drawVISAuthor();
    drawVISGroup("data/group3_norm3_projection100-2.json", "", marginGroup, widthGroup, heightGroup);    
    //drawVISGroup("data/group3_norm_projection_1000isomap10000.json", "", marginGroup, widthGroup, heightGroup);    
    d3.select("#btn_load").style("visibility", "hidden");
    d3.select("#vis_body").style("visibility", "visible");
}