<template>
    <div v-if="show">
        <div class="bigImg" @click="hideFn()">
            <template>
                <el-carousel arrow="always">
                    <el-carousel-item v-for="item,index in listData" :key="index">
                        <img :src="item.photo_url_l">
                    </el-carousel-item>
                </el-carousel>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['show',"listData"],
        data() {
            return {
                
            }
        },
        created(){
            
        },
        methods:{
            hideFn() {
                this.show = false
            }
        },
        computed: {}
    }

</script>
<style lang='scss'>
.bigImg{
    .el-carousel__indicators{
        display:none !important;
        img{
            width:300px;
        }
    }
}
</style>
<style scoped lang='scss'>
    .bigImg{
        width:100%;
        height:100%;
        background:rgba(0,0,0,1);
        position:absolute;
        top:0;
        left:0;
        z-index:1000;
        .el-carousel{
            width:400px;
            margin-top:50%;
            margin-left:50%;
        }
        
        .el-carousel__item h3 {
            color: #475669;
            font-size: 18px;
            opacity: 0.75;
            line-height: 300px;
            margin: 0;
        }
        
        .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
        }
        
        .el-carousel__item:nth-child(2n+1) {
            background-color: #d3dce6;
        }
    }

</style>
