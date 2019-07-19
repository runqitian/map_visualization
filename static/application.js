var points = [];
var grids = new Array();
var map = new BMap.Map("allmap");
 // 百度地图API功能
 var point = new BMap.Point(121.26091003417969, 30.701980590820312);
 map.centerAndZoom(point, 15);
 map.addControl(new BMap.MapTypeControl({
     mapTypes:[
         BMAP_NORMAL_MAP,
         BMAP_HYBRID_MAP
     ]}));
 map.enableScrollWheelZoom(true);

function convert_records(origin){
    var results = new Array();
    results_idx = 0
    var lines = origin.split('\n');
    // lines = lines.slice(1);
    for (var i=0; i<lines.length; i++){
        line = lines[i]
        items = line.split("\t");
        each = new Array();
        each[0] =  [parseFloat(items[3]), parseFloat(items[6])];
        each[1] = [parseFloat(items[4]), parseFloat(items[6])];
        each[2] = [parseFloat(items[4]), parseFloat(items[5])];
        each[3] = [parseFloat(items[3]), parseFloat(items[5])];
        each[4] = [parseFloat(items[1]), parseFloat(items[2])];
        each[5] = items[0];
        results[results_idx] = each;
        results_idx += 1;
    }
    return results;
}

function initialize_map(cords){
    grids_idx = 0;
    for (var i=0; i<cords.length; i++){
        item = cords[i];
        var rectangle = new BMap.Polygon([
            new BMap.Point(item[0][0], item[0][1]),
            new BMap.Point(item[1][0], item[1][1]),
            new BMap.Point(item[2][0], item[2][1]),
            new BMap.Point(item[3][0], item[3][1])
        ], {strokeColor:"red", strokeWeight:2, strokeOpacity:1, fillOpacity:0.2});
        var point = new BMap.Point(item[4][0], item[4][1]);
        points.push(point);
        var label = new BMap.Label(item[5], position=point); // 创建点
        var marker = new BMap.Marker(point); // 创建点
        marker.setLabel(label);
        each = new Array();
        each[0] = item[5];
        each[1] = rectangle;
        each[2] = marker;
        each[3] = point;
        grids[grids_idx] = each;
        grids_idx += 1;
    }
    console.log("initialize map finished");
}

function searchHash(){
  search_word = $("#hashinput").val();
  map.clearOverlays();
  var flag = 0;
  for (var i=0; i<grids.length; i++){
    if (grids[i][0] == search_word){
      map.addOverlay(grids[i][1]);
      map.addOverlay(grids[i][2]);
      map.centerAndZoom(new BMap.Point(grids[i][3].lng, grids[i][3].lat), 20);
      flag = 1;
      break;
    }
  }
  if (flag == 0){
    alert("hash not found!");
  }
}

function showAll(){
  map.clearOverlays();
  var options = {
          size: BMAP_POINT_SIZE_SMALL,
          shape: BMAP_POINT_SHAPE_STAR,//点样式
          color: '#d340c3'
  }
  var pointCollection = new BMap.PointCollection(points, options);
  map.addOverlay(pointCollection);
}

function hideAll(){
  map.clearOverlays();
}

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "./geohash_lonlat-clean.txt",
        dataType: "text",
        // jsonp:'callback'
        success: function(data) {
            cords = convert_records(data);
            initialize_map(cords);
        }
    });
});
