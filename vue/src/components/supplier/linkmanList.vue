<template>
    <el-form class="list-box">
        <el-tabs v-model="activeName2" type="card">
            <div class="list-body">
                <el-tab-pane label="通讯录列表" name="first">
                    <div class="list-header">
                        <el-form :inline="true" :model="query" size="small">
                            <el-form-item>
                                <el-input v-model="query.search" placeholder="请输入联系人名称/手机号" @keyup.enter.native="goRouter"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="goRouter" icon="el-icon-search" :loading="loading">
                                    搜索
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <el-button icon="el-icon-plus" title="添加" size="mini" style="margin:0 0 15px 0;" @click="addLinkManFn">添加联系人
                        </el-button>
                    </div>
                    <el-table :data="data" style="width: 100%" v-if="data.length" size="mini">
                        <el-table-column prop="id" label="ID">
                        </el-table-column>
                        <el-table-column prop="name" label="联系人">
                        </el-table-column>
                        <el-table-column prop="phone" label="联系方式">
                        </el-table-column>
                        <el-table-column prop="company" label="公司名称">
                        </el-table-column>
                        <el-table-column prop="position" label="职位">
                        </el-table-column>
                        <el-table-column prop="flag_name" label="类型">
                        </el-table-column>
                        <!--<el-table-column label="ip定位">
                            <template slot-scope="scope">
                                <div>{{scope.row.ip_address}}</div>
                                <div>{{scope.row.ip}}</div>
                            </template>
                        </el-table-column>-->

                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-button @click="editSupperFn(scope.row.id)" title="编辑" size="mini">编辑</el-button>
                                    <!-- <el-button @click="DeleteSupperList(scope.row.id, scope.row.name)" title="删除" size="mini">删除</el-button> -->
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
                    search: this.$route.query.search ? this.$route.query.search : "",
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                    is_all: 1
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
                this.$http.get('linkman/list', {
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
            // 编辑联系人
            editSupperFn(id){
                this.$router.push({'path': 'addLinkMan',query: {id: id}})
            },
            // 删除联系人
            DeleteSupperList(id, name){
                this.$confirm('确定删除联系人('+name+')吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        _self.$http.get('linkman/delete', {
                            params: {
                                id: id
                            }
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
                        //     type: 'info',
                        //     message: '已取消删除'
                        // });
                    });
            },
            // 添加联系人按钮
            addLinkManFn(){
                this.$router.push({'path': 'addLinkMan'})
            }
        },
        components: {
            paging,
        }
    }

</script>
