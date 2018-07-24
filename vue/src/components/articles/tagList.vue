<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">标签列表</div>
                </div>
            </div>
        </div>
        <div class="list-body">
            <div class="list-header">
                <el-form :inline="true" :model="query" size="small">
                    <el-form-item>
                        <el-input v-model="query.name" placeholder="请输入标签名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="goRouter" icon="el-icon-search" :loading="loading">
                            查询
                        </el-button>
                    </el-form-item>
                </el-form>
                <el-button icon="el-icon-plus" title="添加" size="mini" style="margin-bottom:15px;" @click="addTag()">添加标签
                </el-button>
            </div>
            <el-table :data="data.list" style="width: 100%" size="mini" v-if='data.list.length'>
                <el-table-column label="ID" prop="id">
                </el-table-column>
                <el-table-column prop="name" label="标签名称">
                </el-table-column>
                
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button @click="tagEdit(scope.row)" title="修改" size="mini">修改</el-button>
                            <el-button @click="handleDelete(scope.row)" title="删除" size="mini">删除</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <empty :empty='!loading&&!data.list.length' :loading='loading'></empty>
            <paging :query='query' :total='data.total' v-if='data.total'></paging>
        </div>
        <el-dialog
          :title="editId?'修改标签':'添加标签'"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
            <!-- <el-table-column prop="tagName" label="TAG名称" size="small"> -->
                标签名称：<el-input  style="width:50%" v-model="query.tagName" placeholder="请输入标签名称"></el-input>
            <!-- </el-table-column> -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="tagCreated()">确 定</el-button>
          </span>
        </el-dialog>
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
                info:JSON.parse(this.$localStorage.get('userInfoM')).info,
                data: {
                    list: []
                },
                editId:'',
                dialogVisible:false,
                columnData:[],
                loading: true,
                total: 0, // 当前列表的条数
                userInfoType:'',
                query: {
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                    name: this.$route.query.name ? this.$route.query.name : '',

                },
                statusData: [{
                    value: 'yes',
                    label: '发布'
                }, {
                    value: 'no',
                    label: '未发布'
                }],
                value: ''
            }
        },
        mixins: [pagingEvent],
        created() {
            _self = this;
            this.getData()
            // this.userInfoType = JSON.parse(this.$localStorage.get('userInfoM')).info.has_site
            

        },
        methods: {
            addTag(){
                this.dialogVisible = true
                this.query.tagName=""
            },
            //创建标签
            tagCreated(){
               const data={}
               data.name=this.query.tagName
               if(this.editId){
                   data.id=this.editId
               }else{
                   data.company_id=this.info.company_id
               }
                this.$http.post('tag/create', data)
                    .then((res)=> {
                        // alert(0)
                        if (res.codeFlag) {
                            this.dialogVisible=false
                            _self.$message({
                                    type: 'success',
                                    message: res.data.description
                                });
                             this.getData()
                        }
                    })
            },
            //修改标签
            tagEdit(val){
                // console.log(val)
                this.dialogVisible=true
                this.editId=val.id
                this.query.tagName=val.name
            },
          handleClose(done) {
            this.dialogVisible=false
          },
          //列表
            getData() {
                _self.$http.get('tag/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        _self.loading = false;
                        if (res.codeFlag) {
                            var d = res.data.data;
                            _self.data = d;
                        }
                    })
            },
            // 删除
            handleDelete(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.$http.post('tag/delete', {
                        // params: {
                            id: row.id,
                            company_id:this.info.company_id,
                        // }
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


            formatter(row, column) {
                return row.address;
            },
        },
        components: {
            paging
        }
    }

</script>
