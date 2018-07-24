<template>
    <el-form class="list-box">
        <el-tabs v-model="activeName" type="card">
            <div class="list-body">
                <el-tab-pane label="IM客服" name="first">
                    <!-- <div class="list-header">
                        <el-form :inline="true" :model="query" size="small">
                            <el-form-item>
                                <el-input v-model="query.name" placeholder="请输入栏目名称"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-select v-model="query.is_show" placeholder="请输入栏目名称">
                                    <el-option key="-1" label="全部栏目" value="-1"></el-option>
                                    <el-option key="1" label="显示" value="1"></el-option>
                                    <el-option key="0" label="隐藏" value="0"></el-option>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="goRouter" icon="el-icon-search" :loading="loading">
                                    搜索
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <el-button icon="el-icon-plus" title="添加" size="mini" style="margin:0 0 15px 0;" @click="addColumnFn">添加栏目
                        </el-button>
                    </div> -->
                    <el-table :data="data" style="width: 100%" v-if="data.length" size="mini">
                        <el-table-column prop="id" label="头像">
                            <template slot-scope="scope">
                                <div v-if="scope.row.avatar">
                                    <img :src="scope.row.avatar" alt="头像" height="60" style="display:block">
                                </div>
                                <div v-else>
                                    <img src="https://icon.jiajuol.com/head1.png!c" alt="头像">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="nick" label="昵称"></el-table-column>
                        <el-table-column prop="username" label="用户名"></el-table-column>
                        <el-table-column prop="tel" label="电话"></el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-button @click="imLogin(scope.row.username)" title="登录" size="mini">登录</el-button>
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                    <empty :empty='!loading&&!data.length' :loading='loading'></empty>
                </el-tab-pane>
            </div>
        </el-tabs>
    </el-form>
</template>
<style scope lang='scss'>
   
</style>
<script>
    var _self
    export default {
        data() {
            return {
                activeName: 'first',
                loading:true,
                data:[]
            }
        },
        created() {
            _self = this;
            this.getData()
        },
        methods: {
            getData(){
                _self.$http.get('im/getcustomers')
                    .then(function (res) {
                        _self.loading = false;
                        if (res.codeFlag) {
                            _self.data = res.d;
                        }
                    })
            },
            imLogin(id){
                var winpop=window.open('','pop');
                winpop.document.write('<div style="width:370px;height:85px;border:solid 1px #ddd;margin:100px auto;text-align:center;line-height:85px;font-size:14px;color:#2b2b2b;background:#f8f8f8;">跳转中请稍后...</div>');
                _self.$http.get('im/gettoken?username='+id)
                    .then(function (res) {
                        if (res.codeFlag) {
                            window.open('https://im.jiajuol.com/login?expires_in='+res.d.expires_in+'&access_token='+res.d.access_token,'pop')
                        }else{
                            winpop.close();
                            _self.$message({
                                message: res.data.description,
                                type: 'warning'
                            });
                        }
                    })
            }
        }
    }
</script>
