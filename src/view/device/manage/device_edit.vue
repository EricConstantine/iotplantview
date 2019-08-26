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
          <Icon type></Icon>用户信息编辑
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
            <Form ref="formsensor" :rules="sensorvalidate" >
            <Row v-for="(item,index) in formValidate.sensordata" :key="index" style="margin-bottom:2px">
              <FormItem label="设备名称" prop="name">
                <Input v-model="item.name" placeholder="传感器名称..." style="width: 20%;float:left;margin-left:2%">
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
          <!-- <FormItem label="状态" prop="status">
            <i-switch size="large" v-model="formValidate.status">
              <span slot="open">启用</span>
              <span slot="close">禁用</span>
            </i-switch>
          </FormItem> -->
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
Vue.use(VueBaiduMap.default, {
  ak: '8ZtLu08Kg2HaujZZTsf7DpW4sg4ac6Bm'
})
</script>
<script>
export default {
  name: "device-edit",
  data() {
    var validateInput = (rule, value, callback) => {
      console.log("校验了");
      if (!this.checkInput(value)) {
        callback(new Error("请不要输入特殊字符"));
      } else {
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      var reg = /^(\w){6,20}$/; // 密码数字或字母
      var regg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/; // 密码必须包含数字或字母
      if (!regg.test(value)) {
        callback(new Error("密码必须包含数字和字母并且在6-20之间"));
      } else {
        callback(); // 有数字有字母 ";
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.formValidate.passwordck !== "") {
          // 对第二个密码框单独验证
          this.$refs.formValidate.validateField("passwordck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      console.log(rule);
      console.log(value);
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formValidate.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      sensortype:['温度','光照','数值','湿度'],
      sensordata:[],//传感器数组
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
        sensors: [
            { required: true, type: 'array', min: 1, message: '最少有一个传感器', trigger: 'change' },
            { type: 'array', max: 5, message: '最多有5个传感器', trigger: 'change' }
        ],
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
    choserole(roles) {
      let role = this.formValidate.role[1];
      let rolearr = [];
      rolearr.push(role);
      this.formValidate.role = rolearr;
    },
    handleInit() {
      let self = this;
      self.$Message.info("正在努力加载数据...");
      let usersid = this.$route.query.id.toString();
      if (usersid && usersid != "") {
        console.log(222);
        this.$axios
          .get(
            "/netgate-server/user/singledata?usersid=" + usersid,
            {},
            {
              headers: {
                "Content-Type": "application/json;charset=utf-8"
              }
            }
          )
          .then(function(response) {
            console.log(response.data);
            self.formValidate.eid = response.data.eid; // EID分组
            self.formValidate.username = response.data.username; // 用户
            self.formValidate.password = response.data.password; // 密码
            self.formValidate.passwordck = response.data.passwordck; // 密码确认
            if (
              response.data.bindcode != null &&
              response.data.bindcode != undefined
            ) {
              self.formValidate.bindcode = response.data.bindcode; // 绑定码,分割
            }
            let rolearr = [];
            if (response.data.roles != "") rolearr.push(response.data.role);
            self.formValidate.role = rolearr;
            if (response.data.status == 0) self.formValidate.status = false;
            else self.formValidate.status = true;
            self.$Message.success("数据加载成功！");
          })
          .catch(function(response) {
            self.$Message.error("数据加载失败，请与管理员联系！");
            console.log(response);
          });
      } else {
        console.log("清空");
        self.formValidate.eid = ""; // EID分组
        self.formValidate.username = ""; // 用户
        self.formValidate.password = ""; // 密码
        self.formValidate.passwordck = ""; // 密码确认
        self.formValidate.bindcode = ""; // 绑定码,分割
        self.formValidate.role = []; // 权限id,分割
        self.formValidate.status = true;
      }
    },
    getallroles() {
      let self = this;
      this.$axios
        .get(
          "/netgate-server/role/getallrole",
          {},
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8"
            }
          }
        )
        .then(function(response) {
          self.roles = response.data;
        })
        .catch(function(response) {
          self.$Message.error("角色数据加载失败，请与管理员联系！");
          console.log(response);
        });
    },
    handleSubmit(name) {
      if (
        this.formValidate.role.length < 1 ||
        this.formValidate.role[0] == "undefined"
      ) {
        this.$Message.warning("请选择用户角色!");
        return false;
      }
      if (this.userid != "") {
        this.formValidate.password = "a123456";
        this.formValidate.passwordck = "a123456";
      }
      let self = this;
      this.save_loading = true;
      this.$refs[name].validate(valid => {
        if (valid) {
          console.log("提交了");
          let status = 1; // 默认启用
          let param = new FormData(); // 创建form对象
          param.append("id", self.$route.query.id.toString()); // ID
          param.append("eid", self.formValidate.eid); // EID分组
          param.append("username", self.formValidate.username); // 用户
          param.append("password", self.formValidate.password); // 密码
          param.append("bindcode", self.formValidate.bindcode); // 绑定码,分割
          param.append("role", self.formValidate.role[0]); // 权限id,分割
          param.append("usertype", 3); // 用户类型普通用户
          if (!self.formValidate.status) status = 0;
          param.append("status", status); // 状态，是否禁用
          self.$axios
            .post("/netgate-server/user/save?", param, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            })
            .then(function(response) {
              if (response.data.ok) {
                self.save_loading = false;
                self.$router.push({
                  name: "user-manage",
                  query: { refresh: true }
                });
              } else {
                self.$Message.error(response.data.msg);
                self.save_loading = false;
              }
            })
            .catch(function(response) {
              self.$Message.error("保存失败，请检查输入内容!");
              console.log(response);
            });
        } else {
          self.save_loading = false;
          self.$Message.error("内容验证不通过，请检查输入内容!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.formValidate.role = ["4"];
    }
  },
  mounted() {
    console.log(this.$route.query.id.toString());
    // this.handleReset("formValidate");
    // if (
    //   this.$route.query.id.toString() != "" &&
    //   this.$route.query.id.toString() != null
    // ) {
    //   let lastuserid = this.$route.query.id.toString();
    //   this.userid = lastuserid;
    //   this.handleInit();
    // }

    // this.getalleid();
    // this.getallroles();
    // this.getallpower();
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
