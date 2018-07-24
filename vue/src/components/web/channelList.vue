<template>
    <div>
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">频道列表</div>
                </div>
            </div>
        </div>
        <div class="list-box">
            <div class="list-body">
                <div class="list-header">
                    <el-button icon="el-icon-plus" title="添加" size="mini" style="margin:15px 0;" @click="addChannelFn" v-if="data.total<2">添加频道
                    </el-button>
                    <a class="el-button el-button--mini" :href="'https://www.jiajuol.com/company/'+userinfo.info.company_id+'#tab0'" style="margin:15px 0;" target="_blank">预览</a>
                </div>
                <el-table :data="data.list" style="width: 100%" size="mini" v-if='data.list.length'>
                    <el-table-column prop="id" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="频道名称">
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button @click="handleEdit(scope.row)" title="编辑" size="mini">编辑</el-button>
                                <el-button @click="handleDelete(scope.row)" title="删除" size="mini">删除</el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
                <empty :empty='!loading&&!data.list.length' :loading='loading'></empty>
                <paging :query='query' :total='total'></paging>
            </div>
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
                total: '',
                query: {
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                },
                userinfo:{}
            }
        },
        mixins: [pagingEvent],
        created() {
            _self = this;
            this.getData()
            _self.userinfo = JSON.parse(this.$localStorage.get('userInfoM'));
        },
        methods: {
            getData() {
                var _self = this;
                this.$http.get('channel/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.loading = false;
                            _self.data = res.data.data
                            _self.total = res.data.data.total
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            //新增按钮
            addChannelFn() {
                this.$router.push({
                    path: 'add_channel',
                    query:{
                        prevPath: this.$route.fullPath
                    }
                });
            },
            // 编辑
            handleEdit(row) {
                this.$router.push({
                    path: 'add_channel',
                    query: {
                        id: row.id,
                        prevPath: this.$route.fullPath
                    }
                });
            },
            // 删除
            handleDelete(row) {
                var that = this;
                this.$confirm('此操作将永久删除该频道, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.get('channel/delete', {
                        params: {
                            id: row.id
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
            },
        },
        components: {
            paging
        }
    }

</script>
