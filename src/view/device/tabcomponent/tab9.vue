<template>
     <Row :gutter="8">
        <div class="demo-tabs-style1" style="margin-bottom:0px;background-color:#fff;">
            <Row>
                <Table stripe border size="small" ref="selection" :columns="sbcscolumn" :data="sbcsdata" :loading="table.loading"></Table>
            </Row>
        </div>
    </Row>
</template>
<script>
    import Cookies from 'js-cookie';
    const uuidv1 = require('uuid/v1');
    export default {
        data () {
            return {
                table: {
                    loading:false,
                    selection:[],
                    keywords: ''
                },
                sbcsdata: [],
                sbcscolumn: [
                    {
                        key: 'name',
                        title: '接收时间',
                    }
                    ,
                    {
                        key: 'eid',
                        title: '类型',
                    }
                    ,
                    {
                        key: 'bindcode',
                        title: '信息',
                    }
                    ,
                    {
                        key: 'online',
                        title: '扩展参数',
                    }
                ],
            };
        },
        methods: {
        },
        mounted () {
            console.log("Math.random():"+Math.random());
        },
        created(){
        },
    }
</script>