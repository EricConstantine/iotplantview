<style>
.map {
  width: 100%;
  height: 300px;
}
 .BMap_cpyCtrl {
    display: none;
}
.anchorBL {
    display: none;
}
</style>
<template>
  <div>
   <div class="mapbox">  
       <baidu-map :center="center" :zoom="zoom" @ready="handler" style="height:800px" @click="getClickInfo">    
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation><br>
            <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
            <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
            <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
                <bm-label content="ddd" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>
            </bm-marker>
       </baidu-map>
   </div>

  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import {BmlMarkerClusterer} from 'vue-baidu-map'
export default {
    components: {
        BaiduMap,
        BmlMarkerClusterer,
       // BmCityList
    },
  data () {
    return {
      center: {
        lng: 116.404,
        lat: 39.915
      },
      zoom: 15
    }
  },
  methods: {
        handler ({BMap, map}) {
            console.log(BMap, map)
            // this.center.lng =113.822348      
            // this.center.lat =22.635538      
            // this.zoom =this.zoom    
        },    
        getClickInfo (e) {
            console.log(e.point.lng)
            console.log(e.point.lat)
            this.center.lng = e.point.lng      
            this.center.lat = e.point.lat    
        }

  }
}
</script>