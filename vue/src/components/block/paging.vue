<template>
    <div class="paging" v-if='total'>
        <el-pagination @size-change="sizeChange" @current-change="CurrentChange" :current-page="query.page" :page-sizes="[10, 20, 50, 100]"
            :page-size="query.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>

<script>
    import {
        pagingEvent
    } from '@/mixins/index';

    export default {
        props: ['total', 'query'],
        mixins: [pagingEvent],
        methods: {
            sizeChange(v) {
                this.query.page_size = v;
                this.goRouter();
            },
            CurrentChange(v) {
                //                this.query.page = v;
                this.$set(this.query, 'page', v)
                this.goRouter();
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
