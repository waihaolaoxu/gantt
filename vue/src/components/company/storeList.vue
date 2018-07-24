<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <span class="is-active el-tabs__item fl">门店列表</span>
                </div>
            </div>
        </div>
        <div class="list-box">
            <div class="list-body">
                <div class="list-header">
                    <el-button icon="el-icon-plus" title="新增" size="mini" style="margin:15px 0;" @click="$router.push({path:'add',query:{prevPath: $route.fullPath}})">新增门店
                    </el-button>
                </div>
                <el-table :data="data.list" style="width: 100%" size="mini" :default-sort="{prop: 'date', order: 'descending'}" v-if='data.list.length'>
                    <el-table-column prop="id" label="编号">
                    </el-table-column>
                    <el-table-column label="门店名称">
                        <template slot-scope="scope">
                            <router-link class="a-hover" :to="{path:'add',query:{id:scope.row.id,prevPath: $route.fullPath}}">{{scope.row.name}}</router-link>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="name" label="门店名称">
                    </el-table-column> -->
                    <el-table-column prop="address" label="门店地址">
                    </el-table-column>
                    <el-table-column label="门店状态">
                        <template slot-scope="scope">
                            <div v-if="scope.row.is_show == 1">
                                显示
                            </div>
                            <div v-else>
                                隐藏
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button @click="$router.push({path:'add',query:{id:scope.row.id,prevPath: $route.fullPath}})" title="编辑" size="mini">编辑</el-button>
                                <el-button @click="handleDelete(scope.row)" title="删除" size="mini">删除</el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
                <empty :empty='!loading&&!data.list.length' :loading='loading'></empty>
                <paging :query='query' :total='data.total'></paging>
            </div>
        </div>
    </div>
</template>

<script>
    import paging from '@/components/block/paging';
    var _self;
    export default {
        data() {
            return {
                data: {
                    list: []
                },
                loading: true,
                query: {
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                },
                total: 0,
                formInline: {
                    user: '',
                    region: ''
                }
            }
        },
        created() {
            _self = this;
            _self.getData();
        },
        methods: {
            getData() {
                this.$http.get('store/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        _self.loading = false;
                        if (res.codeFlag) {
                            _self.data = res.data.data;
                            _self.total = res.data.data.total;
                        }
                    })
            },
            // 删除
            handleDelete(row) {
                _self.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.$http.get('store/delete', {
                            params: {
                                id: row.id
                            }
                        })
                        .then(function (res) {
                            if (res.codeFlag) {
                                _self.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                _self.getData()
                            }
                        })
                });
            },
        },
        components: {
            paging
        }
    }

</script>
