<style>
.mapbox {
  width: 100%;
  height: 400px;
}
 .BMap_cpyCtrl {
    display: none;
}
.anchorBL {
    display: none;
}
</style>
<template>
  <Row>
    <Col span="24">
      <Card>
        <p slot="title">
          <Icon type></Icon>设备信息编辑
        </p>
        <baidu-map class="bm-view" ak="8ZtLu08Kg2HaujZZTsf7DpW4sg4ac6Bm">
        </baidu-map>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="设备名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入设备名称"></Input>
          </FormItem>
          <FormItem label="序列号" prop="sn">
            <Input v-model="formValidate.sn" placeholder="请输入序列号"></Input>
          </FormItem>
          <FormItem label="设备描述" prop="describes">
            <Input v-model="formValidate.describes" placeholder="请输入设备描述"></Input>
          </FormItem>
          <FormItem label="设备协议" prop="treaty">
            <Input v-model="formValidate.treaty" placeholder="请输入设备协议"></Input>
          </FormItem>
          <FormItem label="传感器" prop="sensors">
            <Button type="success" icon="plus-round" @click="handleAdd()">增加</Button>
            <Form ref="formsensor" style="margin-top:20px">
            <Row v-for="(item,index) in formValidate.sensordata" :key="index" style="margin-bottom:10px">
              <FormItem style="float:left"
                    :prop="'sensordata.' + index + '.name'">
                    <Input v-model="item.name" placeholder="传感器名称..." style="float:left;width:100%">
                        <span slot="append"><Icon type="md-close" @click="handleDelete(index)" /></span>
                    </Input>
              </FormItem>
              <Input v-model="item.skey" placeholder="传感器KEY..."  style="width: 20%;margin-left:2%" />
              <Select v-model="item.stype" style="width: 20%;margin-left:2%">
                  <Option v-for="sintype in sensortype" :value="sintype" :key="sintype">{{ sintype }}</Option>
              </Select>
              <Input v-model="item.sunit" placeholder="传感器单位..."  style="width: 20%;margin-left:2%" />
            </Row>
             </Form>
          </FormItem>
          <FormItem label="设备位置" prop="location">
            <div class="mapbox">  
                <baidu-map :center="center" :zoom="zoom" @ready="handler" style="height:400px" @click="getClickInfo">    
                      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation><br>
                      <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
                      <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
                      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
                      <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
                          <bm-label content="设备所在地" :labelStyle="{color: 'red', fontSize : '18px'}" :offset="{width: -35, height: 30}"/>
                      </bm-marker>
                </baidu-map>
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')" :loading="save_loading">保存</Button>
            <Button type="primary" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
          </FormItem>
        </Form>
      </Card>
    </Col>
  </Row>
</template>
<script>
// import {devicemanage ,devicedelete } from '@/api/device'
import {deviceshow,deviceadd} from '@/api/device'
// import { setFlagsFromString } from 'v8';
// Vue.use(VueBaiduMap.default, {
//   ak: '8ZtLu08Kg2HaujZZTsf7DpW4sg4ac6Bm'
// })
export default {
  name: "device-edit",
  data() {
    var validateInput = (rule, value, callback) => {
      console.log(rule)
      console.log("校验了");
      if (!this.checkInput(value)) {
        callback(new Error("请不要输入特殊字符"));
      } else {
        callback();
      }
    };
    var validataSensor = (rule, value, callback) => {
      console.log(rule)
      console.log("校验了");
      if (!this.checkInput(value)) {
        callback(new Error("请不要输入特殊字符"));
      } else {
        callback();
      }
    };
    return {
      lastid:'',
      sensortype:['温度','光照','数值','湿度'],
      center: {
        lng: 116.404,
        lat: 39.915
      },
      zoom: 15,
      userid: "",
      eidlist: [],
      roles: [],
      powers: [],
      save_loading: false,
      formValidate: {
        name: "",
        sn: "",
        describes: "",
        treaty: "",
        sensordata: [],
        location
      },
      sensorvalidate:{
        name: [
            { required: true, message: "传感器名称不能为空", trigger: "blur" },
            { validator: validateInput, trigger: "blur" },
            { min: 2, max: 20, message: "长度在 2 到20个字符", trigger: "change" }
          ],
      },
      ruleValidate: {
        sn: [{ required: true, message: "序列号不能为空", trigger: "blur" }],

        name: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
          { validator: validateInput, trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到20个字符", trigger: "change" }
        ],

        stype: [
            { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        // sensors: [
        //     { required: true, type: 'array', min: 1, message: '最少有一个传感器', trigger: 'change' },
        //     { type: 'array', max: 5, message: '最多有5个传感器', trigger: 'change' }
        // ],
      }
    };
  },
  methods: {
    handleDelete(index){
            // console.log(id)
        this.formValidate.sensordata.splice(index,1);
    },
    handleAdd(){
        this.formValidate.sensordata.push({name:'',skey:'',stype:'',sunit:''})
    },
    handler ({BMap, map}) {
        console.log(BMap, map)
        // this.center.lng =113.822348      
        // this.center.lat =22.635538      
        // this.zoom =this.zoom    
    },    
    getClickInfo (e) {
        console.log(e.point.lng)
        console.log(e.point.lat)
        this.center.lng = e.point.lng      
        this.center.lat = e.point.lat    
    },
    handleInit() {
      let self = this;
      self.$Message.info("正在努力加载数据...");
      let id = this.lastid;
      if (id && id != "") {
        console.log('--------------')
        // console.log(devicemanage)
        deviceshow(id).then(function(response) {
          console.log(response.data.data)
          let data = JSON.parse(response.data.data)
          console.log(data.device)
          self.formValidate = data.device;
          self.formValidate.sensordata = data.sensors;
          let locationarr = data.device.location.split(";");
          self.center.lng = locationarr[0];
          self.center.lat = locationarr[1];
          self.zoom =  new Number(locationarr[2]);
          self.$Message.success("数据加载成功！");
        })
        .catch(function(response) {
          self.$Message.error("数据加载失败，请与管理员联系！");
          console.log(response);
        });
        // this.$axios
        //   .get(
        //     "/iotplant/device/findById?id=" + id,
        //     {},
        //     {
        //       headers: {
        //         "Content-Type": "application/json;charset=utf-8"
        //       }
        //     }
        //   )
        //   .then(function(response) {
        //     console.log(response.data.data)
        //     let data = JSON.parse(response.data.data)
        //     console.log(data.device)
        //     self.formValidate = data.device;
        //     self.formValidate.sensordata = data.sensors;
        //     let locationarr = data.device.location.split(";");
        //     self.center.lng = locationarr[0];
        //     self.center.lat = locationarr[1];
        //     self.zoom =  new Number(locationarr[2]);
        //     self.$Message.success("数据加载成功！");
        //   })
        //   .catch(function(response) {
        //     self.$Message.error("数据加载失败，请与管理员联系！");
        //     console.log(response);
        //   });
      }
    },
    handleSubmit(name) {
      let self = this;
      this.save_loading = true;
      let sdata = this.formValidate.sensordata;
      for(let i=0;i<sdata.length;i++){
        if(sdata[i].name == ''){
          self.$Message.error("传感器名称不能为空!");
          return ;
        }
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          console.log("提交了");
          self.formValidate.locationstr =  self.center.lng+";"+self.center.lat+";"+self.zoom;
          var datas = this.formValidate;
          console.log('传入的参数：')
          console.log(datas)
          deviceadd(datas).then(res=>{
            self.save_loading = false;
              if (res.data.ok) {
                  self.save_loading = false;
                  self.$router.push({
                  name: "device_manage",
                  query: { refresh: true }
              });
              } else {
                self.$Message.error(res.data.msg);
                self.save_loading = false;
              }
          }).catch(function(response) {
              self.$Message.error("保存失败，请检查输入内容!");
              console.log(response);
          });

          // self.$axios({
          //     method:'post',
          //     url:'/iotplant/device/saveDevice',
          //     data: this.formValidate,
          //     headers:{'Content-Type': 'application/json;charset=utf-8'}
          // }).then(res=>{
          //     self.save_loading = false;
          //      if (res.data.ok) {
          //         self.save_loading = false;
          //         self.$router.push({
          //           name: "device_manage",
          //           query: { refresh: true }
          //       });
          //     } else {
          //       self.$Message.error(res.data.msg);
          //       self.save_loading = false;
          //     }
          // }).catch(function(response) {
          //     self.$Message.error("保存失败，请检查输入内容!");
          //     console.log(response);
          // });
        } else {
          self.save_loading = false;
          self.$Message.error("内容验证不通过，请检查输入内容!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  },
  mounted() {
    console.log('初始化')
    console.log(this.$route.query.id)
    console.log(deviceadd)
    if(this.$route.query.id==null ||this.$route.query.id == undefined || this.$route.query.id == ''){
      this.lastid = '';
    }else{
      console.log('进入编辑模式')
      this.lastid = this.$route.query.id.toString();
      console.log(this.lastid)
      this.handleInit();
    }
  },
  watch: {
    $route(to) {
      console.log('路由监听')
      console.log(to)
      //         if (to.name == 'device-edit' && to.query && to.query.refresh) {
      //   console.log('watch的方法aaaa')
      //   delete to.query.refresh
      //   this.handleReset('formValidate')
      //   this.userid = ''
      //   if (this.$route.query.id.toString() != '' && this.$route.query.id.toString() != null) {
      //     let lastuserid = this.$route.query.id.toString()
      //     this.userid = lastuserid
      //   }
      //         	this.handleInit()
      //         }
    }
  }
};
</script>
