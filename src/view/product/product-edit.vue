<template>
    <Row>
    	<Col span="24">
	    	<Card>
	    		<p slot="title">
	                <Icon type=""></Icon> 产品管理信息编辑
	            </p>
			    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
					<FormItem label="产品名称" prop="name">
						<Input v-model="formValidate.name" placeholder="请输入设备名称"></Input>
			        </FormItem>
					<FormItem label="产品描述" prop="describes">
						<Input v-model="formValidate.describes" placeholder="请输入产品描述"></Input>
			        </FormItem>
					<FormItem label="传输协议" prop="treaty">
						<Select v-model="formValidate.treaty">
							<Option value="MQTT">MQTT</Option>
							<Option value="HTTP">HTTP</Option>
							<Option value="CoAP">CoAP</Option>
						</Select>
			        </FormItem>
					<FormItem label="数据节点" prop="nodes">
						<Button type="success" icon="plus-round" @click="handleAdd()">增加</Button>
						<Form ref="formDynamic" :model="formDynamic" >
							<FormItem
								v-for="(item, index) in formDynamic.items"
								:key="index"
								:label="'节点 ' + item.index"
								:prop="'items.' + index + '.name'"
								:rules="{required: true, message: '节点 ' + item.index +' 不能为空', trigger: 'blur'}">
								<Row style="margin-bottom:30px">
									<Col span="4">
										<Input v-model="item.name" placeholder="节点名称...">
											<span slot="append"><Icon type="md-close" @click="handleDelete(index)" /></span>
										</Input>
									</Col>
									<Col span="3">
										<Input v-model="item.skey" placeholder="节点标识..."></Input>
									</Col>
									<Col span="4">
										<Input v-model="item.describes" placeholder="节点描述..."></Input>
									</Col>
									<Col span="3">
										<Select v-model="item.rwtype" placeholder="读写类型...">
											<Option value="read">只读</Option>
											<Option value="write">可写</Option>
										</Select>
									</Col>
									<Col span="3">
										<Select v-model="item.datatype" placeholder="数据类型...">
											<Option value="bool">布尔</Option>
											<Option value="enum">枚举</Option>
											<Option value="num">数值</Option>
											<Option value="str">字符串</Option>
										</Select>
									</Col>
									<Col span="5">
										<div v-show="item.datatype=='enum'">
											<Input v-model="item.datadetail" placeholder="请以,分隔"></Input>
										</div>
										<Row v-show="item.datatype=='num'" style="margin-left:5px">
											<Col span="8">
												<Select v-model="item.datadetail" placeholder="位数">
													<Option v-for="num in numlist" :value="num" :key="num">{{ num }}</Option>
												</Select>
											</Col>
											<Col span="16">
												<Input v-model="item.sunit" placeholder="单位"></Input>
											</Col>
										</Row>
									</Col>
								</Row>
							</FormItem>
						</Form>
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
import {productadd} from '@/api/product'
    export default {
    	name: 'product-edit',
        data () {
            return {
				lastid:'',//上个页面的id
				numlist:['1','2','3','4','5'],
				index: 1,
				formDynamic: {
                    items: [
                        {
                            index: 1,
                        }
                    ]
                },
            	save_loading:false,
                formValidate: {
					name: ''
					,describes: ''
					,treaty: ''
					,nodes:[{
                            name: '',
                            index: 1,
                            status: 1
                        }]
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
			handleReset (name) {
                this.$refs[name].resetFields();
            },
            handleAdd () {
                this.index++;
                this.formDynamic.items.push({
                    index: this.index,
                });
            },
            handleDelete (index) {
                this.formDynamic.items.splice(index);
            },
        	handleInit (){
        		let self = this;
        		self.$Message.info('正在努力加载数据...');
	        	let productid = this.lastid;
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
						self.formValidate.nodes =  self.formDynamic.items;
						var datas = this.formValidate;
						console.log('传入的参数：')
						console.log(datas)
						productadd(datas).then(res=>{
							self.save_loading = false;
							console.log(res)
							if (res.data.ok) {
								self.save_loading = false;
								self.$router.push({
									name: "product_manage",
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

                    } else {
                    	self.save_loading = false;
                        self.$Message.error('内容验证不通过，请检查输入内容!');
                    }
                })
            },
           
        },
	    mounted () {
			this.handleInit();
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
	        '$route' (to) {
	            if(to.name=='product-edit' && to.query && to.query.refresh){
	            	delete to.query.refresh;
	            	this.handleInit();
	            }
	        }
	    }
    }
</script>