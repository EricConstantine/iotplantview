<template>
    <Row>
    	<Col span="24">
	    	<Card>
	    		<p slot="title">
	                <Icon type=""></Icon> 用户信息编辑
	            </p>
			    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
					<FormItem label="EID分组" prop="eid">
						 <Select v-model="formValidate.eid" placeholder="请选择EID分组">
			               <Option v-for="item in eidlist" :value="item.id" :key="item.id">{{ item.name }}</Option>
			            </Select>
			        </FormItem>
					<FormItem label="用户名" prop="username">
						<Input v-model="formValidate.username" :disabled="formValidate.username=='Admin'" placeholder="请输入用户"></Input>
			        </FormItem>
					<FormItem label="输入密码" prop="password" v-show="userid==''">
						<Input v-model="formValidate.password" type="password"  placeholder="请输入密码"></Input>
			        </FormItem>
					<FormItem label="确认密码" prop="passwordck" v-show="userid==''">
						<Input v-model="formValidate.passwordck" type="password"  placeholder="请再次输入密码"></Input>
			        </FormItem>
					<FormItem label="绑定码" prop="bindcode">
						<Col span="20"><Input v-model="formValidate.bindcode" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请点击右侧按钮，在线获取绑定码" disabled></Input></Col>
						<Col span="4" style="text-align:center">
						<ButtonGroup size="large" shape="circle">
							<Button @click="getbindcode">获取</Button>
							<Button @click="cleanbindcode">清空</Button>
						</ButtonGroup>
						</Col>
			        </FormItem>
					<FormItem label="角色" prop="role">
						 <CheckboxGroup v-model="formValidate.role" @on-change="choserole">
							<Checkbox  v-for="item in roles" :label='item.id' :key="item.id">{{item.rolename}}</Checkbox>
			            </CheckboxGroup>
			        </FormItem>
					<FormItem label="状态" prop="status">
						 <i-switch size="large"  v-model="formValidate.status">
							<span slot="open">启用</span>
							<span slot="close">禁用</span>
						</i-switch>
			        </FormItem>
			        <FormItem>
			            <Button type="primary" @click="handleSubmit('formValidate')" :loading="save_loading">保存</Button>
			            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
			        </FormItem>
		        </Form>
	        </Card>
        </Col>
    </Row>
</template>
<script>
export default {
    	name: 'user-edit',
  data () {
    var validateInput = (rule, value, callback) => {
      console.log('校验了')
      if (!this.checkInput(value)) {
        callback(new Error('请不要输入特殊字符'))
      } else {
        callback()
      }
    }
    var validatePassword = (rule, value, callback) => {
      var reg = /^(\w){6,20}$/ // 密码数字或字母
      var regg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/// 密码必须包含数字或字母
      if (!regg.test(value)) {
        callback(new Error('密码必须包含数字和字母并且在6-20之间'))
      } else {
        callback()// 有数字有字母 ";
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.formValidate.passwordck !== '') {
          // 对第二个密码框单独验证
          this.$refs.formValidate.validateField('passwordck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      console.log(rule)
      console.log(value)
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formValidate.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      userid: '',
      eidlist: [],
      roles: [],
      powers: [],
            	save_loading: false,
      formValidate: {
        eid: '',
        username: '',
        password: '',
        passwordck: '',
        bindcode: '',
        role: [],
        status: true
      },
      ruleValidate: {

        eid: [
          { required: true, message: 'EID分组不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }, { validator: validateInput, trigger: 'blur' }, { min: 2, max: 20, message: '长度在 2 到20个字符', trigger: 'change' }
        ],
        password: [
          { validator: validatePass, required: true, trigger: 'blur' }, { validator: validatePassword, trigger: 'blur' }
        ],
        passwordck: [
          { validator: validatePassCheck, required: true, trigger: 'blur' }
        ]
        // ,
        // bindcode: [
        //     { required: true, message: '请输入绑定码,分割', trigger: 'blur' },
        //     { type: 'string', max: 20, message: '绑定码,分割不能超过20个字', trigger: 'blur' }
        // ]

        // power: [
        // 	 { required: true, type: 'array', min: 1, message: '至少选择一个权限id,分割', trigger: 'change' },
        // 	 { type: 'array', max: 3, message: '最多选择三个权限id,分割', trigger: 'change' }
        //  ]
        // ,

      }
    }
  },
  methods: {
    choserole (roles) {
      let role = this.formValidate.role[1]
      let rolearr = []
      rolearr.push(role)
      this.formValidate.role = rolearr
    },
        	handleInit () {
        		let self = this
        		self.$Message.info('正在努力加载数据...')
      let usersid = this.$route.query.id.toString()
	        	if (usersid && usersid != '') {
        console.log(222)
		        	this.$axios.get('/netgate-server/user/singledata?usersid=' + usersid, {}, {
				    	headers: {
				        	'Content-Type': 'application/json;charset=utf-8'
				       	}
				    }).then(function (response) {
          console.log(response.data)
				  		self.formValidate.eid = response.data.eid// EID分组
				  		self.formValidate.username = response.data.username// 用户
          self.formValidate.password = response.data.password// 密码
          self.formValidate.passwordck = response.data.passwordck// 密码确认
          if (response.data.bindcode != null && response.data.bindcode != undefined) {
            self.formValidate.bindcode = response.data.bindcode// 绑定码,分割
          }
          let rolearr = []
          if (response.data.roles != '') rolearr.push(response.data.role)
          self.formValidate.role = rolearr
          if (response.data.status == 0) self.formValidate.status = false
          else self.formValidate.status = true
				    	self.$Message.success('数据加载成功！')
				    }).catch(function (response) {
				    	self.$Message.error('数据加载失败，请与管理员联系！')
				       	console.log(response)
				    })
	        	} else {
        console.log('清空')
        self.formValidate.eid = ''// EID分组
        self.formValidate.username = ''// 用户
        self.formValidate.password = ''// 密码
        self.formValidate.passwordck = ''// 密码确认
        self.formValidate.bindcode = ''// 绑定码,分割
        self.formValidate.role = []// 权限id,分割
        self.formValidate.status = true
      }
    },
    getallroles () {
      let self = this
      this.$axios.get('/netgate-server/role/getallrole', {}, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
        self.roles = response.data
      }).catch(function (response) {
        self.$Message.error('角色数据加载失败，请与管理员联系！')
        console.log(response)
      })
    },
    getalleid () { // 获取用户的EID分组
      let self = this
      this.$axios.get('/netgate-server/eid/getalleid', {}, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
        console.log('获取所有eid分组')
        console.log(response)
        self.eidlist = response.data
      }).catch(function (response) {
        self.$Message.error('权限数据加载失败，请与管理员联系！')
        console.log(response)
      })
    },
    getbindcode () { // 在线获取绑定码
      let self = this
      this.$axios.get('/netgate-server/user/bindcode', {}, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
        let onlinecode = response.data
        let str = self.formValidate.bindcode
        if (self.formValidate.bindcode.length > 0) {
          str = str + ',' + onlinecode
        } else {
          str = onlinecode
        }
        self.formValidate.bindcode = str
      }).catch(function (response) {
        self.$Message.error('验证码获取失败，请与管理员联系！')
        console.log(response)
      })
    },
    cleanbindcode () {
      this.formValidate.bindcode = ''
    },
    handleSubmit (name) {
      if (this.formValidate.role.length < 1 || this.formValidate.role[0] == 'undefined') {
        this.$Message.warning('请选择用户角色!')
        return false
      }
      if (this.userid != '') {
        this.formValidate.password = 'a123456'
        this.formValidate.passwordck = 'a123456'
      }
      let self = this
      this.save_loading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log('提交了')
          let status = 1// 默认启用
          let param = new FormData() // 创建form对象
                		param.append('id', self.$route.query.id.toString())// ID
          param.append('eid', self.formValidate.eid)// EID分组
          param.append('username', self.formValidate.username)// 用户
          param.append('password', self.formValidate.password)// 密码
          param.append('bindcode', self.formValidate.bindcode)// 绑定码,分割
          param.append('role', self.formValidate.role[0])// 权限id,分割
          param.append('usertype', 3)// 用户类型普通用户
          if (!self.formValidate.status) status = 0
          param.append('status', status)// 状态，是否禁用
          self.$axios.post('/netgate-server/user/save?', param, {
					    	headers: {
					        	'Content-Type': 'multipart/form-data'
					       	}
					    }).then(function (response) {
            if (response.data.ok) {
              self.save_loading = false
              self.$router.push({
                name: 'user-manage',
                query: { refresh: true }
              })
            } else {
              self.$Message.error(response.data.msg)
              self.save_loading = false
            }
					    }).catch(function (response) {
					    	self.$Message.error('保存失败，请检查输入内容!')
					       	console.log(response)
					    })
        } else {
                    	self.save_loading = false
          self.$Message.error('内容验证不通过，请检查输入内容!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      this.formValidate.role = ['4']
    }
  },
	    mounted () {
    console.log(this.$route.query.id.toString())
    this.handleReset('formValidate')
    if (this.$route.query.id.toString() != '' && this.$route.query.id.toString() != null) {
      let lastuserid = this.$route.query.id.toString()
      this.userid = lastuserid
      this.handleInit()
    }

    this.getalleid()
    this.getallroles()
    // this.getallpower();
	    },
	    watch: {
	        '$route' (to) {
      // console.log(to)
	            if (to.name == 'user-edit' && to.query && to.query.refresh) {
        console.log('watch的方法aaaa')
        delete to.query.refresh
        this.handleReset('formValidate')
        this.userid = ''
        if (this.$route.query.id.toString() != '' && this.$route.query.id.toString() != null) {
          let lastuserid = this.$route.query.id.toString()
          this.userid = lastuserid
        }
	            	this.handleInit()
	            }
	        }
	    }
}
</script>
