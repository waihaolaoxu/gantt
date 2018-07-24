<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl" :class="{'is-active':query.source_type==1}" @click='query.source_type=1;goRouter()'>公司网铺获取
                        <small class="bg-red sub-btn" style="line-height: 17px;" v-if='data.appoint_num'>{{data.appoint_num}}</small>
                    </div>
                    <div class="el-tabs__item fl" :class="{'is-active':query.source_type==2}" @click='query.source_type=2;goRouter()'>精准获客服务<!--新线索-->
                        <small class="bg-red sub-btn" v-if='data.clue_num'>{{data.clue_num}}</small>
                    </div>
                </div>
            </div>
        </div>
        <div class="list-body">
            <div class="list-header">
                <el-form :inline="true" size="small">
                    <city-options :province='query.province_id' :city='query.city_id' @syncProvince='provinceChange' @syncCity='cityChange' style="margin-bottom: 0;" v-if="!city_list.length&&city_status"></city-options>
                    <el-form-item v-if="city_list.length&&city_status">
                        <el-select v-model="query.city_id" placeholder="请选择城市">
                            <el-option v-for="item in city_list" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="goRouter">
                            搜索
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="data.list" style="width: 100%" size="mini" v-if="data.list.length">
                <el-table-column prop="id" label="ID">
                </el-table-column>
                <el-table-column prop="name" label="联系人">
                </el-table-column>
                <el-table-column prop="phone" label="联系方式" width="200">
                    <template slot-scope="scope">
                        {{scope.row.phone}}
                        <router-link :to="'/clue/clueDetail?apply_id='+scope.row.apply_id+'&resource='+source_flag" tag="a">
                            <span style="display:inline-block;padding:0 10px;color:#cd5542;background:#e9eff1;border-radius:9px;margin-left:15px;" class="f12">
                                <i class="iconfont icon-ren f12"></i> 认领</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="city_name" label="城市">
                </el-table-column>
                <el-table-column prop="ip_address" label="IP定位">
                </el-table-column>
                <el-table-column prop="app_type" label="来源" width="200">
                    <template slot-scope="scope">
                        <!--apple-->
                        <i class="iconfont" v-if="scope.row.app_type=='ios'&&scope.row.resource==1" style="color:#b5b5b5">&#xe601;</i>
                        <!--android-->
                        <i class="iconfont" v-if="scope.row.app_type=='android'&&scope.row.resource==1" style="color:#b5b5b5">&#xe618;</i>
                        <!--pc-->
                        <i class="iconfont" v-if="scope.row.resource==2" style="color:#b5b5b5">&#xe66b;</i>
                        <!--shouji-->
                        <i class="iconfont" v-if="scope.row.resource==3" style="color:#b5b5b5">&#xe627;</i>
                        <!--weixin-->
                        <i class="iconfont" v-if="scope.row.resource==5" style="color:#b5b5b5">&#xe622;</i>
                        <span v-if='scope.row.resource==4'>CRM</span>
                        <span v-if='scope.row.resource==5 || scope.row.resource==6'>{{scope.row.xcxapp}}小程序</span>
                        <span>
                            {{scope.row.app_identifier}}
                            <span v-if="scope.row.enter_url">
                                <a :href="scope.row.enter_url" target="_blank" class="a-hover">{{scope.row.enter_url}}</a>
                            </span>
                        </span>
                        <a v-if="scope.row.app_logo" style="float:right" :href="scope.row.share_url" target="_blank">
                            <img :src="scope.row.app_logo" style="width:20px;display:block;float:right;margin-right:20px;">
                        </a>

                    </template>
                </el-table-column>
                <el-table-column prop="des" label="描述">
                    <template slot-scope="scope">
                      <span v-html="scope.row.des"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="add_date" label="时间">
                </el-table-column>
                <el-table-column label="小区/面积/预算">
                    <template slot-scope="scope">
                        <div v-if="scope.row.community">小区：{{scope.row.community}}</div>
                        <div v-if="scope.row.area">面积：{{scope.row.area}}㎡</div>
                        <div v-if="scope.row.budget">预算：{{scope.row.budget}}元</div>
                    </template>
                </el-table-column>
            </el-table>
            <empty :empty='!loading&&!data.list.length' :loading='loading'></empty>
            <div class="list-footer">
                <paging :query='query' :total='total'></paging>
            </div>
        </div>
    </div>
</template>
<script>
    import cityOptions from '@/components/block/city';
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
                city_status:false,
                listUrl: '',
                loading: true,
                total: 0,
                source_type: "1",
                source_flag: '',
                city_list: [],
                query: {
                    source_type: this.$route.query.source_type || 1,
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                    province_id:this.$route.query.province_id || '',
                    city_id:this.$route.query.city_id || '',
                }
            }
        },
        mixins: [pagingEvent],
        created() {
            var userInfo = JSON.parse(this.$localStorage.get('userInfoM'));
            console.log("用户信息", userInfo)
            // this.source_type = userInfo.info.crm_sync_status;
            this.getData()
        },
        methods: {
            getData() {
                var _self = this;
                if (this.query.source_type == 1) {
                    this.listUrl = 'clue/appoint/list'
                    this.source_flag = 2
                } else if (this.query.source_type == 2) {
                    this.listUrl = 'clue/list'
                    this.source_flag = 1
                }
                _self.city_status =false;
                this.$http.get(this.listUrl, {
                    params: _self.query
                })
                .then(function (res) {
                    if(res.codeFlag){
                        _self.loading = false;
                        _self.data = res.data.data;
                        _self.city_list = res.data.data.city_list;
                        _self.total = res.data.data.total;
                        _self.city_status =true;
                    }
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
            }
        },
        components: {
            cityOptions,
            paging
        }
    }

</script>
