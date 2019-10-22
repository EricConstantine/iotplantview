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
            <div class="demo-tabs-style1 " style="margin-bottom:0px;background-color:#fff;">
               <Card dis-hover :style="panestyle">
                <p slot="title">设备信息</p>
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
                        <!-- <template slot-scope="{ row }" slot="name">
                            <strong>传感器数据</strong>
                        </template> -->
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="primary" size="small" style="margin-right: 5px" @click="dataset(row)">数据下置</Button>
                            <Button type="primary" size="small" style="margin-right: 5px" @click="openset = true">实时曲线</Button>
                            <Button type="primary" size="small" style="margin-right: 5px" @click="openset = true">历史查询</Button>
                        </template>
                    </Table>
                </Row>
            </Card>
            </div>
        </Col>
    </Row>
</template>
<script>
    import {getProductTree,getnodes} from '@/api/product'
    import Cookies from 'js-cookie';
    const uuidv1 = require('uuid/v1');
    const moment = require('moment');
    export default {
        data () {
            return {
                selectionid:'',//默认选中的id
                treestyle: {
                    height: ''
                },
                panestyle: {
                    height: ''
                },
                curproduct:{},
                curnodedata:[],
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
                
               
            };
        },
        methods: {
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
                                    console.log('wwwwwwwwwwwwwwwwww')
                                    console.log(data) 
                                    this.handleTreeClick(data)
                                    //初始化树节点的选中效果
                                    this.selectionsn = data.id;//当前选中的sn
                                    for(let i=0;i<this.gatewaydata[0].children.length;i++){
                                        let thissn = this.gatewaydata[0].children[i].id;
                                        this.gatewaydata[0].children[i].buttontype = 'text';
                                        if(data.id == thissn) this.gatewaydata[0].children[i].buttontype = 'primary';
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
                // 初始化基本信息列表
                console.log('选中事件')
                console.log(data)
                this.curproduct = data
                let self = this
                getnodes(data.id).then(response => {
                    console.log("接口返回")
                    console.log(response)
                    self.curnodedata = response.data.data
                }).catch((response) => {
                    console.log(response)
                })
            },
            initcontent (message_obj) {
                // 页面刚进入时开启长连接
                let self = this
                console.log(this.$axios)
                getProductTree().then(response => {
                    console.log('初始化产品树')
                    console.log(response)
                    let contents = []
                    for (let i = 0; i < response.data.content.length; i++) {
                        let content = { expand: true }
                        content.title = response.data.content[i].name + '-' + response.data.content[i].describes
                        if (self.selectionid == response.data.content[i].id) {
                            content.buttontype = 'primary'
                        } else {
                            content.buttontype = 'text'
                        }
                        if (i == 0) content.selected = true
                        content.id = response.data.content[i].id
                        content.name = response.data.content[i].name
                        content.describes = response.data.content[i].describes
                        content.treaty = response.data.content[i].treaty
                        content.createtime = response.data.content[i].createtime
                        content.updatetime = response.data.content[i].updatetime
                        content.creator = response.data.content[i].creator
                        content.color = '#bbbec4'
                        contents.push(content)
                    }
                    self.gatewaydata[0].children = contents
                    if (self.selectionsn == '') {
                        self.gatewaydata[0].children[0].buttontype = 'primary'
                        // 初始化选中
                        self.handleTreeClick(self.gatewaydata[0].children[0])
                        self.selectionsn = self.gatewaydata[0].children[0].id
                    }
                    }).catch((response) => {
                    console.log(response)
                    })
            }
        },
        mounted () {
            //this.mqttMSG();
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