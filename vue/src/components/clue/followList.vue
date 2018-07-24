<template>
    <div>

        <el-table :data="tebleDatas" style="width: 100%" size="mini">
            <el-table-column label="ID" width='80'>
                <template slot-scope="scope">
                    {{scope.row.id}}
                    <i style="width:8px;height:8px;border-radius:50%;background:#cd5542;display:inline-block;" v-if="scope.row.status == 0"></i>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="联系人">
            </el-table-column>
            <el-table-column label="联系方式" width='200'>
                <template slot-scope="scope">
                    {{scope.row.phone}}
                    <router-link :to="'/clue/clueDetail?apply_id='+ scope.row.apply_id +'&resource='+scope.row.source_type" tag="a">
                        <span style="display:inline-block;padding:0 10px;background:#e9eff1;border-radius:9px;margin-left:15px;" class="f12 a-hover">
                            <i class="iconfont icon-ren f12"></i> 跟进</span>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column label="城市">
                <template slot-scope="scope">
                    {{scope.row.cityname}}
                </template>
            </el-table-column>
            <el-table-column label="跟进" width="450">
                <template slot-scope="scope">
                    <p>{{scope.row.follow_user}} {{scope.row.last_date}}</p>
                    <p>{{scope.row.last_deal_des}}</p>
                    <p :class="{'color-red' : scope.row.next_deal_status == 1}" v-if="scope.row.next_deal_date">回访时间：{{scope.row.next_deal_date}}</p>
                    <div class="img over radius5 pr mt10 mr3" v-for='(item1,index1) in scope.row.pic' :key='index1' v-if="scope.row.pic.length" style="float:left;">
                        <div style="width: 30px;height: 30px;" v-if="item1.full_small_url">
                            <img v-lazy="item1.full_small_url" class="full cover zero pa pointer" alt="" @click='imgBig(scope.row.pic,index1)' style="width: 30px;height: 30px;">
                            <div class="pa full flex-box middle text-white f16 zero event-none" style='background:rgba(0,0,0,0.3);' v-if='index1==6'>共{{scope.row.pic.length}}张</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="重要度" width='120'>
                <template slot-scope="scope">
                    <i class="el-icon-star-on color-red" v-for="i in scope.row.degree"></i>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width='120'>
                <template slot-scope="scope">
                    <div v-if="scope.row.status == 0" class="color-red">未跟进</div>
                    <div v-if="scope.row.status == 1">跟进中</div>
                    <div v-if="scope.row.status == 2">已成交</div>
                    <div v-if="scope.row.status == 3">废单</div>
                </template>
            </el-table-column>
            <el-table-column label="小区/面积/预算">
                <template slot-scope="scope">
                    <div v-if="scope.row.community">小区：{{scope.row.community}}</div>
                    <div v-if="scope.row.specific_area != 0">面积：{{scope.row.specific_area}}㎡</div>
                    <div v-if="scope.row.decorate_specific_money != 0">预算：{{scope.row.decorate_specific_money}}元</div>
                </template>
            </el-table-column>
            <el-table-column prop="source_apply_date" label="时间"></el-table-column>
            <el-table-column label="操作" :width='$route.query.type==2?200:80'>
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button @click="handleDelete(scope.row)" size="mini" v-if="$route.query.type==2">删除</el-button>
                        <el-button @click="openUsers(scope.row)" title="转移" size="mini">转移</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="团队成员" :visible.sync="dialogTableVisible">
            <empty :empty='!loading&&!gridData.list.length' :loading='loading' :showLoading='true'></empty>
            <el-table :data="gridData.list" v-if='gridData.list.length&&!loading'>
                <el-table-column label="头像">
                    <template slot-scope="scope">
                        <div class="cover-body" style='width:40px;height:40px;'>
                            <img v-lazy="scope.row.imgfile?scope.row.imgfile+'!zmm':$.head" alt="" class="cover">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column property="nickname" label="昵称"></el-table-column>
                <el-table-column property="position" label="职位"></el-table-column>
                <el-table-column label="操作" width='100'>
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button @click="choose(scope.row)" title="选择" size="mini">选择</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <paging :query='query' :total='gridData.total' v-on:getData='getUsers' v-if='gridData.total'></paging>
        </el-dialog>
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

<script>
    import paging from '@/components/block/paging1';
    var _self;
    export default {
        data() {
            return {
                dialogTableVisible: false,
                loading: true,
                gridData: {
                    list: [],
                },
                imgs: {
                    list: [],
                    show: false,
                    now: 0,
                },
                first: true,
                query: {
                    page: 1,
                    page_size: 5,
                    type: 'crm'
                },
                transform_id: '',
            }
        },
        props: ['tebleDatas', 'totals'],
        created() {
            _self = this;
        },
        methods: {
            openUsers(row) {
                _self.dialogTableVisible = true;
                _self.transform_id = row.id;
                if (_self.first) {
                    _self.getUsers(_self.query);
                }
            },
            getUsers(obj) {
                _self.loading = true;
                _self.$http.get('team/option/list', {
                        params: obj
                    })
                    .then(function (res) {
                        _self.first = false;
                        _self.loading = false;
                        if (res.codeFlag) {
                            _self.gridData = res.d;
                        }
                    })

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
            choose(row) {
                this.$confirm('确定要转移给该用户吗, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('clue/transform', {
                        userid: row.id,
                        transform_id: _self.transform_id
                    }).then(res => {
                        if (res.codeFlag) {
                            this.$message({
                                type: 'success',
                                message: '转移成功!'
                            });
                            _self.$.reload();
                        }
                    })
                }).catch(() => {

                });
            },
            handleDelete(row) {
                var _self = this;
                this.$confirm('此操作将永久删除该线索, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.get('clue/self/delete', {
                        params: {
                            id: row.id
                        }
                    }).then(res => {
                        if (res.codeFlag) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            _self.$.reload();
                        }
                    })
                }).catch(() => {

                });
            }
        },
        components: {
            paging
        }
    }

</script>
