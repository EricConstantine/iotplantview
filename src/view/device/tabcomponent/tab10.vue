<template>
    <div>
     <Card style="width:100%">
        <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            授权状态
        </p>
        <Row style="margin:5px auto">
            <Col>
                 <div>
                    <Col span="10">
                        设备编码：
                        <Input  readonly prefix="ios-contact" v-model="sn" style="width: auto" />
                    </Col>
                    <Col span="8">
                        授权状态：
                        <Input  readonly prefix="ios-contact" v-model="empowerval" style="width: auto" />
                    </Col>
                     <Col span="4">
                         <Button type="primary" @click="searchonline">在线查询</Button>
                    </Col>
                </div>
            </Col>
        </Row>
        <Row style="margin:5px auto">
            <Col span="10">
                限制状态：
                <Input  readonly prefix="ios-contact" v-model="authendata.rstata" style="width: auto" />
            </Col>
            <Col span="12">
                授权限制列表
            </Col>
        </Row>
        <Row  style="margin:5px auto">
            <Col span="10">
                <Input  readonly v-model="authendata.other" type="textarea" :autosize="{minRows: 10,maxRows: 15}"  />
            </Col>
            <Col span="10">
                <Input  readonly v-model="authendata.num" type="textarea" :autosize="{minRows: 10,maxRows: 15}"  />
            </Col>
        </Row>
        <Row  style="margin:5px auto">
             <Col span="20" style="border:2px solid #F0F0F0">
                 <Input  readonly v-model="authendata.secretkey" type="textarea" :autosize="{minRows: 3,maxRows: 5}"  />
             </Col>
        </Row>
    </Card>
    <Card style="width:100%">
        <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            设置授权(请向设备供应商索取授权码)
        </p>
        <Row style="margin:5px auto">
            <Col span="20">
              <Input  v-model="inputkey" type="textarea" :autosize="{minRows: 3,maxRows: 5}"  />
            </Col>
        </Row>
        <Row style="margin:5px auto">
            <Col span="18">
                <Input  readonly style="width:200 " v-model="username" prefix="ios-contact" placeholder="Enter name" />
            </Col>
            <Col span="2" align="center">
                <Button type="primary" @click="authensetkey">在线设置</Button>
            </Col>
        </Row>
    </Card>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    const uuidv1 = require('uuid/v1');
    export default {
        props: {
            empower:{
                type: Number
            },
            sn:{
                type: String
            },
            tab10authendata:{
                type: Object
            }
        },
        data () {
            return {
              //  sn:'',
                empowerval:'未授权',
                authendata:{
                    wstata:'',
                    rstata:'',
                    num:'',
                    other:'',
                    secretkey:''
                },
                inputkey:'',
                username:'',
            };
        },
        inject: ['authenrequest','authenset'],
        methods: {
            authensetkey(){
                let key = this.inputkey;
                if(key!=''){
                    this.$emit("authensetkey",key)
                }else{
                    this.$Message.warning('请输入有效的KEY');
                }
            },
            searchonline(){//在线查询
                this.authenrequest();
            }
        },
        mounted () {
            this.username=Cookies.get('user');
            console.log("Math.random():"+Math.random());
        },
        created(){
        },
        watch:{
          //监听双向绑定数据变化  调用handleOn方法  存入localStorage 做到双向绑定
            empower:{
              handler:function (val, oldVal) {
                  console.log('xxxx')
                  this.empower=val;
                  if(val==0){
                      this.empowerval = '未授权'
                  }else{
                      this.empowerval = '已授权'
                  }
              }
          },
          sn:{
              handler:function (val, oldVal) {
                   console.log('vvvvvvvvvvvvvvvv')
                  this.sn=val;
                 // this.handleInitTreeData(val);
              }
          },
          tab10authendata:{
              handler:function (val, oldVal) {
                   console.log('vvvvvvvvvvvvvvvv')
                  this.authendata=val;
                  if(val.wstata == 1) this.empowerval = '已授权';
                  else this.empowerval = '未授权';
                 // if(val.secretkey !='') this.inputkey = val.secretkey;
                 // this.handleInitTreeData(val);
              }
          }
        }
    }
</script>