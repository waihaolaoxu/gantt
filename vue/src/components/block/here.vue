<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
            <el-breadcrumb-item v-for="(x,i) in list" :key="x.title">
                <span @click='$router.push({path:x.path})' v-if='list.length-1>i'>{{x.meta.title}}</span>
                <span v-else>{{x.meta.title}}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        props: ['prev'],
        computed: {
            list() {
                var list = this.$route.matched.concat();
                var prev = this.$route.meta.prev;
                var param = this.$route.meta.param;
                // console.log(list)
                if (prev) {
                    var newList = {
                        path: prev.path,
                        meta: {
                            title: prev.title
                        }
                    }
                    if (param) {
                        newList.path = newList.path + '/' + this.$route.params[param];
                    }
                    var last = list.pop();
                    list.push(newList);
                    list.push(last);
                }
                list.splice(0, 1)
                return list;
            }
        },
    }

</script>

<style scoped>


</style>
