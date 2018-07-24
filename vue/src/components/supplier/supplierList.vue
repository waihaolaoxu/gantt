<template>
    <el-form class="list-box">
        <el-tabs v-model="activeName2" type="card">
            <div class="list-body">
                <el-tab-pane label="供应商列表" name="first">
                    <div class="list-header">
                        <el-form :inline="true" :model="query" size="small">
                            <el-form-item>
                                <el-input v-model="query.name" placeholder="请输入供应商名称" @keyup.enter.native="goRouter"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input  v-model="query.mobile" placeholder="请输入供应商手机号" @keyup.enter.native="goRouter"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="goRouter" icon="el-icon-search" :loading="loading">
                                    搜索
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <el-button icon="el-icon-plus" title="添加" size="mini" style="margin:0 0 15px 0;" @click="addSupperFn">添加供应商
                        </el-button>
                    </div>
                    <el-table :data="data" style="width: 100%" v-if="data.length" size="mini">
                        <el-table-column prop="id" label="ID">
                        </el-table-column>
                        <el-table-column prop="name" label="供应商名">
                        </el-table-column>
                        <el-table-column prop="link_name" label="联系人">
                        </el-table-column>
                        <el-table-column prop="mobile" label="联系电话">
                        </el-table-column>
                        <!--<el-table-column label="ip定位">
                            <template slot-scope="scope">
                                <div>{{scope.row.ip_address}}</div>
                                <div>{{scope.row.ip}}</div>
                            </template>
                        </el-table-column>-->
                        <el-table-column prop="is_show" label="添加">
                            <template slot-scope="scope">
                                <div>{{scope.row.add_user}}</div>
                                <div>{{scope.row.add_date}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-button @click="editSupperFn(scope.row.id)" title="编辑" size="mini">编辑</el-button>
                                    <el-button @click="DeleteSupperList(scope.row.id)" title="删除" size="mini">删除</el-button>
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                    <empty :empty='!loading&&!data.length' :loading='loading'></empty>
                    <paging :query='query' :total='total'></paging>
                </el-tab-pane>
            </div>
        </el-tabs>
    </el-form>
</template>
<style scope lang='scss'>

</style>
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
                data: [],
                loading: true,
                total: 0, // 当前列表的条数
                query: {
                    name: this.$route.query.name ? this.$route.query.name : "",
                    mobile: this.$route.query.mobile ? this.$route.query.mobile : "",
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                },
                form: {
                    id: '',
                    name: '',
                    is_show: 1,
                    sort: 0,
                    parent_id:'0',
                },
                rules: {
                    name: [{
                        required: true,
                        message: '栏目名称不能为空',
                        trigger: 'blur'
                    }],
                    sort: [{
                        validator: this.$.v.positive,
                        required: true,
                        trigger: 'blur,change'
                    }]
                }
            }
        },
        mixins: [pagingEvent],
        created() {
            _self = this;
            this.getData()
        },
        methods: {
            getData() {
                var _self = this;
                this.$http.get('supplier/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        _self.data = res.data.data.list
                        _self.total = res.data.data.total
                        _self.loading = false;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            // 编辑供应商
            editSupperFn(id){
                this.$router.push({'path': 'add',query: {id: id}})
            },
            // 删除供应商
            DeleteSupperList(id){
                this.$confirm('此操作将永久删除该供应商, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('supplier/delete', {
                        id: id
                    })
                    .then(function (res) {
                        if (res.data.code == '1000') {
                            _self.$message({
                                type: 'success',
                                message: "删除成功！"
                            });
                            _self.getData()
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
            // 添加供应商按钮
            addSupperFn(){
                this.$router.push({'path': 'add'})
            }
        },
        components: {
            paging,
        }
    }

</script>
