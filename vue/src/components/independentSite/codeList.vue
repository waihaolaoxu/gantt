<template>
    <el-form class="list-box">
        <el-tabs v-model="activeName2" type="card">
            <div class="list-body">
                <el-tab-pane label="第三方代码" name="first">
                    <div class="list-header">
                        <el-button icon="el-icon-plus" title="添加" size="mini" style="margin:0 0 15px 0;" @click="$router.push({path:'save',query:{prevPath: $route.fullPath}})">添加第三方代码
                        </el-button>
                    </div>
                    <el-table :data="data.list" style="width: 100%" v-if="data.list.length" size="mini">
                        <el-table-column prop="id" label="ID">
                        </el-table-column>

                        <el-table-column prop="name" label="名称">
                        </el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <span v-if='scope.row.is_show==1'>显示</span>
                                <span v-else>隐藏</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-button @click="$router.push({path:'save',query:{id:scope.row.id,prevPath: $route.fullPath}})" title="编辑" size="mini">编辑</el-button>
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                    <empty :empty='!loading&&!data.list.length' :loading='loading'></empty>
                    <paging :query='query' :total='data.total'></paging>
                </el-tab-pane>
            </div>
        </el-tabs>
    </el-form>
</template>

<script>
    import paging from '@/components/block/paging';
    import {
        pagingEvent
    } from '@/mixins/index';
    var _self
    export default {
        data() {
            return {
                activeName2: 'first',
                data: {
                    list: [],
                    total: 0
                },
                loading: true,
                query: {
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                }
            }
        },
        mixins: [pagingEvent],
        created() {
            _self = this;
            _self.getData()
        },
        methods: {
            getData() {
                var _self = this;
                this.$http.get('code/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.data = res.d;
                        }
                        _self.loading = false;
                    })
            }
        },
        components: {
            paging,
        }
    }

</script>
