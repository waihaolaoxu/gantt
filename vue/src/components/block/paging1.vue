<template>
    <!-- 页面弹窗使用paging -->
    <div class="paging" v-if='total'>
        <el-pagination @size-change="sizeChange" @current-change="CurrentChange" :current-page="query.page" :page-sizes="[5,10, 20, 50, 100]"
            :page-size="query.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>
<script>
    export default {
        props: ['total', 'query'],
        methods: {
            sizeChange(v) {
                this.query.page_size = v;
                this.$emit('getData',this.query)
            },
            CurrentChange(v) {
                this.$set(this.query, 'page', v)
                this.$emit('getData',this.query)
            }
        },
    }

</script>

<style scoped>
    .paging {
        text-align: right;
        margin-top: -1px;
        position: relative;
        padding: 15px;
    }

</style>
