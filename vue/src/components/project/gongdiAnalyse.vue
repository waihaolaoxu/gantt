<template>
    <div>
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <span class="el-tabs__item fl" @click="$router.push({path:'engineer_info',query: {id: $route.query.id, engineer_name: $route.query.engineer_name}})">工地明细</span>
                    <span class="is-active el-tabs__item fl">工地收支分析</span>
                </div>
            </div>
        </div>
        <div class="list-box bg-white">
            <div class="list-body no-border-top">
                <div class="list-header gongdiAnalyse">
                    <el-form :inline="true" size="small">
                        <el-form-item label="搜索条件:">
                            <!-- <el-date-picker v-model="searchDate"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                            >
                            </el-date-picker> -->
                            <el-autocomplete ref="clueInput" class="inline-input" v-model="query.engineer_name" :fetch-suggestions="querySearchAsyncClue"
                                placeholder="请输入工地名称或客户姓名" style="width:100%" @select="handleSelectClue">
                                <template slot-scope="props">
                                    <div class="f14" style='line-height:1.5em;padding:5px;'>
                                        <div>{{props.item.title}}</div>
                                        <!-- <div>{{props.item.build_name}} {{props.item.landlord_name}} {{props.item.room_name?props.item.room_name+"居室":''}} {{props.item.area?props.item.area+"㎡":''}}</div> -->
                                        <div class="mt5 f12">
                                            <i class="iconfont icon-ren f12"></i> {{ props.item.landlord_name }}
                                            <span class="pd-r10"></span>
                                            <i class="iconfont icon-ziyuan f12"></i> {{ props.item.build_name }}
                                        </div>
                                    </div>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="goRouter">
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="tip text-sub f12">
                    <!-- <div>周期：{{start_date}} ~ {{end_date}}</div> -->
                    <!-- <p class="f16 mb5 text-title" style="margin-top: -5px;">周期：{{start_date}} ~ {{end_date}}</p> -->
                    <div>
                        收入: <span class="text-success">{{income}}</span>(元)
                        支出: <span class="text-error">{{expend}}</span>(元)
                        结余: <span class="text-success" v-if='balance.indexOf("-")==-1'>{{balance}}</span>
                        <span class="text-error" v-else>{{balance}}</span>(元)
                    </div>
                </div>
                <el-row :gutter="10" style='width:100%;'>
                    <el-col :sm="24" :md="24" :lg="12" :xl="12" v-if="data.incomeList.length">
                        <div class="pd5" v-if="show">
                            <p class="f14">工地收入分析:</p>
                            <ve-ring :data="chartData" :settings="chartSettings" style="height: 400px;"></ve-ring>
                            <el-table
                                :data="data.incomeList"
                                border
                                style="width: 50%;margin:0 auto;">

                                <el-table-column
                                prop="expend_type_name"
                                label="类型">
                                </el-table-column>
                                <el-table-column
                                label="金额">
                                    <template slot-scope="scope">
                                        <div class="text-success">{{scope.row.money}}</div>
                                    </template>
                                </el-table-column>

                                <el-table-column
                                label="操作"
                                width="80">
                                    <template slot-scope="scope">
                                        <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
                                        <el-button title="查看" size="mini" @click="$router.push({path: 'capital_type_info',query:{flag:2,type:1,expend_type:scope.row.expend_type,engineer_id: $route.query.id,name:scope.row.expend_type_name,money:scope.row.money}})">查看</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                    <el-col :sm="24" :md="24" :lg="12" :xl="12" v-if="data.expendList.length">
                        <div class="pd5" v-if="show">
                            <p  class="f14" >工地支出分析:</p>
                            <ve-ring :data="chartData1" :settings="chartSettings" style="height: 400px;"></ve-ring>
                            <el-table
                                :data="data.expendList"
                                border
                                style="width: 50%;margin:0 auto;">

                                <el-table-column
                                prop="expend_type_name"
                                label="类型">
                                </el-table-column>
                                <el-table-column
                                prop="money"
                                label="金额">
                                    <template slot-scope="scope">
                                        <div class="text-error">{{scope.row.money}}</div>
                                    </template>
                                </el-table-column>

                                <el-table-column
                                label="操作"
                                width="80">
                                <template slot-scope="scope">
                                    <el-button title="查看" size="mini" @click="$router.push({path: 'capital_type_info',query:{flag:2,type:2,expend_type:scope.row.expend_type,engineer_id: $route.query.id,name:scope.row.expend_type_name,money:scope.row.money}})">查看</el-button>
                                </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.gongdiAnalyse{
    .el-form-item__content{
        width: 400px;
    }
}
</style>

<script>
    var _self;
    import {
        pagingEvent
    } from '@/mixins/index';
    export default {
        data() {
            return {
                show: false,
                data:{
                    expendList:[],
                    incomeList:[]
                },
                chartData: {
                    rows: []
                },
                chartData1: {
                    rows: []
                },
                timeout:  null,
                d: {
                    landlord_name: '',
                    transform_info: {

                    }
                },
                query: {
                    clueName:"",
                    engineer_name:"",
                    id:""
                },
                searchDate: [],
                // start_date:"",
                // end_date:"",
                chartSettings:{},
                income:"",//收入
                expend:"",//支出
                balance:"",//结余
            }
        },
        watch: {
            // searchDate: function (newValue, oldValue) {
            //     if (newValue) {
            //         this.start_date = newValue[0]
            //         this.end_date = newValue[1]
            //     }
            // }
        },
        mixins: [pagingEvent],
        computed: {},
        created() {
            _self = this;
            setTimeout(() => {
                this.show = true
            }, 500);
            this.$set(this.query,"engineer_name",this.$route.query.engineer_name)
            this.getCapitalInfo(this.$route.query.id);
        },
        methods: {
            // 关联线索下拉
            querySearchAsyncClue(queryString, cb) {
                console.log("1-1--1--1-11--")
                var that = this;
                // this.$http.get('engineer/list', {
                //     params: {
                //         name: queryString
                //     }
                // }).then(res => {
                //     var restaurants = res.data.data.list;
                //     var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                //     clearTimeout(this.timeout);
                //     this.timeout = setTimeout(() => {
                //         cb(results);
                //     }, 500 * Math.random());
                // })
                this.$cache('engineer/list', {
                    params: {
                        name: queryString
                    }
                }).then(res => {
                    if (res) {
                        var d = res.data.data.list;
                        // console.log(d);
                        cb(d);
                    }
                })
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.title.indexOf(queryString) === 0);
                };
            },
            handleSelectClue(item) {
                console.log('item', item)
                this.query.engineer_name = item.title;
                this.query.id = item.id;
            },
            getNumber(v) {
                let moneyArr = v.split(',');
                let money = "";
                moneyArr.forEach(function(v,i){
                    money += v
                })
                return Number(money);
            },
            searchFn(engineer_id){
                this.getCapitalInfo(engineer_id);
            },
            // 获取收支详情
            getCapitalInfo(engineer_id){
                this.$http.get(`engineer/capital/detail`,{
                    params: {
                        engineer_id: engineer_id,
                        // start_date: _self.start_date,
                        // end_date: _self.end_date
                    }
                })
                    .then(function (res) {
                        if (res.codeFlag) {
                            var d = res.d;
                            _self.data.expendList = d.expendList;
                            _self.data.incomeList = d.incomeList;
                            // columns: ['类型', '钱数'],
                            _self.chartData.rows = [];
                            _self.chartData1.rows = [];
                            d.incomeList.forEach(function(v,i){
                                _self.chartData.rows.push({
                                    '类型': v.expend_type_name,
                                    '钱数': _self.getNumber(v.money)
                                })
                            })
                            d.expendList.forEach(function(v,i){
                                _self.chartData1.rows.push({
                                    '类型': v.expend_type_name,
                                    '钱数': _self.getNumber(v.money)
                                })
                            })
                            _self.chartSettings = {
                                dimension: '类型',
                                metrics: '钱数'
                            }
                            // _self.start_date = d.start_date;
                            // _self.end_date = d.end_date;
                            _self.income = d.income;
                            _self.expend = d.expend;
                            _self.balance = d.balance;
                        }
                    })
            }
        },
        components: {

        }
    }

</script>
