<template>
    <div>
        <Row>
            <Col span="8">
                <Card>
                     <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        状态报告
                    </p>
                    <Row>
                        <Col span="24">
                            按时间检索 <DatePicker type="month" placeholder="Select month" style="width: 200px"></DatePicker>
                            <Button type="primary">查询</Button>
                        </Col>
                    </Row>
                    <div style="border:1px #F0F0F0;width:370px">
                        <Row style="margin:5px auto">
                            <span>&nbsp;&nbsp;标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;识</span><Input prefix="ios-contact" placeholder="" size="small" style="width:90px" />
                        </Row>
                        <Row style="margin:5px auto">
                            <Col span="12">
                                上行流量 <Input prefix="ios-contact" placeholder=""  size="small" style="width:90px"/>KB
                            </Col>
                            <Col span="12">
                                下行流量 <Input prefix="ios-contact" placeholder=""  size="small" style="width:90px" />KB
                            </Col>
                        </Row>
                        <Row style="margin:5px auto">
                             <Input v-model="value7" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="Enter something..." />
                        </Row>
                        <Row style="margin:5px auto">
                            <Button type="primary">在线时长</Button> <Button type="primary">离线时长</Button>
                        </Row>
                        <Row style="margin:5px auto">
                            统计信息 <Input prefix="ios-contact" placeholder=""  size="small" style="width:82%"/>
                        </Row>
                    </div>
                </Card>
                <Card>
                    <Row>
                        <Table stripe border size="small" ref="selection" :columns="sbcscolumn1" :data="sbcsdata" :loading="table.loading"></Table>
                    </Row>
                </Card>
            </Col>
             <Col span="16">
                <Card style="height:325px">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        通信状态流量图
                    </p>
                    <div>
                       <platform-data></platform-data>
                    </div>
                </Card>
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        无线模块状态跟踪
                    </p>
                    <Row>
                        <Button type="primary">在线查询</Button>
                    </Row>
                    <Row>
                         <Table stripe border size="small" ref="selection" :columns="sbcscolumn" :data="sbcsdata" :loading="table.loading"></Table>
                    </Row>
                </Card>
             </Col>
        </Row>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    import platformData from './platformData.vue';
    const uuidv1 = require('uuid/v1');
    export default {
        components: {
            platformData
        },
        data () {
            return {
                table: {
                    loading:false,
                    selection:[],
                    keywords: ''
                },
                value7:'',
                sbcsdata: [],
                sbcscolumn1:[
                    {
                        key: 'name',
                        title: '时间',
                    }
                    ,
                    {
                        key: 'eid',
                        title: '状态',
                    }
                    ,
                    {
                        key: 'bindcode',
                        title: '参数',
                    }
                ],
                sbcscolumn: [
                    {
                        key: 'name',
                        title: 'TIME',
                    }
                    ,
                    {
                        key: 'eid',
                        title: 'Module',
                    }
                    ,
                    {
                        key: 'bindcode',
                        title: 'SIM',
                    }
                    ,
                    {
                        key: 'bindcode',
                        title: 'PPP',
                    }
                    ,
                    {
                        key: 'bindcode',
                        title: 'CSQ',
                    }
                    ,
                    {
                        key: 'bindcode',
                        title: 'CH1',
                    }
                    ,
                    {
                        key: 'bindcode',
                        title: 'CH2',
                    }
                    ,
                    {
                        key: 'bindcode',
                        title: 'CH3',
                    }
                    ,
                    {
                        key: 'bindcode',
                        title: 'CH4',
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