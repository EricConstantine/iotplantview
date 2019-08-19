<template>
     <Row :gutter="8">
        <div class="demo-tabs-style1" style="margin-bottom:0px;background-color:#fff;">
            <Row style="margin-top:10px">
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
                        title: 'UID',
                    }
                    ,
                    {
                        key: 'bindcode',
                        title: '分类',
                    }
                    ,
                    {
                        key: 'online',
                        title: '源',
                    }
                    ,
                    {
                        key: 'online',
                        title: '原因',
                    }
                    ,
                    {
                        key: 'online',
                        title: '标签',
                    }
                    ,
                    {
                        key: 'online',
                        title: '级别',
                    }
                    ,
                    {
                        key: 'online',
                        title: '状态',
                    }
                    ,
                    {
                        key: 'online',
                        title: '内容',
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