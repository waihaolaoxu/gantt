<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">自定义模块</div>
                </div>
            </div>
        </div>
        <div class="list-body">
            <div class="box">
                <div class="modulePool mr30">
            <div class="tit">模块池</div>
            <div class="modulePoolBox">
              <draggable :list="list2" :move="getdata" @update="datadragEnd1" :options="{handle:'.dargDiv',group:{'name':'abox',put:['abox','bbox'],pull:pullFn}}" style="min-height:400px;">
                <transition-group name="list-complete" style=" display:block;min-height:400px;">
                    <div v-for="(item,index) in list2" :key="index" ref="canList"  class="canList list-complete-item" :class="[groupInd.indexOf(item.group_id)!=-1?'disdargDiv':item.data_type==1?'dataType dargDiv':'dargDiv']">
                        <span class="pull-left"></span>
                        <div class="styleclass ellipsis">{{item.name}} <span class="text-sub f13">{{item.des}}</span></div>
                       <i @click="imgView(item.preview_img)" class="el-icon-view view"></i>
                    </div>
                </transition-group>
              </draggable>
            </div>
            
          </div>
            
            <div class="modulePool indexPool">
            <div class="tit">{{$route.query.name}} <span class="text-title fr pointer" @click="imgView1()">预览</span></div>
            <div class="modulePoolBox">
              <draggable :list="list3" @update="datadragEnd2" :options="{handle:'.dargDiv1',group:{'name':'abox',put:['abox','bbox'],pull:true}}" style="min-height:400px;">
                <transition-group name="list-complete" style=" display:block;min-height:400px;">
                    
                    <div v-for="(item,index) in list3" :key="index"  class="dargDiv1 list-complete-item canList1">
                        <span class="pull-left"></span>
                        <div class="styleclass ellipsis" :class="[item.data_type?'styleclassr':'']">{{item.name}} <span class="text-sub f13">{{item.des}}</span></div>
                        <el-button v-if="item.data_type" type="primary" class="editBtn" @click="editModule(index)">录入数据</el-button>
                       <i @click="imgView(item.preview_img)" class="el-icon-view view"></i>
                    </div>
                </transition-group>
              </draggable>
            </div>
            
          </div>
            </div>
          
            <div class="btn"><button @click="addCustomerData()">保存</button></div>
            <!-- <empty :empty='!loading&&!data.list.length' :loading='loading'></empty> -->
            <!-- <paging :query='query' :total='data.total' v-if='data.total'></paging> -->
        </div>
        <!-- 主模块 -->
        <div class="editModuleBox">
            <el-dialog
            :visible.sync="editModuleStatus"
            center>
                <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm dialogCenter"
                     size="medium">
           
                    <el-form-item label="title：" class="line" prop="title">
                        <el-input v-model="ruleForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="sub_title：" class="line" prop="sub_title">
                        <el-input v-model="ruleForm.sub_title"></el-input>
                    </el-form-item>
                    <el-form-item label="des：" class="line" prop="des">
                        <el-input v-model="ruleForm.des"></el-input>
                    </el-form-item>
                    <el-form-item label="text：" class="line" prop="text">
                        <el-input v-model="ruleForm.text"></el-input>
                    </el-form-item>
                    <el-form-item label="url：" class="line" prop="url">
                        <el-input v-model="ruleForm.url"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="img：" class="line" prop="img">
                        <el-input v-model="ruleForm.img"></el-input>
                    </el-form-item> -->
                    <el-form-item label="img：" prop="qrcode">
                        <el-upload :action="$.upload"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview1"
                            :on-success="handleAvatarSuccess1"
                            :on-remove="handleRemove1" multiple name='file'
                            :data='uploadData'
                            :file-list="fileList1"
                            :before-upload="beforeAvatarUploadLodingerweima"
                            :on-exceed="handleExceed"
                            :accept='$.accept'>
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog class="imgBg" :visible.sync="dialogVisible1" append-to-body>
                            <img width="100%" :src="dialogImageUrl1" alt="">
                        </el-dialog>
                    </el-form-item>

                     <el-form-item  label="tag：" class="line" prop="tag">
                        <span class="pd-r10" v-if="ruleForm.tag.length!=0" v-for="(tagItem,index)  in ruleForm.tag" :key="index">{{tagItem.name}}
                            <i class="el-icon-circle-close-outline pointer" @click="closeTag(index)"></i>
                        </span>
                    </el-form-item>
                    <el-form-item class="line pd-l80" prop="tag">
                        name：<el-input style="width:80%" v-model="tagArr.name"></el-input><br>
                        url：<el-input style="width:80%;margin-top:10px;margin-left:20px;" v-model="tagArr.url"></el-input>
                        <el-button type="primary" class=" addm" @click="addTag()">添 加</el-button>
                    </el-form-item>

                    <el-form-item label="extfield1：" class="line" prop="extfield1">
                        <el-input v-model="ruleForm.extfield1"></el-input>
                    </el-form-item>
                    <el-form-item label="extfield2：" class="line" prop="extfield2">
                        <el-input v-model="ruleForm.extfield2"></el-input>
                    </el-form-item>
                    <el-form-item label="extfield3：" class="line" prop="extfield3">
                        <el-input v-model="ruleForm.extfield3"></el-input>
                    </el-form-item>
                    <el-form-item label="extfield4：" class="line" prop="extfield4">
                        <el-input v-model="ruleForm.extfield4"></el-input>
                    </el-form-item>
                    <el-form-item label="extfield5：" class="line" prop="extfield5">
                        <el-input v-model="ruleForm.extfield5"></el-input>
                    </el-form-item>
                    <el-form-item label="extfield6：" class="line" prop="extfield6">
                        <el-input v-model="ruleForm.extfield6"></el-input>
                    </el-form-item>
                    <el-form-item label="子模块：">
                        <el-button type="primary" icon="el-icon-plus" @click="addItem()"></el-button>
                    </el-form-item>
                    <el-form-item class="flex" :label="'子模块'+(index+1)+':'" v-if="ruleForm.item.length!=0" v-for="(ruleitem,index) in ruleForm.item" :key="index">
                        <span class="pd-r15 ellipsis">{{ruleitem.title}}</span>
                        <el-button-group>
                            <el-button type="primary" @click="editItem(index)" icon="el-icon-edit"></el-button>
                            <el-button type="danger" @click="delItem(index)" icon="el-icon-delete"></el-button>
                        </el-button-group>
                    </el-form-item>
                </el-form>
                
                
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editModuleStatus = false">取 消</el-button>
                    <el-button type="primary" @click="editTure()">确 定</el-button>
                </span>
            </el-dialog>
        </div>

        <!-- 子模块 -->
        <div class="editModuleBox">
            <el-dialog :visible.sync="addItemStatus">
                <div class="additem">
                        <el-form :model="itemsValue" ref="itemsValue" label-width="100px" class="demo-ruleForm demo-ruleForm1 dialogCenter"
                        size="medium">
            
                        <el-form-item label="title：" class="line" prop="title">
                        <el-input v-model="itemsValue.title"></el-input>
                    </el-form-item>
                    <el-form-item label="sub_title：" class="line" prop="sub_title">
                        <el-input v-model="itemsValue.sub_title"></el-input>
                    </el-form-item>
                    <el-form-item label="des：" class="line" prop="des">
                        <el-input v-model="itemsValue.des"></el-input>
                    </el-form-item>
                    <el-form-item label="text：" class="line" prop="text">
                        <el-input v-model="itemsValue.text"></el-input>
                    </el-form-item>
                    <el-form-item label="url：" class="line" prop="url">
                        <el-input v-model="itemsValue.url"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="img：" class="line" prop="img">
                        <el-input v-model="itemsValue.img"></el-input>
                    </el-form-item> -->
                    <el-form-item label="img：" prop="qrcode">
                        <el-upload :action="$.upload"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview2"
                            :on-success="handleAvatarSuccess2"
                            :on-remove="handleRemove2" multiple name='file'
                            :data='uploadData'
                            :file-list="fileList2"
                            :before-upload="beforeAvatarUploadLodingerweima"
                            :on-exceed="handleExceed"
                            :accept='$.accept'>
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog class="imgBg" :visible.sync="dialogVisible2" append-to-body>
                            <img width="100%" :src="dialogImageUrl2" alt="">
                        </el-dialog>
                    </el-form-item>
                    
                    <el-form-item  label="tag：" class="line" prop="tag">
                        <span class="pd-r10" v-if="itemsValue.tag.length!=0" v-for="(tagItems,i)  in itemsValue.tag" :key="i">{{tagItems.name}}
                            <i class="el-icon-circle-close-outline pointer" @click="closeTag1(i)"></i>
                        </span>
                    </el-form-item>
                    <el-form-item class="line pd-l80" prop="tag">
                        name：<el-input style="width:80%" v-model="tagArr1.name"></el-input><br>
                        url：<el-input style="width:80%;margin-top:10px;margin-left:20px;" v-model="tagArr1.url"></el-input>
                        <el-button type="primary" class=" addm" @click="addTag1()">添 加</el-button>
                    </el-form-item>
                    <el-form-item label="extfield1：" class="line" prop="extfield1">
                        <el-input v-model="itemsValue.extfield1"></el-input>
                    </el-form-item>
                    <el-form-item label="extfield2：" class="line" prop="extfield2">
                        <el-input v-model="itemsValue.extfield2"></el-input>
                    </el-form-item>
                    <el-form-item label="extfield3：" class="line" prop="extfield3">
                        <el-input v-model="itemsValue.extfield3"></el-input>
                    </el-form-item>
                    <el-form-item label="extfield4：" class="line" prop="extfield4">
                        <el-input v-model="itemsValue.extfield4"></el-input>
                    </el-form-item>
                    <el-form-item label="extfield5：" class="line" prop="extfield5">
                        <el-input v-model="itemsValue.extfield5"></el-input>
                    </el-form-item>
                    <el-form-item label="extfield6：" class="line" prop="extfield6">
                        <el-input v-model="itemsValue.extfield6"></el-input>
                    </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer footer1">
                        <el-button @click="cancel()">取 消</el-button>
                        <el-button type="primary" @click="itemDeter()">确 定</el-button>
                    </span>
                    </div>
            </el-dialog>
        </div>
        <div class="imgViewBox">
            <el-dialog
            :visible.sync="imgViewStatus"
            center>
                <img  :src="viewSrc" alt="">
            </el-dialog>
        </div>
        <div class="imgViewBox1 imgViewBox">
            <el-dialog
            :visible.sync="imgViewStatus1"
            center>
                <img v-for="(item,index) in yulanarr" :key="index" :src="item" alt="">
                <!-- <img  :src="viewSrc" alt=""> -->
            </el-dialog>
        </div>
        
        
    </div>
    
</template>
<style scope lang='scss'>
.footer1{
    margin: 40px auto;
    display: block;
    text-align: center;
}
.imgBg{
    .el-dialog__header,.el-dialog__body{
        padding:0;
    }
    .el-dialog{
        background: none;
    }
}
.el-dialog__headerbtn{
    z-index: 999;
}
.disdargDiv{
    background:#eee !important;
    cursor:not-allowed;
}
.flex{
    display:flex;;
}
.addm{
    margin-top:15px;
    margin-left:38%;
}
.box{
  display: flex;
}

.editBtn{
    position: absolute;
    right: 44px;
    top: 6px;
}
.editModuleBox{
    .el-form-item__content{
        width:100%;
        margin-left: 0 !important;
    }
}
.imgViewBox{
    
    
    .el-dialog{
        background:none;
        width:100%;
        box-shadow:0 0 0 ;
        margin-top:0 !important;
        position: absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        margin:auto;
        .el-dialog__close {
            color: #ccc;
            font-size: 24px;
        }
    
        img{
            position: absolute;
            top:0;
            bottom:0;
            left:0;
            right:0;
            display: block;
            margin:auto;
            max-width: 100%;
        }
    }
    .el-dialog--center .el-dialog__body{
        text-align: center;
        // position: absolute;
        // top:0;
        // bottom:0;
        // left:0;
        // right:0;
        // margin:auto;
    }
    .el-dialog__body,.el-dialog__header{
        padding:0 !important;
        
    }
}
.imgViewBox1{
     .el-dialog{
         img{
            position: relative;
        }
     }
}
.loadImg{
    .el-dialog{
        margin:30px auto;
    }
    img{
        max-width: 90%;
    }
    
}
.el-textarea__inner{
        max-height: 145px !important;
        min-height: 145px !important;
    }
.btn{
    width:100%;
    border-top:1px solid #edf1f2;
    button{
        width:54px;
        height:34px;
        background-color: #428bca;
        color:#fff;
        border:0;
        margin: 10px auto 0;
        display: block;
        cursor: pointer;
    }
}
.modulePool{
  width:25%;
  box-sizing: border-box;
  margin-bottom:20px;
}
.pull-left:after {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #98a6ad;
    content: "";
    position: absolute;    
    width: 0;
    top:25px;
}
.view{
    position: absolute;
    top:18px;
    right:15px;
    cursor: pointer;
}
.pull-left:before {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #98a6ad;
    content: "";
    position: absolute;    
    width: 0;
    top:18px;
}
.modulePoolBox{
  padding:15px;
  border:1px solid #d6e9c6;
}

.tit{
  padding:15px;
  color: #3c763d;
  background-color: #dff0d8;
  border-color: #d6e9c6;
}
.indexPool{
    width:75%;
    border-color:#bce8f1;
    .modulePoolBox{
        border-color:#bce8f1
    }
    .tit{
        color: #31708f;
        background-color: #d9edf7;
        border-color: #bce8f1;
    }
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
.list-complete-item {
//   transition: all 1s;
    padding-left: 15px;
    display:flex; 
    height:52px;
    align-items: center;
    background: #fff;
    color:#333;
    border:1px solid #edf1f2;
    margin-bottom:5px;
    position: relative;
    box-sizing: border-box;
    &:last-child{
         margin-bottom:0px;
    }
}
.styleclass{
    margin-right:40px;
    margin-left: 20px;
}
.styleclassr{
    margin-right:159px; 
}
.list-complete-enter, .list-complete-leave-active {
  opacity: 0;
  height: 0px;
  margin-top: 0px;
  padding: 0px;
  border: solid 0px;
}
.list-complete-sortable-chosen,.list-complete-sortable-ghost{
 opacity: 0;
  height: 0px;
  margin-top: 0px;
  padding: 0px;
  border: solid 0px;
}
.dargDiv{
    cursor:move;
    width: 100%;
    height:100%;
    line-height: 52px;
}
.dargDiv1{
    cursor:move;
    width: 100%;
    height:100%;
    line-height: 52px;
}
p{
    line-height:24px;
    text-align:center;
}
@media screen and (max-width: 1100px) {
    .box{
        flex-direction: column;
    }
    .modulePool{
        width:100%;
    }
}

</style>

<script>
import draggable from 'vuedraggable'
import sortable  from 'sortablejs'
    import paging from '@/components/block/paging';
    import {
        pagingEvent
    } from '@/mixins/index';
    import {
        limitUpload
    } from '@/mixins/index';
    var _self;
    export default {
        data() {
            return {
                
                dialogVisible2: false,
                fileList2: [],
                dialogImageUrl2: "",
                qrcode1:"",

                groupInd:[],
                resem:[],
                foot_preview_img:'',
                head_preview_img:'',
                yulanarr:[],
                yulan:false,
                addItemStatus:false,
                editIndex:"",
                limit:3,
                imgViewStatus:false,
                imgViewStatus1:false,
                editModuleStatus:false,
                editAcInd:false,
                
                data: {
                    list: []
                },
                viewSrc:'',
                list2:[],
                list3:[],
                pageStatus:[
                  {
                    name:"显示",
                    id:1
                  },
                  {
                    name:"不显示",
                    id:0
                  }
                ],
                // ruleForm:{
                //     qrcode:''
                // },
                tagArr:{name:'',url:''},
                tagArr1:{name:'',url:''},
                pageId:'',
                centerDialogVisible:false,
                columnData:[],
                loading: true,
                total: 0, // 当前列表的条数
                userInfoType:'',
                ruleForm:{
                    version:"",
                    title:'',
                    sub_title:'',
                    des:'',
                    text:'',
                    url:'',
                    img:'',
                    tag:[
                    ],
                    extfield1:'',
                    extfield2:'',
                    extfield3:'',
                    extfield4:'',
                    extfield5:'',
                    extfield6:'',
                    item:[]
                },
                itemsValue:{
                    title:'',
                    sub_title:'',
                    des:'',
                    text:'',
                    url:'',
                    img:'',
                    tag:[
                    ],
                    extfield1:'',
                    extfield2:'',
                    extfield3:'',
                    extfield4:'',
                    extfield5:'',
                    extfield6:'',
                },
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
        mixins: [pagingEvent,limitUpload],
        
        created() {
          
            _self = this;
            this.poolList()
            // this.getData()
           

        },
        methods: {
        pullFn(val){
            var cloneBg=arguments[2].className.indexOf('dataType ')!=-1?'clone':true
            return cloneBg
        },
            handlePictureCardPreview2(file) {
                this.dialogImageUrl2 = file.url;
                this.dialogVisible2 = true;
            },
            // 上传图片成功回调
        handleAvatarSuccess2(res, file) {
            this.uploadCloseLoding();
            var that = this;
            this.dialogVisible2 = false;
            var v = res.data[0];
            var n = that.fileList2.length - 1;
            if(n<0){
                n=0;
            } else {
                n = that.fileList2.length;
            }
            this.fileList2[n] = {
                url: v.preview
            };
            that.qrcode1 = [];
            this.fileList2.forEach(function(v,i){
                that.qrcode1.push(v.url)
            })
        },
        // 删除图片
        handleRemove2(file, fileList) {
            var that = this;
            this.fileList2 = this.fileList2.filter(function(v,i){
                if (file.name) {
                    return v.url != file.response.data[0].preview
                } else {
                    return v.url != file.url
                }
                // return v.url != file.url
            })
            if(this.qrcode1){
                this.qrcode1 = this.qrcode1.filter(function(v,i){
                    if (file.name) {
                        return v != file.response.data[0].preview
                    } else {
                        return v != file.url
                    }
                })
            }
            
        },
        //最后保存
        addCustomerData(){
            // console.log(this.list3=JSON.stringify(this.list3).replace(/\"/g,"'"))
            var arr=[]
            
            for(var i=0;i<this.list3.length;i++){
                var obj={}
                obj.id=this.list3[i].id?this.list3[i].id:0
                obj.block_id=this.list3[i].block_id
                obj.data=this.list3[i].data?this.list3[i].data:""
                arr.push(obj)
                
            }
            this.$http.post('custompage/saveblock',{
                page_type_id:this.$route.query.page_type_id,
                custom_page_id:this.$route.query.page_id,
                data:JSON.stringify(arr)
            })
            .then(function (res) {
                _self.loading = false;
                if (res.data.code == '1000') {
                    _self.$message({
                        type:'success',
                        message: res.data.description
                    });
                    // _self.poolList()
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        //添加主模块
        editTure(){
            
            if(this.fileList1.length>0){
                this.ruleForm.img=[]
                for(var i=0;i<this.fileList1.length;i++){
                    this.ruleForm.img.push(this.fileList1[i].url)
                }
                this.ruleForm.img=this.ruleForm.img.join(',')
            }
            
            _self.list3[this.editIndex].data=this.ruleForm
            this.editModuleStatus = false

        },
        //确认添加子模块
        itemDeter(){
            if(this.fileList2.length>0){
                this.itemsValue.img=[]
                for(var i=0;i<this.fileList2.length;i++){
                    this.itemsValue.img.push(this.fileList2[i].url)
                }
                this.itemsValue.img=this.itemsValue.img.join(',')
            }
            var b=JSON.stringify(this.itemsValue)
            this.addItemStatus=false
            if(this.editAcInd===0){
                this.editAcInd='actin'
            }
            if(this.editAcInd){
               if(this.editAcInd=='actin'){
                   this.editAcInd=0
               }
                this.ruleForm.item[this.editAcInd]=JSON.parse(b)
            }else{
                this.ruleForm.item.push(JSON.parse(b))
            }
            
            // console.log(this.ruleForm)
            this.editAcInd=false
        },
        //关闭子模块
        cancel(){
            this.addItemStatus=false
        },
        //添加子模块
        addItem(){
            // alert(0)
           this.addItemStatus=true
            //    this.itemsValue={}
            
            this.itemsValue.title=''
            this.itemsValue.sub_title=''
            this.itemsValue.des=''
            this.itemsValue.text=''
            this.itemsValue.url=''
            this.itemsValue.img=''
            this.itemsValue.tag=[]
            this.itemsValue.extfield1=''
            this.itemsValue.extfield2=''
            this.itemsValue.extfield3=''
            this.itemsValue.extfield4=''
            this.itemsValue.extfield5=''
            this.itemsValue.extfield6=''
                
            //    this.fileList1=[]
        },
        //编辑子模块
        editItem(i){
            this.editAcInd=i
            this.itemsValue=this.ruleForm.item[i]
            if(this.itemsValue.img){
                this.itemsValue.img=this.itemsValue.img.split(",")
                for(var i=0;i<this.itemsValue.img.length;i++){
                    var obj={}
                    obj.url=this.itemsValue.img[i]
                    this.fileList2.push(obj)
                }
            }
            this.addItemStatus=true
        },
        //添加主Tag
        addTag(){
            var b
            b=JSON.stringify(this.tagArr) 
            this.ruleForm.tag.push(JSON.parse(b))
            this.tagArr.name=''
            this.tagArr.url=''
        },
        //添加子Tag
        addTag1(){
            // console.log(this.tagArr1)
            // console.log(this.itemsValue)
            var a
            a=JSON.stringify(this.tagArr1) 
            this.itemsValue.tag.push(JSON.parse(a))
            this.tagArr1.name=''
            this.tagArr1.url=''
        },
        //删除主Tag
        closeTag(i){
            this.ruleForm.tag.splice(i,1)
        },
        //删除子Tag
        closeTag1(i){
            this.itemsValue.tag.splice(i,1)
            
        },
        //删除子模块
        delItem(i){
            this.ruleForm.item.splice(i,1)
        },
         
      
      //录入模块
      editModule(val){
        //   this.$router.push({path:'addCustomer'})
          this.editModuleStatus=true

           
         
          this.editIndex=val
          if(this.list3[val].data){
              this.poolList()
              this.ruleForm=this.list3[val].data
          
          }else{
               this.ruleForm.version="",
                this.ruleForm.title='',
                this.ruleForm.sub_title='',
                this.ruleForm.des='',
                this.ruleForm.text='',
                this.ruleForm.url='',
                this.ruleForm.img='',
                this.ruleForm.tag=[],
                this.ruleForm.extfield1='',
                this.ruleForm.extfield2='',
                this.ruleForm.extfield3='',
                this.ruleForm.extfield4='',
                this.ruleForm.extfield5='',
                this.ruleForm.extfield6='',
                this.ruleForm.item=[]
          }
          
      },
        //图片预览
        imgView(viewSrc){
            this.imgViewStatus=true
                this.viewSrc=viewSrc
           
            
        },
        imgView1(viewSrc){
            this.imgViewStatus1=true
            this.yulanarr.push(_self.head_preview_img)
            for(var i=0;i<_self.list3.length;i++){
                this.yulanarr.push(_self.list3[i].preview_img)
            }
            this.yulanarr.push(_self.foot_preview_img)
          
            
        },
        datadragEnd1:function(evt){
         
      },
      datadragEnd2:function(evt){
         
      },
         getdata: function(evt){
            //  console.log(evt)
        },
        //去重
        heavy(arr1){
            // var canList=document.getElementsByClassName("canList")
            var result = []
            var arr2=this.list3
            var obj={}
            var result = arr1.filter(function(item1) {
                return _self.list3.every(function(item2) {
                    return (item2.block_id !== item1.block_id)+item1.data_type
                })
            })
            this.list2=result
            //禁用
            var result1 = this.list2.filter(function(item1,index) {
                return _self.list3.every(function(item2) {
                    if(item2.group_id === item1.group_id){
                        if(!item1.data_type){
                            _self.groupInd.push(item1.group_id)
                        }
                    }
                    return item2.group_id !== item1.group_id
                })
            })
        },
        
        //获取模块池列表
        poolList(){
            this.$http.get('custompage/blocklist',{
                params:{
                page_type_id:this.$route.query.page_type_id
            }
            })
                .then((resem) =>{
                    _self.loading = false;
                    
                    if (resem.data.code == '1000') {
                        this.resem=resem
                        var arr1=[]
                        for(var i=0;i<_self.resem.data.data.length;i++){
                            for(var j=0;j<_self.resem.data.data[i].child_block.length;j++){
                                arr1.push(_self.resem.data.data[i].child_block[j])
                                
                            }
                        }
                        this.$http.get('custompage/blockinfo',{
                            params:{
                            page_type_id:this.$route.query.page_type_id,
                            id:this.$route.query.page_id
                        }
                        })
                            .then((res) =>{
                                if (res.data.code == '1000') {
                                    
                                    _self.list3 = res.data.data.list
                                    _self.head_preview_img=res.data.data.head_preview_img
                                    _self.foot_preview_img=res.data.data.foot_preview_img
                                    _self.heavy(arr1)
                                    

                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        
                            
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
           
          
        },
        watch:{
            list2(){
                _self.groupInd=[]
                var result1 = this.list2.filter(function(item1,index) {
                return _self.list3.every(function(item2) {
                    if(item2.group_id === item1.group_id){
                        if(!item1.data_type){
                            _self.groupInd.push(item1.group_id)
                        }
                    }
                    return item2.group_id !== item1.group_id
                })
            })
            }
        },
        components: {
            paging,
            draggable,
            sortable
        }
    }

</script>
