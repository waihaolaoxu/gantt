<template>
    <el-form class="list-box">
        <el-tabs v-model="activeName2" type="card">
            <div class="list-body">
                <el-tab-pane label="套餐列表" name="first">
                    <div class="list-header">
                        <el-button icon="el-icon-plus" title="添加" size="mini" style="margin:0 0 15px 0;" @click="$router.push({path:'save',query:{prevPath: $route.fullPath}})">添加套餐
                        </el-button>
                    </div>
                    <el-table :data="data.list" style="width: 100%" v-if="data.list.length" size="mini">
                        <el-table-column prop="id" label="ID" width='60px;'>
                        </el-table-column>
                        <el-table-column label="封面图" align="center">
                            <template slot-scope="scope">
                                <div class="contain-body" style='width:100px;height:60px;margin:0 auto;'>
                                    <img v-lazy="scope.row.cover?scope.row.cover+'!s':''" alt="" class="contain" v-if='scope.row.cover'>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="名称">
                        </el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <span v-if='scope.row.is_show==1'>显示</span>
                                <span v-else>隐藏</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-button @click="$router.push({path:'save',query:{id:scope.row.id,prevPath: $route.fullPath}})" title="编辑" size="mini">编辑</el-button>
                                    <el-button @click="handleDelete(scope.row)" title="删除" size="mini">删除</el-button>
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
                this.$http.get('package/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.data = res.d;
                        }
                        _self.loading = false;
                    })
            },
            // 删除
            handleDelete(d) {
                _self.$confirm('此操作将永久删除该套餐包, 是否继续?', '提示', _self.$.confirm).then(() => {
                    _self.$http.get('package/delete', {
                        params: {
                            id: d.id
                        },
                        rule: true
                    }).then(res => {
                        if (res.codeFlag) {
                            _self.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                        _self.getData();
                    })

                }).catch(() => {
                    // this.$message({
                    //   type: 'info',
                    //   message: '已取消删除'
                    // });
                });
            },
        },
        components: {
            paging,
        }
    }

</script>
