<template>
    <div>
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <span class="el-tabs__item fl" @click="$router.push({path:'capital_list'})">收支明细</span>
                    <span class="el-tabs__item fl" @click="$router.push({path:'total_capital_analyse'})">收入分析</span>
                    <span class="is-active el-tabs__item fl">支出分析</span>
                </div>
            </div>
        </div>
        <div class="list-box bg-white">
            <div class="list-body no-border-top">
                <div class="list-header">
                    <el-form :inline="true" :model="query" size="small">
                        <el-form-item label="搜索条件:">
                            <el-date-picker v-model="searchDate"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" :loading="loading" @click="searchFn">
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="tip text-sub f12">
                    <!-- <div>周期：{{start_date}} ~ {{end_date}}</div> -->
                    <p class="f16 mb5 text-title" style="margin-top: -5px;">周期：{{start_date}} ~ {{end_date}}</p>
                    <div>
                        收入: <span class="text-success">{{expend}}</span>(元)
                        支出: <span class="text-error">{{income}}</span>(元)
                        结余: <span class="text-success" v-if='balance.indexOf("-")==-1'>{{balance}}</span>
                        <span class="text-error" v-else>{{balance}}</span>(元)
                    </div>
                </div>
                <div class="pd5" style="height: 400px;" v-if="show">
                    <ve-ring :data="chartData" :settings="chartSettings" style="height: 400px;"></ve-ring>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">

</style>

<script>
    var _self;
    export default {
        data() {
            return {
                show: false,
                chartData: {
                    rows: []
                },
                searchDate: [],
                start_date:"",
                end_date:"",
                chartSettings:{},
                income:"",//收入
                expend:"",//支出
                balance:"",//结余
            }
        },
        watch: {
            searchDate: function (newValue, oldValue) {
                if (newValue) {
                    this.start_date = newValue[0]
                    this.end_date = newValue[1]
                }
            }
        },
        computed: {},
        created() {
            _self = this;
            setTimeout(() => {
                this.show = true
            }, 500);
            this.getCapitalInfo()
        },
        methods: {
            getNumber(v) {
                let moneyArr = v.split(',');
                let money = "";
                moneyArr.forEach(function(v,i){
                    money += v
                })
                return Number(money);
            },
            searchFn(){
                this.getCapitalInfo();
            },
            // 获取收支详情
            getCapitalInfo(){
                this.$http.get(`engineer/capital/detail`,{
                    params: {
                        start_date: _self.start_date,
                        end_date: _self.end_date
                    }
                })
                    .then(function (res) {
                        if (res.codeFlag) {
                            var d = res.d;
                            // columns: ['类型', '钱数'],
                            _self.chartData.rows = [];
                            d.expendList.forEach(function(v,i){
                                _self.chartData.rows.push({
                                    '类型': v.expend_type_name,
                                    '钱数': _self.getNumber(v.money)
                                })
                            })
                            _self.chartSettings = {
                                dimension: '类型',
                                metrics: '钱数'
                            }
                            _self.start_date = d.start_date;
                            _self.end_date = d.end_date;
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
