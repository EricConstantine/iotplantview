<template>
     <Row :gutter="8">
        <Col span="6">
            <Card>
                <Tree :data="treedata" :render="renderContent"></Tree>
            </Card>
        </Col>
        <Col span="18">
            <div class="demo-tabs-style1" style="margin-bottom:0px;background-color:#fff;">
                <Tabs type="card" style="border-left:solid #ddd 1px;border-right:solid #ddd 1px;">
                    <TabPane label="全部">
                        <Row>
                            <Table stripe border size="small" ref="selection" :columns="allcolumn" :data="alldata" :loading="table.loading"></Table>
                        </Row>
                     </TabPane>
                    <TabPane label="模拟量"><!-- analogcolumn -->
                        <Table stripe border size="small" ref="selectionanalog" :columns="allcolumn" :data="analogdata" :loading="table.loading"></Table>
                    </TabPane>
                    <TabPane label="数字量"><!-- digitalcolumn -->
                        <Table stripe border size="small" ref="selectiondigital" :columns="allcolumn" :data="digitaldata" :loading="table.loading"></Table>
                    </TabPane>
                    <TabPane label="信号量"><!-- signalcolumn -->
                        <Table stripe border size="small" ref="selectionsignal" :columns="allcolumn" :data="signaldata" :loading="table.loading"></Table>
                    </TabPane>
                    <TabPane label="累积量"><!-- cumulantcolumn -->
                        <Table stripe border size="small" ref="selectioncumulant" :columns="allcolumn" :data="cumulantdata" :loading="table.loading"></Table>
                    </TabPane>
                    <TabPane label="字符量"><!-- charachtercolumn -->
                        <Table stripe border size="small" ref="selectioncharachte" :columns="allcolumn" :data="characterdata" :loading="table.loading"></Table>
                    </TabPane>
                    <TabPane label="控制量"><!-- controlcolumn -->
                        <Table stripe border size="small" ref="selectioncontrol" :columns="allcolumn" :data="controldata" :loading="table.loading"></Table>
                    </TabPane>
                    <TabPane label="数据块"><!-- informationcolumn -->
                        <Table stripe border size="small" ref="selectioninformation" :columns="allcolumn" :data="informationdata" :loading="table.loading"></Table>
                    </TabPane>
                    <TabPane label="事件点"><!-- eventcolumn -->
                        <Table stripe border size="small" ref="selectionevent" :columns="allcolumn" :data="eventdata" :loading="table.loading"></Table>
                    </TabPane>
                    <TabPane label="设备点"><!-- equipmentcolumn -->
                        <Table stripe border size="small" ref="selectionequipment" :columns="allcolumn" :data="equipmentdata" :loading="table.loading"></Table>
                    </TabPane>
                    <TabPane label="系统变量"><!-- systemcolumn -->
                        <Table stripe border size="small" ref="selectionsystem" :columns="allcolumn" :data="systemdata" :loading="table.loading"></Table>
                    </TabPane>
                    <TabPane label="设备属性"><!-- devicecolumn -->
                        <Table stripe border size="small" ref="selectiondevice" :columns="allcolumn" :data="devicedata" :loading="table.loading"></Table>
                    </TabPane>
                </Tabs>
            </div>
        </Col>
    </Row>
</template>
<script>
    import Cookies from 'js-cookie';
    const uuidv1 = require('uuid/v1');
    const moment = require('moment');
    export default {
        props: {
            tab2treedata:{
                type: Object
            },
            sn:{
                type: String
            }
        },
        data () {
            return {
                table: {
                    loading:false,
                    selection:[],
                    keywords: ''
                },
                alldata:[],
                analogdata:[],
                signaldata:[],
                digitaldata:[],
                cumulantdata:[],
                characterdata:[],
                controldata:[],
                informationdata:[],
                eventdata:[],
                equipmentdata:[],
                systemdata:[],
                devicedata:[],
                freshloading: false,
                treedata: [
                  {
                    desc: '设备数据库',
                    buttontype: 'text',
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
                                      type: 'cube',
                                      size: '12',
                                      color: '#19be6b'
                                  },
                                  style: {
                                      marginRight: '2px'
                                  }
                              }),
                              h('Button', {
                                  props: Object.assign({}, this.buttonProps, {
                                      type: data.buttontype,
                                      inner: data.desc
                                  }),
                                  style: {
                                      margin: '-4px 0px 0px 0px'
                                  },
                                  on: {
                                      click: () => {
                                          // 先把按钮全部置灰
                                          this.handleTreeButtonsGray();
                                          this.handleTreeClick(data.prop);
                                          data.buttontype = 'success';
                                      }
                                  }
                              }, data.desc)
                          ]),
                          h('span', {
                              style: {
                                  display: 'inline-block',
                                  float: 'right',
                                  marginRight: '20px'
                              }
                          }, [
                              h('Button', {
                                  props: Object.assign({}, this.buttonProps, {
                                      icon: 'refresh',
                                      type: 'success',
                                      loading: this.freshloading
                                  }),
                                  style: {
                                      width:'40px',
                                      height:'23px',
                                      margin: '-4px 0px 0px 0px'
                                  },
                                  on: {
                                      click: () => {
                                          this.freshloading = true;
                                          this.treedata[0].children = [];//刷新前清空数据
                                          this.refreshTab2TreeData();
                                      }
                                  }
                              })
                          ])
                      ]);
                    },
                    children: []
                  }
                ],
                buttonProps: {
                    type: 'default',
                    size: 'small',
                },
                allcolumn: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 70,
                        align: 'center'
                    },
                    {
                        key: 'name',
                        title: '名称',
                    }
                    ,
                    {
                        key: 'type',
                        title: '类型',
                    }
                    ,
                    {
                        key: 'desc',
                        title: '描述',
                    }
                    ,
                    {
                        key: 'curv',
                        title: '当前值',
                    }
                    ,
                    {
                        key: 'time',
                        title: '时间戳',
                        
                    }
                    ,
                    {
                        key: 'quality',
                        title: '质量戳',
                    }
                     ,
                    {
                        key: 'lv',
                        title: '上次值',
                    }
                    ,
                    {
                        key: 'num',
                        title: '更新次数',
                    }
                ],
                /*
                analogcolumn: [
                    {
                        key: 'name',
                        title: '名称',
                        
                    }
                    ,
                    {
                        key: 'value',
                        title: '值',
                        
                    }
                ],
                digitalcolumn: [
                    {
                        key: 'name',
                        title: '名称',
                        
                    }
                    ,
                    {
                        key: 'value',
                        title: '值',
                        
                    }
                ],
                signalcolumn: [
                    {
                        key: 'name',
                        title: '名称',
                        
                    }
                    ,
                    {
                        key: 'value',
                        title: '值',
                        
                    }
                ],
                cumulantcolumn: [
                    {
                        key: 'name',
                        title: '名称',
                        
                    }
                    ,
                    {
                        key: 'value',
                        title: '值',
                        
                    }
                ],
                charachtercolumn: [
                    {
                        key: 'name',
                        title: '名称',
                        
                    }
                    ,
                    {
                        key: 'value',
                        title: '值',
                        
                    }
                ],
                controlcolumn: [
                    {
                        key: 'name',
                        title: '名称',
                        
                    }
                    ,
                    {
                        key: 'value',
                        title: '值',
                        
                    }
                ],
                informationcolumn: [
                    {
                        key: 'name',
                        title: '名称',
                        
                    }
                    ,
                    {
                        key: 'value',
                        title: '值',
                        
                    }
                ],
                eventcolumn: [
                    {
                        key: 'name',
                        title: '名称',
                        
                    }
                    ,
                    {
                        key: 'value',
                        title: '值',
                        
                    }
                ],
                equipmentcolumn: [
                    {
                        key: 'name',
                        title: '名称',
                        
                    }
                    ,
                    {
                        key: 'value',
                        title: '值',
                        
                    }
                ],
                systemcolumn: [
                    {
                        key: 'name',
                        title: '名称',
                        
                    }
                    ,
                    {
                        key: 'value',
                        title: '值',
                        
                    }
                ],
                devicecolumn: [
                    {
                        key: 'name',
                        title: '名称',
                        
                    }
                    ,
                    {
                        key: 'value',
                        title: '值',
                        
                    }
                ],
                */
            };
        },
        inject: ['refreshTab2TreeData'],
        methods: {
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
                                type: 'cube',
                                size: '12',
                                color: '#19be6b'
                            },
                            style: {
                                marginRight: '2px'
                            }
                        }),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                type: data.buttontype,
                                inner: data.desc
                            }),
                            style: {
                                margin: '-4px 0px 0px 0px'
                            },
                            on: {
                                click: () => {
                                    // 先把按钮全部置灰
                                    this.handleTreeButtonsGray();
                                    this.handleTreeClick(data.prop);
                                    data.buttontype = 'success';
                                }
                            }
                        }, data.desc + ' [' + data.name + ']')
                    ])
                ]);
            },
            handleTreeClick(prop){
                if(prop && prop.length>0){
                    this.alldata = prop;
                    var analogdata = [],digitaldata=[];
                    var signaldata = [],cumulantdata=[];
                    var characterdata = [],controldata=[];
                    var informationdata = [],eventdata=[];
                    var equipmentdata = [],systemdata=[];
                    var devicedata = [];
                    var nowtime = moment().format('YYYY-MM-DD HH:mm:ss');
                    for(var i=0;i<prop.length;i++){
                        prop[i].time = nowtime;
                        if(prop[i].type == '模拟量') analogdata.push(prop[i]);
                        if(prop[i].type == '数字量') digitaldata.push(prop[i]);
                        if(prop[i].type == '信号量') signaldata.push(prop[i]);
                        if(prop[i].type == '累积量') cumulantdata.push(prop[i]);
                        if(prop[i].type == '字符量') characterdata.push(prop[i]);
                        if(prop[i].type == '控制量') controldata.push(prop[i]);
                        if(prop[i].type == '数据块') informationdata.push(prop[i]);
                        if(prop[i].type == '事件点') eventdata.push(prop[i]);
                        if(prop[i].type == '设备点') equipmentdata.push(prop[i]);
                        if(prop[i].type == '系统变量') systemdata.push(prop[i]);
                        if(prop[i].type == '对象属性') devicedata.push(prop[i]);
                    }
                    this.analogdata = analogdata;
                    this.digitaldata = digitaldata;
                    this.signaldata = signaldata;
                    this.cumulantdata = cumulantdata;
                    this.characterdata = characterdata;
                    this.controldata = controldata;
                    this.informationdata = informationdata;
                    this.eventdata = eventdata;
                    this.equipmentdata = equipmentdata;
                    this.systemdata = systemdata;
                    this.devicedata = devicedata;
                }else{
                    this.alldata = [];
                    this.analogdata = [];
                    this.digitaldata = [];
                    this.signaldata = [];
                    this.cumulantdata = [];
                    this.characterdata = [];
                    this.controldata = [];
                    this.informationdata = [];
                    this.eventdata = [];
                    this.equipmentdata = [];
                    this.systemdata = [];
                    this.devicedata = [];
                }
            },
            handleTreeButtonsGray(){
                var find = function(arr){
                    arr.forEach((item) => {
                        item.buttontype = 'text';
                        if(item.children && item.children.length > 0){
                            find(item.children);
                        }
                    })
                }
                find(this.treedata);
            },
            refreshTreeData(jsondata){// tab2页面中的数据刷新方法
                if(jsondata && jsondata.children && jsondata.children.length>0){
                    var thistreedata = jsondata;
                    var self = this;
                    var find = function(arr){
                        arr.forEach((item) => {
                            item.expand = true;
                            item.buttontype = 'text';
                            if(item.children && item.children.length > 0){
                                find(item.children);
                            }
                        })
                    }
                    find(thistreedata.children);
                    this.treedata[0].desc = thistreedata.desc;
                    this.treedata[0].prop = thistreedata.prop;
                    this.treedata[0].children = thistreedata.children;
                    this.freshloading = false;
                } else {
                    this.treedata[0].prop = [];
                    this.treedata[0].children = [];
                    this.freshloading = false;
                }
            },
            handleInitTreeData(sn){
                console.log('=========================='+sn)
                let self = this;
                self.$axios.get('/netgate-server/gateway/finddevicedatabysn?sn='+sn,  {}, {
                    headers: {
                        "Content-Type":"application/json;charset=utf-8"
                    }
                }).then(function(response) {
                    console.log(response.data);
                    self.refreshTreeData(response.data);
                }).catch( function(response) {
                    self.$Message.error('请求数据失败');
                    console.log(response)
                });
            }
        },
        mounted () {
            
        },
        created(){
        },
        watch:{
          //监听双向绑定数据变化  调用handleOn方法  存入localStorage 做到双向绑定
          tab2treedata:{
              handler:function (val, oldVal) {
                  this.refreshTreeData(val);
              }
          },
          sn:{
              handler:function (val, oldVal) {
                  this.handleInitTreeData(val);
              }
          }
        }
    }
</script>