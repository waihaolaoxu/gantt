<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">{{$route.query.name}}</div>
                </div>
            </div>
        </div>
        <div class="list-body">
            <div class="list-header">
                <el-button icon="el-icon-plus" title="新增" size="mini" style="margin:15px 0;" @click="addStoreFn">添加数据源
                </el-button>
            </div>
            <el-table :data="data.list" style="width: 100%" size="mini" v-if='data.list.length'>
                <el-table-column prop="id" label="ID">
                </el-table-column>
                <el-table-column prop="title" label="标题">
                </el-table-column>
                <el-table-column prop="sort" label="排序">
                </el-table-column>
                <el-table-column prop="des" label="描述">
                </el-table-column>
                <el-table-column prop="site_id" label="发布者">
                </el-table-column>
                <el-table-column prop="dt" label="添加时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button @click="handleEdit(scope.row)" title="编辑" size="mini">编辑</el-button>
                            <el-button @click="handleDelete(scope.row.id)" title="删除" size="mini">删除
                            </el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <empty :empty='!loading&&!data.list.length' :loading='loading'></empty>
            <paging :query='query' :total='total'></paging>
        </div>
    </div>
</template>

<script>
    import paging from '@/components/block/paging';
    import {
        pagingEvent
    } from '@/mixins/index';
    var _self;
    export default {
        data() {
            return {
                data: {
                    list: []
                },
                loading: true,
                total: 0, // 当前列表的条数
                query: {
                    id: Number(this.$route.query.id),
                    page_id: Number(this.$route.query.page_id),
                    page_name: this.$route.query.page_name,
                    name: this.$route.query.name,
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20
                },
                site_name: '',
                activeName: 'first',
                message: ''
            }
        },
        mixins: [pagingEvent],
        created() {
            _self = this;
            this.getData();
        },
        methods: {
            getData() {
                this.$http.get('modular/data/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        console.log(res);
                        _self.loading = false;
                        if (res.codeFlag) {
                            var d = res.data.data;
                            _self.message = d.prompt_message;
                            _self.data = d.modularDataList;
                            _self.site_name = d.site_name;
                            _self.total = d.modularDataList.total;
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            //新增按钮
            addStoreFn() {
                this.$router.push({
                    path: 'add_banner',
                    query: {
                        m_id: this.$route.query.id,
                        page_id: this.$route.query.page_id,
                        t_id: this.$route.query.t_id,
                        name: this.$route.query.name,
                        page_name: this.$route.query.page_name,
                        site_name: this.site_name,
                        message: this.message,
                        prevPath: this.$route.fullPath

                    }
                });
            },
            // 编辑
            handleEdit(row) {
                this.$router.push({
                    path: 'add_banner',
                    query: {
                        id: row.id,
                        m_id: this.$route.query.id,
                        page_id: this.$route.query.page_id,
                        name: this.$route.query.name,
                        page_name: this.$route.query.page_name,
                        site_name: this.site_name,
                        message: this.message
                    }
                });
            },
            // 删除
            handleDelete(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.get('modular/data/delete', {
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if (res.codeFlag) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            _self.getData();
                        }

                    })
                }).catch(() => {
                    // this.$message({
                    //   type: 'info',
                    //   message: '已取消删除'
                    // });
                });
            }
        },
        components: {
            paging
        }
    }

</script>
