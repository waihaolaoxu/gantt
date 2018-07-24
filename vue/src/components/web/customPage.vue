<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">自定义列表</div>
                </div>
            </div>
        </div>
        <div class="list-body">
            <div class="list-header">
                <el-form :inline="true" :model="query" size="small">
                    <el-form-item>
                        <el-select v-model="query.page_type_id" placeholder="请选择页面类型" @change="pageStyles">
                            <el-option v-for="item in columnData" :key="item.page_type_id" :label="item.name" :value="item.page_type_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item>
                        <el-button type="primary" @click="goRouter()" icon="el-icon-search" :loading="loading">
                            查询
                        </el-button>
                    </el-form-item> -->
                </el-form>
                <el-button v-if="styles" icon="el-icon-plus" title="添加" size="mini" style="margin-bottom:15px;"  @click="addPage()">添加{{pageName}}
                </el-button>
            </div>
            <el-table :data="data.list" style="width: 100%" size="mini" v-if='data.list.length'>
                <el-table-column label="页面名称" prop="name" width="350">
                </el-table-column>
                <el-table-column prop="des" label="页面描述">
                </el-table-column>
                <el-table-column label="显示状态">
                  <template slot-scope="scope">
                        <div v-if="scope.row.is_show">
                            显示
                        </div>
                        <div v-else>
                            不显示
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button @click="handleEdit(scope.row)" title="编辑" size="mini">编辑</el-button>
                            <el-button @click="handleCustom(scope.row)" title="自定义" size="mini">自定义</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <empty :empty='!loading&&!data.list.length' :loading='loading'></empty>
            <paging :query='query' :total='data.total' v-if='data.total'></paging>
        </div>
        <el-dialog :title="this.pageId?'修改':'添加'" :visible.sync="centerDialogVisible" width="50%">
            <el-form :model="query" :rules="rules" ref="query" label-width="100px" class="demo-ruleForm dialogCenter"
                     size="medium">
           
            <el-form-item label="页面名称：" class="line" prop="name">
                <el-input v-model="query.name" placeholder="请输入页面名称"></el-input>
            </el-form-item>
            <el-form-item label="页面描述：" class="line" prop="des">
                <el-input v-model="query.des" placeholder="请输入页面描述"></el-input>
            </el-form-item>
            <el-form-item label="显示状态：" class="line" prop="is_show">
               <el-select v-model="query.is_show" placeholder="请选择">
                        <el-option v-for="(item,index) in pageStatus" :key="index" :label="item.name" :value="item.id"></el-option>
                      </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCustomInfo('query')">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    
</template>
<style scope lang='scss'>
.el-dialog{
    min-width: 520px;
    max-width:800px;
}
.el-form-item__content{
    margin-left: 0 !important;
    width:90%;
}
  .dialogCenter{
    width:100%;
    .line{
      display: flex;
      margin-bottom:30px;
      align-items: center;
      &:last-child{
        margin-bottom:0px;
      }
    }
    .el-input__inner{
      width:100%;
    }
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
                is_show1:'',
                columnInd:"",
                data: {
                    list: []
                },
                styles:false,
                pageName:'',
                pageStatus:[
                  {
                    name:"显示",
                    id:'1'
                  },
                  {
                    name:"不显示",
                    id:'2'
                  }
                ],
                rules:{
                     name: [
                        {required: true, message: '请输入页面名称', trigger: 'blur'},
                    ],
                    is_show: [
                        {required: true, message: '请选择显示状态', trigger: 'blur'},
                    ],
                },
                pageId:'',
                centerDialogVisible:false,
                columnData:[],
                loading: true,
                total: 0, // 当前列表的条数
                userInfoType:'',
                query: {
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                    // name: this.$route.query.name ? this.$route.query.name : '',
                    // is_show: this.$route.query.is_show ? this.$route.query.is_show : '',
                    page_type_id:'',
                    page_type_id1:'',
                    is_show:'',
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
            
            // this.getData()
            this.userInfoType = JSON.parse(this.$localStorage.get('userInfoM')).info.has_site
            // if(this.userInfoType != 0){
                this.getpageStyle()
            // }

        },
        methods: {
            pageStyles(val){
                this.loading=true
                this.columnInd=val
                this.columnData[val-1].type==2?this.styles=true:this.styles=false
                this.pageName=this.columnData[val-1].name
                this.getData(val)
               
            },
          //查询
            // goRouter(){
            //   this.getData()
            // },
            //获取页面列表
            getData(val) {
                _self.$http.get('custompage/list',{
                  params: this.query
                }).then(function (res) {
                        _self.loading=false
                        if (res.codeFlag) {
                            var d = res.data.data;
                            _self.data.list = d;
                            // if(val!='aa'){
                            //    _self.data.list=[]
                            // }
                            if(_self.columnData[val-1]){
                                if(_self.columnData[val-1].type==1 && !_self.data.list.length){
                                    _self.styles=true
                                }
                            }
                        }
                    })
            },
            // 获取页面类型列表
            getpageStyle(){
                this.$http.get('custompage/typelist')
                    .then(function (res) {
                      _self.loading = false;
                        if (res.data.code == '1000') {
                            _self.columnData = res.data.data
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            //添加自定义
            addPage(){
              this.centerDialogVisible = true;
              this.query.name=""
              this.query.des=''
              this.query.is_show=''
              this.pageId=''
            },
            addCustomInfo(query){
                // console.log(this.query.is_show)
                this.query.is_show==2?this.is_show1=0:this.is_show1=1
                this.$refs[query].validate((valid) => {
                    if(valid){
                        
                    this.$http.post('custompage/save',{
                    
                        page_id:this.pageId?this.pageId:0,
                        page_type_id:this.query.page_type_id,
                        name:this.query.name,
                        des:this.query.des?this.query.des:'',
                        is_show:this.is_show1,
                    
                    })
                        .then(function (res) {
                           
                            if (res.data.code == '1000') {
                            _self.centerDialogVisible = false
                                _self.$message({
                                    type:'success',
                                    message: _self.pageId?'修改成功':'添加成功'
                                });
                                 if(_self.columnData[_self.columnInd-1].type==1){
                                    _self.styles=false
                                }
                                _self.getData(_self.columnInd)
                            }
                            
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    }
                })
            },
       
           
            // 编辑
            handleEdit(row) {
              this.$http.get('custompage/info',{
                params:{
                  page_id:row.page_id,
                  page_type_id:row.page_type_id,
                }
              
              })
                .then((res) =>{
                    if (res.data.code == '1000') {
                      this.centerDialogVisible = true
                      this.pageId=row.page_id
                      res.data.data.page_type_id1=res.data.data.page_type_id
                      this.query=res.data.data
                      this.query.is_show==0?this.query.is_show='2':this.query.is_show='1'
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
              

            },
            handleCustom(val){
              this.$router.push({path:'customDrag',query:{page_type_id:val.page_type_id,page_id:val.page_id,name:val.name}})
            }
          
        },
        components: {
            paging
        }
    }

</script>


