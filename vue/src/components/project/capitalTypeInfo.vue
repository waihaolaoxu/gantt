<template>
    <div class="list-box">
        <el-tabs v-model="activeName" type="card">
            <div class="list-body">
                <el-tab-pane label="类型详情" name="first">
                    <div class="list-header">
                        <div class="tip text-sub f16">
                            {{$route.query.name}}：
                            <span class="text-success">{{$route.query.money}}</span> 元
                            <!-- ，  -->
                            <!-- 工地:<span class="text-success">41</span> -->
                        </div>
                    </div>
                    <el-table :data="data.list" style="width: 100%" v-if="data.list.length" size="mini">

                        <el-table-column prop="add_date" label="时间">
                        </el-table-column>
                        <el-table-column prop="money" label="金额">
                        </el-table-column>
                        <el-table-column prop="landlord_name" label="工地">
                            <template slot-scope="scope">
                                <p class="text-title f14">
                                    {{scope.row.title}}
                                </p>
                                <div  class="text-title f12 mt5">
                                    {{scope.row.sub_title}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="expend_user_name" label="收款方" v-if="type == 2">
                        </el-table-column>
                    </el-table>
                    <empty :empty='!loading&&!data.list.length' :loading='loading'></empty>
                    <paging :query='query' :total='total'></paging>
                </el-tab-pane>
            </div>
        </el-tabs>
    </div>
</template>

<script>
    import {
        created,
        methods
    } from '../../mixins/index'
    import paging from '@/components/block/paging';
    import {
        pagingEvent
    } from '@/mixins/index';
    export default {
        data() {
            return {
                data: {
                    list: []
                },
                loading: true,
                total: 0, // 当前列表的条数
                query: {
                    page: 1,
                    page_size: 20
                },
                type: this.$route.query.type, // 1 收入 2 支出
                activeName: 'first'
            }
        },
        mixins: [created, methods, pagingEvent],
        created() {

        },
        methods: {
            // 获取明细列表
            getData() {
                var _self = this;
                this.$http.get('engineer/capital/type/detail', {
                        params: _self.query
                    })
                    .then(function (res) {
                        _self.data = res.data.data;
                        _self.total = res.data.data.total
                        _self.loading = false;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
        components: {
            paging
        }
    }

</script>

