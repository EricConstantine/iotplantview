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
                    <Select v-model="formValidate.node" placeholder="请选择需要模拟的节点" style="width:24%;float:left" :disabled="!isEdit">
                        <Option v-for="item in nodeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem >
                    <div style="float:right;">
                        <Button type="primary" @click="handleSubmit('formValidate')" v-if="isEdit">创建</Button>
                        <Button type="primary" @click="openEdit()" v-if="!isEdit">编辑</Button>
                        <Button @click="handleReset('formValidate')" style="margin-left: 8px" v-if="isEdit">重置</Button>
                    </div>
                </FormItem>
            </Form>
        </Card>
        <Card :bordered="false" style="width:49%;float:left;margin-top:20px;margin-right:1%">
            <p slot="title">模拟发送数据</p>
            <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
        </Card>
        <Card :bordered="false" style="width:49%;float:left;margin-top:20px;margin-left:1%">
            <p slot="title">模拟接收数据</p>
            <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
        </Card>
    </div>
</template>
<script>
import {getProductList,getDevice,getnodes} from '@/api/product'
    export default {
        data () {
            return {
                isEdit:true,//是否可编辑
                proList:[],
                devList:[],
                nodeList:[],
                formValidate: {
                    product: '',
                    device: '',
                    isNew: 'yes',
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
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.isEdit = false;
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
            
        },
        mounted () {
            //初始化产品下拉框
            this.getProList();
        },
        created(){
            // this.initHight()
            // this.initcontent()
        },
        watch:{
          
        }
    }
</script>