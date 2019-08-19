<template>
     <Row :gutter="8">
        <div class="demo-tabs-style1" style="margin-bottom:0px;background-color:#fff;">
            <Row>
                <Col span="5">
                    <Button type="primary"  icon="ios-search" @click="">在线查询</Button>
                </Col>
                <Col span="16">
                    <Select v-model="model11" filterable>
                        <Option placeholder='设备运行模式' v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
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
                model11:'设备运行模式',
                cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
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