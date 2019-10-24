<template>
    <div style="background:#eee;padding: 20px;height:100%">
        <Card :bordered="false">
            <p slot="title">模拟设备</p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="产品" prop="product" style="width:24%;float:left">
                    <Select v-model="formValidate.product" placeholder="请选择需要模拟的产品" @on-change="getDevNode()" :disabled="!isEdit">
                        <Option v-for="item in proList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="新设备" prop="isNew" style="width:24%;float:left">
                    <Select v-model="formValidate.isNew" placeholder="请选择是否是新设备" :disabled="!isEdit">
                        <Option value="yes">是</Option>
                        <Option value="no">否</Option>
                    </Select>
                </FormItem>
                <FormItem label="设备" prop="device" v-show="formValidate.isNew=='no'" style="width:24%;float:left">
                    <Select v-model="formValidate.device" placeholder="请选择需要模拟的设备" :disabled="!isEdit">
                        <Option v-for="item in devList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="设备" prop="device" v-show="formValidate.isNew=='yes'" style="width:24%;float:left">
                    <Input v-model="formValidate.device" placeholder="请输入需要模拟的设备序列号" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem label="节点" prop="node">
                    <Select v-model="formValidate.node" placeholder="请选择需要模拟的节点" style="width:22%;">
                        <Option v-for="item in nodeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem >
                    <div style="float:right;">
                        <Button type="primary" @click="handleSubmit('formValidate')" v-if="isEdit">连接</Button>
                        <Button type="error" @click="openEdit()" v-if="!isEdit">断开</Button>
                        <Button @click="handleReset('formValidate')" style="margin-left: 8px" v-if="isEdit">重置</Button>
                    </div>
                </FormItem>
            </Form>
        </Card>
        <Card :bordered="false" style="width:49%;float:left;margin-top:20px;margin-right:1%;height:50%">
            <p slot="title">模拟发送数据</p>
            <p>
                <Input v-model="sendData" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入要发送的消息..."></Input>
            </p>
            <Button type="success" @click="snedDataToServer()" style="float:right;margin-top:5px" v-if="!isEdit">发送</Button>
        </Card>
        <Card :bordered="false" style="width:49%;float:left;margin-top:20px;margin-left:1%;height:50%">
            <p slot="title">模拟接收数据</p>
            <p>
                <Input v-model="receiveData" type="textarea" :autosize="{minRows: 5,maxRows: 10}"></Input>
            </p>
        </Card>
    </div>
</template>
<script>
let mqtt = require('mqtt');
var client1
var client2
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
import {getProductList,getDevice,getnodes} from '@/api/product'
    export default {
        data () {
            return {
                sendData:'',
                receiveData:'',
                isEdit:true,//是否可编辑
                proList:[],
                devList:[],
                nodeList:[],
                formValidate: {
                    product: '',
                    device: '',
                    isNew: 'no',
                    node: ''
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
                        { required: true, message: '请选择要模拟的节点', trigger: 'change' }
                    ],
                   
                }
            }
        },
        methods: {
            //模拟发送方法
            snedDataToServer(){

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
                this.formValidate.node = '';
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
                        result.push({"value":data[i].id,"label":data[i].name})
                    }
                    self.nodeList = result;
                }).catch(function(response) {
                    self.$util.logout(self, response);
                });
            },
            openEdit(){
                this.isEdit = true;
            },
            handleSubmit (name) {
                let self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        self.isEdit = false;
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
                // mqtt连接
                client1.on('connect', (e) => {
                    console.log('发送端连接成功:')
                    client1.subscribe('server/#', { qos: 1 }, (error) => {
                    if (!error) {
                        console.log('订阅成功')
                    } else {
                        console.log('订阅失败')
                    }
                    })
                })
                client2.on('connect', (e) => {
                    console.log('接收端连接成功:')
                    client2.subscribe('device/#', { qos: 1 }, (error) => {
                    if (!error) {
                        console.log('订阅成功')
                    } else {
                        console.log('订阅失败')
                    }
                    })
                })
                 // 接收消息处理
                client1.on('message', (topic, msg) => {
                    let self = this;
                    console.log('收到来自', topic, '的消息', msg.toString())
                    let arrtopic = topic.split("/");
                    let receivesn = arrtopic[1];
                    let message = JSON.parse(msg.toString());
                    this.$Notice.info({
                        title: '收到一条来自平台的消息',
                        desc: nodesc ? '' : msg
                    });
                    console.log(999999999)
                    console.log(message)
                    let server = message.value;
                    
                    
                })
                // 接收消息处理
                client2.on('message', (topic, msg) => {
                    let self = this;
                    console.log('收到来自', topic, '的消息', msg.toString())
                    let arrtopic = topic.split("/");
                    let receivesn = arrtopic[1];
                    let message = JSON.parse(msg.toString());
                    this.$Notice.success({
                        title: '收到一条来自'+receivesn+'设备的消息',
                        desc: nodesc ? '' : msg
                    });
                    console.log(999999999)
                    console.log(message)
                    let message_obj = message.data;
                    
                    for(let j=0;j<self.gatewaydata[0].children.length;j++){
                        if(receivesn==self.gatewaydata[0].children[j].sn){
                            self.gatewaydata[0].children[j].color = '#19be6b';
                        }
                    }
                    if(message.key == 'offline'){
                        //下线消息
                        for(let j=0;j<self.gatewaydata[0].children.length;j++){
                            if(receivesn==self.gatewaydata[0].children[j].sn){
                                self.gatewaydata[0].children[j].color = '#bbbec4';
                            }
                        }
                    }
                    if(this.selectionsn != receivesn) return;
                    //否则把数据传递给子页面
                    this.mqttdata = message;
                    
                })
                 // 断开发起重连
                client1.on('reconnect', (error) => {
                    console.log('正在重连:', error)
                })
                // 链接异常处理
                client1.on('error', (error) => {
                    console.log('连接失败:', error)
                })
                // 断开发起重连
                client2.on('reconnect', (error) => {
                    console.log('正在重连:', error)
                })
                // 链接异常处理
                client2.on('error', (error) => {
                    console.log('连接失败:', error)
                })
            }
            
        },
        mounted () {
            //初始化产品下拉框
            this.getProList();
            this.initMqtt();
        },
        created(){
            // this.initHight()
            // this.initcontent()
        },
        watch:{
          
        }
    }
</script>