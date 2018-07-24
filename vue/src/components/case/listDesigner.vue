<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">设计师列表</div>
                </div>
            </div>
        </div>
        <div class="list-body no-border-top">
            <div class="list-header">
                <el-form :inline="true" :model="query" size="small">
                    <el-form-item>
                        <el-input v-model="query.name" placeholder="设计师姓名" @keyup.enter.native="goRouter"></el-input>
                    </el-form-item>
                    <city-options :province='query.province_id' :city='query.city_id' @syncProvince='provinceChange' @syncCity='cityChange' style="margin-bottom:0;"></city-options>
                    <el-form-item>
                        <el-button type="primary" @click="goRouter" icon="el-icon-search" :loading="loading">查询</el-button>
                    </el-form-item>
                </el-form>
                <div class="list-header" style="border: none;">
                    <el-button icon="el-icon-plus" title="添加" size="mini" style="margin:0 0 15px 0;" @click="$router.push({path:'/case/designer/add',query:{prevPath: $route.fullPath}})">添加设计师</el-button>
                </div>
            </div>
            <el-table :data="data.list" style="width: 100%" size="mini" v-if='data.list.length'>
                <el-table-column prop="id" label="ID">
                </el-table-column>
                <el-table-column label="姓名">
                    <template slot-scope="scope">
                        <!-- <router-link class="a-hover">{{scope.row}}</router-link> -->
                        <a class="a-hover" @click="$router.push({path:'/case/designer/add',query:{id:scope.row.id,prevPath: $route.fullPath}})" >{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码">
                </el-table-column>
                <el-table-column label="省市">
                    <template slot-scope="scope">
                        <!-- {{ scope.row.provincename }} -->
                        {{ scope.row.cityname }}
                    </template>
                </el-table-column>
                <el-table-column prop="add_date" label="添加时间">
                </el-table-column>
                <el-table-column prop="add_user" label="添加人">
                </el-table-column>
                <el-table-column prop="modi_date" label="修改时间">
                </el-table-column>
                <el-table-column prop="modi_user" label="修改人">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if='scope.row.company_isshow=="1"'>显示</span>
                        <span v-if='scope.row.company_isshow=="0"'>隐藏</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope" v-if="scope.row.import_type===0">
                        <el-button-group>
                            <el-button @click="$router.push({path:'/case/designer/add',query:{id:scope.row.id,prevPath: $route.fullPath}})" title="编辑" size="mini">编辑</el-button>
                            <el-button @click="handleDelete(scope.row)" title="删除" size="mini">删除</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <empty :empty='!loading&&!data.list.length' :loading='loading'></empty>
            <paging :query='query' :total='data.total'></paging>
        </div>
    </div>
</template>

<script>
    import paging from '@/components/block/paging';
    import {
        pagingEvent
    } from '@/mixins/index';
    import cityOptions from '@/components/block/city';
    var _self;
    export default {
        data() {
            return {
                data: {
                    list: []
                },
                loading: true,
                query: {
                    name: this.$route.query.name || '',
                    province_id: this.$route.query.province_id || '',
                    city_id: this.$route.query.city_id || '',
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                }
            }
        },
        mixins: [pagingEvent],
        computed: {},
        created() {
            _self = this;
            _self.init();
        },
        methods: {
            provinceChange(v) {
                _self.query.province_id = v;
            },
            cityChange(v) {
                _self.query.city_id = v;
            },
            getData() {
                _self.$http.get('designer/list', {
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
            // 删除
            handleDelete(d) {
                this.$confirm('此操作将永久删除该设计师, 是否继续?', '提示', _self.$.confirm).then(() => {
                    this.$http.get('designer/delete', {
                        params: {
                            id: d.id
                        }
                    }).then(res => {
                        if (res.codeFlag) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            _self.init();
                        }

                    })

                }).catch(() => {
                    // this.$message({
                    //   type: 'info',
                    //   message: '已取消删除'
                    // });
                });
            },
            handleEdit(d) {
                this.$router.push({
                    path: 'add_case',
                    query: {
                        id: d.id
                    }
                })
            },
            init() { //进入页面需要的动作
                _self.getData();
            }

        },
        components: {
            cityOptions,
            paging
        }
    }

</script>
