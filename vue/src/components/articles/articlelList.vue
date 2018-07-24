<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">文章列表</div>
                </div>
            </div>
        </div>
        <div class="list-body">
            <div class="list-header">
                <el-form :inline="true" :model="query" size="small">
                    <el-form-item>
                        <el-input v-model="query.name" placeholder="请输入文章标题" @keyup.enter.native="goRouter"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="query.is_show">
                            <el-option key="" label="请选择发布状态" value="">
                            </el-option>
                            <el-option v-for="item in statusData" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="userInfoType">
                        <el-select v-model="query.column_id" placeholder="请选择文章栏目">
                            <el-option key="" label="请选择栏目" value="-1">
                            </el-option>
                            <el-option v-for="item in columnData" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="goRouter" icon="el-icon-search" :loading="loading">
                            查询
                        </el-button>
                    </el-form-item>
                </el-form>
                <el-button icon="el-icon-plus" title="添加" size="mini" style="margin-bottom:15px;" @click="addArticleFn">添加文章
                </el-button>
            </div>
            <el-table :data="data.list" style="width: 100%" size="mini" v-if='data.list.length'>
                <el-table-column label="文章标题" width="350">
                    <template slot-scope="scope">
                        <a class="a-hover" :href="'https://seller.jiajuol.com/api/company/story/preview?id='+scope.row.id" target="_blank" v-if="scope.row.url">{{scope.row.title}}</a>
                        <span v-else>{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="column" label="所属栏目" v-if='$.userInfo.info.has_site==1'>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 'yes'">
                            发布
                        </div>
                        <div v-else>
                            未发布
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="editor" label="来源">
                </el-table-column>
                <el-table-column prop="sort" label="排序">
                </el-table-column>
                <el-table-column prop="add_user" label="添加人/添加时间">
                    <template slot-scope="scope">
                        <div>添加人：{{scope.row.add_user}}</div>
                        <div>添加时间：{{scope.row.add_date}}</div>
                    </template>
                </el-table-column>
                <!-- </el-table-column> -->
                <el-table-column prop="modi_user" label="修改人/修改时间">
                    <template slot-scope="scope">
                        <div v-if="scope.row.modi_user">修改人：{{scope.row.modi_user}}</div>
                        <div v-if="scope.row.modi_date">修改时间：{{scope.row.modi_date}}</div>
                    </template>
                </el-table-column>
                <!-- </el-table-column> -->
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
            <paging :query='query' :total='data.total' v-if='data.total'></paging>
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
                columnData:[],
                loading: true,
                total: 0, // 当前列表的条数
                userInfoType:'',
                query: {
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                    name: this.$route.query.name ? this.$route.query.name : '',
                    is_show: this.$route.query.is_show ? this.$route.query.is_show : '',
                    column_id: this.$route.query.column_id ? this.$route.query.column_id : '-1'
                },
                statusData: [{
                    value: 'yes',
                    label: '发布'
                }, {
                    value: 'no',
                    label: '未发布'
                }],
                value: ''
            }
        },
        mixins: [pagingEvent],
        created() {
            _self = this;
            this.getData()
            this.userInfoType = JSON.parse(this.$localStorage.get('userInfoM')).info.has_site
            if(this.userInfoType != 0){
                this.getColumnData()
            }

        },
        methods: {
            getData() {
                _self.$http.get('story/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        _self.loading = false;
                        if (res.codeFlag) {
                            var d = res.data.data;
                            _self.data = d;
                        }
                    })
            },
            // 获取栏目列表
            getColumnData(){
                this.$http.get('column/list', {
                        params: {
                            page: 1,
                            page_size: 0
                        }
                    })
                    .then(function (res) {
                        if (res.data.code == '1000') {
                            _self.columnData = res.data.data.list
                            console.log(_self.columnData)
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            //新增按钮
            addArticleFn() {
                this.$router.push({
                    path: 'add_article',
                    query: {
                        prevPath: _self.$route.fullPath
                    }
                });
            },
            // 编辑
            handleEdit(row) {
                this.$router.push({
                    path: 'add_article',
                    query: {
                        id: row.id,
                        prevPath: _self.$route.fullPath
                    }
                });
            },
            // 删除
            handleDelete(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.$http.get('story/delete', {
                        params: {
                            id: row.id
                        }
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
            formatter(row, column) {
                return row.address;
            },
            onSubmit() {
                var _self = this;
                this.loading = true;
                setTimeout(function () {
                    _self.loading = false;
                }, 1000)
            }
        },
        components: {
            paging
        }
    }

</script>
