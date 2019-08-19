<template>
     <Row :gutter="8">
        <div class="demo-tabs-style1" style="margin-bottom:0px;background-color:#fff;">
            <Row style="margin:-1px 0px 10px 0px;">
                <Col span="12">
                    <Row>
                         <Col span="5">
                            <Button type="primary"  @click="">刷新通道列表</Button>
                        </Col>
                        <Col span="16">
                            <Select v-model="model11" filterable>
                                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="3" style="text-alien:center">
                            <Button type="primary"  @click="">刷新</Button>
                        </Col> 
                    </Row>
                    <Row style=" margin-top:15px;margin-left:3px">
                        <div style="font-size:15px;">
                            <Col span="5" align="center">
                                <span style="font-size:15px;">
                                <Checkbox v-model="single">定时刷新</Checkbox>
                                </span>
                            </Col>
                            <Col span="14">
                                <Input v-model="value" placeholder="请输入定时时间，5秒以上有效..." style="width: 300px"></Input>秒
                            </Col>
                            <Col span="5">
                            <Input v-model="value" disabled>Q:O Q:A</Input>
                            </Col>
                         </div>
                    </Row>
                </Col>
                <Col span="12" style="border:1px solid #F0F0F0;height:84px;text-alien:center">
                    <div style="margin-top:20px;margin-left:20px">
                        <Row >
                            <Col span="4">
                                <Button size = 'large' type="primary" @click="">开始记录</Button>
                            </Col>
                            <Col span="16" align="center" >
                                <Checkbox v-model="single">添加空格</Checkbox>
                                <Checkbox v-model="single">包含字符</Checkbox>
                                <Input v-model="value" placeholder="" style="width: 100px"></Input>
                            </Col>
                            <Col span="4">
                                <Button size = 'large' type="primary"  icon="ios-refresh-outline" @click="">应用</Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row>
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
                value: '',
                single:false,
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
                        title: '时间',
                    }
                    ,
                    {
                        key: 'eid',
                        title: '通道',
                    }
                    ,
                    {
                        key: 'bindcode',
                        title: '方向',
                    }
                    ,
                    {
                        key: 'online',
                        title: '描述',
                    }
                    ,
                    {
                        key: 'online',
                        title: '内容',
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