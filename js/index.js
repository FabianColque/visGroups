//javascript main
var btnLoad_visible = true;
function btnLoadData_inGroups(){
    loadDataGroups("data/group3NewJSON2.json", "data/authorsjson.json", "data/conferences.json")
    drawVISAuthor();
    drawVISGroup("data/group3_norm_projection10000.json", "", marginGroup, widthGroup, heightGroup);    
    d3.select("#btn_load").style("visibility", "hidden");
    d3.select("#vis_body").style("visibility", "visible");
}