<template>
    <el-form class="list-box">
        <el-tabs v-model="activeName2" type="card">
            <div class="list-body">
                <el-tab-pane label="自定义列表" name="first">
                    <div class="list-header">
                        <!--<el-form :inline="true" :model="query" size="small">
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
                        </el-form>-->
                        <el-button icon="el-icon-plus" title="添加" size="mini" style="margin:0 0 15px 0;" @click="addCustomFn">添加自定义站点
                        </el-button>
                    </div>
                    <el-table :data="data" style="width: 100%" v-if="data.length" size="mini">
                        <el-table-column prop="id" label="ID">
                        </el-table-column>

                        <el-table-column prop="name" label="栏目名称">
                        </el-table-column>
                        <el-table-column prop="is_show" width="200" label="状态">

                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-button @click="editColumnFn(scope.row.id)" title="编辑" size="mini">编辑</el-button>
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                    <empty :empty='!loading&&!data.length' :loading='loading'></empty>
                    <paging :query='query' :total='total'></paging>
                </el-tab-pane>
            </div>
        </el-tabs>
    </el-form>
</template>
<style scope lang='scss'>
    .marginL {
        margin-left: 5px;
    }
    .closeImg{
        width:40px;
        height:40px;
        color: #fff;
        z-index:20;
        right:20px;
        top:20px;
        font-size: 20px;
        border-radius: 50%;
        background-color: rgba(0,0,0,0.5);
        box-shadow: 0 0 5px rgba(255,255,255,0.3);
        cursor: pointer;
    }
    .slide-scale-enter,
    .slide-scale-leave-to {
        transform: scale(0.5);
        opacity: 0;
    }

    .tran {
        transition: all 0.3s;
    }

    .progressW{
        display:inline-block;
        border-radius:5px;
        padding:0 5px;
        color:#fff;
        margin-bottom:10px;
    }
    .bigImgs {
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 9999;
        .el-carousel__arrow {
            background-color: rgba(0, 0, 0, 0.5) !important;
        }
        .el-carousel__container {
            width: 100%;
            height: 100%;
        }
    }

</style>
<script>
    import paging from '@/components/block/paging';
    import {
        pagingEvent
    } from '@/mixins/index';
    var _self
    export default {
        data() {
            return {
                activeName2: 'first',
                data: [],
                loading: true,
                total: 0, // 当前列表的条数
                query: {
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                }
            }
        },
        mixins: [pagingEvent],
        created() {
            _self = this;
            this.getData()
        },
        methods: {
            getData() {
                var _self = this;
                this.$http.get('page/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        _self.data = res.data.data.list
                        _self.total = res.data.data.total
                        _self.loading = false;

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            // 编辑栏目
            editColumnFn(id){
                this.$router.push({'path': 'addCustom',query:{id: id}})
            },
            // 添加自定义按钮
            addCustomFn(){
                this.$router.push({'path': 'addCustom'})
            }
        },
        components: {
            paging,
        }
    }

</script>
