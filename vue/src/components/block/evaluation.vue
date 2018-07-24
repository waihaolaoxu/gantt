<template>
    <div>
        <i class="el-icon-star-on" v-for="i,index in 5" v-on:click="clickFn(index)" :key="index" :class="{'activeXin': index < activeIndex}"></i>
        <span>{{level}}</span>
    </div>
</template>
<style scoped>
.el-icon-star-on{
    color: #b5b5b5;
    font-size:22px;
}
</style>
<script>
// import cityOptions from '@/components/block/city';
export default {
    data(){
        return {
            level: "请为线索标记意向强弱！",
            activeIndex: 0
        }
    },
    props: ['prev', 'degree'],
    watch: {
        activeIndex(newVal,oldVal) {
            switch (newVal){
                case 0:
                this.level = "请为线索标记意向强弱！";
                break;
                case 1:
                this.level = "意向很低，基本没戏！";
                break;
                case 2:
                this.level = "有点意向！";
                break;
                case 3:
                this.level = "值得继续沟通！";
                break;
                case 4:
                this.level = "离成交就差一步！";
                break;
                case 5:
                this.level = "加油！马上就成交了！";
                break;
            }
                
        }
    },
    created(){
        this.activeIndex = this.degree;
        this.$emit('changeDegree', this.degree);
        console.log("星星的个数：",this.degree)
    },
    computed: {
        
    },
    methods:{
        clickFn(index){
            index = index+1;
            console.log("index",index)
            this.activeIndex = index
            this.$emit('changeDegree', index);
        }
    }
}

</script>

<style scoped lang="scss">

.activeXin{
    color: red;
}
</style>
