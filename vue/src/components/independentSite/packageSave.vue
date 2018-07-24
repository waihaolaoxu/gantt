<template>
    <div class="form-page">
        <edit-title></edit-title>
        <div class="wrapper bg-white b">
            <el-form :model="query" :rules="rules" ref="query" label-width="130px" class="demo-ruleForm" size="medium">
                <el-form-item label="名称：" prop="name" label-width="100px">
                    <el-input v-model="query.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item label="简介：" prop="intro" label-width="100px">
                    <el-input type="textarea" v-model="query.intro" :rows="10" placeholder="简介："></el-input>
                </el-form-item>
                <el-form-item label="封面：" label-width="100px" prop="cover">
                    <el-upload class="avatar-uploader" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess" name='file'
                        :data='uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar cover">
                        <span v-if="imageUrl" class="el-prompting">点击更换</span>
                        <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                    </el-upload>
                    <p class="el-prompting">图片尺寸：600*340</p>
                </el-form-item>
                 <el-form-item label="排序值：" prop='sort' label-width="100px">
                    <el-input type='number' v-model.number="query.sort" min='0' placeholder="请输入排序值"></el-input>
                </el-form-item>
                <el-form-item label="是否显示：" prop="is_show" label-width="100px">
                    <el-radio v-model="query.is_show" :label="1">是</el-radio>
                    <el-radio v-model="query.is_show" :label="0">否</el-radio>
                </el-form-item>
                <el-form-item label-width="100px">
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    import {
        uploadLoading
    } from '@/mixins/index';
    import editTitle from './packageTitle';
    // import Ueditor from "../block/ueditor.vue";
    var _self;
    export default {
        data() {
            return {
                id: this.$route.query.id,
                t: this.$route.query.id ? "修改" : "添加",
                startContent: '',
                loading: false,
                uploadData: {
                    module: 'store',
                    type: 'image'
                },
                imageUrl: '',
                query: {
                    id: this.$route.query.id ? Number(this.$route.query.id) : '',
                    is_show: 1,
                    sort: 0,
                    infto: '',
                },
                themeData: [],
                rules: {
                    name: [{
                        required: true,
                        message: '请填写名称',
                        trigger: 'blur,change'
                    }],
                    sort: [{
                        validator: this.$.v.positive,
                        trigger: 'blur,change',
                        type: 'number'
                    }],
                    intro: [{
                        required: true,
                        message: '请填写内容',
                        trigger: 'blur,change'
                    }],
                    cover: [{
                        required: true,
                        message: '请上传封面图',
                        trigger: 'blur,change'
                    }],
                }
            };
        },
        created() {
            _self = this;
            if (_self.id) {
                this.getInfo();
            }
        },
        mixins: [uploadLoading],
        methods: {
            getInfo() {
                _self.$http.get('package/info', {
                        params: {
                            id: _self.id
                        }
                    })
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.query = res.d;
                            _self.imageUrl = res.d.cover ? res.d.cover + '!m' : "";
                            // _self.startContent = res.d.content;
                        }
                    })
            },
            submitForm(formName) {
                _self.$refs[formName].validate((valid) => {
                    if (valid) {
                        _self.$http.post(`package/${_self.id?"update":"create"}`, _self.query)
                            .then(function (res) {

                                if (res.codeFlag) {
                                    if (!_self.id) {
                                        _self.$back('list')
                                    }
                                    _self.$message({
                                        message: _self.id ? "修改成功！" : "添加成功！",
                                        type: 'success'
                                    });
                                }
                            })
                    }
                })
            },
            // 百度编辑器方法
            input(editorContent) {
                this.query.content = editorContent.content
            },
            handleAvatarSuccess(res, file) {
                this.query.cover = res.data[0].preview;
                this.imageUrl = URL.createObjectURL(file.raw);
                this.uploadCloseLoding();
                this.$refs.query.validateField('cover');
            },
        },
        components: {
            // Ueditor,
            editTitle

        }
    }

</script>
