<template>
    <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px'>
        <div class="el-tabs__header" style='border:none;'>
            <div role="tablist" class="el-tabs__nav">
                <router-link class="el-tabs__item fl" :to="{ path: 'save',query:{prevPath:$route.query.prevPath}}" active-class='is-active'
                    v-if='!$route.query.id'>添加套餐</router-link>

                <router-link class="el-tabs__item fl" :to="{ path: 'save',query:{id:$route.query.id,prevPath:$route.query.prevPath}}"
                    active-class='is-active' v-if='$route.query.id'>编辑套餐</router-link>

                <router-link class="el-tabs__item fl" v-if='$route.query.id' :to="{ path: 'photo', query:{id:$route.query.id,prevPath:$route.query.prevPath}}"
                    active-class='is-active'>编辑套餐图片</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {}

</script>

<style scoped>


</style>

