<template>
    <div style="background:#eee;padding: 20px;height:100%">
        <Card :bordered="false">
            <p slot="title">模拟设备</p>
            <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
        </Card>
        <Card :bordered="false" style="width:49%;float:left;margin-top:20px;margin-right:1%">
            <p slot="title">模拟发送数据</p>
            <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
        </Card>
        <Card :bordered="false" style="width:49%;float:left;margin-top:20px;margin-left:1%">
            <p slot="title">模拟接收数据</p>
            <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
        </Card>
    </div>
</template>
<script>
    export default {
        
    }
</script>