$(function(){
    
     // 基于准备好的dom，初始化echarts实例 柱状图--------------------------------
     var myChart = echarts.init(document.querySelector('.left_table'));
     
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '2017年注册人数'
        },
        tooltip: {},
        legend: {
            data:['人数']
        },
        xAxis: {
            data: ["1月","2月","3月","4月","5月","6月"]
        },
        yAxis: {},
        series: [{
            name: '人数',
            type: 'bar',
            data: [2000, 1120, 2236, 1220, 1110, 3320]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    // 饼图-------------------------------------------------------------------
    var myChart1 = echarts.init(document.querySelector('.right_table'));

    var option1 = {
        title : {
            text: '热门品牌销售',
            subtext: '纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['安踏','360','李宁','特步','耐克']
        },
        series : [
            {
                name: '',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'安踏'},
                    {value:310, name:'360'},
                    {value:234, name:'李宁'},
                    {value:135, name:'特步'},
                    {value:1548, name:'耐克'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    

    // 使用刚指定的配置项和数据显示图表。
    myChart1.setOption(option1);
});