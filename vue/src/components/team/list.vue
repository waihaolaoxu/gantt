<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">帐号管理</div>
                </div>
            </div>
        </div>
        <div class="list-body">
            <div class="list-header">
                <el-button icon="el-icon-plus" title="添加" size="mini" style="margin-bottom:15px;" @click="addArticleFn">添加帐号
                </el-button>
            </div>
            <el-table :data="data" style="width: 100%" size="mini" v-if='data.length'>
                <el-table-column prop="id" label="ID">
                </el-table-column>
                <el-table-column label="头像">
                    <template slot-scope="scope">
                        <div class="cover-body" style='width:80px;height:80px;'>
                            <img v-lazy="scope.row.imgfile?scope.row.imgfile+'!zmm':$.head" alt="" class="cover">
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="昵称">
                    <template slot-scope="scope">
                        <span>{{scope.row.nickname}}</span>
                        <span v-if="scope.row.is_admin == 1">(管理员)</span>
                        <span v-else>(成员)</span>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机">
                </el-table-column>
                <el-table-column prop="position" label="职位">
                </el-table-column>
                <el-table-column label="禁用帐号" width="200">
                    <!--<template slot-scope="scope">
                        <div v-if="scope.row.is_show == 1">
                            显示
                        </div>
                        <div v-else>
                            隐藏
                        </div>
                    </template>-->
                    <template slot-scope="scope">
                        <!--<el-switch
                            v-model="scope.row.is_show"
                            active-text="解禁"
                            inactive-text="禁用"
                        >
                        </el-switch>-->
                        <el-switch v-if="$.userInfo.info.admin_user_id != scope.row.id" v-model="scope.row.is_show" active-color="#13ce66" inactive-color="#ccc"
                            active-text="" inactive-text="" active-value="0" inactive-value="1" @change="setStatus(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button @click="handleEdit(scope.row)" title="编辑" size="mini">编辑</el-button>
                            <!--<el-button @click="setStatus(scope.row)" title="禁用" size="mini" v-show='$.userInfo.info.admin_user_id != scope.row.id' v-if='scope.row.is_show==1'>禁用</el-button>
                            <el-button @click="setStatus(scope.row)" title="解禁" size="mini" v-else v-show='$.userInfo.info.admin_user_id != scope.row.id'>解禁</el-button>
                            <el-button @click="setStatus(scope.row,'admin')" v-show='$.userInfo.info.admin_user_id != scope.row.id' title="解除管理员" size="mini" v-if='scope.row.is_admin==1'>解除管理员</el-button>
                            <el-button @click="setStatus(scope.row,'admin')" v-show='$.userInfo.info.admin_user_id != scope.row.id' title="改为管理员" size="mini" v-else>设成管理员</el-button>-->
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <empty :empty='!loading&&!data.length' :loading='loading'></empty>
            <paging :query='query' :total='data.total' v-if='data.total'></paging>
        </div>
    </div>
</template>

<script>
    import paging from '@/components/block/paging';
    var _self;
    export default {
        data() {
            return {
                data: {
                    list: []
                },
                loading: true,
                query: {
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                },
            }
        },
        created() {
            _self = this;
            this.getData()
        },
        methods: {
            setStatus(obj) {
                console.log("修改状态", obj.is_show, )
                var o = {
                    id: obj.id,
                    is_show: obj.is_show
                }
                _self.$http.post('team/member/set', {
                        group: JSON.stringify([o])
                    })
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
            // setStatus(obj, type) {
            //     var obj = _self.$.extend({}, obj);
            //     var admin = obj.is_admin,
            //         show = obj.is_show;
            //     if (type) { //admin 修改admin
            //         admin = admin == 1 ? 0 : 1;
            //     } else {
            //         show = show == 1 ? 0 : 1;
            //     }
            //     var o = {
            //         id: obj.id,
            //         is_admin: admin,
            //         is_show: show
            //     }
            //     _self.$http.post('team/member/set', {
            //             group: JSON.stringify([o])
            //         })
            //         .then(function (res) {
            //             if (res.codeFlag) {
            //                 _self.$message({
            //                     type: 'success',
            //                     message: '设置成功!'
            //                 });
            //                 _self.getData();
            //             }
            //         })
            // },
            getData() {
                _self.$http.get('team/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        _self.loading = false;
                        if (res.codeFlag) {
                            var d = res.data.data.list;
                            _self.data = d;
                            console.log(_self.data)
                            _self.data.forEach(function (v, i) {
                                v.is_show = String(v.is_show)
                            })
                        }
                    })
            },
            addArticleFn() {
                this.$router.push({
                    path: 'save',
                    query: {
                        prevPath: _self.$route.fullPath
                    }
                });
            },
            // 编辑
            handleEdit(row) {
                this.$router.push({
                    path: 'save',
                    query: {
                        id: row.id,
                        prevPath: _self.$route.fullPath
                    }
                });
            },
        },
        components: {
            paging
        }
    }

</script>
