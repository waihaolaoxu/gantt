<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl" :class="{'is-active':query.type==0}" @click='query.type=0;goRouter();'>跟进
                        <small class="bg-red sub-btn" style="line-height: 17px;" v-if='transformClueNum'>{{transformClueNum}}</small>
                    </div>
                    <div class="el-tabs__item fl" :class="{'is-active':query.type==1}" @click='query.type=1;goRouter();'>今日回访
                        <small class="bg-red sub-btn" style="line-height: 17px;" v-if='dealNum'>{{dealNum}}</small>
                    </div>
                    <div class="el-tabs__item fl" :class="{'is-active':query.type==2}" @click='query.type=2;goRouter();'>录入线索</div>
                </div>
            </div>
        </div>
        <div class="list-body no-border-top">
            <div class="list-header">
                <el-form :inline="true" size="small">
                    <city-options :province='query.province_id' :city='query.city_id' @syncProvince='provinceChange' @syncCity='cityChange' v-if="!city_list.length&&city_status"></city-options>
                    <el-form-item v-if="city_list.length&&city_status">
                        <el-select v-model="query.city_id" placeholder="请选择城市">
                            <el-option v-for="item in city_list" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker
                            v-model="clueDate"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                        <!--<el-date-picker v-model="query.begin_date" type="date" placeholder="选择开始日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                        </el-date-picker>
                        至
                        <el-date-picker v-model="query.end_date" type="date" placeholder="选择结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                        </el-date-picker>-->
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="query.status" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="query.degree" placeholder="请选择">
                            <el-option v-for="item in degreeListData" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-input v-model="query.name" placeholder="联系人或者联系方式" @keyup.enter.native="goRouter"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="goRouter" icon="el-icon-search" :loading="loading">搜索</el-button>
                    </el-form-item>
                </el-form>
                <el-button icon="el-icon-plus" title="添加" size="mini" style="margin:0 0 15px 0;" @click="addClueFn">
                    添加线索
                </el-button>
            </div>
            <empty :empty='!loading&&!tableData.length' :loading='loading'></empty>
            <follow-List :tebleDatas="tableData" :totals="total" v-if='tableData.length'></follow-List>
            <paging :query='query' :total='total'></paging>
        </div>
    </div>
</template>
<script>
    import followList from './followList';
    import paging from '@/components/block/paging';
    import cityOptions from '@/components/block/city';
    import {
        pagingEvent
    } from '@/mixins/index';
    export default {
        data() {
            return {
                loading: true,
                activeName2: 'first',
                tableData: [],
                total: 0, // 当前列表的条数
                city_list: [],
                city_status: false,
                transformClueNum: '',
                dealNum: '',
                clueDate: [],
                query: {
                    status: this.$route.query.status != undefined ? this.$route.query.status.toString() : '-1', //跟进状态
                    degree: this.$route.query.degree || '0', // 重要度
                    type: this.$route.query.type || 0, // 页签类型1为今日回访,2为录入线索
                    begin_date: this.$route.query.begin_date || "",
                    end_date: this.$route.query.end_date || "",
                    province_id: this.$route.query.province_id || '',
                    city_id: this.$route.query.city_id || '',
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                    name: this.$route.query.name || ""
                },
                options: [{
                    value: '-1',
                    label: '状态'
                }, {
                    value: '0',
                    label: '未跟进'
                }, {
                    value: '1',
                    label: '跟进中'
                }, {
                    value: '2',
                    label: '已成交'
                }, {
                    value: '3',
                    label: '废单'
                }],
                degreeListData: [{
                    value: '0',
                    label: '重要度'
                }, {
                    value: '1',
                    label: '一星'
                }, {
                    value: '2',
                    label: '二星'
                }, {
                    value: '3',
                    label: '三星'
                }, {
                    value: '4',
                    label: '四星'
                }, {
                    value: '5',
                    label: '五星'
                }]
            }
        },
        mixins: [pagingEvent],
        watch: {
            clueDate: function (newValue, oldValue) {
                if (newValue) {
                    this.query.begin_date = newValue[0]
                    this.query.end_date = newValue[1]
                }
            }
        },
        created() {
            var userInfo = JSON.parse(this.$localStorage.get('userInfoM'));
            console.log("用户信息", userInfo)
            this.source_type = userInfo.info.crm_sync_status;
            // this.source_type == 0 ? this.listUrl = 'clue/appoint/follow/list' :
            this.listUrl = 'clue/follow/list'; // = 0 东易  =1 普通
            if (this.$route.query.begin_date) {
                this.clueDate = [this.$route.query.begin_date, this.$route.query.end_date]
            } else {
                this.clueDate = ''
            }
            console.log(this.clueDate)
            this.getData();
        },
        methods: {
            getData() {
                var _self = this;
                _self.city_status = false;
                this.$http.get(this.listUrl, {
                        params: _self.query
                    })
                    .then(function (res) {
                        console.log(res);
                        _self.loading = false;
                        _self.tableData = res.data.data.list;
                        _self.city_list = res.data.data.city_list;
                        _self.total = res.data.data.total;
                        _self.transformClueNum = res.data.data.transformClueNum;
                        _self.dealNum = res.data.data.dealNum;
                        _self.city_status = true;
                    })
            },
            addClueFn() {
                this.$router.push({
                    path: '/clue/add_clue'
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
            followList,
            cityOptions,
            paging
        }
    }

</script>
