<template>
    <div class="list-box">
        <el-tabs v-model="activeName2" type="card">
            <div class="list-body">
                <el-tab-pane label="工程列表" name="first">
                    <div class="list-header">
                        <el-form :inline="true" :model="query" size="small">
                            <el-form-item label="搜索条件:">
                                <el-select v-model="query.stage" placeholder="请选择工程进度">
                                    <el-option key="0" label="全部" value="0">
                                    </el-option>
                                    <el-option v-for="(val,key) in typeData" :key="key" :label="val" :value="key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <city-options :province='query.province_id' :city='query.city_id' @syncProvince='provinceChange' @syncCity='cityChange' style="margin-bottom: 0;"></city-options>
                            <el-form-item style="width: 120px;">
                                <el-select v-model="query.search_type" placeholder="请选择类型">
                                    <el-option v-for="item in searchTypeData" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="query.name" placeholder="请输入搜索内容" @keyup.enter.native="goRouter"></el-input>
                            </el-form-item>
                            <!--<el-form-item label="发布状态:">
                                <el-select v-model="query.is_show" placeholder="请选择">
                                    <el-option
                                        v-for="item in statusData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>-->
                            <el-form-item>
                                <el-button type="primary" @click="goRouter" icon="el-icon-search">
                                    搜索
                                </el-button>
                                <!-- <el-button type="primary" @click="onSubmit">重置条件</el-button> -->
                            </el-form-item>
                        </el-form>
                        <!-- <el-button icon="el-icon-plus" title="添加" size="mini" style="margin:0 0 15px 0;" @click="addProjectFn">创建工地
                        </el-button> -->
                        <div class="mt10"></div>
                    </div>
                    <el-table :data="data" style="width: 100%;" v-if="data.length" size="mini" @sort-change="updataTime">
                        <el-table-column prop="id" label="项目编号">
                        </el-table-column>
                        <el-table-column label="工程标题">
                            <template slot-scope="scope">
                                {{scope.row.title}}
                                <!--<a :href="'http://www.haopinjia.com/construction/'+scope.row.id" class="a-hover" target="_blank">{{scope.row.title}}</a>-->
                            </template>
                        </el-table-column>
                        <el-table-column prop="contract_number" label="合同编号">
                        </el-table-column>
                        <el-table-column prop="name" label="业主信息">
                            <template slot-scope="scope">
                                <div>
                                    <span v-if="scope.row.landlord_name != ''">{{scope.row.landlord_name}}</span>
                                    <span v-if="scope.row.landlord_mobile != ''">({{scope.row.landlord_mobile}})</span>
                                </div>
                                <div>
                                    <span>{{scope.row.build_name}}</span>
                                </div>
                                <div>面积：{{scope.row.area}}m²</div>
                                <div>地址：{{scope.row.build_address}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="工程期限">
                            <template slot-scope="scope">
                                <div v-if="scope.row.start_date !=''">开工：{{scope.row.start_date}}</div>
                                <div v-if="scope.row.end_date !=''">竣工：{{scope.row.end_date}}</div>
                            </template>
                        </el-table-column>
                        <!--<el-table-column label="服务团队">
                            <template slot-scope="scope">
                                <div v-if="scope.row.designer != ''">{{scope.row.designer}}(设计师)</div>
                                <div v-if="scope.row.secretary != ''">{{scope.row.secretary}}(客服)</div>
                                <div v-if="scope.row.workman != ''">{{scope.row.workman}}(工长)</div>
                            </template>
                        </el-table-column>-->
                        <el-table-column prop="decoration" label="装修方式">
                        </el-table-column>
                        <el-table-column prop="contrcact" label="承包方式">
                        </el-table-column>
                        <el-table-column prop="create_date" sortable label="创建时间">
                        </el-table-column>
                        <span class="el-icon-arrow-down"></span>
                        <el-table-column prop="update_date" sortable  label="更新时间">
                        </el-table-column>
                        <el-table-column label="已传图片">
                            <template slot-scope="scope">
                                <!--{{scope.row.photos_count}}-->
                                <div v-for="(val, key) in scope.row.photos_count" :key='key'>{{key}}：
                                    <span :class="{'color-yellow': val < 5 && val != 0, 'color-green': val > 5, 'color-clue': val == 0}" style="font-weight: 700;">{{val}}</span>张
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="当前阶段" align="center">
                            <template slot-scope="scope">
                                <div v-if="scope.row.stage_id != 1 && scope.row.stage_id != 2000" class="flex-box middle-j">
                                    <span class="bg-color-1 progressW f12">{{scope.row.stage}}</span>
                                </div>
                                <div v-else-if="scope.row.stage_id == 2000" class="flex-box middle-j">
                                    <span class="bg-color-2 progressW f12">{{scope.row.stage}}</span>
                                </div>
                                <div v-else class="flex-box middle-j">
                                    <span class="bg-color-gray progressW" f12>{{scope.row.stage}}</span>
                                </div>
                                <div class="f12 nowrap">{{scope.row.stage_time}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="最后过程添加时间" align='center'>
                            <template slot-scope="scope">
                                <div v-if="scope.row.last_process_date">
                                    {{scope.row.last_process_date}}
                                    <div class="color-red" style="text-align:center;" v-if="scope.row.last_process_interval">距今{{scope.row.last_process_interval}}天</div>
                                    <div class="color-red" style="text-align:center;" v-else>今天</div>
                                    <ul class="flex-box middle" @click='imgBig(scope.row.last_process_photos)'>
                                        <li v-for="v,index in scope.row.last_process_photos" style="width: 50px;height: 50px;position:relative;" v-if="index<2" :key='index'>
                                            <img :src="v.photo_url_zs" class="cover" :class="{marginL: index == 1}">
                                            <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.3);color:#fff;" v-if="index == 1"
                                                :class="{marginL: index == 1}" class="flex-box middle">共{{scope.row.last_process_photos.length}}张</div>
                                        </li>
                                    </ul>
                                    <p class="color-red" v-if="scope.row.stage_id == 2000" style="text-align:center;margin-top:20px;">[已关闭]</p>
                                    <p class="color-red" v-else-if="scope.row.stage_id == 1" style="text-align:center;margin-top:20px;">[未开启]</p>
                                    <p class="color-green" style="text-align:center;margin-top:20px;" v-else>[已开启]</p>
                                </div>
                                <div v-else style="text-align:center;">
                                    <p class="color-clue">暂无过程</p>
                                    <p class="color-red" v-if="scope.row.stage_id == 2000" style="text-align:center;margin-top:20px;">[已关闭]</p>
                                    <p class="color-red" v-else-if="scope.row.stage_id == 1" style="text-align:center;margin-top:20px;">[未开启]</p>
                                    <p class="color-green" style="text-align:center;margin-top:20px;" v-else>[已开启]</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-button @click="handleEdit(scope.row)" title="编辑" size="mini">编辑</el-button>
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                    <empty :empty='!loading&&!data.length' :loading='loading'></empty>
                    <paging :query='query' :total='total'></paging>
                </el-tab-pane>
            </div>
        </el-tabs>
        <!--<big-img :listData="listData" :show="show"></big-img>-->
        <transition name='slide-scale'>
            <el-carousel :autoplay='false' arrow="always" class="pf zero full bigImgs tran" v-if='imgs.show'>
                <span class="no-select pa closeImg flex-box middle" @click='closeImg'>X</span>
                <el-carousel-item v-for="(item,index) in imgs.list" :key="index">
                    <div class="flex-box full middle">
                        <img v-lazy="item.photo_url_l" class="full" alt="" style="object-fit:contain">
                    </div>
                </el-carousel-item>
            </el-carousel>
        </transition>

    </div>
</template>
<style scope lang='scss'>
    .marginL {
        margin-left: 5px;
    }
    

</style>
<script>
    import cityOptions from '@/components/block/city';
    // import bigImg from '@/components/block/bigImg';
    import paging from '@/components/block/paging';
    import {
        pagingEvent
    } from '@/mixins/index';
    export default {
        data() {
            return {
                imgs: {
                    list: [],
                    show: false,
                },
                data: [],
                loading: true,
                listData: [], // 当前点击查看的图片集合
                show: false,
                total: 0, // 当前列表的条数
                query: {
                    stage: this.$route.query.stage || '',
                    search_type: this.$route.query.search_type || '',
                    name: this.$route.query.name || '',
                    is_show: this.$route.query.is_show || '',


                    province_id: this.$route.query.province_id || '',
                    city_id: this.$route.query.city_id || '',
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                },
                activeName2: this.$route.path == '/construction/edit_project_process' ? 'second' : 'first',
                typeData: {},
                searchTypeData: [{
                    value: '1',
                    label: '业主手机号'
                }, {
                    value: '2',
                    label: '业主姓名'
                }, {
                    value: '3',
                    label: '小区名称'
                }, {
                    value: '4',
                    label: '合同编号'
                }],
                // statusData: [{
                //     value: '1',
                //     label: '发布'
                // }, {
                //     value: '2',
                //     label: '未发布'
                // }],
                value: ''
            }
        },
        mixins: [pagingEvent],
        created() {
            this.getStageList()
            this.getData()
        },
        methods: {
            updataTime(column){
                if(column.prop=="update_date"){
                    if(column.order=='ascending'){
                        this.query.sort_type=4
                    }else if(column.order=='descending'){
                        this.query.sort_type=2
                    }
                }else if(column.prop=="create_date"){
                   if(column.order=='ascending'){
                        this.query.sort_type=3
                    }else if(column.order=='descending'){
                        this.query.sort_type=1
                    }
                }
                if(column.order){
                    this.getData()
                }
                
            },
            imgBig(obj) {
                if (obj) {
                    this.imgs.list = obj;
                    this.imgs.show = true;
                }
            },
            closeImg() {
                this.imgs.show = false;
            },
            getData() {
                var _self = this;
                this.$http.get('engineer/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.data = res.d.list
                            _self.total = res.d.total
                        }
                        _self.loading = false;
                    })
            },
            //工程进度状态
            getStageList() {
                var _self = this;
                this.$http.get('common/engineer/dict', {
                        params: {
                            name: "stage"
                        }
                    })
                    .then(function (res) {
                        console.log("工程进度状态", res.data.data.stage);
                        _self.typeData = res.data.data.stage
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            provinceChange(v) {
                this.query.province_id = v;
            },
            cityChange(v) {
                this.query.city_id = v;
            },
            //新增按钮
            addProjectFn() {
                this.$router.push({
                    path: 'create_project'
                });
            },
            // 编辑
            handleEdit(row) {
                this.$router.push({
                    path: 'edit_project',
                    query: {
                        id: row.id
                    }
                });
            },
            formatter(row, column) {
                return row.address;
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            lookImg(listData) {
                console.log("当前点击图片集合：", listData)
                this.listData = listData;
                this.show = true;
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
            cityOptions,
            paging,
        }
    }

</script>
