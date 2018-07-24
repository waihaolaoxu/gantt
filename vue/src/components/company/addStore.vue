<template>
    <div class="form-page">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <span class="is-active el-tabs__item fl">{{label}}</span>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b">
            <el-form :model="query" :rules="rules" ref="query" label-width="100px" class="demo-ruleForm" size="medium">
                <el-form-item label="封面图：" prop="cover">
                    <el-upload class="avatar-uploader" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess" name='file'
                        :data='uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding">
                        <img v-if="query.cover" :src="query.cover+'!zs'" class="avatar cover">
                        <span v-if="query.cover" class="el-prompting">点击更换</span>
                        <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="门店名称：" prop="name">
                    <el-input v-model="query.name" placeholder="请输入门店名称"></el-input>
                </el-form-item>
                <city-options label="省/市/区：" :province='query.province_id' :city='query.city_id' @syncProvince='provinceChange' @syncCity='cityChange'
                    props='province_id,city_id'></city-options>
                <el-form-item label="门店地址：" prop="address">
                    <el-input v-model="query.address" placeholder="请输入门店地址"></el-input>
                </el-form-item>
                <el-form-item label="门店电话：" prop="telephone">
                    <el-input v-model="query.telephone" placeholder="请输入门店电话"></el-input>
                </el-form-item>
                <el-form-item label="门店手机：" prop="phone">
                    <el-input v-model="query.phone" placeholder="请输入门店手机"></el-input>
                </el-form-item>
                <el-form-item label="营业时间：" required="">
                    <el-col :span="8">
                        <el-form-item prop="start_time">
                            <el-time-select placeholder="起始时间" v-model="query.start_time" :editable=false :picker-options="{
                                    start: '01:00',
                                    step: '01:00',
                                    end: '23:00'
                                }">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="end_time">
                            <el-time-select placeholder="结束时间" v-model="query.end_time" :editable=false :picker-options="{
                                    start: '01:00',
                                    step: '01:00',
                                    end: '23:00'
                                }">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input v-model="query.sort" placeholder="排序"></el-input>
                </el-form-item>
                <el-form-item label="是否显示：">
                    <el-radio v-model.number="query.is_show" :label="1">是</el-radio>
                    <el-radio v-model.number="query.is_show" :label="2">否</el-radio>
                </el-form-item>
                <map-search labCons="查找地标:" @getposition="getPositionValue" :j="j" :w="w"></map-search>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                    <!-- <el-button @click="resetForm('query')">重置</el-button> -->
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    import {
        uploadLoading
    } from '@/mixins/index';
    import mapSearch from "./mapSearch";
    import cityOptions from '@/components/block/city';
    var _self;
    export default {
        data() {
            return {
                label: !this.$route.query.id ? '添加门店地址' : '编辑门店地址',
                id: this.$route.query.id,
                proviceData: [],
                cityData: [],
                value: '',
                j: '',
                w: '',
                query: {
                    name: '',
                    cover:'',
                    province_id: '',
                    city_id: '',
                    address: '',
                    longitude: 116.413384, // 经度
                    latitude: 39.910925, // 维度
                    telephone: '',
                    phone: "",
                    start_time: "",
                    end_time: '',
                    sort: 0,
                    is_show: 1

                },
                uploadData: {
                    module: 'store',
                    type: 'image'
                },
                rules: {
                    cover: [{
                        required: true,
                        message: '门店封面图不能为空',
                        trigger: 'blur,change'
                    }],
                    name: [{
                        required: true,
                        message: '门店名称不能为空',
                        trigger: 'blur,change'
                    }],
                    province_id: [{
                        required: true,
                        type:'number',
                        message: '选择省不能为空',
                        trigger: 'blur,change'
                    }],
                    city_id: [{
                        required: true,
                        type:'number',
                        message: '选择市不能为空',
                        trigger: 'blur,change'
                    }],
                    address: [{
                        required: true,
                        message: '门店地址不能为空',
                        trigger: 'blur,change'
                    }],
                    telephone: [{
                            required: true,
                            message: '门店电话不能为空',
                            trigger: 'blur,change'
                        }
                    ],
                    phone: [{
                            required: true,
                            message: '门店手机不能为空',
                            trigger: 'blur,change'
                        },
                        {
                            validator: this.$.v.tel,
                            trigger: 'blur,change'
                        }
                    ],
                    start_time: [{
                        required: true,
                        message: '开始时间不能为空',
                        trigger: 'blur,change'
                    }],
                    end_time: [{
                        required: true,
                        message: '结束时间不能为空',
                        trigger: 'blur,change'
                    }]
                }
            };
        },
        mixins: [uploadLoading],
        created() {
            _self = this;
            console.log(this.j)
            if (this.$route.query.id) { // 当前为编辑门店页
                _self.$http.get('store/info', {
                        params: {
                            id: _self.$route.query.id
                        }
                    })
                    .then(function (res) {
                        if (res.codeFlag) {
                            res.d.province_id = res.d.province;
                            res.d.city_id = res.d.city;
                            _self.query = res.d;
                        }
                        _self.j = res.data.data.longitude;
                        _self.w = res.data.data.latitude;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
        methods: {
            submitForm(formName) {
                console.log('提交的数据：',this.query)
                var _self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _self.$http.post(`store/${_self.id?'update':'create'}`, _self.query)
                            .then(function (res) {
                                if (res.codeFlag) {
                                    _self.$message({
                                        message: _self.id ? "修改成功！" : "添加成功！",
                                        type: 'success'
                                    });
                                    if(!_self.id){
                                        _self.$back('list');
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
            provinceChange(v) {
                this.query.province_id = v;
                setTimeout(() => {
                    this.$refs.query.validateField('city_id');
                })
            },
            cityChange(v) {
                this.query.city_id = v;
            },
            // 获取经纬度
            getPositionValue(longitude, latitude) {
                console.log("父组件位置：", )
                this.query.longitude = longitude // 经度
                this.query.latitude = latitude // 维度
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 上传
            handleAvatarSuccess(res, file) {
                this.query.cover = res.data[0].preview;
                // this.imageUrl = res.data[0].preview;
                this.uploadCloseLoding();
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
            }
        },
        components: {
            mapSearch,
            cityOptions
        }
    }

</script>
