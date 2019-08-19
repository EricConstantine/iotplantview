<template>
     <Row :gutter="8">
        <div class="demo-tabs-style1" style="margin-bottom:0px;background-color:#fff;">
            <Row style="margin:-1px 0px 20px 20px;">
                <Col span="2" align='center'>
                    <div  style="margin-top:7px;text-align:center; "> IO采集设备列 </div>
                </Col>
                <Col span="8">
                    <Select v-model="model11" filterable>
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="8" style="text-alien:center">
                     <Button type="primary" shape="circle" icon="ios-refresh-outline" @click="">刷新</Button>
                 </Col> 
            </Row>
            <Row style="margin:5px 20pxs">
                <Table stripe border size="small" ref="selection" :columns="sbcscolumn" :data="sbcsdata" :loading="table.loading"></Table>
            </Row>
        </div>
    </Row>
</template>
<script>
    import Cookies from 'js-cookie';
    const uuidv1 = require('uuid/v1');
    export default {
        data () {
            return {
                table: {
                    loading:false,
                    selection:[],
                    keywords: ''
                },
                sbcsdata: [],
                cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
                    }
                ],
                model11: '',
                sbcscolumn: [
                    {
                        key: 'name',
                        title: '参数',
                    }
                    ,
                    {
                        key: 'eid',
                        title: '描述',
                    }
                    ,
                    {
                        key: 'bindcode',
                        title: '描述',
                    }
                    ,
                    {
                        key: 'online',
                        title: '值',
                    }
                    ,
                    {
                        key: 'online',
                        title: '品质',
                    }
                    ,
                    {
                        key: 'online',
                        title: '时间戳',
                    }
                ],
            };
        },
        methods: {
        },
        mounted () {
            console.log("Math.random():"+Math.random());
        },
        created(){
        },
    }
</script>