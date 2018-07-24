<template>
    <div>
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <router-link class="el-tabs__item fl is-active" :to="{ path: '/case/list',query:{type:0}}">案例列表</router-link>
                    <!-- <router-link class="el-tabs__item fl" :to="{ path: '/case/list',query:{type:1}}" :class="{'is-active':query.type==1}">未发布案例</router-link> -->
                    <!-- <router-link class="el-tabs__item fl" :to="{ path: '/case/list',query:{type:2}}" :class="{'is-active':query.type==2}">已丢弃案例</router-link> -->
                </div>
            </div>
        </div>
        <div class="list-box">
            <div class="list-body no-border-top">
                <div class="list-header">
                    <el-form :inline="true" :model="query" size="small">
                        <el-form-item>
                            <el-input v-model="query.name" placeholder="案例名称" @keyup.enter.native="goRouter"></el-input>
                        </el-form-item>
                        <city-options :province='query.province_id' :city='query.city_id' @syncProvince='provinceChange' @syncCity='cityChange' style="margin-bottom:0;"></city-options>
                        <el-form-item>
                            <el-select v-model="query.designer_id" placeholder="请选择设计师">
                                <el-option v-for="item in designerOptions" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发布状态">
                            <el-select v-model="query.type" placeholder="发布状态" style="width:100px;">
                                <el-option v-for="(item,k) in [['7','全部'],['0','已发布'],['1','未发布']]" :key="k" :label="item[1]" :value="item[0]"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="独立站状态" v-if="info.has_site==1">
                            <el-select v-model="query.company_isshow" placeholder="独立站状态" style="width:100px;">
                                <el-option v-for="(item,k) in [['-1','全部'],['1','显示'],['0','隐藏']]" :key="k" :label="item[1]" :value="item[0]"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="goRouter" icon="el-icon-search" :loading="loading">查询</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="list-header" style="border: none;">
                        <el-button icon="el-icon-plus" title="添加" size="mini" style="margin:0 0 15px 0;" @click="$router.push({path:'add',query:{prevPath: $route.fullPath}})">添加案例</el-button>
                    </div>
                </div>
                <el-table :data="data.list" style="width: 100%" size="mini" v-if='data.list.length'>
                    <el-table-column prop="id" label="ID" width="100">
                    </el-table-column>
                    <el-table-column label="案例名称">
                        <template slot-scope="scope">
                            <!-- <div v-if='query.type==0'>
                                <a :href='"https://seller.jiajuol.com/api/company/case/preview?id="+scope.row.id' class="a-hover" target="_blank">
                                    {{scope.row.subject}}
                                    <br>
                                    <span>{{scope.row.housetype_name}} | </span>
                                    <span>{{scope.row.style_name}} | </span>
                                    <span>{{scope.row.area}}平米 | </span>
                                    <span>{{scope.row.price_name}}</span>
                                </a>
                            </div> -->
                            <div>
                                <a :href='"https://seller.jiajuol.com/api/company/case/preview?id="+scope.row.id' class="a-hover"
                                    target="_blank">
                                    {{scope.row.subject}}
                                    <br>
                                    <span>{{scope.row.housetype_name}} | </span>
                                    <span>{{scope.row.style_name}} | </span>
                                    <span>{{scope.row.area}}平米 | </span>
                                    <span>{{scope.row.price_name}}</span>
                                </a>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="designer" label="设计师" width="100">
                    </el-table-column>
                    <el-table-column label="省市" width="150">
                        <template slot-scope="scope">
                            <!-- {{ scope.row.provincename }} -->
                            {{ scope.row.cityname }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="modi_date" label="修改时间/修改人" width="150">
                        <template slot-scope="scope">
                            {{scope.row.modi_date}}<br>{{scope.row.modi_user}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="add_date" label="添加时间/添加人" width="150">
                        <template slot-scope="scope">
                            {{scope.row.add_date}}<br>{{scope.row.add_user}}
                        </template>
                    </el-table-column>
                    <el-table-column label="发布状态" width="100" v-if="data.seller_is_show">
                        <template slot-scope="scope">
                            <span v-if='scope.row.isshow=="yes"'>已发布</span>
                            <span v-if='scope.row.isshow=="no"'>未发布</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="独立站状态" width="100" v-if="info.has_site==1">
                        <template slot-scope="scope">
                            <span v-if='scope.row.company_isshow=="1"'>显示</span>
                            <span v-if='scope.row.company_isshow=="0"'>隐藏</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope" v-if="scope.row.import_type===0">
                            <el-button-group>
                                <el-button @click="$router.push({path:'add',query:{prevPath: $route.fullPath,id:scope.row.id}})" title="编辑" size="mini">编辑</el-button>
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
                info:JSON.parse(this.$localStorage.get('userInfoM')).info,
                query: {
                    name: this.$route.query.name || '',
                    house_type: this.$route.query.house_type || '',
                    province_id: this.$route.query.province_id || '',
                    city_id: this.$route.query.city_id || '',
                    // designer_id: this.$route.query.designer_id || '',
                    designer_id: this.$route.query.designer_id ? Number(this.$route.query.designer_id) : '',
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                    type: this.$route.query.type || '7',
                    company_isshow:this.$route.query.company_isshow || '-1'
                },
                spaceOptions: [],
                designerOptions: []
            }
        },
        mixins: [pagingEvent],
        computed: {},
        created() {
            _self = this;
            _self.init();
        },
        watch: {
            'query.city_id': function () {
                this.query.designer_id = '';
                this.getDisignerOptions();
            }
        },
        methods: {
            provinceChange(v) {
                _self.query.province_id = v;
            },
            cityChange(v) {
                _self.query.city_id = v;
            },
            getData() {
                _self.$http.get('case/list', {
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
            getOptions() {
                _self.$cache('case/dict', {
                    params: {
                        name: 'type'
                    }
                }).then(res => {
                    if (res.codeFlag) {
                        var d = res.data.data;
                        this.spaceOptions = d.type
                    }
                })
            },
            getDisignerOptions: function () {
                    _self.$cache('common/designer/options', {
                        params: {
                            city_id: _self.query.city_id
                        }
                    }).then(res => {
                        if (res.codeFlag) {
                            var d = res.data.data;
                            _self.designerOptions = d
                        }
                    })

            },
            // 删除
            handleDelete(d) {
                _self.$confirm('此操作将永久删除该案例, 是否继续?', '提示', _self.$.confirm).then(() => {
                    _self.$http.get('case/delete', {
                        params: {
                            id: d.id
                        },
                        rule:true
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
                _self.getOptions();
                _self.getDisignerOptions();
            }

        },
        components: {
            cityOptions,
            paging
        }
    }

</script>
