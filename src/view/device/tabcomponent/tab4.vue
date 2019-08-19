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
                        title: '时间',
                    }
                    ,
                    {
                        key: 'eid',
                        title: '项目',
                    }
                    ,
                    {
                        key: 'bindcode',
                        title: '类型',
                    }
                    ,
                    {
                        key: 'online',
                        title: '动作值',
                    }
                    ,
                    {
                        key: 'online',
                        title: '动作内容',
                    }
                    ,
                    {
                        key: 'online',
                        title: '附加数据1',
                    }
                    ,
                    {
                        key: 'online',
                        title: '附加数据2',
                    }
                    ,
                    {
                        key: 'online',
                        title: '动作原因',
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