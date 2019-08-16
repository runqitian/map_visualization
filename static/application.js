lnglatSet = new Array();
var mass;

var map = new AMap.Map('container', {
    center: [121.26091003417969, 30.701980590820312],
    layers: [//使用多个图层
        new AMap.TileLayer.Satellite(),
        new AMap.TileLayer.RoadNet()
    ],
    zooms: [4,18],//设置地图级别范围
    zoom: 13
});

map.plugin(["AMap.MapType"],function(){
    //地图类型切换
    var type= new AMap.MapType({
    defaultType:0 //使用2D地图
    });
    map.addControl(type);
});

function convert_records(origin){
    var results = new Array();
    results_idx = 0
    var lines = origin.split('\n');
    for (var i=0; i<lines.length; i++){
        line = lines[i]
        items = line.split("\t");
        each = new Array();
        // console.log(parseFloat(items[3]), parseFloat(items[5]));
        each[0] = new AMap.LngLat(parseFloat(items[3]), parseFloat(items[6]));
        each[1] = new AMap.LngLat(parseFloat(items[4]), parseFloat(items[6]));
        each[2] = new AMap.LngLat(parseFloat(items[4]), parseFloat(items[5]));
        each[3] = new AMap.LngLat(parseFloat(items[3]), parseFloat(items[5]));
        each[4] = new AMap.LngLat(parseFloat(items[1]), parseFloat(items[2]));
        each[5] = items[0];
        results[results_idx] = each;
        results_idx += 1;
        // console.log(results_idx);
        // break;
    }
    console.log(results.length);
    return results;
}

function initialize_map(){
    var data = [];

    for (var i=0; i<lnglatSet.length; i++){
        each = {
            lnglat: [lnglatSet[i][4].getLng(), lnglatSet[i][4].getLat()], //点标记位置
            name: lnglatSet[i][5],
            id:1,
            style:0
        };
        data.push(each);
    }

    var style = [{
        url: 'https://a.amap.com/jsapi_demos/static/images/mass0.png',
        anchor: new AMap.Pixel(6, 6),
        size: new AMap.Size(6, 6)
    }
    ];

    mass = new AMap.MassMarks(data, {
        opacity: 0.8,
        zIndex: 111,
        cursor: 'pointer',
        style: style
    });

    var marker_list = new Array();
    mass.on('mouseover', function (e) {
        var marker = new AMap.Marker({content: ' ', map: map});
        marker.setPosition(e.data.lnglat);
        marker.setLabel({content: e.data.name});
        marker_list.push(marker);
    });

    mass.on('mouseout', function (e) {
        map.remove(marker_list[0]);
        marker_list.pop();
    });

    mass.setMap(map);
}

function searchHash(){
    search_word = $("#hashinput").val();
    map.clearMap();
    mass.hide();
    var flag = 0;
    for (var i=0; i<lnglatSet.length; i++){
        if (lnglatSet[i][5] == search_word){
            item = lnglatSet[i];
            var path = [
                item[0],
                item[1],
                item[2],
                item[3]
            ];
            var rec = new AMap.Polygon({
                path: path,  
                fillColor: '#fff', // 多边形填充颜色
                fillOpacity: 0.2,
                borderWeight: 1, // 线条宽度，默认为 1
                strokeColor: 'red', // 线条颜色
            });
            var marker = new AMap.Marker({
                position: item[4],   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            });
            marker.setLabel({
                offset: new AMap.Pixel(-35, -10),  //设置文本标注偏移量
                content: "<div class='info'>" + item[5] + "</div>", //设置文本标注内容
                direction: 'right' //设置文本标注方位
            });
            map.add(marker);
            map.add(rec);
            // console.log(item[4].getLng(),item[4].getLat());
            map.setZoomAndCenter(28, [item[4].getLng(), item[4].getLat()]);
            flag = 1;
            break;
        }
  }
  if (flag == 0){
    alert("hash not found!");
  }
}

function hideAll(){
    map.clearMap();
    mass.hide();
}

function showAll(){
    map.clearMap();
    mass.show();
}

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "./geohash_lonlat-clean.txt",
        dataType: "text",
        // jsonp:'callback'
        success: function(data) {
            lnglatSet = convert_records(data);
            initialize_map();
            mass.hide();
        }
    });
});

