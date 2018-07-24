<template>
    <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px'>
        <div class="el-tabs__header" style='border:none;'>
            <div role="tablist" class="el-tabs__nav">
                <router-link class="el-tabs__item fl" :to="{ path: '/case/add',query:{prevPath:$route.query.prevPath}}" active-class='is-active'
                    v-if='!$route.query.id'>创建案例</router-link>

                <router-link class="el-tabs__item fl" :to="{ path: '/case/add',query:{id:$route.query.id,prevPath:$route.query.prevPath}}"
                    active-class='is-active' v-if='$route.query.id'>修改案例</router-link>

                <router-link class="el-tabs__item fl" v-if='$route.query.id' :to="{ path: '/case/add_house', query:{id:$route.query.id,prevPath:$route.query.prevPath}}"
                    active-class='is-active'>编辑户型图片</router-link>

                <router-link class="el-tabs__item fl" v-if='$route.query.id' :to="{ path: '/case/add_pic',query:{id:$route.query.id,prevPath:$route.query.prevPath}}" active-class='is-active'>编辑案例图片</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {}

</script>

<style scoped>


</style>
