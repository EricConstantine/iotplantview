<style scoped>
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
  height: 120px;
}

.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
  background: #fff;
  padding: 16px;
}

.demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  border-color: transparent;
}

.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
  border-color: #fff;
}

.tabpane {
  overflow-x: hidden;
  overflow-y: visible;
  margin-top: -16px;
  border-left: solid #ddd 1px;
  border-right: solid #ddd 1px;
  border-bottom: solid #ddd 1px;
  border-top: none;
}
.mainlist {
  width: 100%;
  overflow-x: hidden;
  overflow-y: visible;
}
</style>
<template>
     <Row :gutter="8">
        <Col span="6">
            <Card>
                <Tree :data="gatewaydata" :render="renderContent" :style="treestyle"></Tree>
            </Card>
        </Col>
        <Col span="18">
            <div v-show="isPro" class="demo-tabs-style1 " style="margin-bottom:0px;background-color:#fff;">
               <Card dis-hover :style="panestyle">
                <p slot="title">产品信息</p>
                <Row>
                    <Col span='12'>
                        <span class='title'>产品序列号:</span><span>{{curproduct.id}}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <span class='title'>产品名称:</span><span>{{curproduct.name}}</span>
                    </Col>
                    <Col span='12'>
                        <span class='title'>产品描述:</span><span>{{curproduct.describes}}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <span class='title'>产品协议:</span><span>{{curproduct.treaty}}</span>
                    </Col>
                    <Col span='12'>
                        <span class='title'>所属用户:</span><span>{{curproduct.creator}}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <span class='title'>创建时间:</span><span>{{curproduct.createtime}}</span>
                    </Col>
                    <Col span='12'>
                        <span class='title'>更新时间:</span><span>{{curproduct.updatetime}}</span>
                    </Col>
                </Row>
                <Row style="margin-top:20px">
                    <Table border :columns="nodecolumn" :data="curnodedata">
                    </Table>
                </Row>
            </Card>
            </div>
             <div v-show="!isPro" class="demo-tabs-style1 " style="margin-bottom:0px;background-color:#fff;">
               <Card dis-hover :style="panestyle">
                <p slot="title">设备信息</p>
                <Row>
                    <Col span='12'>
                        <span class='title'>设备序列号:</span><span>{{curdevice.id}}</span>
                    </Col>
                    <Col span='12'>
                        <span class='title'>设备名称:</span><span>{{curdevice.name}}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <span class='title'>创建时间:</span><span>{{curdevice.createtime}}</span>
                    </Col>
                    <Col span='12'>
                        <span class='title'>更新时间:</span><span>{{curdevice.updatetime}}</span>
                    </Col>
                </Row>
                <Row style="margin-top:20px">
                    <Table border :columns="nodecolumnDev" :data="curdevdata">
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="primary" size="small" style="margin-right: 5px" @click="dataset(row)">数据下置</Button>
                            <Button type="primary" size="small" style="margin-right: 5px" @click="dataset(row)">实时曲线</Button>
                            <Button type="primary" size="small" style="margin-right: 5px" @click="dataset(row)">历史查询</Button>
                        </template>
                    </Table>
                </Row>
            </Card>
            </div>
            <div>
                <Drawer title="数据下置" :closable="false" v-model="openset" id="setdiv">
                    <p style="margin-top:50%;margin-bottom:2%">
                        <Input v-model="dsdata.key">
                            <span slot="prepend">KEY</span>
                        </Input>
                    </p>
                    <p style="margin-bottom:2%">
                        <Input v-model="dsdata.value" type="textarea" :rows="4" placeholder="Enter something..." />
                    </p>
                    <p>
                        <Button type="success" long @click="sendData()">SUBMIT</Button>
                    </p>
                </Drawer>
            </div>
        </Col>
    </Row>
</template>
<script>
    let mqtt = require('mqtt');
    var client
    const options = {
    port: 61614,
    connectTimeout: 2000,
    clientId: 'webgate'+Math.random(),
    username: 'admin',
    password: 'admin',
    clean: true
    }
    client = mqtt.connect('mqtt://59.110.142.242', options)
    import {getProductTree,getnodes,getDevice} from '@/api/product'
    import Cookies from 'js-cookie';
    const uuidv1 = require('uuid/v1');
    const moment = require('moment');
    export default {
        data () {
            return {
                dsdata:{
                    key: '',
                    value: '',
                },
                openset: false,
                isPro:true,//区分选中的是产品还是设备
                selectionid:'',//默认选中的id
                treestyle: {
                    height: ''
                },
                panestyle: {
                    height: ''
                },
                curdevice:{},//当前选中的设备
                curproduct:{},//当前选中的产品
                curdevdata:[],//当前设备信息
                curnodedata:[],//当前选中的节点信息
                nodecolumn: [
                    {
                    title: '名称',
                    key: 'name'
                    },
                    {
                    title: '描述',
                    key: 'describes'
                    },
                    {
                    title: 'KEY',
                    key: 'skey'
                    },
                    {
                    title: '读写类型',
                    key: 'rwtype'
                    },
                    {
                    title: '数据类型',
                    key: 'datatype'
                    },
                    {
                    title: '单位',
                    key: 'sunit'
                    }
                ],
                nodecolumnDev: [
                    {
                    title: '名称',
                    key: 'name'
                    },
                    {
                    title: '描述',
                    key: 'describes'
                    },
                    {
                    title: 'KEY',
                    key: 'skey'
                    },
                     {
                    title: '实时数据',
                    key: 'svalue'
                    },
                    {
                    title: '读写类型',
                    key: 'rwtype'
                    },
                    {
                    title: '数据类型',
                    key: 'datatype'
                    },
                    {
                    title: '单位',
                    key: 'sunit'
                    },
                    {
                    title: '操作',
                    slot: 'action',
                    width: 250,
                    align: 'center'
                    }
                ],
                table: {
                    loading:false,
                    selection:[],
                    keywords: ''
                },
               gatewaydata: [
                    {
                        title: '产品列表',
                        expand: true,
                        render: (h, { root, node, data }) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'happy-outline',
                                            color: '#2d8cf0',
                                            size: '15'                                
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.title)
                                ]),
                                
                            ]);
                        },
                        children: []
                    }
                ],
                buttonProps: {
                    type: 'ghost',
                    size: 'small',
                },
                
               
            };
        },
        methods: {
            dataset (data) {
                this.openset = true
                this.dsdata.key = data.skey
                console.log(data)
            },
            sendData(){
                client.publish("server/"+this.selectionid, JSON.stringify(this.dsdata))
                //this.$emit('sendTabData', JSON.stringify(this.dsdata));
            },
            //异步加载数据不要了
            // loadData (item, callback) {
            //     console.log(999)
            //     getDevice(item.id).then(response => {
            //         //self.curnodedata = response.data.data
            //         console.log(response.data.data)
            //         let data = response.data.data;
            //         let result = [];
            //         for(let i=0;i<data.length;i++){
                        
            //         }
            //         callback(response.data.data);
            //     }).catch((response) => {
            //         console.log(response)
            //     })
            // },
            //初始化树的高度
            initHight () {
                this.treestyle.height = window.innerHeight - 185 + 'px'
                this.panestyle.height = window.innerHeight - 172 + 'px'
            },
            renderContent (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('icon', {
                            props: {
                                type: 'md-cube',
                                size: '12',
                                color: data.color
                            },
                            style: {
                                marginRight: '5px'
                            }
                        }),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                type: data.buttontype,
                                inner: data.title
                            }),
                            style: {
                                margin: '-4px 0px 0px 0px'
                            },
                            on: {
                                click: () => { 
                                    this.handleTreeClick(data)
                                },
                                hover: () => { 
                                    //console.log(11)
                                }
                            }
                        }, data.title)
                    ])
                ]);
            },
            handleTreeClick (data) {
                // 初始化基本信息列表
                this.selectionid = data.id;
                let self = this
                var find = function(arr){
                    arr.forEach((item) => {
                        if(item.id==self.selectionid){
                            item.buttontype = 'primary';
                        }else{
                            item.buttontype = 'text';
                        }
                        if(item.children && item.children.length > 0){
                            find(item.children);
                        }
                    })
                }
                find(this.gatewaydata[0].children);//所有按钮取消选中
                if(data.type == 'Pro'){
                    this.isPro = true;
                    this.curproduct = data;
                    getnodes(data.id).then(response => {
                        self.curnodedata = response.data.data
                    }).catch((response) => {
                        console.log(response)
                    })
                }else{
                    this.isPro = false;
                    this.curdevice = data;
                    getnodes(data.pid).then(response => {
                        self.curdevdata = response.data.data
                    }).catch((response) => {
                        console.log(response)
                    })
                }

            },
            initcontent (message_obj) {
                // 页面刚进入时开启长连接
                let self = this
                console.log(this.$axios)
                getProductTree().then(response => {
                    console.log('初始化产品树')
                    console.log(response)
                    console.log(response.data.treedata)
                    let contents = []
                    let onlinedata = response.data.onliendata;
                    for (let i = 0; i < response.data.treedata.length; i++) {
                        let content = { expand: true }
                        content.title = response.data.treedata[i].name + '-' + response.data.treedata[i].describes
                        if (self.selectionid == response.data.treedata[i].id) {
                            content.buttontype = 'primary'
                        } else {
                            content.buttontype = 'text'
                        }
                        if (i == 0) content.selected = true
                        content.id = response.data.treedata[i].id
                        content.name = response.data.treedata[i].name
                        content.describes = response.data.treedata[i].describes
                        content.treaty = response.data.treedata[i].treaty
                        content.createtime = response.data.treedata[i].createtime
                        content.updatetime = response.data.treedata[i].updatetime
                        content.creator = response.data.treedata[i].creator
                        content.color = '#47A8BD'
                        content.type = 'Pro'
                        if(response.data.treedata[i].children.length>0){
                            let childrendata = response.data.treedata[i].children;
                            if(onlinedata.length>0){
                                for(let k=0;k<childrendata.length;k++){
                                    if(onlinedata.indexOf(childrendata[k].id)>-1){
                                        childrendata[k].color = '#19be6b'
                                    }
                                }
                            }
                            content.children = childrendata;
                        }
                        contents.push(content)
                    }
                    self.gatewaydata[0].children = contents
                    if (self.selectionid == '') {
                        self.gatewaydata[0].children[0].buttontype = 'primary'
                        // 初始化选中
                        self.handleTreeClick(self.gatewaydata[0].children[0])
                        self.selectionid = self.gatewaydata[0].children[0].id
                    }
                    }).catch((response) => {
                    console.log(response)
                    })
            },
            mqttMSG () {
                // mqtt连接
                client.on('connect', (e) => {
                    console.log('连接成功:')
                    client.subscribe('device/#', { qos: 1 }, (error) => {
                    if (!error) {
                        console.log('订阅成功')
                    } else {
                        console.log('订阅失败')
                    }
                    })
                })
                // 接收消息处理
                client.on('message', (topic, msg) => {
                    let self = this;
                    console.log('收到来自', topic, '的消息', msg.toString())
                    let arrtopic = topic.split("/");
                    let receivesn = arrtopic[1];
                    let message = JSON.parse(msg.toString());
                    for(let i=0;i<message.length;i++){
                        let key = message[i].key;
                        let data = message[i].value;
                        if(key=='online'){
                            for(let j=0;j<self.gatewaydata[0].children.length;j++){
                                if(self.gatewaydata[0].children[j].id==data){
                                    for(let k=0;k<self.gatewaydata[0].children[j].children.length;k++){
                                        if(self.gatewaydata[0].children[j].children[k].id==receivesn){
                                            self.gatewaydata[0].children[j].children[k].color = '#19be6b';
                                            return;
                                        }
                                    }
                                }
                            }
                        }else if(key == 'offline'){
                            for(let j=0;j<self.gatewaydata[0].children.length;j++){
                                if(self.gatewaydata[0].children[j].id==data){
                                    for(let k=0;k<self.gatewaydata[0].children[j].children.length;k++){
                                        if(self.gatewaydata[0].children[j].children[k].id==receivesn){
                                            self.gatewaydata[0].children[j].children[k].color = '#bbbec4';
                                            return;
                                        }
                                    }
                                }
                            }
                        }else if(this.selectionid == receivesn){
                            //数据存储
                            console.log('ddddddddddddddddddddd')
                            console.log(self.curdevdata)
                            for(let j=0;j<self.curdevdata.length;j++){
                                if(self.curdevdata[j].skey==key){
                                    console.log('找到了')
                                    self.curdevdata[j].svalue = data;
                                    console.log(self.curdevdata)
                                }
                            }

                        }
                    }
                    //否则把数据传递给子页面
                   // this.mqttdata = message;
                    
                })
                // 断开发起重连
                client.on('reconnect', (error) => {
                    console.log('正在重连:', error)
                })
                // 链接异常处理
                client.on('error', (error) => {
                    console.log('连接失败:', error)
                })
            }
        },
        mounted () {
            this.mqttMSG();
            window.onresize = () => {
            return (() => {
                this.initHight()
            })()
            }
        },
        created(){
            this.initHight()
            this.initcontent()
        },
        watch:{
          
        }
    }
</script>