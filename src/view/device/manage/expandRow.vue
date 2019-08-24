<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
       test{{pid}}
        <!-- <Row class="expand-row" v-for="(item ,i) in sdata" :key="i">
            <Col span="5">
                <span class="expand-key">名称: </span>
                <span class="expand-value">{{ item.name }}</span>
            </Col>
            <Col span="5">
                <span class="expand-key">KEY: </span>
                <span class="expand-value">{{ item.skey }}</span>
            </Col>
            <Col span="5">
                <span class="expand-key">类型: </span>
                <span class="expand-value">{{ item.stype }}</span>
            </Col>
            <Col span="5">
                <span class="expand-key">数值: </span>
                <span class="expand-value">{{ item.svalue }}</span>
            </Col>
             <Col span="4">
                <span class="expand-key">单位: </span>
                <span class="expand-value">{{ item.sunit }}</span>
            </Col>
        </Row> -->
        <!-- <Row>
            <Col span="8">
                <span class="expand-key">Favorite book: </span>
                <span class="expand-value">《{{ row.book }}》</span>
            </Col>
            <Col span="8">
                <span class="expand-key">Favorite movie: </span>
                <span class="expand-value">{{ row.movie }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">Favorite music: </span>
                <span class="expand-value">{{ row.music }}</span>
            </Col>
        </Row> -->
    </div>
</template>
<script>
export default {
  props: {
    pid: String
  },
  data () {
    sensordata:[]
  },
  mounted () {

  },
  created () {
  },
  watch: {
    // 监听双向绑定数据变化  调用handleOn方法  存入localStorage 做到双向绑定
    tab2treedata: {
      handler: function (val, oldVal) {
        console.log('监听到了')
        console.log(val)
        //   this.sensordata = val;
        //   this.refreshTreeData(val);
      }
    }
  }
}
</script>
