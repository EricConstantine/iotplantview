<template>
    <div style="width:100%;height:100%;" id="platform_file"></div>
</template>

<script>
import echarts from 'echarts';

const option = {
    tooltip: {
        trigger: 'item',
        formatter: '当月{b} </br>系统总检测文件 : {c} 个'
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value'
    },
    grid:{
        x:55,
        y:15,
        x2:25,
        y2:35,
        borderWidth:1
    },
    series: [{
        data: [],
        type: 'line',
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#E89E9C',
                    type: 'default'
                }
            }
        }
    }]
};

export default {
    name: 'platformData',
    mounted () {
        let platformFile = echarts.init(document.getElementById('platform_file'));
        let self = this;
    	this.$axios.get('/intellicorri-server/manage/home/monthfilenum', {}, {
	    	headers: {"Content-Type":"application/json;charset=utf-8"},
	    }).then(function(response) {
            let data = response.data.data;
            
            let month_day = [];
            let buyer_data = [];
            for(let i=0;i<data.length;i++){
                month_day.push(data[i].monthday);
                buyer_data.push(data[i].allfile);
            }
            option.xAxis.data = month_day;
            option.series[0].data = buyer_data;

			platformFile.setOption(option);
            window.addEventListener('resize', function () {
                platformFile.resize();
            });
	    }).catch( function(response) {
	       	self.$util.logout(self,response);
        });
    }
};
</script>
