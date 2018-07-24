<template>
    <div class="form-page">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">添加动态模板数据</div>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b">
            <el-form :model="query" :rules="rules" ref="query" label-width="130px" class="demo-ruleForm" size="medium">
                <el-form-item label="使用说明：">
                    <span v-if="message" v-html="message"></span>
                </el-form-item>
                <el-form-item label="所属装修公司：">
                    <el-input v-model="site_name" placeholder="请输入所属装修公司" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="所属页：">
                    <el-input v-model="page_name" placeholder="请输入所属页" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="所属模块名：">
                    <el-input v-model="name" placeholder="请输入所属模块名" :disabled="true"></el-input>
                </el-form-item>
                <div class="addPics">
                    <el-form-item label="Title：" prop="title">
                        <el-input v-model="query.title" placeholder="请输入Title"></el-input>
                    </el-form-item>
                    <el-form-item label="url：" prop="url">
                        <el-input v-model="query.url" placeholder="请输入url"></el-input>
                    </el-form-item>
                    <el-form-item label="图片：">
                        <el-upload class="avatar-uploader pr" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess" name='file'
                            :data='$.uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding">
                            <img v-if="query.pic" :src="query.pic" class="avatar cover">
                            <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                            <span class="no-select picDelete pa full-w" v-if="query.pic" @click.stop='deletePic("pic")'>删除</span>
                        </el-upload>
                        <!-- <p class="el-prompting" v-if="message">{{message}}</p> -->
                    </el-form-item>
                    <el-form-item label="描述：" prop="des">
                        <el-input type="textarea" v-model="query.des" :rows="6" placeholder="请输入描述"></el-input>
                    </el-form-item>
                    <el-form-item label="数据排序值：" prop="sort">
                        <el-input v-model="query.sort" placeholder="请输入数据排序值"></el-input>
                    </el-form-item>
                </div>
                <template v-if="showMore">
                    <div class="addPics">
                        <el-form-item label="Title1：">
                            <el-input v-model="query.title1" placeholder="请输入Title1"></el-input>
                        </el-form-item>
                        <el-form-item label="url1：">
                            <el-input v-model="query.url1" placeholder="请输入url1"></el-input>
                        </el-form-item>
                        <el-form-item label="图片：">
                            <el-upload class="avatar-uploader pr" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess1" name='file'
                                :data='$.uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding">
                                <img v-if="query.pic1" :src="query.pic1" class="avatar cover">
                                <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                                <span class="no-select picDelete pa full-w" v-if="query.pic1" @click.stop='deletePic("pic1")'>删除</span>
                            </el-upload>
                            <!-- <p class="el-prompting" v-if="message">{{message}}</p> -->
                        </el-form-item>
                        <el-form-item label="描述1：">
                            <el-input type="textarea" v-model="query.des1" :rows="6" placeholder="请输入描述1"></el-input>
                        </el-form-item>
                        <el-form-item label="数据排序值1：" prop="sort1">
                            <el-input v-model="query.sort1" placeholder="请输入数据排序值"></el-input>
                        </el-form-item>
                    </div>
                    <div class="addPics">
                        <el-form-item label="Title2：">
                            <el-input v-model="query.title2" placeholder="请输入Title2"></el-input>
                        </el-form-item>
                        <el-form-item label="url2：">
                            <el-input v-model="query.url2" placeholder="请输入url2"></el-input>
                        </el-form-item>
                        <el-form-item label="图片：">
                            <el-upload class="avatar-uploader pr" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess2" name='file'
                                :data='$.uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding">
                                <img v-if="query.pic2" :src="query.pic2" class="avatar cover">
                                <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                                <span class="no-select picDelete pa full-w" v-if="query.pic2" @click.stop='deletePic("pic2")'>删除</span>
                            </el-upload>
                            <!-- <p class="el-prompting" v-if="message">{{message}}</p> -->
                        </el-form-item>
                        <el-form-item label="描述2：">
                            <el-input type="textarea" v-model="query.des2" :rows="6" placeholder="请输入描述2"></el-input>
                        </el-form-item>
                        <el-form-item label="数据排序值2：" prop="sort2">
                            <el-input v-model="query.sort2" placeholder="请输入数据排序值2"></el-input>
                        </el-form-item>
                    </div>
                </template>
                <el-form-item>
                    <el-button size="mini" style="margin:15px 0;" @click="showMoreFn">{{btnName}}
                        <i class="el-icon-upload" :class="iconClass"></i>
                    </el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                    <el-button @click="resetForm('query')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .addPics {
        background-color: rgba(0, 0, 0, 0.02);
        border: 1px dashed rgba(0, 0, 0, 0.02);
        padding: 10px;
        padding-left: 0;
        border-radius: 3px;
        margin-bottom: 10px;
    }

    .picDelete {
        color: #fff;
        text-align: center;
        background-color: rgba(255, 0, 0, 0.5);
        padding: 2px 0;
        z-index: 10;
        bottom: 0;
        left: 0;
        width: 100%;
    }

</style>

<script>
    import {
        uploadLoading
    } from '@/mixins/index';
    var _self;
    export default {
        mixins: [uploadLoading],
        data() {
            return {
                name: this.$route.query.name,
                page_name: this.$route.query.page_name,
                site_name: this.$route.query.site_name,
                query: {
                    id:this.$route.query.id,
                    t_id: this.$route.query.t_id,
                    title: '',
                    pic: '',
                    des: '',
                    url: '',
                    sort: '',
                    title1: '',
                    pic1: '',
                    des1: '',
                    title2: '',
                    pic2: '',
                    des2: '',
                },
                showMore: false,
                btnName: '展开',
                iconClass: "el-icon-arrow-down",
                message:'',
                rules: {
                    title: [{
                            required: true,
                            message: 'Title不能为空',
                            trigger: 'blur,change'
                        }

                    ]
                }
            };
        },
        created() {
            _self = this;
            console.log('asasasas',this.$route.query)
            if (this.$route.query.id) {
                var that = this;
                this.$http.get('modular/data/info', {
                        params: {
                            id: this.$route.query.id
                        }
                    })
                    .then(function (res) {
                        for (let attr in that.query) {
                            for (let attr1 in res.data.data) {
                                if (attr == attr1 && res.data.data[attr1]) {
                                    that.query[attr] = res.data.data[attr1].toString();
                                }
                            }
                        }
                    })
            }
            this.message = this.$route.query.message;
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _self.$http.post(`modular/data/${_self.query.id?"update":"create"}`, _self.query).then(res => {
                            // console.log(res);
                            if (res.codeFlag) {
                                _self.$message({
                                    type: 'success',
                                    message: res.data.description
                                });
                                if(!_self.query.id){
                                    _self.$back();
                                }
                            }
                        });
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
            deletePic(v) {
                _self.query[v] = '';
            },
            //      上传
            handleAvatarSuccess(res, file) {
                _self.query.pic = res.data[0].preview;
                _self.uploadCloseLoding();
            },
            handleAvatarSuccess1(res, file) {
                _self.query.pic1 = res.data[0].preview;
                _self.uploadCloseLoding();
            },
            handleAvatarSuccess2(res, file) {
                _self.query.pic2 = res.data[0].preview;
                _self.uploadCloseLoding();
            },
            showMoreFn() {
                this.showMore = !this.showMore;
                this.btnName == '展开' ? this.btnName = '收起' : this.btnName = '展开'
                this.iconClass == 'el-icon-arrow-down' ? this.iconClass = 'el-icon-arrow-up' : this.iconClass =
                    'el-icon-arrow-down'

            }
        },
        components: {}
    }

</script>
