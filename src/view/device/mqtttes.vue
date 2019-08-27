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
        overflow-x:hidden;overflow-y: visible;
        margin-top:-16px;
        border-left:solid #ddd 1px;
        border-right:solid #ddd 1px;
        border-bottom:solid #ddd 1px;
        border-top:none;
    }
    .mainlist{
        width:100%;overflow-x:hidden;overflow-y: visible
    }
</style>
<template>

    <Row :gutter="5">
      <Col span="4">
        <Card style="padding:2px 5px 2px 5px;overflow-y:auto;overflow-x:auto;">
          <Tree :data="gatewaydata" :render="renderContent" :style="treestyle"></Tree>
        </Card>
      </Col>
      <Col span="20">
        <div class="demo-tabs-style1" style="margin-bottom:0px;background-color:#F0F0F0;">
          <Tabs type="card" @on-click="clicktabs">
            <TabPane label="设备平台数据" class="tabpane" :style="panestyle">
                <tab1  :tablepointloading="table.point.loading"  :pointdata0="pointdata0" :pointdata1="pointdata1" 
                :pointdata2="pointdata2" :pointdata3="pointdata3" :pointdata4="pointdata4" :pointdata5="pointdata5" 
                :pointdata6="pointdata6" :pointdata7="pointdata7" :pointdata8="pointdata8" :pointdata9="pointdata9" :pointdata="pointdata"  :downurl="downurl" :tab1data="tab1data" @initcontent="initcontent" @sendTabData="sendTabData"  @closeSn="closeSn" @exportNet="exportNet"  :tablebaseloading="table.base.loading"></tab1><!--@submitPushWeb="submitPushWeb"-->
            </TabPane>
            <TabPane label="设备现场数据" class="tabpane" :style="panestyle">
                <tab2 :tab2treedata="tab2treedata" :sn="selectionsn"></tab2>
            </TabPane>
            <!-- <TabPane label="设备参数集" class="tabpane" :style="panestyle">
                <tab3></tab3>
            </TabPane>
            <TabPane label="设备现场SOE" class="tabpane" :style="panestyle">
                  <tab4></tab4>
            </TabPane>
            <TabPane label="通道监视" class="tabpane" :style="panestyle">
                <tab5></tab5>
            </TabPane> -->
            <TabPane label="日志检索" class="tabpane" :style="panestyle">
                  <tab6 :tab6logdata="tab6logdata" ></tab6>
            </TabPane>
            <!-- <TabPane label="应用事件" class="tabpane" :style="panestyle">
                  <tab7></tab7>
            </TabPane>
            <TabPane label="状态检索" class="tabpane" :style="panestyle">
                  <tab8></tab8>
            </TabPane>
            <TabPane label="异常捕捉" class="tabpane" :style="panestyle">
                  <tab9></tab9>
            </TabPane> -->
            <TabPane label="授权管理" class="tabpane" :style="panestyle">
                  <tab10 :sn="selectionsn" @authensetkey="authensetkey" :empower="selectempower" :tab10authendata="tab10authendata" ></tab10>
            </TabPane>
            <!-- <TabPane label="接入管理" class="tabpane" :style="panestyle">
                  <tab11></tab11>
            </TabPane> -->
        </Tabs>
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
    import Cookies from 'js-cookie';
    import tab1 from './tabcomponent/tab1';
    import tab2 from './tabcomponent/tab2';
    import tab3 from './tabcomponent/tab3';
    import tab4 from './tabcomponent/tab4';
    import tab5 from './tabcomponent/tab5';
    import tab6 from './tabcomponent/tab6';
    import tab7 from './tabcomponent/tab7';
    import tab8 from './tabcomponent/tab8';
    import tab9 from './tabcomponent/tab9';
    import tab10 from './tabcomponent/tab10';
    import tab11 from './tabcomponent/tab11';
    const uuidv1 = require('uuid/v1');
    const download = require("downloadjs");
    export default {
        name: 'nethome',
        components: { // 声明子组件
            tab1,
            tab2,
            tab3,
            tab4,
            tab5,
            tab6,
            tab7,
            tab8,
            tab9,
            tab10,
            tab11,
        },
        provide(){
            return{
                refreshTab2TreeData: this.refreshTab2TreeData,
                authenrequest: this.authenrequest,
                authenset: this.authenset
            }
        },
        data () {
            return {
                exportfile:false,//是否允许导出文件
                downurl:'',
                selectionsn:'',//当前选中的节点sn
                selectempower:0,//当前选中节点授权状态
                treestyle:{
                    height:''
                },
                panestyle:{
                    height:''
                },
                table: {
                    point: {
                        loading:false,
                    },
                    base: {
                        loading:false,
                    }
                },
                freshloading: false,
                tab1data:{},
                pointdata:[],
                pointdata0:[],
                pointdata1:[],
                pointdata2:[],
                pointdata3:[],
                pointdata4:[],
                pointdata5:[],
                pointdata6:[],
                pointdata7:[],
                pointdata8:[],
                pointdata9:[],
                tab2treedata:{},
                tab6logdata:[],
                tab10authendata:{},
                gatewaydata: [
                    {
                        title: '设备列表',
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
                                            type: 'network',
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
                heartbeatinterval:null
            }
        },
        methods: {
            clicktabs(e){
                if(e==2){//日志管理
                    client.publish("webgate/"+this.selectionsn, '{"code":"requestlogdata","data":"'+this.selectionsn+'"}')
                }
            },
            refreshTab2TreeData(){//设备数据库
                client.publish("webgate/"+this.selectionsn, '{"code":"requestgtdata","data":"'+this.selectionsn+'"}')
            },
            authenrequest(){//授权管理查询
                client.publish("webgate/"+this.selectionsn, '{"code":"warrantInfo","data":"'+this.selectionsn+'"}')
            },
            authenset(){//授权管理在线设置
                client.publish("webgate/"+this.selectionsn, '{"code":"authentication","data":"'+this.selectionsn+'"}')
            },
            authensetkey(key){//授权管理在线设置
                let username=Cookies.get('user');
                client.publish("webgate/"+this.selectionsn, '{"code":"authentication", "data":{"bsn":"'+this.selectionsn+'","usrInfo":"'+username+'","secretkey":"'+key+'"}}')
            },
            sendTabData(data){
                console.log('父组件收到了'+data)
                client.publish("webgate/"+this.selectionsn, '{"code":"refresh","data":"'+data+'"}')
            },
            exportNet(){
                console.log('父页面的关闭方法')
                let sn = this.selectionsn;
                this.exportfile = true;
                client.publish("webgate/"+this.selectionsn, '{"code":"getConfigbin","data":"'+sn+'"}')
            },
            closeSn(){//关闭设备
             console.log('父页面的关闭方法')
                let sn = this.selectionsn;
                console.log(sn)
                client.publish("webgate/"+this.selectionsn, '{"code":"closesn","data":"'+sn+'"}')
            },
            renderContent (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'record',
                                size: '12',
                                color: data.color
                            },
                            style: {
                                marginRight: '8px'
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
                                    console.log('wwwwwwwwwwwwwwwwww')
                                    console.log(data) 
                                    this.handleTreeClick(data)
                                    //初始化树节点的选中效果
                                    this.selectionsn = data.sn;//当前选中的sn
                                    this.selectempower = data.empower;
                                    for(let i=0;i<this.gatewaydata[0].children.length;i++){
                                        let thissn = this.gatewaydata[0].children[i].sn;
                                        this.gatewaydata[0].children[i].buttontype = 'text';
                                        if(data.sn == thissn) this.gatewaydata[0].children[i].buttontype = 'primary';
                                    }
                                },
                                hover: () => { 
                                    //console.log(11)
                                }
                            }
                        }, data.title)
                    ])
                ]);
            },
            handleTreeClick(data){
                //初始化基本信息列表
                this.tab1data = data;
                this.downurl = '';//初始化下载连接按钮
                let self = this;
                let param = new FormData(); //创建form对象
                param.append('sn',data.sn);//ID
                self.$axios.post('/netgate-server/pointmsg/find',  param, {
                    headers: {
                        "Content-Type":"application/json;charset=utf-8"
                    }
                }).then(function(response) {
                    console.log('查询moogo获得测点数据')
                     console.log(response)
                    self.tab6logdata = [];
                    self.pointdata0=[];
                    self.pointdata1=[];
                    self.pointdata2=[];
                    self.pointdata3=[];
                    self.pointdata4=[];
                    self.pointdata5=[];
                    self.pointdata6=[];
                    self.pointdata7=[];
                    self.pointdata8=[];
                    self.pointdata9=[];
                    if( response.data  == "") return;
                    if(response.data.data0!="") {
                        self.pointdata0=JSON.parse(response.data.data0);
                    }if(response.data.data1!=""){
                        self.pointdata1=JSON.parse(response.data.data1);
                    }if(response.data.data1!=""){
                        self.pointdata2=JSON.parse(response.data.data2);
                    }if(response.data.data1!=""){
                        self.pointdata3=JSON.parse(response.data.data3);
                    }if(response.data.data1!=""){
                        self.pointdata4=JSON.parse(response.data.data4);
                    }if(response.data.data1!=""){
                        self.pointdata5=JSON.parse(response.data.data5);
                    }if(response.data.data1!=""){
                        self.pointdata6=JSON.parse(response.data.data6);
                    }if(response.data.data1!=""){
                        self.pointdata7=JSON.parse(response.data.data7);
                    }if(response.data.data1!=""){
                        self.pointdata8=JSON.parse(response.data.data8);
                    }if(response.data.data1!=""){
                        self.pointdata9=JSON.parse(response.data.data9);
                    }else self.pointdata=[]
                    console.log("获得测点数据")
                    // console.log(self.pointdata)
                }).catch( function(response) {
                    self.$Message.error('请求测点数据失败');
                    console.log(response)
                });
            //    data.curpushweb = pushweb;
            },
            initcontent(message_obj){
                //页面刚进入时开启长连接
                let self = this;
                let eid = Cookies.get('eid');
                this.$axios.get("/netgate-server/gateway/homepagedata?page=0&size=10000&sort=name,asc&keywords="+''+"&eid="+eid, {}, {
                    headers: {
                        "Content-Type":"application/json;charset=utf-8"
                    },
                }).then(function(response) {
                    self.table.loading = false;//取消loading效果
                    console.log("开始初始化网关树结构")
                    console.log(response.data)
                    let contents = [];
                    for(let i=0;i<response.data.content.length;i++){
                        let content = {expand: true};
                        content.title = response.data.content[i].name+'-'+response.data.content[i].description;
                        content.color = '#bbbec4';
                        // content.buttontype = 'text';
                        if(self.selectionsn == response.data.content[i].sn){
                             content.buttontype = 'primary';
                        }else{
                            content.buttontype = 'text'
                        }

                        if(i == 0) content.selected = true;
                        content.id = response.data.content[i].id;
                        content.name = response.data.content[i].name;
                        content.eid = response.data.content[i].eid;
                        content.sn = response.data.content[i].sn;
                        content.bindcode = response.data.content[i].bindcode;
                        content.online = response.data.content[i].online;
                        content.description = response.data.content[i].description;
                        content.basemsg = response.data.content[i].basemsg;
                        // content.pointmsg = response.data.content[i].pointmsg;
                        content.pushweb = response.data.content[i].pushweb;
                        content.storagedb = response.data.content[i].storagedb;
                        content.aipd = response.data.content[i].aipd;
                        content.empower = response.data.content[i].empower;
                        contents.push(content);
                    }
                    self.gatewaydata[0].children = contents;
                    if(self.selectionsn == ''){
                        self.gatewaydata[0].children[0].buttontype = 'primary';
                        self.handleTreeClick(self.gatewaydata[0].children[0]);
                        self.selectionsn = self.gatewaydata[0].children[0].sn;
                    }
                    console.log(contents)
                    //有值代表需要更新在线状态  没有值代表第一次进来需要初始化WS连接
                    if(message_obj) {
                        for(let j=0;j<self.gatewaydata[0].children.length;j++){
                            let isonline = false;
                            for(let i=0;i<message_obj.length;i++){
                                //console.log('11-'+self.gatewaydata[0].children[j].sn)
                                //console.log('22-'+message_obj[i].sn)
                                if(self.gatewaydata[0].children[j].sn == message_obj[i].sn){
                                    isonline = true;
                                }
                            }
                            if(isonline){
                                self.gatewaydata[0].children[j].color = '#19be6b';
                            }else{
                                self.gatewaydata[0].children[j].color = '#bbbec4';
                            }
                        }
                    }
                }).catch( function(response) {
                    self.$util.logout(self,response);
                });
            },
            remove (root, node, data) {
                const parentKey = root.find(el => el === node).parent;
                const parent = root.find(el => el.nodeKey === parentKey).node;
                const index = parent.children.indexOf(data);
                parent.children.splice(index, 1);
                //请求删除后台对应节点
                client.publish("webgate/"+data.sn, '{"code":"deletegt","data":"'+data.sn+'"}')
                // this.websocket.send('{"code":"deletegt","data":"'+data.sn+'"}'); 
                this.$Message.info('节点数据删除成功！');
            },
            initHight(){
                this.treestyle.height=window.innerHeight-185+'px';
                this.panestyle.height=window.innerHeight-172+'px';
            },
            downNetFile(base64str){
            },
            mqttMSG () {
                // mqtt连接
                client.on('connect', (e) => {
                    console.log('连接成功:')
                    client.subscribe('netgate/#', { qos: 1 }, (error) => {
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
                    //console.log('收到来自', topic, '的消息', message.toString())
                    let arrtopic = topic.split("/");
                    let receivesn = arrtopic[1];
                    let message = JSON.parse(msg.toString());
                    console.log(message)
                    let message_obj = message.data;  
                    if(message.code == 'online'){
                        //在线控制，如果收到了消息就让其在线。
                        for(let j=0;j<self.gatewaydata[0].children.length;j++){
                            if(receivesn==self.gatewaydata[0].children[j].sn){
                                self.gatewaydata[0].children[j].color = '#19be6b';
                            }
                        }
                    }else if(message.code == 'offline'){
                        //下线消息
                        for(let j=0;j<self.gatewaydata[0].children.length;j++){
                            if(receivesn==self.gatewaydata[0].children[j].sn){
                                self.gatewaydata[0].children[j].color = '#bbbec4';
                            }
                        }
                    }
                    if(this.selectionsn != receivesn) return;
                    if(message.code == 'rts'){//测点数据
                        console.log("收到测点数据")
                        let type = message.type;
                        if(type==0) this.pointdata0 = message_obj;
                        else if(type==1) this.pointdata1 = message_obj;
                        else if(type==2) this.pointdata2 = message_obj;
                        else if(type==3) this.pointdata3 = message_obj;
                        else if(type==4) this.pointdata4 = message_obj;
                        else if(type==5) this.pointdata5 = message_obj;
                        else if(type==6) this.pointdata6 = message_obj;
                        else if(type==7) this.pointdata7 = message_obj;
                        else if(type==8) this.pointdata8 = message_obj;
                        else if(type==9) this.pointdata9 = message_obj;
                    }else if(message.code == 'webline'){//后台状态数据
                        this.initcontent(message_obj);
                    }else if(message.code == 'uploadok'){
                        console.log('收到了文件上传消息')
                        console.log(message_obj)
                        download(message_obj.msg)
                    }else if(message.code == 'gtdata'){//接收设备数据库数据
                        this.tab2treedata = message;
                    }else if(message.code == 'logInfo'){//日志数据
                        this.tab6logdata = message_obj;
                    }else if(message.code == 'warrantInfo'){//授权查询数据
                        this.tab10authendata = message_obj;
                    }else if(message.code == 'getConfigbin'){//设备维护
                        console.log('设备维护')
                        ownfile(message_obj);
                        if(this.exportfile){
                            this.jsdownfile(message_obj);
                            this.exportfile = false;
                        }
                    }else if(message.code == 'heartbeat'){//设备维护
                        console.log(message_obj)
                    }
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
                     this.initHight();
                })()
            }
            //console.log("Math.random():"+Math.random());
            // download("http://39.96.35.45:8001/netgate-server/SN0000/timg.jpg");
        },
        created(){
            this.initHight();
            this.initcontent();
        },
　　　　 destroyed: function() {
　　　　	 //页面销毁时关闭长连接
            client.end();
　　　　 }
    }
</script>