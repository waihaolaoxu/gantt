<template>
    <div>
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <span class="is-active el-tabs__item fl">工地账本</span>
                </div>
            </div>
        </div>
        <div class="list-box bg-white">
            <div class="list-body no-border-top">
                <div class="list-header" v-if='false'>
                    <el-form :inline="true" :model="query" size="small">
                        <el-form-item>
                            <el-input v-model="query.name" placeholder="工地标题/业主名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="goRouter" icon="el-icon-search">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-table :data="data.list" style="width: 100%" size="mini" v-if='data.list.length'>
                    <el-table-column prop="engineer_id" label="ID">
                    </el-table-column>
                    <el-table-column prop="title" label="工地">
                      <template slot-scope="scope">
                          <p>{{scope.row.title}}</p>
                          <p class="f12">{{scope.row.sub_title}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="收入">
                        <template slot-scope="scope">
                            <span class="text-success">{{scope.row.income}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="支出">
                        <template slot-scope="scope">
                            <span class="text-error">{{scope.row.expend}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="结余">
                        <template slot-scope="scope">
                            <span class='text-error' v-if='scope.row.balance.indexOf("-")!=-1'>{{scope.row.balance}}</span>
                            <span class='text-success' v-else>{{scope.row.balance}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button @click="$router.push({path:'engineer_info',query:{id:scope.row.engineer_id, engineer_name: scope.row.title}})" title="查看" size="mini">查看</el-button>
                                <!-- <el-button  @click="$router.push({path:'engineer_info',query:{id:scope.row.engineer_id}})" title="去记账" size="mini">去记账</el-button> -->
                                <!-- <el-button  @click="$router.push({path:'capital_save',query:{id:scope.row.engineer_id}})" title="添加收入" size="mini">添加收入</el-button>
                                <el-button  @click="$router.push({path:'capital_save',query:{id:scope.row.engineer_id}})" title="添加支出" size="mini">添加支出</el-button> -->

                                <el-button title="添加" size="mini" @click="$router.push({path:'capital_save',query:{engineer_id: scope.row.engineer_id, prevPath: $route.fullPath, type: 1,selectType:1}})">添加收入</el-button>
                                <el-button title="添加" size="mini" @click="$router.push({path:'capital_save',query:{engineer_id: scope.row.engineer_id, prevPath: $route.fullPath, type: 2,selectType:1}})">添加支出</el-button>

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
    var _self;
    export default {
        data() {
            return {
                imgs: {
                    list: [],
                    show: false,
                    now: 0,
                },
                data: {
                    info: {

                    },
                    list: []
                },
                loading: true,
                query: {
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                    name: this.$route.query.name || '',
                },
            }
        },
        mixins: [pagingEvent],
        computed: {},
        created() {
            _self = this;
            _self.getData();
        },
        methods: {
            getData() {
                _self.$http.get('engineer/bill/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        _self.loading = false;
                        if (res.codeFlag) {
                            _self.data = res.d;
                        }
                    })
            },

        },
        components: {
            paging
        }
    }

</script>
