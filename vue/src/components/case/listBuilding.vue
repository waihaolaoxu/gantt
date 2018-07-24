<template>
    <div>
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">楼盘列表</div>
                </div>
            </div>
        </div>
        <div class="list-box">
            <div class="list-body">
                <div class="list-header">
                    <el-button icon="el-icon-plus" title="添加楼盘" size="mini" style="margin:0 0 15px 0;" @click='$router.push({path:"add",query:{prevPath:$route.fullPath}})'>添加楼盘</el-button>
                </div>
                <el-table :data="data.list" style="width: 100%" size="mini" v-if='data.list.length'>
                    <el-table-column prop="id" label="ID">
                    </el-table-column>
                    <el-table-column label="封面图" align="center">
                        <template slot-scope="scope">
                            <div class="contain-body" style='width:100px;height:60px;margin:0 auto;'>
                                <img v-lazy="scope.row.cover?scope.row.cover+'!s':''" alt="" class="contain" v-if='scope.row.cover'>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="楼盘名">
                        <template slot-scope="scope">
                            <router-link class="a-hover" :to='{path:"add",query:{id:scope.row.id,prevPath:$route.fullPath}}'>{{scope.row.name}}</router-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="city" label="城市">
                    </el-table-column>
                    <el-table-column prop="add_date" label="添加时间">
                    </el-table-column>
                    <el-table-column prop="sort" label="排序值">
                    </el-table-column>
                    <el-table-column label="首页推荐" width="200">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.index_flag" active-color="#13ce66" inactive-color="#ccc"
                                active-text="" inactive-text="" active-value="1" inactive-value="0" @change="setStatus(scope.row)"> <!-- :disabled="scope.row.cover == null"-->
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button @click='$router.push({path:"add",query:{id:scope.row.id,prevPath:$route.fullPath}})' title="编辑" size="mini">编辑</el-button>
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
    var _self;
    export default {
        data() {
            return {
                disabledFlag: true,
                data: {
                    list: []
                },
                loading: true,
                query: {
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
            setStatus(obj) {
                console.log("修改状态", obj)
                if (!obj.cover) {
                    this.$message({
                        message: '请维护楼盘封面图片！',
                        type: 'warning'
                    });
                    this.getData();
                    return false;
                }
                var o = {
                    building_id: obj.building_id,
                    id: obj.id,
                    cover: obj.cover,
                    name: obj.name,
                    sort: obj.sort,
                    index_flag: obj.index_flag
                }
                _self.$http.post('building/update', o)
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.$message({
                                type: 'success',
                                message: '设置成功!'
                            });
                            _self.getData();
                        }
                    })
            },
            //添加楼盘
            addBuilding() {

            },
            getData() {
                _self.$http.get('building/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        _self.loading = false;
                        if (res.codeFlag) {
                            var d = res.data.data;
                            _self.data = d;
                            _self.data.list.forEach(function (v, i) {
                                v.index_flag = String(v.index_flag)
                            })
                        }
                    })
            },
            // 删除
            handleDelete(d) {
                this.$confirm('此操作将永久删除该楼盘, 是否继续?', '提示', _self.$.confirm).then(() => {
                    this.$http.get('building/delete', {
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
            init() { //进入页面需要的动作
                _self.getData();
            }

        },
        components: {
            paging
        }
    }

</script>
