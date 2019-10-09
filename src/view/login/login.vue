<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip" v-html="form.tip"></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
   data () {
      var validateInput = (rule, value, callback) => {
          if (!this.checkInput(value)) {
              callback(new Error("请不要输入特殊字符"));
          } else {
              callback();
          }
      };
      var validatePassword = (rule, value, callback) => {
          var reg = /^(\w){6,20}$/; //密码数字或字母
          var regg= /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;//密码必须包含数字或字母
          if(!regg.test(value)){
                callback(new Error("密码必须包含数字和字母并且在6-20之间"));
          }else{
              callback();//有数字有字母 ";
          }
      };
      return {
          form: {
              eid: 'Root',
              userName: 'Admin',
              password: '',
              tip: '请输入用户名和密码!'
          },
          rules: {
              eid: [
                  { required: true, message: 'EID不能为空', trigger: 'blur' },{ validator: validateInput, trigger: 'blur' }
              ],
              userName: [
                  { required: true, message: '账号不能为空', trigger: 'blur' },{ validator: validateInput, trigger: 'blur' }
              ],
              password: [
                  { required: true, message: '密码不能为空', trigger: 'blur' },{ validator: validatePassword, trigger: 'blur' }
              ]
          }
      };
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.$router.push({
                name: this.$config.homeName
              })
      //  this.handleLogin({ userName, password }).then(res => {
      //       this.getUserInfo().then(res => {
      //         this.$router.push({
      //           name: this.$config.homeName
      //         })
      //       })
      //     })
      // let self = this;
      // self.form.tip = '<font color="green">正在努力登陆中......</font>'; 
      //  if(password == 'admin612'){
      //   self.$store.commit('clearAllTags');//清空历史标签
      //   this.$router.push({
      //     name: this.$config.homeName
      //   })
      // }else{
      //   self.form.tip = '<font color="red">用户名或密码错误</font>';
      //   self.$router.push('/login');
      // }


      // this.handleLogin({ userName, password }).then(res => {
      //   this.getUserInfo().then(res => {
      //     if(password == 'admin612'){
      //       self.$store.commit('clearAllTags');//清空历史标签
      //       this.$router.push({
      //         name: this.$config.homeName
      //       })
      //     }else{
      //       self.form.tip = '<font color="red">用户名或密码错误</font>';
      //       self.$router.push('/login');
      //     }
      //   })
      // })
    }
  }
}
</script>

<style>

</style>
