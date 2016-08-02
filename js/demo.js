$(function(){
	var map = new BMap.Map("baidu_map");    // 创建Map实例
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);  // 初始化地图,设置中心点坐标和地图级别
	map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
	map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
	var chooseCar = null;

	function init(){
		$("#car_tree").tree({
			onClick:function(note){
				var param = note.attributes;
				var msgInfo = "";
				if(param.type=="area"){
					map.clearOverlays();
					map.setCenter(param.address);
					map.setZoom(11);
					for(var i = 0; i < note.children.length; i++){
						addPoint(map,note.children[i].attributes,false);
					}
					return true;
				}else if(param.type=="shop" && param.x && param.y){
					map.clearOverlays();
					addPoint(map,param,true);
					map.setZoom(13);
					chooseCar = param.name;
					var kindChildren = $("#car_tree").tree("getChildren",note.target);
					for(var i = 0; i < kindChildren.length; i++){
						if(kindChildren[i].attributes.type == "kind"){
							var children = $("#car_tree").tree("getChildren",kindChildren[i].target);
							for(var j = 0; j < children.length; j++){
								showCarLocus(map,children[j].attributes,false,param.name);
							}
						}
					}
				}else if(param.type=="kind"){
					map.clearOverlays();
					map.setZoom(13);
					chooseCar = param.name;
					var children = $("#car_tree").tree("getChildren",note.target);
					for(var i = 0; i < children.length; i++){
						showCarLocus(map,children[i].attributes,false,param.name);
					}
				}else if(param.type=="car" && param.locus){
					map.clearOverlays();
					chooseCar = param.name;
					showCarLocus(map,param,true,param.name);
				}else{
					msgInfo += "该节点无定位信息";
				}
				var showFlag = showProperties(param);
				//if(!showFlag){
				//	msgInfo +="且无属性信息";
				//}
				if(msgInfo.length>0){
					$.messager.show({
		               title:'提醒',
		               msg:msgInfo,
		               height:50,
		               timeout:2000,
		               showType:'slide'
		          });
				}
			}
		});
	}

	function showCarLocus(map,param,onlyCheck,checkName){
		var _map = map;
		var file = "./data/"+param.locus;
		var carPoint = null;
		if(onlyCheck){
			_map.setZoom(16);
		}
		$.getJSON(file, function(locus){ 
			if(locus != null && locus != undefined){
				if(carPoint == null){
					var tmpParam = {
						"type":"car",
						"x":locus[0].x,
						"y":locus[0].y
					}
					carPoint=addPoint(_map,tmpParam,true);
				}
				var index = 1;
				var timeHandle = setInterval(function(){
					console.log(chooseCar+" "+checkName);
					if(chooseCar==null ||chooseCar != checkName){
						clearInterval(timeHandle);
						return;
					}
					var point = new BMap.Point(locus[index].x,locus[index].y);
					if(onlyCheck){
						_map.setCenter(point);
					}
					carPoint.setPosition(point);
					index++;
					if((index+1) == locus.length){
						clearInterval(timeHandle);
					}
				},1000);
			}
		}); 
	};

	init();
});

function showProperties(param){
	if(!param.name || param.name == undefined){
		return false;
	}
	var row = [];
	for(var i in param){
		if(i == "type" || i == "x" || i == "y"){
			continue;
		}
		row.push({"name":i,"value":param[i],"editor":'text'});
	}
	$("#car_properties").propertygrid({"data":row});
	return true;
}

function addPoint(map,param,setCenter){
	var imgPath = "./css/icons/car.png";
	if(param.type=="shop"){
		imgPath = "./css/icons/car_shop.png";
	}else if(param.type=="kind"){
		imgPath = "./css/icons/car_type.png";
	}
	var point = new BMap.Point(param.x,param.y);
	var marker = new BMap.Marker(point,{
            title:param.name,
            enableClicking:true,
            icon:new BMap.Icon(
                imgPath,
                new BMap.Size(16, 16),
                {
                    imageOffset: new BMap.Size(0, 0),
                    anchor: new BMap.Size(8, 8)
                }
            )
    });
    marker.setZIndex(19790000);
    map.addOverlay(marker);
    if(setCenter){
    	map.setCenter(point);
    }
    return marker;
}