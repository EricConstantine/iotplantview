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
                    <Table border :columns="sensorcolumn" :data="sendata">
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
                    <Input v-model="dsdata.key">
                        <span slot="prepend">KEY</span>
                    </Input>
                </p>
                 <p>
                    <Input v-model="dsdata.value" type="textarea" :rows="4" placeholder="Enter something..." />
                </p>
                <p>
                    <Button type="success" long @click="sendData()">SUBMIT</Button>
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
    },
    mqttdata: {
      type: Object
    }
  },
  data () {
    return {
      sendata:[],
      openset: false,
      dsdata:{
        key: '',
        value: '',
      },
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
          title: '操作',
          slot: 'action',
          width: 250,
          align: 'center'
        }
      ],
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
    }
  },
  methods: {
    dataset (data) {
      this.openset = true
      this.dsdata.key = data.skey
      console.log(data)
    },
    sendData(){
      console.log(JSON.stringify(this.dsdata));
      this.$emit('sendTabData', JSON.stringify(this.dsdata));
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
        console.log('监听到了sen数据')
        console.log(val)
        this.sendata = val
      },
      deep: true
    },
    devicedata: {
      handler: function (val, oldVal) {
        console.log(val)
        this.devicedata = val
      },
      deep: true
    },
     mqttdata: {
      handler: function (val, oldVal) {
        console.log('子页面监听到了')
        console.log(val)
        console.log('---')
        let sen = this.sendata;
        console.log(sen)
        for(let i=0;i<sen.length;i++){
          if (sen[i].skey == val.key){
            console.log('zhaodaole')
            this.sendata[i].svalue=val.value;
          }
        }
      },
      deep: true
    }
  }
}
</script>
