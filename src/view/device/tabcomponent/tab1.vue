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
    .title{
        font-weight:bold;
        width: 20%;
        display:block;
        float: left;
    }
    #setdiv p{
        margin-top:20px
    }
</style>
<template>
    <Row>
        <Col span="24">
            <Card dis-hover>
                <p slot="title">设备信息</p>
                <Row>
                    <Col span='12'>
                        <span class='title'>设备序列号:</span><span>{{devicedata.sn}}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <span class='title'>设备名称:</span><span>{{devicedata.name}}</span>
                    </Col>
                    <Col span='12'>
                        <span class='title'>设备描述:</span><span>{{devicedata.describes}}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <span class='title'>设备协议:</span><span>{{devicedata.treaty}}</span>
                    </Col>
                    <Col span='12'>
                        <span class='title'>设备位置:</span><span>{{devicedata.location}}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                        <span class='title'>创建时间:</span><span>{{devicedata.createtime}}</span>
                    </Col>
                    <Col span='12'>
                        <span class='title'>所属用户:</span><span>{{devicedata.userid}}</span>
                    </Col>
                </Row>
                <Row style="margin-top:20px">
                    <Table border :columns="sensorcolumn" :data="sensordata">
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
        </Col>
        <div>
            <Drawer title="数据下置" :closable="false" v-model="openset" id="setdiv">
                 <p style="margin-top:50%">
                    <Input v-model="dsttitle">
                        <span slot="prepend">KEY</span>
                    </Input>
                </p>
                 <p>
                    <Input v-model="dsvalue" type="textarea" :rows="4" placeholder="Enter something..." />
                </p>
                <p>
                    <Button type="success" long>SUBMIT</Button>
                </p>
            </Drawer>
        </div>
    </Row>
</template>
<script>

// import {haspower} from '@/libs/btnpower';
import Cookies from 'js-cookie'
const uuidv1 = require('uuid/v1')
const moment = require('moment')
const download = require('downloadjs')
export default {
  props: {
    devicedata: {
      type: Object
    },
    sensordata: {
      type: Array
    }
  },
  data () {
    return {
      openset: false,
      dsttitle: '',
      dsvalue: '',
      sensorcolumn: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: 'KEY',
          key: 'skey'
        },
        {
          title: '类型',
          key: 'stype'
        },
        {
          title: '数据',
          key: 'svalue'
        },
        {
          title: '单位',
          key: 'sunit'
        },
        {
          title: 'Action',
          slot: 'action',
          width: 250,
          align: 'center'
        }
      ],

      downurl: '', // 下载的地址
      contentfile: null, // 模拟网关发送文件
      userfile: null, // 用户上传的本地文件
      ipname: '', // 名称
      ipaipd: '', // aipd
      ipdes: '', // 描述
      currentpage: 1,
      loading: false,
      listdata: [],
      pagerData: {
        data: [],
        page: {
                    	// 分页数
          arrPageSize: [20, 50, 100],
          // 分页大小
          pagesize: 20,
          // 总分页数
          pageCount: 1,
          // 当前页面
          pageCurrent: 1,
          // 总数
          totalCount: 80
        }
      },
      mypoin: [],
      basedata: [],
      arraydata: [],
      data: [],
      cureid: '',
      eidlist: [],
      tabpushweb: 0, // Vue报错  少了这个的定义  我加一下
      modelroot: false, // Root指派弹窗
      modelset: false, // 配置
      modelwh: false, // 更新维护
      isstorage: 0, // 是否存储到默认引擎 0否1是
      storagelist: [
        { 'name': 'None', 'value': 0 },
        { 'name': '默认存储引擎', 'value': 1 }
      ],
      table: {
        loading: false,
        selection: [],
        keywords: ''
      },
      allcolumn: [
        {
          key: 'name',
          title: '名称',
          ellipsis: true
        },

        {
          key: 'desc',
          title: '描述',
          ellipsis: true
        },

        {
          key: 'type',
          title: '类型',
          ellipsis: true
        },

        {
          key: 'realvalue',
          title: '实时值',
          ellipsis: true
        },

        {
          key: 'time',
          title: '时间戳',
          render: (h, params) => {
            let time = params.row.time
            if (time < 10000000000) time = time * 1000
            return h('Font', moment(time).format('YYYY-MM-DD HH:mm:ss'))
          },
          ellipsis: true
        }
      ]

    }
  },
  methods: {
    dataset (data) {
      this.openset = true
      this.dsttitle = data.skey
      console.log(data)
    }
  },
  mounted () {

  },
  created () {
  },
  watch: {
    // 监听双向绑定数据变化  调用handleOn方法  存入localStorage 做到双向绑定
    sensordata: {
      handler: function (val, oldVal) {
        console.log('子页面监听到了')
        console.log(val)
        this.sensordata = val
      },
      deep: true
    },
    devicedata: {
      handler: function (val, oldVal) {
        console.log('子页面监听到了')
        console.log(val)
        this.devicedata = val
      },
      deep: true
    }
  }
}
</script>
