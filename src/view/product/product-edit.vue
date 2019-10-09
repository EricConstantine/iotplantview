<template>
    <Row>
    	<Col span="24">
	    	<Card>
	    		<p slot="title">
	                <Icon type=""></Icon> 产品管理信息编辑
	            </p>
			    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
					<FormItem label="产品名称" prop="name">
			        </FormItem>
					<FormItem label="产品描述" prop="describes">
			        </FormItem>
					<FormItem label="传输协议" prop="treaty">
			        </FormItem>
					<FormItem label="创建者" prop="creator">
			        </FormItem>
					<FormItem label="更新时间" prop="updatetime">
			        </FormItem>
					<FormItem label="创建时间" prop="createtime">
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
    	name: 'product-edit',
        data () {
            return {
            	save_loading:false,
                formValidate: {
					name: ''
					,describes: ''
					,treaty: ''
					,creator: ''
					,updatetime: ''
					,createtime: ''
                },
                ruleValidate: {
					
					name: [
						{ required: true, message: '产品名称不能为空', trigger: 'blur'  }
					]
					,
					describes: [
						{ required: true, message: '产品描述不能为空', trigger: 'blur'  }
					]
					,
					treaty: [
						{ required: true, message: '传输协议不能为空', trigger: 'blur'  }
					]
					,
					creator: [
						{ required: true, message: '创建者不能为空', trigger: 'blur'  }
					]
					,
					updatetime: [
						{ required: true, message: '更新时间不能为空', trigger: 'blur'  }
					]
					,
					createtime: [
						{ required: true, message: '创建时间不能为空', trigger: 'blur'  }
					]
                }
            }
        },
        methods: {
        	handleInit (){
        		let self = this;
        		self.$Message.info('正在努力加载数据...');
	        	let productid = this.$route.query.id.toString();
	        	if(productid && productid.length>0){
		        	this.$axios.get('/api/product/singledata?productid='+productid, {}, {
				    	headers: {
				        	"Content-Type":"application/json;charset=utf-8"
				       	}
				    }).then(function(response) {
				  		self.formValidate.name = response.data.name;//产品名称
				  		self.formValidate.describes = response.data.describes;//产品描述
				  		self.formValidate.treaty = response.data.treaty;//传输协议
				  		self.formValidate.creator = response.data.creator;//创建者
				  		self.formValidate.updatetime = response.data.updatetime;//更新时间
				  		self.formValidate.createtime = response.data.createtime;//创建时间
				    	self.$Message.success('数据加载成功！');
				    }).catch( function(response) {
				    	self.$Message.error('数据加载失败，情与管理员联系！');
				       	console.log(response)
				    });
	        	}
        	},
            handleSubmit (name) {
            	let self = this;
            	this.save_loading = true;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let param = new FormData(); //创建form对象
                		param.append('id',self.$route.query.id.toString());//ID

							
						param.append('name',self.formValidate.name);//产品名称
							
						param.append('describes',self.formValidate.describes);//产品描述
							
						param.append('treaty',self.formValidate.treaty);//传输协议
							
						param.append('creator',self.formValidate.creator);//创建者
							
						param.append('updatetime',self.formValidate.updatetime);//更新时间
							
						param.append('createtime',self.formValidate.createtime);//创建时间
                        self.$axios.post('/api/product/save?',  param, {
					    	headers: {
					        	"Content-Type":"multipart/form-data"
					       	}
					    }).then(function(response) {
					    	self.save_loading = false;
				        	self.$router.push({
				                name: 'product-manage',
				                query: {refresh:true}
				            });
					    }).catch( function(response) {
					    	self.$Message.error('保存失败，请检查输入内容!');
					       	console.log(response)
					    });
                    } else {
                    	self.save_loading = false;
                        self.$Message.error('内容验证不通过，请检查输入内容!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        },
	    mounted () {
	    	this.handleInit();
	    },
	    watch: {
	        '$route' (to) {
	            if(to.name=='product-edit' && to.query && to.query.refresh){
	            	delete to.query.refresh;
	            	this.handleInit();
	            }
	        }
	    }
    }
</script>