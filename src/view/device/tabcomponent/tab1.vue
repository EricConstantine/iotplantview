<style scoped>
    .tabpane {
        margin-top:-15px;
        border-left:solid #ddd 1px;
        border-right:solid #ddd 1px;
        border-bottom:solid #ddd 1px;
        border-top:none;
    }
    .page_div{
        margin-bottom:120px;
    }
</style>
<template>
    <div>
        <Row :gutter="8">
            <div class="demo-tabs-style1" style="margin-bottom:0px;background-color:#fff;">
                <Tabs type="card">
                    <TabPane label="基本信息" class="tabpane">
                        <Row style="margin:20px 40px 20px 20px;">
                            <Col span="24">
                               <Button type="primary" ghost icon="close" @click="closeSn()">关闭</Button>
                                <Button type="primary" ghost icon="hammer"  @click="openset">配置</Button>
                                <Button type="primary" ghost icon="gear-b" @click="openroot">Root指派</Button>
                                <Button type="primary" ghost icon="toggle-filled" @click="addblack">加入黑名单</Button>
                                <Button type="primary" ghost icon="ios-nutrition" @click="openwh">更新维护</Button>
                                <Button type="primary" ghost icon="ios-cloud-download" @click="upgrade">固件升级</Button>
                            </Col>
                        </Row>
                        <Row style="margin:5px 20px" v-show="tab1data.sn!=undefined&&tab1data.sn!=''">
                            名称：<Input readonly v-model="ipname" prefix="ios-contact" placeholder="" style="width: auto;margin-right:20px;" />
                            描述：<Input readonly v-model="ipdes" prefix="ios-contact" placeholder="" style="width: 240px;margin-right:20px;" />
                            AIPD：<Input readonly v-model="ipaipd" prefix="ios-contact" placeholder="" style="width: auto;margin-right:20px;" />
                        </Row>
                        <Row style="margin:20px 20px;width:94%">
                            <Table stripe border size="small" ref="selection" :columns="allcolumn" :data="basedata" :loading="table.loading"></Table>
                        </Row>
                    </TabPane>
                    <TabPane label="测点列表" class="tabpane" style="padding:15px;width:100%">
                                    <!-- 数据表格 -->
                        <Table stripe :loading="loading" border :columns="analogcolumn" :data="pagerData.data" style="overflow-y: hidden;"></Table>
                        
                        <!-- 分页栏 -->


                        <!-- <Table stripe border size="small" ref="selectionanalog" :columns="analogcolumn" :data="mypoin" :loading="table.loading"></Table> -->
                        <div class="page_div">
                            <Page :current.sync="currentpage"  :page-size-opts="pagerData.page.arrPageSize" :total="pagerData.page.totalCount" :page-size="pagerData.page.pagesize" style="padding-left: 20px;" size="small" @on-change="onChange" @on-page-size-change="pageSizeChange" show-total show-elevator show-sizer></Page>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </Row>
        <div>
            <Modal
                v-model="modelwh"
                title="更新维护"
                class-name="vertical-center-modal">
                <div>
                    <Card dis-hover>
                     <Row>
                        <Col span="4">
                            设备名称
                        </Col>
                        <Col span="8">
                            <Input size='small' readonly v-model="tab1data.name" placeholder="Enter something..." style="width: auto"/>
                        </Col>
                        <Col span="4">
                            设备描述
                        </Col>
                        <Col span="8">
                            <Input size='small' readonly v-model="tab1data.description" placeholder="Enter something..." style="width: auto"/>
                        </Col>
                    </Row>
                    <Row style=" margin-top:5px">
                        模拟开始 <input id="content" @change="handleChangeContent" name="content" type="file"/>
                        <Button  type="primary" ghost  @click="uploadServerMN">模拟网关上传至服务器</Button> 
                        模拟结束
                        <Button  type="primary" ghost  @click="uploadFile">在线工程导出</Button>
                        <!-- <Button  v-show="downurl!=''" type="primary" ghost  @click="downServer">在线工程导出</Button> -->
                        <!-- <Button  type="primary" ghost  @click="exportNet">在线工程导出</Button>    -->
                    </Row>
                     <Row style=" margin-top:5px">
                         <input id="content" @change="handleChangeContentOut" name="content" type="file"/>
                         <Button  type="primary" ghost  @click="uploadServer">本地工程导入</Button>
                         <!-- <Button  type="primary" ghost  @click="uploadServerNew">本地工程导入</Button> -->
                     </Row>
                    </Card>
                </div>
                 <div slot="footer">
                    <!-- <Button type="error" size="large" long :loading="modal_loading" @click="del">Delete</Button> -->
                </div>
            </Modal>    
            <Modal
                v-model="modelset"
                title="功能配置"
                class-name="vertical-center-modal"
                @on-ok="submitPushWeb()">
                <div>
                    <Row>
                        <Select @on-change="changestoragedb" v-model="isstorage" filterable>
                            <Option v-for="item in storagelist" :value="item.value" :key="item.value">{{ item.name}}</Option>
                        </Select>
                    </Row>
                    <Row style="margin-top:20px">
                        <Checkbox v-model="tabpushweb" v-bind:true-value="1" v-bind:false-value="0">配置推送到web服务</Checkbox>
                    </Row>
                </div>
            </Modal>    
            <Modal
                v-model="modelroot"
                title="ROOT指派"
                @on-ok="submitRootSet()"
                class-name="vertical-center-modal">
                <Row>
                    <Col span="24">
                        <Card dis-hover>
                            <Row>
                                <Col span="6">
                                    设备串号
                                </Col>
                                <Col span="18">
                                    <Input size='small' readonly v-model="tab1data.sn" placeholder="Enter something..." style="width: auto"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="6">
                                    设备名称
                                </Col>
                                <Col span="18">
                                    <Input size='small' readonly v-model="tab1data.name" placeholder="Enter something..." style="width: auto"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="6">
                                    设备描述
                                </Col>
                                <Col span="12">
                                    <Input size='small' readonly v-model="tab1data.description" placeholder="Enter something..." style="width: auto"/>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row style="margin-top:10px">
                    <Col span="8" style="font-size:14px">
                        指派目标EID分组
                    </Col>
                    <Col span="16">
                        <Select v-model="cureid" placeholder="请选择EID分组">
			               <Option v-for="item in eidlist" :value="item.id" :key="item.id">{{ item.name }}</Option>
			            </Select>
                    </Col>
                </Row>
            </Modal>
        </div>
    </div>
</template>
<script>

    // import {haspower} from '@/libs/btnpower';
    import Cookies from 'js-cookie';
    const uuidv1 = require('uuid/v1');
    const moment = require('moment')
    const download = require("downloadjs");
    export default {
        props: {
            pointdata: {
                type: Array,
                default () {
                    return [];
                }
            },
            pointdata0: {
                type: Array,
                default () {
                    return [];
                }
            },
            pointdata1: {
                type: Array,
                default () {
                    return [];
                }
            },
            pointdata2: {
                type: Array,
                default () {
                    return [];
                }
            },
            pointdata3: {
                type: Array,
                default () {
                    return [];
                }
            },
            pointdata4: {
                type: Array,
                default () {
                    return [];
                }
            },
            pointdata5: {
                type: Array,
                default () {
                    return [];
                }
            },
            pointdata6: {
                type: Array,
                default () {
                    return [];
                }
            },
            pointdata7: {
                type: Array,
                default () {
                    return [];
                }
            },
            pointdata8: {
                type: Array,
                default () {
                    return [];
                }
            },
             pointdata9: {
                type: Array,
                default () {
                    return [];
                }
            },
            tab1data:{
                type: Object
            }
        },
        data () {
            return {
                downurl:'',//下载的地址
                contentfile:null,//模拟网关发送文件
                userfile:null,//用户上传的本地文件
                ipname:'',//名称
                ipaipd:'',//aipd
                ipdes:'',//描述
                currentpage:1,
                loading:false,
                listdata:[],
                pagerData:{
                    data:[],
                    page:{
                    	//分页数
                        arrPageSize:[20,50,100],
                        //分页大小
                        pagesize:20,
                        //总分页数
                        pageCount:1,
                        //当前页面
                        pageCurrent:1,
                        //总数
                        totalCount:80
                    }
                },
                mypoin:[],
                basedata:[],
                arraydata:[],
                data:[],
                cureid:'',
                eidlist:[],
                tabpushweb: 0,//Vue报错  少了这个的定义  我加一下
                modelroot:false,//Root指派弹窗
                modelset:false,//配置
                modelwh:false,//更新维护
                isstorage:0,//是否存储到默认引擎 0否1是
                storagelist:[
                    {'name':'None','value':0},
                    {'name':'默认存储引擎','value':1}
                ],
                table: {
                    loading:false,
                    selection:[],
                    keywords: ''
                },
                allcolumn: [
                    {
                        key: 'name',
                        title: '名称',
                        ellipsis: true
                    }
                    ,
                    {
                        key: 'desc',
                        title: '描述',
                        ellipsis: true
                    }
                    ,
                    {
                        key: 'type',
                        title: '类型',
                        ellipsis: true
                    }
                    ,
                    {
                        key: 'realvalue',
                        title: '实时值',
                        ellipsis: true
                    }
                    ,
                    {
                        key: 'time',
                        title: '时间戳',
                        render: (h, params) => {
                            let time = params.row.time;
                            if(time<10000000000) time = time*1000;
                            return h('Font', moment(time).format('YYYY-MM-DD HH:mm:ss'));
                        },
                        ellipsis: true 
                    }
                ],
                analogcolumn: [
                    {
                        key: 'tnm',
                        title: '名称',
                        width: '10%',
                        ellipsis: true              
                    }
                    ,
                    {
                        key: 'tds',
                        title: '描述',
                        ellipsis: true
                    }
                    ,
                    {
                        key: 'uid',
                        title: 'UID',  
                        width: '7%',
                        ellipsis: true       
                    }
                    ,
                    {
                        key: 'vt',
                        title: '类型',  
                        width: '7%',
                        ellipsis: true
                    }
                    ,
                    {
                        key: 'code',
                        title: '类型子码',  
                        width: '7%',
                        ellipsis: true
                    }
                    ,
                    {
                        key: 'val',
                        title: '实时值',  
                        width: '10%',
                        ellipsis: true
                    }
                    ,
                    {
                        key: 'ts',
                        title: '时间戳',
                        width: '17%',
                        ellipsis: true                  
                    }
                    ,
                    {
                        key: 'vq',
                        title: '质量戳',  
                        width: '8%',
                        ellipsis: true
                    }
                ],
            };
        },
        methods: {
            handleChangeContentOut(e){//用户上传的我呢见
                let file=e.target.files.item(0);
                this.userfile = file;
            },
            handleChangeContent(e) {//模拟网关发送的文件
                let file=e.target.files.item(0);
                this.contentfile = file;
            },
            //给网关发送指令让其上传文件
            uploadFile(){
                let self = this;
                let param = new FormData(); //创建form对象
                param.append('sn',self.tab1data.sn);//sn
                console.log(self.tab1data.sn)
                self.$axios.post('/netgate-server/gateway/uploadFile',  param, {
                    headers: {
                        "Content-Type":"multipart/form-data"
                    }
                }).then(function(response) {
                    // console.log(response)
                    if(response.data.ok) self.$Message.success(response.data.msg);
                    else self.$Message.error(response.data.msg);
                }).catch( function(response) {
                    self.$Message.error('保存失败，请检查输入内容!');
                    console.log(response)
                });
            },
            downServer(){
                console.log(this.downurl)//下载文件到桌面
                download(this.downurl);
            },
            uploadServer(){//用户上传文件到服务器 废弃
                let self = this;
                let param = new FormData(); //创建form对象
                param.append('sn',self.tab1data.sn);//sn
                param.append('file',self.contentfile);//图片文件
                console.log(self.contentfile)
                console.log(self.tab1data.sn)
                self.$axios.post('/netgate-server/gateway/uploadServerWeb',  param, {
                    headers: {
                        "Content-Type":"multipart/form-data"
                    }
                }).then(function(response) {
                    console.log(response)
                    self.downurl = response.data.msg;
                    console.log(response)
                }).catch( function(response) {
                    self.$Message.error('保存失败，请检查输入内容!');
                    console.log(response)
                });
            },
            uploadServerNew(){//用户上传文件到服务器 
                let self = this;
                let param = new FormData(); //创建form对象
                param.append('sn',self.tab1data.sn);//sn
                param.append('file',self.userfile);//图片文件
                self.$axios.post('/netgate-server/gateway/uploadToNet',  param, {
                    headers: {
                        "Content-Type":"multipart/form-data"
                    }
                }).then(function(response) {
                    console.log(response)
                }).catch( function(response) {
                    self.$Message.error('上传失败，网络异常!');
                    console.log(response)
                });
            },
            uploadServerMN(){//模拟上传文件到服务器
                let self = this;
                let param = new FormData(); //创建form对象
                param.append('sn',self.tab1data.sn);//sn
                param.append('file',self.contentfile);//图片文件
                console.log(self.contentfile)
                console.log(self.tab1data.sn)
                self.$axios.post('/netgate-server/gateway/uploadServer',  param, {
                    headers: {
                        "Content-Type":"multipart/form-data"
                    }
                }).then(function(response) {
                    console.log(response)
                    self.downurl = response.data.msg;
                    console.log(response)
                }).catch( function(response) {
                    self.$Message.error('保存失败，请检查输入内容!');
                    console.log(response)
                });
            },
            test2(){
                // this.changeData1('adsfadsa');
                console.log( this.checkInput('圣诞节离开房间ADSL开发建设'))
                // // this.$alert('dsfads')
                //  this.$confirm('你是猴子请来的唐僧么', () => console.log('yes,哈哈哈哈哈'))
            },
             testdel(){
                let param = new FormData(); //创建form对象
                param.append('sn','sndasdas');//sn
                this.$axios.post('/netgate-server/pointmsg/delsn', param, {
                    headers: {
                        "Content-Type":"application/json;charset=utf-8"
                    }
                }).then(function(response) {
                    console.log(response)
                }).catch( function(response) {
                    self.$Message.error('操作失败，请与管理员联系！');
                    console.log(response)
                });
            },
            test1(){
                let param = new FormData(); //创建form对象
                param.append('sn','sndasdas');//sn
                this.$axios.post('/netgate-server/pointmsg/find', param, {
                    headers: {
                        "Content-Type":"application/json;charset=utf-8"
                    }
                }).then(function(response) {
                    console.log(response)
                }).catch( function(response) {
                    self.$Message.error('操作失败，请与管理员联系！');
                    console.log(response)
                });
            },
            test(){
                this.$axios.post('/netgate-server/pointmsg/save', '', {
                    headers: {
                        "Content-Type":"application/json;charset=utf-8"
                    }
                }).then(function(response) {
                    // console.log(response)
                }).catch( function(response) {
                    self.$Message.error('操作失败，请与管理员联系！');
                    console.log(response)
                });
            },
            changestoragedb(data){
                // console.log(data)
            },
            openwh(){
                if(this.tab1data.sn==''|| this.tab1data.sn==undefined){
                    this.$Message.error('您未选中网关节点');
                    return false;
                }
                this.modelwh = true;
            },
            upgrade(){//固件升级
                if(this.tab1data.sn==''|| this.tab1data.sn==undefined){
                    this.$Message.error('您未选中网关节点');
                    return false;
                }
                 this.$Modal.confirm({
                    title: '固件升级确认',
                    content: '<p>确定要将此设备升级吗为最新版本吗？</p>',
                    onOk: () => {
                        let self = this;
                        let param = new FormData(); //创建form对象
                        param.append('sn',this.tab1data.sn);//sn
                        param.append('eid',this.tab1data.eid);//推送消息
                        this.$axios.post('/netgate-server/version/upgradesn', param, {
                            headers: {
                              "Content-Type":"application/json;charset=utf-8"
                            }
                        }).then(function(response) {
                            console.log(response)
                            if(response.data.version!='') self.$Message.success('操作成功，升级版本为'+response.data.version);
                            else self.$Message.error('操作失败');
                        }).catch( function(response) {
                            self.$Message.error('操作失败，请与管理员联系！');
                            console.log(response)
                        });
                    },
                    onCancel: () => {
                        //this.$Message.info('Clicked cancel');
                    }
                });
            },
            onChange:function(curpage){
            	// alert("当前页面页码是：" + curpage);
            	this.pagerData.data.splice(0,this.pagerData.data.length);
                // alert("当前页面应该显示的数据index是：");  //  10(n-1) ~ 10n
                let curpagesize= this.pagerData.page.pagesize;
            	for(var i = curpagesize*(curpage - 1) + 1;
            		i<= ((this.pagerData.page.totalCount>curpagesize*curpage)?(curpagesize*curpage):(this.pagerData.page.totalCount));
            		i++){
            		// console.log(" i = " + i + "，item：" + JSON.stringify(this.listdata[i]));
            		this.pagerData.data.push(this.listdata[i-1]);
            	}
            },
            pageSizeChange(curpagesize){
                this.pagerData.page.pagesize = curpagesize;
                this.initpoindata(this.listdata)
            },
            validtab1(){//校验数据是否合法
                if(this.tab1data.sn==''|| this.tab1data.sn==undefined){
                    this.$Message.error('您未选中网关节点');
                    return false;
                }
            },
            addblack(){
                if(this.tab1data.sn==''|| this.tab1data.sn==undefined){
                    this.$Message.error('您未选中网关节点');
                    return false;
                }
                this.$Modal.confirm({
                    title: '加入黑名单确认',
                    content: '<p>确定要把此设备加入黑名单吗！</p>',
                    onOk: () => {
                        let self = this;
                        let param = new FormData(); //创建form对象
                        let id = Cookies.get('userid');
                        // console.log(id)
                        param.append('id','');//sn
                        param.append('sn',this.tab1data.sn);//sn
                        param.append('sname',this.tab1data.name);
                        param.append('describes',this.tab1data.description);
                        param.append('creator',id);
                        param.append('eid',this.tab1data.eid);//推送消息
                        this.$axios.post('/netgate-server/gatewayblack/save', param, {
                            headers: {
                               "Content-Type":"multipart/form-data"
                            }
                        }).then(function(response) {
                            if(response.data.ok) {
                                self.$Message.success(response.data.msg);
                                self.$emit('initcontent');
                            }
                            else self.$Message.error('操作失败');
                        }).catch( function(response) {
                            self.$Message.error('操作失败，请与管理员联系！');
                            // console.log(response)
                        });
                    },
                    onCancel: () => {
                        //this.$Message.info('Clicked cancel');
                    }
                });

            },
            submitRootSet(){
                let self = this;
                let param = new FormData(); //创建form对象
                param.append('eid',this.cureid);//推送消息
                param.append('sn',this.tab1data.sn);//sn
				this.$axios.post('/netgate-server/gateway/updateEid', param, {
					headers: {
						"Content-Type":"application/json;charset=utf-8"
					}
				}).then(function(response) {
					// console.log(response)
                    if(response.data.ok) self.$Message.success('更改成功');
                    else self.$Message.error(response.data.msg);
				}).catch( function(response) {
					self.$Message.error('权限数据加载失败，请与管理员联系！');
					// console.log(response)
				});

            },
            getalleid(){//获取用户的EID分组
				let self = this;
				this.$axios.get('/netgate-server/eid/getalleid', {}, {
					headers: {
						"Content-Type":"application/json;charset=utf-8"
					}
				}).then(function(response) {
					self.eidlist = response.data;
					// console.log(response.data)
				}).catch( function(response) {
					self.$Message.error('权限数据加载失败，请与管理员联系！');
					// console.log(response)
				});
			},
            submitPushWeb(){
                let pushweb = this.tabpushweb;
                let storagedb = this.isstorage;
                // this.$emit('submitPushWeb',pushweb);
                let self = this;
                let param = new FormData(); //创建form对象
                param.append('pushweb',pushweb);//推送消息
                param.append('storagedb',storagedb);//推送消息
                param.append('sn',this.tab1data.sn);//sn
                self.$axios.post('/netgate-server/gateway/updateSet?',  param, {
                    headers: {
                        "Content-Type":"application/json;charset=utf-8"
                    }
                }).then(function(response) {
                    // console.log(response)
                    if(response.data.ok) {
                        self.$Message.success('更改成功');
                        let data = "{'sn':'"+self.tab1data.sn+"','pushweb':'"+pushweb+"','storagedb':'"+storagedb+"'}"
                        self.$emit('sendTabData',data);
                    }
                    else self.$Message.error('更改失败');
                }).catch( function(response) {
                    self.$Message.error('更改失败');
                    // console.log(response)
                });
            },
            closeSn(){
                if(this.tab1data.sn==''|| this.tab1data.sn==undefined){
                    this.$Message.error('您未选中网关节点');
                    return false;
                }
                this.$Modal.confirm({
                    title: '关闭设备确认',
                    content: '<p>确定要关闭此设备吗！</p>',
                    onOk: () => {
                        this.$emit('closeSn')
                    },
                    onCancel: () => {
                        //this.$Message.info('Clicked cancel');
                    }
                });
            },
             exportNet(){
                if(this.tab1data.sn==''|| this.tab1data.sn==undefined){
                    this.$Message.error('您未选中网关节点');
                    return false;
                }
                this.$emit('exportNet')
            },
            openroot(){
                if(this.tab1data.sn==''|| this.tab1data.sn==undefined){
                    this.$Message.error('您未选中网关节点');
                    return false;
                }
                this.modelroot = true;
            },
            openset(){
                if(this.tab1data.sn==''|| this.tab1data.sn==undefined){
                    this.$Message.error('您未选中网关节点');
                    return false;
                }
                this.modelset = true;
            },

             initpoindata(data,type){//初始化表格
                console.log('进入初始化方法11111111')
                // console.log(this.pagerData.page.pagesize)
                console.log(data)
                let val = [];
                // for(let i=0;i<9;i++){
                //     val.push(data[i]);
                // }
                val = data;
                let totalNum = 0;
                this.listdata = [];
                this.pagerData.data=[];
                // console.log(val.length)
                for(let i= 0;i<val.length;i++){
                    let object = eval(val[i]);
                    object.index = i+1;
                    totalNum ++;
                    this.listdata.push(object);
                    if(i<=this.pagerData.page.pagesize){	//初始化获取数据的过程中，将前10个默认加入分页data
                        this.pagerData.data.push(object);
                    }
                }
                this.pagerData.page.totalCount = totalNum;
                // console.log(this.currentpage)
                // console.log(totalNum)
                if (this.currentpage>totalNum)this.currentpage = 1;//如果当前页码大于 新数据总页数则重新置为1
                this.onChange(this.currentpage);
                
            },
            initpoindata(){//初始化表格
                // console.log(this.pagerData.page.pagesize)
                // console.log(data)
                let val = [];
                let datas  = this.arraydata;
                for(let k=0;k<10;k++){
                    if( datas[k] !=null && datas[k] != undefined){
                        val = val.concat(datas[k])
                    }
                }
                let totalNum = 0;
                this.listdata = [];
                this.pagerData.data=[];
                // console.log(val.length)
                for(let i= 0;i<val.length;i++){
                    let object = eval(val[i]);
                    object.index = i+1;
                    totalNum ++;
                    this.listdata.push(object);
                    if(i<=this.pagerData.page.pagesize){	//初始化获取数据的过程中，将前10个默认加入分页data
                        this.pagerData.data.push(object);
                    }
                }
                this.pagerData.page.totalCount = totalNum;
                if (this.currentpage>totalNum)this.currentpage = 1;//如果当前页码大于 新数据总页数则重新置为1
                this.onChange(this.currentpage);
                
            }
        },
        mounted () {
            // this.getalleid();
            // console.log("Math.random():"+Math.random());
        },
        created(){
        },
        watch:{
          //监听双向绑定数据变化  调用handleOn方法  存入localStorage 做到双向绑定
          tab1data:{
             handler:function (val, oldVal) {
                //  console.log(val)
                if(val.basemsg) this.basedata = JSON.parse(val.basemsg);
                // if(val.pointmsg) this.pointdata = JSON.parse(val.pointmsg);
                this.tabpushweb = val.pushweb;
                this.isstorage = val.storagedb;
                this.cureid = val.eid;
                this.ipname = val.name;
                this.ipaipd = val.aipd;
                this.ipdes = val.description;
                // console.log(this.data)
            }, 
            deep:true
          },
        //   pointdata:{
        //       handler:function (val, oldVal) {
        //             this.mypoin=val;
        //             console.log('jiantingdaole o')
        //             console.log(val)
        //             this.initpoindata(val)
        //       },
        //       deep:true
              
        //   },
           pointdata0:{
              handler:function (val, oldVal) {
                    this.arraydata[0]=val;
                    console.log('jiantingdaole 0000000000')
                    console.log(val)
                     this.initpoindata()
                    // this.initpoindata(val,0)
              },
              deep:true
              
          },
           pointdata1:{
              handler:function (val, oldVal) {
                    this.arraydata[1]=val;
                    console.log('jiantingdaole o111111')
                    console.log(val)
                     this.initpoindata()
                    // this.initpoindata(val,1)
              },
              deep:true
              
          },
           pointdata2:{
              handler:function (val, oldVal) {
                    this.arraydata[2]=val;
                    console.log('jiantingdaole 22222')
                    console.log(val)
                    this.initpoindata()
                    // this.initpoindata(val,2)
              },
              deep:true
              
          },
            pointdata3:{
              handler:function (val, oldVal) {
                    this.arraydata[3]=val;
                    console.log('jiantingdaole 3333333')
                    console.log(val)
                    this.initpoindata()
                    // this.initpoindata(val,3)
              },
              deep:true
              
          },
            pointdata4:{
              handler:function (val, oldVal) {
                   this.arraydata[4]=val;
                    console.log('jiantingdaole 4444444')
                    console.log(val)
                    // this.initpoindata(val,4)
              },
              deep:true
              
          },
            pointdata5:{
              handler:function (val, oldVal) {
                   this.arraydata[5]=val;
                    console.log('jiantingdaole 4444444')
                    console.log(val)
                    // this.initpoindata(val,5)
              },
              deep:true
              
          },
             pointdata6:{
              handler:function (val, oldVal) {
                    this.arraydata[6]=val;
                    console.log('jiantingdaole 4444444')
                    console.log(val)
                    // this.initpoindata(val,6)
              },
              deep:true
              
          }, pointdata7:{
              handler:function (val, oldVal) {
                    this.arraydata[7]=val;
                    console.log('jiantingdaole 4444444')
                    console.log(val)
                    this.initpoindata()
                    // this.initpoindata(val,7)
              },
              deep:true
              
          },  pointdata8:{
              handler:function (val, oldVal) {
                   this.arraydata[8]=val;
                    console.log('jiantingdaole 4444444')
                    console.log(val)
                    // this.initpoindata(val,8)
              },
              deep:true
              
          },  pointdata9:{
              handler:function (val, oldVal) {
                    this.arraydata[9]=val;
                    console.log('jiantingdaole 4444444')
                    console.log(val)
                    // this.initpoindata(val,9)
              },
              deep:true
              
          },
          downurl:{
              handler:function (val, oldVal) {
                    this.downurl=val;
              }
              
          },
        },
    }
</script>