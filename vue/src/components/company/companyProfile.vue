<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">公司简介</div>
                </div>
            </div>
        </div>
        <div class="list-body">
            <el-form :model="query" :rules="rules" ref="query" label-width="100px" class="demo-ruleForm" size="medium">
                <el-form-item label="宣传图片：" prop="company_banner">
                    <el-upload class="avatar-uploader" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess1" name='file'
                        :data='$.uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding1">
                        <img v-if="query.company_banner" :src="query.company_banner+'!mm'" class="avatar cover">
                        <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                    </el-upload>
                    <p class="el-prompting">请上传4：3比例图片</p>
                    <p class="el-prompting">文件格式GIF、JPG、JPEG、PNG，文件大小200K以内，建议尺寸至少800PX*600PX</p>
                </el-form-item>
                <el-form-item label="公司介绍：" prop="company_description">
                    <el-input type="textarea" v-model="query.company_description" :rows="10" :maxlength="1000" placeholder="公司介绍限制在1000个字符以内"></el-input>
                </el-form-item>
                <el-form-item label="量房：" prop="company_amount">
                    <el-input type="textarea" v-model="query.company_amount" :rows="10" :maxlength="255" placeholder="量房限制在255个字符以内"></el-input>
                </el-form-item>
                <el-form-item label="设计：" prop="company_design">
                    <el-input type="textarea" v-model="query.company_design" :rows="10" :maxlength="255" placeholder="设计限制在255个字符以内"></el-input>
                </el-form-item>
                <el-form-item label="材料：" prop="company_material">
                    <el-input type="textarea" v-model="query.company_material" :rows="10" :maxlength="255" placeholder="材料限制在255个字符以内"></el-input>
                </el-form-item>
                <el-form-item label="施工：" prop="company_construct">
                    <el-input type="textarea" v-model="query.company_construct" :rows="10" :maxlength="255" placeholder="施工限制在255个字符以内"></el-input>
                </el-form-item>
                <el-form-item label="验收：" prop="company_inspected">
                    <el-input type="textarea" v-model="query.company_inspected" :rows="10" :maxlength="255" placeholder="验收限制在255个字符以内"></el-input>
                </el-form-item>
                <el-form-item label="售后：" prop="company_service">
                    <el-input type="textarea" v-model="query.company_service" :rows="10" :maxlength="255" placeholder="售后限制在255个字符以内"></el-input>
                </el-form-item>
                <el-form-item label="荣誉资质：" required="">
                    <el-upload :action="$.upload" name='file' :data='$.uploadData' list-type="picture-card" :show-file-list="true" multiple :on-remove="handleRemove"
                        :before-upload="beforeAvatarUploadLoding2" :on-success="handleAvatarSuccess" :file-list="imgs.fileList"
                        :on-preview="handlePictureCardPreview2"
                        :accept='$.accept' limi='20' :on-exceed='exceed'>
                        <i class="el-icon-plus" :class='{"text-danger":imgFlag}'></i>
                    </el-upload>
                    <el-dialog :visible.sync="imgs.dialogVisible">
                        <img width="100%" :src="imgs.dialogImageUrl" alt="">
                    </el-dialog>
                    <p class="el-prompting">图片张数1-20张，文件格式GIF、JPG、JPEG，文件大小500K以内，建议尺寸800PX*600PX</p>
                </el-form-item>
                <div class="el-form-item__error" v-if='imgFlag'>
                    请上传图片
                </div>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<style lang='scss'>
    .el-upload-list__item-preview {
        // display: none !important;
    }

</style>

<script>
    var _self;
    var uLoading;
    import {
        uploadLoading
    } from '@/mixins/index';
    export default {
        mixins: [uploadLoading],
        data() {
            return {
                isUpload: true,
                submit: false,
                query: {
                    company_banner: '',
                    company_description: '',
                    company_amount: '',
                    company_design: '',
                    company_material: '',
                    company_construct: "",
                    company_inspected: "",
                    company_service: "",
                    company_honour: []
                },
                rules: {
                    company_banner: [{
                            required: true,
                            message: '请上传公司宣传图片',
                            trigger: 'blur'
                        },

                    ],
                    company_description: [{
                            required: true,
                            message: '公司介绍不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 1000,
                            message: '长度在1000个字符以内',
                            trigger: 'blur'
                        }
                    ],
                    company_amount: [{
                            required: true,
                            message: '量房不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 255,
                            message: '长度在255个字符以内',
                            trigger: 'blur'
                        }
                    ],
                    company_design: [{
                            required: true,
                            message: '设计不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 255,
                            message: '设计在255个字符以内',
                            trigger: 'blur'
                        }
                    ],
                    company_material: [{
                            required: true,
                            message: '材料不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 255,
                            message: '材料在255个字符以内',
                            trigger: 'blur'
                        }
                    ],
                    company_construct: [{
                            required: true,
                            message: '请填写施工不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 255,
                            message: '施工在255个字符以内',
                            trigger: 'blur'
                        }
                    ],
                    company_inspected: [{
                            required: true,
                            message: '请输入验收不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 255,
                            message: '验收在255个字符以内',
                            trigger: 'blur'
                        }
                    ],
                    company_service: [{
                            required: true,
                            message: '售后不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 255,
                            message: '售后在255个字符以内',
                            trigger: 'blur'
                        }
                    ],
                    img: [{
                        required: true,
                        message: '请上传图片',
                        trigger: 'blur,change'
                    }],
                },
                imgs: {
                    fileList: [],
                    only: {
                        url: '',
                        path: '',
                    },
                    dialogVisible: false,
                    dialogImageUrl: '',
                },
            };
        },
        created() {
            _self = this;
            this.getData()
        },
        computed: {
            imgFlag() {
                var flag = false;
                if (this.submit) {
                    console.log(this.imgs)
                    if (!this.imgs.fileList.length) {
                        flag = true;
                    }
                }
                return flag;
            }
        },
        methods: {
            getData() {
                this.$http.get('desc')
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.query = res.d;
                            var arr = [];
                            res.d.company_honour.forEach(o => {
                                arr.push({
                                    name: '',
                                    url: 'https://i.jiajuol.com' + o.real_path,
                                    response: {
                                        data: [{
                                            file: o.real_path
                                        }]
                                    }
                                })
                                // arr.push({
                                //     real_path: o.response.data[0].file,
                                //     full_path: o.response.data[0].preview
                                // })
                            })
                            console.log(arr);
                            _self.imgs.fileList = arr;
                        }
                        // if (res.data.code == '1000') {
                        //     for (let key in _self.query) {
                        //         for (let key1 in res.data.data) {
                        //             if (key == key1 && key != 'sort' && res.data.data[key1]) {
                        //                 _self.query[key] = res.data.data[key1]
                        //                 break;
                        //             }
                        //         }
                        //     }
                        //     var arr = [];
                        //     res.data.data.company_honour.forEach(o => {
                        //         arr.push({
                        //             name: '',
                        //             url: o.full_path,
                        //             response: {
                        //                 data: {
                        //                     path: o.full_path
                        //                 }
                        //             }
                        //         })
                        //     })
                        //     this.imgs.fileList = arr;
                        // }
                    });
            },
            submitForm(formName) {
                // console.log(this.query)
                var _self = this;
                this.submit = true;
                var arr = [];
                console.log(1111, this.imgs.fileList)

                this.imgs.fileList.forEach(o => {
                    arr.push(o.response.data[0].file);

                    // arr.push({
                    //     real_path: o.response.data[0].file,
                    //     full_path: o.response.data[0].preview
                    // })
                })
                this.query.company_honour = arr;
                this.$refs[formName].validate((valid) => {
                    if (valid && !this.imgFlag) {
                        this.$http.post('desc/update', this.query)
                            .then(function (res) {
                                if (res.data.code == '1000') {
                                    _self.$message({
                                        message: '公司信息修改成功',
                                        type: 'success'
                                    });
                                }
                            })
                            .catch(function (error) {
                                console.log('error')
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
            beforeAvatarUploadLoding1(file) {
                return this.beforeAvatarUploadLoding(file, {
                    m: 0.2,
                    mfont: '200k'
                })
            },
            beforeAvatarUploadLoding2(file) {
                return this.beforeAvatarUploadLoding(file, {
                    m: 0.5,
                    mfont: '500k'
                })
            },
            handlePictureCardPreview2(file) {
                this.imgs.dialogImageUrl = file.url;
                this.imgs.dialogVisible = true;
            },
            handleAvatarSuccess1(res, file) {
                this.query.company_banner = res.data[0].preview;
                // this.imageUrl = URL.createObjectURL(file.raw);
                this.uploadCloseLoding();
            },
            //  上传
            handleAvatarSuccess(res, file, fileList) {
                this.submit = false;
                // this.imageUrl = URL.createObjectURL(file.raw);
                this.imgs.fileList = fileList;
                if (fileList.length >= 20) {
                    this.isUpload = false
                }
                this.uploadCloseLoding();
            },
            exceed() {
                this.$message({
                    message: '上传不能大于20张',
                    type: 'error'
                });
            },
            // 删除图片
            handleRemove(file, fileList) {
                this.imgs.fileList = fileList;
                if (fileList.length < 20) {
                    this.isUpload = true
                }
            }
        }
    }

</script>
