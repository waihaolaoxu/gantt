<template>
    <div class="form-page">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">文章信息维护</div>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b">
            <el-form :model="query" :rules="rules" ref="query" label-width="130px" class="demo-ruleForm" size="medium">
                <el-form-item label="标题：" prop="title">
                    <el-input v-model="query.title" placeholder="请输入文章标题"></el-input>
                </el-form-item>
                <el-form-item label="栏目：" v-if="userInfoType">
                    <el-select v-model="query.column_id" placeholder="请选择文章栏目">
                        <el-option key="0" label="请选择栏目" :value="0">
                        </el-option>
                        <el-option v-for="item in columnData" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述：" prop="summary">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入描述"
                        v-model="query.summary">
                    </el-input>
                </el-form-item>
                <el-form-item label="来源：">
                    <el-input v-model="query.editor" placeholder="请输入来源"></el-input>
                </el-form-item>
                <el-form-item label="标签：">
                    <el-select
                        v-model="articleTag"
                        multiple
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入标签"
                        :remote-method="articleTagList"
                        :loading="loading"
                        style="width:100%"
                        >
                        <el-option
                        v-for="item in articleTagData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章内容：" prop="content">
                    <ueditor ref="ueditor" :start-value="startContent" :value='query.content' @input='input'></ueditor>
                </el-form-item>
                <el-form-item label="封面图：">
                    <el-upload class="avatar-uploader" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess" name='file'
                        :data='$.uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding">
                        <img v-if="query.titleimg" :src="query.titleimg+'!zs'" class="avatar cover">
                        <span v-if="query.titleimg" class="el-prompting">点击更换</span>
                        <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="排序：" prop="sort">
                    <el-input v-model.number="query.sort" placeholder="请输入排序"></el-input>
                </el-form-item>
                <el-form-item label="发布状态：" prop="status">
                    <el-radio v-model="query.status" label="yes">发布</el-radio>
                    <el-radio v-model="query.status" label="no">未发布</el-radio>
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    import Ueditor from "../block/ueditor.vue";
    import {
        uploadLoading
    } from '@/mixins/index';
    var _self;
    export default {
        mixins: [uploadLoading],
        data() {
            return {
                articleTag:[],
                list:'',
                loading:false,
                info:JSON.parse(this.$localStorage.get('userInfoM')).info,
                startContent: '',
                columnData:[],
                userInfoType: '',
                articleTagData:[],
                query: {
                    title: '',
                    column_id:'',
                    editor: '',
                    content: '',
                    titleimg: '',
                    sort: '',
                    status: "no",
                    summary:'',
                    
                    tags:''
                },
                rules: {
                    title: [{
                        required: true,
                        message: '文章标题不能为空',
                        trigger: 'blur,change'
                    }],
                    summary: [{
                        required: true,
                        message: '描述为空',
                        trigger: 'blur,change'
                    }],
                    sort: [{
                        required: true,
                        type: 'number',
                        message: '排序不能为空',
                        trigger: 'blur,change'
                    }],
                    content: [{
                        required: true,
                        message: '请填写频道内容',
                        trigger: 'blur,change'
                    }, {
                        validator: this.$.ueditor,
                        message: '请填写频道内容',
                        trigger: 'blur,change'
                    }],
                },


            };
        },
        created() {
            _self = this;
            _self.getDetail();
            this.userInfoType = JSON.parse(this.$localStorage.get('userInfoM')).info.has_site
            if(this.$route.query.id) {
                this.url = 'story/update'
            } else {
                this.url = 'story/create'
            }
            if((this.userInfoType)){
                this.getColumnData()
            }
            
        },
        methods: {
            //文章标签列表
            articleTagList(val){
                if (val !== '') {
                this.loading = true;
                _self.$http.get('tag/list', {
                    params: {
                        // id:this.query.id,
                        name:val
                    }
                })
                .then((res) =>{
                    if (res.data.code==1000) {
                        this.loading=false
                        this.articleTagData=res.data.data.list
                    }
                })
                
                // } else {
                // this.articleTagData = [];
                }else{
                    this.articleTagData = [];
                }
                
            },
            getDetail() {
                if (this.$route.query.id) {
                    // 编辑
                    _self.$http.get('story/info', {
                            params: {
                                id: _self.$route.query.id
                            }
                        })
                        .then(function (res) {
                            if (res.codeFlag) {
                                var d = res.data.data;
                               
                                if(d.tags.length>0){
                                     _self.articleTag=''
                                      _self.articleTagData =d.tags
                                    for(var i=0;i<d.tags.length;i++){
                                        if(i<d.tags.length-1){
                                            _self.articleTag+=d.tags[i].id+","
                                        }else{
                                            _self.articleTag+=d.tags[i].id
                                        }
                                        
                                        
                                    }
                                    _self.articleTag=_self.articleTag.split(',')
                                    for(var j=0;j<_self.articleTag.length;j++){
                                        _self.articleTag[j]=Number(_self.articleTag[j])
                                    }
                                }else{
                                    _self.articleTag=[]
                                }
                                _self.query = d;
                                 _self.startContent = d.content;
                            }
                        })
                }
            },
            // 获取栏目列表
            getColumnData(){
                this.$http.get('column/list', {
                        params: {
                            page: 1,
                            page_size: 0
                        }
                    })
                    .then(function (res) {
                        if (res.data.code == '1000') {
                            _self.columnData = res.data.data.list
                            console.log(_self.columnData)
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            submitForm(formName) {
                _self.query.tags=_self.articleTag.join(',')
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _self.$http.post(this.url, _self.query)
                            .then(function (res) {
                                if (res.codeFlag) {
                                    _self.$message({
                                        type: 'success',
                                        message: res.data.description
                                    });
                                    if(!_self.$route.query.id){
                                        _self.$back('/story/list');
                                    }
                                }
                            })
                    } else {
                        _self.$message({
                            message: '表单填写不完整',
                            type: 'warning'
                        });
                        return false;
                    }
                });
            },
            // 百度编辑器方法
            input(editorContent) {
                this.query.content = editorContent.content
            },
            //      上传
            handleAvatarSuccess(res, file) {
                this.query.titleimg = res.data[0].preview;
                this.uploadCloseLoding();
            },
        },
        components: {
            Ueditor
        }
    }

</script>
