<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
         <Row v-for="(item,index) in sdata" :key = index>
            <Col span="6">
                <span class="expand-key">名称: </span>
                <span class="expand-value">【{{ item.name }}】</span>
            </Col>
            <Col span="6">
                <span class="expand-key">KEY: </span>
                <span class="expand-value">{{ item.skey }}</span>
            </Col>
            <Col span="6">
                <span class="expand-key">类型: </span>
                <span class="expand-value">{{ item.stype }}</span>
            </Col>
            <Col span="6">
                <span class="expand-key">单位: </span>
                <span class="expand-value">{{ item.sunit }}</span>
            </Col>
        </Row> 
    </div>
</template>
<script>
    export default {
        props: {
            row: String
        },
         data () {
            return {
                sdata:{}
            }
         },
         methods: {
             initEx(pid){
                let self = this;
                this.$axios.get('/iotplant/sensor/getsensors?pid='+pid, {}, {
                    headers: {
                        "Content-Type":"application/json;charset=utf-8"
                    },
                }).then(function(response) {
                    console.log(999)
                    console.log(response.data.data)
                    self.sdata = response.data.data;

                }).catch( function(response) {
                    console.log(response)
                });
             }
         },
         mounted () {
            
        },
        created(){
        },
        watch:{
          //监听双向绑定数据变化  调用handleOn方法  存入localStorage 做到双向绑定
          row: {
                immediate: true,    // 这句重要
                handler (val) {
                    this.initEx(val)
                    console.log('action Value:' + val);
                }
            }
        }
    };
</script>