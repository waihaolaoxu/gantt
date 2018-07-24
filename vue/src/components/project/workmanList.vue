<template>
    <div class="list-box">
        <el-tabs v-model="activeName" type="card">
            <div class="list-body">
                <el-tab-pane label="工长列表" name="first">
                    <div class="list-header">
                        <el-form :inline="true" :model="query" size="small">
                            <el-form-item label="搜索条件:">
                                <el-input v-model="query.name" placeholder="请输入工长名称" @keyup.enter.native="goRouter"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="query.id" placeholder="请输入工长ID" @keyup.enter.native="goRouter"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-select v-model="query.is_show" placeholder="请选择展示状态">
                                    <el-option v-for="item in statusData" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-select v-model="query.recommend" placeholder="请选择推荐状态">
                                    <el-option v-for="item in recommendData" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="goRouter" icon="el-icon-search" :loading="loading">
                                    查询
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <el-button icon="el-icon-plus" title="添加" size="mini" style="margin:0 0 15px 0;" @click="addWorkman">添加工长
                        </el-button>
                    </div>
                    <el-table :data="data.list" style="width: 100%" v-if="data.list.length" size="mini">
                        <el-table-column prop="name" label="工长名称">
                        </el-table-column>
                        <el-table-column prop="tel" label="联系电话">
                        </el-table-column>
                        <el-table-column label="用户信息" width='200'>
                            <template slot-scope="scope">
                                <div v-if='scope.row.user_base_info.user_base_id'>
                                    <div>UID：{{scope.row.user_base_info.user_base_id}}</div>
                                    <div>昵称：{{scope.row.user_base_info.nickname}}</div>
                                    <div>绑定手机：{{scope.row.user_base_info.mobile}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="add_date" label="创建时间">
                        </el-table-column>
                        <el-table-column prop="order_id" label="排序">
                        </el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <span v-if='scope.row.is_show=="yes"'>显示</span>
                                <span v-if='scope.row.is_show=="no"'>隐藏</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="推荐">
                            <template slot-scope="scope">
                                <span v-if='scope.row.recommend=="yes"'>推荐</span>
                                <span v-if='scope.row.recommend=="no"'>不推荐</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-button @click="handleEdit(scope.row)" title="编辑" size="mini">编辑</el-button>
                                    <el-button @click="handleHide(scope.row)" title="隐藏" size="mini">删除</el-button>
                                </el-button-group>
                            </template>
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
                    name: '',
                    id: '',
                    is_show: '',
                    recommend: '',
                    page: 1,
                    page_size: 20
                },
                activeName: 'first',
                id: '',
                statusData: [{
                    value: 'yes',
                    label: '显示'
                }, {
                    value: 'no',
                    label: '隐藏'
                }],
                recommendData: [{
                    value: 'yes',
                    label: '推荐'
                }, {
                    value: 'no',
                    label: '不推荐'
                }],
            }
        },
        mixins: [created, methods, pagingEvent],
        created() {

        },
        methods: {
            // 获取工长列表
            getData() {
                var _self = this;
                this.$http.get('workman/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        console.log(res);
                        _self.data = res.data.data;
                        _self.total = res.data.data.total
                        _self.loading = false;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            //新增按钮
            addWorkman() {
                this.$router.push({
                    path: '/construction/add_workman'
                });
            },
            // 编辑
            handleEdit(row) {
                this.$router.push({
                    path: '/construction/add_workman',
                    query: {
                        id: row.id
                    }
                });
            },
            // 删除
            handleHide(row) {
                var that = this;
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.get('workman/delete', {
                            params: {
                                id: row.id
                            }
                        })
                        .then(function (res) {
                            if (res.data.code == '1000') {
                                that.$http.get('workman/list', {
                                        params: that.query
                                    })
                                    .then(function (data) {
                                        console.log(data);
                                        that.data = data.data.data;
                                        that.total = data.data.data.total
                                        that.loading = false;
                                        that.$message({
                                            type: 'success',
                                            message: '删除成功!'
                                        });
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }).catch(() => {
                    // this.$message({
                    //   type: 'info',
                    //   message: '已取消删除'
                    // });
                });
            },
            formatter(row, column) {
                return row.address;
            }
        },
        components: {
            paging
        }
    }

</script>
