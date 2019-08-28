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
            <tab1 :devicedata="devicedata" :sensordata="sensordata" :mqttdata="mqttdata" @sendTabData="sendTabData"></tab1>
          </TabPane>
          <!-- <TabPane label="设备现场数据" class="tabpane" :style="panestyle">
                <tab2 :tab2treedata="tab2treedata" :sn="selectionsn"></tab2>
            </TabPane>
            <TabPane label="日志检索" class="tabpane" :style="panestyle">
                  <tab6 :tab6logdata="tab6logdata" ></tab6>
            </TabPane>
            <TabPane label="授权管理" class="tabpane" :style="panestyle">
                  <tab10 :sn="selectionsn" @authensetkey="authensetkey" :empower="selectempower" :tab10authendata="tab10authendata" ></tab10>
          </TabPane>-->
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
import Cookies from 'js-cookie'
import tab1 from './tabcomponent/tab1'
// import tab2 from './tabcomponent/tab2';
// import tab3 from './tabcomponent/tab3';
// import tab4 from './tabcomponent/tab4';
// import tab5 from './tabcomponent/tab5';
// import tab6 from './tabcomponent/tab6';
// import tab7 from './tabcomponent/tab7';
// import tab8 from './tabcomponent/tab8';
// import tab9 from './tabcomponent/tab9';
// import tab10 from './tabcomponent/tab10';
// import tab11 from './tabcomponent/tab11';
const uuidv1 = require('uuid/v1')
const download = require('downloadjs')
export default {
  name: 'nethome',
  components: { // 声明子组件
    tab1
    // tab2,
    // tab3,
    // tab4,
    // tab5,
    // tab6,
    // tab7,
    // tab8,
    // tab9,
    // tab10,
    // tab11,
  },
  provide () {
    return {
      refreshTab2TreeData: this.refreshTab2TreeData,
      authenrequest: this.authenrequest,
      authenset: this.authenset
    }
  },
  data () {
    return {
      mqttdata: {},
      sensordata: [], // 当前选中的设备的传感器信息
      devicedata: {}, // 当前设备的信息
      exportfile: false, // 是否允许导出文件
      downurl: '',
      selectionsn: '', // 当前选中的节点sn
      selectempower: 0, // 当前选中节点授权状态
      treestyle: {
        height: ''
      },
      panestyle: {
        height: ''
      },
      table: {
        point: {
          loading: false
        },
        base: {
          loading: false
        }
      },
      freshloading: false,
      tab1data: {},
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
      heartbeatinterval: null
    }
  },
  methods: {
    clicktabs (e) {
      if (e == 2) { // 日志管理
      }
    },
    refreshTab2TreeData () { // 设备数据库
    },
    authenrequest () { // 授权管理查询
    },
    authenset () { // 授权管理在线设置
    },
    authensetkey (key) { // 授权管理在线设置
    },
    sendTabData (data) {
       console.log('父组件收到了'+data)
       client.publish("webgate/"+this.selectionsn, data)
    },
    exportNet () {
      console.log('父页面的关闭方法')
      let sn = this.selectionsn
      this.exportfile = true
    },
    closeSn () { // 关闭设备
      console.log('父页面的关闭方法')
      let sn = this.selectionsn
      console.log(sn)
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
    handleTreeClick (data) {
      // this.pointdata = JSON.parse(pointmsg);
      // 初始化基本信息列表
      console.log('选中事件')
      console.log(data)
      this.devicedata = data
      let self = this
      let param = new FormData() // 创建form对象
      param.append('pid', data.id)// ID
      self.$axios.post('/iotplant/sensor/getsensors', param, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
        console.log('-----')
        console.log(typeof (response.data.data))
        console.log(response.data.data)
        console.log(response.data.data[0])
        self.sensordata = response.data.data
        console.log(7777777777)
        console.log(self.sensordata)
        console.log(response)
      }).catch(function (response) {
        self.$Message.error('获取传感器数据失败')
        console.log(response)
      })
    },
    initcontent (message_obj) {
      // 页面刚进入时开启长连接
      let self = this
      self.table.loading = true
      console.log(this.$axios)
      this.$axios.get('/iotplant/device/pagedata?page=0&size=10000&sort=name,asc')
        .then(function (response) {
          self.table.loading = false// 取消loading效果
          console.log('初始化设备树')
          console.log(response)
          let contents = []
          for (let i = 0; i < response.data.content.length; i++) {
            let content = { expand: true }
            content.title = response.data.content[i].name + '-' + response.data.content[i].describes
            if (self.selectionsn == response.data.content[i].sn) {
              content.buttontype = 'primary'
            } else {
              content.buttontype = 'text'
            }
            if (i == 0) content.selected = true
            content.id = response.data.content[i].id
            content.name = response.data.content[i].name
            content.sn = response.data.content[i].sn
            content.describes = response.data.content[i].describes
            content.location = response.data.content[i].location
            content.treaty = response.data.content[i].treaty
            content.createtime = response.data.content[i].createtime
            content.userid = response.data.content[i].userid
            content.color = '#bbbec4'
            contents.push(content)
          }
          self.gatewaydata[0].children = contents
          if (self.selectionsn == '') {
            self.gatewaydata[0].children[0].buttontype = 'primary'
            // 初始化选中
            self.handleTreeClick(self.gatewaydata[0].children[0])
            self.selectionsn = self.gatewaydata[0].children[0].sn
          }
          //  for(let j=0;j<self.gatewaydata[0].children.length;j++){
          //          self.gatewaydata[0].children[j].color = '#19be6b';
          // }
          // console.log(contents)
          //     //有值代表需要更新在线状态  没有值代表第一次进来需要初始化WS连接
          //     if(message_obj) {
          //         for(let j=0;j<self.gatewaydata[0].children.length;j++){
          //             let isonline = false;
          //             for(let i=0;i<message_obj.length;i++){
          //                 if(self.gatewaydata[0].children[j].sn == message_obj[i].sn){
          //                     isonline = true;
          //                 }
          //             }
          //             if(isonline){
          //                 self.gatewaydata[0].children[j].color = '#19be6b';
          //             }else{
          //                 self.gatewaydata[0].children[j].color = '#bbbec4';
          //             }
          //         }
        }).catch((response) => {
          console.log(response)
        })

      // let self = this;
      // this.$axios.get("/iotplant/device/pagedata?page=0&size=10000&sort=name,asc&keywords="+'11', {}, {
      //     headers: {
      //         "Content-Type":"application/json;charset=utf-8"
      //     },
      // }).then(function(response) {
      //     self.table.loading = false;//取消loading效果
      //     console.log("开始初始化网关树结构")
      //     console.log(response.data)
      //     let contents = [];
      //     for(let i=0;i<response.data.content.length;i++){
      //         let content = {expand: true};
      //         content.title = response.data.content[i].name+'-'+response.data.content[i].description;
      //         content.color = '#bbbec4';
      //         // content.buttontype = 'text';
      //         if(self.selectionsn == response.data.content[i].sn){
      //              content.buttontype = 'primary';
      //         }else{
      //             content.buttontype = 'text'
      //         }

      //         if(i == 0) content.selected = true;
      //         content.id = response.data.content[i].id;
      //         content.name = response.data.content[i].name;
      //         content.eid = response.data.content[i].eid;
      //         content.sn = response.data.content[i].sn;
      //         content.bindcode = response.data.content[i].bindcode;
      //         content.online = response.data.content[i].online;
      //         content.description = response.data.content[i].description;
      //         content.basemsg = response.data.content[i].basemsg;
      //         // content.pointmsg = response.data.content[i].pointmsg;
      //         content.pushweb = response.data.content[i].pushweb;
      //         content.storagedb = response.data.content[i].storagedb;
      //         content.aipd = response.data.content[i].aipd;
      //         content.empower = response.data.content[i].empower;
      //         contents.push(content);
      //     }
      //     self.gatewaydata[0].children = contents;
      //     if(self.selectionsn == ''){
      //         self.gatewaydata[0].children[0].buttontype = 'primary';
      //         self.handleTreeClick(self.gatewaydata[0].children[0]);
      //         self.selectionsn = self.gatewaydata[0].children[0].sn;
      //     }
      //     console.log(contents)
      //     //有值代表需要更新在线状态  没有值代表第一次进来需要初始化WS连接
      //     if(message_obj) {
      //         for(let j=0;j<self.gatewaydata[0].children.length;j++){
      //             let isonline = false;
      //             for(let i=0;i<message_obj.length;i++){
      //                 if(self.gatewaydata[0].children[j].sn == message_obj[i].sn){
      //                     isonline = true;
      //                 }
      //             }
      //             if(isonline){
      //                 self.gatewaydata[0].children[j].color = '#19be6b';
      //             }else{
      //                 self.gatewaydata[0].children[j].color = '#bbbec4';
      //             }
      //         }
      //     }
      // }).catch( function(response) {
      //     self.$util.logout(self,response);
      // });
    },
    remove (root, node, data) {
      const parentKey = root.find(el => el === node).parent
      const parent = root.find(el => el.nodeKey === parentKey).node
      const index = parent.children.indexOf(data)
      parent.children.splice(index, 1)
      // 请求删除后台对应节点
      this.$Message.info('节点数据删除成功！')
    },
    initHight () {
      this.treestyle.height = window.innerHeight - 185 + 'px'
      this.panestyle.height = window.innerHeight - 172 + 'px'
    },
    initTreeClick () {
      if (this.selectionsn == '') {
        this.gatewaydata[0].children[0].buttontype = 'primary'
        this.handleTreeClick(this.gatewaydata[0].children[0])
      } else {

      }
    },
    // 从这里开始往下的所有方法都是 为了下载base64的字符串
    downhtml (base64Text) {
      var downLoad = document.querySelectorAll('#down a')[0]
      var blob = this.getBlob(base64Text)

      downLoad.setAttribute('href', URL.createObjectURL(blob))
      downLoad.click()
    },
    jsdownfile (base64Text) {
      const blob = this.b64toBlob(base64Text, 'application/octet-stream;charset=UTF-8')
      const fileName = 'db.db'
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    },
    b64toBlob (b64Data, contentType, sliceSize) {
      contentType = contentType || ''
      sliceSize = sliceSize || 512

      var byteCharacters = atob(b64Data)
      var byteArrays = []

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize)

        var byteNumbers = new Array(slice.length)
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        var byteArray = new Uint8Array(byteNumbers)

        byteArrays.push(byteArray)
      }

      var blob = new Blob(byteArrays, { type: contentType })
      return blob
    },
    mqttMSG () {
        // mqtt连接
        client.on('connect', (e) => {
            console.log('连接成功:')
            client.subscribe('iotpalnt/#', { qos: 1 }, (error) => {
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
  created () {
    this.initHight()
    this.initcontent()
  },
  destroyed: function () {
　　　　	 // 页面销毁时关闭长连接
    // client.end()
  }
}
</script>
