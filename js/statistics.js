$(function(){
	var tableData = null;
	function init(){
		$.getJSON("./data/statistics.json", function(data){
			tableData = data;
			$('#statistics_table').datagrid({
				data:data
			});
		});
		$("#statistics_dialog").dialog('close');
	}

	init();
});

function showStatistics(key){

	$.getJSON("./data/statistics.json", function(data){
		showDialog(key,data);
	});
}

function showDialog(key,info){
	var legend = "";
	var title = "";
	switch(key){
		case "distance":legend="距离(KM)";title="试驾总里程";break;
		case "count":legend="次数";title="试驾总次数";break;
		default:legend="";title="";break;
	}
	var arrXaxis = [];
	var arrData = [];
	for(var i=0;i<info.length;i++){
		var idLen = info[i]['car_id'].length;
		var subId = info[i]['car_id'].substring(idLen-4);
		arrXaxis.push(subId);

		var subValue = 0;
		switch(key){
			case "distance":var tmpIndex = info[i]['distance'].toUpperCase().indexOf('KM');subValue=info[i]['distance'].substring(0,tmpIndex);break;
			case "count":subValue=info[i]['count'];break;
			default:subValue=0;break;
		}
		arrData.push(subValue);
	}

	$("#statistics_dialog").dialog('open');
	var myChart = echarts.init(document.getElementById('statistics_show'));

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: title
        },
        tooltip: {},
        legend: {
            data:[legend]
        },
        xAxis: {
            data: arrXaxis
        },
        yAxis: {},
        series: [{
            name: legend,
            type: 'scatter',
            data: arrData
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

