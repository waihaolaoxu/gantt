<template>
<div class="list-box">
    <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
        <div class="el-tabs__header" style='border:none;'>
            <div role="tablist" class="el-tabs__nav">
                <div class="el-tabs__item fl is-active">{{$route.query.id?'编辑工程进度':'添加工程进度'}}</div>
            </div>
        </div>
    </div>
    <div class="wrapper bg-white b">
        <el-form :model="query" :rules="rules" ref="query" label-width="130px" class="demo-ruleForm"
                 size="medium">
            <el-form-item label="所属阶段：" prop="stage">
                <el-select v-model="query.stage" placeholder="请选择所属阶段">
                    <el-option
                        v-for="item in progressData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="施工日期：" prop="date">
                <el-date-picker
                    v-model="query.record_date"
                    type="date"
                    :editable="false"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择施工日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="工作描述：">
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="query.remark">
                </el-input>
            </el-form-item>

            <el-form-item label="上传实景图：" prop="cover">
                <el-upload :action="$.upload"
                           list-type="picture-card"
                           :on-preview="handlePictureCardPreview1"
                           :on-success="handleAvatarSuccess1"
                           :on-remove="handleRemove1"
                           multiple
                           name='file'
                           :data='imgs.uploadData'
                           :file-list="imgs.fileList"
                           :accept='$.accept'>
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="imgs.dialogVisible" size="tiny">
                    <img width="100%" v-if="imgs.dialogVisible" :src="imgs.dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('query')">提交</el-button>
                <el-button @click="cancleFn('query')">取消</el-button>
            </el-form-item>

        </el-form>
    </div>
</div>
</template>

<script>
    import {
        moreUpload
    } from '@/mixins/index';
    var _self;
    export default {
        data() {
            return {
                query: {
                    id:this.$route.query.progressId || '',
                    engineer_id: this.$route.query.id,
                    stage: '',
                    record_date: '2018-01-12',
                    remark: '',
                    cover: [],  //["src":"https://img.alicdn.com/tps/i4/TB1yYkwj26H8KJjy0FjSuuXepXa.jpg_1080x1800Q60s50.jpg","secret":""]
                    del_ids: ''
                },
                addUrl:'',
                progressData: [{
                    value: '10',
                    label: '开业大吉'
                }, {
                    value: '20',
                    label: '拆改阶段'
                }, {
                    value: '30',
                    label: '水电改造'
                }, {
                    value: '40',
                    label: '泥木工程'
                }, {
                    value: '50',
                    label: '油漆工程'
                }, {
                    value: '60',
                    label: '成品安装'
                }, {
                    value: '2000',
                    label: '交付工程'
                }],
                rules: {
                    stage: [
                        {required: true, message: '所属阶段不能为空', trigger: 'blur,change'}
                    ],
                    cover: [
                        {type: 'array', required: true, message: '实景图片不能为空', trigger: 'blur,change'}
                    ]
                }
            };
        },
        mixins: [moreUpload],
        watch: {
            'imgs.fileList'(v) {
                // console.log("监听v",v)
                // this.$refs.query.validateField('fileList');
            }
        },
        created(){
            _self = this
            var year = new Date().getFullYear()
            var month = new Date().getMonth() + 1
            var day = new Date().getDate()
            this.query.record_date = year + '-'+month + '-'+day

            if(this.$route.query.progressId) {
                this.getData();
            }
        },
        methods: {
            // 编辑获取详情
            getData(){
                this.$http.get('engineer/process/get',{
                    params: {
                        engineer_id: _self.$route.query.id,
                        id: _self.$route.query.progressId
                    }
                })
                    .then(function(res){
                        console.log("详情：",res.data.data)
                        _self.query.stage = String(res.data.data.stage);
                        if(res.data.data.record_date !== '0000-00-00 00:00:00'){
                            _self.query.record_date = res.data.data.record_date;
                        }
                        _self.query.remark = res.data.data.remark;

                        if (res.data.data.photos.length) {
                            res.data.data.photos.forEach((v,i)=>{
                                var obj = {}; 
                                obj.url = v.photo_url_l;
                                obj.id = v.id;
                                obj.secret = v.secret;
                                _self.imgs.fileList.push(obj)
                            })
                            _self.query.cover =  _self.imgs.fileList;
                        }
                    })
            },
            submitForm(formName) {    
                var that = this;
                if(this.$route.query.progressId) {
                    this.addUrl = 'engineer/process/update'
                } else {
                    this.addUrl = 'engineer/process/create'
                }    
                if (this.imgs.del_ids.length) {
                    this.query.del_ids = this.imgs.del_ids.toString()
                } 
                // var submitCover = []
                // that.imgs.fileList.forEach(function(val,key){
                //     console.log(val,key)
                //     var obj = new Object();
                //     obj.src = val.url;
                //     obj.secret = val.secret;
                //     obj.id = val.id;
                //     submitCover.push(obj);
                // })

                // that.$set(that.query,'cover',submitCover)
                console.log('img data:',that.query.cover)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.$set(that.query,'cover',JSON.stringify(that.query.cover))
                        that.$http.post(that.addUrl,that.query)
                            .then(function(res){
                                if(res.data.code == '1000') {
                                    that.$back();
                                }
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            cancleFn(formName) {
                this.$back();
            },
            // 上传成功
        handleAvatarSuccess1(res, file) {
            var that = this;
            this.imgs.dialogVisible = false;
            res.data.forEach(function (v, i) {
                that.imgs.fileList.push({
                    url: v.preview,
                    id: 0,
                    secret: v.secret
                })
            })
            var submitCover = []
            that.imgs.fileList.forEach(function(val,key){
                console.log(val,key)
                var obj = new Object();
                obj.src = val.url;
                obj.secret = val.secret;
                obj.id = val.id;
                submitCover.push(obj);
            })
            that.$set(that.query,'cover',submitCover)       
            this.$refs.query.validateField('cover');
        }
        }
    }
</script>
