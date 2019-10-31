<template>
    <div style="background:#eee;padding: 20px;height:100%">
        <Card :bordered="false">
            <p slot="title">模拟设备</p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="产品" prop="product" style="width:30%;float:left">
                    <Select v-model="formValidate.product" placeholder="请选择需要模拟的产品" @on-change="getDevNode()" :disabled="!isEdit">
                        <Option v-for="item in proList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="新设备" prop="isNew" style="width:20%;float:left">
                    <Select v-model="formValidate.isNew" placeholder="请选择是否是新设备" :disabled="!isEdit">
                        <Option value="yes">是</Option>
                        <Option value="no">否</Option>
                    </Select>
                </FormItem>
                <FormItem label="设备" prop="device" v-show="formValidate.isNew=='no'" style="width:30%;float:left">
                    <Select v-model="formValidate.device" placeholder="请选择需要模拟的设备" :disabled="!isEdit">
                        <Option v-for="item in devList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="设备" prop="device" v-show="formValidate.isNew=='yes'" style="width:30%;float:left">
                    <Input v-model="formValidate.device" placeholder="请输入需要模拟的设备序列号" :disabled="!isEdit"></Input>
                </FormItem>
               
                <FormItem >
                    <div style="float:right;margin-right:10px">
                        <Button type="primary" @click="handleSubmit('formValidate')" v-if="isEdit">发起连接</Button>
                        <Button type="error" @click="openEdit()" v-if="!isEdit">断开连接</Button>
                        <Button @click="handleReset('formValidate')" style="margin-left: 8px" v-if="isEdit">重置</Button>
                    </div>
                </FormItem>
                <FormItem label="节点" prop="node">
                    <CheckboxGroup v-model="formValidate.node" @on-change="changeNode()">
                        <Checkbox v-for="item in nodeList" :label="item.value" :key="item.value">
                            <Icon type="ios-cube" />
                            <span>{{ item.label }}</span>
                        </Checkbox>
                    </CheckboxGroup>
                    
                 </FormItem>
            </Form>
        </Card>
        <Card :bordered="false" style="width:49%;float:left;margin-top:20px;margin-right:1%;height:auto">
            <p slot="title">模拟发送数据</p>
            <p>
                <Form ref="formSendData" :model="formSendData" :label-width="80" style="width: 100%">
                    <FormItem
                            v-for="(item, index) in formSendData.items"
                            :key="index"
                            :label="item.label"
                            :prop="'items.' + index + '.msg'"
                            :rules="{required: true, message: item.label +' 节点不能为空', trigger: 'blur'}">
                        <Row>
                            <Col span="8">
                                <Input size="small" type="text" v-model="item.value" readonly></Input>
                            </Col>
                            <Col span="16">
                                <Input size="small" icon="ios-cube" type="text" v-model="item.msg" placeholder="请输入节点数据"></Input>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
            </p>
            <Button type="success" @click="snedDataToServer()" style="float:right;margin-top:5px;margin-bottom:5px" v-if="!isEdit">发送</Button>
        </Card>
        <Card :bordered="false" style="width:49%;float:left;margin-top:20px;margin-left:1%;height:auto">
            <p slot="title">模拟接收数据</p>
            <p>
                <Tag v-for="(item, index) in receiveData" :key="index"  type="dot"  @on-close="cloesTag(index)" closable color="success">{{item}}</Tag>
            </p>
            <Button type="info" @click="cleanReceive()" style="float:right;margin-top:5px;margin-bottom:5px" v-if="!isEdit">清空</Button>
        </Card>
    </div>
</template>
<script>
var client1 = {};
var client2 = {};
import {getProductList,getDevice,getnodes} from '@/api/product'
    export default {
        data () {
            return {
                sendData:[],
                receiveData:[],
                isEdit:true,//是否可编辑
                proList:[],
                devList:[],
                nodeList:[],
                formSendData:{
                    items:[]
                },
                formValidate: {
                    product: '',
                    device: '',
                    isNew: 'no',
                    node: []
                },
                ruleValidate: {
                    product: [
                        { required: true, message: '请选择要模拟的产品', trigger: 'change' }
                    ],
                    device: [
                        { required: true, message: '设备序列号不能为空', trigger: 'blur' }
                    ],
                    isNew: [
                        { required: true, message: '请选择是否是新设备', trigger: 'change' }
                    ],
                    node: [
                        { required: true, type: 'array', min: 1, message: '请选择要模拟的节点', trigger: 'change' }
                    ],
                   
                }
            }
        },
        methods: {
            cloesTag(i){
                this.receiveData.splice(i)
            },
            cleanReceive(){
                this.receiveData=[];
            },
            getCurTime(){
                var myDate = new Date();             
                var year=myDate.getFullYear();        //获取当前年
                var month=myDate.getMonth()+1;   //获取当前月
                var date=myDate.getDate();            //获取当前日
                var h=myDate.getHours();              //获取当前小时数(0-23)
                var m=myDate.getMinutes();          //获取当前分钟数(0-59)
                var s=myDate.getSeconds();
                var now=year+'-'+this.getNow(month)+"-"+this.getNow(date)+" "+this.getNow(h)+':'+this.getNow(m)+":"+this.getNow(s);
                return now;
            },
            getNow(s) {
                return s < 10 ? '0' + s: s;
            },
            //改变节点，改变模拟发送接口
            changeNode(){
                let nodeList = this.nodeList;
                let checkdata = this.formValidate.node;
                let resultData = [];
                console.log(checkdata)
                for(let i=0;i<checkdata.length;i++){
                    for(let j=0;j<nodeList.length;j++){
                        if(checkdata[i] == nodeList[j].value){
                            resultData.push(nodeList[j]);
                            break;
                        }
                    }
                }
                console.log(resultData)
                this.formSendData.items = resultData;
            },
            //模拟发送方法
            snedDataToServer(){
                 let self = this;
                 this.$refs['formSendData'].validate((valid) => {
                    if (valid) {
                        this.initMqtt();
                        self.isEdit = false;
                        let formData = this.formSendData.items;
                        let result = [];
                        for(let i=0;i<formData.length;i++){
                            result.push({key:formData[i].value,value:formData[i].msg})
                        }
                        client1.publish("device/"+this.formValidate.device, JSON.stringify(result))
                        self.$Message.success('数据发送成功!');
                    } else {
                        self.$Message.error('请完善节点数据!');
                    }
                })
            },
            getProList(){
                let self = this;
                getProductList()
                .then(function(response) {
                    let data = response.data.content;
                    let result = [];
                    for(let i=0;i<data.length;i++){
                        result.push({"value":data[i].id,"label":data[i].name})
                    }
                    self.proList = result;
                }).catch(function(response) {
                    self.$util.logout(self, response);
                });
            },
            getDevNode(){
                this.devList = [];
                this.nodeList = [];
                this.formValidate.device = '';
                this.formValidate.node = [];
                let pid = this.formValidate.product;
                let self = this;
                getDevice(pid)
                .then(function(response) {
                    let data = response.data.data;
                    let result = [];
                    for(let i=0;i<data.length;i++){
                        result.push({"value":data[i].id,"label":data[i].id})
                    }
                    self.devList = result;
                }).catch(function(response) {
                    self.$util.logout(self, response);
                });
                getnodes(pid)
                .then(function(response) {
                    let data = response.data.data;
                    let result = [];
                    for(let i=0;i<data.length;i++){
                        result.push({"value":data[i].skey,"label":data[i].name})
                    }
                    self.nodeList = result;
                }).catch(function(response) {
                    self.$util.logout(self, response);
                });
            },
            openEdit(){
                this.isEdit = true;
                client1.end();
                client2.end();
            },
            handleSubmit (name) {
                let self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.initMqtt();
                        self.isEdit = false;
                        let data = [{key:'online',value:this.formValidate.product}]
                        console.log(data)
                        client1.publish("device/"+this.formValidate.device, JSON.stringify(data))
                        self.$Message.success('Success!');
                    } else {
                        self.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            initMqtt () {
                let mqtt = require('mqtt');
                const options1 = {
                port: 61614,
                connectTimeout: 2000,
                clientId: 'device'+Math.random(),
                username: 'admin',
                password: 'admin',
                clean: true
                }
                const options2 = {
                port: 61614,
                connectTimeout: 2000,
                clientId: 'server'+Math.random(),
                username: 'admin',
                password: 'admin',
                clean: true
                }
                client1 = mqtt.connect('mqtt://59.110.142.242', options1)
                client2 = mqtt.connect('mqtt://59.110.142.242', options2)
                // mqtt连接
                client1.on('connect', (e) => {
                    console.log('发送端连接成功:')
                    client1.subscribe('server/#', { qos: 1 }, (error) => {
                    if (!error) {
                        console.log('设备订阅成功')
                    } else {
                        console.log('设备订阅失败')
                    }
                    })
                })
                client2.on('connect', (e) => {
                    console.log('接收端连接成功:')
                    client2.subscribe('device/#', { qos: 1 }, (error) => {
                    if (!error) {
                        console.log('平台订阅成功')
                    } else {
                        console.log('平台订阅失败')
                    }
                    })
                })
                 // 接收消息处理
                client1.on('message', (topic, msg) => {
                    let self = this;
                    console.log('【设备】收到来自', topic, '的消息', msg.toString())
                    let arrtopic = topic.split("/");
                    let receivesn = arrtopic[1];
                    let message = JSON.parse(msg.toString());
                    this.$Notice.info({
                        title: '收到一条来自平台的消息',
                        desc: msg
                    });
                    let server = message.value;
                })
                // 接收消息处理
                client2.on('message', (topic, msg) => {
                    let self = this;
                    console.log('收到来自', topic, '的消息', msg.toString())
                    let arrtopic = topic.split("/");
                    let receivesn = arrtopic[1];
                    let message = JSON.parse(msg.toString());
                    
                    console.log(message)
                    for(let i=0;i<message.length;i++){
                        if(message[i].key=='online'){
                            this.$Message.success('设备'+receivesn+'上线了!');
                        }else{
                            let str = receivesn+"_"+message[i].key+"_"+message[i].value+"_"+this.getCurTime();
                            if(this.receiveData.indexOf(str) == -1){
                                this.receiveData.push(str)
                                this.$Notice.success({
                                    title: '【平台】收到来自'+receivesn+'设备,节点为'+message[i].key+'的消息',
                                    desc: msg
                                });
                            }
                        }
                    }
                })
                 // 断开发起重连
                client1.on('reconnect', (error) => {
                    console.log('设备正在重连:', error)
                })
                // 链接异常处理
                client1.on('error', (error) => {
                    console.log('设备连接失败:', error)
                })
                // 断开发起重连
                client2.on('reconnect', (error) => {
                    console.log('平台正在重连:', error)
                })
                // 链接异常处理
                client2.on('error', (error) => {
                    console.log('平台连接失败:', error)
                })
            }
            
        },
        mounted () {
            //初始化产品下拉框
            this.getProList();
            // this.initMqtt();
        },
        created(){
            // this.initHight()
            // this.initcontent()
        },
        watch:{
          
        }
    }
</script>