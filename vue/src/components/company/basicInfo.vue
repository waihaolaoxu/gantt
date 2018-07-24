<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">基本信息</div>
                </div>
            </div>
        </div>
        <div class="list-body">
            <el-form :model="query" :rules="rules" ref="query" label-width="100px" class="demo-ruleForm" size="medium">
                <el-form-item label="公司名称：" prop="name">
                    <el-input v-model="query.name" placeholder="请输入公司名称" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="公司简称：" prop="short_name">
                    <el-input v-model="query.short_name" placeholder="请输入公司简称"></el-input>
                </el-form-item>
                <el-form-item label="公司电话：" prop="phone">
                    <el-input v-model="query.phone" placeholder="请输入公司电话"></el-input>
                </el-form-item>
                <el-form-item label="营业时间：" required>
                    <el-col :span="8">
                        <el-form-item prop="start_time">
                            <el-time-select placeholder="起始时间" v-model="query.start_time" :picker-options="{
                                start: '01:00',
                                step: '01:00',
                                end: '23:00',
                              }">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                    <el-col class="fl" style='width:auto;padding-right:10px;'>
                        --至--</el-col>

                    <el-col :span="8">
                        <el-form-item prop="end_time">
                            <el-time-select placeholder="结束时间" v-model="query.end_time" :picker-options="{
                                start: '01:00',
                                step: '01:00',
                                end: '23:00',
                              }">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="logo：" prop="logo">
                    <el-upload class="avatar-uploader" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess" name='file'
                        :data='uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding">
                        <img v-if="query.logo" :src="query.logo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p class="el-prompting">请上传1：1比例图片</p>
                    <p class="el-prompting">文件格式GIF、JPG、JPEG、PNG，文件大小200K以内，建议尺寸至少800PX*800PX</p>
                </el-form-item>
                <el-form-item label="公司地址：" prop="address">
                    <el-input v-model="query.address" placeholder="请输入公司地址"></el-input>
                </el-form-item>
                <map-search labCons="地图位置:" @getposition="getPositionValue" :j="query.longitude" :w="query.latitude" v-if='map'></map-search>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import mapSearch from "./mapSearch";
    var uLoading, _self;
    export default {
        data() {
            // 公司电话检查规则(公共方法)
            let verifyMobile = (rule, value, callback) => {
                const reg = /^1[34578]\d{9}$/
                const reg1 = /^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/
                if (!reg.test(value) && !reg1.test(value)) {
                    callback(new Error('请输入正确的公司电话'))
                } else {
                    callback()
                }
            }
            return {
                map:false,
                query: {
                    name: '',
                    short_name: '',
                    phone: '',
                    start_time: '',
                    end_time: '',
                    logo: '',
                    address: "",
                    longitude: "",
                    latitude: ""
                },
                uploadData: {
                    module: 'store',
                    type: 'image'
                },
                data: [],
                rules: {
                    name: [{
                        required: true,
                        message: '请输入公司名称',
                        trigger: 'blur,change'
                    }],
                    short_name: [{
                        required: true,
                        message: '请选择公司简称',
                        trigger: 'blur,change'
                    }],
                    phone: [{
                        required: true,
                        message: '请输入公司电话',
                        trigger: 'blur,change'
                    }],
                    start_time: [{
                        required: true,
                        message: '请选择开始时间',
                        trigger: 'blur,change'
                    }],
                    end_time: [{
                        required: true,
                        message: '请选择结束时间',
                        trigger: 'blur,change'
                    }],
                    logo: [{
                        required: true,
                        message: '请上传logo图片',
                        trigger: 'blur,change'
                    }],
                    address: [{
                        required: true,
                        message: '请输入公司地址',
                        trigger: 'blur,change'
                    }]
                },
            };
        },
        created() {
            _self = this;
            this.getData();
        },
        methods: {
            getData() {
                this.$http.get('info')
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.query = res.d;
                            _self.map = true;
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            },
            submitForm(formName) {
                var _self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('info/update', this.query)
                            .then(function (res) {
                                if(res.codeFlag){
                                     _self.$message({
                                        message: '基本信息修改成功',
                                        type: 'success'
                                    });
                                     _self.getData()
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
            // 获取经纬度
            getPositionValue(longitude, latitude) {
                console.log("父组件位置：", )
                this.query.longitude = longitude // 经度
                this.query.latitude = latitude // 维度
            },
            //  上传
            handleAvatarSuccess(res, file) {
                this.query.logo = file.response.data[0].preview;
                this.uploadCloseLoding();
            },
            beforeAvatarUploadLoding(file) {
                var imgType = true;
                const isJPG = file.name.split('.')[1] === 'jpeg';
                const isJPEG = file.name.split('.')[1] === 'jpg';
                const isPNG = file.name.split('.')[1] === 'png';
                const isGIF = file.name.split('.')[1] === 'gif';
                const isLt2M = file.size / 1024 / 200 <= 1;
                // console.log(isJPG,isJPEG,isPNG,isGIF)

                if (isJPG || isJPEG || isPNG || isGIF) {} else {
                    imgType = false;
                    this.$message.error('上传头像图片只能是 JPG,JPEG,PNG,GIF 格式!');
                    return imgType;
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 200K!');
                }
                if (imgType && isLt2M) {
                    uLoading = this.$loading({
                        background: 'rgba(255,255,255,.2)',
                        text: '拼命上传中...'
                    });
                }
                return imgType && isLt2M;
            },
            uploadCloseLoding() {
                uLoading.close();
            }
        },
        components: {
            mapSearch
        }
    }

</script>
