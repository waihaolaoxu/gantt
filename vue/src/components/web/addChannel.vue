<template>
    <div class="form-page">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">添加频道</div>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b">
            <el-form :model="query" :rules="rules" ref="query" label-width="130px" class="demo-ruleForm" size="medium">
                <el-form-item label="频道名称：" prop="name">
                    <el-input v-model="query.name" placeholder="请输入频道名称"></el-input>
                </el-form-item>
                <el-form-item label="排序：" prop="sort">
                    <el-input v-model.number="query.sort" placeholder="请输入排序"></el-input>
                </el-form-item>
                <el-form-item label="频道内容：" prop="content">
                    <ueditor ref="ueditor" :start-value="startContent" :value='query.content' @input='input'></ueditor>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                    <el-button @click="resetForm('query')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Ueditor from "../block/ueditor.vue";
    var _self;
    export default {
        data() {
            return {
                startContent: '',
                value: '',
                config: {
                    toolbars: [
                        [
                            'source', //源代码
                            'undo', //撤销
                            'redo', //重做
                            'bold', //加粗
                            'fontsize', //字号
                            'insertimage', //多图上传
                            // 'link', //超链接
                            // 'unlink', //取消链接
                            'insertvideo', //视频
                            'justifyleft', //居左对齐
                            'justifyright', //居右对齐
                            'justifycenter', //居中对齐
                            'justifyjustify', //两端对齐
                            'forecolor', //字体颜色
                            'fullscreen', //全屏
                            // 'insertframe', //插入Iframe
                            'imagecenter' //居中
                        ]
                    ],
                    initialFrameWidth: '100%', //初始化编辑器宽度,默认1000
                    initialFrameHeight: 320, //初始化编辑器高度,默认320
                },
                query: {
                    id: this.$route.query.id || '',
                    name: '',
                    sort: '',
                    content: '', // 编辑器的内容
                },
                rules: {
                    name: [{
                        required: true,
                        message: '频道名不能为空',
                        trigger: 'blur,change'
                    }],
                    sort: [{
                        required: true,
                        message: '排序不能为空',
                        type:'number',
                        trigger: 'blur,change'
                    },{
                        validator: this.$.v.positive,
                        trigger: 'blur,change',
                        message: '排序是不能小于0的数字',
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
                }
            };
        },
        created() {
            _self = this;
            _self.getDetail();
        },
        methods: {
            input(editorContent) {
                console.log(1);
                this.query.content = editorContent.content;
                setTimeout(function () {
                    _self.$refs.query.validateField('content');
                }, 0)
            },
            getDetail() {
                if (this.$route.query.id) {
                    this.$http.get('channel/info', {
                            params: {
                                id: _self.$route.query.id
                            }
                        })
                        .then(function (res) {
                            var d = res.data.data;
                            _self.query = d;
                            _self.startContent = d.content;
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post(`channel/${_self.query.id?"update":"create"}`, _self.query)
                            .then(function (res) {
                                if (res.codeFlag) {
                                    _self.$message({
                                        type: 'success',
                                        message: res.data.description
                                    });
                                    if(!_self.query.id){
                                        _self.$back('/site/channel/list');
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
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 百度编辑器方法
            input(editorContent) {
                this.query.content = editorContent.content
            },
            // 上传
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
        },
        components: {
            Ueditor
        }
    }

</script>
