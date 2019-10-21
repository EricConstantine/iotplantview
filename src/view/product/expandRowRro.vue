<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
          <Row v-for="(item,index) in sdata" :key = index>
            <Col span="5">
                <span class="expand-key">名称: </span>
                <span class="expand-value">【{{ item.name }}】</span>
            </Col>
            <Col span="5">
                <span class="expand-key">KEY: </span>
                <span class="expand-value">{{ item.skey }}</span>
            </Col>
            <Col span="5">
                <span class="expand-key">节点描述: </span>
                <span class="expand-value">{{ item.sunit }}</span>
            </Col>
            <Col span="4">
                <span class="expand-key">读写类型: </span>
                <span class="expand-value">{{ item.rwtype }}</span>
            </Col>
            <Col span="5">
                <span class="expand-key">数据类型: </span>
                <span class="expand-value">{{ item.datatype }}</span>
            </Col>
        </Row> 
    </div>
</template>
<script>
import {getnodes} from '@/api/product'
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
                getnodes(pid).then(response => {
                    self.sdata = response.data.data;
                }).catch((response) => {
                    console.log(response)
                })
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