<template>
    <div>
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <span class="is-active el-tabs__item fl">工地动态</span>
                </div>
            </div>
        </div>
        <div class="list-box bg-white">
            <div class="list-body no-border-top">
                <div class="pd5" v-if='data.list.length'>
                    <ul class="process-list process-list-noborder pd-l10 pr f14">
                        <li class="dateList pr hoverable" v-for='(item,index) in data.list' :key='index'><!--:class="{'showDate': index ==0 || data.list[index].create_date != data.list[index-1].create_date}"-->
                            <!-- <div v-if="index ==0 || data.list[index].create_date != data.list[index-1].create_date">{{item.create_date}}</div> -->
                            <div class="person">
                                <div class="flex-box middle-a">
                                    <div style="width:50px;height:50px;">
                                        <img :src="item.imgfile" class="headerImg" v-if="item.imgfile">
                                    </div>
                                    <div class="ml15">
                                        <div v-if="item.name">
                                            <span v-if="item.name">{{item.name}}</span>
                                            <!-- <span v-if="item.position" style="padding: 0 10px;background: #ff8d00;color: #fff;border-radius: 5px;margin-left: 5px;font-size:12px;">{{item.position}}</span> -->
                                        </div>
                                        <div v-if="item.record_date" class="text-sub f12">施工时间：{{item.record_date}}</div>
                                    </div>
                                </div>
                                <div class="ml65">
                                    <div v-if="item.remark">{{item.remark}}</div>
                                    <el-row :gutter="10">
                                        <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6" v-for='(item1,index1) in item.photos' :key='index1' v-if='index1<8'>
                                            <div class="img over radius5 pr mt10">
                                                <img v-lazy="item1.full_small_url" class="full cover zero pa pointer" alt="" @click='imgBig(item.photos,index1)'>
                                                <div class="pa full flex-box middle text-white f16 zero event-none" style='background:rgba(0,0,0,0.3);' v-if='index1==7'>共{{item.photos.length}}张</div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <div class="flex-box flex-between pd-r30 mt15">
                                        <div class="text-sub">
                                            <p class="text-title f14" v-if="item.engineer_title">
                                                {{item.engineer_title}}
                                            </p>
                                            <div  class="text-title f12 mt5" v-if="item.sub_title">
                                                <span>{{item.sub_title}}</span><span class="ml15">{{item.create_date}}</span>
                                            </div>
                                        </div>
                                        <div v-if="item.stage" style="padding: 0 10px;background:rgb(233, 239, 241);color:#3C8DBF;border-radius:3px;font-size:12px;line-height:24px;height:24px;">{{item.stage}}</div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <empty :empty='!loading&&!data.list.length' :loading='loading'></empty>
                <paging :query='query' :total='data.total'></paging>
            </div>
        </div>
        <transition name='slide-scale'>
            <el-carousel :autoplay='false' arrow="always" class="pf zero full bigImgs tran" v-if='imgs.show' :initial-index='imgs.now'>
                <span class="no-select pa closeImg flex-box middle" @click='closeImg'>X</span>
                <el-carousel-item v-for="(item,index) in imgs.list" :key="index">
                    <div class="flex-box full middle">
                        <img v-lazy="item.full_big_url" class="full" alt="" style="object-fit:contain;background-color:transparent!important;">
                    </div>
                </el-carousel-item>
            </el-carousel>
        </transition>
    </div>
</template>
<style>
    .autoInput input {
        opacity: 0;
        height: 45px !important;
        margin-top: 10px;
    }

    .search-head .el-form-item__content {
        display: flex;
        align-items: center;
    }

    .autoInput input:focus {
        opacity: 1;
        box-shadow: 0 20px #fff, 0 -20px #fff;
    }

</style>
<style scoped>
.headerImg{
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
</style>

<script>
    import paging from '@/components/block/paging';
    import {
        pagingEvent
    } from '@/mixins/index';
    var _self;
    export default {
        data() {
            return {
                d: {

                },
                imgs: {
                    list: [],
                    show: false,
                    now: 0,
                },
                data: {
                    info: {
                        balance: ''
                    },
                    list: []
                },
                loading: true,
                query: {
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                    engineer_id: this.$route.query.engineer_id || '',
                },
            }
        },
        mixins: [pagingEvent],
        computed: {},
        created() {
            _self = this;
            _self.getData();
            if (_self.query.engineer_id) {
                _self.getEngineer();
            }
        },
        methods: {
            getEngineer() {
                this.$http.get(`common/engineer/info`, {
                        params: {
                            engineer_id: _self.query.engineer_id
                        }
                    })
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.d = res.d;
                        }
                    });
            },
            closeImg() {
                this.imgs.show = false;
            },
            imgBig(obj, index) {
                if (obj) {
                    this.imgs.list = obj;
                    this.imgs.show = true;
                    this.imgs.now = index;
                }
            },
            getData() {
                _self.$http.get('engineer/process/dynamic/list', { //
                        params: _self.query
                    })
                    .then(function (res) {
                        _self.loading = false;
                        if (res.codeFlag) {
                            _self.data = res.d;
                            console.log('d', _self.data.list)
                            // if(_self.data.list.length) {
                            //     var listData = [];
                            //     _self.data.list.forEach(function(v,i) {
                            //         console.log(v,i)
                            //     });

                            //     for(let i=0;i<listData.length;i++) {
                            //         for(let j=0;j<_self.data.list.length;j++) {
                            //             if (listData[i].time != _self.data.list[j].record_date) {
                            //                 var obj = {
                            //                     time: _self.data.list[j].record_date,
                            //                     data: []
                            //                 }
                            //             }
                            //         }
                            //     }
                            // }

                        }
                    })
            },
            querySearchAsync(queryString, cb) {
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
            handleSelect(item) {
                this.query.engineer_id = item.id;
                this.d = item;
            },
            handleDelete(d) {
                _self.$confirm('此操作将永久删除该记录, 是否继续?', '提示', _self.$.confirm).then(() => {
                    _self.$http.get('engineer/capital/delete', {
                        params: {
                            id: d.id,
                            engineer_id: d.engineer_id
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
                })
            },
        },
        components: {
            paging
        }
    }

</script>
