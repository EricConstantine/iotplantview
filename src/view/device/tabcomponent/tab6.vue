<template>
     <Row :gutter="8">
        <div class="demo-tabs-style1" style="margin-bottom:0px;background-color:#fff;">
            <Row>
                <Table stripe border size="small" ref="selection" :columns="logcolumn" :data="logdata" :loading="table.loading"></Table>
            </Row>
        </div>
    </Row>
</template>
<script>
    import Cookies from 'js-cookie';
    const moment = require('moment');
    const uuidv1 = require('uuid/v1');
    export default {
        props: {
            tab6logdata: {
                type: Array,
                default () {
                    return [];
                }
            },
        },
        data () {
            return {
                table: {
                    loading:false,
                    selection:[],
                    keywords: ''
                },
                logdata: [],
                logcolumn: [
                    {
                        key: 'logType',
                        title: '级别',
                    }
                    ,
                    {
                        key: 'time',
                        title: '时间',
                        // render: (h, params) => {
                        //     let time = params.row.time;
                        //     if(time<10000000000) time = time*1000;
                        //     return h('Font', moment(time).format('YYYY-MM-DD HH:mm:ss'));
                        // },
                    }
                    ,
                    {
                        key: 'model',
                        title: '模块',
                    }
                    ,
                    {
                        key: 'source',
                        title: '来源',
                    }
                    ,
                    {
                        key: 'obj',
                        title: '对象',
                    }
                    ,
                    {
                        key: 'msg',
                        title: '内容',
                    }
                ],
            };
        },
        methods: {
            initLogData(data){
                console.log('收到了日志数据')
                console.log(data)
                this.logdata = data;
            }
        },
        mounted () {
            console.log("Math.random():"+Math.random());
        },
        created(){
        },
        watch:{
          //监听双向绑定数据变化  调用handleOn方法  存入localStorage 做到双向绑定
            tab6logdata:{
                handler:function (val, oldVal) {
                       // this.arraydata[0]=val;
                        console.log('jiantingdaole 0000000000')
                        console.log(val)
                       this.initLogData(val);
                        // this.initpoindata(val,0)
                },
                deep:true
            },
        }
    }
</script>